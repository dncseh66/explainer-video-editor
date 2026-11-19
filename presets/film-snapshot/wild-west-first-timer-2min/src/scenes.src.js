// "The First Timer" — chapter 10: The Door (first ~2 minutes). build.py splits this file at the //@scene markers.
// Marker = //@scene <id> <first script word index>. Inside a scene, a = absolute VO time; T(i) = start of script word i
// (word numbers: scripts_text/wild-west-first-timer-2min.txt split on spaces, 0-based).

//@scene title 0
(function () {
  const F = W.F, { seg, eio, lerp } = F, T = F.T;
  kit.scene('title', {
    init(kit) {
      this.S = kit.start; this.D = kit.dur; const M = W.MOODS.prairieDust;
      const bg = '<rect width="1920" height="1080" style="fill:' + M.sky + '"/>' + W.glow(1500, 200, 420, '#FFF6D8', 0.8) + '<circle cx="1500" cy="200" r="70" ' + F.st('#FFF3CF', 3) + '/>' +
        '<path d="M0 560 L220 560 L260 470 L520 470 L560 560 L1320 560 L1350 500 L1560 500 L1590 560 L1920 560 V700 H0 Z" ' + F.st(M.mesa, 3) + '/>' +
        '<rect y="680" width="1920" height="400" style="fill:' + M.floor + '"/><path d="M0 680 H1920" ' + F.ln(F.INK, 4) + '/>' +
        W.prop.cactus(1380, 960, 1.2) + W.prop.cactus(1760, 900, 0.8) + W.prop.fence(1500, 1000, 1, 3, M) +
        '<ellipse cx="560" cy="996" rx="170" ry="18" style="fill:rgba(42,37,34,.14)"/>' + W.person('ti-n', W.NARRATOR_WEST);
      kit.stage.append(kit.h(F.frame(bg, '', '<div class="ti-page" style="position:absolute;inset:0;background:#FFFFFF;display:none">' +
        '<p class="hand-label ti-num" style="left:0px;top:150px;width:1920px;text-align:center;font-size:640px;line-height:1;transform-origin:50% 100%">10</p>' +
        '<p class="hand-label ti-tag" style="left:0px;top:840px;width:1920px;text-align:center;font-size:130px;transform-origin:50% 50%">The Door</p></div>')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'ti-n');
      Object.assign(this, { cam: q('.cam'), num: q('.ti-num'), tag: q('.ti-tag'), page: q('.ti-page') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1 + 0.02 * t / this.D, 960, 560);
      F.show(this.page, a >= T(4));
      const hit = W.eobk(seg(a, T(3) - 0.25, T(3)), 1.6);
      W.posePerson(this.m, { x: 560, y: 990, s: 2.6, head: 3 * Math.sin(a * 2), expr: F.talk(a, [[T(0), F.TE(3)]]) || 'smug', blink: F.blink(a, 2.7, 0.5),
        a1: lerp(-8, -100, hit), a2: lerp(-6, 6, hit), b1: 8 + 1.5 * Math.sin(a * 2.1) });
      W.drop(this.num, a, T(5) - 0.22, T(5), 900);
      W.pop(this.tag, a, T(6));
      F.fade(this.root, t, this.D, 0.3, 0);
    },
  });
})();

//@scene doors 8
(function () {
  const F = W.F, { seg, eio, lerp } = F, T = F.T;
  kit.scene('doors', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      const rims = [0, 1, 2, 3, 4].map((i) => '<rect class="do-r' + i + '" x="' + (F.doorX(i) - 70) + '" y="506" width="140" height="262" rx="6" style="fill:none;stroke:#FFE59A;stroke-width:12;opacity:0"/>').join('');
      kit.stage.append(kit.h(F.frame(F.street(M) + rims + F.who('do-h', 'hand3', { face: -0.3 }), F.signs('do'), '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.h = W.bindPerson(kit.stage, 'do-h');
      this.cam = q('.cam'); this.rims = [0, 1, 2, 3, 4].map((i) => q('.do-r' + i));
      const S = this.S, X = F.doorX;
      this.L = [[S, 1.0, 960, 540], [T(13), 1.45, 960, 560, 0.7], [T(23), 1.45, X(0) + 200, 560, 0.8], [T(25), 1.45, X(4) - 200, 560, 1.6], [T(28) + 0.2, 1.0, 960, 540, 0.8]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      W.posePerson(this.h, { x: 1700, y: 772, s: 1.0, expr: 'neutral', blink: F.blink(a, 3.3), a1: -20, a2: -60 });
      // the parlor house door (middle) glows on 'parlor house', then every door glows in turn on 'every other door'
      this.rims[2].style.opacity = (seg(a, T(13), T(13) + 0.3) * (1 - seg(a, T(21), T(21) + 0.4)) * (0.6 + 0.4 * Math.sin(a * 6))).toFixed(3);
      [0, 1, 3, 4].forEach((i, k) => { const t0 = T(23) + k * 0.35; this.rims[i].style.opacity = (seg(a, t0, t0 + 0.15) * (1 - seg(a, t0 + 0.6, t0 + 0.9))).toFixed(3); });
      if (a > T(27)) this.rims.forEach((r) => (r.style.opacity = (0.8 * seg(a, T(27), T(27) + 0.3) * (1 - seg(a, T(28) + 0.6, T(28) + 1))).toFixed(3)));
    },
  });
})();

//@scene closeup 29
(function () {
  const F = W.F, { seg, eio, lerp } = F, T = F.T;
  kit.scene('closeup', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      let wall = '<rect width="1920" height="1080" style="fill:' + M.wall + '"/>'; for (let y = 30; y < 1080; y += 60) wall += '<path d="M0 ' + y + ' H1920" ' + F.ln('rgba(42,37,34,.18)', 4) + '/>';
      const sun = '<g class="cl-sun" style="opacity:0">' + W.glow(1800, 0, 900, '#FFF3B0', 0.75) + [0, 1, 2, 3, 4].map((k) => '<path d="M1920 0 L' + (1100 + k * 180) + ' 1080" style="stroke:#FFF6CF;stroke-width:60;opacity:.25"/>').join('') + '</g>';
      kit.stage.append(kit.h(F.frame(wall + '<rect y="1040" width="1920" height="40" ' + F.st(M.wood) + '/>' + F.bigDoor('cl', 960, 1060, 1.0) + sun, '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.cam = q('.cam'); this.sun = q('.cl-sun');
      this.L = [[this.S, 1.0, 960, 540], [T(32), 2.2, 1130, 600, 0.5], [T(35), 1.0, 960, 540, 0.6], [T(43), 1.2, 1200, 460, 0.9]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      const frameGlow = seg(a, T(30), T(30) + 0.25) * (1 - seg(a, T(32) - 0.3, T(32)));
      const jiggle = a > T(33) && a < T(33) + 0.5 ? 0.25 * Math.sin((a - T(33)) * 40) : 0;
      F.poseDoor(this.root, 'cl', 0, jiggle, seg(a, T(38), T(39) + 0.4), frameGlow);
      this.sun.style.opacity = (0.9 * seg(a, T(43), T(44))).toFixed(3);
    },
  });
})();

//@scene walk 45
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('walk', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      kit.stage.append(kit.h(F.frame(F.street(M) + F.who('wa-ft', 'ft') + '<g class="wa-q" transform="translate(960 330) scale(1.3)">' + F.qmark('wa-qi') + '</g>',
        F.signs('wa'), F.tag('1878', 90, 80, 'wa-y', 'font-size:84px;color:#B5503F'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'wa-ft');
      Object.assign(this, { cam: q('.cam'), y: q('.wa-y'), qm: q('.wa-qi'), sg: [0, 1, 3].map((i) => q('.wa-s' + i)) });
    },
    x(a) { // walks the boardwalk, passing each shop on its word, stops at the parlor house
      const k = [[this.S, -120], [T(60), F.doorX(0) + 40], [T(65), F.doorX(1) + 40], [T(70) - 0.2, 830]];
      for (let i = 1; i < k.length; i++) if (a < k[i][0]) return lerp(k[i - 1][1], k[i][1], seg(a, k[i - 1][0], k[i][0]));
      return 830;
    },
    render(t) {
      const a = t + this.S, x = this.x(a), walking = a < T(70) - 0.2;
      const stop = eio(seg(a, T(70) - 0.4, T(70) + 0.6));
      F.framing(this.cam, lerp(1.45, 1.75, stop), lerp(Math.max(x + 120, 640), 940, stop), lerp(560, 470, stop));
      const looks = [T(60), T(65), T(68)]; let look = 0; looks.forEach((t0) => (look = Math.max(look, seg(a, t0, t0 + 0.2) * (1 - seg(a, t0 + 0.9, t0 + 1.2)))));
      W.posePerson(this.m, Object.assign({ x, y: 772, s: 1.0, expr: a > T(73) ? 'worried' : 'neutral', blink: F.blink(a, 3.1), head: -12 * look - 8 * seg(a, T(71), T(72)) }, walking ? W.walk(a) : {}));
      this.sg.forEach((el, i) => { const p = seg(a, looks[i], looks[i] + 0.4); el.style.transform = 'scale(' + (1 + 0.22 * Math.sin(Math.PI * p)).toFixed(3) + ')'; });
      W.pop(this.y, a, T(51), 'left'); if (a > T(60)) this.y.style.opacity = 1 - seg(a, T(60), T(60) + 0.3);
      W.pop(this.qm, a, T(79));
    },
  });
})();

//@scene latch 81
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('latch', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.prairieDust;
      let wall = '<rect width="1920" height="1080" style="fill:' + M.wall + '"/>'; for (let y = 30; y < 1080; y += 60) wall += '<path d="M0 ' + y + ' H1920" ' + F.ln('rgba(42,37,34,.18)', 4) + '/>';
      const hand = '<g class="la-hand"><path d="M1500 1200 L1240 620" ' + F.ln('#2A2522', 9) + '/><path d="M1600 1200 L1420 760 L1300 700" style="fill:none;stroke:#2A2522;stroke-width:70;stroke-linecap:round"/><path d="M1600 1200 L1420 760 L1300 700" style="fill:none;stroke:#A9C3D6;stroke-width:60;stroke-linecap:round"/><circle cx="1240" cy="620" r="40" ' + F.st('#FFFFFF', 5) + '/></g>';
      kit.stage.append(kit.h(F.frame(wall + '<rect y="1040" width="1920" height="40" ' + F.st(M.wood) + '/>' + F.bigDoor('la', 960, 1060, 1.0) + hand, '', '<div class="la-flash" style="position:absolute;inset:0;background:#FFC86B;opacity:0;mix-blend-mode:screen"></div>')));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), hand: q('.la-hand'), flash: q('.la-flash') });
      this.L = [[this.S, 2.0, 1130, 620], [T(88), 1.0, 960, 540, 0.6], [T(92), 2.6, 960, 600, 1.4]];
    },
    render(t) {
      const a = t + this.S, lift = eo(seg(a, T(85), T(86) + 0.15)), open = eio(seg(a, T(89), T(91) + 0.2));
      F.camL(this.cam, a, this.L, this.E);
      F.poseDoor(this.root, 'la', open, lift, 1, 0);
      const reach = eo(seg(a, this.S, T(84))) * (1 - eio(seg(a, T(88), T(88) + 0.4)));
      this.hand.setAttribute('transform', 'translate(' + (90 * (1 - reach) + 300 * (1 - reach)) + ' ' + (-34 * lift + 400 * (1 - reach)) + ')');
      this.flash.style.opacity = (0.55 * seg(a, T(93), T(93) + 0.15) * (1 - seg(a, T(94), T(94) + 0.8))).toFixed(3);
    },
  });
})();

