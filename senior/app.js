/* 이음선배 — mobile web prototype (vanilla JS + Leaflet, no API key) */
(function () {
  'use strict';

  var DAY = ['일', '월', '화', '수', '목', '금', '토'];
  var DAY_IDX = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
  var STORE_KEY = 'eumseonbae.v1';

  var S = {
    tab: 'home',
    cat: 'all',
    mode: 'all',
    q: '',
    mentorId: null,
    slot: 0,
    venueId: null,
    prog: 0,
    grade: 'pro',
    hours: 6,
    talk: 0,
    apps: [],
    res: []
  };

  var map = null, mapReady = false, markers = {}, toastTimer = null, sheetTimer = null;

  /* ---------------- utils ---------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function comma(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function mentorById(id) {
    for (var i = 0; i < EUM.MENTORS.length; i++) if (EUM.MENTORS[i].id === id) return EUM.MENTORS[i];
    return null;
  }
  function venueById(id) {
    for (var i = 0; i < EUM.VENUES.length; i++) if (EUM.VENUES[i].id === id) return EUM.VENUES[i];
    return null;
  }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function nextDate(dayLetter) {
    var d = today(), target = DAY_IDX[dayLetter], diff = (target - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + diff);
    return (d.getMonth() + 1) + '/' + d.getDate() + '(' + dayLetter + ')';
  }
  function toast(msg, ms) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 2600);
  }

  /* ---------------- persistence ---------------- */
  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var o = JSON.parse(raw);
      if (o && Array.isArray(o.apps)) S.apps = o.apps;
      if (o && Array.isArray(o.res)) S.res = o.res;
    } catch (e) { /* ignore */ }
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ apps: S.apps, res: S.res })); } catch (e) { /* ignore */ }
  }
  function countPending() {
    var n = 0;
    S.apps.forEach(function (a) { if (a.status === '신청 완료') n++; });
    S.res.forEach(function (r) { if (r.status === '예약 완료') n++; });
    return n;
  }
  function refreshMyCount() {
    var n = countPending();
    var el = $('myCount');
    el.textContent = n;
    el.style.display = n ? 'flex' : 'none';
  }

  /* ---------------- tabs ---------------- */
  function setTab(tab) {
    S.tab = tab;
    Array.prototype.forEach.call(document.querySelectorAll('.view'), function (v) {
      v.classList.toggle('isActive', v.dataset.tab === tab);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
      var on = b.dataset.tab === tab;
      b.classList.toggle('isActive', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $('views').scrollTop = 0;
    if (tab === 'map') {
      setTimeout(function () {
        if (!mapReady) initMap();
        else if (map) map.invalidateSize();
      }, 60);
    }
  }

  /* ---------------- mentor list ---------------- */
  function gradeBadge(key) {
    var g = EUM.GRADES[key];
    return '<span class="grade ' + g.cls + '">' + g.name + '</span>';
  }
  function filteredMentors() {
    var q = S.q.trim().toLowerCase();
    return EUM.MENTORS.filter(function (m) {
      if (S.cat !== 'all' && m.cat !== S.cat) return false;
      if (S.mode !== 'all' && m.modes.indexOf(S.mode) === -1) return false;
      if (q) {
        var hay = (m.name + ' ' + m.career + ' ' + m.cat + ' ' + m.tags.join(' ')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }
  function renderMentors() {
    var list = filteredMentors(), box = $('mentorList');
    $('resultLabel').textContent = '선배 ' + list.length + '명';
    $('mentorEmpty').hidden = list.length > 0;
    box.innerHTML = list.map(function (m) {
      return '' +
        '<button class="mentorCard" data-mentor="' + m.id + '">' +
          '<div class="avatar" aria-hidden="true">' + esc(m.initial) + '</div>' +
          '<div class="mBody">' +
            '<div class="mTop"><span class="mName">' + esc(m.name) + '</span><span class="mAge">' + m.age + '세</span></div>' +
            '<div class="mCareer">' + esc(m.career) + '</div>' +
            '<div class="mBadges">' + gradeBadge(m.grade) +
              '<span class="verify">신원·범죄경력 검증완료</span></div>' +
            '<div class="mFoot">' +
              '<span class="modePill">' + m.modes.join(' · ') + '</span>' +
              '<span class="feeRow">회당 <b>' + comma(m.fee) + '원</b>' +
                (m.inSub ? '<span class="subTag">구독 포함</span>' : '') + '</span>' +
            '</div>' +
          '</div>' +
        '</button>';
    }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('[data-mentor]'), function (el) {
      el.addEventListener('click', function () { openMentorSheet(el.dataset.mentor); });
    });
  }

  /* ---------------- sheet ---------------- */
  function openSheet(html) {
    $('sheetBody').innerHTML = html;
    $('sheetBody').scrollTop = 0;
    $('scrim').hidden = false;
    requestAnimationFrame(function () {
      $('scrim').classList.add('show');
      $('sheet').classList.add('isOpen');
      $('sheet').setAttribute('aria-hidden', 'false');
    });
  }
  function closeSheet() {
    $('sheet').classList.remove('isOpen');
    $('sheet').setAttribute('aria-hidden', 'true');
    $('scrim').classList.remove('show');
    clearTimeout(sheetTimer);
    sheetTimer = setTimeout(function () { $('scrim').hidden = true; }, 260);
  }

  function openMentorSheet(id) {
    var m = mentorById(id);
    if (!m) return;
    S.mentorId = id;
    S.slot = 0;
    var g = EUM.GRADES[m.grade];
    var slots = m.slots.map(function (s, i) {
      return '<button class="slotChip' + (i === 0 ? ' isActive' : '') + '" data-slot="' + i + '">' +
        '<span class="scDay">' + s.d + '요일</span>' +
        '<span class="scTime">' + s.t + '</span>' +
        '<span class="scLen">' + s.len + '</span>' +
      '</button>';
    }).join('');

    var html = '' +
      '<div class="shHead">' +
        '<div class="shAvatar" aria-hidden="true">' + esc(m.initial) + '</div>' +
        '<div class="shHeadBody">' +
          '<div class="shName">' + esc(m.name) + '<span>' + m.age + '세</span></div>' +
          '<div class="shCareer">' + esc(m.career) + '</div>' +
          '<div class="shBadges">' + gradeBadge(m.grade) +
            '<span class="verify">신원·범죄경력 검증완료</span></div>' +
        '</div>' +
        '<button class="shClose" data-close aria-label="닫기">✕</button>' +
      '</div>' +
      '<div class="shStats">' +
        '<div class="shStat"><b>' + m.rating.toFixed(1) + '</b><span>학부모 만족도</span></div>' +
        '<div class="shStat"><b>' + m.sessions + '회</b><span>진행한 만남</span></div>' +
        '<div class="shStat"><b>' + g.rate.toLocaleString('ko-KR') + '원</b><span>' + g.name + ' 시급</span></div>' +
      '</div>' +
      '<p class="shIntro">' + esc(m.intro) + '</p>' +
      '<div class="shSubHead">이런 이야기를 나눠요</div>' +
      '<div class="shTags">' + m.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="shSubHead">첫 만남 시간 고르기 <em>' + m.modes.join(' · ') + ' 가능</em></div>' +
      '<div class="slotRow">' + slots + '</div>' +
      '<div class="shPrice"><span>' + (m.inSub ? '구독 포함 · 추가 결제 없음' : '회당 활동비') + '</span>' +
        '<b>' + comma(m.fee) + '원</b></div>' +
      '<button class="primaryBtn shCta" id="applyMentor">1:1 첫 만남 신청하기</button>' +
      '<p class="shFootNote">신청 후 선배가 수락하면 확정됩니다 · 첫 만남은 무료로 다시 잡을 수 있어요.</p>';

    openSheet(html);

    Array.prototype.forEach.call($('sheetBody').querySelectorAll('[data-slot]'), function (el) {
      el.addEventListener('click', function () {
        S.slot = Number(el.dataset.slot);
        Array.prototype.forEach.call($('sheetBody').querySelectorAll('[data-slot]'), function (b) {
          b.classList.toggle('isActive', b === el);
        });
      });
    });
    $('sheetBody').querySelector('[data-close]').addEventListener('click', closeSheet);
    $('applyMentor').addEventListener('click', function () { applyMentor(m); });
  }

  function applyMentor(m) {
    var s = m.slots[S.slot] || m.slots[0];
    var when = nextDate(s.d) + ' ' + s.t;
    var dup = S.apps.some(function (a) { return a.mentorId === m.id && a.when === when && a.status === '신청 완료'; });
    S.apps.unshift({
      type: 'mentor', mentorId: m.id, name: m.name, career: m.career,
      when: when, mode: m.modes[0], fee: m.fee, status: '신청 완료',
      at: new Date().toISOString()
    });
    saveState();
    refreshMyCount();
    closeSheet();
    toast(dup
      ? m.name + ' 선배와 ' + when + ' 신청이 이미 접수되어 있어요.'
      : m.name + ' 선배와 ' + when + ' 첫 만남을 신청했어요. 신청 내역에 담아 두었습니다.');
    renderMentors();
  }

  /* ---------------- venue sheet ---------------- */
  function openVenueSheet(id, progIdx) {
    var v = venueById(id);
    if (!v) return;
    S.venueId = id;
    S.prog = progIdx || 0;
    highlightVenue(id);

    var progs = v.programs.map(function (p, i) {
      var few = p.left <= 2;
      return '<button class="progBlock' + (i === S.prog ? ' isActive' : '') + '" data-prog="' + i + '">' +
        '<div class="progWhen">매주 ' + p.day + ' ' + p.time + ' · ' + p.len + '</div>' +
        '<div class="progTitle">' + esc(p.title) + '</div>' +
        '<div class="progMeta">' + esc(p.mentor) + ' 선배 · 정원 ' + p.cap + '명</div>' +
        '<span class="progLeft' + (few ? ' few' : '') + '">' +
          (p.left > 0 ? '남은 자리 ' + p.left + '석' : '대기 접수') + '</span>' +
      '</button>';
    }).join('');

    var html = '' +
      '<div class="vsHero">' +
        '<div class="vsArea">' + esc(v.area) + '</div>' +
        '<div class="vsName">' + esc(v.name) + '</div>' +
        '<div class="vsAddr">' + esc(v.addr) + '</div>' +
        '<span class="vsNote">' + esc(v.note) + '</span>' +
      '</div>' +
      '<div class="shSubHead">이번 주 세대교류 프로그램 <em>보호자 동반 가능</em></div>' +
      '<div id="progList">' + progs + '</div>' +
      '<div class="shPrice"><span>참가비</span><b>무료 · 재료비 5,000원</b></div>' +
      '<button class="primaryBtn terra shCta" id="reserveBtn">참여 예약하기</button>' +
      '<p class="shFootNote">예약 후 거점 담당 선생님이 하루 전에 안내 문자를 보냅니다.</p>';

    openSheet(html);

    Array.prototype.forEach.call($('sheetBody').querySelectorAll('[data-prog]'), function (el) {
      el.addEventListener('click', function () {
        S.prog = Number(el.dataset.prog);
        Array.prototype.forEach.call($('sheetBody').querySelectorAll('[data-prog]'), function (b) {
          b.classList.toggle('isActive', b === el);
        });
      });
    });
    $('reserveBtn').addEventListener('click', function () { reserve(v); });
  }

  function reserve(v) {
    var p = v.programs[S.prog];
    var when = nextDate(p.day) + ' ' + p.time;
    S.res.unshift({
      type: 'venue', venueId: v.id, name: v.name, program: p.title, mentor: p.mentor,
      when: when, status: '예약 완료', at: new Date().toISOString()
    });
    saveState();
    refreshMyCount();
    closeSheet();
    toast(v.name + ' · ' + when + ' 「' + p.title.slice(0, 16) + '…」 참여를 예약했어요.');
    renderVenues();
  }

  /* ---------------- venue list + map ---------------- */
  function highlightVenue(id) {
    Array.prototype.forEach.call($('venueList').querySelectorAll('[data-venue]'), function (el) {
      el.classList.toggle('isActive', el.dataset.venue === id);
    });
    Object.keys(markers).forEach(function (k) {
      var mk = markers[k];
      if (!mk || !mk.el) return;
      mk.el.classList.toggle('isActive', k === id);
    });
  }

  function renderVenues() {
    $('venueCount').textContent = EUM.VENUES.length + '곳';
    $('venueList').innerHTML = EUM.VENUES.map(function (v, i) {
      var p = v.programs[0];
      return '<button class="venueCard" data-venue="' + v.id + '">' +
        '<span class="vIndex">' + (i + 1) + '</span>' +
        '<div class="vBody">' +
          '<div class="vName">' + esc(v.name) + '</div>' +
          '<div class="vArea">' + esc(v.area) + ' · 프로그램 ' + v.programs.length + '개</div>' +
          '<div class="vProg">' +
            '<div class="vProgTime">매주 ' + p.day + ' ' + p.time + ' · ' + p.len + '</div>' +
            '<div class="vProgTitle">' + esc(p.title) + '</div>' +
            '<div class="vProgMeta">' + esc(p.mentor) + ' 선배 · 남은 자리 ' + p.left + '석</div>' +
          '</div>' +
        '</div>' +
      '</button>';
    }).join('');
    Array.prototype.forEach.call($('venueList').querySelectorAll('[data-venue]'), function (el) {
      el.addEventListener('click', function () { openVenueSheet(el.dataset.venue, 0); });
    });
  }

  function pinHtml(n, active) {
    return '<div class="pin' + (active ? ' isActive' : '') + '"><span>' + n + '</span></div>';
  }

  function initMap() {
    mapReady = true;
    if (!window.L) { buildFallbackMap(); return; }
    try {
      map = L.map('map', {
        zoomControl: false, attributionControl: true, scrollWheelZoom: false, tap: true
      });
      var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, minZoom: 8,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      var errs = 0, swapped = false;
      tiles.on('tileerror', function () {
        errs++;
        if (errs >= 8 && !swapped) {
          swapped = true;
          map.removeLayer(tiles);
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 18, attribution: 'Tiles &copy; Esri'
          }).addTo(map);
        }
      });

      var bounds = [];
      EUM.VENUES.forEach(function (v, i) {
        var icon = L.divIcon({
          className: 'pinWrap', html: pinHtml(i + 1), iconSize: [30, 30], iconAnchor: [15, 30]
        });
        var mk = L.marker([v.lat, v.lng], { icon: icon, title: v.name }).addTo(map);
        mk.on('click', function () { openVenueSheet(v.id, 0); });
        var node = mk.getElement();
        markers[v.id] = { marker: mk, el: node ? node.querySelector('.pin') : null };
        bounds.push([v.lat, v.lng]);
      });

      map.fitBounds(bounds, { padding: [34, 34] });
      setTimeout(function () { map.invalidateSize(); map.fitBounds(bounds, { padding: [34, 34] }); }, 120);
    } catch (e) {
      buildFallbackMap();
    }
  }

  function buildFallbackMap() {
    var box = $('map');
    box.innerHTML = '<div class="mapFallback" id="mapFallback"></div>';
    var fb = $('mapFallback');
    var lats = EUM.VENUES.map(function (v) { return v.lat; });
    var lngs = EUM.VENUES.map(function (v) { return v.lng; });
    var minLat = Math.min.apply(null, lats) - .03, maxLat = Math.max.apply(null, lats) + .03;
    var minLng = Math.min.apply(null, lngs) - .03, maxLng = Math.max.apply(null, lngs) + .03;
    EUM.VENUES.forEach(function (v, i) {
      var el = document.createElement('button');
      el.className = 'pinFallback';
      el.dataset.venue = v.id;
      el.textContent = i + 1;
      el.style.left = ((v.lng - minLng) / (maxLng - minLng) * 100) + '%';
      el.style.top = (((maxLat - v.lat) / (maxLat - minLat)) * 100) + '%';
      el.setAttribute('aria-label', v.name);
      el.addEventListener('click', function () { openVenueSheet(v.id, 0); });
      fb.appendChild(el);
    });
    var note = document.createElement('div');
    note.className = 'mapFallbackNote';
    note.textContent = '간이 지도 표시 중';
    fb.appendChild(note);
  }

  /* ---------------- safety tab ---------------- */
  function renderTalk() {
    var t = EUM.TALK[S.talk];
    $('talkQ').textContent = t.q;
    $('talkHint').textContent = t.hint;
    $('talkStep').textContent = (S.talk + 1) + ' / ' + EUM.TALK.length;
    $('talkDots').innerHTML = EUM.TALK.map(function (_, i) {
      return '<i class="' + (i <= S.talk ? 'on' : '') + '"></i>';
    }).join('');
    $('nextTalk').textContent = S.talk === EUM.TALK.length - 1 ? '대화 마치고 리포트 보기' : '다음 질문 넘기기';
  }
  function nextTalk() {
    if (S.talk >= EUM.TALK.length - 1) {
      toast('오늘의 세대 공감 대화를 모두 마쳤어요. 주간 리포트에 담아 두었습니다.');
      S.talk = 0;
      renderTalk();
      return;
    }
    S.talk++;
    renderTalk();
  }

  /* ---------------- simulator ---------------- */
  function renderSim() {
    var g = EUM.GRADES[S.grade];
    var ratio = (S.hours - 2) / 18;
    var total = Math.round(g.rate * S.hours * EUM.SIM.weeks / 1000) * 1000;
    $('simHourLabel').textContent = S.hours + '시간';
    $('simTotal').textContent = comma(total);
    $('simBreak').textContent = '주 ' + S.hours + '시간 × 4.3주 × ' + comma(g.rate) + '원';
    $('simB2G').textContent = '+ 월 ' + comma(EUM.SIM.b2g[S.grade]) + '원';
    $('simBonus').textContent = '+ 회당 ' + comma(EUM.SIM.bonus[S.grade]) + '원';
    $('hourRange').value = S.hours;
    $('hourRange').style.setProperty('--pct', (ratio * 100).toFixed(1) + '%');
    Array.prototype.forEach.call(document.querySelectorAll('.simGBtn'), function (b) {
      b.classList.toggle('isActive', b.dataset.grade === S.grade);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.quickChip'), function (b) {
      b.classList.toggle('isActive', Number(b.dataset.hours) === S.hours);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.ladderCard'), function (c) {
      c.classList.toggle('isActive', c.dataset.ladder === S.grade);
    });
    $('simNote').textContent = g.name + ' 기준 · 지자체 연계는 공고·정원에 따라 달라지며, 본 시뮬레이터는 참고용 추정치입니다.';
  }

  /* ---------------- modal ---------------- */
  function openModal(html) {
    $('modalCard').innerHTML = html;
    $('modal').classList.add('isOpen');
    $('modal').setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    $('modal').classList.remove('isOpen');
    $('modal').setAttribute('aria-hidden', 'true');
  }

  function openMyApplications() {
    var rows = '';
    S.apps.forEach(function (a) {
      rows += '<div class="appItem">' +
        '<div class="appTop"><span class="appName">' + esc(a.name) + ' 선배 · 첫 만남</span>' +
        '<span class="appTag">' + esc(a.status) + '</span></div>' +
        '<div class="appMeta">' + esc(a.when) + ' · ' + esc(a.mode) + ' · ' + comma(a.fee) + '원</div></div>';
    });
    S.res.forEach(function (r) {
      rows += '<div class="appItem">' +
        '<div class="appTop"><span class="appName">' + esc(r.name) + '</span>' +
        '<span class="appTag wait">' + esc(r.status) + '</span></div>' +
        '<div class="appMeta">' + esc(r.when) + ' · ' + esc(r.program) + '</div></div>';
    });
    var body = rows
      ? '<div class="mdList">' + rows + '</div>'
      : '<div class="mdEmpty"><div class="eIcon">🌱</div>' +
        '<p>아직 신청한 만남이 없어요.<br/>마음에 드는 선배를 찾아 첫 만남을 신청해 보세요.</p></div>';

    openModal('<div class="mdTitle">내 신청 내역</div>' +
      '<p class="mdText">선배님과의 첫 만남과 거점 프로그램 예약입니다.</p>' +
      body +
      '<div class="mdBtns"><button class="primaryBtn" data-close-modal>확인</button></div>');
  }

  /* ---------------- form ---------------- */
  function submitForm(e) {
    e.preventDefault();
    var name = $('fName').value.trim();
    var field = $('fField').value;
    var modeEl = document.querySelector('input[name="mode"]:checked');
    var mode = modeEl ? modeEl.value : '화상 1:1';
    var intro = $('fIntro').value.trim();
    var err = $('formErr');

    if (!name) {
      err.textContent = '이름을 적어 주세요.';
      err.hidden = false;
      $('fName').focus();
      return;
    }
    if (!field) {
      err.textContent = '전문 분야를 골라 주세요.';
      err.hidden = false;
      $('fField').focus();
      return;
    }
    err.hidden = true;

    openModal('<div class="mdIcon" aria-hidden="true">🌿</div>' +
      '<div class="mdTitle">지원서를 보냈습니다</div>' +
      '<p class="mdText">' + esc(name) + ' 선생님, 고맙습니다.<br/>' +
        '경험이 아이들의 지혜로 이어지도록 준비하겠습니다.</p>' +
      '<div class="mdList">' +
        '<div class="mdRow"><span>전문 분야</span><b>' + esc(field) + '</b></div>' +
        '<div class="mdRow"><span>희망 방식</span><b>' + esc(mode) + '</b></div>' +
        '<div class="mdRow"><span>다음 단계</span><b>3일 안에 전화 안내<br/>· 본인인증 → 범죄경력 조회</b></div>' +
        (intro ? '<div class="mdRow"><span>한 줄 소개</span><b>' + esc(intro) + '</b></div>' : '') +
      '</div>' +
      '<div class="mdBtns">' +
        '<button class="primaryBtn" data-close-modal>확인</button>' +
      '</div>');

    $('applyForm').reset();
    toast('지원서가 접수되었습니다. 3일 안에 안내드릴게요.');
  }

  /* ---------------- wiring ---------------- */
  function wire() {
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
      b.addEventListener('click', function () { setTab(b.dataset.tab); });
    });

    $('searchInput').addEventListener('input', function (e) {
      S.q = e.target.value;
      $('clearSearch').hidden = !S.q;
      renderMentors();
    });
    $('clearSearch').addEventListener('click', function () {
      S.q = '';
      $('searchInput').value = '';
      $('clearSearch').hidden = true;
      renderMentors();
      $('searchInput').focus();
    });

    Array.prototype.forEach.call($('catChips').querySelectorAll('.chip'), function (c) {
      c.addEventListener('click', function () {
        S.cat = c.dataset.cat;
        Array.prototype.forEach.call($('catChips').querySelectorAll('.chip'), function (b) {
          b.classList.toggle('isActive', b === c);
        });
        renderMentors();
      });
    });

    Array.prototype.forEach.call($('modeSeg').querySelectorAll('.seg'), function (c) {
      c.addEventListener('click', function () {
        S.mode = c.dataset.mode;
        Array.prototype.forEach.call($('modeSeg').querySelectorAll('.seg'), function (b) {
          b.classList.toggle('isActive', b === c);
        });
        renderMentors();
      });
    });

    $('resetFilter').addEventListener('click', function () {
      S.cat = 'all'; S.mode = 'all'; S.q = '';
      $('searchInput').value = ''; $('clearSearch').hidden = true;
      Array.prototype.forEach.call($('catChips').querySelectorAll('.chip'), function (b) {
        b.classList.toggle('isActive', b.dataset.cat === 'all');
      });
      Array.prototype.forEach.call($('modeSeg').querySelectorAll('.seg'), function (b) {
        b.classList.toggle('isActive', b.dataset.mode === 'all');
      });
      renderMentors();
    });

    $('scrim').addEventListener('click', closeSheet);
    $('sheetHandle').addEventListener('click', closeSheet);

    $('nextTalk').addEventListener('click', nextTalk);

    $('hourRange').addEventListener('input', function (e) {
      S.hours = Number(e.target.value);
      renderSim();
    });
    Array.prototype.forEach.call(document.querySelectorAll('.quickChip'), function (b) {
      b.addEventListener('click', function () { S.hours = Number(b.dataset.hours); renderSim(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.simGBtn'), function (b) {
      b.addEventListener('click', function () { S.grade = b.dataset.grade; renderSim(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.ladderCard'), function (c) {
      c.addEventListener('click', function () {
        S.grade = c.dataset.ladder;
        renderSim();
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    $('applyForm').addEventListener('submit', submitForm);
    $('myBtn').addEventListener('click', openMyApplications);

    $('modal').addEventListener('click', function (e) {
      if (e.target === $('modal') || e.target.closest('[data-close-modal]')) closeModal();
    });
    $('locateBtn').addEventListener('click', function () {
      if (map) {
        map.fitBounds(EUM.VENUES.map(function (v) { return [v.lat, v.lng]; }), { padding: [34, 34] });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if ($('modal').classList.contains('isOpen')) closeModal();
      else if ($('sheet').classList.contains('isOpen')) closeSheet();
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    loadState();
    refreshMyCount();
    renderMentors();
    renderVenues();
    renderTalk();
    renderSim();
    wire();
    document.documentElement.style.setProperty('--tap', '48px');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
