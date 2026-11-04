/* ==========================================================
   الكنانة — Home page (index.html)
   hero slider · program cards · parallax · video modal
   ========================================================== */
(() => {
  'use strict';
  const { $, $$, reduceMotion, pad } = K;

  /* Play an "out" animation, swap content, then play "in" */
  function swapAnimated(el, update) {
    el.classList.remove('is-in');
    el.classList.add('is-out');
    setTimeout(() => {
      update();
      el.classList.add('no-anim');
      el.classList.remove('is-out');
      void el.offsetWidth; // reflow so the next transition starts from the hidden state
      el.classList.remove('no-anim');
      el.classList.add('is-in');
    }, reduceMotion ? 0 : 600);
  }

  /* ---------- Hero slider ---------- */
  function initHero() {
    const hero = $('.hero');
    if (!hero || !HERO_SLIDES.length) return;

    const bgWrap = $('.hero__bgs', hero);
    const title = $('.hero__title', hero);
    const t1 = $('.hero__t1', hero);
    const t2 = $('.hero__t2', hero);
    const points = $('.hero__points', hero);
    const pagerList = $('.hero__pager ul', hero);
    const progress = $('.hero__progress', hero);
    const duration = SITE.heroInterval || 7000;

    hero.style.setProperty('--dur', `${duration}ms`);

    const bgs = HERO_SLIDES.map((slide) => {
      const bg = document.createElement('div');
      bg.className = 'hero__bg';
      bgWrap.append(bg);
      K.resolveImage(slide.image, slide.fallback).then((url) => {
        bg.style.backgroundImage = `url("${url}")`;
      });
      return bg;
    });

    const items = HERO_SLIDES.map((slide, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" aria-label="${slide.title2}"><span class="ln"></span><b>${pad(i + 1)}</b></button>`;
      li.firstElementChild.addEventListener('click', () => go(i));
      pagerList.append(li);
      return li;
    });

    let current = -1;
    let timer;

    const renderText = (slide) => {
      t1.textContent = slide.title1;
      t2.textContent = slide.title2;
    };
    const renderPoints = (slide) => {
      points.innerHTML = slide.points
        .map((p) => `<p><strong>${p.name}</strong>${p.text}</p>`)
        .join('');
    };

    function restartProgress() {
      progress.classList.remove('is-running');
      void progress.offsetWidth;
      if (!reduceMotion) progress.classList.add('is-running');
    }

    function schedule() {
      clearTimeout(timer);
      if (!reduceMotion && !document.hidden) timer = setTimeout(() => go(current + 1), duration);
    }

    function go(index) {
      const n = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
      if (n === current) return;
      const firstRun = current === -1;
      current = n;
      const slide = HERO_SLIDES[n];

      bgs.forEach((bg, i) => bg.classList.toggle('is-active', i === n));
      items.forEach((li, i) => {
        li.classList.toggle('is-active', i === n);
        li.style.setProperty('--d', Math.abs(i - n));
      });
      const itemH = items[0].offsetHeight;
      pagerList.style.transform = `translateY(${-(n * itemH + itemH / 2)}px)`;

      if (firstRun) {
        renderText(slide);
        renderPoints(slide);
        requestAnimationFrame(() => {
          title.classList.add('is-in');
          setTimeout(() => points.classList.add('is-in'), 350);
        });
      } else {
        swapAnimated(title, () => renderText(slide));
        swapAnimated(points, () => renderPoints(slide));
      }

      restartProgress();
      schedule();
    }

    $('.hero__next', hero).addEventListener('click', () => go(current + 1));

    // Keyboard (RTL: left arrow = next)
    document.addEventListener('keydown', (e) => {
      if ($('.modal.is-open')) return;
      if (hero.getBoundingClientRect().bottom < 0) return;
      if (e.key === 'ArrowLeft') go(current + 1);
      if (e.key === 'ArrowRight') go(current - 1);
    });

    // Touch swipe
    let startX = 0;
    hero.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(current + (dx > 0 ? 1 : -1));
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(timer);
      else { restartProgress(); schedule(); }
    });

    go(0);
  }

  /* ---------- Program cards ---------- */
  function initPrograms() {
    const wrap = $('.cards');
    if (!wrap) return;
    wrap.innerHTML = PROGRAMS.map(K.cardHTML).join('');
    K.loadImages(wrap);
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    const bg = $('.about__bg');
    if (!bg || reduceMotion) return;
    const host = bg.parentElement;
    let ticking = false;

    const update = () => {
      const r = host.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const progress = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        bg.style.setProperty('--py', `${progress * -70}px`);
      }
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Video modal ---------- */
  function initVideo() {
    const modal = $('.modal');
    if (!modal) return;
    const frame = $('.modal__frame', modal);
    const empty = $('.modal__empty', modal);
    let lastFocus;

    const youtubeId = (url) => (url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/) || [])[1];

    function open() {
      lastFocus = document.activeElement;
      frame.innerHTML = '';
      empty.hidden = true;
      const url = SITE.promoVideo;

      if (!url) {
        empty.hidden = false;
      } else if (/youtube\.com|youtu\.be/.test(url)) {
        frame.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId(url)}?autoplay=1&rel=0"
          allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="فيديو"></iframe>`;
      } else {
        const video = document.createElement('video');
        Object.assign(video, { src: url, controls: true, autoplay: true, playsInline: true });
        video.addEventListener('error', () => { video.remove(); empty.hidden = false; });
        frame.append(video);
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      K.lockScroll(true);
      $('.modal__close', modal).focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      K.lockScroll(false);
      setTimeout(() => { frame.innerHTML = ''; }, 400);
      if (lastFocus) lastFocus.focus();
    }

    $$('[data-video]').forEach((btn) => btn.addEventListener('click', open));
    $$('[data-close]', modal).forEach((btn) => btn.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    K.renderLayout('programs');
    initHero();
    K.initNav();
    initPrograms();
    K.loadImages();
    initParallax();
    initVideo();
    K.initReveal();
  });
})();
