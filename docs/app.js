// AniDa site: reveal on scroll + hero parallax + shrinking nav.
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  var heroBg = document.getElementById('heroBg');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroBg && !reduceMotion) {
    var ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            heroBg.style.transform = 'translateY(' + y * 0.25 + 'px)';
          }
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  // Прямые скачивания без ухода со страницы: тянем файл в blob
  // и отдаём его браузеру — вкладка остаётся на месте.
  function dlFilename(url) {
    try { return decodeURIComponent(url.split('/').pop().split('?')[0]) || 'anida-file'; }
    catch (e) { return 'anida-file'; }
  }
  document.querySelectorAll('a[href*="releases/download"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      var url = a.href;
      var original = a.innerHTML;
      a.style.pointerEvents = 'none';
      a.innerHTML = 'Скачивание…';
      fetch(url, { redirect: 'follow' })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.blob();
        })
        .then(function (blob) {
          var obj = URL.createObjectURL(blob);
          var tmp = document.createElement('a');
          tmp.href = obj;
          tmp.download = dlFilename(url);
          document.body.appendChild(tmp);
          tmp.click();
          setTimeout(function () { URL.revokeObjectURL(obj); tmp.remove(); }, 4000);
          a.innerHTML = original;
          a.style.pointerEvents = '';
        })
        .catch(function () {
          // CORS/сеть подвели — откат к обычному переходу
          a.innerHTML = original;
          a.style.pointerEvents = '';
          window.location.href = url;
        });
    });
  });
})();