//@scene inside 95
(function () {
  const F = W.F, { seg, eio, lerp } = F, T = F.T;
  kit.scene('inside', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      let haze = ''; for (let i = 0; i < 9; i++) haze += '<path class="in-h" d="M-200 ' + (140 + i * 100) + ' q120 -40 240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0" style="fill:none;stroke:#F3E3C8;stroke-width:8;stroke-linecap:round;opacity:.0"/>';
      kit.stage.append(kit.h(F.frame(F.parlor(M, { clk: 'in' }) + '<rect class="in-amber" width="1920" height="1080" style="fill:#C86A3C;opacity:0;mix-blend-mode:multiply"/>' +
        '<g class="in-glow" style="opacity:0">' + W.glow(430, 560, 700, '#FFB86B', 0.55) + '</g>' + haze, '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), amber: q('.in-amber'), glow: q('.in-glow'), haze: [...kit.stage.querySelectorAll('.in-h')] });
      this.L = [[this.S, 1.0, 960, 560], [T(99), 1.15, 760, 600, 1.2]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      const air = seg(a, T(96), T(97));
      this.haze.forEach((h, i) => { h.style.opacity = (0.22 * air).toFixed(3); h.setAttribute('transform', 'translate(' + ((a * 60 + i * 37) % 240 - 120).toFixed(1) + ' ' + (6 * Math.sin(a * 1.5 + i)).toFixed(1) + ')'); });
      const light = seg(a, T(100), T(101));
      this.amber.style.opacity = (0.32 * light).toFixed(3);
      this.glow.style.opacity = ((0.8 + 0.2 * Math.sin(a * 9)) * light).toFixed(3);
    },
  });
})();

//@scene smell 103
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('smell', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      const w = [['#E3B341', 'M1980 300 C1600 260 1500 520 1200 430 S980 360 900 420'], ['#F2A5B8', 'M1980 620 C1700 700 1500 420 1250 520 S1000 520 920 460'], ['#8C6440', 'M1980 900 C1650 820 1550 640 1300 640 S1040 560 930 500']];
      kit.stage.append(kit.h(F.frame(F.parlor(M, { clk: 'sm', window: false }) + '<rect width="1920" height="1080" style="fill:#2A1E18;opacity:.35"/>' + W.glow(760, 420, 600, '#FFC86B', 0.35) +
        F.who('sm-ft', 'ft', { face: 0.45 }) + w.map(([c, d], i) => F.wisp('sm-w' + i, d, c, 26)).join(''), '', '<div class="sm-dark" style="position:absolute;inset:0;background:#120F0D;opacity:0"></div>')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'sm-ft');
      Object.assign(this, { cam: q('.cam'), dark: q('.sm-dark'), w: [0, 1, 2].map((i) => q('.sm-w' + i)) });
    },
    render(t) {
      const a = t + this.S, hit = T(105);
      F.framing(this.cam, 1.0 + 0.04 * seg(a, this.S, this.E), 960, 540);
      this.w.forEach((el, i) => F.drawWisp(el, seg(a, T(104) - 0.3 + i * 0.25, hit + 0.2 + i * 0.25), 10, a + i));
      const dark = a < T(107) ? 0 : 0.8 * (1 - seg(a, T(108), F.TE(110)));
      this.dark.style.opacity = dark.toFixed(3);
      const squint = a > T(107) && a < F.TE(110);
      W.posePerson(this.m, { x: 760, y: 1090, s: 3.2, sq: W.take(a, hit), lean: -6 * seg(a, hit, hit + 0.2), expr: a < hit ? 'neutral' : squint ? 'sleep' : a < F.TE(110) + 0.4 ? 'surprised' : 'worried', blink: F.blink(a, 3.2), b1: 10, a1: -10 });
    },
  });
})();

