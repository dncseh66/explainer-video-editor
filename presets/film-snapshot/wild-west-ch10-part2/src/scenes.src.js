// "The First Timer" — chapter 10 part 2 ("The wallpaper was floral" → "the one who bled"). Kit: ../wild-west-first-timer-2min/src/film-kit.js
// Marker = //@scene <id> <first script word index>; a = absolute VO time; T(i) = start of word i of scripts_text/wild-west-ch10-part2.txt.

//@scene wallpaper 0
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('wallpaper', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      let drops = ''; for (let i = 0; i < 4; i++) drops += '<path class="wp-d" d="M0 -16 Q10 0 0 8 Q-10 0 0 -16 Z" style="fill:#9ED3EE;stroke:#2A2522;stroke-width:2.5"/>';
      kit.stage.append(kit.h(F.frame(W.bg.parlor(M, { stairs: false, window: false, door: false }) + '<path class="wp-damp" d="M690 40 Q760 20 790 120 Q820 260 740 300 Q660 250 690 40 Z" style="fill:#7E5A4A;opacity:0"/>' +
        '<g class="wp-flap"><path d="M720 40 q70 14 64 120 q-40 -24 -64 -20 Z" ' + F.st('#E8C6B8', 4) + '/></g>' + drops + '<g class="wp-bloom">' + [[540, 170], [900, 280], [600, 390], [840, 60]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="34" style="fill:#EAD7A6;stroke:#2A2522;stroke-width:3"/>').join('') + '</g>', '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), flap: q('.wp-flap'), damp: q('.wp-damp'), bloom: q('.wp-bloom'), d: [...kit.stage.querySelectorAll('.wp-d')] });
      this.L = [[this.S, 1.6, 720, 300], [T(6), 2.4, 740, 160, 0.6]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      W.pop(this.bloom, a, T(3)); this.bloom.style.opacity = a > T(3) ? (1 - seg(a, T(4), T(5))).toFixed(2) : 0;
      const peel = eo(seg(a, T(6), T(7) + 0.4)); this.flap.setAttribute('transform', 'translate(720 40) rotate(' + (-28 * peel).toFixed(1) + ') translate(-720 -40)');
      this.damp.style.opacity = (0.45 * seg(a, T(11), T(14))).toFixed(3);
      this.d.forEach((el, i) => { const p = ((a - T(11)) * 0.7 + i * 0.25) % 1; el.setAttribute('transform', 'translate(' + (735 + i * 12) + ' ' + (60 + 260 * p) + ')'); el.style.opacity = a > T(11) ? 1 - p : 0; });
    },
  });
})();

//@scene carpet 17
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('carpet', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      let boards = ''; for (let i = 0; i < 7; i++) boards += '<path d="M' + (660 + i * 50) + ' 840 L' + (650 + i * 46) + ' 1080" ' + F.ln('rgba(42,37,34,.5)', 4) + '/>';
      kit.stage.append(kit.h(F.frame(F.parlor(M, { clk: 'ca' }) + '<path class="ca-path" d="M210 800 Q600 840 900 900 T1560 790" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" style="fill:none;stroke:#FFE59A;stroke-width:14;stroke-linecap:round;opacity:.9"/>' +
        '<g class="ca-worn" style="opacity:0"><path d="M640 830 Q900 860 1100 920 Q980 1000 900 1080 L640 1080 Q700 960 640 830 Z" style="fill:#A27652"/>' + boards + '</g>', '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), path: q('.ca-path'), worn: q('.ca-worn') });
      this.L = [[this.S, 1.5, 560, 760], [T(26), 1.5, 1400, 700, 1.2], [T(29), 1.8, 880, 900, 0.9]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      this.path.setAttribute('stroke-dashoffset', (100 * (1 - eio(seg(a, T(19), T(26) + 0.4)))).toFixed(1)); this.path.style.opacity = (0.9 * (1 - seg(a, T(29), T(30)))).toFixed(2);
      this.worn.style.opacity = eio(seg(a, T(32), T(34) + 0.3)).toFixed(3);
    },
  });
})();

//@scene settee 37
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('settee', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      kit.stage.append(kit.h(F.frame(F.parlor(M, { clk: 'se' }) + '<g class="se-stain">' + W.info.blob(800, 754, 50, '#9C7A52', 4) + '</g>' + '<g class="se-dpos">' + F.doily('se-doily', 0, 0, 0.7) + '</g>', '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), stain: q('.se-stain'), dpos: q('.se-dpos') });
      this.L = [[this.S, 1.2, 930, 700], [T(45), 2.3, 810, 740, 0.6]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      W.pop(this.stain, a, T(45));
      const drop = eo(seg(a, T(57), T(58) + 0.3)), slide = eio(seg(a, T(62), T(63) + 0.3));
      this.dpos.setAttribute('transform', 'translate(' + (800 + 90 * slide) + ' ' + lerp(560, 752, drop) + ') rotate(' + (14 * slide) + ')');
      this.dpos.style.opacity = a > T(57) ? 1 : 0;
    },
  });
})();

//@scene distance 68
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('distance', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      const glints = '<g class="di-gl">' + [[700, 620], [1180, 640], [430, 600], [1300, 560]].map(([x, y]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" style="fill:#FFE59A;stroke:#2A2522;stroke-width:3"/>').join('') + '</g>';
      const flaws = '<g class="di-fl" style="opacity:0"><path d="M740 700 l20 30 l-12 20 l20 28" ' + F.ln(F.INK, 4) + '/><circle cx="1010" cy="700" r="5" style="fill:#2A2522"/><circle cx="1050" cy="690" r="5" style="fill:#2A2522"/><path d="M880 780 q20 -10 40 0 q20 10 40 0" ' + F.ln('#8C6C4F', 5) + '/><path d="M690 806 l-10 40" ' + F.ln('#F3DDB0', 6) + '/></g>';
      kit.stage.append(kit.h(F.frame(F.parlor(M, { clk: 'di' }) + glints + flaws, '', F.label('3 ft', 1500, 120, 110, 'di-ft', 'color:#B5503F'))));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), gl: q('.di-gl'), fl: q('.di-fl'), ft: q('.di-ft') });
      this.L = [[this.S, 1.0, 960, 540], [T(77), 2.6, 900, 740, 0.5]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      W.pop(this.gl, a, T(71)); this.gl.style.opacity = a > T(71) && a < T(77) ? (0.6 + 0.4 * Math.sin(a * 12)).toFixed(2) : 0;
      this.fl.style.opacity = seg(a, T(77) + 0.3, T(78) + 0.3).toFixed(2);
      W.pop(this.ft, a, T(79), 'left');
    },
  });
})();

