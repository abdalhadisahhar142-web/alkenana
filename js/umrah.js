/* ==========================================================
   الكنانة — Umrah page (umrah.html)
   كل المحتوى بيجي من UMRAH بـ js/data.js
   ========================================================== */
(() => {
  'use strict';
  const { $, $$, pad } = K;

  const setBg = (el, src, fallback) => { el.dataset.bg = src; el.dataset.fallback = fallback || ''; };

  function renderHero() {
    setBg($('[data-umrah-bg]'), UMRAH.hero.image, UMRAH.hero.fallback);
    setBg($('[data-cta-bg]'), UMRAH.hero.image, UMRAH.hero.fallback);
    $$('[data-wa]').forEach((a) => {
      a.href = K.waLink(a.dataset.wa, 'مرحبا، بدي استفسر عن باقات العمرة');
    });
  }

  function renderPackages() {
    $('[data-packages]').innerHTML = UMRAH.packages.map((pkg, i) => `
      <article class="pkg reveal${pkg.badge ? ' pkg--featured' : ''}" style="--i:${i}">
        ${pkg.badge ? `<p class="pkg__label">${pkg.badge}</p>` : ''}
        <h3>${pkg.name}</h3>
        <p class="pkg__dur">${pkg.duration}</p>
        <p class="pkg__price">${pkg.price || 'اطلب السعر'}</p>
        <ul>${pkg.features.map((f) => `<li>${f}</li>`).join('')}</ul>
        <a class="btn${pkg.badge ? '' : ' btn--ghost'}" target="_blank" rel="noopener"
           href="${K.waLink('umrah', `مرحبا، بدي تفاصيل باقة العمرة ${pkg.name}`)}">احجز هالباقة</a>
      </article>`).join('');
  }

  function renderSteps() {
    $('[data-steps]').innerHTML = UMRAH.steps.map((s, i) => `
      <div class="step reveal" style="--i:${i}">
        <span class="step__n">الخطوة ${pad(i + 1)}</span>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </div>`).join('');
  }

  function renderDocsAndFaq() {
    $('[data-docs]').innerHTML = UMRAH.documents.map((d) => `<li>${d}</li>`).join('');
    $('[data-faq]').innerHTML = UMRAH.faq.map((f) => `
      <details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    K.renderLayout('umrah');
    renderHero();
    renderPackages();
    renderSteps();
    renderDocsAndFaq();
    K.initNav();
    K.loadImages();
    K.initReveal();
    K.initParallax();
  });
})();