//@scene campfire 116
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('campfire', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.trailNight;
      let notes = ''; for (let i = 0; i < 5; i++) notes += F.note('cf-n' + i, 0, 0, 1.1, '#F4EFD8');
      const fancy = F.chandelier(0, -10, 0.9) + [[-150, -60], [150, -50], [-110, 60], [120, 70]].map(([x, y]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5 Z" style="fill:#FFE59A;stroke:#2A2522;stroke-width:3"/>').join('');
      kit.stage.append(kit.h(F.frame(F.nightSky(5) + F.bedroll(620, 960, 1.1) + F.bedroll(1290, 960, 1.1) + F.bedroll(1560, 960, 1.0) + W.prop.fire(960, 960, 1.3, 0) +
        F.who('cf-a', 'hand2', { face: 0.35 }) + F.who('cf-b', 'hand3', { face: -0.35 }) + F.who('cf-ft', 'ft', { face: -0.35 }) + notes + F.thought('cf-bub', 1520, 330, 460, 280, fancy), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      this.A = W.bindPerson(kit.stage, 'cf-a'); this.B = W.bindPerson(kit.stage, 'cf-b'); this.H = W.bindPerson(kit.stage, 'cf-ft');
      Object.assign(this, { cam: q('.cam'), bub: q('.cf-bub-in'), notes: [0, 1, 2, 3, 4].map((i) => q('.cf-n' + i)) });
      this.L = [[this.S, 1.0, 960, 560], [T(126), 1.45, 1420, 520, 1.0]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E); W.flames(this.root, a);
      const sitR = { legL: -80, legR: -80 }, sitL = { legL: 80, legR: 80 };
      const sing = a > T(119) - 0.2, story = seg(a, T(122), T(122) + 0.3);
      W.posePerson(this.A, Object.assign({ x: 600, y: 930, s: 1.15, expr: sing ? (Math.floor(a * 6) % 2 ? 'talk' : 'happy') : 'happy', blink: F.blink(a, 3), head: sing ? 5 * Math.sin(a * 3) : 0 }, sitR));
      W.posePerson(this.B, Object.assign({ x: 1290, y: 930, s: 1.15, expr: story > 0 ? F.talk(a, [[T(122), T(127)]]) || 'smug' : 'happy', blink: F.blink(a, 3.4, 1), a1: lerp(-8, -120, story), b1: lerp(8, 120, story), a2: -10, b2: 10 }, sitL));
      W.posePerson(this.H, Object.assign({ x: 1560, y: 930, s: 1.05, expr: a > T(126) ? 'joy' : 'happy', blink: F.blink(a, 2.8, 2) }, sitL));
      this.notes.forEach((n, i) => { const t0 = T(119) + i * 0.55, p = ((a - t0) / 2.2); const on = a > t0 && p < 1;
        n.parentNode && n.setAttribute('transform', 'translate(' + (640 + 80 * Math.sin(p * 5 + i) + 60 * p) + ' ' + (760 - 380 * p) + ') scale(1.1)'); n.style.opacity = on ? (1 - p).toFixed(2) : 0; });
      W.pop(this.bub, a, T(123));
      F.fade(this.root, t, this.E - this.S, 0.25, 0);
    },
  });
})();

//@scene jar 132
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('jar', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const sparks = '<g class="ja-sp">' + [[-120, -150], [130, -160], [-150, -40], [150, -30]].map(([x, y]) => '<path transform="translate(' + (1250 + x) + ' ' + (860 + y) + ')" d="M0 -26 L7 -7 L26 0 L7 7 L0 26 L-7 7 L-26 0 L-7 -7 Z" style="fill:#FFFFFF;stroke:#2A2522;stroke-width:3"/>').join('') + '</g>';
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + F.jar('ja', 640, 960, 1.3, F.SMELLS) +
        '<g class="ja-lamp">' + W.prop.keroLamp(1350, 720, 1.5, 0) + '</g><g class="ja-soap">' + F.soap(1250, 880, 1.3) + '</g>' + sparks + '<g class="ja-wash">' + W.prop.washstand(1620, 900, 1.0) + '</g>' +
        '<path class="ja-ar" d="M1110 0" />' + '<g class="ja-arr" style="opacity:0">' + W.info.arrow(1120, 880, 900, 880) + '</g>', '', '', { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage; Object.assign(this, { cam: q('.cam'), lamp: q('.ja-lamp'), soap: q('.ja-soap'), wash: q('.ja-wash'), sp: q('.ja-sp'), arr: q('.ja-arr') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1 + 0.03 * seg(a, this.S, this.E), 960, 560);
      W.pop(this.lamp, a, T(135), 'bottom'); W.pop(this.soap, a, T(142), 'bottom'); W.pop(this.wash, a, T(151), 'bottom');
      F.poseJar(this.root, 'ja', [eio(seg(a, T(135) + 0.2, T(135) + 1.0)), eio(seg(a, T(142) + 0.2, T(142) + 1.0))]);
      // 'first layer': coral arrow points at the bottom band
      this.arr.style.opacity = (seg(a, T(139), T(139) + 0.15) * (1 - seg(a, T(141) - 0.2, T(141)))).toFixed(3);
      W.pop(this.sp, a, T(145)); this.sp.style.opacity = a > T(145) && a < T(151) ? (0.6 + 0.4 * Math.sin(a * 14)).toFixed(2) : 0;
    },
  });
})();