//@scene fabric 82
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('fabric', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const leg = '<rect x="-60" y="-320" width="120" height="640" rx="10" ' + F.st('#E9CF9C', 6) + '/><path d="M-30 -300 q10 200 -6 600 M20 -300 q-14 220 4 600" ' + F.ln('rgba(140,100,64,.45)', 5) + '/>';
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + '<g transform="translate(560 560)">' + leg + '<rect class="fa-stain" x="-62" y="-322" width="124" height="0" style="fill:#5A3A22"/><circle cx="20" cy="140" r="16" style="fill:#E9CF9C"/></g>' +
        '<g class="fa-brush"><path d="M0 0 L0 -160" ' + F.ln(F.INK, 18) + '/><path d="M0 0 L0 -160" ' + F.ln('#C79A3A', 10) + '/><rect x="-40" y="0" width="80" height="60" rx="8" ' + F.st('#5A3A22') + '/></g>' +
        F.swatch('fa-cot', 1260, 420, 1.1, 'cotton') + F.swatch('fa-silk', 1400, 760, 1.0, 'silk') + '<g transform="translate(1400 760)">' + F.coralX('fa-x', 1.2) + '</g>', '', '', { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), stain: q('.fa-stain'), brush: q('.fa-brush'), cot: q('.fa-cot'), silk: q('.fa-silk'), x: q('.fa-x') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1 + 0.03 * seg(a, this.S, this.E), 960, 540);
      const p = eio(seg(a, T(86), T(90) + 0.2)); this.stain.setAttribute('height', (640 * p).toFixed(1));
      this.brush.setAttribute('transform', 'translate(' + (560 + 30 * Math.sin(a * 16)) + ' ' + (238 + 640 * p) + ')'); this.brush.style.opacity = a > T(86) && p < 1 ? 1 : 0;
      W.pop(this.cot, a, T(94)); W.pop(this.silk, a, T(96)); W.pop(this.x, a, T(97));
    },
  });
})();

//@scene price 98
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('price', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + F.scale('pr', 960, 1000, 1.25) +
        '<g class="pr-L">' + F.coins(0, 0, 1.1) + '</g><g class="pr-R"><g class="pr-cal">' + F.calendar('pr-c', 0, -150, 0.6) + '</g></g>' +
        F.clock(1640, 260, 90, 'pr-clk') + F.who('pr-ft', 'ft', { face: 0.3 }), '',
        F.label('$2', 330, 180, 150, 'pr-2', 'color:#B5503F') + F.label('1 week', 1210, 130, 90, 'pr-w') + F.label('14 hrs', 1540, 390, 64, 'pr-h'), { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'pr-ft');
      Object.assign(this, { cam: q('.cam'), L: q('.pr-L'), R: q('.pr-R'), two: q('.pr-2'), wk: q('.pr-w'), hr: q('.pr-h'), clk: q('.pr-clk-h') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0, 960, 540);
      const tilt = 10 * seg(a, T(103), T(103) + 0.4) * (1 - seg(a, T(114), T(115) + 0.5));
      F.poseScale(this.root, 'pr', tilt);
      const ang = tilt * Math.PI / 180, lx = 960 - 400 * Math.cos(ang), ly = 1000 - 525 - 400 * Math.sin(ang) * -1, rx = 960 + 400 * Math.cos(ang), ry = 1000 - 525 - 400 * Math.sin(ang);
      this.L.setAttribute('transform', 'translate(' + lx.toFixed(1) + ' ' + (ly + 290).toFixed(1) + ')'); this.L.style.opacity = a > T(103) ? 1 : 0;
      this.R.setAttribute('transform', 'translate(' + rx.toFixed(1) + ' ' + (ry + 290).toFixed(1) + ')'); this.R.style.opacity = a > T(114) ? 1 : 0;
      W.pop(this.two, a, T(103), 'left'); W.pop(this.wk, a, T(115), 'left'); W.pop(this.hr, a, T(117), 'left');
      F.spinClock(this.root, 'pr-clk', a, T(117), T(119) + 1, 14);
      W.posePerson(this.m, Object.assign({ x: 1700, y: 1040, s: 1.4, expr: a > T(115) ? 'sad' : 'neutral', blink: F.blink(a, 3) }, a > T(109) && a < T(115) ? { a1: -120, a2: -20 } : {}));
    },
  });
})();

//@scene saddle 123
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('saddle', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + F.scale('sa', 960, 1000, 1.25) +
        '<g class="sa-L"><g transform="scale(.42)">' + W.prop.settee(0, 0, 1, '#C9B48A') + W.prop.keroLamp(330, -20, 1.2, 0, false) + '</g></g><g class="sa-R">' + F.saddle(0, 0, 0.95) + '</g>', '', '', { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), L: q('.sa-L'), R: q('.sa-R') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0 + 0.03 * seg(a, this.S, this.E), 960, 540);
      const tilt = -12 * eo(seg(a, T(137), T(138) + 0.5)) + 6 * seg(a, T(126), T(126) + 0.4) * (1 - seg(a, T(137), T(137) + 0.2));
      F.poseScale(this.root, 'sa', tilt);
      const ang = tilt * Math.PI / 180, put = (el, k) => el.setAttribute('transform', 'translate(' + (960 + k * 400 * Math.cos(ang)).toFixed(1) + ' ' + (1000 - 525 + k * 400 * Math.sin(ang) + 290).toFixed(1) + ')');
      put(this.L, -1); put(this.R, 1);
      this.L.style.opacity = a > T(126) ? 1 : 0; this.R.style.opacity = a > T(133) ? 1 : 0;
    },
  });
})();

//@scene gap 139
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('gap', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      const bg = '<rect width="1920" height="1080" style="fill:' + M.sky + '"/><rect y="760" width="1920" height="320" style="fill:' + M.floor + '"/><path d="M0 760 H1920" ' + F.ln(F.INK, 4) + '/>';
      const board = F.chalkboard(1180, 1000, 1.2) + '<g class="ga-tag">' + F.priceTag('ga-t', 920, 520, 0.8) + '</g><g class="ga-pr"><g transform="translate(1440 560) scale(.42)">' + W.prop.settee(0, 0, 1, '#C9B48A') + '</g></g>' +
        '<g class="ga-arr">' + W.info.arrow(1060, 420, 1290, 420) + W.info.arrow(1290, 420, 1060, 420) + '</g>';
      kit.stage.append(kit.h(F.frame(bg + board + W.person('ga-n', W.NARRATOR_WEST), F.label('$2', 830, 480, 80, 'ga-2'), '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'ga-n');
      Object.assign(this, { cam: q('.cam'), tag: q('.ga-tag'), two: q('.ga-2'), pr: q('.ga-pr'), arr: q('.ga-arr') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0 + 0.03 * seg(a, this.S, this.E), 960, 560);
      W.pop(this.tag, a, T(143)); W.pop(this.two, a, T(143)); W.pop(this.pr, a, T(146));
      const g = eo(seg(a, T(140), T(141) + 0.3)); this.arr.style.opacity = a > T(140) ? 1 : 0;
      this.arr.setAttribute('transform', 'translate(1175 420) scale(' + (0.4 + 0.6 * g).toFixed(3) + ' 1) translate(-1175 -420)');
      const pt = W.eobk(seg(a, T(149) - 0.2, T(149)), 1.6);
      W.posePerson(this.m, { x: 460, y: 1000, s: 2.3, expr: F.talk(a, [[T(139), F.TE(153)]]) || 'smug', blink: F.blink(a, 2.7), a1: lerp(-30, -100, pt), a2: lerp(-30, 4, pt), head: 3 * Math.sin(a * 2) });
    },
  });
})();

