// Channel character kit: one white-headed stickman, many traits.
// Usage (in a Motion film's shared.js or any page):
//   svg += W.person('p1', { age:'adult', outfit:'robe', hair:'tonsure', facial:'beard', hat:'none', glasses:true, item:'book', face:0.35 });
//   const m = W.bindPerson(rootEl, 'p1');
//   W.posePerson(m, { x, y, s, flip, lean, bob, head, sq, expr:'surprised', blink, a1,a2,a3, b1,b2,b3, legL, legR });
// Feet stand at (0,0). Every joint is its own <g>, so poses are just rotations.
(function () {
  const W = (window.W = window.W || {});
  const C = {
    ink: '#2A2522', head: '#FFFFFF', skin: '#F2D2B6', hand: '#FFFFFF',
    hair: { brown: '#6B4A2E', black: '#2E2724', blond: '#E2BC62', grey: '#BDB9B2', red: '#B5562F', white: '#F1EEE8' },
  };
  const OUT = {
    none:    { c: '#FFFFFF', s: '#FFFFFF' },
    robe:    { c: '#A87650', s: '#8A5D3B', long: true, sleeve: 'long', hood: true, feet: 'sandal', belt: 'rope' },
    rags:    { c: '#8C6C4F', s: '#715540', hem: 'rag', len: 30, sleeve: 'short', feet: 'bare' },
    tunic:   { c: '#9C7B5B', s: '#7E6148', len: 24, sleeve: 'long', belt: 'leather', feet: 'shoe' },
    dress:   { c: '#6F8FAF', s: '#58748F', long: true, flare: 2.1, sleeve: 'long', feet: 'shoe' },
    labcoat: { c: '#FFFFFF', s: '#E2E6EA', len: 34, sleeve: 'long', lapel: true, feet: 'shoe', legs: '#5D6670' },
    scrubs:  { c: '#9DC3E2', s: '#7FA9CC', len: 8, sleeve: 'short', vneck: true, tag: true, feet: 'shoe', legs: '#9DC3E2' },
    guard:   { c: '#D4A445', s: '#B88A33', len: 26, sleeve: 'long', sleeveC: '#4DB6AC', belt: 'teal', feet: 'boot', legs: '#4DB6AC', hat: 'bucket' },
    noble:   { c: '#7D3C55', s: '#632D43', len: 26, sleeve: 'long', trim: '#E3B341', cape: '#3F4F7A', feet: 'shoe', legs: '#3B3036' },
    king:    { c: '#B23A3A', s: '#8E2C2C', long: true, sleeve: 'long', ermine: true, cape: '#B23A3A', feet: 'shoe', hat: 'crown' },
    soldier: { c: '#9AA1A8', s: '#7E868E', len: 26, sleeve: 'long', mail: true, surcoat: '#C9C2A8', belt: 'leather', feet: 'boot', legs: '#6B6F73', hat: 'kettle' },
    exec:    { c: '#3A3533', s: '#2A2624', len: 26, sleeve: 'long', belt: 'leather', feet: 'boot', legs: '#3A3533', hat: 'mask' },
    peasant: { c: '#B8A27A', s: '#9C8762', len: 22, sleeve: 'long', belt: 'rope', feet: 'shoe', apron: '#E8DFC9' },
    baby:    { c: '#F1EEE8', s: '#DAD4C8', swaddle: true },
    // Wild West (added 2026-11-18)
    cowboy:  { c: '#E8DCC0', s: '#CFC2A3', len: 6, sleeve: 'long', vest: '#7A5236', scarf: '#B5503F', belt: 'leather', feet: 'boot', legs: '#5E6E8C', hat: 'cowboy' },
    suit:    { c: '#3B3F4A', s: '#2E323B', len: 30, sleeve: 'long', lapel: true, feet: 'boot', legs: '#2E3038' },
    gown:    { c: '#6B3F69', s: '#56315A', long: true, flare: 2.0, sleeve: 'long', collar: '#F1EEE8', feet: 'shoe' },
    saloon:  { c: '#4E8C8A', s: '#3E7372', long: true, flare: 1.9, sleeve: 'short', collar: '#F1EEE8', feet: 'shoe' },
    barkeep: { c: '#F1EEE8', s: '#DAD4C8', len: 6, sleeve: 'long', vest: '#3B3F4A', belt: 'leather', feet: 'shoe', legs: '#3B3036' },
  };
  const AGE = {
    adult: { R: 60, leg: 62, torso: 78, w: 56, up: 36, fo: 34 },
    old:   { R: 60, leg: 58, torso: 74, w: 56, up: 34, fo: 32, stoop: 8 },
    child: { R: 52, leg: 44, torso: 54, w: 44, up: 26, fo: 24 },
    baby:  { R: 44, leg: 20, torso: 34, w: 40, up: 15, fo: 14 },
  };
  W.PEOPLE = { C, OUT, AGE };
  const f = (n) => (+n).toFixed(1);
  const ln = 3.2; // outline width
  const st = (fill, w) => 'style="fill:' + fill + ';stroke:' + C.ink + ';stroke-width:' + (w || ln) + ';stroke-linejoin:round;stroke-linecap:round"';
  const line = (col, w) => 'style="fill:none;stroke:' + col + ';stroke-width:' + w + ';stroke-linecap:round;stroke-linejoin:round"';
  // thick limb with outline (for coloured legs/sleeves)
  const limb = (d, col, w) => '<path d="' + d + '" ' + line(C.ink, w + ln * 2) + '/><path d="' + d + '" ' + line(col, w) + '/>';

  function torsoPath(tw, bw, y0, y1, hem) {
    let d = 'M' + f(-tw / 2) + ' ' + f(y0 + 10) + ' Q' + f(-tw / 2) + ' ' + f(y0) + ' ' + f(-tw / 2 + 12) + ' ' + f(y0) + ' L' + f(tw / 2 - 12) + ' ' + f(y0) + ' Q' + f(tw / 2) + ' ' + f(y0) + ' ' + f(tw / 2) + ' ' + f(y0 + 10) + ' L' + f(bw / 2) + ' ' + f(y1);
    if (hem === 'rag') { const n = 7; for (let i = 1; i <= n; i++) { const x = bw / 2 - (bw * i) / n; d += ' L' + f(x + bw / n / 2) + ' ' + f(y1 - (i % 2 ? 12 : 4)) + ' L' + f(x) + ' ' + f(y1 + (i % 3 === 0 ? 4 : 0)); } }
    else d += ' Q0 ' + f(y1 + 6) + ' ' + f(-bw / 2) + ' ' + f(y1);
    return d + ' Z';
  }

  function face(cls, R, cy, fx) {
    const ex = R * 0.26, ey = cy - R * 0.08, my = cy + R * 0.3;
    const eye = (x, ry) => '<ellipse cx="' + f(x) + '" cy="' + f(ey) + '" rx="' + f(R * 0.065) + '" ry="' + f(ry || R * 0.095) + '" style="fill:' + C.ink + '"/>';
    const eyes = (ry) => '<g class="' + cls + '-eyes">' + eye(fx - ex, ry) + eye(fx + ex, ry) + '</g>';
    const arcs = (up) => [fx - ex, fx + ex].map((x) => '<path d="M' + f(x - R * 0.09) + ' ' + f(ey + (up ? 3 : -1)) + ' Q' + f(x) + ' ' + f(ey + (up ? -R * 0.11 : R * 0.09)) + ' ' + f(x + R * 0.09) + ' ' + f(ey + (up ? 3 : -1)) + '" ' + line(C.ink, 3.4) + '/>').join('');
    const brows = (inner, outer) => [[-1, fx - ex], [1, fx + ex]].map(([s, x]) => '<path d="M' + f(x - s * R * 0.1) + ' ' + f(ey - R * 0.26 + inner) + ' L' + f(x + s * R * 0.1) + ' ' + f(ey - R * 0.26 + outer) + '" ' + line(C.ink, 3) + '/>').join('');
    const g = (name, body) => '<g class="' + cls + '-ex ' + cls + '-ex-' + name + '" style="display:none">' + body + '</g>';
    return g('neutral', eyes() + '<path d="M' + f(fx - R * 0.11) + ' ' + f(my) + ' h' + f(R * 0.22) + '" ' + line(C.ink, 3) + '/>') +
      g('happy', eyes() + '<path d="M' + f(fx - R * 0.16) + ' ' + f(my - 3) + ' Q' + f(fx) + ' ' + f(my + R * 0.13) + ' ' + f(fx + R * 0.16) + ' ' + f(my - 3) + '" ' + line(C.ink, 3) + '/>') +
      g('joy', arcs(true) + '<path d="M' + f(fx - R * 0.2) + ' ' + f(my - 5) + ' Q' + f(fx) + ' ' + f(my + R * 0.3) + ' ' + f(fx + R * 0.2) + ' ' + f(my - 5) + ' Z" ' + st(C.ink, 2) + '/>') +
      g('sleep', arcs(false) + '<path d="M' + f(fx - R * 0.08) + ' ' + f(my) + ' h' + f(R * 0.16) + '" ' + line(C.ink, 3) + '/>') +
      g('surprised', eyes(R * 0.115) + brows(-6, -2) + '<rect x="' + f(fx - R * 0.2) + '" y="' + f(my - R * 0.1) + '" width="' + f(R * 0.4) + '" height="' + f(R * 0.2) + '" rx="' + f(R * 0.09) + '" ' + st('#FFFFFF', 3) + '/><path d="M' + f(fx - R * 0.14) + ' ' + f(my) + ' Q' + f(fx) + ' ' + f(my - 4) + ' ' + f(fx + R * 0.14) + ' ' + f(my + 2) + '" ' + line(C.ink, 2.2) + '/>') +
      g('worried', eyes() + brows(-7, 2) + '<path d="M' + f(fx - R * 0.14) + ' ' + f(my + 2) + ' q' + f(R * 0.07) + ' -5 ' + f(R * 0.14) + ' 0 t' + f(R * 0.14) + ' 0" ' + line(C.ink, 3) + '/>') +
      g('sad', eyes() + brows(-6, 3) + '<path d="M' + f(fx - R * 0.14) + ' ' + f(my + 4) + ' Q' + f(fx) + ' ' + f(my - R * 0.1) + ' ' + f(fx + R * 0.14) + ' ' + f(my + 4) + '" ' + line(C.ink, 3) + '/>') +
      g('smug', '<g class="' + cls + '-eyes">' + eye(fx - ex, R * 0.05) + eye(fx + ex, R * 0.05) + '</g><path d="M' + f(fx - R * 0.12) + ' ' + f(my + 1) + ' Q' + f(fx + R * 0.04) + ' ' + f(my + R * 0.06) + ' ' + f(fx + R * 0.17) + ' ' + f(my - R * 0.06) + '" ' + line(C.ink, 3) + '/>') +
      g('angry', eyes() + brows(5, -4) + '<path d="M' + f(fx - R * 0.12) + ' ' + f(my + 2) + ' h' + f(R * 0.24) + '" ' + line(C.ink, 3.4) + '/>') +
      g('talk', eyes() + '<ellipse class="' + cls + '-mouth" cx="' + f(fx) + '" cy="' + f(my) + '" rx="' + f(R * 0.07) + '" ry="' + f(R * 0.09) + '" style="fill:' + C.ink + '"/>');
  }

  function hairBack(o, R, cy, hc) {
    if (o.hair === 'long') return '<path d="M' + f(-R * 0.96) + ' ' + f(cy - R * 0.2) + ' L' + f(-R * 1.04) + ' ' + f(cy + R * 1.05) + ' Q0 ' + f(cy + R * 1.22) + ' ' + f(R * 1.04) + ' ' + f(cy + R * 1.05) + ' L' + f(R * 0.96) + ' ' + f(cy - R * 0.2) + ' Z" ' + st(hc) + '/>';
    if (o.hair === 'bun') return '<circle cx="0" cy="' + f(cy - R * 1.08) + '" r="' + f(R * 0.3) + '" ' + st(hc) + '/>';
    if (o.hair === 'ponytail') return '<path d="M' + f(R * 0.7) + ' ' + f(cy - R * 0.6) + ' Q' + f(R * 1.45) + ' ' + f(cy - R * 0.5) + ' ' + f(R * 1.25) + ' ' + f(cy + R * 0.75) + ' Q' + f(R * 1.05) + ' ' + f(cy + R * 0.1) + ' ' + f(R * 0.8) + ' ' + f(cy - R * 0.2) + ' Z" ' + st(hc) + '/>';
    return '';
  }
  function hairFront(o, R, cy, hc) {
    const P = (a, r) => [r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
    const cap = (inner) => { const a = P(192, R + 2), b = P(348, R + 2); return '<path d="M' + f(a[0]) + ' ' + f(a[1]) + ' A' + f(R + 2) + ' ' + f(R + 2) + ' 0 0 1 ' + f(b[0]) + ' ' + f(b[1]) + ' ' + inner + ' Z" ' + st(hc) + '/>'; };
    const h = o.hair;
    if (h === 'short' || h === 'bun' || h === 'ponytail') return cap('Q' + f(R * 0.55) + ' ' + f(cy - R * 0.5) + ' ' + f(R * 0.15) + ' ' + f(cy - R * 0.62) + ' Q' + f(-R * 0.45) + ' ' + f(cy - R * 0.52) + ' ' + f(-R * 0.97) + ' ' + f(cy - R * 0.2));
    if (h === 'long') return cap('L' + f(R * 1.0) + ' ' + f(cy + R * 0.55) + ' L' + f(R * 0.8) + ' ' + f(cy + R * 0.5) + ' Q' + f(R * 0.62) + ' ' + f(cy - R * 0.45) + ' 0 ' + f(cy - R * 0.62) + ' Q' + f(-R * 0.62) + ' ' + f(cy - R * 0.45) + ' ' + f(-R * 0.8) + ' ' + f(cy + R * 0.5) + ' L' + f(-R * 1.0) + ' ' + f(cy + R * 0.55));
    if (h === 'curly') { let s = cap('Q' + f(R * 0.5) + ' ' + f(cy - R * 0.45) + ' 0 ' + f(cy - R * 0.55) + ' Q' + f(-R * 0.5) + ' ' + f(cy - R * 0.45) + ' ' + f(-R * 0.97) + ' ' + f(cy - R * 0.2)); for (let a = 190; a <= 350; a += 20) { const p = P(a, R * 0.98); s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(R * 0.2) + '" ' + st(hc) + '/>'; } return s; }
    if (h === 'tonsure') { const a = P(196, R * 0.93), b = P(344, R * 0.93); const d = 'M' + f(a[0]) + ' ' + f(a[1]) + ' Q0 ' + f(cy - R * 0.62) + ' ' + f(b[0]) + ' ' + f(b[1]); return '<path d="' + d + '" ' + line(C.ink, R * 0.13 + ln * 2) + '/><path d="' + d + '" ' + line(hc, R * 0.13) + '/>'; }
    if (h === 'tuft') return '<path d="M-2 ' + f(cy - R) + ' Q6 ' + f(cy - R * 1.35) + ' ' + f(R * 0.22) + ' ' + f(cy - R * 1.12) + '" ' + line(C.ink, 3) + '/>';
    if (h === 'balding') { return [[198, 230], [310, 342]].map(([x, y]) => { const a = P(x, R * 0.92), b = P(y, R * 0.92); const d = 'M' + f(a[0]) + ' ' + f(a[1]) + ' A' + f(R * 0.92) + ' ' + f(R * 0.92) + ' 0 0 1 ' + f(b[0]) + ' ' + f(b[1]); return '<path d="' + d + '" ' + line(C.ink, R * 0.2 + ln * 2) + '/><path d="' + d + '" ' + line(hc, R * 0.2) + '/>'; }).join(''); }
    return '';
  }
  function facial(o, R, cy, fx, hc) {
    const my = cy + R * 0.3;
    const P = (a) => [(R + 1) * Math.cos(a * Math.PI / 180), cy + (R + 1) * Math.sin(a * Math.PI / 180)];
    const a = P(22), b = P(158), inner = ' L' + f(-R * 0.6 + fx * 0.3) + ' ' + f(cy + R * 0.36) + ' Q' + f(fx) + ' ' + f(cy + R * 0.52) + ' ' + f(R * 0.6 + fx * 0.3) + ' ' + f(cy + R * 0.36) + ' Z';
    if (o.facial === 'beard') return '<path d="M' + f(a[0]) + ' ' + f(a[1]) + ' A' + f(R + 1) + ' ' + f(R + 1) + ' 0 0 1 ' + f(b[0]) + ' ' + f(b[1]) + inner + '" ' + st(hc) + '/>';
    if (o.facial === 'longbeard') return '<path d="M' + f(a[0]) + ' ' + f(a[1]) + ' L' + f(R * 0.55) + ' ' + f(cy + R * 1.45) + ' Q' + f(fx) + ' ' + f(cy + R * 1.95) + ' ' + f(-R * 0.55) + ' ' + f(cy + R * 1.45) + ' L' + f(b[0]) + ' ' + f(b[1]) + inner + '" ' + st(hc) + '/>';
    if (o.facial === 'stubble') { let s = ''; for (let i = 0; i < 14; i++) { const ang = (25 + i * 9.5) * Math.PI / 180, r = R * (0.7 + (i % 3) * 0.08); s += '<circle cx="' + f(r * Math.cos(ang)) + '" cy="' + f(cy + r * Math.sin(ang)) + '" r="1.6" style="fill:' + C.ink + ';opacity:.55"/>'; } return s; }
    return '';
  }
  function mustache(o, R, cy, fx, hc) {
    if (o.facial !== 'mustache' && o.facial !== 'beard' && o.facial !== 'longbeard') return '';
    const m = cy + R * 0.18, w = o.facial === 'mustache' ? 0.32 : 0.28;
    return '<path d="M' + f(fx) + ' ' + f(m - 2) + ' Q' + f(fx - R * 0.16) + ' ' + f(m - R * 0.12) + ' ' + f(fx - R * w) + ' ' + f(m + R * 0.07) + ' Q' + f(fx - R * 0.15) + ' ' + f(m + R * 0.04) + ' ' + f(fx) + ' ' + f(m + R * 0.03) + ' Q' + f(fx + R * 0.15) + ' ' + f(m + R * 0.04) + ' ' + f(fx + R * w) + ' ' + f(m + R * 0.07) + ' Q' + f(fx + R * 0.16) + ' ' + f(m - R * 0.12) + ' ' + f(fx) + ' ' + f(m - 2) + ' Z" ' + st(hc, 2.6) + '/>';
  }
  function glasses(R, cy, fx) {
    const ey = cy - R * 0.08, ex = R * 0.26, r = R * 0.17;
    return '<g ' + line(C.ink, 2.4) + '><circle cx="' + f(fx - ex) + '" cy="' + f(ey) + '" r="' + f(r) + '"/><circle cx="' + f(fx + ex) + '" cy="' + f(ey) + '" r="' + f(r) + '"/><path d="M' + f(fx - ex + r) + ' ' + f(ey) + ' Q' + f(fx) + ' ' + f(ey - 5) + ' ' + f(fx + ex - r) + ' ' + f(ey) + ' M' + f(fx - ex - r) + ' ' + f(ey) + ' L' + f(-R * 0.99) + ' ' + f(ey + 3) + ' M' + f(fx + ex + r) + ' ' + f(ey) + ' L' + f(R * 0.99) + ' ' + f(ey + 3) + '"/></g>';
  }
  function hatBack(o, R, cy, oc) {
    if (o.hat === 'hood') return '<path d="M' + f(-R * 1.18) + ' ' + f(cy + R * 0.95) + ' Q' + f(-R * 1.36) + ' ' + f(cy - R * 1.36) + ' 0 ' + f(cy - R * 1.38) + ' Q' + f(R * 1.36) + ' ' + f(cy - R * 1.36) + ' ' + f(R * 1.18) + ' ' + f(cy + R * 0.95) + ' Z" ' + st(oc.c) + '/>';
    return '';
  }
  function hatFront(o, R, cy, fx, oc) {
    const h = o.hat;
    if (h === 'hood') { const d = 'M' + f(-R * 0.97) + ' ' + f(cy + R * 0.35) + ' Q' + f(-R * 1.08) + ' ' + f(cy - R * 1.2) + ' 0 ' + f(cy - R * 1.17) + ' Q' + f(R * 1.08) + ' ' + f(cy - R * 1.2) + ' ' + f(R * 0.97) + ' ' + f(cy + R * 0.35); return '<path d="' + d + '" ' + line(C.ink, R * 0.2 + ln * 2) + '/><path d="' + d + '" ' + line(oc.s, R * 0.2) + '/>'; }
    if (h === 'bucket') return '<path d="M' + f(-R * 0.8) + ' ' + f(cy - R * 0.5) + ' Q' + f(-R * 0.74) + ' ' + f(cy - R * 1.2) + ' 0 ' + f(cy - R * 1.22) + ' Q' + f(R * 0.74) + ' ' + f(cy - R * 1.2) + ' ' + f(R * 0.8) + ' ' + f(cy - R * 0.5) + ' Z" ' + st('#D4A445') + '/><path d="M' + f(-R * 0.95 + fx * 0.4) + ' ' + f(cy - R * 0.5) + ' Q' + f(fx * 0.5) + ' ' + f(cy - R * 0.62) + ' ' + f(R * 1.15 + fx * 0.6) + ' ' + f(cy - R * 0.44) + ' Q' + f(fx * 0.5) + ' ' + f(cy - R * 0.3) + ' ' + f(-R * 0.95 + fx * 0.4) + ' ' + f(cy - R * 0.5) + ' Z" ' + st('#4DB6AC') + '/>';
    if (h === 'crown') return '<path d="M' + f(-R * 0.55) + ' ' + f(cy - R * 0.76) + ' L' + f(-R * 0.62) + ' ' + f(cy - R * 1.28) + ' L' + f(-R * 0.3) + ' ' + f(cy - R * 1.02) + ' L0 ' + f(cy - R * 1.36) + ' L' + f(R * 0.3) + ' ' + f(cy - R * 1.02) + ' L' + f(R * 0.62) + ' ' + f(cy - R * 1.28) + ' L' + f(R * 0.55) + ' ' + f(cy - R * 0.76) + ' Q0 ' + f(cy - R * 0.68) + ' ' + f(-R * 0.55) + ' ' + f(cy - R * 0.76) + ' Z" ' + st('#E3B341') + '/><circle cx="0" cy="' + f(cy - R * 0.9) + '" r="' + f(R * 0.07) + '" ' + st('#C0392B', 2) + '/>';
    if (h === 'kettle') return '<path d="M' + f(-R * 0.82) + ' ' + f(cy - R * 0.45) + ' Q' + f(-R * 0.82) + ' ' + f(cy - R * 1.24) + ' 0 ' + f(cy - R * 1.26) + ' Q' + f(R * 0.82) + ' ' + f(cy - R * 1.24) + ' ' + f(R * 0.82) + ' ' + f(cy - R * 0.45) + ' Z" ' + st('#A9B0B6') + '/><ellipse cx="' + f(fx * 0.3) + '" cy="' + f(cy - R * 0.45) + '" rx="' + f(R * 1.18) + '" ry="' + f(R * 0.15) + '" ' + st('#8C949B') + '/>';
    if (h === 'coif') return '<path d="M' + f(-R * 0.98) + ' ' + f(cy + R * 0.12) + ' Q' + f(-R * 1.12) + ' ' + f(cy - R * 1.16) + ' 0 ' + f(cy - R * 1.12) + ' Q' + f(R * 1.12) + ' ' + f(cy - R * 1.16) + ' ' + f(R * 0.98) + ' ' + f(cy + R * 0.12) + ' Q' + f(R * 0.75) + ' ' + f(cy - R * 0.45) + ' 0 ' + f(cy - R * 0.56) + ' Q' + f(-R * 0.75) + ' ' + f(cy - R * 0.45) + ' ' + f(-R * 0.98) + ' ' + f(cy + R * 0.12) + ' Z" ' + st('#EDE6D6') + '/>';
    if (h === 'mask') { const P = (a) => [(R + 1.5) * Math.cos(a * Math.PI / 180), cy + (R + 1.5) * Math.sin(a * Math.PI / 180)]; const a = P(172), b = P(8); const ey = cy - R * 0.08, ex = R * 0.26;
      return '<path d="M' + f(a[0]) + ' ' + f(a[1]) + ' A' + f(R + 1.5) + ' ' + f(R + 1.5) + ' 0 1 1 ' + f(b[0]) + ' ' + f(b[1]) + ' Q0 ' + f(cy + R * 0.3) + ' ' + f(a[0]) + ' ' + f(a[1]) + ' Z" ' + st('#3A3533') + '/>' +
        [fx - ex, fx + ex].map((x) => '<ellipse cx="' + f(x) + '" cy="' + f(ey) + '" rx="' + f(R * 0.14) + '" ry="' + f(R * 0.09) + '" ' + st('#FFFFFF', 2.4) + '/><circle cx="' + f(x) + '" cy="' + f(ey) + '" r="' + f(R * 0.05) + '" style="fill:' + C.ink + '"/>').join(''); }
    if (h === 'cowboy') { const hc2 = o.hatColor || '#B98A5F', b = cy - R * 0.56, x0 = fx * 0.35;
      return '<path d="M' + f(-R * 0.6 + x0) + ' ' + f(b) + ' L' + f(-R * 0.52 + x0) + ' ' + f(cy - R * 1.24) + ' Q' + f(-R * 0.22 + x0) + ' ' + f(cy - R * 1.36) + ' ' + f(x0) + ' ' + f(cy - R * 1.16) + ' Q' + f(R * 0.22 + x0) + ' ' + f(cy - R * 1.36) + ' ' + f(R * 0.52 + x0) + ' ' + f(cy - R * 1.24) + ' L' + f(R * 0.6 + x0) + ' ' + f(b) + ' Z" ' + st(hc2) + '/>' +
        '<path d="M' + f(-R * 0.58 + x0) + ' ' + f(b - R * 0.14) + ' Q' + f(x0) + ' ' + f(b - R * 0.08) + ' ' + f(R * 0.58 + x0) + ' ' + f(b - R * 0.14) + '" ' + line('#5A4030', R * 0.12) + '/>' +
        '<path d="M' + f(-R * 1.5 + x0) + ' ' + f(b - R * 0.3) + ' Q' + f(-R * 1.2 + x0) + ' ' + f(b + R * 0.02) + ' ' + f(x0) + ' ' + f(b + R * 0.02) + ' Q' + f(R * 1.2 + x0) + ' ' + f(b + R * 0.02) + ' ' + f(R * 1.5 + x0) + ' ' + f(b - R * 0.3) + ' Q' + f(R * 1.1 + x0) + ' ' + f(b + R * 0.2) + ' ' + f(x0) + ' ' + f(b + R * 0.2) + ' Q' + f(-R * 1.1 + x0) + ' ' + f(b + R * 0.2) + ' ' + f(-R * 1.5 + x0) + ' ' + f(b - R * 0.3) + ' Z" ' + st(hc2) + '/>'; }
    if (h === 'bowler') { const hc2 = o.hatColor || '#2E2724', b = cy - R * 0.6, x0 = fx * 0.35;
      return '<path d="M' + f(-R * 0.66 + x0) + ' ' + f(b) + ' Q' + f(-R * 0.72 + x0) + ' ' + f(cy - R * 1.36) + ' ' + f(x0) + ' ' + f(cy - R * 1.36) + ' Q' + f(R * 0.72 + x0) + ' ' + f(cy - R * 1.36) + ' ' + f(R * 0.66 + x0) + ' ' + f(b) + ' Z" ' + st(hc2) + '/><ellipse cx="' + f(x0) + '" cy="' + f(b) + '" rx="' + f(R * 0.98) + '" ry="' + f(R * 0.12) + '" ' + st(hc2) + '/>'; }
    if (h === 'straw') return '<ellipse cx="' + f(fx * 0.3) + '" cy="' + f(cy - R * 0.55) + '" rx="' + f(R * 1.35) + '" ry="' + f(R * 0.2) + '" ' + st('#E2C27A') + '/><path d="M' + f(-R * 0.6) + ' ' + f(cy - R * 0.58) + ' Q' + f(-R * 0.55) + ' ' + f(cy - R * 1.15) + ' 0 ' + f(cy - R * 1.15) + ' Q' + f(R * 0.55) + ' ' + f(cy - R * 1.15) + ' ' + f(R * 0.6) + ' ' + f(cy - R * 0.58) + ' Z" ' + st('#E2C27A') + '/><path d="M' + f(-R * 0.6) + ' ' + f(cy - R * 0.68) + ' Q0 ' + f(cy - R * 0.6) + ' ' + f(R * 0.6) + ' ' + f(cy - R * 0.68) + '" ' + line('#B5562F', 5) + '/>';
    return '';
  }
  function item(name, R) {
    switch (name) {
      case 'book': return '<g transform="rotate(-12)"><rect x="-26" y="-10" width="46" height="58" rx="3" ' + st('#8A5D3B') + '/><path d="M20 -6 h6 v50 h-6" ' + st('#FFFFFF', 2.4) + '/></g>';
      case 'staff': return '<path d="M0 40 L0 -190" ' + line(C.ink, 9) + '/><path d="M0 40 L0 -190" ' + line('#9C7246', 5) + '/>';
      case 'spear': return '<path d="M0 50 L0 -200" ' + line(C.ink, 8) + '/><path d="M0 50 L0 -200" ' + line('#9C7246', 4.5) + '/><path d="M0 -236 L9 -200 L0 -192 L-9 -200 Z" ' + st('#B9C0C6', 2.4) + '/>';
      case 'pointer': return '<path d="M0 30 L0 -150" ' + line('#9C7246', 6) + '/>';
      case 'bowl': return '<path d="M-24 -2 Q0 30 24 -2 Z" ' + st('#A7A39C') + '/><ellipse cx="0" cy="-2" rx="24" ry="5" ' + st('#C9A35E', 2.4) + '/>';
      case 'scroll': return '<rect x="-8" y="-30" width="16" height="56" rx="7" ' + st('#F3E6C4') + '/>';
      case 'vial': return '<path d="M-6 -34 h12 v8 l6 22 a12 12 0 0 1 -24 0 l6 -22 Z" ' + st('#E8F1EE', 2.6) + '/><path d="M-10 -8 h20 a10 10 0 0 1 -20 0" style="fill:#8DB37E"/>';
      case 'torch': return '<path d="M0 30 L0 -70" ' + line(C.ink, 10) + '/><path d="M0 30 L0 -70" ' + line('#9C7246', 6) + '/><path d="M0 -118 Q16 -88 9 -74 Q0 -66 -9 -74 Q-16 -88 0 -118 Z" ' + st('#F6B54A', 2.6) + '/>';
      case 'bread': return '<ellipse cx="0" cy="-4" rx="26" ry="14" ' + st('#D9A35B') + '/><path d="M-12 -12 l6 10 M0 -14 l6 10 M12 -12 l6 10" ' + line('#A8743A', 2.4) + '/>';
      default: return '';
    }
  }

  W.person = function (cls, o) {
    o = Object.assign({ age: 'adult', outfit: 'none', hair: 'none', hairColor: 'brown', facial: 'none', hat: null, glasses: false, face: 0.35, item: null, itemL: null, limbs: 'stick' }, o || {});
    const A = AGE[o.age] || AGE.adult, R = A.R;
    const oc = Object.assign({}, OUT[o.outfit] || OUT.none, o.color ? { c: o.color, s: o.shade || o.color } : {});
    if (o.age === 'baby' && o.outfit === 'none') Object.assign(oc, OUT.baby);
    if (o.hat == null) o.hat = oc.hat || 'none';
    const hc = C.hair[o.hairColor] || o.hairColor;
    const hipY = -A.leg, shY = hipY - A.torso, neckTop = shY - 6, cy = -(R - 6), fx = o.face * R * 0.24;
    const legX = A.w * 0.2, skin = o.limbs === 'skin';
    const legCol = oc.legs || (skin ? C.skin : null);
    const foot = (dir) => {
      const k = oc.feet || 'bare';
      if (k === 'boot') return '<path d="M-7 ' + f(-12) + ' h14 v8 q' + f(10 * dir + 4) + ' 0 ' + f(10 * dir + 4) + ' 8 h' + f(-24) + ' Z" ' + st(o.outfit === 'guard' ? '#D4A445' : '#5A4636', 2.6) + '/>';
      const sh = k === 'shoe' ? '#4E3B2C' : C.hand;
      return '<ellipse cx="' + f(dir * R * 0.08) + '" cy="-1" rx="' + f(R * 0.2) + '" ry="' + f(R * 0.1) + '" ' + st(sh, 2.6) + '/>' + (k === 'sandal' ? '<path d="M' + f(dir * R * 0.08 - 8) + ' -6 h16" ' + line('#7A4F2E', 4) + '/>' : '');
    };
    const leg = (n, x) => '<g class="' + cls + '-' + n + '" transform="translate(' + f(x) + ' ' + f(hipY) + ')">' +
      (legCol ? limb('M0 0 L0 ' + f(A.leg - 4), legCol, R * 0.17) : '<path d="M0 0 L0 ' + f(A.leg - 4) + '" ' + line(C.ink, 4.2) + '/>') +
      '<g transform="translate(0 ' + f(A.leg) + ')">' + foot(o.face >= 0 ? 1 : -1) + '</g></g>';

    // arms: shoulder pivot, upper arm, forearm group, hand group (item + hand)
    const sx = A.w / 2 - 6;
    const sleeveCol = oc.sleeveC || oc.c;
    const arm = (n, side, itemName) => {
      const long = oc.sleeve === 'long', short = oc.sleeve === 'short';
      const wide = o.outfit === 'robe' || o.outfit === 'king';
      const upper = (long || short) ? limb('M0 0 L0 ' + f(A.up), sleeveCol, wide ? R * 0.34 : R * 0.22) : (skin ? limb('M0 0 L0 ' + f(A.up), C.skin, R * 0.13) : '<path d="M0 0 L0 ' + f(A.up) + '" ' + line(C.ink, 4.2) + '/>');
      const fore = long ? limb('M0 0 L0 ' + f(A.fo - 4), sleeveCol, wide ? R * 0.36 : R * 0.2) : (skin ? limb('M0 0 L0 ' + f(A.fo), C.skin, R * 0.12) : '<path d="M0 0 L0 ' + f(A.fo) + '" ' + line(C.ink, 4.2) + '/>');
      return '<g class="' + cls + '-' + n + '" transform="translate(' + f(side * sx) + ' ' + f(shY + 8) + ')">' + upper +
        '<g class="' + cls + '-' + n + 'f" transform="translate(0 ' + f(A.up) + ')">' + fore +
        '<g class="' + cls + '-' + n + 'h" transform="translate(0 ' + f(A.fo) + ')">' + item(itemName, R) + '<circle r="' + f(R * 0.14) + '" ' + st(C.hand, 2.6) + '/></g></g></g>';
    };

    // torso / clothes
    let body = '';
    if (oc.cape) body += '<path d="M' + f(-A.w / 2) + ' ' + f(shY + 4) + ' L' + f(-A.w * 0.95) + ' ' + f(oc.long ? -6 : hipY + 30) + ' Q0 ' + f((oc.long ? -6 : hipY + 30) + 8) + ' ' + f(A.w * 0.95) + ' ' + f(oc.long ? -6 : hipY + 30) + ' L' + f(A.w / 2) + ' ' + f(shY + 4) + ' Z" ' + st(oc.cape) + '/>';
    body += '<rect x="' + f(-R * 0.12) + '" y="' + f(neckTop - 4) + '" width="' + f(R * 0.24) + '" height="14" ' + st(C.head, 2.6) + '/>';
    if (o.outfit === 'none' && o.age !== 'baby') body += '<path d="M0 ' + f(neckTop + 6) + ' L0 ' + f(hipY) + '" ' + line(C.ink, 4.2) + '/>';
    else if (oc.swaddle) body += '<path d="M' + f(-A.w * 0.55) + ' ' + f(shY + 4) + ' Q0 ' + f(shY - 8) + ' ' + f(A.w * 0.55) + ' ' + f(shY + 4) + ' Q' + f(A.w * 0.7) + ' ' + f(-4) + ' 0 ' + f(-2) + ' Q' + f(-A.w * 0.7) + ' -4 ' + f(-A.w * 0.55) + ' ' + f(shY + 4) + ' Z" ' + st(oc.c) + '/><path d="M' + f(-A.w * 0.4) + ' ' + f(shY + 14) + ' Q0 ' + f(hipY) + ' ' + f(A.w * 0.45) + ' ' + f(hipY + 4) + '" ' + line(oc.s, 3) + '/>';
    else {
      const bottom = oc.long ? -10 : hipY + (oc.len || 20);
      const bw = oc.long ? A.w * (oc.flare || 1.85) : A.w * (oc.hem === 'rag' ? 1.25 : 1.32);
      body += '<path d="' + torsoPath(A.w + (oc.long ? 6 : 0), bw, shY, bottom, oc.hem) + '" ' + st(oc.c) + '/>';
      body += '<path d="M' + f(A.w * 0.22) + ' ' + f(shY + 6) + ' L' + f(A.w / 2 - 2) + ' ' + f(shY + 10) + ' L' + f(bw / 2 - 3) + ' ' + f(bottom - 2) + ' L' + f(bw * 0.3) + ' ' + f(bottom) + ' Z" style="fill:' + oc.s + ';opacity:.7"/>';
      body += '<path d="M' + f(-A.w * 0.12) + ' ' + f(shY + 30) + ' L' + f(-bw * 0.18) + ' ' + f(bottom - 6) + ' M' + f(A.w * 0.08) + ' ' + f(hipY + 6) + ' L' + f(bw * 0.12) + ' ' + f(bottom - 4) + '" ' + line(oc.s, 2.6) + '/>';
      if (oc.mail) { let s = ''; for (let y = shY + 14; y < bottom - 6; y += 10) for (let x = -A.w / 2 + 10; x < A.w / 2 - 6; x += 10) s += '<circle cx="' + f(x + ((y / 10) % 2) * 5) + '" cy="' + f(y) + '" r="3" ' + line(oc.s, 1.6) + '/>'; body += s + '<path d="' + torsoPath(A.w * 0.55, A.w * 0.75, shY + 10, bottom + 2) + '" ' + st(oc.surcoat) + '/>'; }
      if (oc.apron) body += '<path d="M' + f(-A.w * 0.32) + ' ' + f(hipY - 8) + ' L' + f(A.w * 0.32) + ' ' + f(hipY - 8) + ' L' + f(A.w * 0.42) + ' ' + f(bottom - 2) + ' Q0 ' + f(bottom + 3) + ' ' + f(-A.w * 0.42) + ' ' + f(bottom - 2) + ' Z" ' + st(oc.apron) + '/>';
      if (oc.lapel) body += '<path d="M' + f(-8) + ' ' + f(shY + 2) + ' L0 ' + f(shY + 34) + ' L8 ' + f(shY + 2) + '" ' + st('#E6E1D6', 2.6) + '/><path d="M' + f(-14) + ' ' + f(shY) + ' L-2 ' + f(shY + 40) + ' M14 ' + f(shY) + ' L2 ' + f(shY + 40) + '" ' + line(C.ink, 2.6) + '/><circle cx="3" cy="' + f(shY + 52) + '" r="2.4" style="fill:' + C.ink + '"/><circle cx="3" cy="' + f(shY + 66) + '" r="2.4" style="fill:' + C.ink + '"/>';
      if (oc.vneck) body += '<path d="M-10 ' + f(shY + 1) + ' L0 ' + f(shY + 16) + ' L10 ' + f(shY + 1) + '" ' + st(C.head, 2.4) + '/>';
      if (oc.tag) body += '<rect x="8" y="' + f(shY + 22) + '" width="14" height="5" rx="1" ' + st('#FFFFFF', 1.8) + '/>';
      if (oc.trim) body += '<path d="M0 ' + f(shY + 2) + ' L0 ' + f(bottom) + ' M' + f(-bw / 2 + 2) + ' ' + f(bottom - 3) + ' L' + f(bw / 2 - 2) + ' ' + f(bottom - 3) + '" ' + line(oc.trim, 4) + '/>';
      if (oc.ermine) { body += '<path d="M' + f(-A.w * 0.62) + ' ' + f(shY + 4) + ' Q0 ' + f(shY + 30) + ' ' + f(A.w * 0.62) + ' ' + f(shY + 4) + ' Q0 ' + f(shY - 6) + ' ' + f(-A.w * 0.62) + ' ' + f(shY + 4) + ' Z" ' + st('#FBF8F2') + '/>'; for (let i = -2; i <= 2; i++) body += '<path d="M' + f(i * 9) + ' ' + f(shY + 8 + Math.abs(i) * -2) + ' v5" ' + line(C.ink, 2.4) + '/>'; }
      if (oc.belt) { const bc = oc.belt === 'rope' ? '#D8BE8A' : oc.belt === 'teal' ? '#4DB6AC' : '#4E3B2C'; body += '<path d="M' + f(-A.w / 2 - 2) + ' ' + f(hipY - 4) + ' Q0 ' + f(hipY + 2) + ' ' + f(A.w / 2 + 2) + ' ' + f(hipY - 4) + '" ' + line(C.ink, 7 + ln) + '/><path d="M' + f(-A.w / 2 - 2) + ' ' + f(hipY - 4) + ' Q0 ' + f(hipY + 2) + ' ' + f(A.w / 2 + 2) + ' ' + f(hipY - 4) + '" ' + line(bc, 6) + '/>' + (oc.belt === 'rope' ? '<path d="M' + f(-A.w * 0.3) + ' ' + f(hipY - 2) + ' q-4 20 2 38 M' + f(-A.w * 0.22) + ' ' + f(hipY - 1) + ' q4 18 -1 34" ' + line(bc, 3.4) + '/>' : ''); }
      if (oc.vest) { const vb = hipY + 4; body += [-1, 1].map((k) => '<path d="M' + f(k * (A.w / 2 + 1)) + ' ' + f(shY + 6) + ' Q' + f(k * A.w * 0.3) + ' ' + f(shY) + ' ' + f(k * A.w * 0.1) + ' ' + f(shY + 4) + ' L' + f(k * A.w * 0.06) + ' ' + f(vb) + ' L' + f(k * (A.w / 2 + 3)) + ' ' + f(vb - 4) + ' Z" ' + st(oc.vest) + '/>').join('') + '<circle cx="' + f(-A.w * 0.14) + '" cy="' + f(shY + 34) + '" r="2.4" style="fill:' + C.ink + '"/><circle cx="' + f(-A.w * 0.13) + '" cy="' + f(shY + 54) + '" r="2.4" style="fill:' + C.ink + '"/>'; }
      if (oc.collar) body += '<path d="M' + f(-A.w * 0.34) + ' ' + f(shY + 2) + ' Q0 ' + f(shY + 22) + ' ' + f(A.w * 0.34) + ' ' + f(shY + 2) + ' Q0 ' + f(shY + 8) + ' ' + f(-A.w * 0.34) + ' ' + f(shY + 2) + ' Z" ' + st(oc.collar, 2.6) + '/>';
      if (oc.scarf) body += '<path d="M' + f(-R * 0.26) + ' ' + f(shY - 3) + ' Q0 ' + f(shY + 4) + ' ' + f(R * 0.26) + ' ' + f(shY - 3) + ' L' + f(R * 0.06) + ' ' + f(shY + 26) + ' Q0 ' + f(shY + 30) + ' ' + f(-R * 0.06) + ' ' + f(shY + 26) + ' Z" ' + st(oc.scarf, 2.6) + '/>';
      if (oc.hood && o.hat !== 'hood') body += '<path d="M' + f(-A.w * 0.62) + ' ' + f(shY + 10) + ' Q' + f(-A.w * 0.7) + ' ' + f(shY - 16) + ' ' + f(-A.w * 0.2) + ' ' + f(shY - 8) + ' L0 ' + f(shY + 10) + ' L' + f(A.w * 0.2) + ' ' + f(shY - 8) + ' Q' + f(A.w * 0.7) + ' ' + f(shY - 16) + ' ' + f(A.w * 0.62) + ' ' + f(shY + 10) + ' Q0 ' + f(shY + 24) + ' ' + f(-A.w * 0.62) + ' ' + f(shY + 10) + ' Z" ' + st(oc.s) + '/>';
    }

    const head = '<g class="' + cls + '-head" transform="translate(0 ' + f(neckTop) + ')"><g class="' + cls + '-headin">' +
      hatBack(o, R, cy, oc) + hairBack(o, R, cy, hc) +
      '<circle cy="' + f(cy) + '" r="' + f(R) + '" ' + st(C.head) + '/>' +
      facial(o, R, cy, fx, hc) + hairFront(o, R, cy, hc) + face(cls, R, cy, fx) + mustache(o, R, cy, fx, hc) +
      (o.glasses ? glasses(R, cy, fx) : '') + hatFront(o, R, cy, fx, oc) + '</g></g>';

    return '<g class="' + cls + '"><g class="' + cls + '-root">' + leg('legL', -legX) + leg('legR', legX) + arm('armL', -1, o.itemL) +
      '<g class="' + cls + '-body">' + body + '</g>' + head + arm('armR', 1, o.item) + '</g></g>';
  };

  W.bindPerson = function (root, cls) {
    const q = (n) => root.querySelector('.' + cls + n);
    const m = { root: q('-root'), head: q('-head'), headin: q('-headin'), legL: q('-legL'), legR: q('-legR'), armL: q('-armL'), armLf: q('-armLf'), armLh: q('-armLh'), armR: q('-armR'), armRf: q('-armRf'), armRh: q('-armRh'), ex: {} };
    root.querySelectorAll('.' + cls + '-ex').forEach((g) => { const k = g.getAttribute('class').split(cls + '-ex-')[1]; m.ex[k] = g; });
    m.base = {}; ['head', 'legL', 'legR', 'armL', 'armR', 'armLf', 'armRf', 'armLh', 'armRh'].forEach((k) => { m.base[k] = m[k].getAttribute('transform'); });
    m.expr = null;
    return m;
  };

  // p: x y s flip lean bob head sq expr blink a1 a2 a3 (right arm) b1 b2 b3 (left arm) legL legR
  W.posePerson = function (m, p) {
    const r = (k, deg) => m[k].setAttribute('transform', m.base[k] + ' rotate(' + f(deg || 0) + ')');
    const s = p.s || 1, fl = p.flip ? -1 : 1;
    m.root.setAttribute('transform', 'translate(' + f(p.x || 0) + ' ' + f((p.y || 0) + (p.bob || 0)) + ') scale(' + f(s * fl) + ' ' + f(s) + ') rotate(' + f(p.lean || 0) + ')');
    r('head', p.head); m.headin.setAttribute('transform', 'scale(' + f(1 / (p.sq || 1)) + ' ' + f(p.sq || 1) + ')');
    // hands keep held items upright unless a3/b3 is given
    const a1 = p.a1 == null ? -8 : p.a1, a2 = p.a2 == null ? -6 : p.a2, b1 = p.b1 == null ? 8 : p.b1, b2 = p.b2 == null ? 6 : p.b2;
    r('armR', a1); r('armRf', a2); r('armRh', p.a3 == null ? -(a1 + a2) : p.a3);
    r('armL', b1); r('armLf', b2); r('armLh', p.b3 == null ? -(b1 + b2) : p.b3);
    r('legL', p.legL); r('legR', p.legR);
    const e = m.ex[p.expr] ? p.expr : 'neutral';
    if (m.expr !== e) { Object.values(m.ex).forEach((g) => (g.style.display = 'none')); m.ex[e].style.display = ''; m.expr = e; }
    const eyes = m.ex[e].querySelector('[class$="-eyes"]');
    if (eyes) { const b = p.blink == null ? 1 : p.blink; const ey = eyes.firstChild.getAttribute('cy'); eyes.setAttribute('transform', 'translate(0 ' + ey + ') scale(1 ' + f(b) + ') translate(0 ' + -ey + ')'); }
  };

  // 4-pose stepped walk (8 fps) like the reference channel
  W.walk = function (t, fps) { const k = ((Math.floor(t * (fps || 8)) % 4) + 4) % 4; return { legL: [22, 0, -22, 0][k], legR: [-22, 0, 22, 0][k], a1: [-18, -8, 10, -8][k], b1: [-10, 8, 18, 8][k], bob: [0, -6, 0, -6][k] }; };
  W.blinkAt = function (t, times) { for (const a of times) if (Math.abs(t - a) < 0.07) return 0.1; return 1; };
})();
