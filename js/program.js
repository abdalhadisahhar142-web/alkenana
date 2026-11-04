/* ==========================================================
   الكنانة — Program page (program.html?p=<id>)
   كل المحتوى بيجي من PROGRAMS بـ js/data.js
   ========================================================== */
(() => {
  'use strict';
  const { $, $$, reduceMotion } = K;

  /* Pick the program from the URL, or the first one */
  function getProgram() {
    const id = new URLSearchParams(location.search).get('p');
    const pages = PROGRAMS.filter((p) => !p.link);
    return pages.find((p) => p.id === id) || pages[0];
  }

  const hideSection = (name) => {
    const s = $(`[data-section="${name}"]`);
    if (s) s.hidden = true;
  };

  const photo = (p, i) => (p.gallery && p.gallery[i]) || { src: p.image, fallback: p.fallback };
  const img = (g, alt = '') => `<img alt="${alt}" loading="lazy" data-src="${g.src}" data-fallback="${g.fallback || ''}">`;
  const setBg = (el, g) => { el.dataset.bg = g.src; el.dataset.fallback = g.fallback || ''; };

  /* ---------- Hero ---------- */
  function renderHero(p) {
    document.title = `${p.name} | ${SITE.name}`;
    $$('[data-field]').forEach((el) => { el.textContent = p[el.dataset.field] || ''; });
    setBg($('[data-cover]'), photo(p, 0));

    const meta = [
      ['المدة', p.duration],
      ['المواعيد', p.dates],
      ['السعر', p.price || 'اطلب السعر'],
    ].filter(([, v]) => v);
    $('[data-meta]').innerHTML = meta.map(([k, v]) => `<li><small>${k}</small><b>${v}</b></li>`).join('');

    const book = K.waLink(p.whatsapp, `مرحبا، بدي احجز برنامج ${p.name}${p.dates ? ` (${p.dates})` : ''}`);
    $$('[data-book]').forEach((a) => { a.href = book; });
  }

  /* ---------- Reasons + diamonds ---------- */
  function renderReasons(p) {
    if (!p.reasons || !p.reasons.length) return hideSection('reasons');

    $('[data-reasons]').innerHTML = p.reasons
      .map((r) => `<li class="reveal"><span>${r}</span></li>`)
      .join('');

    // Each diamond: photo index (or 'line' for an outline) and parallax speed
    const layout = {
      a: [[1, -0.05], [2, 0.06], ['line', 0.1]],
      b: [[3, 0.04], [4, -0.07], [0, -0.03], ['line', 0.09]],
    };
    Object.entries(layout).forEach(([side, items]) => {
      $(`[data-diamonds="${side}"]`).innerHTML = items.map(([which, speed]) => (
        which === 'line'
          ? `<div class="dia" data-speed="${speed}"><span class="dia__line"></span></div>`
          : `<div class="dia" data-speed="${speed}"><div class="dia__img">${img(photo(p, which), p.name)}</div></div>`
      )).join('');
    });
  }

  /* ---------- Itinerary ---------- */
  function renderRoute(p) {
    if (!p.itinerary || !p.itinerary.length) return hideSection('itinerary');

    const places = [...new Set(p.itinerary.map((s) => s.place))];
    $('[data-route-lead]').innerHTML =
      `خططنالك برنامج سهل ومريح لمدة ${p.duration || 'عدة أيام'} ب${p.name}. ` +
      `رح تزور: <span class="hl">${places.join('، ')}</span>.`;

    $('.route__line').insertAdjacentHTML('beforeend', p.itinerary.map((s) => {
      const pics = (s.images && s.images.length ? s.images : [0]).slice(0, 2);
      return `
        <article class="stop">
          <div class="stop__label">
            <small>${s.days.includes('–') ? 'الأيام' : 'اليوم'} ${s.days}</small>
            <h3>${s.place}</h3>
            <p>${s.text}</p>
          </div>
          <span class="stop__dot" aria-hidden="true"></span>
          <div class="stop__media">
            ${pics.map((i, n) => `<figure${n ? ' data-speed="-0.05"' : ''}>${img(photo(p, i), s.place)}</figure>`).join('')}
          </div>
        </article>`;
    }).join(''));
  }

  /* ---------- Included ---------- */
  function renderIncluded(p) {
    if (!p.included || !p.included.length) return hideSection('included');
    setBg($('[data-included-bg]'), photo(p, 2));

    $('[data-included]').innerHTML = p.included.map((item, i) => `
      <div class="inc reveal" style="--i:${i}">
        <div class="inc__head">${K.ICONS[item.icon] || K.ICONS.star}<span>${item.title}</span></div>
        <p>${item.text}</p>
      </div>`).join('');

    const ex = $('[data-excluded]');
    if (p.excluded && p.excluded.length) ex.innerHTML = `<b>ما بيشمل:</b> ${p.excluded.join('، ')}`;
    else ex.hidden = true;
  }

  /* ---------- Other programs ---------- */
  function renderOthers(p) {
    const others = PROGRAMS.filter((x) => x.id !== p.id).slice(0, 3);
    if (!others.length) return hideSection('others');
    $('[data-others]').innerHTML = others.map(K.cardHTML).join('');
  }

  /* Timeline line fills as you scroll through the stops */
  function initRouteProgress() {
    const lineEl = $('.route__line');
    const fill = $('.route__track span');
    if (!lineEl || !fill) return;
    if (reduceMotion) { fill.style.setProperty('--p', 1); return; }
    let ticking = false;
    const update = () => {
      const r = lineEl.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      fill.style.setProperty('--p', progress.toFixed(3));
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const p = getProgram();
    K.renderLayout('programs');
    renderHero(p);
    renderReasons(p);
    renderRoute(p);
    renderIncluded(p);
    setBg($('[data-cta-bg]'), photo(p, 1));
    renderOthers(p);
    K.initNav();
    K.loadImages();
    K.initReveal();
    K.initParallax();
    initRouteProgress();
  });
})();