//@scene dime 154
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('dime', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const inner = '<g class="dm-room"><rect x="-200" y="-290" width="400" height="580" style="fill:#5A2E3A"/><rect x="-200" y="120" width="400" height="170" style="fill:#C79A3A"/></g>' +
        '<g class="dm-ch">' + F.chandelier(0, -200, 0.9) + '</g><g class="dm-dr"><path d="M-200 -290 Q-120 -150 -200 120 L-140 120 Q-80 -100 -60 -290 Z M200 -290 Q120 -150 200 120 L140 120 Q80 -100 60 -290 Z" ' + F.st('#9C2F3A', 4) + '/></g>' +
        '<g class="dm-w"><g transform="translate(-70 250) scale(.55)">' + F.who('dm-a', 'girl1', { color: '#E8DCC0', shade: '#CFC2A3', face: 0.3 }) + '</g><g transform="translate(80 250) scale(.55)">' + F.who('dm-b', 'girl2', { color: '#D8E6F0', shade: '#B8CCDA' }) + '</g>' +
        [[-120, 40], [130, 30], [0, 120]].map(([x, y]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" style="fill:#FFFFFF;stroke:#2A2522;stroke-width:2.5"/>').join('') + '</g>';
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + F.book('dm-bk', 960, 560, 1.4, inner) + '<circle class="dm-c" cx="1360" cy="210" r="80" ' + F.st('#E3B341', 5) + '/>', '', F.label('10¢', 1300, 170, 70, 'dm-p'), { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage;
      ['a', 'b'].forEach((k) => { const m = W.bindPerson(kit.stage, 'dm-' + k); W.posePerson(m, { expr: 'happy', a1: -30, b1: 30 }); });
      Object.assign(this, { cam: q('.cam'), bk: q('.dm-bk'), ch: q('.dm-ch'), dr: q('.dm-dr'), w: q('.dm-w'), c: q('.dm-c'), p: q('.dm-p') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1 + 0.04 * seg(a, this.S, this.E), 960, 540);
      W.pop(this.bk, a, T(155)); W.pop(this.c, a, T(155) + 0.2); W.pop(this.p, a, T(155) + 0.2);
      W.pop(this.ch, a, T(165)); W.drop(this.dr, a, T(167) - 0.2, T(167), 300); W.pop(this.w, a, T(169));
    },
  });
})();

//@scene bunkhouse 172
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('bunkhouse', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      let wall = '<rect width="1920" height="1080" style="fill:#6B4A33"/>'; for (let x = 0; x < 1920; x += 90) wall += '<path d="M' + x + ' 0 V820" ' + F.ln('rgba(42,37,34,.4)', 4) + '/>';
      wall += '<rect y="820" width="1920" height="260" style="fill:#5A3E2A"/><path d="M0 820 H1920" ' + F.ln(F.INK, 4) + '/>' + W.glow(960, 360, 700, '#FFD27A', 0.35) + F.lantern(960, 300, 1.2);
      const bub = F.thought('bh-bub', 1380, 260, 520, 300, F.chandelier(-60, -20, 0.8) + '<g class="bh-i1">' + F.coins(150, 60, 0.7) + '</g><g class="bh-i2">' + F.calendar('bh-cal', 170, -40, 0.35) + '</g>');
      kit.stage.append(kit.h(F.frame(wall + F.bunk(330, 1000, 1.4) + F.bunk(1600, 1000, 1.4) + F.who('bh-a', 'hand3', { face: 0.35 }) + F.who('bh-ft', 'ft', { face: -0.35 }) + F.who('bh-b', 'hand2', { face: -0.3 }) + bub, '', '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      this.A = W.bindPerson(kit.stage, 'bh-a'); this.H = W.bindPerson(kit.stage, 'bh-ft'); this.B = W.bindPerson(kit.stage, 'bh-b');
      Object.assign(this, { cam: q('.cam'), bub: q('.bh-bub-in'), i1: q('.bh-i1'), i2: q('.bh-i2') });
    },
    render(t) {
      const a = t + this.S, tell = seg(a, T(174), T(174) + 0.3);
      F.framing(this.cam, 1.0 + 0.04 * seg(a, this.S, this.E), 960, 600);
      W.posePerson(this.A, { x: 620, y: 1000, s: 1.4, expr: F.talk(a, [[T(174), T(196)]]) || 'smug', blink: F.blink(a, 3), a1: lerp(-8, -110, tell), b1: lerp(8, 110, tell), a2: -10, b2: 10 });
      W.posePerson(this.H, { x: 1200, y: 1000, s: 1.3, expr: a > T(194) ? 'joy' : 'happy', blink: F.blink(a, 2.8, 1) });
      W.posePerson(this.B, { x: 1500, y: 1000, s: 1.35, expr: 'happy', blink: F.blink(a, 3.3, 2) });
      W.pop(this.bub, a, T(183)); W.pop(this.i1, a, T(191)); W.pop(this.i2, a, T(194));
    },
  });
})();

//@scene woodcut 197
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('woodcut', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const print = '<rect x="-230" y="-200" width="460" height="380" style="fill:#FFFDF4;stroke:#2A2522;stroke-width:4"/>' + F.chandelier(0, -60, 1.1).replace(/#E3B341|#FFB347|#FFE59A|#FFFDF4/g, '#2A2522') +
        Array.from({ length: 12 }, (_, i) => '<path d="M-220 ' + (60 + i * 10) + ' H220" ' + F.ln('rgba(42,37,34,.6)', 3) + '/>').join('');
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + F.paper('wc-p', 960, 560, 1.15, '<g class="wc-pr">' + print + '</g>'), '', '', { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), p: q('.wc-p'), pr: q('.wc-pr') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1 + 0.06 * seg(a, this.S, this.E), 960, 520);
      W.pop(this.p, a, T(198)); W.pop(this.pr, a, T(205));
    },
  });
})();

//@scene songs 206
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('songs', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      let notes = ''; for (let i = 0; i < 5; i++) notes += F.note('sg-n' + i, 0, 0, 1.1, '#F4EFD8');
      const gild = '<rect x="-150" y="-110" width="300" height="220" rx="8" ' + F.st('#E3B341', 10) + '/><rect x="-130" y="-90" width="260" height="180" style="fill:#7D3C55"/><g transform="translate(0 90) scale(.5)">' + F.who('sg-l', 'girl2', { color: '#B23A3A', shade: '#8E2C2C' }) + '</g>';
      kit.stage.append(kit.h(F.frame(F.nightSky(9) + W.prop.fire(960, 960, 1.3, 0) + F.bedroll(620, 960, 1.1) + F.bedroll(1300, 960, 1.1) +
        F.who('sg-a', 'hand2', { face: 0.35 }) + F.who('sg-b', 'hand3', { face: -0.35 }) + notes + F.thought('sg-bub', 960, 280, 440, 320, gild), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.A = W.bindPerson(kit.stage, 'sg-a'); this.B = W.bindPerson(kit.stage, 'sg-b');
      W.posePerson(W.bindPerson(kit.stage, 'sg-l'), { expr: 'happy', a1: -40 });
      Object.assign(this, { cam: q('.cam'), bub: q('.sg-bub-in'), n: [0, 1, 2, 3, 4].map((i) => q('.sg-n' + i)) });
    },
    render(t) {
      const a = t + this.S, sing = (Math.floor(a * 6) % 2 ? 'talk' : 'happy');
      F.framing(this.cam, 1.0, 960, 560); W.flames(this.root, a);
      W.posePerson(this.A, { x: 600, y: 930, s: 1.15, expr: sing, blink: F.blink(a, 3), head: 5 * Math.sin(a * 3), legL: -80, legR: -80 });
      W.posePerson(this.B, { x: 1300, y: 930, s: 1.15, expr: sing, blink: F.blink(a, 3.4, 1), head: -5 * Math.sin(a * 3), legL: 80, legR: 80 });
      this.n.forEach((n, i) => { const t0 = this.S + i * 0.5, p = (a - t0) / 2.2; n.setAttribute('transform', 'translate(' + (lerp(640, 1260, i % 2) + 50 * Math.sin(p * 5)) + ' ' + (760 - 360 * p) + ') scale(1.1)'); n.style.opacity = a > t0 && p < 1 ? (1 - p).toFixed(2) : 0; });
      W.pop(this.bub, a, T(214));
    },
  });
})();