//@scene stain 153
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('stain', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      let k = 3; const rnd = () => ((k = (k * 1664525 + 1013904223) >>> 0) / 4294967296); let butts = '';
      for (let i = 0; i < 46; i++) butts += '<g class="st-b">' + F.butt(i < 6 ? 420 + rnd() * 80 : 120 + rnd() * 1680, i < 6 ? 664 : 830 + rnd() * 230, 1.1, rnd() * 180) + '</g>';
      const brown = (d, op, cls) => '<path class="' + cls + '" d="' + d + '" style="fill:#5A3A22;opacity:0" data-op="' + op + '"/>';
      kit.stage.append(kit.h(F.frame(F.parlor(M, { clk: 'st' }) + '<ellipse cx="470" cy="668" rx="38" ry="10" ' + F.st('#7D7A80', 3) + '/>' + F.cigar(470, 652, 0.6, -8) +
        F.wisp('st-smoke', 'M510 640 C540 560 470 520 520 440 S560 340 510 260', '#D9D4CC', 14) + butts +
        brown('M0 0 H1920 V600 H0 Z', 0.3, 'st-wall') + brown('M530 124 Q560 300 540 470 L600 470 Q590 300 610 124 Z M810 124 Q780 300 800 470 L740 470 Q750 300 730 124 Z', 0.5, 'st-cur') +
        brown('M220 804 L1500 804 L1760 1080 L-40 1080 Z', 0.38, 'st-car') + [300, 560, 820, 1080, 1260, 1460, 1700].map((x, i) => F.ghost(x, 1010 - (i % 2) * 20, 1.15, 'st-g')).join(''), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), smoke: q('.st-smoke'), b: [...kit.stage.querySelectorAll('.st-b')], g: [...kit.stage.querySelectorAll('.st-g')], wall: q('.st-wall'), cur: q('.st-cur'), car: q('.st-car') });
      this.L = [[this.S, 2.0, 520, 560], [T(162), 1.0, 960, 540, 0.8]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      F.drawWisp(this.smoke, seg(a, T(154), T(157)), 8, a);
      this.b.forEach((el, i) => W.pop(el, a, T(162) + (i < 6 ? i * 0.12 : 0.5 + i * 0.075)));
      [[this.wall, T(174)], [this.cur, T(177)], [this.car, T(180)]].forEach(([el, t0]) => (el.style.opacity = (+el.dataset.op * eio(seg(a, t0, t0 + 0.7))).toFixed(3)));
      const gw = [190, 191, 192, 193, 194, 196, 197];
      this.g.forEach((el, i) => (el.style.opacity = (0.45 * seg(a, T(gw[i]), T(gw[i]) + 0.35)).toFixed(3)));
    },
  });
})();

