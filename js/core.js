/* ==========================================================
   الكنانة — Shared core (كل الصفحات بتستخدمه)
   helpers · smooth scroll · nav · footer · cards · reveal
   ========================================================== */
window.K = (() => {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');

  const waLink = (key, text = '') => {
    const number = SITE.whatsapp[key] || SITE.whatsapp.programs;
    return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  };

  const programUrl = (p) => p.link || `program.html?p=${p.id}`;

  /* ---------- Images: local first, online fallback ---------- */
  const resolveImage = (src, fallback) =>
    new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(src);
      probe.onerror = () => resolve(fallback || src);
      probe.src = src;
    });

  function loadImages(root = document) {
    $$('img[data-src]', root).forEach((img) => {
      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      resolveImage(img.dataset.src, img.dataset.fallback).then((url) => { img.src = url; });
      img.removeAttribute('data-src');
    });
    $$('[data-bg]', root).forEach((el) => {
      resolveImage(el.dataset.bg, el.dataset.fallback).then((url) => {
        el.style.backgroundImage = `url("${url}")`;
      });
      el.removeAttribute('data-bg');
    });
  }

  /* ---------- Icons (line style) ---------- */
  const line = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICONS = {
    facebook: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.2V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>',
    messenger: '<svg viewBox="0 0 24 24"><path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2V22l3-1.6c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 13-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    // Used by "what's included" cards — pick one by name in data.js
    hotel: line('<path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-5h6v5"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 13h.01M12 13h.01M16 13h.01"/>'),
    plane: line('<path d="M10.5 13.5 3 11l1.5-1.5 7 1 4-4.5c1-1 2.6-1.4 3.5-.5s.5 2.5-.5 3.5l-4.5 4 1 7L14 21.5l-2.5-7.5-3.5 3V19l-1.5 1-1-3-3-1L4 14.5h2l3-3"/>'),
    car: line('<path d="M5 17h14v-5l-2-5H7l-2 5v5z"/><path d="M5 12h14"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/>'),
    ticket: line('<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8z"/><path d="M13 6v12" stroke-dasharray="2 2"/>'),
    guide: line('<circle cx="12" cy="7" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>'),
    meal: line('<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 21V3c-2 0-3.5 2-3.5 5v5H17"/>'),
    visa: line('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 17h6"/>'),
    star: line('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
  };

  /* ---------- Smooth scroll (Lenis, loaded from CDN) ---------- */
  let lenis = null;

  function initSmoothScroll() {
    if (reduceMotion || typeof window.Lenis !== 'function') return;
    lenis = new window.Lenis({ duration: 1.35, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // Same-page anchors glide instead of jumping
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname) return;
      const target = url.hash === '#top' ? 0 : $(url.hash);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    });
  }

  const lockScroll = (locked) => {
    if (lenis) locked ? lenis.stop() : lenis.start();
    document.body.style.overflow = locked ? 'hidden' : '';
  };

  /* ---------- Scroll-linked parallax for [data-speed] ---------- */
  function initParallax() {
    const items = $$('[data-speed]');
    if (!items.length || reduceMotion) return;
    let ticking = false;
    const update = () => {
      const mid = innerHeight / 2;
      items.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const offset = (r.top + r.height / 2 - mid) * parseFloat(el.dataset.speed);
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Nav ---------- */
  const NAV_LINKS = [
    { id: 'programs', label: 'رحلاتنا', href: 'index.html#programs' },
    { id: 'umrah', label: 'العمرة', href: 'umrah.html' },
    { id: 'about', label: 'من نحن', href: 'index.html#about' },
    { id: 'contact', label: 'تواصل معنا', href: '#contact' },
  ];

  const brand = (extra = '') => `
    <a class="brand ${extra}" href="index.html" aria-label="${SITE.name}">
      <img src="${SITE.logoMark}" alt="" width="47" height="38">الكنانة
    </a>`;

  function renderNav(active) {
    const el = $('[data-nav]');
    if (!el) return;
    el.innerHTML = `
      ${brand()}
      <nav class="nav__links" aria-label="القائمة الرئيسية">
        ${NAV_LINKS.map((l) => `<a href="${l.href}"${l.id === active ? ' class="is-active"' : ''}>${l.label}</a>`).join('')}
      </nav>
      <span class="nav__line" aria-hidden="true"><span class="nav__indicator"></span></span>`;
  }

  function initNav() {
    const lineEl = $('.nav__line');
    const indicator = $('.nav__indicator');
    const links = $$('.nav__links a');
    if (!lineEl || !links.length) return;

    const active = $('.nav__links a.is-active') || links[0];
    const place = (link) => {
      const lr = lineEl.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      indicator.style.setProperty('--x', `${r.left - lr.left}px`);
      indicator.style.setProperty('--w', `${r.width}px`);
    };

    links.forEach((link) => link.addEventListener('mouseenter', () => place(link)));
    $('.nav__links').addEventListener('mouseleave', () => place(active));
    addEventListener('resize', () => place(active));
    if (document.fonts) document.fonts.ready.then(() => place(active));
    place(active);
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const el = $('[data-footer]');
    if (!el) return;
    const services = [
      ['programs', 'برامج سياحية'],
      ['flights', 'تذاكر طيران وتأشيرات'],
      ['hotels', 'حجوزات فندقية'],
      ['umrah', 'العمرة'],
    ];
    el.innerHTML = `
      <div class="rule"><span class="rule__accent"></span></div>
      <div class="footer__inner">
        <div class="footer__brand reveal">
          <a class="brand brand--footer" href="index.html" aria-label="${SITE.name}">
            <img src="${SITE.logo}" alt="${SITE.name}" width="150" height="151">
          </a>
          <p>${SITE.bio}</p>
          <div class="socials">
            <a href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="فيسبوك">${ICONS.facebook}</a>
            <a href="${waLink('programs')}" target="_blank" rel="noopener" aria-label="واتساب">${ICONS.whatsapp}</a>
            <a href="${SITE.messenger}" target="_blank" rel="noopener" aria-label="ماسنجر">${ICONS.messenger}</a>
          </div>
        </div>

        <div class="footer__col reveal" style="--i:1">
          <h4>روابط سريعة</h4>
          <ul>
            <li><a href="index.html">الرئيسية</a></li>
            <li><a href="index.html#programs">رحلاتنا</a></li>
            <li><a href="umrah.html">العمرة</a></li>
            <li><a href="index.html#about">من نحن</a></li>
          </ul>
        </div>

        <div class="footer__col reveal" style="--i:2">
          <h4>خدماتنا</h4>
          <ul>
            ${services.map(([key, label]) => `<li><a href="${waLink(key)}" target="_blank" rel="noopener">${label}</a></li>`).join('')}
          </ul>
        </div>

        <div class="footer__col reveal" style="--i:3">
          <h4>تواصل معنا</h4>
          <ul class="contact-list">
            ${SITE.phones.map((p) => `<li><span>${p.label}</span><a href="tel:${p.number}">${p.number}</a></li>`).join('')}
          </ul>
          <p class="footer__address">${ICONS.pin}<span>${SITE.address}</span></p>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© ${new Date().getFullYear()} ${SITE.name}. جميع الحقوق محفوظة.</p>
        <a class="to-top" href="#top">للأعلى <span aria-hidden="true">↑</span></a>
      </div>`;
  }

  /* ---------- Program card (home + "other programs") ---------- */
  function cardHTML(p, i = 0) {
    const url = programUrl(p);
    return `
      <article class="card reveal" style="--i:${i}">
        <a class="card__media" href="${url}" tabindex="-1" aria-hidden="true">
          <img alt="" loading="lazy" data-src="${p.image}" data-fallback="${p.fallback || ''}">
        </a>
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
        <div class="card__body">
          <h3><a href="${url}">${p.name}</a></h3>
          <p class="card__line">${p.line}</p>
          <div class="card__more"><div>
            <ul>${p.includes.map((item) => `<li>${item}</li>`).join('')}</ul>
            <div class="card__actions">
              <a class="btn btn--ghost" href="${url}">التفاصيل</a>
              <a class="btn" href="${waLink(p.whatsapp, `مرحبا، بدي تفاصيل برنامج ${p.name}`)}" target="_blank" rel="noopener">اطلب البرنامج</a>
            </div>
          </div></div>
        </div>
      </article>`;
  }

  /* ---------- Split text into animated words ---------- */
  function splitWords(el) {
    let i = 0;
    const frag = document.createDocumentFragment();
    [...el.childNodes].forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) { frag.append(node); return; }
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const outer = document.createElement('span');
        outer.className = 'w';
        outer.innerHTML = `<span style="--i:${i++}">${part}</span>`;
        frag.append(outer);
      });
    });
    el.replaceChildren(frag);
  }

  /* ---------- Scroll reveal ---------- */
  const REVEAL = '.reveal, .reveal-side, .rule, .rule-pair, .about__title, .split-lines, .head-line, .dia, .stop';

  function initReveal(root = document) {
    const targets = $$(REVEAL, root).filter((el) => !el.classList.contains('is-in'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Layout bootstrap ---------- */
  function renderLayout(activeNav) {
    document.body.id = 'top';
    renderNav(activeNav);
    renderFooter();
    $$('[data-split]').forEach(splitWords);
    initSmoothScroll();
  }

  return {
    $, $$, reduceMotion, pad, waLink, programUrl, ICONS,
    resolveImage, loadImages, renderLayout, initNav, initParallax,
    cardHTML, initReveal, lockScroll,
  };
})();