//@scene none 219
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('none', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      const fan = '<g class="no-fan">' + F.chandelier(960, 160, 1.2) + '<path d="M500 0 Q600 300 480 600 L620 600 Q700 300 760 0 Z M1420 0 Q1320 300 1440 600 L1300 600 Q1220 300 1160 0 Z" ' + F.st('#9C2F3A', 5) + '/></g>';
      kit.stage.append(kit.h(F.frame(F.room('no', M, { extra: fan + F.poof('no-pf', 960, 260, 2.2) }), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.R = F.bindRoom(kit.stage, 'no');
      Object.assign(this, { cam: q('.cam'), fan: q('.no-fan'), pf: q('.no-pf') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0 + 0.03 * seg(a, this.S, this.E), 960, 540);
      F.poseRoom(this.R, a, { turn: this.S - 5, door: 1, hero: { show: true, x: 290, expr: a > T(219) + 0.3 ? 'sad' : 'happy' } });
      this.fan.style.opacity = a < T(219) ? seg(a, this.S, this.S + 0.3) : 0; F.poofAt(this.pf, a, T(219));
    },
  });
})();

//@scene myth 226
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('myth', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const desk = '<rect x="200" y="760" width="520" height="40" rx="6" ' + F.st('#8C5A3A') + '/><path d="M240 800 V1000 M680 800 V1000" ' + F.ln(F.INK, 16) + '/>' + W.prop.keroLamp(640, 760, 0.8, 0) + W.prop.quill(380, 760, 0.6);
      let books = ''; for (let i = 0; i < 5; i++) books += '<g class="my-b"><g transform="translate(' + (840 + i * 30) + ' ' + (980 - i * 0) + ') scale(.14)">' + F.book('', 0, -320, 1, '') + '</g></g>';
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + desk + F.who('my-w', 'baron', { hat: 'none', glasses: true, face: 0.35 }) + books + '<g class="my-ar">' + W.info.arrow(1080, 700, 1300, 700) + '</g>' +
        F.who('my-c1', 'hand2', { face: -0.3 }) + F.who('my-ft', 'ft', { face: -0.3 }) + '<g class="my-d">' + W.prop.storefront(1560, 1000, 0.55, W.MOODS.prairieDust, { plank: false, porch: false, top: -440 }) + '</g>', '', '', { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage; this.Wr = W.bindPerson(kit.stage, 'my-w'); this.C = W.bindPerson(kit.stage, 'my-c1'); this.H = W.bindPerson(kit.stage, 'my-ft');
      Object.assign(this, { cam: q('.cam'), b: [...kit.stage.querySelectorAll('.my-b')], ar: q('.my-ar'), d: q('.my-d') });
    },
    render(t) {
      const a = t + this.S, write = a > T(234) && a < T(243);
      F.framing(this.cam, 1.0, 960, 560);
      W.posePerson(this.Wr, { x: 450, y: 1000, s: 1.4, expr: a > T(238) && a < T(242) ? 'smug' : 'neutral', blink: F.blink(a, 3), a1: -60 + (write ? 8 * Math.sin(a * 18) : 0), a2: -50 });
      this.b.forEach((el, i) => W.pop(el, a, T(234) + i * 0.3));
      W.pop(this.ar, a, T(244));
      const buy = seg(a, T(245), T(246) + 0.4);
      W.posePerson(this.C, { x: 1380, y: 1000, s: 1.35, expr: a > T(245) ? 'joy' : 'happy', blink: F.blink(a, 3.2, 1) });
      W.posePerson(this.H, { x: 1250, y: 1000, s: 1.35, expr: a > T(251) ? 'worried' : 'happy', blink: F.blink(a, 2.9, 2), head: a > T(251) ? -10 : 0 });
      this.d.style.opacity = seg(a, T(250), T(251)).toFixed(2);
    },
  });
})();

//@scene hotel 253
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('hotel', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const big = '<rect x="0" y="0" width="1920" height="1080" style="fill:#DCE8EE"/><rect y="760" width="1920" height="320" style="fill:#B9C4CC"/><path d="M0 760 H1920" ' + F.ln(F.INK, 4) + '/>' +
        '<rect x="200" y="160" width="520" height="360" rx="8" ' + F.st('#BFE3F3') + '/><path d="M200 420 L360 300 L470 380 L590 260 L720 360 V520 H200 Z" style="fill:#7FB069"/>' + W.prop.bed(1200, 900, 1.0, { sheet: '#F7F4EC' });
      const small = '<rect x="0" y="0" width="1920" height="1080" style="fill:#CFC7B4"/><rect y="760" width="1920" height="320" style="fill:#9C8E78"/><path d="M0 760 H1920" ' + F.ln(F.INK, 4) + '/>' +
        '<rect x="380" y="260" width="200" height="200" rx="8" ' + F.st('#8E9AA6') + '/><path d="M380 360 H580" ' + F.ln(F.INK, 4) + '/>' + W.prop.bed(1000, 900, 0.8, { sheet: '#D8D0BE' }) + '<path d="M1500 0 V1080 M1550 0 V1080" ' + F.ln('rgba(42,37,34,.3)', 6) + '/>' + W.info.blob(800, 200, 50, '#B4A68A', 2);
      const phone = '<g class="ho-ph"><rect x="-120" y="-220" width="240" height="440" rx="30" ' + F.st('#2E2724', 6) + '/><svg x="-100" y="-190" width="200" height="380" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">' + big + '</svg>' +
        [[-70, -140], [80, -150], [0, 150]].map(([x, y]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" style="fill:#FFE59A;stroke:#2A2522;stroke-width:2.5"/>').join('') + '</g>';
      kit.stage.append(kit.h(F.frame('<g class="ho-real">' + small + '</g>' + F.suitcase(1200, 1010, 1.1) + W.person('ho-t', { outfit: 'tunic', color: '#4E6E8C', shade: '#3E5A75', hair: 'short', hairColor: 'black', face: 0.35, limbs: 'stick' }) +
        '<g class="ho-pp" transform="translate(1520 520)">' + phone + '</g>' + '<g class="ho-ar">' + W.info.arrow(1060, 360, 1060, 620) + '</g>', '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'ho-t');
      Object.assign(this, { cam: q('.cam'), ph: q('.ho-ph'), ar: q('.ho-ar') });
    },
    render(t) {
      const a = t + this.S, lurch = T(296);
      F.framing(this.cam, 1.0 + 0.03 * seg(a, this.S, this.E), 960, 560);
      W.pop(this.ph, a, T(291) - 0.3);
      W.posePerson(this.m, { x: 960, y: 1010 + 30 * eo(seg(a, lurch, lurch + 0.3)), s: 1.6, sq: W.take(a, lurch), expr: a < T(287) ? 'happy' : a < lurch ? 'neutral' : 'sad', blink: F.blink(a, 3), a1: -100, a2: -30 });
      W.pop(this.ar, a, lurch);
      if (a > lurch) this.ar.style.transform += ' translateY(' + (40 * Math.sin((a - lurch) * 4)).toFixed(1) + 'px)';
    },
  });
})();

//@scene gauge 301
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('gauge', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      let ticks = ''; for (let i = 0; i <= 8; i++) ticks += '<path d="M900 ' + (160 + i * 100) + ' h' + (i % 2 ? 40 : 70) + '" ' + F.ln(F.INK, 5) + '/>';
      const bed = '<g transform="translate(560 320) scale(.35)">' + W.prop.bed(0, 0, 1, { sheet: '#F7F4EC' }) + '</g>';
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + '<rect x="860" y="140" width="60" height="840" rx="30" ' + F.st('#FFFFFF', 5) + '/><rect class="ga-lv" x="872" y="160" width="36" height="0" rx="18" style="fill:#F08A7E"/>' + ticks +
        '<g class="ga-b1">' + bed + '<path d="M760 290 H880" ' + F.ln(F.INK, 5) + '/></g><g class="ga-b2"><g transform="translate(1260 1010) scale(1.05)">' + F.who('ga-ft', 'ft', { face: -0.35 }) + '</g><path d="M1100 900 H930" ' + F.ln(F.INK, 5) + '/></g>', '', '', { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage; W.posePerson(W.bindPerson(kit.stage, 'ga-ft'), { expr: 'sad' });
      Object.assign(this, { cam: q('.cam'), lv: q('.ga-lv'), b1: q('.ga-b1'), b2: q('.ga-b2') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0, 960, 560);
      const h = lerp(0, 130, eo(seg(a, T(305), T(309)))) + lerp(0, 620, eio(seg(a, T(315), T(318) + 0.5)));
      this.lv.setAttribute('height', h.toFixed(1));
      W.pop(this.b1, a, T(306)); W.pop(this.b2, a, T(313));
    },
  });
})();

