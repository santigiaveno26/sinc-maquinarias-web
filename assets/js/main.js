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