//@scene perfume 199
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('perfume', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const puff = '<g class="pf-puff">' + [[0, 0, 70], [-90, -30, 56], [-170, 10, 64], [-250, -20, 50], [-60, 50, 46]].map(([x, y, r]) => '<circle cx="' + (1210 + x) + '" cy="' + (650 + y) + '" r="' + r + '" style="fill:#F2A5B8;opacity:.8"/>').join('') + '</g>';
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + F.jar('pf', 640, 960, 1.3, F.SMELLS) + '<g class="pf-bot">' + F.perfume('pf-p', 1420, 860, 1.6) + '</g>' + puff +
        '<g transform="translate(1040 420) scale(1.4)">' + F.qmark('pf-q') + '</g>' +
        '<g class="pf-i0">' + F.hatIcon(1230, 1000, 1.2) + '</g><g class="pf-i1">' + F.coins(1500, 1000, 1.2) + '</g><g class="pf-i2">' + F.watch(1740, 960, 1.1) + '</g>', '', '', { noVig: true })));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), jar: q('.pf-in'), bot: q('.pf-bot'), bulb: q('.pf-p-bulb'), puff: q('.pf-puff'), qm: q('.pf-q'), ic: [0, 1, 2].map((i) => q('.pf-i' + i)) });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1 + 0.03 * seg(a, this.S, this.E), 960, 560);
      const sq1 = T(202), sq2 = T(205);
      W.pop(this.bot, a, T(200), 'bottom');
      this.bot.style.transform += ' translateX(' + (900 * eio(seg(a, T(217), T(217) + 0.5))).toFixed(1) + 'px)';
      const squeeze = Math.max(Math.sin(Math.PI * seg(a, sq1, sq1 + 0.3)), Math.sin(Math.PI * seg(a, sq2, sq2 + 0.3)));
      this.bulb.style.transformBox = 'fill-box'; this.bulb.style.transformOrigin = '50% 50%'; this.bulb.style.transform = 'scale(' + (1 - 0.3 * squeeze).toFixed(3) + ')';
      const pp = Math.max(seg(a, sq1, sq1 + 0.9), seg(a, sq2, sq2 + 0.9) * 1.0), big = a >= sq2 ? 1.6 : 1;
      this.puff.style.opacity = a > sq1 && pp < 1 ? (1 - pp).toFixed(2) : 0;
      this.puff.setAttribute('transform', 'translate(' + (-200 * pp) + ' 0) translate(1210 650) scale(' + (big * (0.6 + 0.8 * pp)).toFixed(3) + ') translate(-1210 -650)');
      const shake = a > sq2 && a < sq2 + 0.5 ? 8 * Math.sin(a * 60) : 0;
      this.jar.setAttribute('transform', 'translate(' + shake.toFixed(1) + ' 0)');
      // tobacco joins, pink fills band 3, then rises ('layered over') as the murky sweet-sour band oozes in under it
      const rise = eio(seg(a, T(206), T(207)));
      F.poseJar(this.root, 'pf', [1, 1, eio(seg(a, this.S, this.S + 0.6)), eio(seg(a, T(208), T(211) + 0.4)), eio(seg(a, sq1 + 0.1, sq1 + 0.8))], [0, 1, 2, 3, 3 + rise]);
      W.pop(this.qm, a, T(214));
      this.ic.forEach((el, i) => W.drop(el, a, T([222, 224, 226][i]) - 0.25, T([222, 224, 226][i]), 700));
    },
  });
})();