//@scene face 319
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('face', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      const left = '<g class="fc-l">' + F.thought('fc-b1', 330, 300, 360, 260, F.chandelier(0, -10, 0.8)) + '</g>';
      const right = '<g class="fc-r"><circle cx="1600" cy="300" r="150" ' + F.st('#FFFDF4', 5) + '/>' + W.prop.keroLamp(1600, 390, 1.0, 0) + '</g>';
      kit.stage.append(kit.h(F.frame('<g class="fc-bg">' + F.parlor(M, { clk: 'fc' }) + '</g><rect class="fc-dim" width="1920" height="1080" style="fill:#1E1714;opacity:0"/>' + F.who('fc-ft', 'ft', { face: 0 }) +
        F.gears('fc-g', 1180, 180, 1.0) + '<g transform="translate(1180 230) scale(1.2)">' + F.qmark('fc-q') + '</g>' + left + right + F.timerRing('fc-tm', 1700, 860, 90), '', F.label('5', 1676, 812, 90, 'fc-5'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'fc-ft');
      Object.assign(this, { cam: q('.cam'), dim: q('.fc-dim'), g: q('.fc-g'), ga: q('.fc-g-a'), gb: q('.fc-g-bi'), qm: q('.fc-q'), l: q('.fc-l'), r: q('.fc-r'), tm: q('.fc-tm'), five: q('.fc-5') });
      this.L = [[this.S, 1.0, 960, 540], [T(359), 1.6, 960, 420, 1.2]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      const ring = seg(a, T(326), T(326) + 5);
      this.tm.setAttribute('stroke-dasharray', (100 * ring).toFixed(1) + ' 100'); this.five.style.opacity = a < T(326) + 5.2 ? 1 : 0; this.tm.parentNode.style.opacity = a < T(326) + 5.2 ? 1 : 0;
      W.pop(this.qm, a, T(332)); this.qm.style.opacity = a > T(332) && a < T(334) ? 1 : 0;
      W.pop(this.g, a, T(335)); this.g.style.opacity = a > T(335) && a < T(352) ? 1 : 0;
      this.ga.setAttribute('transform', 'rotate(' + (a * 160).toFixed(0) + ')'); this.gb.setAttribute('transform', 'rotate(' + (-a * 240).toFixed(0) + ')');
      const close = eio(seg(a, T(341), T(351)));
      W.pop(this.l, a, T(347)); W.pop(this.r, a, T(349));
      this.l.setAttribute('transform', 'translate(' + (400 * close) + ' 0)'); this.r.setAttribute('transform', 'translate(' + (-400 * close) + ' 0)');
      if (a > T(351) + 0.4) { this.l.style.opacity = 0; this.r.style.opacity = 0; }
      this.dim.style.opacity = (0.8 * seg(a, T(365), T(373))).toFixed(3);
      const ex = a < T(332) ? 'neutral' : a < T(335) ? 'surprised' : a < T(352) ? 'worried' : 'sad';
      W.posePerson(this.m, { x: 960, y: 1100, s: 3.2, expr: ex, sq: W.take(a, T(332)), head: a > T(335) && a < T(352) ? 4 * Math.sin(a * 6) : 0, blink: F.blink(a, 3.3) });
    },
  });
})();

//@scene lonely 374
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('lonely', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      kit.stage.append(kit.h(F.frame(F.room('lo', M, { extra: '<g class="lo-cl">' + F.cloud('', 0, 0, 0.8) + '</g>' }), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.R = F.bindRoom(kit.stage, 'lo'); Object.assign(this, { cam: q('.cam'), cl: q('.lo-cl') });
      this.L = [[this.S, 1.6, 420, 560], [T(392), 1.0, 960, 540, 1.0]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      const walk = eio(seg(a, T(386), T(390))), settle = eio(seg(a, T(392), T(397)));
      F.poseRoom(this.R, a, { turn: this.S - 5, door: 1, hero: { show: true, x: lerp(210, 290, walk), walk: walk > 0 && walk < 1, expr: 'sad' } });
      const x = lerp(lerp(120, 300, walk), 520, settle), y = lerp(330, 380, settle) + 8 * Math.sin(a * 2);
      this.cl.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); this.cl.style.opacity = seg(a, T(375), T(376)).toFixed(2);
    },
  });
})();

