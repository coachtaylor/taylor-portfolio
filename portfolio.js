/* portfolio.js — nav, reveals, counters, parallax, spotlight, coming-soon */
(function () {
  // Sticky nav
  var nav = document.getElementById('topnav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
    // safety nets
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight + 120) el.classList.add('in');
      });
    }, 300);
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { el.classList.add('in'); });
    }, 1800);
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Count-up
  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var dur = 1500, start = performance.now();
    function tick(t) {
      var p = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { co.observe(el); });
  } else {
    countEls.forEach(runCount);
  }

  // Spotlight on tiltable cards
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  // Parallax (hero portrait + bg glow) — pointer + scroll
  var portrait = document.getElementById('portraitImg');
  var stage = document.getElementById('portraitStage');
  var glow = document.getElementById('bgGlow');
  var px = 0, py = 0, tx = 0, ty = 0;
  var prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parallaxOn() { return (window.__TP_TWEAKS__ || {}).parallax !== false && !prefersReduce; }

  if (stage) {
    window.addEventListener('mousemove', function (e) {
      if (!parallaxOn()) { tx = 0; ty = 0; return; }
      tx = (e.clientX / window.innerWidth - 0.5);
      ty = (e.clientY / window.innerHeight - 0.5);
    });
  }
  function raf() {
    px += (tx - px) * 0.06; py += (ty - py) * 0.06;
    if (portrait) portrait.style.transform = 'translate(' + (px * 16) + 'px,' + (py * 12) + 'px)';
    requestAnimationFrame(raf);
  }
  raf();

  // scroll parallax for glow + portrait drift
  window.addEventListener('scroll', function () {
    if (!parallaxOn()) return;
    var y = window.scrollY;
    if (glow) glow.style.transform = 'translateX(-50%) translateY(' + (y * 0.18) + 'px)';
  }, { passive: true });

  // Coming-soon toast
  var toast = document.getElementById('soonToast');
  var toastTitle = document.getElementById('soonTitle');
  document.querySelectorAll('.project-link.soon').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      toastTitle.textContent = a.dataset.soon || 'Case study';
      toast.classList.add('show');
    });
  });
  function closeToast() { toast.classList.remove('show'); }
  document.getElementById('soonClose').addEventListener('click', closeToast);
  toast.addEventListener('click', function (e) { if (e.target === toast) closeToast(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeToast(); });
})();
