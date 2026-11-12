/* countries: home search and region filter, recently viewed, live clock, sortable and filterable tables, compare tool, quiz */
(function () {
  'use strict';
  var d = document, S = window.SYG, $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var KEY = 'syg-countries-recent';
  var plain = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var fmt = function (n) { return n == null ? 'no value' : Number(n).toLocaleString('en-US', { maximumFractionDigits: n < 100 ? 1 : 0 }); };

  /* country page: remember it, run its clock */
  var art = $('[data-c]');
  if (art) S.recent(KEY, { u: '/countries/' + art.getAttribute('data-c') + '/', t: art.getAttribute('data-name') });
  var ck = $('.clock[data-tz]');
  if (ck) {
    var tick = function () {
      try {
        $('b', ck).textContent = new Intl.DateTimeFormat('en-GB', { timeZone: ck.getAttribute('data-tz'), weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
      } catch (e) { ck.hidden = true; }
    };
    tick(); setInterval(tick, 15000);
  }

  /* home */
  var all = $('#all'), q = $('#q');
  if (all && q) {
    var items = $$('li', all), reg = '', count = $('#count');
    var paint = function () {
      var v = plain(q.value.trim()), n = 0;
      items.forEach(function (li) {
        var ok = (!reg || li.getAttribute('data-r') === reg) && (!v || plain(li.getAttribute('data-q')).indexOf(v) > -1);
        li.hidden = !ok; if (ok) n++;
      });
      count.textContent = v || reg ? (n ? n + (n === 1 ? ' match' : ' matches') : 'Nothing matches. Check the spelling, or try the capital city.') : '';
    };
    q.addEventListener('input', paint);
    q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = items.filter(function (li) { return !li.hidden; }); if (f.length && q.value.trim()) location.href = $('a', f[0]).href; } });
    $('#regs').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var on = b.getAttribute('aria-pressed') === 'true';
      $$('#regs button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      reg = on ? '' : b.getAttribute('data-r'); if (!on) b.setAttribute('aria-pressed', 'true');
      paint();
    });
    var rec = S.recent(KEY);
    if (rec.length) { $('#recent-list').innerHTML = rec.map(function (r) { return '<a href="' + S.esc(r.u) + '">' + S.esc(r.t) + '</a>'; }).join(''); $('#recent').hidden = false; }
  }

  /* tables: sort and filter */
  var tb = $('table.sortable'), lq = $('#lq');
  if (tb) {
    var body = $('tbody', tb), rows = $$('tr', body), ths = $$('th', tb), cnt = $('#lcount');
    var sortBy = function (i) {
      var th = ths[i], asc = th.getAttribute('aria-sort') !== 'ascending';
      ths.forEach(function (t) { t.removeAttribute('aria-sort'); });
      th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
      rows.sort(function (a, b) {
        var x = a.children[i].getAttribute('data-v') || '', y = b.children[i].getAttribute('data-v') || '';
        if (x === '' || y === '') return x === y ? 0 : x === '' ? 1 : -1;
        var nx = Number(x), ny = Number(y), r = isNaN(nx) || isNaN(ny) ? x.localeCompare(y) : nx - ny;
        return asc ? r : -r;
      });
      rows.forEach(function (r) { body.appendChild(r); });
    };
    ths.forEach(function (th, i) {
      if (!th.hasAttribute('data-sort')) return;
      th.addEventListener('click', function () { sortBy(i); });
      th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sortBy(i); } });
    });
    if (lq) lq.addEventListener('input', function () {
      var v = plain(lq.value.trim()), n = 0;
      rows.forEach(function (r) { var ok = !v || plain(r.getAttribute('data-q')).indexOf(v) > -1; r.hidden = !ok; if (ok) n++; });
      cnt.textContent = v ? (n ? n + ' of ' + rows.length + ' rows shown' : 'Nothing matches. Check the spelling.') : '';
    });
  }

  /* compare */
  var ca = $('#ca'), cb = $('#cb'), out = $('#cmp');
  if (ca && cb && out) {
    var DATA = null;
    var draw = function () {
      if (!DATA || !ca.value || !cb.value) { out.hidden = true; return; }
      var a = DATA[ca.value], b = DATA[cb.value];
      if (!a || !b) { out.hidden = true; return; }
      var dens = function (x) { return x[5] && x[7] ? x[5] / x[7] : null; };
      var row = function (label, va, vb, num) {
        var wa = '', wb = '', note = '';
        if (num && va != null && vb != null && va !== vb) {
          if (va > vb) wa = ' class="win"'; else wb = ' class="win"';
          var hi = Math.max(va, vb), lo = Math.min(va, vb);
          if (lo > 0) { var t = hi / lo; note = '<small>' + (t >= 1.15 ? (t >= 10 ? Math.round(t) : t.toFixed(1)) + ' times' : Math.round((t - 1) * 100) + '% more') + '</small>'; }
        }
        return '<tr><td>' + label + '</td><td' + wa + '>' + (num ? fmt(va) : S.esc(va || 'none')) + (wa ? note : '') + '</td><td' + wb + '>' + (num ? fmt(vb) : S.esc(vb || 'none')) + (wb ? note : '') + '</td></tr>';
      };
      var head = function (x) { return '<th><img class="fl" src="/countries/flags/' + x[0].toLowerCase() + '.svg" width="40" height="30" alt=""><br><a href="/countries/' + x[2] + '/">' + S.esc(x[1]) + '</a></th>'; };
      var bigger = a[5] && b[5] ? (a[5] > b[5] ? a : b) : null, smaller = bigger === a ? b : a;
      var pr = bigger ? bigger[5] / smaller[5] : 0;
      var sum = !bigger ? '' : pr < 1.15 ? S.esc(bigger[1]) + ' and ' + S.esc(smaller[1]) + ' have about the same number of people (' + S.esc(bigger[1]) + ' has ' + Math.round((pr - 1) * 100) + '% more).' : S.esc(bigger[1]) + ' has about ' + (pr >= 10 ? Math.round(pr) : pr.toFixed(1)) + ' times as many people as ' + S.esc(smaller[1]) + '.';
      if (a[7] && b[7] && a !== b) { var L = a[7] > b[7] ? a : b, Sm = L === a ? b : a, t2 = L[7] / Sm[7]; sum += ' ' + S.esc(L[1]) + ' is ' + (t2 >= 10 ? Math.round(t2) : t2.toFixed(1)) + ' times as large by area.'; }
      if (a === b) sum = 'You chose the same country twice. Pick a different second country.';
      out.innerHTML = '<h2>' + S.esc(a[1]) + ' and ' + S.esc(b[1]) + '</h2><p>' + sum + '</p><div class="tbl"><table class="cmp"><thead><tr><th></th>' + head(a) + head(b) + '</tr></thead><tbody>' +
        row('Capital', a[3], b[3]) + row('Region', a[4], b[4]) + row('Population', a[5], b[5], 1) + row('Area, km²', a[7], b[7], 1) + row('People per km²', dens(a), dens(b), 1) +
        row('GDP per person, US$', a[8], b[8], 1) + row('Life expectancy, years', a[9], b[9], 1) + row('Land neighbours', a[13], b[13], 1) + row('Currency', a[10], b[10]) + row('Calling code', a[11], b[11]) +
        row('Languages', a[12], b[12]) + row('Time', a[15], b[15]) + '</tbody></table></div><p class="hint">The larger number in each row is marked. Larger is not always better.</p>' +
        '<div class="acts"><button class="btn sm" type="button" data-copy="' + S.esc(location.origin + '/countries/compare/?a=' + a[0] + '&b=' + b[0]) + '" data-done="Link copied">Copy link to this comparison</button></div>';
      out.hidden = false;
      try { history.replaceState(null, '', '/countries/compare/?a=' + a[0] + '&b=' + b[0]); } catch (e) {}
    };
    S.json('/countries/data/all.json').then(function (j) {
      DATA = {}; j.forEach(function (r) { DATA[r[0]] = r; });
      var p = new URLSearchParams(location.search), pa = (p.get('a') || '').toUpperCase(), pb = (p.get('b') || '').toUpperCase();
      if (DATA[pa]) ca.value = pa; if (DATA[pb]) cb.value = pb;
      draw();
    }).catch(function () { out.hidden = false; out.innerHTML = '<p>The country data could not be loaded. Check your connection and reload the page.</p>'; });
    ca.addEventListener('change', draw); cb.addEventListener('change', draw);
  }

  /* quiz */
  var qz = $('#quiz');
  if (qz) {
    var box = $('#qbox'), best = $('#qbest'), type = 'flag', region = '', data = null, round = null, score, idx;
    var bkey = function () { return 'syg-countries-quiz-' + type + '-' + (region || 'world'); };
    var showBest = function () { var b = 0; try { b = +localStorage.getItem(bkey()) || 0; } catch (e) {} best.textContent = b ? 'Your best score for this quiz: ' + b + ' out of 10.' : ''; };
    var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var pool = function () { return data.filter(function (r) { return r[14] && r[3] && (!region || r[4] === region); }); };
    var ask = function () {
      if (idx >= round.length) {
        try { var b = +localStorage.getItem(bkey()) || 0; if (score > b) localStorage.setItem(bkey(), score); } catch (e) {}
        var txt = 'I scored ' + score + ' out of 10 on the ' + (type === 'flag' ? 'flag' : 'capital city') + ' quiz (' + (region || 'world') + '). Can you beat it? https://countries.shareyourgroup.com/countries/quiz/';
        box.innerHTML = '<p class="qask">You scored ' + score + ' out of 10</p><p>' + (score === 10 ? 'Perfect. Try another region.' : score >= 7 ? 'Well done. One more round?' : 'Keep going. Each round brings new countries.') + '</p>' +
          '<div class="acts"><button class="btn" type="button" id="qstart">Play again</button><button class="btn ghost" type="button" data-wa="' + S.esc(txt) + '">Challenge a friend</button></div>';
        showBest(); return;
      }
      var e = round[idx], opts = shuffle(pool().filter(function (x) { return x !== e; })).slice(0, 3).concat([e]);
      shuffle(opts);
      box.innerHTML = '<p class="hint">Question ' + (idx + 1) + ' of 10 · Score ' + score + '</p>' +
        (type === 'flag' ? '<p class="qask">Which country has this flag?</p><img class="qflag" src="/countries/flags/' + e[0].toLowerCase() + '.svg" width="240" height="180" alt="A flag to identify">' : '<p class="qask">What is the capital of ' + S.esc(e[1]) + '?</p>') +
        '<div class="qopts">' + opts.map(function (p) { return '<button type="button" data-ok="' + (p === e ? 1 : 0) + '">' + S.esc(type === 'flag' ? p[1] : p[3].split(', ')[0]) + '</button>'; }).join('') + '</div><p id="qfb" role="status"></p>';
    };
    var start = function () { round = shuffle(pool()).slice(0, 10); score = 0; idx = 0; ask(); };
    qz.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'qstart') { if (data) start(); else S.json('/countries/data/all.json').then(function (j) { data = j; start(); }).catch(function () { S.toast('Could not load the questions. Check your connection.'); }); return; }
      if (b.hasAttribute('data-t') || b.hasAttribute('data-r')) {
        var grp = b.parentNode; $$('button', grp).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        if (b.hasAttribute('data-t')) type = b.getAttribute('data-t'); else region = b.getAttribute('data-r');
        showBest(); if (data && round) start(); return;
      }
      if (b.hasAttribute('data-ok') && !b.disabled) {
        var ok = b.getAttribute('data-ok') === '1', e = round[idx];
        $$('.qopts button').forEach(function (x) { x.disabled = true; if (x.getAttribute('data-ok') === '1') x.classList.add('right'); });
        if (ok) score++; else b.classList.add('wrong');
        $('#qfb').innerHTML = (ok ? 'Correct. ' : 'Not quite. ') + (type === 'flag' ? 'This is the flag of <a href="/countries/' + e[2] + '/">' + S.esc(e[1]) + '</a>. ' : 'The capital of <a href="/countries/' + e[2] + '/">' + S.esc(e[1]) + '</a> is ' + S.esc(e[3]) + '. ') + '<button class="btn sm" type="button" id="qnext">Next</button>';
        $('#qnext').focus(); return;
      }
      if (b.id === 'qnext') { idx++; ask(); }
    });
    showBest();
  }
})();