//@scene shield 398
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('shield', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      let thorns = ''; for (let i = 0; i < 9; i++) { const a = i * 0.7; thorns += '<path d="M0 0 L' + (Math.cos(a) * 120).toFixed(0) + ' ' + (Math.sin(a) * 120).toFixed(0) + '" ' + F.ln('#4A3A4E', 26) + '/>'; }
      const ache = '<g class="sh-ache" transform="translate(1500 560)"><circle r="120" style="fill:#4A3A4E;stroke:#2A2522;stroke-width:5"/>' + thorns + '</g>';
      kit.stage.append(kit.h(F.frame('<rect width="1920" height="1080" style="fill:#3B2A2A"/><rect y="820" width="1920" height="260" style="fill:#2E2020"/><g class="sh-lamp" style="opacity:0">' + W.glow(1500, 520, 600, '#FFD58A', 0.6) + '</g>' + ache +
        F.who('sh-ft', 'ft', { face: 0.35 }) + F.shield('sh-s', 980, 560, 1.0) + F.calendar('sh-cal', 1500, 260, 0.45) + '<g class="sh-shards" style="opacity:0">' + [[-60, -40, 20], [60, -50, -30], [-40, 60, 50], [70, 50, -10]].map(([x, y, r]) => '<path transform="translate(' + (980 + x) + ' ' + (560 + y) + ') rotate(' + r + ')" d="M-40 -30 L40 -20 L20 40 Z" ' + F.st('#E3B341', 4) + '/>').join('') + '</g>', '',
        F.label('11 weeks', 1380, 120, 70, 'sh-11', 'color:#F4EFD8'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'sh-ft');
      Object.assign(this, { cam: q('.cam'), s: q('.sh-s'), ache: q('.sh-ache'), cal: q('.sh-cal'), eleven: q('.sh-11'), shards: q('.sh-shards'), lamp: q('.sh-lamp') });
    },
    render(t) {
      const a = t + this.S, gone = T(421);
      F.framing(this.cam, 1.0, 960, 540);
      W.pop(this.s, a, T(399)); if (a > gone) this.s.style.opacity = 0;
      const sp = seg(a, gone, gone + 0.6); this.shards.style.opacity = a > gone && sp < 1 ? 1 - sp : 0;
      this.shards.setAttribute('transform', 'translate(0 ' + (300 * sp * sp).toFixed(1) + ')');
      W.pop(this.ache, a, T(412)); this.ache.setAttribute('transform', 'translate(1500 560) rotate(' + (a * 10).toFixed(1) + ')');
      W.pop(this.cal, a, T(414)); W.pop(this.eleven, a, T(414), 'left');
      this.lamp.style.opacity = seg(a, T(432), T(433)).toFixed(2);
      W.posePerson(this.m, { x: 560, y: 1000, s: 1.9, expr: a > gone ? (a > T(424) ? 'sad' : 'surprised') : 'neutral', sq: W.take(a, gone), blink: F.blink(a, 3), a1: a < gone ? -80 : -10, a2: a < gone ? -20 : -6 });
    },
  });
})();

//@scene butler 435
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('butler', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const montana = 'M300 330 L760 330 L760 520 L620 560 L560 520 L420 540 L300 500 Z';
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + '<g class="bu-map">' + W.info.shadowed(montana) + W.info.pin(520, 440) + '</g>' +
        '<g class="bu-tag">' + F.priceTag('bu-t', 1050, 330, 1.0) + '</g><g class="bu-h">' + F.horse(1560, 600, 0.9) + '</g>' +
        '<g class="bu-roll">' + F.roll(360, 980, 1.1) + '</g><g class="bu-cat">' + F.catalog(760, 980, 1.2) + '</g><g class="bu-pn">' + F.coins(1120, 960, 0.9) + '</g>', '',
        '<div class="bu-card" style="position:absolute;left:470px;top:40px;width:980px;padding:22px 30px;background:#FFFDF4;border:4px solid #2A2522;border-radius:16px;box-shadow:8px 8px 0 rgba(42,37,34,.18);text-align:center">' +
        '<p class="hand-label" style="position:static;font-size:72px">Anne Butler</p><p class="hand-label" style="position:static;font-size:46px">Utah State University · 1985</p></div>' +
        F.label('Montana', 400, 580, 56) + F.label('$40–60', 925, 300, 72, 'bu-40', 'color:#B5503F') + F.label('1¢', 1080, 810, 80, 'bu-1', 'color:#B5503F'), { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), card: q('.bu-card'), map: q('.bu-map'), mt: kit.stage.querySelectorAll('.hand-label')[3], tag: q('.bu-tag'), t40: q('.bu-40'), h: q('.bu-h'), roll: q('.bu-roll'), cat: q('.bu-cat'), pn: q('.bu-pn'), one: q('.bu-1') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0, 960, 540);
      W.pop(this.card, a, T(435)); if (a > T(447)) this.card.style.opacity = 1 - seg(a, T(447), T(448));
      W.pop(this.map, a, T(453)); W.pop(this.mt, a, T(453), 'left');
      W.pop(this.tag, a, T(464)); W.pop(this.t40, a, T(464), 'left'); W.pop(this.h, a, T(475), 'bottom');
      W.pop(this.roll, a, T(482), 'bottom'); W.pop(this.cat, a, T(496), 'bottom'); W.pop(this.pn, a, T(500), 'bottom'); W.pop(this.one, a, T(500), 'left');
    },
  });
})();

//@scene apart 503
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('apart', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      const bg = '<rect width="1920" height="1080" style="fill:' + M.sky + '"/><rect y="760" width="1920" height="320" style="fill:' + M.floor + '"/><path d="M0 760 H1920" ' + F.ln(F.INK, 4) + '/>';
      const sad = '<g class="ap-sad"><circle cx="1500" cy="300" r="90" ' + F.st('#FFFDF4', 5) + '/><path d="M1460 340 q40 -30 80 0" ' + F.ln(F.INK, 6) + '/><circle cx="1470" cy="280" r="8" style="fill:#2A2522"/><circle cx="1530" cy="280" r="8" style="fill:#2A2522"/></g>';
      kit.stage.append(kit.h(F.frame(bg + F.blocks('ap-k', 1300, 1000, 1.2) + sad + '<g class="ap-ls">' + F.letter(1250, 420, 1.0, -8) + F.letter(1500, 440, 1.0, 6) + F.letter(1380, 560, 0.9, -2) + '</g>' + W.person('ap-n', W.NARRATOR_WEST), '', '', {})));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'ap-n');
      Object.assign(this, { cam: q('.cam'), k: [0, 1, 2, 3, 4, 5].map((i) => q('.ap-k-k' + i)), sad: q('.ap-sad'), ls: q('.ap-ls') });
    },
    render(t) {
      const a = t + this.S, fall = T(510);
      F.framing(this.cam, 1.0, 960, 560);
      this.k.forEach((el, i) => { const p = seg(a, fall + (5 - i) * 0.05, fall + 0.6 + (5 - i) * 0.05), dx = [-160, -40, 150, -120, 110, 30][i], dy = [0, 0, 0, 110, 110, 220][i];
        el.setAttribute('transform', 'translate(' + (dx * p).toFixed(1) + ' ' + (dy * p * p).toFixed(1) + ') rotate(' + (p * [-30, 10, 40, -60, 50, 90][i]).toFixed(1) + ' ' + (1300 + [-120, 0, 120, -60, 60, 0][i] * 1.2) + ' ' + (1000 - 60) + ')'); el.style.opacity = a > T(531) + 0.5 ? 0 : 1; });
      W.pop(this.sad, a, T(519)); this.sad.style.opacity = a > T(519) && a < T(534) ? 1 : 0;
      W.pop(this.ls, a, T(535));
      const pt = W.eobk(seg(a, T(509) - 0.2, T(509)), 1.6);
      W.posePerson(this.m, { x: 520, y: 1000, s: 2.3, expr: F.talk(a, [[T(503), T(512)], [T(534), T(543)]]) || (a > fall ? 'smug' : 'neutral'), blink: F.blink(a, 2.8), a1: lerp(-10, -95, pt), a2: lerp(-6, 6, pt), head: 3 * Math.sin(a * 2) });
    },
  });
})();

