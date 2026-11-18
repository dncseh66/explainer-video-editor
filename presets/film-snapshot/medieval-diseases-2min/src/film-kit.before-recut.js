// Film kit for "10 Medieval Diseases" (typhus chapter). Appended after person.js + scenes.js + film-helpers.js.
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

  // ---------- props ----------
  // body louse, centred at 0,0, head up, ~230 long at s=1. body colour: white for diagrams, tan in scenes
  F.louse = (cls, col, shadow) => {
    col = col || '#FFFFFF';
    const leg = (side, y, a) => '<path d="M' + f(side * 30) + ' ' + y + ' Q' + f(side * 78) + ' ' + f(y + a) + ' ' + f(side * 92) + ' ' + f(y + a + 40) + ' l' + f(side * 10) + ' 6" ' + ln(INK, 7) + '/>';
    const legs = (side) => '<g class="' + cls + '-legs' + (side > 0 ? 'R' : 'L') + '">' + leg(side, -78, -30) + leg(side, -62, -6) + leg(side, -48, 22) + '</g>';
    const body =
      '<ellipse cx="0" cy="40" rx="62" ry="88" ' + st(col, 5) + '/>' +
      '<ellipse class="' + cls + '-gut" cx="0" cy="44" rx="34" ry="52" style="fill:#E0675A;opacity:.0"/>' +
      [8, 34, 60, 86].map((y) => '<path d="M' + f(-Math.sqrt(1 - Math.pow((y - 40) / 88, 2)) * 58) + ' ' + y + ' Q0 ' + (y + 12) + ' ' + f(Math.sqrt(1 - Math.pow((y - 40) / 88, 2)) * 58) + ' ' + y + '" ' + ln(INK, 3.5) + '/>').join('') +
      '<ellipse cx="0" cy="-62" rx="38" ry="30" ' + st(col, 5) + '/>' +
      '<ellipse cx="0" cy="-108" rx="24" ry="22" ' + st(col, 5) + '/>' +
      '<path d="M-12 -126 Q-30 -160 -46 -166 M12 -126 Q30 -160 46 -166" ' + ln(INK, 5) + '/>' +
      '<circle cx="-9" cy="-112" r="4" style="fill:' + INK + '"/><circle cx="9" cy="-112" r="4" style="fill:' + INK + '"/>';
    const sh = shadow ? '<g transform="translate(-14 12)" style="opacity:1">' + body.replace(/fill:[^;"]+/g, 'fill:#BFE0F2').replace(/stroke:[^;"]+/g, 'stroke:#BFE0F2') + '</g>' : '';
    return '<g class="' + cls + '"><g class="' + cls + '-in">' + legs(-1) + legs(1) + sh + body + '</g></g>';
  };
  F.poseLouse = (root, cls, x, y, s, rot, a, moving) => {
    const g = root.querySelector('.' + cls);
    g.setAttribute('transform', 'translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(rot || 0) + ') scale(' + (s || 1).toFixed(4) + ')');
    const w = moving ? 9 * Math.sin(a * 28) : 1.5 * Math.sin(a * 3);
    const L = root.querySelector('.' + cls + '-legsL'), R = root.querySelector('.' + cls + '-legsR');
    if (L) L.setAttribute('transform', 'rotate(' + f(w) + ' -30 -60)');
    if (R) R.setAttribute('transform', 'rotate(' + f(-w) + ' 30 -60)');
  };
  F.tent = (x, y, s, col, door, glow) => {
    col = col || '#D8C7A0';
    const sh = '#B9A67E';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + (glow ? W.glow(0, -60, 200, '#FFC86B', glow) : '') +
      '<path d="M-200 0 L0 -230 L200 0 Z" ' + st(col) + '/><path d="M0 -230 L200 0 L60 0 Z" style="fill:' + sh + ';opacity:.55"/>' +
      '<path d="M-56 0 L0 -130 L56 0 Z" ' + st(door || '#5A4A3A') + '/>' +
      '<path d="M0 -230 V-268" ' + ln(INK, 6) + '/><path d="M0 -268 L34 -256 L0 -246" ' + st('#C0503F', 3) + '/>' +
      '<path d="M-200 0 L-246 18 M200 0 L246 18" ' + ln(INK, 4) + '/></g>';
  };
  F.shirt = (x, y, s, col, cls) => '<g class="' + (cls || '') + '" transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M-90 -180 L-40 -200 Q0 -170 40 -200 L90 -180 L150 -110 L110 -80 L80 -110 L80 0 L-80 0 L-80 -110 L-110 -80 L-150 -110 Z" ' + st(col || '#B79B74') + '/>' +
    '<path d="M-40 -200 Q0 -150 40 -200" ' + ln(INK, 4) + '/><path d="M-30 -60 q20 10 40 0 M-50 -120 q16 8 30 0" ' + ln('rgba(42,37,34,.35)', 4) + '/></g>';
  F.bundle = (x, y, s, cls) => '<g class="' + (cls || '') + '" transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-70 0 Q-90 -60 -40 -80 Q0 -96 40 -80 Q90 -60 70 0 Z" ' + st('#8C6C4F') +
    '/><path d="M-20 -80 L0 -112 L20 -80 M-10 -84 Q0 -70 10 -84" ' + st('#715540', 3.5) + '/><path d="M-40 -40 q30 12 70 -4" ' + ln('rgba(42,37,34,.4)', 4) + '/></g>';
  F.tub = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-170 -150 L-140 0 H140 L170 -150 Z" ' + st('#B98353') + '/>' +
    [-90, -30, 30, 90].map((xx) => '<path d="M' + xx + ' -150 L' + f(xx * 0.85) + ' 0" ' + ln('rgba(42,37,34,.45)', 3.5) + '/>').join('') +
    '<path d="M-160 -100 H160 M-150 -40 H150" ' + ln('#6F7984', 9) + '/><ellipse cx="0" cy="-150" rx="170" ry="26" ' + st('#BFE3F0') + '/></g>';
  F.fever = (cls, x, y, s) => '<g class="' + cls + '" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><g class="' + cls + '-in">' +
    '<path d="M-40 0 q10 -14 0 -28 q-10 -14 0 -28 M0 -6 q10 -14 0 -28 q-10 -14 0 -28 M40 0 q10 -14 0 -28 q-10 -14 0 -28" ' + ln('#E0675A', 7) + '/>' +
    '<path d="M70 20 q14 22 0 30 q-14 -8 0 -30 Z" ' + st('#9ED3EE', 3) + '/></g></g>';
  F.thermo = (cls, x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><g class="' + cls + '"><rect x="-22" y="-220" width="44" height="200" rx="22" ' + st('#FFFFFF') + '/>' +
    '<rect class="' + cls + '-lvl" x="-10" y="-200" width="20" height="180" rx="10" style="fill:#E0675A"/><circle cx="0" cy="0" r="38" ' + st('#E0675A') + '/>' +
    [-170, -130, -90, -50].map((yy) => '<path d="M22 ' + yy + ' h-14" ' + ln(INK, 3) + '/>').join('') + '</g></g>';
  F.scratchMark = (x, y, s, cls) => '<g class="' + (cls || '') + '" transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-30 20 L-10 -20 M-6 26 L14 -14 M18 30 L38 -10" ' + ln(INK, 7) + '/></g>';
  F.qmark = (cls) => '<g class="' + cls + '"><path d="M-34 -40 Q-34 -88 6 -88 Q46 -88 46 -50 Q46 -20 12 -8 Q0 0 0 20" ' + ln(INK, 26) + '/><path d="M-34 -40 Q-34 -88 6 -88 Q46 -88 46 -50 Q46 -20 12 -8 Q0 0 0 20" ' + ln('#F08A7E', 16) + '/><circle cy="54" r="14" ' + st('#F08A7E') + '/></g>';
  F.coralX = (cls, s) => '<g class="' + cls + '"><path d="M-60 -60 L60 60 M60 -60 L-60 60" ' + ln(INK, 30 * (s || 1)) + '/><path d="M-60 -60 L60 60 M60 -60 L-60 60" ' + ln('#F08A7E', 18 * (s || 1)) + '/></g>';
  F.blanket = (cls) => '<g class="' + cls + '"><path d="M-150 -60 Q0 -84 150 -60 L160 60 Q0 80 -160 60 Z" ' + st('#8A9A6C') + '/>' +
    '<path d="M-152 -20 Q0 -40 152 -20 M-156 22 Q0 4 156 22" ' + ln('#5F6E47', 10) + '/></g>';
  F.microscope = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-70 0 H70 L60 -24 H-60 Z" ' + st('#4F555C') + '/><path d="M30 -24 Q60 -110 10 -170" ' + ln(INK, 22) + '/><path d="M30 -24 Q60 -110 10 -170" ' + ln('#6F7984', 12) +
    '/><g transform="rotate(-24 -10 -150)"><rect x="-30" y="-230" width="40" height="130" rx="8" ' + st('#A9B2BA') + '/><rect x="-36" y="-250" width="52" height="30" rx="6" ' + st('#4F555C') + '/></g><rect x="-60" y="-80" width="100" height="14" rx="4" ' + st('#4F555C') + '/></g>';
  F.flask = (x, y, s, col) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-14 -110 V-60 L-56 0 H56 L14 -60 V-110 Z" ' + st('#EEF6F8') + '/><path d="M-40 -22 L-52 0 H52 L40 -22 Z" style="fill:' + (col || '#F08A7E') + '"/><path d="M-20 -110 H20" ' + ln(INK, 6) + '/></g>';
  F.log = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-170" y="-70" width="340" height="70" rx="30" ' + st('#9C7550') + '/><ellipse cx="170" cy="-35" rx="20" ry="35" ' + st('#C9A27A') + '/><path d="M-120 -40 h120 M-60 -20 h150" ' + ln('rgba(42,37,34,.4)', 4) + '/></g>';
  F.nightSky = (seed) => {
    const r = Math.random; let s = '<rect width="1920" height="1080" style="fill:#2F3A4F"/>' + W.glow(1500, 210, 520, '#6E7FA0', 0.35);
    let k = seed || 7; const rnd = () => ((k = (k * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 42; i++) { const x = rnd() * 1920, y = rnd() * 520; s += '<circle class="star" cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(2 + rnd() * 3) + '" style="fill:#F4EFD8"/>'; }
    s += '<circle cx="1500" cy="210" r="70" ' + st('#F4EFD8') + '/><circle cx="1530" cy="190" r="62" style="fill:#2F3A4F"/>';
    s += '<path d="M0 640 Q300 600 640 630 Q1000 660 1340 620 Q1660 590 1920 630 V1080 H0 Z" style="fill:#3E4A5E"/>';
    s += '<path d="M0 760 Q480 720 980 750 Q1460 780 1920 740 V1080 H0 Z" ' + st('#4A5568') + '/>';
    return s;
  };
  F.iberia = () => {
    const land = 'M520 300 L700 268 L900 282 L1080 300 L1220 330 L1300 346 L1342 404 L1300 470 L1232 540 L1182 604 L1200 680 L1150 722 L1090 800 L1000 850 L900 862 L800 880 L720 900 L680 892 L620 852 L560 822 L480 822 L470 760 L452 650 L470 560 L440 460 L470 380 Z';
    const france = 'M1080 300 L1060 160 L1000 60 L1060 0 L1920 0 L1920 360 L1640 400 L1480 430 L1342 404 L1300 346 L1220 330 Z';
    const africa = 'M560 1080 L590 978 L690 950 L760 960 L900 990 L1180 968 L1460 992 L1920 958 V1080 Z';
    return W.bg.sea(W.MOODS.mapSea) + W.style.land(france) + W.style.land(africa) + W.style.land(land) +
      '<path d="M700 520 q40 -20 80 0 M1000 420 q40 -20 80 0 M820 680 q40 -20 80 0" ' + ln('rgba(42,37,34,.25)', 5) + '/>';
  };
  // a weave of thick threads (eggs scene)
  F.weave = () => {
    let s = '';
    for (let i = 0; i < 9; i++) { const x = 140 + i * 210; s += '<rect x="' + (x - 34) + '" y="-40" width="68" height="1160" rx="30" ' + st('#B98A5F', 4) + '/>'; }
    for (let j = 0; j < 3; j++) {
      const y = 280 + j * 260; let d = 'M-60 ' + y;
      for (let i = 0; i < 10; i++) d += ' Q' + (35 + i * 210) + ' ' + (y + (i % 2 ? -24 : 24)) + ' ' + (140 + i * 210) + ' ' + y;
      s += '<path d="' + d + '" ' + ln(INK, 78) + '/><path d="' + d + '" ' + ln('#C99A62', 70) + '/>';
      s += '<path d="' + d + '" style="fill:none;stroke:rgba(42,37,34,.22);stroke-width:6;stroke-dasharray:18 22"/>';
    }
    return s;
  };
  F.nit = (x, y, rot, cls) => '<g class="' + cls + '" transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ')"><g class="' + cls + '-in"><ellipse cx="0" cy="0" rx="18" ry="30" ' + st('#FFFBEA', 4) +
    '/><path d="M-14 -22 Q0 -36 14 -22" ' + st('#E9DFC1', 3) + '/><path class="glue" d="M-20 26 Q0 44 20 26" style="fill:#F3D36B;stroke:' + INK + ';stroke-width:3;opacity:0"/></g></g>';
  F.seed = (x, y, s, cls) => '<g class="' + (cls || '') + '" transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 -60 Q36 -20 30 30 Q20 60 0 62 Q-20 60 -30 30 Q-36 -20 0 -60 Z" ' + st('#F1E2B8') + '/><path d="M0 -40 Q8 0 0 44" ' + ln('rgba(42,37,34,.3)', 4) + '/></g>';
  F.mudSplat = (cls) => '<g class="' + cls + '"><path d="M-70 0 Q-80 -30 -50 -40 Q-40 -70 -10 -56 Q20 -80 40 -50 Q76 -50 70 -16 Q90 0 60 10 Q0 22 -60 12 Z" ' + st('#6B4A2E') + '/><circle cx="-90" cy="-40" r="10" ' + st('#6B4A2E', 3) + '/><circle cx="96" cy="-34" r="8" ' + st('#6B4A2E', 3) + '/></g>';
})();
