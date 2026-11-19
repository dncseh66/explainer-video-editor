// Channel scene kit: colour moods, backgrounds, props and infographic pieces (all inline SVG, 1920x1080 stage).
// Usage:  svg = '<svg viewBox="0 0 1920 1080">' + W.bg.dungeon(W.MOODS.dungeonWarm, { seed: 3 }) + W.prop.table(900, 760, 1) + '</svg>'
// Backgrounds return full-frame markup. Props draw with their base/feet at (x, y), scaled by s.
// Words never go in SVG: use W.info.labelHTML(...) for captions/labels (HTML, hand-lettered font).
(function () {
  const W = (window.W = window.W || {});
  const INK = '#2A2522', LN = 4;
  const f = (n) => (+n).toFixed(1);
  const st = (fill, w) => 'style="fill:' + fill + ';stroke:' + INK + ';stroke-width:' + (w || LN) + ';stroke-linejoin:round;stroke-linecap:round"';
  const ln = (col, w, extra) => 'style="fill:none;stroke:' + (col || INK) + ';stroke-width:' + (w || LN) + ';stroke-linecap:round;stroke-linejoin:round' + (extra || '') + '"';
  const rng = (seed) => { let s = (seed >>> 0) || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  let uid = 0; const id = (p) => p + '-' + (++uid);

  // ---------- colour moods (one dominant family per scene) ----------
  W.MOODS = {
    dungeonWarm:  { wall: '#E7A577', wall2: '#D88D5E', stone: '#F1BC8E', hi: '#EBB65E', floor: '#CDA57F', floor2: '#B88E69', glow: '#FFDFA6', wood: '#B98353', metal: '#7D7A80', sky: '#BFE3F0' },
    hallSage:     { wall: '#CFCF9A', wall2: '#BDBD85', stone: '#D9D9A8', hi: '#E6E2B4', floor: '#D3D2A2', floor2: '#C2C190', glow: '#FFD878', wood: '#C99A62', metal: '#9A9C92', sky: '#DDEBF0' },
    prisonTeal:   { wall: '#7AD3C8', wall2: '#5CBFB4', stone: '#F0C36A', hi: '#E8D2A2', floor: '#E3C6A2', floor2: '#CFAF8A', glow: '#FFD98A', wood: '#B98353', metal: '#7D8288', sky: '#7AD3C8' },
    stoneBlue:    { wall: '#8F9BA7', wall2: '#7C8894', stone: '#A2AEB9', hi: '#B6C0C9', floor: '#6F7984', floor2: '#626B75', glow: '#E8EEF2', wood: '#B98A5F', metal: '#4F555C', sky: '#BFE0EE' },
    stonePale:    { wall: '#E3DFD6', wall2: '#D2CDC2', stone: '#ECE8E0', hi: '#F4F1EB', floor: '#DCD6CA', floor2: '#CBC4B6', glow: '#FFF6E0', wood: '#C99A62', metal: '#8E8A84', sky: '#BFE3F3' },
    snowCold:     { wall: '#BCC2C7', wall2: '#A5ACB2', stone: '#CBD0D4', hi: '#EEF2F4', floor: '#EDF1F3', floor2: '#DCE3E8', glow: '#FFFFFF', wood: '#8A7E74', metal: '#6F757B', sky: '#C9D6DE' },
    fieldSpring:  { wall: '#B9DC8F', wall2: '#A5CE7E', stone: '#C9E4A6', hi: '#E4F2C9', floor: '#B4D98A', floor2: '#9FCB75', glow: '#FFFDF0', wood: '#B98A5F', metal: '#8E8A84', sky: '#DCEFF6', dirt: '#A87C5A' },
    hospitalMint: { wall: '#CDE8C4', wall2: '#BBDDB0', stone: '#DCEFD6', hi: '#EEF8EA', floor: '#E8ECEE', floor2: '#D6DCE0', glow: '#FFFFFF', wood: '#C9A57A', metal: '#A9B2BA', sky: '#CFE6F5', sheet: '#A9D39A' },
    infoPaper:    { wall: '#F6F7FB', wall2: '#D9DDEA', stone: '#FFFFFF', hi: '#FFFFFF', floor: '#F6F7FB', floor2: '#E8EBF3', glow: '#FFFFFF', shadow: '#BFE0F2', coral: '#F08A7E', blood: '#E06A5A', skin: '#F2C3A0' },
    prairieDust:  { wall: '#D9A86C', wall2: '#C08D55', stone: '#E7C08A', hi: '#F3DDB0', floor: '#E2BE8A', floor2: '#CDA170', glow: '#FFF1C8', wood: '#B98353', metal: '#6F6A66', sky: '#F4E2B8', mesa: '#D98C5F' },
    parlorRose:   { wall: '#C98F86', wall2: '#B57A72', stone: '#D9A59C', hi: '#E8C6B8', floor: '#8A5A40', floor2: '#74492F', glow: '#FFD58A', wood: '#8C5A3A', metal: '#7D7A80', sky: '#3B4A63', carpet: '#8E3B3B', flower: '#EAD7A6', leaf: '#86935E' },
    trailNight:   { wall: '#2F3A4F', wall2: '#26303F', stone: '#3E4A5E', hi: '#55627A', floor: '#4A5568', floor2: '#3E4A5E', glow: '#FFC86B', wood: '#7A5A3F', metal: '#5A606A', sky: '#2F3A4F' },
    mapSea:       { wall: '#9ED3CC', wall2: '#86C5BD', stone: '#E9C48A', hi: '#F3D9A8', floor: '#9ED3CC', floor2: '#86C5BD', glow: '#FFFFFF', coral: '#F08A7E' },
  };

  // soft "painted wash": two big low-contrast radial blooms over a flat fill (cheap, no filters)
  const wash = (pal, x, y) => { const g = id('wash'); return '<defs><radialGradient id="' + g + '" cx="' + (x || 0.35) + '" cy="' + (y || 0.3) + '" r="0.8"><stop offset="0" style="stop-color:' + (pal.hi || '#fff') + ';stop-opacity:.45"/><stop offset="1" style="stop-color:' + (pal.wall2 || '#000') + ';stop-opacity:.18"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#' + g + ')"/>'; };
  const glow = (x, y, r, col, a) => { const g = id('glow'); return '<defs><radialGradient id="' + g + '"><stop offset="0" style="stop-color:' + col + ';stop-opacity:' + (a || 0.75) + '"/><stop offset="1" style="stop-color:' + col + ';stop-opacity:0"/></radialGradient></defs><circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="url(#' + g + ')"/>'; };
  W.glow = glow;

  // rounded, slightly irregular stone block (the channel's signature masonry)
  const block = (r, x, y, w, h, fill) => { const j = () => (r() - 0.5) * 6; const rx = Math.min(w, h) * 0.22; return '<rect x="' + f(x + j()) + '" y="' + f(y + j()) + '" width="' + f(w + j()) + '" height="' + f(h + j()) + '" rx="' + f(rx) + '" ' + st(fill, LN - 0.5) + '/>'; };
  // a wall of stones: full courses or sparse "suggested" stones like the reference
  function masonry(r, pal, x0, y0, x1, y1, o) {
    o = o || {}; let s = ''; const h = o.h || 90, gap = o.gap || 10;
    for (let y = y0, row = 0; y < y1; y += h + gap, row++) {
      for (let x = x0 - (row % 2 ? 70 : 0); x < x1;) {
        const w = 120 + r() * 110;
        if (!o.sparse || r() < 0.38) s += block(r, x, y, w, h, r() < 0.15 ? pal.hi : (r() < 0.5 ? pal.stone : pal.wall));
        x += w + gap;
      }
    }
    return s;
  }

  // ---------- props ----------
  const P = (x, y, s, body) => '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + (s || 1) + ')">' + body + '</g>';
  W.prop = {
    table(x, y, s, pal) { const w = (pal && pal.wood) || '#C99A62'; const grain = [0, 1, 2].map((i) => '<path d="M' + (-330 + i * 160) + ' ' + (-150 + i * 9) + ' h' + (120 - i * 20) + '" ' + ln('#8C6440', 3) + '/>').join('');
      return P(x, y, s, '<path d="M-300 -110 v110 M300 -110 v110 M-260 -110 v96 M260 -110 v96" ' + ln(INK, 26) + '/><path d="M-300 -110 v110 M300 -110 v110 M-260 -110 v96 M260 -110 v96" ' + ln(w, 18) + '/><rect x="-370" y="-170" width="740" height="56" rx="8" ' + st(w) + '/><path d="M-366 -142 H366" ' + ln('#8C6440', 3) + '/>' + grain); },
    bench(x, y, s, pal) { const w = (pal && pal.wood) || '#C99A62'; return P(x, y, s, '<path d="M-180 -70 v70 M180 -70 v70" ' + ln(INK, 24) + '/><path d="M-180 -70 v70 M180 -70 v70" ' + ln(w, 16) + '/><rect x="-220" y="-92" width="440" height="30" rx="6" ' + st(w) + '/>'); },
    stool(x, y, s, pal) { const w = (pal && pal.wood) || '#C99A62'; return P(x, y, s, '<path d="M-50 -80 L-62 0 M50 -80 L62 0 M-55 -36 H55" ' + ln(INK, 18) + '/><path d="M-50 -80 L-62 0 M50 -80 L62 0" ' + ln(w, 11) + '/><rect x="-74" y="-98" width="148" height="24" rx="6" ' + st(w) + '/>'); },
    bowl(x, y, s) { return P(x, y, s, '<path d="M-44 -30 Q0 18 44 -30 Z" ' + st('#A7A39C') + '/><ellipse cx="0" cy="-30" rx="44" ry="10" ' + st('#C9A35E', 3) + '/>'); },
    cup(x, y, s) { return P(x, y, s, '<path d="M-26 -70 L-20 0 H20 L26 -70 Z" ' + st('#C58E5E') + '/><ellipse cx="0" cy="-70" rx="26" ry="7" ' + st('#8C6440', 3) + '/>'); },
    torch(x, y, s, t) { const k = 1 + 0.07 * Math.sin((t || 0) * 13); return P(x, y, s, glow(0, -110, 220, '#FFD9A0', 0.6) + '<path d="M-26 -20 h52 v16 h-52 z" ' + st('#7D7A80', 3) + '/><path d="M0 -10 L0 -90" ' + ln(INK, 18) + '/><path d="M0 -10 L0 -90" ' + ln('#9C7246', 11) + '/><g class="kit-flame" style="transform-box:fill-box;transform-origin:50% 100%"><g transform="translate(0 -96) scale(' + f(1 / k) + ' ' + f(k) + ')"><path d="M0 -70 Q22 -30 13 -8 Q0 4 -13 -8 Q-22 -30 0 -70 Z" ' + st('#F6A93B', 3) + '/><path d="M0 -40 Q9 -20 5 -8 Q0 -2 -5 -8 Q-9 -20 0 -40 Z" style="fill:#FFE08A"/></g></g>'); },
    fire(x, y, s, t) { const k = 1 + 0.06 * Math.sin((t || 0) * 11); return P(x, y, s, glow(0, -80, 260, '#FFD27A', 0.7) + '<path d="M-70 -6 L70 -22 M-70 -22 L70 -6" ' + ln(INK, 22) + '/><path d="M-70 -6 L70 -22 M-70 -22 L70 -6" ' + ln('#9C6A3E', 14) + '/><g class="kit-flame" style="transform-box:fill-box;transform-origin:50% 100%"><g transform="scale(' + f(1 / k) + ' ' + f(k) + ')"><path d="M-60 -20 Q-70 -90 -30 -120 Q-30 -80 0 -170 Q40 -110 30 -80 Q60 -100 58 -40 Q50 -14 0 -14 Q-50 -14 -60 -20 Z" ' + st('#F6A93B', 3.5) + '/><path d="M-30 -24 Q-30 -70 0 -100 Q24 -60 28 -24 Z" style="fill:#FFE08A"/></g></g>'); },
    window(x, y, s, pal, arched) { const sky = (pal && pal.sky) || '#BFE3F0'; const top = arched ? 'M-90 0 V-200 Q-90 -290 0 -290 Q90 -290 90 -200 V0 Z' : 'M-70 0 V-260 H70 V0 Z';
      return P(x, y, s, '<path d="' + top + '" ' + st('#7C8894', LN) + ' transform="scale(1.16 1.06)"/><path d="' + top + '" ' + st(sky) + '/><path d="M-60 -40 Q-10 -120 50 -70 Q80 -40 60 -10" style="fill:#9CC98A;opacity:.8"/><path d="M-30 0 L-70 -220 M10 0 L-20 -200" ' + ln('#FFFFFF', 10, ';opacity:.5') + '/>'); },
    barredWindow(x, y, s, pal) { return P(x, y, s, '<rect x="-80" y="-110" width="160" height="110" rx="6" ' + st((pal && pal.sky) || '#BFE3F0') + '/>' + [-40, 0, 40].map((b) => '<path d="M' + b + ' -110 V0" ' + ln('#5E5A60', 12) + '/>').join('') + '<rect x="-80" y="-110" width="160" height="110" rx="6" ' + ln(INK, LN) + '/>'); },
    bars(x, y, s, w, h) { w = w || 380; h = h || 620; let b = ''; for (let i = 0; i <= 6; i++) b += '<path d="M' + f(-w / 2 + (w * i) / 6) + ' ' + -h + ' V0" ' + ln(INK, 18) + '/><path d="M' + f(-w / 2 + (w * i) / 6) + ' ' + -h + ' V0" ' + ln('#8A8790', 10) + '/>';
      return P(x, y, s, b + [-h * 0.72, -h * 0.28].map((yy) => '<path d="M' + -w / 2 + ' ' + f(yy) + ' H' + w / 2 + '" ' + ln(INK, 20) + '/><path d="M' + -w / 2 + ' ' + f(yy) + ' H' + w / 2 + '" ' + ln('#8A8790', 12) + '/>').join('')); },
    bed(x, y, s, pal) { const m = '#A9B2BA', sh = (pal && pal.sheet) || '#A9D39A'; const rail = (xx, hh) => '<path d="M' + xx + ' 0 V' + -hh + '" ' + ln(INK, 14) + '/><path d="M' + xx + ' 0 V' + -hh + '" ' + ln(m, 8) + '/>';
      return P(x, y, s, rail(-300, 260) + rail(-240, 260) + rail(300, 180) + '<path d="M-300 -250 H-240" ' + ln(INK, 14) + '/><rect x="-290" y="-170" width="600" height="60" rx="10" ' + st('#FFFFFF') + '/><path d="M-250 -168 q30 -40 90 -30 q20 30 -10 40 Z" ' + st('#FFFFFF') + '/><path d="M-130 -175 H300 L310 -100 Q100 -84 -120 -100 Z" ' + st(sh) + '/><path d="M-130 -160 H300" ' + ln('#FFFFFF', 10) + '/>'); },
    scroll(x, y, s) { return P(x, y, s, '<path d="M-150 -380 H150 V-40 H-150 Z" ' + st('#F5E8C8') + '/><rect x="-170" y="-400" width="340" height="40" rx="20" ' + st('#EADAB2') + '/><rect x="-170" y="-60" width="340" height="40" rx="20" ' + st('#EADAB2') + '/>'); },
    quill(x, y, s) { return P(x, y, s, '<path d="M0 0 L150 -60 Q200 -90 240 -70 Q200 -40 150 -50 Z" ' + st('#FFFFFF', 3) + '/><path d="M0 0 L190 -68" ' + ln(INK, 2.5) + '/>'); },
    barrel(x, y, s, pal) { const w = (pal && pal.wood) || '#C99A62'; return P(x, y, s, '<path d="M-70 0 Q-92 -90 -70 -180 H70 Q92 -90 70 0 Z" ' + st(w) + '/><path d="M-82 -40 H82 M-84 -140 H84" ' + ln('#5E5A60', 10) + '/>'); },
    door(x, y, s, pal) { const w = (pal && pal.wood) || '#B98353'; return P(x, y, s, '<path d="M-100 0 V-240 Q-100 -330 0 -330 Q100 -330 100 -240 V0 Z" ' + st(w) + '/><path d="M-50 -300 V0 M0 -330 V0 M50 -300 V0" ' + ln('#8C6440', 4) + '/><circle cx="64" cy="-140" r="10" ' + st('#7D7A80', 3) + '/>'); },
    straw(x, y, s, n, seed) { const r = rng(seed || 5); let p = ''; for (let i = 0; i < (n || 30); i++) { const a = (r() - 0.5) * 300, b = (r() - 0.5) * 50, l = 24 + r() * 30, d = (r() - 0.5) * 1.6; p += '<path d="M' + f(a) + ' ' + f(b) + ' l' + f(l * Math.cos(d)) + ' ' + f(l * Math.sin(d)) + '" ' + ln('#D9B45E', 4) + '/>'; } return P(x, y, s, p); },
    tree(x, y, s, seed) { const r = rng(seed || 3); let p = '<path d="M0 0 L0 -150" ' + ln(INK, 9) + '/>'; const br = (x0, y0, a, l, d) => { if (d > 3) return; const x1 = x0 + Math.sin(a) * l, y1 = y0 - Math.cos(a) * l; p += '<path d="M' + f(x0) + ' ' + f(y0) + ' L' + f(x1) + ' ' + f(y1) + '" ' + ln(INK, 7 - d * 1.6) + '/>'; br(x1, y1, a - 0.45 - r() * 0.2, l * 0.68, d + 1); br(x1, y1, a + 0.45 + r() * 0.2, l * 0.68, d + 1); }; br(0, -120, -0.3, 70, 0); br(0, -140, 0.35, 64, 0); return P(x, y, s, p); },
    fence(x, y, s, n, pal) { const w = (pal && pal.wood) || '#B98A5F'; n = n || 4; let p = '<path d="M0 -70 H' + n * 160 + ' M0 -36 H' + n * 160 + '" ' + ln(INK, 16) + '/><path d="M0 -70 H' + n * 160 + ' M0 -36 H' + n * 160 + '" ' + ln(w, 9) + '/>'; for (let i = 0; i <= n; i++) p += '<rect x="' + (i * 160 - 9) + '" y="-96" width="18" height="96" rx="3" ' + st(w, 3) + '/>'; return P(x, y, s, p); },
    flower(x, y, s, col) { return P(x, y, s, '<path d="M0 0 Q4 -40 0 -70" ' + ln('#6FA35A', 4) + '/><path d="M0 -30 q20 -14 26 4 q-14 6 -26 -4" ' + st('#8DC06E', 2.5) + '/>' + [0, 72, 144, 216, 288].map((a) => '<ellipse cx="0" cy="-86" rx="8" ry="15" transform="rotate(' + a + ' 0 -72)" ' + st(col || '#FFFFFF', 2.5) + '/>').join('') + '<circle cx="0" cy="-72" r="7" ' + st('#F2C14E', 2) + '/>'); },
    grass(x, y, s) { return P(x, y, s, '<path d="M-12 0 Q-10 -22 -18 -34 M0 0 Q2 -30 6 -42 M10 0 Q14 -18 24 -26" ' + ln('#5E8F4A', 3.5) + '/>'); },
    cloud(x, y, s) { return P(x, y, s, '<path d="M-150 0 Q-150 -40 -100 -40 Q-80 -80 -20 -70 Q20 -100 70 -64 Q130 -70 140 -24 Q170 -10 150 0 Z" ' + st('#B8BEC4', 3) + '/>'); },
    // ---- Wild West (added 2026-11-18) ----
    // false-front store, base = boardwalk at (x,y), 380 wide. o: {col, seed, plank (blank sign board), porch}
    storefront(x, y, s, pal, o) { o = o || {}; const r = rng(o.seed || 1); const c = o.col || pal.wall, top = o.top || (-440 - Math.round(r() * 3) * 20);
      const cap = r() < 0.5 ? '<path d="M-190 ' + top + ' H190" ' + ln(INK, 14) + '/><path d="M-200 ' + top + ' H200" ' + ln(pal.wood, 8) + '/>' : '<path d="M-60 ' + top + ' Q0 ' + (top - 50) + ' 60 ' + top + ' Z" ' + st(c) + '/>';
      let b = '<rect x="-190" y="' + top + '" width="380" height="' + -top + '" ' + st(c) + '/>' + cap;
      for (let k = top + 34; k < -20; k += 34) b += '<path d="M-186 ' + k + ' H186" ' + ln('rgba(42,37,34,.16)', 3) + '/>';
      b += '<path d="M60 ' + (top + 4) + ' V-4 L190 -4 V' + (top + 4) + ' Z" style="fill:' + (pal.wall2 || '#000') + ';opacity:.35"/>';
      if (o.plank !== false) b += '<rect x="-150" y="' + (top + 30) + '" width="300" height="76" rx="6" ' + st(pal.hi || '#F3DDB0') + '/>';
      const win = (wx) => '<rect x="' + (wx - 46) + '" y="-250" width="92" height="130" rx="4" ' + st(pal.sky || '#BFE3F0') + '/><path d="M' + wx + ' -250 V-120 M' + (wx - 46) + ' -185 H' + (wx + 46) + '" ' + ln(INK, 4) + '/><path d="M' + (wx - 30) + ' -150 l30 -40" ' + ln('rgba(255,255,255,.7)', 6) + '/>';
      b += win(-118) + win(118);
      b += '<rect x="-62" y="-246" width="124" height="246" ' + st('#7A5236') + '/><rect x="-50" y="-236" width="100" height="236" ' + st('#C9A06A') + '/><path d="M-20 -236 V0 M20 -236 V0" ' + ln('rgba(42,37,34,.35)', 3) + '/><rect x="30" y="-128" width="14" height="22" rx="3" ' + st('#4F555C', 3) + '/>';
      if (o.porch !== false) b += '<path d="M-205 -300 L205 -300 L195 -270 L-195 -270 Z" ' + st(pal.wood) + '/><path d="M-178 -270 V0 M178 -270 V0" ' + ln(INK, 16) + '/><path d="M-178 -270 V0 M178 -270 V0" ' + ln(pal.wood, 9) + '/>';
      return P(x, y, s, b); },
    hitchPost(x, y, s, pal) { const w = (pal && pal.wood) || '#B98353'; return P(x, y, s, '<path d="M-90 -90 H90 M-80 0 V-96 M80 0 V-96" ' + ln(INK, 18) + '/><path d="M-90 -90 H90 M-80 0 V-96 M80 0 V-96" ' + ln(w, 10) + '/>'); },
    settee(x, y, s, col) { col = col || '#B9A27A'; return P(x, y, s, '<path d="M-250 -60 V-210 Q-250 -270 -170 -262 Q0 -300 170 -262 Q250 -270 250 -210 V-60 Z" ' + st(col) + '/>' +
      '<rect x="-270" y="-120" width="540" height="70" rx="22" ' + st(col) + '/><path d="M-270 -150 Q-300 -150 -290 -90 L-262 -60 M270 -150 Q300 -150 290 -90 L262 -60" ' + st(col) + '/>' +
      '<path d="M-230 -50 L-240 0 M230 -50 L240 0" ' + ln(INK, 14) + '/><path d="M-230 -50 L-240 0 M230 -50 L240 0" ' + ln('#6B4A2E', 7) + '/>' +
      [-170, -60, 50, 160].map((xx) => '<circle cx="' + xx + '" cy="-200" r="7" style="fill:rgba(42,37,34,.35)"/>').join('')); },
    piano(x, y, s) { return P(x, y, s, '<rect x="-230" y="-330" width="460" height="330" rx="10" ' + st('#5A3A2A') + '/><rect x="-250" y="-350" width="500" height="34" rx="8" ' + st('#6E4A35') + '/>' +
      '<rect x="-200" y="-300" width="400" height="110" rx="6" ' + st('#4A2F22') + '/><rect x="-236" y="-176" width="472" height="40" ' + st('#FFFBEA') + '/>' +
      Array.from({ length: 16 }, (_, i) => '<path d="M' + (-236 + i * 29.5) + ' -176 V-136" ' + ln(INK, 2.5) + '/>' + (i % 7 === 2 || i % 7 === 6 ? '' : '<rect x="' + (-226 + i * 29.5) + '" y="-176" width="14" height="24" style="fill:' + INK + '"/>')).join('') +
      '<path d="M-200 -136 V-10 M200 -136 V-10" ' + ln(INK, 18) + '/><path d="M-200 -136 V-10 M200 -136 V-10" ' + ln('#6E4A35', 10) + '/>'); },
    keroLamp(x, y, s, t, on) { const k = 1 + 0.04 * Math.sin((t || 0) * 9); return P(x, y, s, (on === false ? '' : glow(0, -110, 260 * k, '#FFD58A', 0.55)) +
      '<path d="M-40 0 Q-44 -20 -20 -26 H20 Q44 -20 40 0 Z" ' + st('#B98353') + '/><path d="M-30 -26 Q-60 -70 -24 -96 H24 Q60 -70 30 -26 Z" ' + st('#E3B341') + '/>' +
      '<path d="M-16 -96 Q-30 -130 -12 -170 H12 Q30 -130 16 -96 Z" ' + st('rgba(235,245,250,.7)', 3.5) + '/>' + (on === false ? '' : '<path d="M0 -150 Q12 -128 0 -110 Q-12 -128 0 -150 Z" style="fill:#FFB347"/>')); },
    washstand(x, y, s) { return P(x, y, s, '<rect x="-110" y="-200" width="220" height="200" rx="6" ' + st('#B98353') + '/><path d="M-110 -150 H110" ' + ln(INK, 4) + '/><circle cx="0" cy="-90" r="8" style="fill:' + INK + '"/>' +
      '<path d="M-90 -200 Q0 -150 90 -200 Z" ' + st('#F4F1EB') + '/><path d="M-30 -210 Q-40 -300 0 -310 Q40 -300 30 -210 Z" ' + st('#F4F1EB') + '/><path d="M30 -290 Q60 -280 40 -240" ' + ln(INK, 5) + '/>'); },
    cactus(x, y, s) { return P(x, y, s, '<path d="M-24 0 V-200 Q-24 -230 0 -230 Q24 -230 24 -200 V0 Z M24 -110 H60 V-160 Q60 -176 72 -176 Q84 -176 84 -160 V-90 H24 M-24 -80 H-60 V-130 Q-60 -146 -72 -146 Q-84 -146 -84 -130 V-60 H-24" ' + st('#7FA36A') + '/>'); },
    house(x, y, s, pal, seed) { const r = rng(seed || 7); const w = 160 + r() * 80, h = 110 + r() * 50; return P(x, y, s, '<rect x="' + f(-w / 2) + '" y="' + f(-h) + '" width="' + f(w) + '" height="' + f(h) + '" ' + st('#EFE6D6') + '/><path d="M' + f(-w / 2) + ' ' + f(-h) + ' H' + f(w / 2) + ' M' + f(-w / 4) + ' 0 V' + f(-h) + ' M' + f(w / 4) + ' 0 V' + f(-h) + ' M' + f(-w / 2) + ' ' + f(-h / 2) + ' L' + f(-w / 4) + ' ' + f(-h) + ' M' + f(w / 4) + ' ' + f(-h) + ' L' + f(w / 2) + ' ' + f(-h / 2) + '" ' + ln('#7A5236', 6) + '/><path d="M' + f(-w / 2 - 20) + ' ' + f(-h) + ' L0 ' + f(-h - 90) + ' L' + f(w / 2 + 20) + ' ' + f(-h) + ' Z" ' + st('#B5694A') + '/>'); },
    tower(x, y, s, pal, roof) { const c = (pal && pal.wall) || '#BCC2C7'; return P(x, y, s, '<rect x="-50" y="-300" width="100" height="300" ' + st(c) + '/>' + (roof ? '<path d="M-62 -300 L0 -400 L62 -300 Z" ' + st((pal && pal.hi) || '#EEF2F4') + '/>' : '<path d="M-58 -300 v-26 h22 v14 h22 v-14 h28 v14 h22 v-14 h22 v26 Z" ' + st(c) + '/>') + '<rect x="-8" y="-220" width="16" height="34" rx="8" ' + st('#4F555C', 2.5) + '/><path d="M-30 -120 h18 M10 -80 h22" ' + ln(INK, 2.5) + '/>'); },
    church(x, y, s, pal) { const c = (pal && pal.wall) || '#BCC2C7', rf = (pal && pal.hi) || '#EEF2F4'; return P(x, y, s, '<rect x="-260" y="-200" width="380" height="200" ' + st(c) + '/><path d="M-280 -200 L-70 -300 L140 -200 Z" ' + st(rf) + '/><rect x="120" y="-380" width="110" height="380" ' + st(c) + '/><path d="M110 -380 L175 -460 L240 -380 Z" ' + st(rf) + '/><path d="M175 -460 v-40 M160 -486 h30" ' + ln(INK, 4) + '/><path d="M155 -300 v-40 a20 20 0 0 1 40 0 v40 Z" ' + st('#4F555C', 3) + '/>' + [-220, -150, -80, -10, 60].map((xx) => '<path d="M' + xx + ' -60 v-70 a14 14 0 0 1 28 0 v70 Z" ' + st('#4F555C', 2.5) + '/>').join('') + '<path d="M140 0 v-70 a35 35 0 0 1 70 0 v70" ' + st('#4F555C', 3) + '/>'); },
  };

  W.STREET_TOPS = [-460, -440, -480, -440, -460]; // false-front heights on mainStreet (sign plank top = 760 + top + 30)
  // ---------- backgrounds (full 1920x1080) ----------
  W.bg = {
    // stone interior: suggested blocks on a flat wall + floor band (13, 15, 18)
    stoneRoom(pal, o) { o = o || {}; const r = rng(o.seed || 1); const fy = o.floorY || 820;
      return '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/>' + wash(pal) + masonry(r, pal, -60, 40, 1980, fy - 20, { sparse: o.sparse !== false }) +
        '<rect y="' + fy + '" width="1920" height="' + (1080 - fy) + '" style="fill:' + pal.floor + '"/><path d="M0 ' + fy + ' H1920" ' + ln(INK, LN) + '/>' +
        (o.flagstones ? Array.from({ length: 9 }, (_, i) => '<path d="M' + (i * 240 - 120) + ' 1080 L' + (i * 240 + (i - 4) * 18) + ' ' + fy + '" ' + ln(INK, 3) + '/>').join('') + '<path d="M0 ' + (fy + 110) + ' H1920" ' + ln(INK, 3) + '/>' : ''); },
    // gothic vaulted hall with fireplace (05)
    vaultHall(pal, o) { o = o || {}; let s = '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/>' + wash(pal, 0.5, 0.45);
      const rib = (cx, w, top) => '<path d="M' + f(cx - w) + ' 1080 V420 Q' + f(cx - w) + ' ' + top + ' ' + cx + ' ' + (top - 40) + ' Q' + f(cx + w) + ' ' + top + ' ' + f(cx + w) + ' 420 V1080" ' + ln(INK, LN) + '/><path d="M' + f(cx - w + 34) + ' 1080 V430 Q' + f(cx - w + 34) + ' ' + (top + 34) + ' ' + cx + ' ' + (top - 4) + ' Q' + f(cx + w - 34) + ' ' + (top + 34) + ' ' + f(cx + w - 34) + ' 430 V1080" ' + ln(INK, 2.5) + '/>';
      s += '<path d="M0 0 H1920 V250 Q1500 60 960 40 Q420 60 0 250 Z" style="fill:' + pal.wall2 + '"/>' + rib(960, 640, 60) + rib(160, 340, 90) + rib(1760, 340, 90);
      s += '<rect y="700" width="1920" height="380" style="fill:' + pal.floor + '"/><path d="M0 700 H1920" ' + ln(INK, LN) + '/>';
      if (o.fireplace !== false) { s += '<path d="M800 700 V520 Q800 400 960 400 Q1120 400 1120 520 V700 Z" ' + st(pal.glow) + '/>'; for (let a = 0; a < 9; a++) { const ang = Math.PI * (1 - a / 8); s += '<path d="M' + f(960 + 160 * Math.cos(ang)) + ' ' + f(520 - 120 * Math.sin(ang)) + ' L' + f(960 + 190 * Math.cos(ang)) + ' ' + f(520 - 150 * Math.sin(ang)) + '" ' + ln(INK, 3) + '/>'; } s += '<path d="M770 700 V520 Q770 370 960 370 Q1150 370 1150 520 V700" ' + ln(INK, 3) + '/>' + W.prop.fire(960, 690, 0.9, o.t); }
      return s; },
    // warm dungeon cell: barrel vault, highlighted stones, barred window, torch, straw (17)
    dungeon(pal, o) { o = o || {}; const r = rng(o.seed || 2);
      let s = '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/>' + '<path d="M0 0 H1920 V200 Q960 -60 0 200 Z" style="fill:' + pal.wall2 + '"/><path d="M0 200 Q960 -60 1920 200" ' + ln(INK, LN) + '/><path d="M0 240 Q960 0 1920 240" ' + ln(INK, 3) + '/>' + wash(pal, 0.6, 0.3);
      for (let i = 0; i < 26; i++) { const x = r() * 1880, y = 260 + r() * 420, w = 70 + r() * 70; s += block(r, x, y, w, 50, r() < 0.4 ? pal.hi : pal.stone); }
      s += W.prop.barredWindow(1180, 330, 0.9, pal) + W.prop.torch(1440, 430, 1, o.t);
      s += '<path d="M0 760 Q960 700 1920 760 V1080 H0 Z" style="fill:' + pal.floor + '"/><path d="M0 760 Q960 700 1920 760" ' + ln(INK, LN) + '/>';
      for (let i = 0; i < 12; i++) s += '<rect x="' + f(r() * 1800) + '" y="' + f(800 + r() * 240) + '" width="' + f(120 + r() * 120) + '" height="' + f(46 + r() * 30) + '" rx="18" ' + st(pal.floor2, 2.5) + '/>';
      s += W.prop.straw(700, 900, 1.2, 40, 4) + W.prop.straw(1500, 980, 1, 30, 8) + '<ellipse cx="1100" cy="960" rx="120" ry="24" style="fill:' + pal.floor2 + ';opacity:.8"/>';
      if (o.bars !== false) s += W.prop.bars(150, 1000, 1.2, 380, 760);
      return s; },
    // teal + mustard prison corridor in one-point perspective (10)
    corridor(pal, o) { o = o || {}; const r = rng(o.seed || 4);
      let s = '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/><path d="M0 0 H1920 L1500 250 H420 Z" style="fill:' + pal.stone + '"/><path d="M0 0 L420 250 M1920 0 L1500 250" ' + ln(INK, LN) + '/>';
      s += '<path d="M0 0 L420 250 V760 L0 1000 Z" style="fill:' + pal.stone + '"/><path d="M1920 0 L1500 250 V760 L1920 1000 Z" style="fill:' + pal.stone + '"/><path d="M420 250 V760 M1500 250 V760" ' + ln(INK, LN) + '/>';
      s += '<path d="M600 760 V420 Q600 260 960 260 Q1320 260 1320 420 V760 Z" style="fill:' + pal.wall2 + '"/><path d="M560 760 V420 Q560 220 960 220 Q1360 220 1360 420 V760" ' + ln(INK, LN) + '/><path d="M600 760 V420 Q600 260 960 260 Q1320 260 1320 420 V760" ' + ln(INK, 3) + '/>';
      for (let i = 0; i < 9; i++) { const a = Math.PI * (1 - i / 8); s += '<path d="M' + f(960 + 380 * Math.cos(a)) + ' ' + f(420 - 180 * Math.sin(a)) + ' L' + f(960 + 400 * Math.cos(a)) + ' ' + f(420 - 200 * Math.sin(a)) + '" ' + ln(INK, 3) + '/>'; }
      for (let i = 0; i < 6; i++) { s += block(r, 30 + r() * 40, 320 + i * 110, 110, 80, pal.hi) + block(r, 1780 + r() * 40, 320 + i * 110, 110, 80, pal.hi); }
      s += W.prop.torch(470, 470, 0.9, o.t) + W.prop.torch(1450, 470, 0.9, o.t + 1);
      s += '<path d="M0 1000 L420 760 H1500 L1920 1000 V1080 H0 Z" style="fill:' + pal.floor + '"/><path d="M0 1000 L420 760 H1500 L1920 1000" ' + ln(INK, LN) + '/>';
      for (let i = 0; i < 14; i++) s += '<path d="M' + f(300 + r() * 1300) + ' ' + f(800 + r() * 260) + ' h' + f(20 + r() * 40) + '" ' + ln(INK, 3) + '/>';
      if (o.gates !== false) s += W.prop.bars(300, 820, 0.85, 300, 640) + W.prop.bars(1620, 820, 0.85, 300, 640);
      return s; },
    // cold snow landscape with church and walled town (06)
    snowTown(pal, o) { o = o || {}; const r = rng(o.seed || 6);
      let s = '<rect width="1920" height="1080" style="fill:' + pal.sky + '"/>' + W.prop.cloud(300, 120, 1.4) + W.prop.cloud(1400, 90, 1.8) + W.prop.cloud(980, 180, 1);
      s += '<path d="M0 430 Q500 300 1000 380 T1920 330 V1080 H0 Z" style="fill:' + pal.floor2 + '"/><path d="M0 430 Q500 300 1000 380 T1920 330" ' + ln(INK, 3) + '/>';
      s += '<path d="M0 560 Q700 430 1920 520 V1080 H0 Z" style="fill:' + pal.floor + '"/><path d="M0 560 Q700 430 1920 520" ' + ln(INK, 3) + '/>';
      s += W.prop.church(700, 730, 1, pal);
      let town = ''; for (let x = 1080; x < 1960; x += 120) town += W.prop.house(x + r() * 30, 690 + r() * 40, 0.8, pal, x); s += town.replace(/#EFE6D6/g, pal.stone).replace(/#B5694A/g, pal.hi).replace(/#7A5236/g, '#8A9097');
      s += '<rect x="1000" y="640" width="960" height="190" ' + st(pal.wall) + '/>'; for (let x = 1000; x < 1960; x += 50) s += '<rect x="' + x + '" y="618" width="26" height="26" ' + st(pal.wall, 3) + '/>';
      s += W.prop.tower(1040, 840, 0.95, pal) + W.prop.tower(1420, 840, 1.05, pal, true) + W.prop.tower(1820, 840, 0.95, pal);
      s += W.prop.tree(120, 1000, 1.4, 1) + W.prop.tree(330, 1060, 1.2, 2) + W.prop.tree(980, 900, 0.8, 3) + W.prop.tree(1600, 1050, 1, 4);
      return s; },
    // pastel spring field with fence (14)
    field(pal, o) { o = o || {}; const r = rng(o.seed || 9);
      let s = '<rect width="1920" height="1080" style="fill:' + pal.sky + '"/>';
      s += '<path d="M0 500 Q300 440 700 480 T1400 450 T1920 470 V1080 H0 Z" style="fill:' + pal.stone + '"/><path d="M0 500 Q300 440 700 480 T1400 450 T1920 470" ' + ln(INK, 2.5) + '/>';
      s += '<path d="M0 580 Q600 530 1300 570 T1920 560 V1080 H0 Z" style="fill:' + pal.floor + '"/><path d="M0 580 Q600 530 1300 570 T1920 560" ' + ln(INK, 3) + '/>';
      s += W.prop.fence(-40, 600, 1, 4, pal) + W.prop.fence(1300, 600, 1, 4, pal);
      for (let i = 0; i < 40; i++) s += W.prop.grass(r() * 1920, 620 + r() * 460, 0.8 + r() * 0.6);
      s += W.prop.flower(260, 860, 1, '#F2D16B') + W.prop.flower(1620, 1000, 1.3, '#B48CD8') + W.prop.flower(480, 990, 1, '#FFFFFF') + W.prop.flower(1300, 800, 0.8, '#B48CD8');
      return s; },
    // mint hospital ward with light from tall windows and perspective tiles (08)
    ward(pal, o) { o = o || {}; let s = '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/>' + wash(pal, 0.7, 0.2);
      [360, 860, 1360].forEach((x) => { s += '<rect x="' + x + '" y="40" width="150" height="420" ' + st(pal.sky) + '/><path d="M' + (x + 75) + ' 40 V460" ' + ln(INK, 3) + '/><path d="M' + (x + 30) + ' 460 L' + (x - 60) + ' 40 M' + (x + 110) + ' 460 L' + (x + 20) + ' 40" ' + ln('#FFFFFF', 14, ';opacity:.6') + '/>'; });
      s += '<path d="M0 640 H1920 V1080 H0 Z" style="fill:' + pal.floor + '"/><path d="M0 640 H1920" ' + ln(INK, LN) + '/>';
      for (let i = -6; i <= 14; i++) s += '<path d="M' + (i * 160) + ' 1080 L' + f(960 + (i * 160 - 960) * 0.45) + ' 640" ' + ln(INK, 2.5) + '/>';
      [740, 860, 1010].forEach((y) => (s += '<path d="M0 ' + y + ' H1920" ' + ln(INK, 2.5) + '/>'));
      if (o.beds !== false) s += W.prop.bed(1300, 640, 0.55, pal) + W.prop.bed(1700, 660, 0.7, pal) + W.prop.bed(560, 900, 1, pal);
      return s; },
    // ---- Wild West (added 2026-11-18) ----
    // cattle town main street: sun, mesas, 5 false-front stores (door centres x = 192 + 384*i, boardwalk top y = 760), dirt street
    mainStreet(pal, o) { o = o || {}; const r = rng(o.seed || 11); const cols = o.cols || [pal.wall, '#C9A47A', '#B98A6A', pal.wall, '#C7B08A'];
      let s = '<rect width="1920" height="1080" style="fill:' + pal.sky + '"/>' + glow(1540, 150, 420, '#FFF6D8', 0.8) + '<circle cx="1540" cy="150" r="70" ' + st('#FFF3CF', 3) + '/>';
      s += '<path d="M0 330 L140 330 L170 260 L360 260 L390 330 L900 330 L930 290 L1080 290 L1110 330 L1920 330 V480 H0 Z" ' + st(pal.mesa || '#D98C5F', 3) + '/>';
      s += '<path d="M0 400 Q500 370 960 390 T1920 380 V500 H0 Z" style="fill:' + pal.floor2 + '"/>';
      for (let i = 0; i < 5; i++) s += W.prop.storefront(192 + 384 * i, 760, 1, pal, { col: cols[i], seed: (o.seed || 11) + i * 7, plank: !(o.blank === i), top: W.STREET_TOPS[i] });
      s += '<rect y="752" width="1920" height="40" ' + st(pal.wood) + '/>'; for (let x = 40; x < 1920; x += 80) s += '<path d="M' + x + ' 754 V790" ' + ln('rgba(42,37,34,.35)', 3) + '/>';
      s += '<rect y="792" width="1920" height="288" style="fill:' + pal.floor + '"/><path d="M0 792 H1920" ' + ln(INK, LN) + '/>';
      s += '<path d="M0 930 Q960 900 1920 935 M0 1010 Q960 985 1920 1015" ' + ln('rgba(42,37,34,.18)', 6) + '/>';
      for (let i = 0; i < 18; i++) s += '<path d="M' + f(r() * 1900) + ' ' + f(830 + r() * 240) + ' h' + f(14 + r() * 26) + '" ' + ln('rgba(42,37,34,.3)', 3) + '/>';
      return s; },
    // cramped parlor: floral wallpaper (peeling seams), wainscot, worn carpet runner, staircase right, curtained window, doorway at x 120-300
    parlor(pal, o) { o = o || {}; const r = rng(o.seed || 21); const fy = o.floorY || 800;
      let s = '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/>';
      for (let x = 0; x < 1920; x += 120) s += '<rect x="' + x + '" y="0" width="60" height="' + fy + '" style="fill:' + pal.wall2 + ';opacity:.45"/>';
      for (let y = 60, row = 0; y < 600; y += 110, row++) for (let x = (row % 2) * 60 + 30; x < 1920; x += 120) s += '<g transform="translate(' + x + ' ' + y + ')"><circle r="9" style="fill:' + pal.flower + '"/>' + [0, 90, 180, 270].map((a) => '<ellipse cx="0" cy="-14" rx="6" ry="9" transform="rotate(' + a + ')" style="fill:' + pal.flower + ';opacity:.8"/>').join('') + '<path d="M10 10 q14 6 18 20" ' + ln(pal.leaf, 4) + '/></g>';
      (o.peel || [720, 1320]).forEach((x) => { s += '<path d="M' + x + ' 0 V600" ' + ln('rgba(42,37,34,.35)', 3) + '/><path d="M' + x + ' 40 q36 10 30 60 q-20 -14 -30 -10 Z" ' + st(pal.hi, 3) + '/><path d="M' + x + ' 380 q-30 20 -22 70 q14 -20 22 -24 Z" ' + st(pal.hi, 3) + '/>'; });
      s += '<rect y="600" width="1920" height="' + (fy - 600) + '" style="fill:' + pal.wood + '"/><path d="M0 600 H1920" ' + ln(INK, LN) + '/><path d="M0 616 H1920" ' + ln('rgba(42,37,34,.35)', 3) + '/>';
      for (let x = 60; x < 1920; x += 240) s += '<rect x="' + x + '" y="636" width="180" height="' + (fy - 660) + '" rx="6" ' + ln('rgba(42,37,34,.35)', 3) + '/>';
      s += '<rect y="' + fy + '" width="1920" height="' + (1080 - fy) + '" style="fill:' + pal.floor + '"/><path d="M0 ' + fy + ' H1920" ' + ln(INK, LN) + '/>';
      for (let i = 0; i < 12; i++) s += '<path d="M' + (i * 170 - 60) + ' 1080 L' + f(960 + (i * 170 - 1020) * 0.6) + ' ' + fy + '" ' + ln('rgba(42,37,34,.25)', 3) + '/>';
      s += '<path d="M220 ' + (fy + 4) + ' L1500 ' + (fy + 4) + ' L1760 1080 L-40 1080 Z" ' + st(pal.carpet) + '/><path d="M260 ' + (fy + 20) + ' L1480 ' + (fy + 20) + ' L1700 1060 L10 1060 Z" ' + ln('#C7A35E', 5) + '/>';
      s += '<path d="M640 ' + (fy + 30) + ' Q900 ' + (fy + 60) + ' 1100 ' + (fy + 120) + ' Q980 ' + (fy + 200) + ' 900 1080 L640 1080 Q700 ' + (fy + 160) + ' 640 ' + (fy + 30) + ' Z" style="fill:' + pal.floor + ';opacity:.75"/>';
      if (o.door !== false) s += '<rect x="110" y="300" width="200" height="' + (fy - 300) + '" ' + st('#3B2A22') + '/><rect x="96" y="286" width="228" height="' + (fy - 286) + '" ' + ln(INK, 4) + '/>';
      if (o.window !== false) s += '<rect x="560" y="140" width="220" height="300" ' + st(pal.sky) + '/><path d="M670 140 V440 M560 290 H780" ' + ln(INK, 4) + '/><circle cx="720" cy="200" r="14" style="fill:#F4EFD8"/>' +
        '<path d="M520 120 H820" ' + ln(INK, 10) + '/><path d="M530 124 Q560 300 540 470 L600 470 Q590 300 610 124 Z M810 124 Q780 300 800 470 L740 470 Q750 300 730 124 Z" ' + st('#9C4A4A') + '/>';
      if (o.stairs !== false) { s += '<path d="M1500 ' + fy + ' L1920 330 V' + fy + ' Z" style="fill:' + pal.floor2 + '"/>'; for (let i = 0; i < 8; i++) { const x = 1500 + i * 56, y = fy - i * 58; s += '<path d="M' + x + ' ' + y + ' V' + (y - 58) + ' H' + (x + 56) + '" ' + ln(INK, 4) + '/>'; }
        s += '<path d="M1520 ' + (fy - 150) + ' L1960 ' + (fy - 640) + '" ' + ln(INK, 18) + '/><path d="M1520 ' + (fy - 150) + ' L1960 ' + (fy - 640) + '" ' + ln(pal.wood, 10) + '/>'; for (let i = 0; i < 8; i++) s += '<path d="M' + (1530 + i * 56) + ' ' + (fy - 160 - i * 62) + ' V' + (fy - 20 - i * 58) + '" ' + ln(INK, 6) + '/>'; }
      return s; },
    // infographic paper: white with a faint grid (07)
    paper(pal) { let s = '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/>'; for (let x = 0; x <= 1920; x += 160) s += '<path d="M' + x + ' 0 V1080" ' + ln(pal.wall2, 3) + '/>'; for (let y = 40; y <= 1080; y += 160) s += '<path d="M0 ' + y + ' H1920" ' + ln(pal.wall2, 3) + '/>'; return s + wash(pal, 0.5, 0.5); },
    // map: teal sea; land paths come from you (W.style.land) (11)
    sea(pal) { return '<rect width="1920" height="1080" style="fill:' + pal.wall + '"/>' + wash(pal, 0.4, 0.4); },
  };

  // ---------- infographic pieces (07, 09, 11) ----------
  W.info = {
    // a white object with the channel's light-blue offset shadow; pass any path d
    shadowed(d, dx, dy, shadow) { return '<path d="' + d + '" transform="translate(' + (dx || -14) + ' ' + (dy || 10) + ')" style="fill:' + (shadow || '#BFE0F2') + '"/><path d="' + d + '" ' + st('#FFFFFF') + '/>'; },
    bone(x, y, s, rot) { const d = 'M-30 -260 Q-60 -330 -10 -340 Q20 -360 40 -320 Q90 -330 80 -280 Q70 -250 34 -240 L30 240 Q70 250 80 290 Q90 340 40 330 Q20 370 -10 350 Q-60 340 -30 270 Q-50 250 -34 240 L-30 -250 Z'; return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || -25) + ') scale(' + (s || 1) + ')">' + W.info.shadowed(d) + '</g>'; },
    arrow(x1, y1, x2, y2, col) { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); return '<g transform="translate(' + f(x1) + ' ' + f(y1) + ') rotate(' + f(a * 180 / Math.PI) + ')"><path d="M0 -16 H' + f(L - 56) + ' V-40 L' + f(L) + ' 0 L' + f(L - 56) + ' 40 V16 H0 Z" ' + st(col || '#F08A7E') + '/></g>'; },
    leader(x1, y1, x2, y2, bend) { const mx = (x1 + x2) / 2 + (bend || 40), my = (y1 + y2) / 2; return '<path d="M' + x1 + ' ' + y1 + ' Q' + f(mx) + ' ' + f(my) + ' ' + x2 + ' ' + y2 + '" ' + ln(INK, 3.5) + '/>'; },
    pointer(x1, y1, x2, y2) { const a = Math.atan2(y2 - y1, x2 - x1); return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + f(x2 - 22 * Math.cos(a - 0.45)) + ' ' + f(y2 - 22 * Math.sin(a - 0.45)) + ' L' + x2 + ' ' + y2 + ' L' + f(x2 - 22 * Math.cos(a + 0.45)) + ' ' + f(y2 - 22 * Math.sin(a + 0.45)) + '" ' + ln(INK, 3.5) + '/>'; },
    crack(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-60 0 L-34 -14 L-18 6 L4 -16 L22 4 L44 -12 L62 0" ' + ln(INK, 4) + '/></g>'; },
    impact(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' + [[-80, -40, -30], [70, -50, 30], [-70, 40, 200], [80, 30, 150]].map(([a, b, r]) => '<path d="M' + a + ' ' + b + ' l-14 -20 l26 4 Z" transform="rotate(' + r + ' ' + a + ' ' + b + ')" ' + st('#FFFFFF', 3) + '/>').join('') + '</g>'; },
    wound(x, y, s, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || -35) + ') scale(' + (s || 1) + ')"><path d="M-120 0 Q-60 -14 0 -10 Q60 -16 120 0 Q60 12 0 10 Q-60 16 -120 0 Z" style="fill:#E58A80;stroke:#C65A50;stroke-width:3"/><path d="M-90 0 Q0 -6 90 0" ' + ln('#C65A50', 2.5) + '/></g>'; },
    blob(x, y, r, col, seed) { const g = rng(seed || 1); let d = ''; for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI * 2, rr = r * (0.75 + g() * 0.4); d += (i ? ' L' : 'M') + f(x + rr * Math.cos(a)) + ' ' + f(y + rr * 0.6 * Math.sin(a)); } return '<path d="' + d + ' Z" style="fill:' + (col || '#B24B3E') + ';opacity:.85;stroke-linejoin:round"/>'; },
    pin(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="12" ' + st('#FFFFFF', 3.5) + '/>'; },
    // HTML label: hand-lettered caps, positioned on the 1920 stage; pair with leader()/pointer()
    labelHTML(text, x, y, o) { o = o || {}; return '<div class="hand-label" style="position:absolute;left:' + x + 'px;top:' + y + 'px;font-size:' + (o.size || 56) + 'px;' + (o.align === 'center' ? 'transform:translateX(-50%);text-align:center;' : '') + (o.width ? 'width:' + o.width + 'px;' : '') + '">' + text + '</div>'; },
  };
  // CSS for labels (add once to the film's base.css)
  W.info.CSS = '.hand-label{font-family:"Patrick Hand SC","Patrick Hand",var(--sans,system-ui),sans-serif;color:#2A2522;letter-spacing:.04em;line-height:1.05;text-transform:uppercase;margin:0}';
  W.style = { land: (d) => '<path d="' + d + '" ' + st('#E9C48A', 3.5) + '/>', INK, LN };
})();