//@scene replace 544
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('replace', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      let tangle = '<g class="rp-tg"><g transform="scale(1.5)">'; for (let i = 0; i < 7; i++) tangle += '<path d="M' + (-90 + i * 20) + ' -40 C' + (60 - i * 30) + ' -100 ' + (-80 + i * 10) + ' 90 ' + (70 - i * 15) + ' 40" ' + F.ln('#2A2522', 6) + '/>'; tangle += '</g></g>';
      kit.stage.append(kit.h(F.frame('<rect width="1920" height="1080" style="fill:#3B2A2A"/>' + W.glow(760, 560, 700, '#FFC86B', 0.25) + F.who('rp-ft', 'ft', { face: 0.35 }) +
        F.thought('rp-b', 1250, 330, 460, 320, '<g class="rp-ch">' + F.chandelier(0, -20, 0.9) + '</g>' + tangle) + F.frameEmpty('rp-fr', 1360, 820, 0.8), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'rp-ft');
      Object.assign(this, { cam: q('.cam'), b: q('.rp-b-in'), ch: q('.rp-ch'), tg: q('.rp-tg'), fr: q('.rp-fr'), side: [0, 1, 2, 3].map((i) => [q('.rp-fr-s' + i), q('.rp-fr-t' + i)]) });
    },
    render(t) {
      const a = t + this.S, swap = T(554);
      F.framing(this.cam, 1.0 + 0.03 * seg(a, this.S, this.E), 960, 540);
      W.pop(this.b, a, this.S + 0.2);
      this.ch.style.opacity = a < swap ? 1 : 0; W.pop(this.tg, a, swap); this.tg.setAttribute('transform', 'rotate(' + (a * 40).toFixed(0) + ')');
      W.pop(this.fr, a, T(562)); this.fr.style.opacity = a > T(562) ? 1 : 0;
      this.side.forEach((pr, i) => { const p = seg(a, T(563) + 0.2 + i * 0.1, T(563) + 0.8 + i * 0.1); pr.forEach((el) => el.setAttribute('transform', 'translate(' + ((i - 1.5) * 40 * p).toFixed(1) + ' ' + (420 * p * p).toFixed(1) + ') rotate(' + (p * (i % 2 ? 40 : -30)).toFixed(1) + ')')); });
      W.posePerson(this.m, { x: 760, y: 1000, s: 2.0, expr: a < swap ? 'happy' : 'worried', sq: W.take(a, swap), blink: F.blink(a, 3) });
    },
  });
})();

//@scene weight 566
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('weight', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const garland = '<path d="M-180 -110 Q-90 -60 0 -110 Q90 -60 180 -110" ' + F.ln('#7FB069', 10) + '/>' + [-120, -40, 40, 120].map((x) => '<circle cx="' + x + '" cy="-80" r="12" style="fill:#F2A5B8;stroke:#2A2522;stroke-width:3"/>').join('');
      kit.stage.append(kit.h(F.frame('<rect width="1920" height="1080" style="fill:#3B2A2A"/><rect y="860" width="1920" height="220" style="fill:#2E2020"/>' + W.glow(700, 560, 700, '#FFC86B', 0.25) +
        '<g class="we-cl">' + F.cloud('', 0, 0, 1.3) + '</g>' + F.who('we-ft', 'ft', { face: 0.35 }) + F.thought('we-b', 1100, 340, 420, 300, F.chandelier(0, 10, 0.8) + '<g class="we-gar">' + garland + '</g>') + F.poof('we-pf', 1100, 340, 1.8) +
        F.timerRing('we-tm', 1720, 880, 80), '', F.label('5', 1698, 836, 80, 'we-5'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'we-ft');
      Object.assign(this, { cam: q('.cam'), cl: q('.we-cl'), bp: q('.we-b'), b: q('.we-b-in'), gar: q('.we-gar'), pf: q('.we-pf'), tm: q('.we-tm'), five: q('.we-5') });
      this.L = [[this.S, 1.0, 960, 540], [T(616), 1.3, 760, 560, 1.0], [T(621), 1.0, 960, 540, 0.8]];
    },
    render(t) {
      const a = t + this.S, kill = T(588), heavy = eo(seg(a, T(616), T(618) + 0.3));
      F.camL(this.cam, a, this.L, this.E);
      W.pop(this.b, a, this.S + 0.2); W.pop(this.gar, a, T(573));
      const push = eio(seg(a, T(579), T(585))), fall = eio(seg(a, T(603), T(605) + 0.4));
      const cx = lerp(lerp(1300, 1700, push), 760, fall), cy = lerp(lerp(330, 300, push), 300, fall) + 10 * Math.sin(a * 2) + 120 * heavy;
      this.cl.setAttribute('transform', 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') scale(' + (1 + 0.4 * heavy).toFixed(3) + ')'); this.cl.style.opacity = seg(a, T(580), T(581)).toFixed(2);
      this.bp.style.opacity = a < kill ? 1 : 0; F.poofAt(this.pf, a, kill);
      const ring = seg(a, kill - 0.6, kill + 1.6); this.tm.setAttribute('stroke-dasharray', (100 * ring).toFixed(1) + ' 100'); const tv = a > T(586) && a < T(596) ? 1 : 0; this.tm.parentNode.style.opacity = tv; this.five.style.opacity = tv;
      W.posePerson(this.m, { x: 760, y: 1000, s: 2.0, expr: a < kill ? 'happy' : a < T(603) ? 'surprised' : 'sad', sq: W.take(a, kill) * (1 - 0.12 * heavy), lean: 6 * heavy, head: 10 * heavy, blink: F.blink(a, 3), a1: -10 + 20 * heavy, b1: 10 - 20 * heavy });
    },
  });
})();

//@scene selling 626
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('selling', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const room = '<g class="se-room"><path d="M760 300 H1160 V700 H760 Z" ' + F.st('#C98F86', 5) + '/><path d="M760 700 L640 820 H1280 L1160 700 Z" ' + F.st('#8A5A40', 5) + '/><path d="M760 300 L640 220 V820 M1160 300 L1280 220 V820" ' + F.ln(F.INK, 5) + '/>' +
        '<g transform="translate(960 800) scale(.4)">' + W.prop.settee(0, 0, 1, '#C9B48A') + '</g></g>';
      const icons = '<g class="se-i0">' + F.coins(500, 980, 0.9) + '</g>' + F.wisp('se-i1', 'M900 1000 C960 940 860 900 920 840', '#8A8F5A', 20) + '<g class="se-i2"><path d="M1360 860 H1480 V1000 H1360 Z" ' + F.st('#C98F86', 4) + '/><path d="M1480 860 q30 40 -10 70 Z" ' + F.st('#E8C6B8', 3) + '/></g>' +
        [500, 900, 1420].map((x, i) => '<g class="se-x' + i + '"><g transform="translate(' + x + ' 920) scale(.6)">' + F.coralX('', 1) + '</g></g>').join('');
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + '<g class="se-bk">' + F.book('', 420, 470, 0.6, F.chandelier(0, -100, 0.8)) + '<g transform="translate(420 470)">' + F.coralX('se-bx', 1.4) + '</g></g>' + room + icons +
        '<g class="se-tg">' + F.priceTag('', 1460, 360, 0.7) + '</g>', '', F.label('$2', 1360, 328, 64, 'se-2'), { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), bk: q('.se-bk'), bx: q('.se-bx'), room: q('.se-room'), tg: q('.se-tg'), two: q('.se-2'), i0: q('.se-i0'), i1: q('.se-i1'), i2: q('.se-i2'), x: [0, 1, 2].map((i) => q('.se-x' + i)) });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0, 960, 540);
      W.pop(this.bk, a, T(636)); W.pop(this.bx, a, T(633) > T(636) ? T(637) : T(638)); if (a > T(642)) this.bk.style.opacity = 1 - seg(a, T(642), T(643));
      W.pop(this.room, a, T(643)); W.pop(this.tg, a, T(643) + 0.3); W.pop(this.two, a, T(643) + 0.3);
      W.pop(this.i0, a, T(654)); F.drawWisp(this.i1, seg(a, T(656), T(656) + 0.5), 0, a); W.pop(this.i2, a, T(659));
      const xs = [T(652), T(652), T(652)]; this.x.forEach((el, i) => W.pop(el, a, [T(654), T(656), T(659)][i] + 0.35));
    },
  });
})();