//@scene squeeze 227
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('squeeze', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      const wallP = (cls) => '<g class="' + cls + '"><rect x="-1000" y="0" width="1000" height="1080" ' + F.st('#4A2F26', 6) + '/><path d="M-30 0 V1080" ' + F.ln('#B57A72', 16) + '/></g>';
      const ranch = '<g class="sq-ranch" style="opacity:0"><rect x="380" y="90" width="1160" height="930" rx="10" style="fill:none;stroke:#FFFDF4;stroke-width:10;stroke-dasharray:34 24"/>' +
        '<g transform="translate(1440 1000) scale(1.1)"><path d="M-60 0 Q0 30 60 0 M-40 -10 V-150 H40 V-10 M-50 -70 H50" style="fill:none;stroke:#FFFDF4;stroke-width:10;stroke-linecap:round"/></g></g>';
      kit.stage.append(kit.h(F.frame(F.room('sq', M) + '<g transform="translate(0 0)">' + wallP('sq-wl') + '</g><g transform="translate(1920 0) scale(-1 1)">' + wallP('sq-wr') + '</g>' + ranch, '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.R = F.bindRoom(kit.stage, 'sq');
      Object.assign(this, { cam: q('.cam'), wl: q('.sq-wl'), wr: q('.sq-wr'), ranch: q('.sq-ranch') });
    },
    render(t) {
      const a = t + this.S;
      F.framing(this.cam, 1.0, 960, 540);
      F.poseRoom(this.R, a, { talk: true, play: true });
      const c = W.eobk(seg(a, T(227), T(228) + 0.4), 1.2);
      this.wl.setAttribute('transform', 'translate(' + (370 * c).toFixed(1) + ' 0)'); this.wr.setAttribute('transform', 'translate(' + (370 * c).toFixed(1) + ' 0)');
      this.ranch.style.opacity = seg(a, T(235), T(235) + 0.3).toFixed(3);
    },
  });
})();

