(function () {
  'use strict';
  var SITE = window.SITE || {};
  var SHOP = (window.SHOP || []).slice();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------- Settings from site-config.js ---------- */
  var ch = SITE.charity || {};
  var charityOn = !!(ch.enabled && ch.name);
  $$('[data-site="charity"]').forEach(function (n) {
    if (!charityOn) return;
    n.textContent = (ch.percent || 20) + '% of the price of every painting sold goes to ';
    var name = ch.url ? el('a', '', ch.name) : el('strong', '', ch.name);
    if (ch.url) { name.href = ch.url; name.target = '_blank'; name.rel = 'noopener'; }
    n.appendChild(name);
    n.appendChild(document.createTextNode('.' + (ch.note ? ' ' + ch.note : '')));
    n.hidden = false;
  });
  $$('[data-site="charity-block"]').forEach(function (n) { if (charityOn) n.hidden = false; });
  $$('[data-site="delivery"]').forEach(function (n) { if (SITE.deliveryNote) n.textContent = SITE.deliveryNote; });
  $$('[data-site="contact"]').forEach(function (n) {
    if (!SITE.contactEmail) return;
    n.textContent = 'Questions? Email ';
    var a = el('a', '', SITE.contactEmail);
    a.href = 'mailto:' + SITE.contactEmail;
    n.appendChild(a);
    n.appendChild(document.createTextNode('.'));
    n.hidden = false;
  });

  /* ---------- Shop cards (shop-data.js) ---------- */
  var newest = SHOP.reduce(function (m, p) { return p.added && p.added > m ? p.added : m; }, '');

  function card(p) {
    var sold = p.status === 'sold';
    var fig = el('figure', 'product' + (sold ? ' is-sold' : ''));
    fig.setAttribute('data-status', sold ? 'sold' : 'available');
    var shot = el('a', 'shot');
    shot.href = p.image || ('full-' + p.id + '.jpg');
    var img = el('img');
    img.src = p.thumb || p.image || ('thumb-' + p.id + '.jpg');
    img.alt = p.title || 'Painting';
    img.loading = 'lazy';
    img.decoding = 'async';
    shot.appendChild(img);
    if (!sold && p.added && p.added === newest) shot.appendChild(el('span', 'tag-new', 'New this week'));
    var stamp = el('span', 'stamp');
    stamp.setAttribute('aria-hidden', 'true');
    stamp.setAttribute('lang', 'zh');
    stamp.appendChild(el('span', '', '已'));
    stamp.appendChild(el('span', '', '售'));
    shot.appendChild(stamp);
    fig.appendChild(shot);

    var cap = el('figcaption');
    cap.appendChild(el('span', 't', p.title || 'Untitled painting'));
    var meta = [p.type, p.size].filter(Boolean).join(', ');
    if (meta) cap.appendChild(el('span', 'meta', meta));
    var row = el('div', 'row');
    if (sold) {
      row.appendChild(el('span', 'price', p.price ? '$' + p.price : ''));
      row.appendChild(el('span', 'soon', 'Sold'));
    } else if (p.price) {
      row.appendChild(el('span', 'price', '$' + p.price));
      if (SITE.shopOpen && p.buyUrl) {
        var buy = el('a', 'btn btn-solid btn-buy', 'Buy');
        buy.href = p.buyUrl;
        buy.setAttribute('aria-label', 'Buy ' + (p.title || 'this painting') + ' for $' + p.price);
        row.appendChild(buy);
      } else {
        row.appendChild(el('span', 'soon', SITE.shopOpen ? 'Ask us about this one' : 'Available'));
      }
    } else {
      row.appendChild(el('span', 'soon', 'Price coming soon'));
    }
    cap.appendChild(row);
    fig.appendChild(cap);
    return fig;
  }

  var shopGrid = $('#shop-grid');
  if (shopGrid) {
    if (!SHOP.length) {
      shopGrid.replaceWith(el('p', 'shop-empty', 'New paintings are on the way. Check back soon.'));
    } else {
      SHOP.forEach(function (p) { shopGrid.appendChild(card(p)); });
      var chips = $$('.chip');
      var count = $('#shop-count');
      var apply = function (mode) {
        var shown = 0;
        $$('.product', shopGrid).forEach(function (f) {
          var hide = mode === 'available' && f.getAttribute('data-status') === 'sold';
          f.hidden = hide;
          if (!hide) shown++;
        });
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === mode ? 'true' : 'false'); });
        if (count) count.textContent = shown + (shown === 1 ? ' painting' : ' paintings');
      };
      chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); }); });
      apply('available');
    }
  }
  var shopNotice = $('[data-site="shop-closed"]');
  if (shopNotice && !SITE.shopOpen) shopNotice.hidden = false;

  var newGrid = $('#new-grid');
  if (newGrid) {
    var fresh = SHOP.filter(function (p) { return p.status !== 'sold'; })
      .sort(function (a, b) { return (b.added || '').localeCompare(a.added || ''); })
      .slice(0, 4);
    if (fresh.length) fresh.forEach(function (p) { newGrid.appendChild(card(p)); });
    else { var sec = newGrid.closest('section'); if (sec) sec.hidden = true; }
  }

  /* ---------- Painting grids (balanced columns) ---------- */
  var grids = $$('.masonry');
  grids.forEach(function (g) { g._items = $$('.art', g); g._n = 0; });
  function columnCount(g) {
    var spec = (g.getAttribute('data-cols') || '2,3,4').split(',').map(Number);
    var w = window.innerWidth;
    return w < 640 ? spec[0] : w < 1000 ? spec[1] : spec[2];
  }
  function layout(g) {
    var n = columnCount(g);
    if (n === g._n) return;
    g._n = n;
    var cols = [];
    for (var i = 0; i < n; i++) { var c = el('div', 'col'); c._h = 0; cols.push(c); }
    g._items.forEach(function (item) {
      var img = $('img', item);
      var r = (parseFloat(img.getAttribute('height')) / parseFloat(img.getAttribute('width'))) || 1.3;
      var t = cols[0];
      cols.forEach(function (c) { if (c._h < t._h - 0.001) t = c; });
      t.appendChild(item);
      t._h += r;
    });
    while (g.firstChild) g.removeChild(g.firstChild);
    cols.forEach(function (c) { g.appendChild(c); });
  }
  grids.forEach(layout);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { grids.forEach(layout); }, 120); });

  /* ---------- Lightbox ---------- */
  var lb, lbImg, lbCount, group = [], idx = 0, opener = null, tx = null;
  function zoomLink(item) { return $('a', item); }
  function build() {
    lb = el('div', 'lb');
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
    lbImg = $('.lb-stage img', lb);
    lbCount = $('.lb-count', lb);
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'Tab') {
        var f = $$('button', lb), i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    });
  }
  function show(i) {
    idx = (i + group.length) % group.length;
    var a = zoomLink(group[idx]), im = $('img', group[idx]);
    lbImg.src = a.getAttribute('href');
    lbImg.alt = im ? im.alt : '';
    lbCount.textContent = (idx + 1) + ' / ' + group.length;
    [1, -1].forEach(function (d) { new Image().src = zoomLink(group[(idx + d + group.length) % group.length]).getAttribute('href'); });
  }
  function open(items, i, from) {
    if (!lb) build();
    group = items; opener = from; show(i);
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    $('.lb-close', lb).focus();
  }
  function close() {
    lb.hidden = true;
    lbImg.removeAttribute('src');
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  }
  $$('[data-lightbox]').forEach(function (box) {
    box.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var item = a.closest('.art, .product');
      if (!item || zoomLink(item) !== a) return;
      var items = box.classList.contains('masonry') ? box._items : $$('.product:not([hidden])', box);
      var i = items.indexOf(item);
      if (i < 0) return;
      e.preventDefault();
      open(items, i, a);
    });
  });

  /* ---------- Home: slowly change the painting in the frame ---------- */
  var stack = $('.frame-stack');
  if (stack) {
    var slides = $$('img', stack);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur = 0;
    if (slides.length > 1 && !reduce) {
      window.addEventListener('load', function () {
        slides.forEach(function (img) { var s = img.getAttribute('data-src'); if (s) { img.src = s; img.removeAttribute('data-src'); } });
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
  var list = $('#events');
  if (list) {
    var data = (window.EVENTS || []).slice();
    var parse = function (s) { var p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
    var now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var render = function (ev) {
      var s = parse(ev.date), en = ev.endDate ? parse(ev.endDate) : null;
      var li = el('li', 'event'), d = el('div', 'event-date');
      d.appendChild(el('span', 'm', M[s.getMonth()]));
      d.appendChild(el('span', 'd', String(s.getDate())));
      d.appendChild(el('span', 'r', en && en > s ? (en.getMonth() === s.getMonth() ? 'to ' + en.getDate() : 'to ' + M[en.getMonth()] + ' ' + en.getDate()) : D[s.getDay()]));
      li.appendChild(d);
      var b = el('div', 'event-body');
      b.appendChild(el('h3', '', ev.title || 'Event'));
      ['place', 'time', 'address', 'note'].forEach(function (k) { if (ev[k]) b.appendChild(el('p', '', ev[k])); });
      if (ev.address || ev.link) {
        var links = el('div', 'links');
        if (ev.address) { var m = el('a', '', 'Get directions'); m.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.address); m.target = '_blank'; m.rel = 'noopener'; links.appendChild(m); }
        if (ev.link) { var l = el('a', '', 'Event page'); l.href = ev.link; l.target = '_blank'; l.rel = 'noopener'; links.appendChild(l); }
        b.appendChild(links);
      }
      li.appendChild(b);
      return li;
    };
    var endOf = function (ev) { return ev.endDate ? parse(ev.endDate) : parse(ev.date); };
    var up = data.filter(function (e) { return endOf(e) >= today; }).sort(function (a, b) { return parse(a.date) - parse(b.date); });
    var past = data.filter(function (e) { return endOf(e) < today; }).sort(function (a, b) { return parse(b.date) - parse(a.date); });
    var holder = $('#events-holder');
    if (up.length) up.forEach(function (e) { list.appendChild(render(e)); });
    else {
      list.remove();
      var empty = el('div', 'events-empty'), p = el('p');
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