//@scene cure 661
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('cure', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      const bottle = '<g class="cu-bt"><path d="M-30 -120 h60 v30 q40 20 40 70 v80 q0 20 -20 20 h-100 q-20 0 -20 -20 v-80 q0 -50 40 -70 Z" ' + F.st('#9ED3CC', 5) + '/><rect x="-36" y="-150" width="72" height="34" rx="6" ' + F.st('#8C5A3A', 4) + '/><path d="M-50 0 h100" ' + F.ln('#FFFDF4', 18) + '/></g>';
      kit.stage.append(kit.h(F.frame(F.parlor(M, { clk: 'cu' }) + '<rect width="1920" height="1080" style="fill:#1E1714;opacity:.35"/>' + '<g class="cu-cl">' + F.cloud('', 0, 0, 1.2) + '</g>' + F.who('cu-ft', 'ft', { face: 0.35 }) + '<g class="cu-bp">' + bottle + '</g>', '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'cu-ft'); Object.assign(this, { cam: q('.cam'), cl: q('.cu-cl'), bp: q('.cu-bp') });
      this.L = [[this.S, 1.3, 860, 600], [T(676), 1.6, 1000, 560, 0.8]];
    },
    render(t) {
      const a = t + this.S, reach = eio(seg(a, T(676), T(678))), through = seg(a, T(681), T(683) + 0.5);
      F.camL(this.cam, a, this.L, this.E);
      this.cl.setAttribute('transform', 'translate(1180 520) translate(0 ' + (10 * Math.sin(a * 2)).toFixed(1) + ')');
      W.pop(this.bp.firstChild, a, T(676));
      const bx = lerp(820, 1170, reach) + 60 * through, by = 600 - 40 * reach;
      this.bp.setAttribute('transform', 'translate(' + bx.toFixed(1) + ' ' + by.toFixed(1) + ')'); this.bp.style.opacity = a > T(676) ? (1 - 0.6 * through).toFixed(2) : 0;
      W.posePerson(this.m, { x: 720, y: 1000, s: 1.8, expr: a > T(682) ? 'sad' : a > T(676) ? 'worried' : 'neutral', blink: F.blink(a, 3), a1: lerp(-10, -95, reach), a2: lerp(-6, 0, reach) });
    },
  });
})();

//@scene weapon 684
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('weapon', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      const row = [0, 1, 2, 3, 4].map((i) => '<g class="wp-r' + i + '"><g transform="translate(' + (300 + i * 330) + ' 980) scale(1.05)">' + F.who('wp-c' + i, 'ft', { color: ['#A9C3D6', '#D8C08A', '#C98A7A', '#B9C9A3', '#D9C9A3'][i], shade: '#8FAEC4' }) + '</g>' + F.revolver('', 300 + i * 330 + 70, 760, 0.45) + '</g>').join('');
      kit.stage.append(kit.h(F.frame('<g class="wp-a"><rect width="1920" height="1080" style="fill:#3B2A2A"/>' + F.thought('wp-b', 960, 330, 420, 300, F.chandelier(0, 0, 0.8)) + '<g class="wp-gun">' + F.revolver('', 960, 500, 1.8) + '</g></g>' +
        '<g class="wp-row" style="display:none"><rect width="1920" height="1080" style="fill:' + M.sky + '"/>' + row + '</g>' +
        '<g class="wp-doors" style="display:none">' + F.street(M) + '</g>', '', '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      [0, 1, 2, 3, 4].forEach((i) => W.posePerson(W.bindPerson(kit.stage, 'wp-c' + i), { expr: 'happy', a1: -70, a2: -20 }));
      Object.assign(this, { cam: q('.cam'), A: q('.wp-a'), b: q('.wp-b-in'), gun: q('.wp-gun'), row: q('.wp-row'), doors: q('.wp-doors'), r: [0, 1, 2, 3, 4].map((i) => q('.wp-r' + i)) });
    },
    render(t) {
      const a = t + this.S, morph = T(688);
      F.framing(this.cam, 1.0, 960, 540);
      F.show(this.A, a < T(690)); F.show(this.row, a >= T(690) && a < T(696)); F.show(this.doors, a >= T(696));
      W.pop(this.b, a, this.S + 0.1); this.b.style.opacity = a < morph ? 1 : 0; W.pop(this.gun, a, morph);
      this.r.forEach((el, i) => W.pop(el, a, T(690) + i * 0.18, 'bottom'));
    },
  });
})();

//@scene fired 703
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('fired', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      let wall = '<rect width="1920" height="1080" style="fill:' + M.wall + '"/>'; for (let y = 30; y < 1080; y += 60) wall += '<path d="M0 ' + y + ' H1920" ' + F.ln('rgba(42,37,34,.18)', 4) + '/>';
      const flash = '<g class="fi-fl"><path d="M0 -200 L50 -60 L190 -80 L80 10 L160 140 L20 70 L-60 190 L-60 40 L-200 20 L-80 -50 Z" style="fill:#FFE59A;stroke:#2A2522;stroke-width:6"/></g>';
      kit.stage.append(kit.h(F.frame('<g class="fi-door">' + wall + F.bigDoor('fi', 960, 1060, 1.0) + '</g><g class="fi-bang" style="display:none"><rect width="1920" height="1080" style="fill:#F08A7E"/><g transform="translate(960 540) scale(2.2)">' + flash + '</g></g>' +
        '<g class="fi-end" style="display:none"><rect width="1920" height="1080" style="fill:#1E1714"/>' + W.glow(960, 500, 600, '#FFC86B', 0.2) + F.who('fi-ft', 'ft', { face: 0 }) + F.heart('fi-h', 960, 850, 0.32) + '</g>', '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'fi-ft');
      Object.assign(this, { cam: q('.cam'), door: q('.fi-door'), bang: q('.fi-bang'), end: q('.fi-end'), hL: q('.fi-h-L'), hR: q('.fi-h-R'), h: q('.fi-h') });
    },
    render(t) {
      const a = t + this.S, fire = T(707), after = fire + 0.35;
      F.framing(this.cam, a < fire ? 1.0 + 0.05 * seg(a, this.S, fire) : 1.0, 960, 540);
      F.poseDoor(this.root, 'fi', eio(seg(a, T(704), F.TE(705))), 1, 1, 0);
      F.show(this.door, a < fire); F.show(this.bang, a >= fire && a < after); F.show(this.end, a >= after);
      const crack = eo(seg(a, T(717), F.TE(718)));
      this.hL.setAttribute('transform', 'translate(' + (-26 * crack).toFixed(1) + ' ' + (10 * crack).toFixed(1) + ') rotate(' + (-12 * crack).toFixed(1) + ')');
      this.hR.setAttribute('transform', 'translate(' + (26 * crack).toFixed(1) + ' ' + (10 * crack).toFixed(1) + ') rotate(' + (12 * crack).toFixed(1) + ')');
      W.posePerson(this.m, { x: 960, y: 1080, s: 2.6, expr: a < T(714) ? 'surprised' : 'sad', blink: F.blink(a, 3.2), head: 6 * seg(a, T(715), T(718)), a1: -6, b1: 6 });
      F.fade(this.root, t, this.E - this.S, 0, 1.4);
    },
  });
})();
