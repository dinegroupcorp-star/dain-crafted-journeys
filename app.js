/* Owhoo 2 (오후 2시) — 낮술 지도 프로토타입
   Vanilla JS + Leaflet. No API key needed. */
(function () {
  'use strict';

  var DAY = ['일', '월', '화', '수', '목', '금', '토'];
  var AREA_CENTER = {
    '성수': [37.5436, 127.0520],
    '을지로': [37.5700, 126.9905],
    '마포': [37.5550, 126.9200]
  };
  var BENEFITS = [
    { t: '생맥주 1잔 20% 할인', s: '전 메뉴 주문 시 1잔에 한해' },
    { t: '안주 1접시 서비스', s: '9,000원 이하 안주 중 1종' },
    { t: '웰컴 하이볼 1잔 무료', s: '2인 이상 방문 시' },
    { t: '병맥주 1병 20% 할인', s: '테이블당 1회' },
    { t: '전통주 1잔 서비스', s: '안주 주문 시 1잔' }
  ];

  var S = {
    stores: [],
    view: [],          // filtered + sorted
    area: 'all',
    filters: { now: false, nobreak: false, terrace: false },
    drink: null,
    mode: 'sim',
    q: '',
    me: null,
    selectedId: null,
    listOpen: false,
    passes: []
  };

  var map, markersLayer, meMarker, sheetEl, modalEl, toastTimer;

  /* ---------------- utils ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hm(min) {
    if (min === 1440) return '24:00';
    min = ((min % 1440) + 1440) % 1440;
    var h = Math.floor(min / 60), m = min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  function toast(msg, ms) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 2300);
  }
  function haversine(a, b) {
    if (!a || !b) return null;
    var R = 6371000, toR = Math.PI / 180;
    var dLat = (b[0] - a[0]) * toR, dLng = (b[1] - a[1]) * toR;
    var la1 = a[0] * toR, la2 = b[0] * toR;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function fmtDist(m) {
    if (m == null) return '';
    return m < 950 ? Math.round(m / 10) * 10 + 'm' : (m / 1000).toFixed(1) + 'km';
  }
  function mmdd(d) { return (d.getMonth() + 1) + '/' + d.getDate(); }

  /* ---------------- hours / status ---------------- */
  function parseRange(str) {
    var m = String(str || '').match(/(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})/);
    if (!m) return null;
    var o = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    var c = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
    if (c <= o) c += 1440; // past midnight (01:00, 02:00, 24:00)
    return { open: o, close: c };
  }
  function parseHours(str) {
    var out = { open: null, close: null, closed: {} };
    if (!str) return out;
    var mc = str.match(/휴무\s*\(?([월화수목금토일·,\s]+)\)?/);
    if (mc) {
      for (var i = 0; i < mc[1].length; i++) {
        var ch = mc[1][i];
        if ('월화수목금토일'.indexOf(ch) >= 0) out.closed[ch] = true;
      }
    }
    var r = parseRange(str);
    if (r) { out.open = r.open; out.close = r.close; }
    return out;
  }
  function dayHours(store, day) {
    return (day === 0 || day === 6) ? store.hoursWeekend : store.hoursWeekday;
  }
  function dayBreak(store, day) {
    return (day === 0 || day === 6) ? store.breakWeekend : store.breakWeekday;
  }
  function closedDaysOf(store) {
    var a = parseHours(store.hoursWeekday).closed;
    var b = parseHours(store.hoursWeekend).closed;
    var out = {};
    for (var k in a) out[k] = true;
    for (var k2 in b) out[k2] = true;
    return out;
  }
  function statusAt(store, date) {
    var day = date.getDay(), dn = DAY[day];
    var h = parseHours(dayHours(store, day));
    var closed = closedDaysOf(store);
    if (closed[dn]) {
      return { code: 'dayoff', label: '휴무', detail: dn + '요일 정기휴무' };
    }
    if (h.open == null) {
      return { code: 'dayoff', label: '휴무', detail: '정기휴무' };
    }
    var t = date.getHours() * 60 + date.getMinutes();
    var inHours = h.close > 1440
      ? (t >= h.open || t < h.close - 1440)
      : (t >= h.open && t < h.close);
    var brk = parseRange(dayBreak(store, day));
    var inBreak = false;
    if (brk && inHours) {
      inBreak = brk.close > brk.open ? (t >= brk.open && t < brk.close) : (t >= brk.open || t < brk.close);
    }
    if (!inHours) {
      if (t < h.open) {
        return {
          code: 'before', label: hm(h.open) + ' 오픈',
          detail: hm(h.open) + '에 오픈 · ' + hm(h.close) + '까지',
          open: h.open, close: h.close
        };
      }
      return { code: 'after', label: '영업 종료', detail: '오늘 ' + hm(h.close) + '까지', open: h.open, close: h.close };
    }
    if (inBreak) {
      return {
        code: 'break', label: '브레이크', detail: '브레이크 ' + hm(brk.open) + '~' + hm(brk.close),
        open: h.open, close: h.close, brk: brk
      };
    }
    return {
      code: 'open', label: '낮술가능',
      detail: hm(h.close) + '까지' + (brk ? ' · 브레이크 ' + hm(brk.open) + '~' + hm(brk.close) : ' · 브레이크 없음'),
      open: h.open, close: h.close, brk: brk
    };
  }
  var RANK = { open: 0, break: 1, before: 2, after: 3, dayoff: 4 };

  function simDate() {
    var d = new Date();
    d.setHours(14, 0, 0, 0);
    return d;
  }
  function basisDate() { return S.mode === 'sim' ? simDate() : new Date(); }

  function refreshStatuses() {
    var base = basisDate();
    var sim = simDate();
    S.stores.forEach(function (s) {
      s.st = statusAt(s, base);
      s.st2 = statusAt(s, sim);
      s.rank = RANK[s.st.code];
    });
  }

  /* ---------------- filtering ---------------- */
  function drinkMatch(store) {
    if (!S.drink) return true;
    var d = store.drinks || [];
    if (S.drink === '하이볼') return d.indexOf('하이볼') >= 0 || d.indexOf('사케') >= 0;
    return d.indexOf(S.drink) >= 0;
  }
  function textMatch(store, q) {
    if (!q) return true;
    var hay = [store.name, store.short, store.area, store.category, store.signature, store.point,
      store.address, (store.drinks || []).join(' '), store.terrace === 'O' ? '테라스' : ''].join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (t) { return !t || hay.indexOf(t) >= 0; });
  }
  function todayBreakEmpty(store) {
    var d = new Date().getDay();
    var b = dayBreak(store, d);
    return !b || !b.trim();
  }
  function applyFilters() {
    var base = basisDate();
    var out = S.stores.filter(function (s) {
      if (S.area !== 'all' && s.area !== S.area) return false;
      if (S.filters.now && s.st.code !== 'open') return false;
      if (S.filters.nobreak && !todayBreakEmpty(s)) return false;
      if (S.filters.terrace && s.terrace !== 'O') return false;
      if (!drinkMatch(s)) return false;
      if (!textMatch(s, S.q)) return false;
      return true;
    });
    out.forEach(function (s) {
      s.dist = S.me ? haversine(S.me, [s.lat, s.lng]) : null;
    });
    var areaOrder = { '성수': 0, '을지로': 1, '마포': 2 };
    out.sort(function (a, b) {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.dist != null && b.dist != null && Math.abs(a.dist - b.dist) > 80) return a.dist - b.dist;
      if (areaOrder[a.area] !== areaOrder[b.area]) return areaOrder[a.area] - areaOrder[b.area];
      return a.id - b.id;
    });
    S.view = out;
  }

  /* ---------------- map pins ---------------- */
  function pinClass(code) { return 'pin--' + code; }
  function dotClass(code) { return 'dotPin--' + code; }
  function shortLabel(s) {
    var n = s.short || s.name;
    return n.length > 8 ? n.slice(0, 8) : n;
  }
  function renderPins() {
    if (!map) return;
    markersLayer.clearLayers();
    var z = map.getZoom();
    var radius = z <= 12 ? 124 : z <= 13 ? 112 : z <= 14 ? 98 : z <= 15 ? 84 : z <= 16 ? 52 : 30;
    var pts = S.view.map(function (s) {
      return { s: s, p: map.latLngToLayerPoint(L.latLng(s.lat, s.lng)) };
    });
    // grid clustering (no single-link chaining, so areas never bleed into each other)
    var cells = {};
    var clusters = [];
    pts.forEach(function (it) {
      var key = Math.floor(it.p.x / radius) + ':' + Math.floor(it.p.y / radius);
      var c = cells[key];
      if (c) {
        c.items.push(it);
        c.sum = [c.sum[0] + it.p.x, c.sum[1] + it.p.y];
        c.p = L.point(c.sum[0] / c.items.length, c.sum[1] / c.items.length);
      } else {
        c = { p: it.p, sum: [it.p.x, it.p.y], items: [it] };
        cells[key] = c;
        clusters.push(c);
      }
    });

    clusters.forEach(function (c) {
      var ll = map.layerPointToLatLng(c.p);
      if (c.items.length > 1) {
        var n = c.items.length;
        var openCnt = c.items.filter(function (i) { return i.s.st.code === 'open'; }).length;
        var html = '<div class="clusterPin' + (openCnt ? ' clusterPin--open' : '') + '">' + n +
          '<small>' + (openCnt === n ? '모두 가능' : openCnt ? openCnt + '곳 가능' : '곳') + '</small></div>';
        var mk = L.marker(ll, {
          icon: L.divIcon({ className: 'pinIco', html: html, iconSize: [0, 0] }),
          zIndexOffset: 100 + n
        });
        mk.on('click', function () {
          var b = L.latLngBounds(c.items.map(function (i) { return [i.s.lat, i.s.lng]; }));
          var next = Math.min(18, map.getZoom() + 2);
          map.flyToBounds(b, { paddingTopLeft: [30, 250], paddingBottomRight: [30, 130], maxZoom: next, duration: .45 });
        });
        mk.addTo(markersLayer);
        return;
      }
      var s = c.items[0].s;
      var sel = s.id === S.selectedId;
      var icon;
      if (z >= 17) {
        var terr = s.terrace === 'O' ? '<span class="pinTerr">▢</span>' : '';
        icon = '<div class="pin ' + pinClass(s.st.code) + (sel ? ' pin--sel isSel' : '') + '">' +
          '<span class="dot"></span><span class="pinTxt">' + esc(shortLabel(s)) + '</span>' + terr + '</div>';
      } else {
        var glyph = s.st.code === 'open' ? '' : s.st.code === 'break' ? '–' : s.st.code === 'before' ? '·' : '';
        icon = '<div class="dotPin ' + dotClass(s.st.code) + '">' + glyph + '</div>';
      }
      var m = L.marker([s.lat, s.lng], {
        icon: L.divIcon({ className: 'pinIco', html: icon, iconSize: [0, 0] }),
        zIndexOffset: (sel ? 900 : 0) + (100 - s.rank * 10)
      });
      m.on('click', function () { openSheet(s.id, true); });
      m.addTo(markersLayer);
    });
  }

  /* ---------------- counts / header ---------------- */
  function updateCounts() {
    var openCnt = S.view.filter(function (s) { return s.st.code === 'open'; }).length;
    var ct = document.getElementById('countText');
    ct.innerHTML = '낮술집 <b>' + S.view.length + '</b>곳' +
      (openCnt ? ' <span style="color:#8C857C;font-weight:700">· ' +
        (S.mode === 'now' ? '지금 가능 ' : '2시 가능 ') + openCnt + '</span>' : '');
    var base = basisDate();
    document.getElementById('basisLabel').innerHTML =
      mmdd(base) + ' (' + DAY[base.getDay()] + ') ' + hm(base.getHours() * 60 + base.getMinutes()) +
      ' 기준' + (S.mode === 'sim' ? ' <b>시뮬레이션</b>' : '');
    document.getElementById('listSub').textContent =
      '화면에 ' + S.view.length + '곳' + (openCnt ? ' · ' + (S.mode === 'now' ? '지금' : '2시') + ' 가능 ' + openCnt + '곳' : '');
    var nowChip = document.querySelector('[data-filter="now"]');
    if (nowChip) nowChip.textContent = S.mode === 'now' ? '지금 바로 가능' : '2시에 가능';
    document.getElementById('passCount').textContent = S.passes.length;
    document.getElementById('passCount').hidden = !S.passes.length;
  }

  /* ---------------- list ---------------- */
  function renderList() {
    var body = document.getElementById('listBody');
    if (!S.view.length) {
      body.innerHTML = '<div class="emptyState"><div class="big">🍶</div>' +
        '<p>조건에 맞는 낮술집이 없어요</p>' +
        '<span>권역·주종 필터를 풀거나 검색어를 지워보세요.</span><br>' +
        '<button class="emptyReset" id="resetFilters">필터 초기화</button></div>';
      var r = document.getElementById('resetFilters');
      if (r) r.onclick = resetFilters;
      return;
    }
    var html = S.view.map(function (s) {
      var st = s.st;
      var tags = '<span class="tag tag--open">' + esc(st.label) + '</span>';
      (s.drinks || []).slice(0, 2).forEach(function (d) { tags += '<span class="tag">' + esc(d) + '</span>'; });
      if (s.terrace === 'O') tags += '<span class="tag tag--terr">테라스</span>';
      else if (s.terrace === '△') tags += '<span class="tag">야외△</span>';
      var hours = s.hoursWeekday || '';
      return '<div class="card" data-id="' + s.id + '">' +
        '<div class="cardMain">' +
        '<div class="cardTop"><div class="cardName">' + esc(s.name) + '</div>' +
        '<div class="cardArea">' + esc(s.area) + '</div></div>' +
        '<div class="cardTags">' + tags + '</div>' +
        '<div class="cardHours">평일 ' + esc(hours) + (s.breakWeekday ? ' · 브레이크 ' + esc(s.breakWeekday) : '') + '</div>' +
        '</div>' +
        '<div class="cardRight">' +
        '<span class="cardStatus cardStatus--' + st.code + '">' + esc(st.label) + '</span>' +
        '<span class="cardDist">' + (s.dist != null ? fmtDist(s.dist) : '') + '</span>' +
        '</div></div>';
    }).join('');
    body.innerHTML = html;
    Array.prototype.forEach.call(body.querySelectorAll('.card'), function (el) {
      el.onclick = function () {
        var id = +el.getAttribute('data-id');
        closeList();
        openSheet(id, true);
      };
    });
  }

  function resetFilters() {
    S.area = 'all'; S.drink = null; S.filters = { now: false, nobreak: false, terrace: false };
    S.q = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').hidden = true;
    syncChips();
    refresh();
  }
  function syncChips() {
    Array.prototype.forEach.call(document.querySelectorAll('#areaChips .chip'), function (b) {
      b.classList.toggle('isActive', b.getAttribute('data-area') === S.area);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#filterChips .chip'), function (b) {
      var f = b.getAttribute('data-filter'), d = b.getAttribute('data-drink');
      if (f) b.classList.toggle('isActive', !!S.filters[f]);
      if (d) b.classList.toggle('isActive', S.drink === d);
    });
  }

  function refresh() {
    refreshStatuses();
    applyFilters();
    renderPins();
    updateCounts();
    if (S.listOpen) renderList();
    if (S.selectedId) {
      var s = S.stores.find(function (x) { return x.id === S.selectedId; });
      if (s) renderSheet(s);
    }
  }

  /* ---------------- bottom sheet ---------------- */
  function statusBadge(st) {
    return '<span class="statusBadge statusBadge--' + st.code + '"><span class="live"></span>' + esc(st.label) + '</span>';
  }
  function terraceText(t) {
    if (t === 'O') return '<span class="ok">테라스·야외석 있음</span>';
    if (t === '△') return '야외석 <span class="warn">사진 다수 · 좌석 여부 확인 필요</span>';
    return '<span class="muted">실내 중심</span>';
  }
  function breakText(s) {
    var wd = s.breakWeekday, we = s.breakWeekend;
    if (!wd && !we) return '<span class="ok">브레이크타임 없음</span>';
    var parts = [];
    if (wd) parts.push(wd);
    if (we && we !== wd) parts.push('주말 ' + we);
    return parts.join(' · ');
  }
  function renderSheet(s) {
    var st = s.st, st2 = s.st2;
    var pass = S.passes.find(function (p) { return p.storeId === s.id; });
    var contactLinks = '';
    if (s.phone) contactLinks += '<a href="tel:' + esc(s.phone.replace(/[^0-9+]/g, '')) + '">' + esc(s.phone) + '</a>';
    if (s.instagram) contactLinks += (contactLinks ? ' · ' : '') +
      '<a href="https://instagram.com/' + esc(s.instagram.replace(/^@/, '')) + '" target="_blank" rel="noopener">' + esc(s.instagram) + '</a>';
    if (!contactLinks) contactLinks = '<span class="muted">연락처 정보 없음</span>';

    var secondLabel = st2.code === 'open' ? '<span class="ok">2시 낮술가능</span>'
      : st2.code === 'break' ? '<span class="warn">2시 브레이크(' + esc(st2.detail.replace('브레이크 ', '')) + ')</span>'
        : st2.code === 'before' ? '<span class="warn">2시 오픈 전</span>'
          : st2.code === 'dayoff' ? '<span class="muted">2시 휴무</span>'
            : '<span class="muted">2시 영업 종료</span>';

    var mobile = (s.phone ? 1 : 0) + (s.instagram ? 1 : 0);
    var third = s.phone
      ? '<a class="cta ctaThird" href="tel:' + esc(s.phone.replace(/[^0-9+]/g, '')) + '" aria-label="전화">📞</a>'
      : (s.instagram ? '<a class="cta ctaThird" href="https://instagram.com/' + esc(s.instagram.replace(/^@/, '')) + '" target="_blank" rel="noopener" aria-label="인스타그램">📷</a>' : '');

    document.getElementById('sheetBody').innerHTML =
      '<div class="sheetTop"><div>' +
      '<div class="sheetName">' + esc(s.name) + '</div>' +
      '<div class="sheetMeta"><span class="metaChip">' + esc(s.area) + '</span><span>' + esc(s.category) + '</span>' +
      ((s.drinks || []).length ? '<span>·</span><span>' + esc(s.drinks.slice(0, 3).join(' / ')) + '</span>' : '') +
      '</div></div>' +
      '<button class="sheetClose" id="sheetClose" aria-label="닫기">✕</button></div>' +

      '<div class="statusRow">' + statusBadge(st) +
      '<span class="statusDetail">' + esc(st.detail) + '</span></div>' +

      '<div class="infoGrid">' +
      '<div class="infoRow"><div class="infoKey">영업시간</div><div class="infoVal">평일 ' + esc(s.hoursWeekday) +
      '<br><span class="muted">주말 ' + esc(s.hoursWeekend) + '</span></div></div>' +
      '<div class="infoRow"><div class="infoKey">브레이크</div><div class="infoVal">' + breakText(s) + '</div></div>' +
      '<div class="infoRow"><div class="infoKey">오후 2시</div><div class="infoVal">' + secondLabel +
      ' <span class="muted">· 기준 시각을 바꾸면 실시간 판정</span></div></div>' +
      '<div class="infoRow"><div class="infoKey">테라스</div><div class="infoVal">' + terraceText(s.terrace) + '</div></div>' +
      '<div class="infoRow"><div class="infoKey">시그니처</div><div class="infoVal">' + esc(s.signature) + '</div></div>' +
      '<div class="infoRow"><div class="infoKey">주소</div><div class="infoVal">' + esc(s.address) + '</div></div>' +
      '<div class="infoRow"><div class="infoKey">연락</div><div class="infoVal">' + contactLinks + '</div></div>' +
      '</div>' +

      '<div class="pointBox"><div class="pointLabel">낮술 추천 포인트</div>' +
      '<div class="pointText">' + esc(s.point) + '</div></div>' +

      (pass ? '<div class="passBadge">🎟 낮술 패스 발급됨 · <b>' + esc(pass.code) + '</b></div>' : '') +

      '<div class="ctaRow">' +
      '<button class="cta ctaPrimary" id="getPass">' + (pass ? '패스 다시 보기' : '낮술 패스 받기') + '</button>' +
      '<a class="cta ctaSecondary" href="' + esc(s.naver) + '" target="_blank" rel="noopener">네이버 지도</a>' +
      third +
      '</div>' +
      '<div class="ctaNote">낮술 패스는 제휴 매장에서 1잔 할인·안주 서비스로 쓰이는 웰컴 쿠폰입니다.<br>프로토타입 데모 — 실제 결제에는 사용되지 않습니다.</div>';

    document.getElementById('sheetClose').onclick = closeSheet;
    document.getElementById('getPass').onclick = function () { openPassModal(s); };
  }

  function openSheet(id, fromMap) {
    var s = S.stores.find(function (x) { return x.id === id; });
    if (!s) return;
    S.selectedId = id;
    renderSheet(s);
    sheetEl.classList.add('open');
    sheetEl.setAttribute('aria-hidden', 'false');
    sheetEl.style.transform = '';
    renderPins();
    if (fromMap) ensureVisible(s);
  }
  function closeSheet() {
    sheetEl.classList.remove('open');
    sheetEl.setAttribute('aria-hidden', 'true');
    S.selectedId = null;
    renderPins();
  }
  function ensureVisible(s) {
    var p = map.latLngToContainerPoint([s.lat, s.lng]);
    var h = map.getSize().y;
    var bottomLimit = h * 0.30;
    if (p.y > bottomLimit) map.panBy([0, p.y - bottomLimit + 30], { animate: true });
    else if (p.y < 250) map.panBy([0, p.y - 250], { animate: true });
  }

  /* ---------------- pass / coupon ---------------- */
  function benefitFor(s) { return BENEFITS[s.id % BENEFITS.length]; }
  function passCodeFor(s) {
    var v = s.id * 92821;
    var t = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    for (var i = 0; i < 5; i++) { v = (v * 31 + 17 + i * 7); out += t[Math.abs(v) % t.length]; }
    return 'OW2-' + out;
  }
  function openPassModal(s) {
    var exist = S.passes.find(function (p) { return p.storeId === s.id; });
    var ben = benefitFor(s);
    var code = exist ? exist.code : passCodeFor(s);
    var body = '<div class="coupon">' +
      '<div class="couponHead"><div class="logoMark" style="width:26px;height:26px;line-height:26px;font-size:15px;border-radius:8px">2</div>' +
      '<div class="couponBrand">오후 2시 · OWHOO 2</div></div>' +
      '<div class="couponTitle">' + (exist ? '내 낮술 패스' : '낮술 패스') + '</div>' +
      '<div class="couponStore">' + esc(s.name) + ' · ' + esc(s.area) + '</div>' +
      '<div class="couponBenefit"><div class="big">' + esc(ben.t) + '</div><div class="small">' + esc(ben.s) + '</div></div>' +
      '<div class="couponPerf"><span></span></div>' +
      '<div class="couponCode"><span>' + (exist ? '발급 완료' : '패스 코드') + '</span><b>' + code + '</b></div>' +
      '<ul class="couponTerms">' +
      '<li>· 사용 시간: 오늘 14:00 ~ 17:00 (낮술 타임)</li>' +
      '<li>· 1인 1매 · 다른 쿠폰과 중복 사용 불가</li>' +
      '<li>· 프로토타입 데모 쿠폰으로 실제 매장에서 사용할 수 없습니다</li>' +
      '</ul>' +
      '<div class="couponActions">' +
      (exist
        ? '<button class="modalBtn modalBtn--ghost" id="modalClose">닫기</button><button class="modalBtn modalBtn--amber" id="passRemove">패스 삭제</button>'
        : '<button class="modalBtn modalBtn--ghost" id="modalClose">닫기</button><button class="modalBtn modalBtn--primary" id="passSave">패스 받기</button>') +
      '</div></div>';

    document.getElementById('modalCard').innerHTML = body;
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.getElementById('modalClose').onclick = closeModal;
    var save = document.getElementById('passSave');
    if (save) save.onclick = function () {
      S.passes.push({ storeId: s.id, name: s.name, area: s.area, benefit: ben.t, code: code, at: Date.now() });
      savePasses();
      renderSheet(s);
      updateCounts();
      closeModal();
      toast('🎟 ' + s.name + ' 낮술 패스가 발급되었어요. 상단 🎟 에서 확인하세요.');
    };
    var rem = document.getElementById('passRemove');
    if (rem) rem.onclick = function () {
      S.passes = S.passes.filter(function (p) { return p.storeId !== s.id; });
      savePasses(); renderSheet(s); updateCounts(); closeModal();
      toast('패스를 삭제했어요.');
    };
  }
  function loadPasses() {
    try { S.passes = JSON.parse(localStorage.getItem('owhoo2.passes') || '[]') || []; }
    catch (e) { S.passes = []; }
  }
  function savePasses() {
    try { localStorage.setItem('owhoo2.passes', JSON.stringify(S.passes)); } catch (e) {}
    document.getElementById('passCount').textContent = S.passes.length;
    document.getElementById('passCount').hidden = !S.passes.length;
  }
  function openPassList() {
    var list = S.passes.slice().sort(function (a, b) { return b.at - a.at; });
    var body = list.length
      ? list.map(function (p) {
        return '<div class="passItem"><div class="passItemMain">' +
          '<div class="passItemStore">' + esc(p.name) + '</div>' +
          '<div class="passItemBenefit">' + esc(p.benefit) + '</div>' +
          '<div class="passItemCode">' + esc(p.code) + '</div>' +
          '</div><button class="passDel" data-del="' + p.storeId + '">✕</button></div>';
      }).join('')
      : '<p style="font-size:12.5px;color:#8C857C;font-weight:600;line-height:1.6;margin:14px 0">아직 발급한 낮술 패스가 없어요. 마음에 드는 매장에서 <b>낮술 패스 받기</b>를 눌러보세요.</p>';
    document.getElementById('modalCard').innerHTML =
      '<div class="infoModal"><h3>내 낮술 패스</h3>' +
      '<p>발급한 웰컴 쿠폰 ' + list.length + '장</p>' + body +
      (list.length ? '<div class="couponActions"><button class="modalBtn modalBtn--ghost" id="modalClose">닫기</button></div>'
        : '<div class="couponActions"><button class="modalBtn modalBtn--primary" id="modalClose">확인</button></div>') +
      '<div class="infoFoot">프로토타입 데모입니다. 실제 매장 결제에는 사용되지 않습니다.</div></div>';
    modalEl.classList.add('open');
    document.getElementById('modalClose').onclick = closeModal;
    Array.prototype.forEach.call(document.querySelectorAll('[data-del]'), function (b) {
      b.onclick = function () {
        var id = +b.getAttribute('data-del');
        S.passes = S.passes.filter(function (p) { return p.storeId !== id; });
        savePasses(); openPassList();
      };
    });
  }
  function closeModal() {
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
  }

  /* ---------------- info modal ---------------- */
  function openInfo() {
    document.getElementById('modalCard').innerHTML =
      '<div class="infoModal"><h3>오후 2시, 어떻게 읽으면 되나요</h3>' +
      '<p>핀 색은 <b>기준 시각</b>에 그 매장이 실제로 술을 팔 수 있는 상태인지를 보여줍니다. 상단의 <b>지금 시간 / 오후 2시</b>를 바꾸면 100곳이 모두 다시 판정됩니다.</p>' +
      '<div class="legendList">' +
      '<div class="legendItem"><span class="legendSwatch legendSwatch--open">낮술가능</span>영업 중 · 브레이크 아님</div>' +
      '<div class="legendItem"><span class="legendSwatch legendSwatch--break">브레이크</span>영업 중이지만 주방·홀 브레이크</div>' +
      '<div class="legendItem"><span class="legendSwatch legendSwatch--before">오픈 전</span>기준 시각보다 늦게 엽니다</div>' +
      '<div class="legendItem"><span class="legendSwatch legendSwatch--after">종료</span>오늘 영업이 끝났거나 정기휴무</div>' +
      '</div>' +
      '<p style="margin-top:14px">지도를 확대하면 매장명 핀이, 축소하면 권역별 매장 수가 보입니다. 숫자를 누르면 그 구역으로 확대됩니다.</p>' +
      '<div class="infoFoot">데이터: 낮술매장 마스터DB 100곳(성수 35 · 을지로·종로 35 · 마포 30) · 수집 2026-11-07<br>' +
      '좌표: 도로명 주소를 카카오 지오코딩으로 변환<br>영업시간·브레이크타임은 점주가 수시로 바꾸므로 방문 전 전화 확인을 권합니다.</div>' +
      '<div class="couponActions"><button class="modalBtn modalBtn--primary" id="modalClose">확인</button></div></div>';
    modalEl.classList.add('open');
    document.getElementById('modalClose').onclick = closeModal;
  }

  /* ---------------- list panel ---------------- */
  function openList() {
    S.listOpen = true;
    renderList();
    document.getElementById('listPanel').classList.add('open');
    document.getElementById('listPanel').setAttribute('aria-hidden', 'false');
    document.getElementById('viewToggle').textContent = '지도 보기';
  }
  function closeList() {
    S.listOpen = false;
    document.getElementById('listPanel').classList.remove('open');
    document.getElementById('listPanel').setAttribute('aria-hidden', 'true');
    document.getElementById('viewToggle').textContent = '목록 보기';
  }

  /* ---------------- map / geo ---------------- */
  function areaBounds(area) {
    var pts = S.stores.filter(function (s) { return area === 'all' || s.area === area; });
    if (!pts.length) return null;
    return L.latLngBounds(pts.map(function (s) { return [s.lat, s.lng]; }));
  }
  function jumpTo(area) {
    var b = areaBounds(area);
    if (!b) return;
    map.flyToBounds(b, {
      paddingTopLeft: [26, 262], paddingBottomRight: [26, 150],
      maxZoom: area === 'all' ? 13 : 16, duration: .6
    });
  }
  function locate() {
    if (!navigator.geolocation) { toast('이 브라우저에서는 위치를 쓸 수 없어요.'); return; }
    toast('현재 위치를 확인하는 중…', 1600);
    navigator.geolocation.getCurrentPosition(function (pos) {
      S.me = [pos.coords.latitude, pos.coords.longitude];
      if (meMarker) map.removeLayer(meMarker);
      meMarker = L.marker(S.me, {
        icon: L.divIcon({ className: 'pinIco', html: '<div class="meDot"></div>', iconSize: [0, 0] }),
        interactive: false, zIndexOffset: 1200
      }).addTo(map);
      map.flyTo(S.me, Math.max(map.getZoom(), 15), { duration: .6 });
      applyFilters(); renderPins(); updateCounts();
      if (S.listOpen) renderList();
      var near = S.view.filter(function (s) { return s.dist != null; })[0];
      toast(near ? '현재 위치 기준 가장 가까운 낮술집: ' + near.name : '현재 위치를 지도에 표시했어요.');
    }, function () {
      toast('위치 권한이 꺼져 있어요. 브라우저 설정에서 위치를 허용해 주세요.');
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
  }

  /* ---------------- init ---------------- */
  function setMode(mode) {
    S.mode = mode;
    document.querySelectorAll('.seg').forEach(function (b) { b.classList.toggle('isActive', b.getAttribute('data-mode') === mode); });
    moveThumb();
    refresh();
  }
  function moveThumb() {
    var active = document.querySelector('.seg.isActive');
    var thumb = document.querySelector('.segThumb');
    if (!active || !thumb) return;
    thumb.style.width = active.offsetWidth + 'px';
    thumb.style.transform = 'translateX(' + (active.offsetLeft - 3) + 'px)';
  }

  function bindUI() {
    document.querySelectorAll('.seg').forEach(function (b) {
      b.onclick = function () { setMode(b.getAttribute('data-mode')); };
    });
    document.querySelectorAll('#areaChips .chip').forEach(function (b) {
      b.onclick = function () {
        S.area = b.getAttribute('data-area');
        syncChips();
        refresh();
        if (S.area !== 'all') jumpTo(S.area);
      };
    });
    document.querySelectorAll('#filterChips .chip').forEach(function (b) {
      b.onclick = function () {
        var f = b.getAttribute('data-filter'), d = b.getAttribute('data-drink');
        if (f) S.filters[f] = !S.filters[f];
        if (d) S.drink = S.drink === d ? null : d;
        syncChips();
        refresh();
      };
    });
    var q = document.getElementById('searchInput');
    q.oninput = function () {
      S.q = q.value.trim();
      document.getElementById('clearSearch').hidden = !S.q;
      refresh();
      if (S.listOpen) renderList();
    };
    q.onkeydown = function (e) { if (e.key === 'Enter') q.blur(); };
    document.getElementById('clearSearch').onclick = function () {
      q.value = ''; S.q = ''; document.getElementById('clearSearch').hidden = true; refresh();
    };
    document.getElementById('viewToggle').onclick = function () {
      if (S.listOpen) closeList(); else openList();
    };
    document.getElementById('countPill').onclick = openList;
    document.getElementById('listClose').onclick = closeList;
    document.getElementById('passBtn').onclick = openPassList;
    document.getElementById('infoBtn').onclick = openInfo;
    document.getElementById('jumpAll').onclick = function () { S.area = 'all'; syncChips(); refresh(); jumpTo('all'); };
    document.getElementById('jumpSeongsu').onclick = function () { S.area = '성수'; syncChips(); refresh(); jumpTo('성수'); };
    document.getElementById('jumpEuljiro').onclick = function () { S.area = '을지로'; syncChips(); refresh(); jumpTo('을지로'); };
    document.getElementById('jumpMapo').onclick = function () { S.area = '마포'; syncChips(); refresh(); jumpTo('마포'); };
    document.getElementById('locBtn').onclick = locate;
    modalEl.onclick = function (e) { if (e.target === modalEl) closeModal(); };
    document.getElementById('modalCard').addEventListener('click', function (e) { e.stopPropagation(); });

    // sheet drag to dismiss
    var handle = document.getElementById('sheetHandle');
    var startY = 0, dragging = false, dy = 0;
    handle.addEventListener('pointerdown', function (e) {
      dragging = true; startY = e.clientY; dy = 0;
      sheetEl.style.transition = 'none';
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      sheetEl.style.transform = 'translateY(' + dy + 'px)';
    });
    handle.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      sheetEl.style.transition = '';
      if (dy > 90) closeSheet();
      else sheetEl.style.transform = '';
    });
    window.addEventListener('resize', function () { moveThumb(); if (map) map.invalidateSize(); });
  }

  function initMap() {
    map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: false,
      tap: true
    }).setView([37.555, 126.99], 12);

    var tileErr = 0, swapped = false;
    var base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: 'abc',
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    // 바탕지도가 막힐 경우 Esri 거리지도로 자동 전환
    base.on('tileerror', function () {
      tileErr++;
      if (tileErr >= 8 && !swapped) {
        swapped = true;
        map.removeLayer(base);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19, attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
        }).addTo(map);
        toast('바탕지도를 대체 소스로 전환했어요.');
      }
    });

    markersLayer = L.layerGroup().addTo(map);
    map.on('zoomend', renderPins);
    map.on('movestart', function () { /* keep pins */ });
  }

  function boot(data) {
    S.stores = data.stores;
    loadPasses();
    initMap();
    bindUI();
    var hh = new Date().getHours();
    setMode(hh >= 11 && hh < 17 ? 'now' : 'sim');
    syncChips();
    moveThumb();
    refresh();
    map.fitBounds(areaBounds('성수'), {
      paddingTopLeft: [26, 262], paddingBottomRight: [26, 150], maxZoom: 16
    });
    window.__owhoo2 = { map: map, S: S, refresh: refresh, setMode: setMode, openSheet: openSheet, jumpTo: jumpTo };
    // iframe/모바일에서 컨테이너 크기가 늦게 잡히는 경우를 보정
    requestAnimationFrame(function () {
      map.invalidateSize();
      map.fitBounds(areaBounds('성수'), {
        paddingTopLeft: [26, 262], paddingBottomRight: [26, 150], maxZoom: 16
      });
    });
    setTimeout(function () { renderPins(); }, 60);
    var params = new URLSearchParams(location.search);
    var area = params.get('area');
    if (area && ['성수', '을지로', '마포'].indexOf(area) >= 0) {
      S.area = area; syncChips(); refresh(); jumpTo(area);
    }
    setTimeout(function () {
      toast('성수 35곳부터 보여드려요 · 상단 칩이나 오른쪽 버튼으로 권역 이동', 3400);
    }, 900);
  }

  sheetEl = document.getElementById('sheet');
  modalEl = document.getElementById('modal');

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  function bootFromFallback(err) {
    if (window.OWHOO2_DATA) { boot(window.OWHOO2_DATA); return; }
    document.getElementById('mapWrap').innerHTML =
      '<div class="loadingState" style="padding-top:120px"><div class="big">😵</div>' +
      '<p>매장 데이터를 불러오지 못했어요</p><span>' + esc(err && err.message ? err.message : '') + '</span></div>';
  }
  fetch('data/stores.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(boot)
    .catch(function (err) {
      bootFromFallback(err);
      return;
    })
    .catch(function (err) {
      document.getElementById('mapWrap').innerHTML =
        '<div class="loadingState" style="padding-top:120px"><div class="big">😵</div>' +
        '<p>매장 데이터를 불러오지 못했어요</p><span>' + esc(err.message) + '</span></div>';
    });
})();
