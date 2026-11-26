(function () {
  var html = document.documentElement;
  var body = document.body;

  /* ---------- language ---------- */
  function setLang(lang) {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    var t = document.querySelector('title');
    if (t && t.getAttribute('data-' + lang)) t.textContent = t.getAttribute('data-' + lang);
    document.querySelectorAll('[data-ar]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang);
      if (v !== null) el.textContent = v;
    });
    var lt = document.getElementById('langToggle');
    if (lt) lt.textContent = lang === 'ar' ? 'EN' : 'عربي';
    try { localStorage.setItem('elb-lang', lang); } catch (e) {}
  }

  var start = 'ar';
  var m = location.search.match(/[?&]lang=(ar|en)/);
  if (m) start = m[1];
  else { try { start = localStorage.getItem('elb-lang') || 'ar'; } catch (e) {} }
  setLang(start);

  document.getElementById('langToggle').addEventListener('click', function () {
    setLang(html.getAttribute('lang') === 'ar' ? 'en' : 'ar');
  });

  /* ---------- preloader ---------- */
  var preloader = document.getElementById('preloader');
  var minWait = new Promise(function (r) { setTimeout(r, 1100); });
  var loaded = new Promise(function (r) {
    if (document.readyState === 'complete') r();
    else window.addEventListener('load', r);
  });
  Promise.all([minWait, loaded]).then(function () {
    preloader.classList.add('done');
    body.classList.remove('loading');
    body.classList.add('loaded');
  });

  /* ---------- mobile menu ---------- */
  var nav = document.getElementById('mainNav');
  document.getElementById('menuToggle').addEventListener('click', function () {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* ---------- scroll: header, progress, parallax, to-top ---------- */
  var header = document.querySelector('.site-header');
  var progress = document.getElementById('scrollProgress');
  var heroBg = document.querySelector('.hero-bg');
  var toTop = document.getElementById('toTop');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      header.classList.toggle('scrolled', y > 40);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      if (heroBg && y < window.innerHeight * 1.2) {
        heroBg.style.transform = 'translate3d(0,' + y * 0.28 + 'px,0)';
      }
      toTop.classList.toggle('show', y > 700);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- marquees: duplicate for seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* ---------- project filters ---------- */
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    var items = document.querySelectorAll('.g-grid .g-card');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        items.forEach(function (fig) {
          fig.classList.toggle('hide', f !== 'all' && fig.getAttribute('data-cat') !== f);
        });
      });
    });
  }

  /* ---------- WhatsApp quote form ---------- */
  var waForm = document.getElementById('waForm');
  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ar = html.getAttribute('lang') === 'ar';
      var val = function (n) { var el = waForm.elements[n]; return el ? el.value.trim() : ''; };
      var lines = ar
        ? ['طلب عرض سعر من الموقع', 'الاسم: ' + val('name'), 'الدولة: ' + val('country'), 'نوع المشروع: ' + val('ptype'), 'الرسالة: ' + val('message')]
        : ['Quote request from the website', 'Name: ' + val('name'), 'Country: ' + val('country'), 'Project type: ' + val('ptype'), 'Message: ' + val('message')];
      window.open('https://wa.me/96877020660?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(el.parentElement.children).filter(function (c) {
          return c.classList && c.classList.contains('reveal');
        });
        var idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- count-up stats ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1600, t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counts = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counts.forEach(function (el) { cio.observe(el); });
  } else {
    counts.forEach(animateCount);
  }
})();
