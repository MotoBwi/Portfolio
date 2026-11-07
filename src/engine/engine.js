/*
 * Build engine: a swarm of pastel "agent" cursors scans the page, then builds it layer by layer.
 * It works on any element marked data-layer (see components/Layer.jsx):
 *   - skeleton wireframes + selection boxes with dimension tags
 *   - typed text (data-type + data-full) with a caret
 *   - sparkles, hover selection boxes, auto-scroll "tour"
 * React owns the markup and the status pill; this module owns the imperative visuals
 * and reports its state through onChange().
 */

const PAL = ['#c4a7ff', '#ffd86b', '#6be4ff', '#ff9f7a', '#7dffb0', '#ff8fb5', '#f1ecee'];
const rnd = (a, b) => a + Math.random() * (b - a);

export function supportsEngine() {
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    'IntersectionObserver' in window &&
    !!window.Path2D
  );
}

export function createEngine(onChange) {
  if (!supportsEngine()) return null;

  const d = document;
  const $ = (s, r) => (r || d).querySelector(s);
  const $$ = (s, r) => Array.from((r || d).querySelectorAll(s));
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- state reported to React ---------- */
  const S = { bootOff: false, booted: false, done: 0, total: 0, complete: false, seconds: '0.0', touring: false, speed: 1, fxOff: false, hidden: false };
  const emit = () => onChange({ ...S });

  /* ---------- tracked timers and listeners (so destroy() is clean) ---------- */
  const timers = new Set();
  const later = (fn, ms) => {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  };
  const offs = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };

  /* ---------- DOM handles ---------- */
  const wfL = $('#wfLayer'), selL = $('#selLayer'), hov = $('#hov'), hovDim = $('#hovdim');
  const cv = $('#fx'), cx = cv.getContext('2d');

  let layers = [], io = null, queue = [], active = 0, starting = 0;
  let booted = false, bootOn = true, t0 = 0, raf = 0, tourRaf = 0, tlast = 0, destroyed = false;
  let W = 0, H = 0, dpr = 1;

  /* ---------- geometry helpers ---------- */
  function pageRect(el) {
    const r = el.getBoundingClientRect(), b = d.body.getBoundingClientRect();
    return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height };
  }
  function mkSel(host, r, o) {
    const e = d.createElement('div');
    e.className = 'sel' + (o.wf ? ' wf' : '') + (o.red ? ' red' : '');
    e.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
    e.innerHTML =
      '<i class="h a"></i><i class="h b"></i><i class="h c"></i><i class="h d"></i>' +
      `<em class="dim">${Math.round(r.w)} × ${Math.round(r.h)}</em>` +
      (o.caret ? '<u class="ibeam"></u>' : '');
    host.appendChild(e);
    return e;
  }

  /* ---------- canvas: agent cursors + sparkles ---------- */
  function fit() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const ARROW = new Path2D('M0 0 L0 15 L4 11.4 L6.9 18 L9.3 16.9 L6.5 10.4 L11.8 10.2 Z');
  const M = { x: 0, y: 0 };
  let hasMouse = false, lastMove = 0, hh = 0;
  const HL = 90, hist = [];
  const inContact = () => {
    const el = $('#contact'); if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < H * 0.7 && r.bottom > H * 0.25;
  };

  class Agent {
    constructor(i) {
      this.i = i; this.g = i % 4; this.c = PAL[i % PAL.length];
      this.x = rnd(0, W); this.y = rnd(0, H); this.vx = 0; this.vy = 0; this.rot = 0; this.ph = rnd(0, 6.28);
      this.mode = 'wander'; this.layer = null; this.next = 0; this.tx = this.x; this.ty = this.y; this.tr = []; this.f = 0;
      this.fol = i % 2 === 0; this.fi = Math.floor(i / 2);
    }
    step(dt, now, mActive) {
      let tx, ty, k = 1.6;
      if (bootOn) {
        const a = now * 0.0007 * (this.g % 2 ? 1 : -1) + this.g * 1.6, rr = 46 + this.g * 22;
        tx = W / 2 + Math.cos(a) * rr + Math.cos(this.ph + now * 0.004) * 14;
        ty = H / 2 + Math.sin(a) * rr * 0.85 + Math.sin(this.ph + now * 0.004) * 14;
        k = 16;
      } else if (this.mode === 'build' && this.layer) {
        const r = this.layer.getBoundingClientRect();
        tx = r.right - 12 + Math.sin(now * 0.01 + this.ph) * 5;
        ty = r.top + 12 + Math.cos(now * 0.012 + this.ph) * 5;
        k = 9;
      } else if (this.fol && mActive) {
        if (inContact()) {
          const ang = now * 0.0011 - 1.3 + this.fi * 0.42, R = 60 + (this.fi % 2) * 14;
          tx = M.x + Math.cos(ang) * R; ty = M.y + Math.sin(ang) * R;
        } else {
          const p = hist[(hh - (6 + this.fi * 6) + HL * 4) % HL] || M;
          tx = p.x + Math.sin(now * 0.004 + this.ph) * 6; ty = p.y + Math.cos(now * 0.004 + this.ph) * 6;
        }
        k = 11;
      } else {
        if (now > this.next) { this.tx = rnd(40, W - 40); this.ty = rnd(70, H - 90); this.next = now + rnd(1800, 4200); }
        tx = this.tx + Math.sin(now * 0.0015 + this.ph) * 16;
        ty = this.ty + Math.cos(now * 0.0013 + this.ph) * 16;
      }
      const c = 2 * Math.sqrt(k) * 0.88;
      this.vx += ((tx - this.x) * k - this.vx * c) * dt;
      this.vy += ((ty - this.y) * k - this.vy * c) * dt;
      const sp = Math.hypot(this.vx, this.vy);
      if (sp > 1500) { this.vx *= 1500 / sp; this.vy *= 1500 / sp; }
      this.x += this.vx * dt; this.y += this.vy * dt;
      const tr = sp > 70 ? Math.atan2(this.vy, this.vx) + Math.PI * 0.75 : 0;
      let df = tr - this.rot;
      while (df > Math.PI) df -= 6.283;
      while (df < -Math.PI) df += 6.283;
      this.rot += df * Math.min(1, dt * 9);
      if (this.f++ % 2 === 0) { this.tr.push({ x: this.x, y: this.y, r: this.rot }); if (this.tr.length > 3) this.tr.shift(); }
    }
    draw() {
      const al = [0.12, 0.22, 0.36];
      for (let i = 0; i < this.tr.length; i++) {
        const t = this.tr[i];
        cx.globalAlpha = al[i + 3 - this.tr.length] || 0.1;
        cx.save(); cx.translate(t.x, t.y); cx.rotate(t.r); cx.translate(-5, -9); cx.fillStyle = this.c; cx.fill(ARROW); cx.restore();
      }
      cx.globalAlpha = 1;
      cx.save(); cx.translate(this.x, this.y); cx.rotate(this.rot); cx.translate(-5, -9);
      cx.shadowColor = this.c; cx.shadowBlur = 9; cx.fillStyle = this.c; cx.fill(ARROW);
      cx.shadowBlur = 0; cx.lineWidth = 1; cx.strokeStyle = 'rgba(255,255,255,.75)'; cx.stroke(ARROW); cx.restore();
    }
  }
  let agents = [];

  const sp = [];
  function spark(x, y, c, k, vx, vy, l) {
    sp.push({ x, y, vx: vx || 0, vy: vy || 0, l: l || 1.5, m: l || 1.5, c: c || PAL[(Math.random() * PAL.length) | 0], k: k || (Math.random() < 0.5 ? '+' : 'x') });
  }
  function burst(layer) {
    const r = layer.getBoundingClientRect();
    [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]].forEach((p, i) => {
      for (let n = 0; n < 2; n++) spark(p[0], p[1], null, null, (i % 2 ? 1 : -1) * rnd(10, 40), rnd(-40, -8), 1.1);
    });
  }
  function drawSpark(dt) {
    for (let i = sp.length - 1; i >= 0; i--) {
      const p = sp[i]; p.l -= dt;
      if (p.l <= 0) { sp.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      const a = Math.min(1, (p.l / p.m) * 2.4, (p.m - p.l) * 6 + 0.15);
      cx.save(); cx.globalAlpha = a; cx.translate(p.x, p.y); if (p.k === 'x') cx.rotate(Math.PI / 4);
      cx.strokeStyle = p.c; cx.lineWidth = 2; cx.lineCap = 'round'; cx.shadowColor = p.c; cx.shadowBlur = 6;
      cx.beginPath(); cx.moveTo(-5, 0); cx.lineTo(5, 0); cx.moveTo(0, -5); cx.lineTo(0, 5); cx.stroke(); cx.restore();
    }
  }

  let last = 0;
  function frame(now) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    cx.clearRect(0, 0, W, H);
    hist[hh % HL] = { x: M.x, y: M.y }; hh++;
    if (!S.fxOff) {
      const act = hasMouse && (now - lastMove < 1500 || (inContact() && now - lastMove < 9000));
      for (const a of agents) { a.step(dt, now, act); a.draw(); }
      drawSpark(dt);
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- tour (auto scroll) ---------- */
  function tourTick(ts) {
    if (!S.touring) return;
    const dt = Math.min(0.05, (ts - tlast) / 1000); tlast = ts;
    const before = window.scrollY;
    window.scrollBy(0, 130 * S.speed * dt);
    if (Math.abs(window.scrollY - before) < 0.2 && window.scrollY > 10) { stopTour(); return; }
    tourRaf = requestAnimationFrame(tourTick);
  }
  function startTour() {
    if (S.touring) return;
    S.touring = true; tlast = performance.now(); emit();
    tourRaf = requestAnimationFrame(tourTick);
  }
  function stopTour() {
    if (!S.touring) return;
    S.touring = false; cancelAnimationFrame(tourRaf); emit();
  }

  /* ---------- build pipeline ---------- */
  const pickAgent = () => {
    const c = agents.filter((a) => a.mode === 'wander');
    return c.length ? c[(Math.random() * c.length) | 0] : null;
  };

  function countUp(el) {
    const to = +el.getAttribute('data-count'), t = performance.now();
    (function s(n) {
      if (destroyed) return;
      const p = Math.min(1, (n - t) / 1100);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(s);
    })(t);
  }

  function startBuild(layer) {
    active++;
    const r = pageRect(layer), isT = layer.hasAttribute('data-type'), isCard = layer.matches('.card,.mcell');
    if (layer.__wf) { layer.__wf.remove(); layer.__wf = null; }
    const sel = mkSel(selL, r, { red: isCard, caret: isT });
    const ag = pickAgent();
    if (ag) { ag.mode = 'build'; ag.layer = layer; }
    let car = null;

    function finish() {
      sel.classList.add('gone'); later(() => sel.remove(), 300);
      if (car) car.remove();
      layer.style.minHeight = '';
      burst(layer);
      $$('[data-count]', layer).forEach(countUp);
      if (layer.hasAttribute('data-count')) countUp(layer);
      if (ag) { ag.mode = 'wander'; ag.layer = null; ag.next = 0; }
      S.done++; active--; emit(); pump();
      if (S.done >= S.total && !S.complete) complete();
    }

    if (isT) {
      const full = layer.getAttribute('data-full') || layer.textContent;
      layer.style.minHeight = r.h + 'px'; layer.textContent = '';
      const tn = d.createTextNode('');
      car = d.createElement('span'); car.className = 'caret';
      layer.appendChild(tn); layer.appendChild(car); layer.classList.add('built');
      const cps = Math.max(60, full.length / 1.4), st = performance.now();
      (function t() {
        if (destroyed) return;
        const n = Math.min(full.length, Math.floor(((performance.now() - st) / 1000) * cps));
        tn.data = full.slice(0, n);
        if (n < full.length) later(t, 28); else later(finish, 220);
      })();
    } else {
      later(() => { layer.classList.add('built'); later(finish, 340); }, 300 + Math.min(450, (r.w * r.h) / 2800));
    }
  }

  function pump() {
    if (!booted) return;
    while (active + starting < 7 && queue.length) {
      const l = queue.shift(); starting++;
      later(() => { starting--; startBuild(l); }, starting * 110);
    }
  }

  function complete() {
    S.complete = true;
    S.seconds = ((performance.now() - t0) / 1000).toFixed(1);
    stopTour(); emit();
  }

  /* ---------- hover selection (Figma-style) ---------- */
  function onOver(e) {
    if (!booted || S.touring) return;
    const t = e.target.closest && e.target.closest('[data-layer].built');
    if (!t || t.matches('.card,.mcell,.mega,.portrait') || t.closest('.card,.mcell')) { hov.classList.remove('on'); return; }
    const r = t.getBoundingClientRect();
    hov.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
    hovDim.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
    hov.classList.add('on');
  }

  /* ---------- boot / reset / replay ---------- */
  function wireframes() {
    layers.forEach((l) => {
      if (l.hidden || l.classList.contains('built')) return;
      const r = l.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.width === 0) return;
      l.__wf = mkSel(wfL, pageRect(l), { wf: true });
    });
    for (let i = 0; i < 18; i++) spark(rnd(30, W - 30), rnd(60, H - 90), null, null, rnd(-6, 6), rnd(-6, 6), rnd(2, 3.2));
  }

  function begin() {
    t0 = performance.now();
    layers.forEach((l) => io.observe(l));
    later(() => {
      bootOn = false; S.bootOff = true;
      d.documentElement.classList.add('booted'); d.body.classList.add('booted');
      emit(); wireframes();
      later(() => { booted = true; S.booted = true; emit(); pump(); }, 450);
    }, 1500);
  }

  function reset() {
    queue.length = 0; active = 0; starting = 0; booted = false;
    timers.forEach(clearTimeout); timers.clear();
    if (io) io.disconnect();
    if (wfL) wfL.innerHTML = '';
    if (selL) selL.innerHTML = '';
    hov.classList.remove('on');
    layers.forEach((l) => {
      l.classList.remove('built'); l.__q = false; l.__wf = null;
      if (l.hasAttribute('data-full')) l.textContent = l.getAttribute('data-full');
      l.style.minHeight = '';
    });
    $$('[data-count]').forEach((e) => { e.textContent = e.getAttribute('data-count'); });
    d.documentElement.classList.remove('booted'); d.body.classList.remove('booted');
  }

  function replay() {
    stopTour(); reset();
    Object.assign(S, { done: 0, complete: false, booted: false, bootOff: false, hidden: false });
    bootOn = true; window.scrollTo(0, 0); emit();
    begin();
  }

  function start() {
    layers = $$('[data-layer]');
    S.total = layers.length;
    fit(); on(window, 'resize', fit);
    M.x = W / 2; M.y = H / 2;
    hist.length = 0; for (let i = 0; i < HL; i++) hist.push({ x: M.x, y: M.y });
    agents = Array.from({ length: window.innerWidth < 620 ? 9 : 14 }, (_, i) => new Agent(i));
    on(window, 'pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      M.x = e.clientX; M.y = e.clientY; hasMouse = true; lastMove = performance.now();
    }, { passive: true });
    ['wheel', 'touchstart', 'keydown'].forEach((ev) =>
      on(window, ev, (e) => { if (S.touring && !(e.target && e.target.closest && e.target.closest('#pill'))) stopTour(); }, { passive: true })
    );
    if (fine) on(d, 'mouseover', onOver);

    io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).map((e) => e.target);
      vis.sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return ra.top - rb.top || ra.left - rb.left;
      });
      vis.forEach((t) => { if (!t.__q) { t.__q = true; io.unobserve(t); queue.push(t); } });
      pump();
    }, { rootMargin: '0px 0px 12% 0px' });

    last = performance.now();
    raf = requestAnimationFrame(frame);
    emit();
    begin();
  }

  function destroy() {
    destroyed = true;
    cancelAnimationFrame(raf); cancelAnimationFrame(tourRaf);
    offs.forEach((f) => f()); offs.length = 0;
    reset();
    cx.clearRect(0, 0, W, H);
  }

  return {
    start, destroy, replay, stopTour,
    toggleTour: () => (S.touring ? stopTour() : startTour()),
    cycleSpeed: () => { S.speed = S.speed === 1 ? 2 : S.speed === 2 ? 3 : 1; emit(); },
    toggleFx: () => { S.fxOff = !S.fxOff; if (S.fxOff) cx.clearRect(0, 0, W, H); emit(); },
    hide: () => { S.hidden = true; emit(); },
  };
}
