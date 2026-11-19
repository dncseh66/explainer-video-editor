// Film kit for "The First Timer" (Wild West parlor house, chapter 10: The Door). Appended after person.js + scenes.js + film-helpers.js.
(function () {
  const W = window.W;
  const INK = '#2A2522';
  const f = (n) => (+n).toFixed(1);
  const st = (fill, w) => 'style="fill:' + fill + ';stroke:' + INK + ';stroke-width:' + (w || 4) + ';stroke-linejoin:round;stroke-linecap:round"';
  const ln = (c, w) => 'style="fill:none;stroke:' + c + ';stroke-width:' + w + ';stroke-linecap:round;stroke-linejoin:round"';
  const c01 = (x) => Math.max(0, Math.min(1, x));
  const seg = (t, a, b) => c01((t - a) / (b - a));
  const eio = (x) => { x = c01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const eo = (x) => 1 - Math.pow(1 - c01(x), 3);
  const lerp = (a, b, p) => a + (b - a) * p;
  const F = (W.F = { st, ln, f, INK, c01, seg, eio, eo, lerp });

  // frame: camera layer (svg + html that moves with camera) + fixed html overlay
  F.frame = (svg, camHtml, fixedHtml, o) => '<div class="ground"' + (o && o.bg ? ' style="background:' + o.bg + '"' : '') + '><div class="layer cam">' +
    '<svg class="art" viewBox="0 0 1920 1080">' + svg + '</svg>' + (camHtml || '') + '</div>' + (o && o.noVig ? '' : '<div class="vignette"></div>') + (fixedHtml || '') + '<div class="fade"></div></div>';
  F.tag = (text, x, y, cls, extra) => '<p class="hand-label tag ' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px;' + (extra || '') + '">' + text + '</p>';
  F.label = (text, x, y, size, cls, extra) => '<p class="hand-label ' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px;font-size:' + (size || 64) + 'px;' + (extra || '') + '">' + text + '</p>';
  F.cam = (el, t, t0, t1, s0, s1, ox, oy, dx, dy) => {
    const p = eio(seg(t, t0, t1));
    el.style.transformOrigin = (ox || 960) + 'px ' + (oy || 540) + 'px';
    el.style.transform = 'translate(' + f((dx || 0) * p) + 'px,' + f((dy || 0) * p) + 'px) scale(' + lerp(s0, s1, p).toFixed(4) + ')';
  };
  // shot in/out: quick fade from black at head, fade out at tail if asked
  F.fade = (root, t, dur, inD, outD) => {
    const el = root.querySelector('.fade'); if (!el) return;
    let a = 0;
    if (inD) a = Math.max(a, 1 - seg(t, 0, inD));
    if (outD) a = Math.max(a, seg(t, dur - outD, dur));
    el.style.opacity = a.toFixed(3);
  };
  F.show = (el, on) => { el.style.display = on ? '' : 'none'; };
  F.talk = (a, words) => { for (const w of words) if (a >= w[0] && a <= w[1]) return Math.floor(a * 9) % 2 ? 'talk' : 'neutral'; return null; };
  F.blink = (a, every, off) => { const k = (a + (off || 0)) % (every || 3.1); return k < 0.12 ? 0.1 : 1; };
  F.q = (root) => (c) => root.querySelector(c);
  F.wiggle = (a, amp, hz) => amp * Math.sin(a * (hz || 20));

  F.nightSky = (seed) => {
    const r = Math.random; let s = '<rect width="1920" height="1080" style="fill:#2F3A4F"/>' + W.glow(1500, 210, 520, '#6E7FA0', 0.35);
    let k = seed || 7; const rnd = () => ((k = (k * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 42; i++) { const x = rnd() * 1920, y = rnd() * 520; s += '<circle class="star" cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(2 + rnd() * 3) + '" style="fill:#F4EFD8"/>'; }
    s += '<circle cx="1500" cy="210" r="70" ' + st('#F4EFD8') + '/><circle cx="1530" cy="190" r="62" style="fill:#2F3A4F"/>';
    s += '<path d="M0 640 Q300 600 640 630 Q1000 660 1340 620 Q1660 590 1920 630 V1080 H0 Z" style="fill:#3E4A5E"/>';
    s += '<path d="M0 760 Q480 720 980 750 Q1460 780 1920 740 V1080 H0 Z" ' + st('#4A5568') + '/>';
    return s;
  };
  // ---------- editing: camera cuts (2026-11-13, Paper Billions pacing) ----------
  // F.CUTS[sceneStart] = [[absTime, zoom, centreX, centreY, glideSecs?], ...]: hard cut (or a smooth glide when glideSecs is set) to a new framing,
  // with a slow 2.5% push inside each framing. F.cam uses it automatically when the scene's start has an entry.
  F.CUTS = {};
  F.framing = (el, z, x, y) => {
    const hw = 960 / z, hh = 540 / z;
    x = Math.max(hw, Math.min(1920 - hw, x)); y = Math.max(hh, Math.min(1080 - hh, y));
    el.style.transformOrigin = '0 0';
    el.style.transform = 'translate(' + f(960 - x * z) + 'px,' + f(540 - y * z) + 'px) scale(' + z.toFixed(4) + ')';
  };
  const camOld = F.cam;
  F.cam = (el, t, t0, t1, s0, s1, ox, oy, dx, dy) => {
    const L = F.CUTS[(+t0).toFixed(1)];
    if (!L) return camOld(el, t, t0, t1, s0, s1, ox, oy, dx, dy);
    let i = 0; for (let k = 0; k < L.length; k++) if (t >= L[k][0]) i = k;
    const c = L[i], end = L[i + 1] ? L[i + 1][0] : t1, p = eio(seg(t, c[0], end));
    let z = c[1] * (1 + 0.025 * p), x = c[2], y = c[3];
    if (c[4] && i > 0 && t < c[0] + c[4]) {           // keyframe: glide from where the previous framing ended
      const P = L[i - 1], k = eio(seg(t, c[0], c[0] + c[4]));
      z = lerp(P[1] * 1.025, z, k); x = lerp(P[2], x, k); y = lerp(P[3], y, k);
    }
    F.framing(el, z, x, y);
  };
  F.card = (cls, text) => '<div class="' + cls + '" style="position:absolute;inset:0;background:#120F0D;display:flex;align-items:center;justify-content:center;z-index:5">' +
    '<p class="hand-label" style="left:0px;top:465px;width:1920px;text-align:center;font-size:130px;color:#F4EFD8">' + text + '</p></div>';

  // ---------- set dressing (detail lives in environments, not characters) ----------
  F.lamp = (x, y, s, cord) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + W.glow(0, 230, 330, '#FFF2C8', 0.5) +
    '<path d="M0 ' + -(cord || 300) + ' V-30" ' + ln(INK, 4) + '/><path d="M-70 30 Q-60 -30 0 -36 Q60 -30 70 30 Z" ' + st('#3E5A52') + '/><ellipse cx="0" cy="34" rx="26" ry="14" ' + st('#FFF6D8', 3) + '/></g>';
  F.picture = (x, y, w, h, kind) => '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" ' + st('#C79A3A', 5) + '/>' +
    '<rect x="' + (x + 12) + '" y="' + (y + 12) + '" width="' + (w - 24) + '" height="' + (h - 24) + '" style="fill:' + (kind === 'paper' ? '#FFFBEA' : '#BFE0F2') + '"/>' +
    (kind === 'paper' ? '<path d="M' + (x + 30) + ' ' + (y + 40) + ' h' + (w - 60) + ' M' + (x + 30) + ' ' + (y + 64) + ' h' + (w - 80) + ' M' + (x + 30) + ' ' + (y + 88) + ' h' + (w - 70) + '" ' + ln('rgba(42,37,34,.45)', 4) + '/><circle cx="' + (x + w - 40) + '" cy="' + (y + h - 40) + '" r="14" ' + st('#E0675A', 3) + '/>'
      : '<path d="M' + (x + 12) + ' ' + (y + h - 30) + ' l' + (w * 0.3) + ' -' + (h * 0.35) + ' l' + (w * 0.2) + ' ' + (h * 0.18) + ' l' + (w * 0.25) + ' -' + (h * 0.25) + ' l' + (w * 0.2) + ' ' + (h * 0.4) + '" style="fill:#7FB069;stroke:none"/>') + '</g>';
  F.clock = (x, y, r, cls) => '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" ' + st('#FFFDF4', 5) + '/>' +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => { const a = k * Math.PI / 6; return '<path d="M' + f(Math.sin(a) * r * 0.78) + ' ' + f(-Math.cos(a) * r * 0.78) + ' L' + f(Math.sin(a) * r * 0.88) + ' ' + f(-Math.cos(a) * r * 0.88) + '" ' + ln(INK, k % 3 ? 3 : 5) + '/>'; }).join('') +
    '<g class="' + cls + '-h"><path d="M0 0 V' + f(-r * 0.45) + '" ' + ln(INK, 7) + '/></g><g class="' + cls + '-m"><path d="M0 0 V' + f(-r * 0.7) + '" ' + ln(INK, 5) + '/></g><circle r="6" style="fill:' + INK + '"/></g>';
  // hands spin `turns` hours between t0 and t1 (time-passing gag), otherwise rest at 10:10
  F.spinClock = (root, cls, a, t0, t1, turns) => {
    const p = eio(seg(a, t0, t1)), hrs = 10 + (turns || 6) * p;
    const h = root.querySelector('.' + cls + '-h'), m = root.querySelector('.' + cls + '-m');
    if (h) h.setAttribute('transform', 'rotate(' + f(hrs * 30) + ')');
    if (m) m.setAttribute('transform', 'rotate(' + f((hrs % 1) * 360 + 60) + ')');
  };
  F.lantern = (x, y, s, on) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + (on === false ? '' : W.glow(0, 20, 260, '#FFD27A', 0.45)) +
    '<path d="M0 -120 V-50" ' + ln(INK, 4) + '/><path d="M-26 -50 h52 l-8 14 h-36 Z" ' + st('#4A3B2E', 3.5) + '/><rect x="-22" y="-36" width="44" height="62" rx="6" ' + st(on === false ? '#C9B79C' : '#FFE59A', 3.5) + '/><path d="M-26 26 h52 l-6 12 h-40 Z" ' + st('#4A3B2E', 3.5) + '/></g>';

  // ---------- timing + camera by script words ----------
  F.T = (i) => W.WS[i]; F.TE = (i) => W.WE[i];
  // L = [[time, zoom, cx, cy, glideSecs?], ...]: hard cut (or glide) between framings + slow 2.5% push inside each
  F.camL = (el, a, L, end) => {
    let i = 0; for (let k = 0; k < L.length; k++) if (a >= L[k][0]) i = k;
    const c = L[i], e = L[i + 1] ? L[i + 1][0] : end, p = eio(seg(a, c[0], e));
    let z = c[1] * (1 + 0.025 * p), x = c[2], y = c[3];
    if (c[4] && i > 0 && a < c[0] + c[4]) { const P = L[i - 1], k = eio(seg(a, c[0], c[0] + c[4])); z = lerp(P[1] * 1.025, z, k); x = lerp(P[2], x, k); y = lerp(P[3], y, k); }
    F.framing(el, z, x, y);
  };
  // ---------- shared sets ----------
  F.SIGNS = ['Dry goods', 'Barber', '', 'Land office', 'Saloon'];
  F.doorX = (i) => 192 + 384 * i;
  F.street = (M, cls) => W.bg.mainStreet(M, { blank: 2 }) + W.prop.hitchPost(560, 1010, 1, M) + W.prop.hitchPost(1340, 1010, 1, M) + W.prop.cactus(1840, 1070, 0.8);
  F.signs = (cls) => F.SIGNS.map((t, i) => t ? '<p class="hand-label ' + cls + '-s' + i + '" style="left:' + (F.doorX(i) - 150) + 'px;top:' + (760 + W.STREET_TOPS[i] + 46) + 'px;width:300px;text-align:center;font-size:' + (t.length > 9 ? 40 : 48) + 'px;transform-origin:50% 50%">' + t + '</p>' : '').join('');
  // furnished parlor (no people): side table + lamp, settee, piano right, clock
  F.parlor = (M, o) => { o = o || {}; return W.bg.parlor(M, o) + '<path d="M380 800 V690 M480 800 V690" ' + ln(INK, 14) + '/><path d="M380 800 V690 M480 800 V690" ' + ln('#6B4A2E', 8) + '/><rect x="350" y="672" width="160" height="22" rx="6" ' + st('#8C5A3A') + '/>' +
    W.prop.keroLamp(430, 672, 0.9, o.t || 0) + W.prop.settee(930, 860, 0.95, '#C9B48A') + (o.piano === false ? '' : W.prop.piano(1330, 830, 0.75)) + F.picture(1000, 250, 170, 130) + F.clock(1230, 330, 50, (o.clk || 'pc') + '-clk'); };

  // ---------- Wild West cast (one look per character for the whole film) ----------
  W.NARRATOR_WEST = { outfit: 'cowboy', color: '#D9C9A3', shade: '#BFAF8A', hair: 'short', hairColor: 'grey', facial: 'mustache', hatColor: '#6B4A2E', glasses: true, item: 'pointer', face: 0.35 };
  F.CAST = {
    ft:     { outfit: 'cowboy', color: '#A9C3D6', shade: '#8FAEC4', hair: 'short', hairColor: 'brown', face: 0.35 },
    hand2:  { outfit: 'cowboy', color: '#D8C08A', shade: '#C2A86F', facial: 'beard', hairColor: 'black', hatColor: '#8C6440', face: 0.3 },
    hand3:  { outfit: 'cowboy', color: '#C98A7A', shade: '#B07262', facial: 'stubble', hatColor: '#4E3B2C', face: -0.3 },
    madam:  { outfit: 'gown', hair: 'bun', hairColor: 'black', face: -0.3 },
    girl1:  { outfit: 'saloon', hair: 'curly', hairColor: 'red', face: -0.3 },
    girl2:  { outfit: 'saloon', color: '#D4A445', shade: '#B88A33', hair: 'long', hairColor: 'blond', face: -0.3 },
    pianist:{ outfit: 'barkeep', hat: 'bowler', facial: 'mustache', hairColor: 'black', face: -0.4 },
    baron:  { outfit: 'suit', hat: 'cowboy', hatColor: '#E8DCC0', facial: 'mustache', hairColor: 'grey', face: -0.3 },
    miner:  { outfit: 'tunic', color: '#8C6C4F', shade: '#715540', hat: 'bowler', hatColor: '#6B4A2E', facial: 'beard', hairColor: 'brown', face: -0.3 },
  };
  F.who = (cls, k, extra) => W.person(cls, Object.assign({}, F.CAST[k], extra || {}));

  // ---------- Wild West props ----------
  // close-up door: pine frame, planks, iron latch (bar pivots), paint cracks. Leaf hinges on its left edge.
  F.bigDoor = (cls, x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
    '<rect x="-330" y="-980" width="660" height="980" ' + st('#8C6440', 6) + '/><rect class="' + cls + '-frame" x="-330" y="-980" width="660" height="980" style="fill:none;stroke:#FFE59A;stroke-width:0"/>' +
    '<rect x="-270" y="-930" width="540" height="930" style="fill:#2A1E18"/><g class="' + cls + '-light">' + W.glow(0, -420, 560, '#FFB86B', 0.9) + '</g>' +
    '<g class="' + cls + '-leaf"><rect x="-270" y="-930" width="540" height="930" ' + st('#C9A06A', 6) + '/>' +
    [-135, 0, 135].map((xx) => '<path d="M' + xx + ' -930 V0" ' + ln('rgba(42,37,34,.45)', 4) + '/>').join('') +
    '<path d="M-250 -840 q60 -10 90 6 M60 -700 q40 -8 70 4 M-200 -260 q50 -6 80 8 M120 -160 q30 4 60 -6" ' + ln('rgba(42,37,34,.3)', 4) + '/>' +
    '<rect x="-270" y="-760" width="540" height="40" ' + st('#B08752', 4) + '/><rect x="-270" y="-220" width="540" height="40" ' + st('#B08752', 4) + '/>' +
    '<g class="' + cls + '-cracks" style="opacity:0"><path d="M-220 -600 l30 40 l-14 30 l26 46 M-60 -880 l-20 50 l18 30 M140 -520 l26 30 l-6 40 l30 36 M-120 -120 l40 -30 l20 20 M200 -840 l-30 40" ' + ln(INK, 4) + '/>' +
    '<path d="M-232 -560 l14 6 M160 -470 l10 12 M-40 -840 l12 4" ' + ln('#F3DDB0', 6) + '/></g>' +
    '<rect x="150" y="-520" width="70" height="90" rx="8" ' + st('#4F555C', 5) + '/><circle cx="185" cy="-500" r="9" style="fill:' + INK + '"/>' +
    '<g class="' + cls + '-bar"><rect x="160" y="-470" width="150" height="24" rx="10" ' + st('#5E646B', 5) + '/></g>' +
    '<rect x="-310" y="-860" width="80" height="34" rx="6" ' + st('#4F555C', 4) + '/><rect x="-310" y="-150" width="80" height="34" rx="6" ' + st('#4F555C', 4) + '/></g></g>';
  F.poseDoor = (root, cls, open, lift, cracks, frameGlow) => {
    const q = (n) => root.querySelector('.' + cls + n);
    q('-leaf').setAttribute('transform', 'translate(-270 0) scale(' + f(1 - 0.78 * open) + ' 1) translate(270 0)');
    q('-leaf').style.filter = 'brightness(' + f(1 - 0.35 * open) + ')';
    q('-bar').setAttribute('transform', 'rotate(' + f(-28 * lift) + ' 172 -458)');
    q('-light').style.opacity = open.toFixed(3);
    q('-cracks').style.opacity = cracks.toFixed(3);
    q('-frame').style.strokeWidth = f(16 * frameGlow);
  };
  // smell wisp: a wavy ribbon that grows along its path
  F.wisp = (cls, d, col, w) => '<path class="' + cls + '" d="' + d + '" style="fill:none;stroke:' + col + ';stroke-width:' + (w || 18) + ';stroke-linecap:round;opacity:0" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100"/>';
  F.drawWisp = (el, p, sway, a) => { el.setAttribute('stroke-dashoffset', f(100 * (1 - c01(p)))); el.style.opacity = p > 0 ? 0.85 : 0; if (sway) el.setAttribute('transform', 'translate(0 ' + f(sway * Math.sin(a * 2.4)) + ')'); };
  F.soap = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-80 0 L-70 -60 H70 L80 0 Z" ' + st('#EEE6C8') + '/><path d="M-70 -60 L-60 -80 H60 L70 -60" ' + st('#F7F1DC') + '/><path d="M-40 -40 h50" ' + ln('rgba(42,37,34,.3)', 5) + '/></g>';
  F.cigar = (x, y, s, rot) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + (s || 1) + ')"><rect x="-80" y="-12" width="150" height="24" rx="12" ' + st('#8C5A3A', 3.5) + '/><rect x="40" y="-12" width="16" height="24" ' + st('#C0503F', 3) + '/><rect x="70" y="-12" width="14" height="24" rx="6" ' + st('#B9B2A8', 3) + '/></g>';
  F.butt = (x, y, s, rot) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + (s || 1) + ')"><rect x="-30" y="-9" width="60" height="18" rx="8" ' + st('#7A5236', 3) + '/><rect x="18" y="-9" width="12" height="18" rx="5" ' + st('#9C958A', 3) + '/></g>';
  F.perfume = (cls, x, y, s) => '<g class="' + cls + '" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-70 0 Q-90 -70 -50 -110 H50 Q90 -70 70 0 Z" ' + st('#F2B5C4') + '/><path d="M-50 -60 Q0 -40 50 -60" ' + ln('rgba(255,255,255,.7)', 8) + '/>' +
    '<rect x="-16" y="-140" width="32" height="32" ' + st('#E3B341') + '/><path d="M16 -126 H70" ' + ln(INK, 6) + '/><circle class="' + cls + '-bulb" cx="96" cy="-126" r="28" ' + st('#B5503F') + '/></g>';
  F.hatIcon = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-50 -10 L-44 -80 Q-20 -96 0 -76 Q20 -96 44 -80 L50 -10 Z" ' + st('#B98A5F') + '/><path d="M-120 -30 Q-100 10 0 10 Q100 10 120 -30 Q90 30 0 30 Q-90 30 -120 -30 Z" ' + st('#B98A5F') + '/></g>';
  F.coins = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + [0, 1, 2, 3].map((i) => '<ellipse cx="' + (i % 2 ? 6 : -4) + '" cy="' + (-i * 22) + '" rx="56" ry="18" ' + st('#E3B341') + '/>').join('') + '</g>';
  F.watch = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M0 -70 V-96" ' + ln(INK, 8) + '/><circle cx="0" cy="-104" r="12" ' + ln(INK, 6) + '/><circle r="70" ' + st('#E3B341') + '/><circle r="56" ' + st('#FFFDF4', 3) + '/><path d="M0 0 V-40 M0 0 L28 10" ' + ln(INK, 6) + '/></g>';
  // glass jar for the "layers" of smell: layer i spans y -(i+1)*90 .. -i*90 and fills upward
  F.jar = (cls, x, y, s, cols) => '<g class="' + cls + '" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><g class="' + cls + '-in"><defs><clipPath id="' + cls + '-clip"><path d="M-170 -560 V-40 Q-170 0 -130 0 H130 Q170 0 170 -40 V-560 Z"/></clipPath></defs>' +
    '<path d="M-170 -560 V-40 Q-170 0 -130 0 H130 Q170 0 170 -40 V-560 Z" style="fill:rgba(235,245,250,.6)"/><g clip-path="url(#' + cls + '-clip)">' +
    cols.map((c, i) => '<rect class="' + cls + '-L' + i + '" x="-180" y="0" width="360" height="0" style="fill:' + c + '"/>').join('') + '</g>' +
    '<path d="M-170 -560 V-40 Q-170 0 -130 0 H130 Q170 0 170 -40 V-560" ' + ln(INK, 6) + '/><path d="M-130 -520 V-80" ' + ln('rgba(255,255,255,.75)', 14) + '/><rect x="-190" y="-600" width="380" height="44" rx="12" ' + st('#B98353') + '/></g></g>';
  // levels[i] 0..1; slot[i] = which band layer i sits in (default i)
  F.poseJar = (root, cls, levels, slot) => levels.forEach((p, i) => { const r = root.querySelector('.' + cls + '-L' + i); if (!r) return; p = c01(p); const k = slot && slot[i] != null ? slot[i] : i;
    r.setAttribute('y', f(-k * 90 - 90 * p)); r.setAttribute('height', f(90 * p + (p > 0 ? 1 : 0))); });
  F.coralX = (cls, s) => '<g class="' + cls + '"><path d="M-60 -60 L60 60 M60 -60 L-60 60" ' + ln(INK, 30 * (s || 1)) + '/><path d="M-60 -60 L60 60 M60 -60 L-60 60" ' + ln('#F08A7E', 18 * (s || 1)) + '/></g>';
  F.SMELLS = ['#E3B341', '#CFE6EE', '#8C6440', '#8A8F5A', '#F2A5B8']; // kerosene, lye, tobacco, sweet-sour, perfume
  F.qmark = (cls) => '<g class="' + cls + '"><path d="M-34 -40 Q-34 -88 6 -88 Q46 -88 46 -50 Q46 -20 12 -8 Q0 0 0 20" ' + ln(INK, 26) + '/><path d="M-34 -40 Q-34 -88 6 -88 Q46 -88 46 -50 Q46 -20 12 -8 Q0 0 0 20" ' + ln('#F08A7E', 16) + '/><circle cy="54" r="14" ' + st('#F08A7E') + '/></g>';
  F.back = (m) => { Object.values(m.ex).forEach((g) => (g.style.display = 'none')); m.expr = '__back'; };
  // ---------- the parlor room with its people (shared by several shots) ----------
  F.ROOM = { madam: [640, 1000, 1.25, 0], girl1: [835, 835, 1.1, 1], girl2: [1035, 835, 1.1, 1], pianist: [1330, 900, 1.0, 0], baron: [1600, 1000, 1.25, 0], miner: [1790, 1012, 1.25, 0] };
  F.room = (cls, M, o) => { o = o || {};
    return F.parlor(M, { clk: cls }) + '<rect x="110" y="300" width="200" height="500" style="fill:#2F3A4F"/>' + W.glow(210, 520, 160, '#6E7FA0', 0.4) +
      '<g class="' + cls + '-ft">' + F.who(cls + '-hero', 'ft') + '</g>' +
      '<g class="' + cls + '-leaf"><rect x="110" y="300" width="200" height="500" ' + st('#C9A06A', 5) + '/><path d="M176 300 V800 M243 300 V800" ' + ln('rgba(42,37,34,.4)', 4) + '/><rect x="270" y="540" width="22" height="34" rx="4" ' + st('#4F555C', 3) + '/></g>' +
      Object.keys(F.ROOM).map((k) => F.who(cls + '-' + k, k, k === 'pianist' ? { facial: 'none', face: 0 } : {})).join('') + (o.extra || ''); };
  F.bindRoom = (root, cls) => { const R = { root, cls, p: {} }; Object.keys(F.ROOM).forEach((k) => (R.p[k] = W.bindPerson(root, cls + '-' + k)));
    R.hero = W.bindPerson(root, cls + '-hero'); R.leaf = root.querySelector('.' + cls + '-leaf'); R.ft = root.querySelector('.' + cls + '-ft'); return R; };
  // st: {talk, turn (abs time heads snap to the door), play (pianist plays), door 0..1, hero: {x, show, expr, walk}}
  F.poseRoom = (R, a, st) => {
    st = st || {}; let i = 0;
    for (const k of Object.keys(F.ROOM)) {
      const [x, y, s, sit] = F.ROOM[k], m = R.p[k], turned = st.turn != null && a >= st.turn + i * 0.07;
      const talking = st.talk && !turned && Math.sin(a * 1.3 + i * 2.1) > -0.2;
      const P = { x, y, s, blink: F.blink(a, 2.6 + i * 0.4, i), head: talking ? 3 * Math.sin(a * 3 + i) : 0 };
      if (sit && k !== 'pianist') { const lg = (F.CAST[k].face || 0) < 0 ? 80 : -80; Object.assign(P, { legL: lg, legR: lg }); }
      if (k === 'pianist') { const pl = st.play && !turned; Object.assign(P, { y: 900, a1: -35 + (pl ? 10 * Math.sin(a * 14) : 0), a2: -40, b1: 35 + (pl ? 10 * Math.sin(a * 14 + 1.6) : 0), b2: 40, head: pl ? 3 * Math.sin(a * 7) : 0 });
        W.posePerson(m, P); F.back(m); i++; continue; }
      P.flip = !turned && (k === 'madam' || k === 'girl1');
      P.expr = turned ? (st.exprs && st.exprs[k]) || 'surprised' : talking ? (Math.floor(a * 9 + i * 3) % 2 ? 'talk' : 'happy') : (k === 'baron' ? 'smug' : 'happy');
      if (turned) P.sq = W.take(a, st.turn + i * 0.07);
      if (talking && k === 'baron') Object.assign(P, { a1: -40 + 10 * Math.sin(a * 4), a2: -50 });
      W.posePerson(m, P); i++;
    }
    const d = st.door || 0;
    R.leaf.setAttribute('transform', 'translate(110 0) scale(' + f(1 - 0.85 * d) + ' 1) translate(-110 0)');
    const h = st.hero || {}; R.ft.style.display = h.show ? '' : 'none';
    if (h.show) W.posePerson(R.hero, Object.assign({ x: h.x || 210, y: 800, s: 1.0, expr: h.expr || 'worried', blink: F.blink(a, 3) }, h.walk ? W.walk(a) : {}));
  };
  F.note = (cls, x, y, s, col) => '<g class="' + cls + '" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><g class="' + cls + '-in"><path d="M12 0 V-70 L46 -60 V-46 L12 -56" ' + st(col || INK, 4) + '/><ellipse cx="0" cy="0" rx="16" ry="12" ' + st(col || INK, 4) + '/></g></g>';
  F.ghost = (x, y, s, cls) => '<g class="' + (cls || '') + '" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')" style="opacity:0"><circle cx="0" cy="-250" r="60" style="fill:#5A4236"/><path d="M-90 -290 Q0 -262 90 -290 Q60 -276 54 -300 L44 -350 Q0 -370 -44 -350 L-54 -300 Q-60 -276 -90 -290 Z" style="fill:#5A4236"/><path d="M-40 -186 H40 L56 -60 H-56 Z M-30 -60 V0 M30 -60 V0" style="fill:#5A4236;stroke:#5A4236;stroke-width:16;stroke-linecap:round"/></g>';
  F.thought = (cls, x, y, w, h, inner) => '<g class="' + cls + '" transform="translate(' + x + ' ' + y + ')"><g class="' + cls + '-in"><circle cx="' + (-w / 2 + 30) + '" cy="' + (h / 2 + 70) + '" r="16" ' + st('#FFFDF4', 4) + '/><circle cx="' + (-w / 2 + 70) + '" cy="' + (h / 2 + 30) + '" r="26" ' + st('#FFFDF4', 4) + '/>' +
    '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2.4) + '" ' + st('#FFFDF4', 5) + '/>' + inner + '</g></g>';
  F.chandelier = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + W.glow(0, 40, 220, '#FFE59A', 0.8) + '<path d="M0 -120 V-20" ' + ln(INK, 5) + '/><path d="M-120 0 Q0 80 120 0" ' + ln('#E3B341', 12) + '/><path d="M-120 0 Q0 80 120 0" ' + ln(INK, 3) + '/>' +
    [-120, -60, 0, 60, 120].map((xx) => { const yy = xx === 0 ? 30 : Math.abs(xx) === 60 ? 22 : -4; return '<rect x="' + (xx - 8) + '" y="' + (yy - 40) + '" width="16" height="40" ' + st('#FFFDF4', 3) + '/><path d="M' + xx + ' ' + (yy - 42) + ' q8 -12 0 -26 q-8 14 0 26" style="fill:#FFB347"/>'; }).join('') + '</g>';
  F.bedroll = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><rect x="-110" y="-50" width="220" height="50" rx="25" ' + st('#7A8C6A') + '/><path d="M-60 -50 V0 M40 -50 V0" ' + ln('#4E3B2C', 6) + '/></g>';
  F.eyes = (cls, x, y, s) => '<g class="' + cls + '" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')" style="opacity:0"><ellipse cx="-22" cy="0" rx="9" ry="14" style="fill:#FFFDF4"/><ellipse cx="22" cy="0" rx="9" ry="14" style="fill:#FFFDF4"/></g>';
  F.haze = (cls, col) => '<rect class="' + cls + '" width="1920" height="1080" style="fill:' + col + ';opacity:0;mix-blend-mode:multiply"/>';

  // ---------- props added for chapter 10 part 2 (2026-11-19) ----------
  const G = (x, y, s, body, cls, rot) => '<g' + (cls ? ' class="' + cls + '"' : '') + '><g transform="translate(' + x + ' ' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + ' scale(' + (s || 1) + ')">' + body + '</g></g>'; // class on an outer <g>: W.pop/poofAt can't wipe the position
  F.G = G;
  F.chalkboard = (x, y, s) => G(x, y, s, '<path d="M-260 0 L-200 -520 M260 0 L200 -520 M0 -40 V-520" ' + ln(INK, 16) + '/><path d="M-260 0 L-200 -520 M260 0 L200 -520" ' + ln('#9C7246', 9) + '/><rect x="-300" y="-560" width="600" height="380" rx="12" ' + st('#8C6440', 6) + '/><rect x="-276" y="-536" width="552" height="332" rx="6" style="fill:#3E5A4C"/>');
  F.scale = (cls, x, y, s) => G(x, y, s, '<path d="M-140 0 H140 L100 -30 H-100 Z" ' + st('#8C6440') + '/><path d="M0 -30 V-420" ' + ln(INK, 18) + '/><path d="M0 -30 V-420" ' + ln('#C79A3A', 10) + '/><circle cy="-430" r="22" ' + st('#C79A3A') + '/>' +
    '<g class="' + cls + '-beam"><path d="M-330 -420 H330" ' + ln(INK, 18) + '/><path d="M-330 -420 H330" ' + ln('#C79A3A', 10) + '/>' +
    [-1, 1].map((k) => '<g class="' + cls + '-pan' + (k < 0 ? 'L' : 'R') + '" transform="translate(' + (k * 320) + ' -420)"><path d="M0 0 L-110 200 M0 0 L110 200" ' + ln(INK, 4) + '/><path d="M-140 200 H140 Q120 250 0 250 Q-120 250 -140 200 Z" ' + st('#C79A3A') + '/></g>').join('') + '</g>');
  F.poseScale = (root, cls, tilt) => { const b = root.querySelector('.' + cls + '-beam'); b.setAttribute('transform', 'rotate(' + f(tilt) + ' 0 -420)');
    ['L', 'R'].forEach((k, i) => { const p = root.querySelector('.' + cls + '-pan' + k); p.setAttribute('transform', 'translate(' + (i ? 320 : -320) + ' -420) rotate(' + f(-tilt) + ')'); }); };
  F.saddle = (x, y, s) => G(x, y, s, '<path d="M-150 0 Q-170 -90 -110 -110 Q-40 -60 40 -70 Q90 -150 140 -120 Q170 -40 150 0 Z" ' + st('#8C5A3A') + '/><path d="M-60 -60 V60 M-80 60 h40" ' + ln(INK, 6) + '/><path d="M110 -120 q10 -30 30 -24" ' + ln(INK, 8) + '/><path d="M-120 -40 Q0 0 130 -40" ' + ln('#5A3A22', 4) + '/>');
  F.horse = (x, y, s, flip) => G(x, y, s, '<g transform="scale(' + (flip ? -1 : 1) + ' 1)"><path d="M-150 -170 L-160 0 M-110 -160 L-104 0 M90 -170 L84 0 M130 -170 L140 0" ' + ln(INK, 16) + '/><path d="M-150 -170 L-160 0 M-110 -160 L-104 0 M90 -170 L84 0 M130 -170 L140 0" ' + ln('#A8743A', 9) + '/>' +
    '<ellipse cx="-10" cy="-200" rx="190" ry="80" ' + st('#A8743A') + '/><path d="M130 -240 L200 -360 Q240 -390 270 -350 L300 -300 Q300 -280 270 -280 L230 -290 L190 -200 Z" ' + st('#A8743A') + '/><path d="M140 -250 Q170 -330 200 -370" ' + ln('#4E3B2C', 14) + '/><path d="M-196 -220 Q-260 -180 -240 -100" ' + ln('#4E3B2C', 16) + '/><circle cx="250" cy="-340" r="6" style="fill:' + INK + '"/></g>');
  F.calendar = (cls, x, y, s) => G(x, y, s, '<rect x="-150" y="-170" width="300" height="320" rx="14" ' + st('#FFFDF4', 5) + '/><rect x="-150" y="-170" width="300" height="70" rx="14" ' + st('#C0503F', 5) + '/><path d="M-90 -190 v40 M90 -190 v40" ' + ln(INK, 10) + '/>' +
    Array.from({ length: 7 }, (_, i) => '<rect class="' + cls + '-d' + i + '" x="' + (-125 + (i % 4) * 64) + '" y="' + (-80 + Math.floor(i / 4) * 80) + '" width="52" height="60" rx="6" ' + st('#F3DDB0', 3) + '/>').join(''), cls);
  F.gears = (cls, x, y, s) => { const gear = (r, n) => { let d = ''; for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n, rr = i % 2 ? r : r * 1.25; d += (i ? 'L' : 'M') + f(rr * Math.cos(a)) + ' ' + f(rr * Math.sin(a)); } return '<path d="' + d + 'Z" ' + st('#A9B2BA', 4) + '/><circle r="' + f(r * 0.35) + '" ' + st('#FFFDF4', 4) + '/>'; };
    return G(x, y, s, '<g class="' + cls + '-a">' + gear(60, 8) + '</g><g class="' + cls + '-b" transform="translate(110 40)"><g class="' + cls + '-bi">' + gear(40, 6) + '</g></g>', cls); };
  F.book = (cls, x, y, s, inner) => G(x, y, s, '<rect x="-230" y="-320" width="460" height="640" rx="10" ' + st('#C0503F', 6) + '/><rect x="-200" y="-290" width="400" height="580" rx="4" style="fill:#2E2724"/>' + (inner || ''), cls);
  F.paper = (cls, x, y, s, inner) => G(x, y, s, '<path d="M-300 -380 H300 V380 H-300 Z" ' + st('#EFE6D0', 5) + '/>' + [-300, -260, 220, 260, 300].map((yy) => '<path d="M-250 ' + yy + ' H250" ' + ln('rgba(42,37,34,.45)', 8) + '/>').join('') + '<path d="M-250 -340 H250" ' + ln(INK, 18) + '/>' + (inner || ''), cls);
  F.bunk = (x, y, s, pal) => G(x, y, s, '<path d="M-220 0 V-420 M220 0 V-420" ' + ln(INK, 18) + '/><path d="M-220 0 V-420 M220 0 V-420" ' + ln('#8C6440', 10) + '/>' + [-60, -260].map((yy) => '<rect x="-220" y="' + (yy - 30) + '" width="440" height="30" ' + st('#8C6440') + '/><rect x="-200" y="' + (yy - 60) + '" width="400" height="34" rx="14" ' + st('#7A8C6A') + '/>').join(''));
  F.shield = (cls, x, y, s) => G(x, y, s, W.glow(0, -10, 260, '#FFE59A', 0.6) + '<path d="M-150 -170 Q0 -220 150 -170 Q160 40 0 170 Q-160 40 -150 -170 Z" ' + st('#E3B341', 6) + '/><path d="M-110 -130 Q0 -168 110 -130 Q116 30 0 126 Q-116 30 -110 -130 Z" ' + st('#FFF3CF', 4) + '/>' + F.chandelier(0, -30, 0.55), cls);
  F.revolver = (cls, x, y, s) => G(x, y, s, '<path d="M-60 -20 H200 V20 H-40 Z" ' + st('#E3B341', 5) + '/><rect x="-80" y="-44" width="110" height="80" rx="18" ' + st('#E3B341', 5) + '/><path d="M-80 30 L-120 150 L-60 160 L-30 36 Z" ' + st('#8C5A3A', 5) + '/><path d="M-40 36 Q-20 80 0 36" ' + ln(INK, 5) + '/>', cls);
  F.heart = (cls, x, y, s, col) => G(x, y, s, '<path class="' + cls + '-L" d="M0 70 L-110 -20 Q-150 -90 -90 -120 Q-30 -140 0 -80 L-20 -30 L10 10 L-10 40 Z" ' + st(col || '#F08A7E', 5) + '/><path class="' + cls + '-R" d="M0 70 L110 -20 Q150 -90 90 -120 Q30 -140 0 -80 L-20 -30 L10 10 L-10 40 Z" ' + st(col || '#F08A7E', 5) + '/>', cls);
  F.cloud = (cls, x, y, s) => G(x, y, s, '<path d="M-150 0 Q-170 -60 -110 -70 Q-100 -130 -30 -120 Q10 -170 70 -130 Q140 -140 140 -70 Q190 -50 160 0 Z" ' + st('#6F7984', 5) + '/><path d="M-90 20 l-10 40 M-20 20 l-10 50 M60 20 l-10 44 M120 16 l-8 30" ' + ln('#6F7984', 7) + '/>', cls);
  F.frameEmpty = (cls, x, y, s) => G(x, y, s, ['M-180 -140 H180', 'M180 -140 V140', 'M180 140 H-180', 'M-180 140 V-140'].map((d, i) => '<path class="' + cls + '-s' + i + '" d="' + d + '" ' + ln(INK, 40) + '/><path class="' + cls + '-t' + i + '" d="' + d + '" ' + ln('#C79A3A', 28) + '/>').join(''), cls);
  F.roll = (x, y, s, pal) => G(x, y, s, '<rect x="-60" y="-260" width="120" height="260" ' + st(pal ? pal.wall : '#C98F86') + '/>' + [-220, -150, -80].map((yy) => '<circle cx="0" cy="' + yy + '" r="14" style="fill:#EAD7A6"/>').join('') + '<ellipse cx="0" cy="-260" rx="60" ry="18" ' + st('#E8C6B8') + '/><circle cx="0" cy="-260" r="10" style="fill:' + INK + '"/>');
  F.catalog = (x, y, s) => G(x, y, s, '<rect x="-150" y="-200" width="300" height="200" rx="6" ' + st('#E8DCC0', 5) + '/><rect x="-150" y="-200" width="40" height="200" ' + st('#8C5A3A', 5) + '/><path d="M-80 -160 H110 M-80 -120 H90 M-80 -80 H110 M-80 -40 H70" ' + ln('rgba(42,37,34,.45)', 8) + '/>');
  F.letter = (x, y, s, rot) => G(x, y, s, '<rect x="-110" y="-140" width="220" height="280" ' + st('#F7F1DC', 4) + '/>' + [-90, -50, -10, 30, 70].map((yy) => '<path d="M-80 ' + yy + ' q40 -10 80 0 t70 0" ' + ln('rgba(42,37,34,.5)', 4) + '/>').join(''), '', rot);
  F.blocks = (cls, x, y, s) => G(x, y, s, [[-120, 0], [0, 0], [120, 0], [-60, -110], [60, -110], [0, -220]].map(([bx, by], i) => '<g class="' + cls + '-k' + i + '"><rect x="' + (bx - 56) + '" y="' + (by - 104) + '" width="112" height="104" rx="8" ' + st(['#F3DDB0', '#E7C08A', '#D9A86C'][i % 3], 5) + '/></g>').join(''), cls);
  F.priceTag = (cls, x, y, s) => G(x, y, s, '<path d="M-150 -70 H110 L170 0 L110 70 H-150 Z" ' + st('#F3DDB0', 6) + '/><circle cx="110" cy="0" r="14" ' + st('#FFFDF4', 4) + '/>', cls);
  F.suitcase = (x, y, s) => G(x, y, s, '<rect x="-80" y="-170" width="160" height="170" rx="16" ' + st('#4E8C8A', 5) + '/><path d="M-30 -170 V-200 H30 V-170" ' + ln(INK, 8) + '/><path d="M-40 -170 V0 M40 -170 V0" ' + ln('rgba(42,37,34,.35)', 6) + '/>');
  F.swatch = (cls, x, y, s, kind) => G(x, y, s, '<path d="M-180 -120 Q0 -150 180 -120 L170 130 Q0 100 -170 130 Z" ' + st(kind === 'silk' ? '#C77DA0' : '#EDE3C8', 5) + '/>' +
    (kind === 'silk' ? '<path d="M-140 -60 Q0 -100 150 -50 M-150 20 Q0 -20 150 30" ' + ln('rgba(255,255,255,.75)', 14) + '/>' : [-120, -40, 40, 120].map((xx) => [-70, 0, 70].map((yy) => '<circle cx="' + xx + '" cy="' + yy + '" r="12" style="fill:#B5503F;opacity:.7"/>').join('')).join('')), cls);
  F.doily = (cls, x, y, s) => G(x, y, s, '<ellipse rx="150" ry="70" ' + st('#FFFDF4', 4) + '/>' + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => '<circle cx="' + f(110 * Math.cos(i * Math.PI / 4)) + '" cy="' + f(50 * Math.sin(i * Math.PI / 4)) + '" r="16" ' + ln('#C9B79C', 4) + '/>').join('') + '<ellipse rx="60" ry="26" ' + ln('#C9B79C', 4) + '/>', cls);
  F.timerRing = (cls, x, y, r) => '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" ' + st('#FFFDF4', 6) + '/><circle class="' + cls + '" r="' + (r * 0.75) + '" pathLength="100" stroke-dasharray="0 100" transform="rotate(-90)" style="fill:none;stroke:#F08A7E;stroke-width:' + (r * 0.5) + '"/></g>';
  F.poof = (cls, x, y, s) => G(x, y, s, [[0, 0, 70], [-80, -20, 50], [80, -10, 54], [-40, 50, 44], [50, 50, 46], [0, -70, 48]].map(([a, b, r]) => '<circle cx="' + a + '" cy="' + b + '" r="' + r + '" style="fill:#FFFDF4;stroke:#2A2522;stroke-width:4"/>').join(''), cls);
  // poof helper: scale up + fade (0..1)
  F.poofAt = (el, a, t0) => { const p = F.c01((a - t0) / 0.45); el.style.opacity = a < t0 || p >= 1 ? 0 : (1 - p).toFixed(2); el.style.transformBox = 'fill-box'; el.style.transformOrigin = '50% 50%'; el.style.transform = 'scale(' + (0.4 + 0.9 * p).toFixed(3) + ')'; };

  // ---------- props added for chapter 9 (2026-11-19) ----------
  F.bottle = (x, y, s) => G(x, y, s, '<path d="M-14 -150 h28 v40 q30 16 30 50 v100 q0 10 -10 10 h-68 q-10 0 -10 -10 v-100 q0 -34 30 -50 Z" ' + st('#8C5A2A', 4) + '/><rect x="-30" y="-60" width="60" height="40" rx="4" ' + st('#F3DDB0', 3) + '/><rect x="-16" y="-170" width="32" height="22" rx="4" ' + st('#4E3B2C', 3) + '/>');
  F.glass = (x, y, s, full) => G(x, y, s, '<path d="M-30 -70 L-24 0 H24 L30 -70 Z" style="fill:rgba(235,245,250,.7);stroke:' + INK + ';stroke-width:4"/>' + (full === false ? '' : '<path d="M-27 -36 L-24 0 H24 L27 -36 Z" style="fill:#C98A3A"/>'));
  F.roundTable = (x, y, s) => G(x, y, s, '<path d="M0 -110 V0 M-60 0 H60" ' + ln(INK, 16) + '/><path d="M0 -110 V0" ' + ln('#8C5A3A', 9) + '/><ellipse cx="0" cy="-120" rx="170" ry="34" ' + st('#A8743A', 5) + '/>');
  F.chair = (x, y, s, flip) => G(x, y, s, '<g transform="scale(' + (flip ? -1 : 1) + ' 1)"><path d="M-40 0 V-90 H40 V0 M40 -90 V-200" ' + ln(INK, 14) + '/><path d="M-40 0 V-90 H40 V0 M40 -90 V-200" ' + ln('#8C5A3A', 7) + '/><rect x="-50" y="-100" width="100" height="18" rx="4" ' + st('#A8743A', 4) + '/></g>');
  F.batwing = (cls, x, y, s) => G(x, y, s, [-1, 1].map((k) => '<g class="' + cls + '-' + (k < 0 ? 'L' : 'R') + '"><path d="M' + (k * 6) + ' -200 H' + (k * 110) + ' V-60 H' + (k * 6) + ' Z" ' + st('#A8743A', 5) + '/><path d="M' + (k * 30) + ' -180 V-80 M' + (k * 60) + ' -180 V-80 M' + (k * 90) + ' -180 V-80" ' + ln('rgba(42,37,34,.4)', 4) + '/></g>').join(''), cls);
  F.poseBatwing = (root, cls, open) => ['L', 'R'].forEach((k, i) => { const el = root.querySelector('.' + cls + '-' + k); el.setAttribute('transform', 'scale(' + f(1 - 0.75 * open) + ' 1)'); });
  F.saloon = (M, o) => { o = o || {}; const r = (n) => n; let s = '<rect width="1920" height="1080" style="fill:#A8743A"/>';
    for (let x = 0; x < 1920; x += 80) s += '<path d="M' + x + ' 0 V760" ' + ln('rgba(42,37,34,.3)', 4) + '/>';
    s += '<rect y="0" width="1920" height="60" style="fill:#8C5A3A"/>' + W.glow(960, 200, 900, '#FFD58A', 0.3);
    s += '<rect x="1180" y="180" width="660" height="20" ' + st('#6B4A2E') + '/><rect x="1180" y="330" width="660" height="20" ' + st('#6B4A2E') + '/>';
    for (let i = 0; i < 9; i++) s += F.bottle(1220 + i * 70, 180, 0.5 + (i % 3) * 0.08) + F.bottle(1240 + i * 66, 330, 0.55);
    s += '<rect x="1200" y="380" width="620" height="200" rx="6" ' + st('#C9A06A') + '/><rect x="1260" y="400" width="500" height="160" style="fill:#BFE3F0;opacity:.6"/>';
    s += '<rect y="760" width="1920" height="320" style="fill:#7A5236"/><path d="M0 760 H1920" ' + ln(INK, 4) + '/>'; for (let x = -200; x < 2200; x += 160) s += '<path d="M' + x + ' 1080 L' + f(960 + (x - 960) * 0.5) + ' 760" ' + ln('rgba(42,37,34,.3)', 3) + '/>';
    if (o.bar !== false) s += '<rect x="1100" y="600" width="820" height="200" ' + st('#6B4A2E', 5) + '/><rect x="1080" y="590" width="860" height="30" rx="6" ' + st('#8C5A3A', 5) + '/>' + [1180, 1360, 1540, 1720].map((x) => '<rect x="' + x + '" y="640" width="120" height="130" rx="6" ' + ln('rgba(42,37,34,.4)', 4) + '/>').join('');
    if (o.door !== false) s += '<rect x="60" y="220" width="300" height="540" style="fill:#F4E2B8"/><rect x="60" y="220" width="300" height="540" ' + ln(INK, 6) + '/>' + W.glow(210, 500, 260, '#FFF6D8', 0.5);
    if (o.window !== false) s += '<rect x="520" y="200" width="320" height="260" rx="6" ' + st('#F4E2B8', 6) + '/><path d="M680 200 V460 M520 330 H840" ' + ln(INK, 5) + '/>';
    return s; };
  F.cow = (x, y, s, flip, lying) => G(x, y, s, '<g transform="scale(' + (flip ? -1 : 1) + ' 1)">' + (lying ? '' : '<path d="M-90 -80 V0 M-60 -80 V0 M60 -80 V0 M90 -80 V0" ' + ln(INK, 12) + '/>') +
    '<ellipse cx="0" cy="' + (lying ? -50 : -110) + '" rx="130" ry="60" ' + st('#C9A27A', 5) + '/><path d="M-40 ' + (lying ? -90 : -150) + ' q30 30 0 60" style="fill:#7A5236"/><g transform="translate(130 ' + (lying ? -70 : -140) + ')"><ellipse cx="20" cy="0" rx="40" ry="30" ' + st('#C9A27A', 5) + '/><path d="M0 -24 q-30 -30 -50 -20 M40 -24 q30 -30 50 -20" ' + ln('#F3DDB0', 8) + '/><path d="M0 -24 q-30 -30 -50 -20 M40 -24 q30 -30 50 -20" ' + ln(INK, 3) + '/><circle cx="30" cy="-4" r="4" style="fill:' + INK + '"/></g></g>');
  F.bible = (cls, x, y, s) => G(x, y, s, '<rect x="-150" y="-200" width="300" height="400" rx="12" ' + st('#3E2A22', 6) + '/><path d="M0 -120 V80 M-60 -60 H60" ' + ln('#E3B341', 14) + '/><rect x="140" y="-190" width="16" height="380" ' + st('#F3DDB0', 3) + '/>', cls);
  F.box = (cls, x, y, s) => G(x, y, s, '<path d="M-200 -220 H200 V0 H-200 Z" ' + st('#B98353', 6) + '/><path d="M-200 -220 L-160 -270 H240 L200 -220 M200 0 L240 -50 V-270" ' + st('#9C6E44', 5) + '/><path d="M-150 -170 H150" ' + ln('rgba(42,37,34,.3)', 6) + '/>', cls);
  F.battery = (cls, x, y, s) => G(x, y, s, '<rect x="-180" y="-80" width="340" height="160" rx="20" ' + st('#FFFDF4', 8) + '/><rect x="160" y="-34" width="34" height="68" rx="8" ' + st('#2A2522', 4) + '/><rect class="' + cls + '-lv" x="-160" y="-60" width="300" height="120" rx="10" style="fill:#7FB069"/>', cls);
  F.rope = (cls, x, y, w) => '<g class="' + cls + '"><path class="' + cls + '-a" d="M' + (x - w / 2) + ' ' + y + ' H' + x + '" ' + ln('#C9A27A', 18) + '/><path class="' + cls + '-b" d="M' + x + ' ' + y + ' H' + (x + w / 2) + '" ' + ln('#C9A27A', 18) + '/></g>';
  F.cart = (x, y, s) => G(x, y, s, '<rect x="-150" y="-200" width="300" height="140" rx="10" ' + st('#C0503F', 5) + '/><path d="M-170 -200 L-120 -280 H120 L170 -200 Z" ' + st('#F3DDB0', 5) + '/><circle cx="-90" cy="-40" r="40" ' + st('#6B4A2E', 5) + '/><circle cx="90" cy="-40" r="40" ' + st('#6B4A2E', 5) + '/><path d="M-120 -230 h240" ' + ln('#C0503F', 8) + '/>');
  F.diner = (x, y, s) => G(x, y, s, '<rect x="-240" y="-420" width="480" height="420" ' + st('#EFE6D6', 6) + '/><path d="M-260 -420 H260 L240 -480 H-240 Z" ' + st('#3E5A8C', 5) + '/><rect x="-60" y="-200" width="120" height="200" ' + st('#7A5236', 5) + '/><rect x="-200" y="-320" width="110" height="110" ' + st('#FFE59A', 5) + '/><rect x="90" y="-320" width="110" height="110" ' + st('#FFE59A', 5) + '/>' + W.glow(0, -260, 300, '#FFE59A', 0.35));
  F.trophy = (x, y, s) => G(x, y, s, '<path d="M-60 -160 H60 Q60 -60 0 -40 Q-60 -60 -60 -160 Z" ' + st('#E3B341', 5) + '/><path d="M-60 -140 Q-110 -130 -70 -80 M60 -140 Q110 -130 70 -80" ' + ln(INK, 6) + '/><rect x="-14" y="-40" width="28" height="30" ' + st('#C79A3A', 4) + '/><rect x="-50" y="-12" width="100" height="16" rx="4" ' + st('#C79A3A', 4) + '/>');
  F.bunting = (x, y, w) => '<path d="M' + x + ' ' + y + ' Q' + (x + w / 2) + ' ' + (y + 60) + ' ' + (x + w) + ' ' + y + '" ' + ln(INK, 4) + '/>' + Array.from({ length: 8 }, (_, i) => { const t = (i + 0.5) / 8, px = x + w * t, py = y + 60 * 4 * t * (1 - t) * 0.5 * 2 / 2 + 2; return '<path d="M' + f(px - 22) + ' ' + f(py) + ' L' + f(px + 22) + ' ' + f(py) + ' L' + f(px) + ' ' + f(py + 44) + ' Z" ' + st(['#F08A7E', '#E3B341', '#7FB069', '#9ED3EE'][i % 4], 3) + '/>'; }).join('');
  F.redLamp = (x, y, s, t) => G(x, y, s, W.glow(0, 0, 220, '#E0675A', 0.6) + '<path d="M0 -60 V-30" ' + ln(INK, 5) + '/><path d="M-26 -30 h52 l-6 10 h-40 Z" ' + st('#4A3B2E', 3) + '/><rect x="-22" y="-20" width="44" height="54" rx="6" ' + st('#E0675A', 4) + '/>');
  F.trailMap = () => { const land = 'M0 0 H1920 V1080 H0 Z'; return W.bg.sea(W.MOODS.mapSea) + W.style.land('M180 60 H1780 V1020 H180 Z') +
    '<path d="M1060 1020 L1000 860 L1080 700 L1040 560 L1100 420 L1200 300 L1500 300 L1500 60" ' + ln('rgba(42,37,34,.25)', 5) + '/><path d="M180 520 H1780 M780 60 V1020" style="fill:none;stroke:rgba(42,37,34,.18);stroke-width:4;stroke-dasharray:14 14"/>'; };


  // ---------- scene helpers (2026-11-19) ----------
  // F.scn(kit, id, {init(kit), render(a, t)}): this.S/this.E set, render gets absolute VO time a
  F.scn = (kit, id, o) => kit.scene(id, { init(k) { this.S = k.start; this.E = k.start + k.dur; this.root = k.stage; return o.init.call(this, k); }, render(t) { return o.render.call(this, t + this.S, t); } });
  F.add = (self, k, svg, camHtml, fixedHtml, opt) => { k.stage.append(k.h(F.frame(svg, camHtml || '', fixedHtml || '', opt))); self.cam = k.stage.querySelector('.cam'); return F.q(k.stage); };
  // chapter title: narrator on the prairie says "Number N", card drops in. words = [numberWord, titleWord]
  F.chapterTitle = (kit, id, num, title, wNum, wTitle) => F.scn(kit, id, {
    init(k) { const M = W.MOODS.prairieDust;
      const bg = '<rect width="1920" height="1080" style="fill:' + M.sky + '"/>' + W.glow(1500, 200, 420, '#FFF6D8', 0.8) + '<path d="M0 560 L220 560 L260 470 L520 470 L560 560 L1320 560 L1350 500 L1560 500 L1590 560 L1920 560 V700 H0 Z" ' + st(M.mesa, 3) + '/>' +
        '<rect y="680" width="1920" height="400" style="fill:' + M.floor + '"/><path d="M0 680 H1920" ' + ln(INK, 4) + '/>' + W.prop.cactus(1380, 960, 1.2) + W.person(id + '-n', W.NARRATOR_WEST);
      const q = F.add(this, k, bg, '', '<div class="' + id + '-pg" style="position:absolute;inset:0;background:#FFFFFF;display:none"><p class="hand-label ' + id + '-num" style="left:0px;top:150px;width:1920px;text-align:center;font-size:640px;line-height:1;transform-origin:50% 100%">' + num + '</p>' +
        '<p class="hand-label ' + id + '-tt" style="left:0px;top:840px;width:1920px;text-align:center;font-size:130px;transform-origin:50% 50%">' + title + '</p></div>');
      this.m = W.bindPerson(k.stage, id + '-n'); this.pg = q('.' + id + '-pg'); this.num = q('.' + id + '-num'); this.tt = q('.' + id + '-tt'); },
    render(a, t) { F.framing(this.cam, 1, 960, 560); F.show(this.pg, a >= F.T(wNum) - 0.25);
      W.posePerson(this.m, { x: 560, y: 990, s: 2.6, expr: F.talk(a, [[this.S, F.T(wNum)]]) || 'smug', blink: F.blink(a, 2.7), a1: -60, a2: -20 });
      W.drop(this.num, a, F.T(wNum) - 0.22, F.T(wNum), 900); W.pop(this.tt, a, F.T(wTitle)); F.fade(this.root, t, this.E - this.S, 0.25, 0); } });

  // ---------- the cut list for this film: [time (s, VO clock), zoom, centre x, centre y] ----------
  // wide = 1.0 · medium ≈ 1.4–1.6 · face close-up ≈ 2.0–2.6 · insert = object close-up
  // Rule (user feedback 2026-11-13): only cut or zoom when it shows something the wide shot can't; glide (keyframe) when following a row.
  Object.assign(F.CUTS, {
    //@@CUTS@@
  });
})();
