(function () {
  'use strict';

  /* ---------- Painting grids (balanced columns, reads left to right) ---------- */
  var grids = Array.prototype.slice.call(document.querySelectorAll('.masonry'));

  grids.forEach(function (grid) {
    grid._items = Array.prototype.slice.call(grid.querySelectorAll('.art'));
    grid._n = 0;
  });

  function columnCount(grid) {
    var spec = (grid.getAttribute('data-cols') || '2,3,4').split(',').map(Number);
    var w = window.innerWidth;
    return w < 640 ? spec[0] : w < 1000 ? spec[1] : spec[2];
  }

  function layout(grid) {
    var n = columnCount(grid);
    if (n === grid._n) return;
    grid._n = n;
    var cols = [];
    for (var i = 0; i < n; i++) {
      var c = document.createElement('div');
      c.className = 'col';
      c._h = 0;
      cols.push(c);
    }
    grid._items.forEach(function (item) {
      var img = item.querySelector('img');
      var r = (parseFloat(img.getAttribute('height')) / parseFloat(img.getAttribute('width'))) || 1.3;
      var target = cols[0];
      cols.forEach(function (c) { if (c._h < target._h - 0.001) target = c; });
      target.appendChild(item);
      target._h += r;
    });
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    cols.forEach(function (c) { grid.appendChild(c); });
  }

  grids.forEach(layout);
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { grids.forEach(layout); }, 120);
  });

  /* ---------- Lightbox ---------- */
  var lb, lbImg, lbCount, group = [], idx = 0, opener = null, touchX = null;

  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Painting viewer');
    lb.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close">&#10005;</button>' +
      '<button type="button" class="lb-prev" aria-label="Previous painting">&#8249;</button>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<button type="button" class="lb-next" aria-label="Next painting">&#8250;</button>' +
      '<div class="lb-count" aria-live="polite"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('.lb-stage img');
    lbCount = lb.querySelector('.lb-count');
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb();
    });
    lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        var f = Array.prototype.slice.call(lb.querySelectorAll('button'));
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    });
  }

  function show(i) {
    idx = (i + group.length) % group.length;
    var a = group[idx].querySelector('a');
    var thumb = group[idx].querySelector('img');
    lbImg.src = a.getAttribute('href');
    lbImg.alt = thumb ? thumb.alt : '';
    lbCount.textContent = (idx + 1) + ' / ' + group.length;
    [1, -1].forEach(function (d) {
      var n = group[(idx + d + group.length) % group.length].querySelector('a');
      new Image().src = n.getAttribute('href');
    });
  }

  function openLb(items, i, from) {
    if (!lb) buildLightbox();
    group = items;
    opener = from;
    show(i);
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }

  function step(d) { show(idx + d); }

  function closeLb() {
    lb.hidden = true;
    lbImg.removeAttribute('src');
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  }

  grids.forEach(function (grid) {
    var items = grid._items;
    grid.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.art a') : null;
      if (!a) return;
      var fig = a.parentNode;
      var i = items.indexOf(fig);
      if (i < 0) return;
      e.preventDefault();
      openLb(items, i, a);
    });
  });

  /* ---------- Home: slowly change the painting in the frame ---------- */
  var stack = document.querySelector('.frame-stack');
  if (stack) {
    var slides = Array.prototype.slice.call(stack.querySelectorAll('img'));
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur = 0;
    var loadRest = function () {
      slides.forEach(function (img) {
        if (img.getAttribute('data-src')) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
        }
      });
    };
    if (slides.length > 1 && !reduce) {
      window.addEventListener('load', function () {
        loadRest();
        setInterval(function () {
          if (document.hidden) return;
          slides[cur].classList.remove('is-on');
          cur = (cur + 1) % slides.length;
          slides[cur].classList.add('is-on');
        }, 6500);
      });
    }
  }

  /* ---------- Events page ---------- */
  var list = document.getElementById('events');
  if (list) {
    var data = (window.EVENTS || []).slice();

    var parse = function (s) {
      var p = String(s).split('-').map(Number);
      return new Date(p[0], p[1] - 1, p[2]);
    };
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var el = function (tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text) n.textContent = text;
      return n;
    };

    var render = function (ev) {
      var start = parse(ev.date);
      var end = ev.endDate ? parse(ev.endDate) : null;
      var li = el('li', 'event');
      var d = el('div', 'event-date');
      d.appendChild(el('span', 'm', MONTHS[start.getMonth()]));
      d.appendChild(el('span', 'd', String(start.getDate())));
      var r;
      if (end && end > start) {
        r = (end.getMonth() === start.getMonth())
          ? 'to ' + end.getDate()
          : 'to ' + MONTHS[end.getMonth()] + ' ' + end.getDate();
      } else {
        r = DAYS[start.getDay()];
      }
      d.appendChild(el('span', 'r', r));
      li.appendChild(d);

      var b = el('div', 'event-body');
      b.appendChild(el('h3', '', ev.title || 'Event'));
      if (ev.place) b.appendChild(el('p', '', ev.place));
      if (ev.time) b.appendChild(el('p', '', ev.time));
      if (ev.address) b.appendChild(el('p', '', ev.address));
      if (ev.note) b.appendChild(el('p', '', ev.note));
      if (ev.address || ev.link) {
        var links = el('div', 'links');
        if (ev.address) {
          var m = el('a', '', 'Get directions');
          m.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.address);
          m.target = '_blank';
          m.rel = 'noopener';
          links.appendChild(m);
        }
        if (ev.link) {
          var l = el('a', '', 'Event page');
          l.href = ev.link;
          l.target = '_blank';
          l.rel = 'noopener';
          links.appendChild(l);
        }
        b.appendChild(links);
      }
      li.appendChild(b);
      return li;
    };

    var endOf = function (ev) { return ev.endDate ? parse(ev.endDate) : parse(ev.date); };
    var upcoming = data.filter(function (e) { return endOf(e) >= today; })
      .sort(function (a, b) { return parse(a.date) - parse(b.date); });
    var past = data.filter(function (e) { return endOf(e) < today; })
      .sort(function (a, b) { return parse(b.date) - parse(a.date); });

    var holder = document.getElementById('events-holder');

    if (upcoming.length) {
      upcoming.forEach(function (e) { list.appendChild(render(e)); });
    } else {
      list.remove();
      var empty = el('div', 'events-empty');
      var p = el('p');
      p.appendChild(el('strong', '', data.length ? 'No upcoming dates right now.' : 'No dates posted yet.'));
      p.appendChild(document.createTextNode('Check back soon. New dates and places will show up on this page.'));
      empty.appendChild(p);
      holder.appendChild(empty);
    }

    if (past.length) {
      var det = el('details', 'past');
      det.appendChild(el('summary', '', 'Past events'));
      var pl = el('ol', 'events');
      past.forEach(function (e) { pl.appendChild(render(e)); });
      det.appendChild(pl);
      holder.appendChild(det);
    }
  }
})();