//@scene piano 239
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('piano', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      let notes = ''; for (let i = 0; i < 7; i++) notes += F.note('pi-n' + i, 0, 0, 1, i === 3 ? '#F08A7E' : '#2A2522');
      kit.stage.append(kit.h(F.frame(F.room('pi', M) + notes, '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.R = F.bindRoom(kit.stage, 'pi');
      Object.assign(this, { cam: q('.cam'), n: [0, 1, 2, 3, 4, 5, 6].map((i) => q('.pi-n' + i)) });
      this.L = [[this.S, 2.2, 1330, 640], [T(248), 1.6, 1330, 620, 0.8]];
    },
    render(t) {
      const a = t + this.S, sour = seg(a, T(245), T(245) + 0.3);
      F.camL(this.cam, a, this.L, this.E);
      F.poseRoom(this.R, a, { talk: true, play: true });
      this.n.forEach((el, i) => { const t0 = this.S + 0.2 + i * 0.55, p = (a - t0) / 2.4; const on = a > t0 && p < 1;
        const wob = sour * (14 * Math.sin(a * 11 + i * 2)) * (i % 2 ? 1 : -1), drop = i === 3 ? sour * 60 * p : 0;
        el.setAttribute('transform', 'translate(' + (1260 + (i % 3) * 70 + 40 * p) + ' ' + (520 - 300 * p + drop) + ') rotate(' + wob.toFixed(1) + ') scale(1.1)');
        el.style.opacity = on ? Math.min(1, (1 - p) * 2).toFixed(2) : 0; });
    },
  });
})();

