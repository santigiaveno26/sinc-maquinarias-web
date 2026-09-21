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

tabButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab, false));
  // Navegacion por teclado: flechas izquierda/derecha entre pestañas (patron ARIA tabs)
  btn.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % tabButtons.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + tabButtons.length) % tabButtons.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabButtons.length - 1;
    tabButtons[next].focus();
    activateTab(tabButtons[next].dataset.tab, false);
  });
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
function getValueByPath(data, dotted) {
  const path = dotted.split('.');
  let value = data;
  for (const part of path) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  return value;
}

fetch('assets/content.json', { cache: 'no-store' })
  .then(res => (res.ok ? res.json() : null))
  .then(data => {
    if (data) {
      document.querySelectorAll('[data-key]').forEach(el => {
        const value = getValueByPath(data, el.getAttribute('data-key'));
        if (typeof value === 'string' && value.trim() !== '') {
          el.textContent = value;
        }
      });
    }
    initChatWidget(data);
  })
  .catch(() => {
    /* Si algo falla al cargar/parsear content.json, se ignora
       silenciosamente y queda el texto por defecto del HTML. El widget
       de chat igual se inicializa (sin bot_url, muestra el placeholder). */
    initChatWidget(null);
  });

/* Header: sombra al scrollear, para separarlo visualmente del contenido */
const siteHeader = document.getElementById('siteHeader');
if (siteHeader) {
  const onHeaderScroll = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onHeaderScroll();
  window.addEventListener('scroll', onHeaderScroll, { passive: true });
}

/* Resaltar en el menu la seccion que se esta viendo (scrollspy) */
const navAnchorLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const spySections = navAnchorLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && spySections.length) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navAnchorLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  spySections.forEach(sec => spyObserver.observe(sec));
}

/* Volver arriba: aparece despues de bajar un poco */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  const onBackToTopScroll = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 700);
  };
  onBackToTopScroll();
  window.addEventListener('scroll', onBackToTopScroll, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Carrusel de casos: flechas para desktop */
const casosCarousel = document.getElementById('casosCarousel');
const casosPrev = document.getElementById('casosPrev');
const casosNext = document.getElementById('casosNext');
if (casosCarousel && casosPrev && casosNext) {
  const scrollByCard = (dir) => {
    const card = casosCarousel.querySelector('.caso-card');
    const amount = card ? card.getBoundingClientRect().width + 1 : 260;
    casosCarousel.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  casosPrev.addEventListener('click', () => scrollByCard(-1));
  casosNext.addEventListener('click', () => scrollByCard(1));

  const updateCarouselArrows = () => {
    const tolerance = 4; // el padding del contenedor deja el reposo en ~2px, no en 0
    const max = casosCarousel.scrollWidth - casosCarousel.clientWidth;
    casosPrev.disabled = casosCarousel.scrollLeft <= tolerance;
    casosNext.disabled = casosCarousel.scrollLeft >= max - tolerance;
  };
  updateCarouselArrows();
  casosCarousel.addEventListener('scroll', updateCarouselArrows, { passive: true });
  window.addEventListener('resize', updateCarouselArrows);
}

/**
 * Widget de chat (botón flotante + panel)
 * -----------------------------------------------------------------
 * Abre un panel con el asistente embebido por iframe, apuntando a
 * `${chat.bot_url}/chat` (assets/content.json). Mientras chat.bot_url
 * quede vacío — porque el bot todavía corre solo en una compu y no en
 * un servidor público — se muestra un mensaje de "en preparación" en
 * vez de un iframe roto. El iframe se crea recién la primera vez que
 * se abre el panel (no antes), para no gastar carga de más.
 */
function initChatWidget(data) {
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatPanelClose = document.getElementById('chatPanelClose');
  const chatPanelBody = document.getElementById('chatPanelBody');
  if (!chatToggle || !chatPanel || !chatPanelBody) return;

  const botUrl = (data && typeof getValueByPath(data, 'chat.bot_url') === 'string')
    ? getValueByPath(data, 'chat.bot_url').trim().replace(/\/$/, '')
    : '';

  const WPP_URL = 'https://wa.me/5493471332479?text=Hola%20SINC%20Maquinarias%2C%20quiero%20consultar%20por%20sus%20m%C3%A1quinas';
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  const txt = (key, fallback) => (data && getValueByPath(data, key)) || fallback;

  function showMessage(titulo, texto, conWhatsapp) {
    chatPanelBody.innerHTML = `
      <div class="chat-placeholder">
        <span class="icon">${ICON}</span>
        <strong></strong>
        <p></p>
      </div>`;
    const box = chatPanelBody.querySelector('.chat-placeholder');
    box.querySelector('strong').textContent = titulo;
    box.querySelector('p').textContent = texto;
    if (conWhatsapp) {
      const a = document.createElement('a');
      a.className = 'btn btn-wpp';
      a.href = WPP_URL;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = txt('chat.offline_boton', 'Escribir por WhatsApp');
      box.appendChild(a);
    }
  }

  // El bot corre en una PC local: puede estar apagado. Se consulta /health
  // (con CORS, asi un 404 del tunel caido tambien cuenta como "apagado")
  // antes de mostrar el iframe.
  async function botOnline() {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    try {
      const r = await fetch(botUrl + '/health', { signal: ctrl.signal, cache: 'no-store' });
      return r.ok;
    } catch (e) {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  let bodyBuilt = false;
  let checking = false;
  async function buildBody() {
    if (bodyBuilt || checking) return;
    if (!botUrl) {
      bodyBuilt = true;
      showMessage(txt('chat.no_configurado_titulo', 'Asistente en preparación'),
        txt('chat.no_configurado_texto', 'Muy pronto vas a poder consultarle acá directamente a nuestro asistente virtual. Mientras tanto, escribinos por WhatsApp.'), true);
      return;
    }
    checking = true;
    showMessage(txt('chat.conectando_titulo', 'Conectando…'), '', false);
    const online = await botOnline();
    checking = false;
    if (!online) {
      // No se marca bodyBuilt: al volver a abrir el panel se reintenta.
      showMessage(txt('chat.offline_titulo', 'Asistente fuera de línea'),
        txt('chat.offline_texto', 'Por el momento el asistente no está disponible. Escribinos por WhatsApp y te respondemos a la brevedad.'), true);
      return;
    }
    bodyBuilt = true;
    chatPanelBody.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = botUrl + '/chat';
    iframe.title = txt('chat.panel_titulo', 'Asistente SINC Maquinarias');
    iframe.allow = 'microphone';
    chatPanelBody.appendChild(iframe);
  }

  function openChat() {
    buildBody();
    chatPanel.hidden = false;
    chatToggle.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKeydown);
  }
  function closeChat() {
    chatPanel.hidden = true;
    chatToggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    chatToggle.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') closeChat();
  }

  chatToggle.addEventListener('click', () => {
    if (chatPanel.hidden) openChat(); else closeChat();
  });
  chatPanelClose.addEventListener('click', closeChat);

  // Cualquier botón/link con data-key de "consultar" (hero, tabs de
  // producto) también abre el mismo widget en vez de ir a WhatsApp.
  document.querySelectorAll('.js-open-chat').forEach(el => {
    el.addEventListener('click', openChat);
  });
}

/* Animacion sutil al entrar en pantalla (respeta "reducir movimiento") */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealTargets = document.querySelectorAll(
    '.step-chip, .caso-card, .benef-list li, .quote-block, .about-compact > div, .prod-hero'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));
}
