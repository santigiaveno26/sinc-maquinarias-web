document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Tabs de productos */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function activateTab(name, scroll) {
  tabButtons.forEach(b => b.setAttribute('aria-selected', b.dataset.tab === name ? 'true' : 'false'));
  tabPanels.forEach(p => { p.hidden = p.id !== 'tab-' + name; });
  if (scroll) {
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab, false));
});

/* Deep links: #tab-equilimpia / #tab-biorecolector abren la pestaña correcta */
function openTabFromHash() {
  const hash = location.hash.replace('#', '');
  if (hash === 'tab-equilimpia') activateTab('equilimpia', true);
  if (hash === 'tab-biorecolector') activateTab('biorecolector', true);
}
window.addEventListener('hashchange', openTabFromHash);
if (location.hash) openTabFromHash();

/**
 * Textos editables (assets/content.json)
 * -----------------------------------------------------------------
 * Todo el copy de la pagina se carga desde assets/content.json y
 * pisa el texto por defecto que ya esta escrito en el HTML.
 * Si el archivo no existe, tiene un error de formato, o falta alguna
 * clave, esta funcion NO rompe la pagina: simplemente deja el texto
 * que ya estaba escrito en el HTML como estaba. Por eso es seguro
 * editar content.json sin riesgo de "romper" el sitio.
 */
fetch('assets/content.json', { cache: 'no-store' })
  .then(res => (res.ok ? res.json() : null))
  .then(data => {
    if (!data) return;
    document.querySelectorAll('[data-key]').forEach(el => {
      const path = el.getAttribute('data-key').split('.');
      let value = data;
      for (const part of path) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }
      if (typeof value === 'string' && value.trim() !== '') {
        el.textContent = value;
      }
    });
  })
  .catch(() => {
    /* Si algo falla al cargar/parsear content.json, se ignora
       silenciosamente y queda el texto por defecto del HTML. */
  });