//@scene chatter 253
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('chatter', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      kit.stage.append(kit.h(F.frame(F.room('ch', M), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.R = F.bindRoom(kit.stage, 'ch'); this.cam = q('.cam');
      this.L = [[this.S, 1.2, 1100, 600], [T(258), 1.6, 560, 560, 0.6], [T(262), 1.0, 960, 540]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      const door = eio(seg(a, T(259), F.TE(260))), step = eio(seg(a, T(267), F.TE(268)));
      F.poseRoom(this.R, a, { talk: true, play: true, turn: T(262), door, hero: { show: door > 0.3, x: lerp(210, 290, step), walk: step > 0 && step < 1, expr: 'worried' } });
    },
  });
})();

//@scene quiet 269
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('quiet', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur; const M = W.MOODS.parlorRose;
      const eyesAt = { madam: [630, 700], girl1: [826, 660], girl2: [1026, 660], baron: [1590, 700], miner: [1780, 712] };
      this.lines = Object.keys(eyesAt);
      const sl = this.lines.map((k, i) => '<path class="qu-l' + i + '" d="M' + eyesAt[k][0] + ' ' + eyesAt[k][1] + ' L300 600" pathLength="100" stroke-dasharray="4 4" style="fill:none;stroke:#F08A7E;stroke-width:6;stroke-linecap:round;opacity:0"/>').join('');
      kit.stage.append(kit.h(F.frame(F.room('qu', M, { extra: sl }), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.R = F.bindRoom(kit.stage, 'qu'); this.cam = q('.cam');
      this.sl = this.lines.map((k, i) => q('.qu-l' + i)); this.min = q('.qu-clk-m');
      this.L = [[this.S, 1.6, 1700, 600], [T(273), 1.6, 1330, 560, 1.2], [T(278), 1.6, 930, 620, 1.2], [T(283), 1.0, 960, 540, 1.0]];
    },
    render(t) {
      const a = t + this.S;
      F.camL(this.cam, a, this.L, this.E);
      F.poseRoom(this.R, a, { turn: this.S - 5, door: 1, hero: { show: true, x: 290, expr: 'worried' }, exprs: { madam: 'smug', girl1: 'neutral', girl2: 'sad', baron: 'smug', miner: 'neutral' } });
      if (this.min) this.min.setAttribute('transform', 'rotate(' + (60 + Math.floor(a) * 6) + ')'); // 'not silent': the clock still ticks
      this.sl.forEach((el, i) => (el.style.opacity = (0.9 * seg(a, T(284) + i * 0.25, T(284) + i * 0.25 + 0.3)).toFixed(3)));
    },
  });
})();

//@scene looked 295
(function () {
  const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  kit.scene('looked', {
    init(kit) {
      this.S = kit.start; this.E = kit.start + kit.dur;
      const P = [[220, 300], [1700, 260], [380, 700], [1560, 640], [160, 960], [1780, 900], [520, 180], [1420, 160], [260, 520], [1660, 460]];
      kit.stage.append(kit.h(F.frame('<rect width="1920" height="1080" style="fill:#1E1714"/><rect x="560" y="0" width="800" height="1080" style="fill:#2F3A4F"/><rect x="530" y="0" width="860" height="1080" ' + F.ln('#4A2F26', 60) + '/>' +
        W.glow(960, 500, 700, '#FFC86B', 0.35) + F.who('lo-ft', 'ft', { face: 0 }) + P.map(([x, y], i) => F.eyes('lo-e' + i, x, y, 1.3)).join(''), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'lo-ft');
      Object.assign(this, { cam: q('.cam'), e: P.map((_, i) => q('.lo-e' + i)) });
      this.L = [[this.S, 1.0, 960, 540], [T(303), 1.35, 960, 430, 3.0]];
    },
    render(t) {
      const a = t + this.S, take = T(314);
      F.camL(this.cam, a, this.L, this.E);
      W.posePerson(this.m, { x: 960, y: 1100, s: 3.3, expr: a < take ? 'neutral' : 'worried', sq: W.take(a, take), lean: W.tremble(a, take, take + 0.5) * 0.4, blink: F.blink(a, 3.4), a1: -6, b1: 6 });
      this.e.forEach((el, i) => { const t0 = T(298) + i * 0.55; el.style.opacity = (seg(a, t0, t0 + 0.2) * (Math.abs(((a + i) % 3.1) - 1.5) < 0.06 ? 0.1 : 1)).toFixed(2); });
      F.fade(this.root, t, this.E - this.S, 0, 1.2);
    },
  });
})();
