// "The First Timer" — chapter 9: The Courage. Kit: ../wild-west-first-timer-2min/src/film-kit.js
// Marker = //@scene <id> <first word index of scripts_text/wild-west-ch09.txt>; render(a) gets absolute VO time; T(i) = word start.

//@scene t9 0
W.F.chapterTitle(kit, 't9', '9', 'The Courage', 1, 2);

//@scene map9 4
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'map9', {
    init(k) { const q = F.add(this, k, F.trailMap() + '<path class="m9-tr" d="M1060 1000 C1000 860 1100 740 1040 600 S1100 420 1180 330" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" style="fill:none;stroke:#C0503F;stroke-width:14;stroke-linecap:round"/>' +
      '<g class="m9-pin">' + W.info.pin(1180, 330) + F.cow(1300, 420, 0.4) + '</g>' + F.cow(1060, 1000, 0.45, true), F.label('Texas', 1100, 900, 64) + F.label('Western Trail', 640, 640, 60, 'm9-wt') + F.label('Dodge City', 1210, 250, 70, 'm9-dc') + F.label('Kansas', 1500, 520, 56), F.tag('1879', 90, 80, 'm9-y', 'font-size:84px;color:#B5503F'), { noVig: true });
      Object.assign(this, { tr: q('.m9-tr'), pin: q('.m9-pin'), wt: q('.m9-wt'), dc: q('.m9-dc'), y: q('.m9-y') }); },
    render(a) { F.framing(this.cam, 1 + 0.04 * seg(a, this.S, this.E), 1100, 560);
      W.pop(this.y, a, T(5), 'left'); this.tr.setAttribute('stroke-dashoffset', (100 * (1 - eio(seg(a, T(17), T(23))))).toFixed(1));
      W.pop(this.wt, a, T(20), 'left'); W.pop(this.pin, a, T(23)); W.pop(this.dc, a, T(23), 'left'); } }); })();

//@scene letter 25
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'letter', {
    init(k) { const farm = '<g transform="translate(0 40)">' + W.prop.house(-60, 60, 0.9, null, 3) + '<g transform="translate(110 70) scale(.45)">' + F.who('le-br', 'hand2', { hat: 'straw', facial: 'none', face: -0.3 }) + '</g></g>';
      const q = F.add(this, k, F.saloon(W.MOODS.prairieDust) + F.roundTable(800, 1000, 1.2) + F.chair(560, 1000, 1.1) + F.who('le-ft', 'ft', { face: 0.4 }) + '<g class="le-pp">' + F.letter(840, 840, 0.4, 0) + '</g>' + F.glass(960, 856, 0.8) +
        F.thought('le-b', 1420, 700, 420, 300, farm), F.label('Front Street', 560, 236, 46, 'le-fs'), F.label('Platte County, Missouri', 1110, 900, 52, 'le-pc'));
      this.m = W.bindPerson(k.stage, 'le-ft'); W.posePerson(W.bindPerson(k.stage, 'le-br'), { expr: 'happy', a1: -120 });
      Object.assign(this, { pp: q('.le-pp'), b: q('.le-b-in'), fs: q('.le-fs'), pc: q('.le-pc') }); },
    render(a) { const write = a > T(36); F.framing(this.cam, 1.1, 820, 620);
      W.posePerson(this.m, { x: 600, y: 1000, s: 1.6, legL: -80, legR: -80, expr: write ? 'neutral' : 'sad', blink: F.blink(a, 3), a1: write ? -70 + 6 * Math.sin(a * 16) : -20, a2: -40, head: write ? 10 : 0 });
      W.pop(this.fs, a, T(33), 'left'); W.pop(this.pp, a, T(37)); W.pop(this.b, a, T(41)); W.pop(this.pc, a, T(44), 'left'); } }); })();

//@scene bible 47
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'bible', {
    init(k) { const hands = [0, 1, 2].map((i) => '<g class="bi-h' + i + '"><g transform="translate(' + (520 + i * 440) + ' 980) scale(1.1)">' + W.person('bi-p' + i, { outfit: ['peasant', 'suit', 'tunic'][i], hair: ['bun', 'short', 'short'][i], hairColor: ['grey', 'brown', 'blond'][i], age: ['old', 'adult', 'adult'][i], face: 0.3 }) + '</g></g>').join('');
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + hands + '<g class="bi-bk">' + F.bible('', 0, 0, 0.6) + '</g>' + '<g class="bi-lt">' + F.letter(0, 0, 0.35, 10) + '</g>' + F.box('bi-bx', 1560, 1000, 1.0),
        '', F.label('~100 years', 120, 70, 90, 'bi-cy', 'color:#B5503F') + F.label('Joplin', 1420, 620, 72, 'bi-jo'), { noVig: true });
      [0, 1, 2].forEach((i) => W.posePerson(W.bindPerson(k.stage, 'bi-p' + i), { expr: 'neutral', a1: -70, a2: -20 }));
      Object.assign(this, { bk: q('.bi-bk'), lt: q('.bi-lt'), bx: q('.bi-bx'), cy: q('.bi-cy'), jo: q('.bi-jo'), h: [0, 1, 2].map((i) => q('.bi-h' + i)) }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      W.pop(this.cy, a, T(54), 'left');
      const into = eio(seg(a, T(58), T(59) + 0.4)); this.lt.setAttribute('transform', 'translate(' + lerp(960, 960, into) + ' ' + lerp(300, 560, into) + ')'); this.lt.style.opacity = a > T(57) && into < 1 ? 1 : 0;
      this.h.forEach((el, i) => W.pop(el, a, T(65) + i * 0.4, 'bottom'));
      const hop = seg(a, T(65), T(68) + 0.4), drop = eio(seg(a, T(70), T(72)));
      const bx = hop < 1 ? lerp(580, 1460, hop) : lerp(1460, 1560, drop), by = hop < 1 ? 700 - 40 * Math.abs(Math.sin(hop * Math.PI * 3)) : lerp(700, 860, drop);
      this.bk.setAttribute('transform', a < T(65) ? 'translate(960 560)' : 'translate(' + bx.toFixed(1) + ' ' + by.toFixed(1) + ')');
      W.pop(this.bx, a, T(72), 'bottom'); W.pop(this.jo, a, T(76), 'left'); } }); })();

//@scene hours 78
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'hours', {
    init(k) { let shame = ''; for (let i = 0; i < 6; i++) shame += '<g class="ho-s"><path d="M-40 -40 H40 V40 H-40 Z" ' + F.st('#4A3A4E', 4) + '/></g>';
      const q = F.add(this, k, F.saloon(W.MOODS.prairieDust) + F.clock(1500, 150, 70, 'ho-clk') + F.roundTable(900, 1000, 1.2) + F.who('ho-ft', 'ft', { face: 0.35 }) + '<g class="ho-gl">' + F.glass(1000, 856, 0.9) + '</g>' +
        '<g class="ho-mini"><g transform="translate(560 420) scale(.5)">' + F.who('ho-a', 'ft', { face: 0.3, hat: 'none' }) + '</g><g transform="translate(940 420) scale(.5)">' + F.who('ho-b', 'ft', { face: -0.3, hat: 'none' }) + '</g></g>' + shame);
      this.m = W.bindPerson(k.stage, 'ho-ft'); this.A = W.bindPerson(k.stage, 'ho-a'); this.B = W.bindPerson(k.stage, 'ho-b');
      Object.assign(this, { gl: q('.ho-gl'), mini: q('.ho-mini'), s: [...k.stage.querySelectorAll('.ho-s')] }); },
    render(a) { F.framing(this.cam, 1.05, 900, 600); F.spinClock(this.root, 'ho-clk', a, T(91), T(94) + 0.5, 4);
      W.pop(this.mini, a, T(96)); this.mini.style.opacity = a > T(96) && a < T(98) + 0.2 ? 1 : 0;
      const arg = (Math.floor(a * 8) % 2 ? 'talk' : 'angry'); W.posePerson(this.A, { expr: arg, a1: -90 }); W.posePerson(this.B, { expr: Math.floor(a * 8) % 2 ? 'angry' : 'talk', b1: 90 });
      W.pop(this.gl, a, T(99), 'bottom');
      const pile = [[700, 380], [780, 380], [860, 380], [740, 300], [820, 300], [780, 220]];
      this.s.forEach((el, i) => { const t0 = T(104) + i * 0.3, p = eo(seg(a, t0, t0 + 0.5)), sx = [200, 1700, 300, 1600, 900, 1100][i], sy = [100, 200, 900, 900, -100, -100][i];
        el.setAttribute('transform', 'translate(' + lerp(sx, pile[i][0], p).toFixed(1) + ' ' + lerp(sy, pile[i][1], p).toFixed(1) + ')'); el.style.opacity = a > t0 ? 1 : 0; });
      W.posePerson(this.m, { x: 760, y: 1000, s: 1.6, legL: -80, legR: -80, expr: a > T(101) ? 'sad' : 'worried', blink: F.blink(a, 3), head: a > T(101) ? 12 : 0, a1: a > T(99) && a < T(101) ? -80 : -20, a2: -40 }); } }); })();

//@scene vocab 114
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'vocab', {
    init(k) { let lines = ''; for (let i = 0; i < 6; i++) lines += '<g class="vo-l"><path d="M-240 ' + (-180 + i * 70) + ' q60 -16 120 0 t120 0 t120 0 t100 0" ' + F.ln('rgba(42,37,34,.6)', 6) + '/>' + (i % 2 ? '<path d="M-250 ' + (-185 + i * 70) + ' H230" ' + F.ln('#2A2522', 8) + '/>' : '') + '</g>';
      const dict = '<g class="vo-d"><path d="M-300 -220 Q-150 -260 0 -220 Q150 -260 300 -220 V200 Q150 160 0 200 Q-150 160 -300 200 Z" ' + F.st('#FFFDF4', 6) + '/><path d="M0 -220 V200" ' + F.ln(F.INK, 5) + '/></g>';
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + '<g class="vo-p" transform="translate(560 560)"><rect x="-300" y="-320" width="600" height="640" ' + F.st('#F7F1DC', 5) + '/>' + lines + '</g>' + '<g transform="translate(1400 600)">' + dict + '</g>' +
        '<g transform="translate(1400 600)"><g class="vo-q">' + F.qmark('') + '</g></g>', '', F.label('Loneliness', 1240, 260, 76, 'vo-w'), { noVig: true });
      Object.assign(this, { l: [...k.stage.querySelectorAll('.vo-l')], d: q('.vo-d'), qm: q('.vo-q'), w: q('.vo-w') }); },
    render(a) { F.framing(this.cam, 1 + 0.03 * seg(a, this.S, this.E), 960, 560);
      this.l.forEach((el, i) => (el.style.opacity = seg(a, this.S + 0.2 + i * 0.4, this.S + 0.5 + i * 0.4).toFixed(2)));
      W.pop(this.d, a, T(138)); W.pop(this.w, a, T(141), 'left'); W.pop(this.qm, a, T(141) + 0.4); } }); })();

//@scene war 153
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'war', {
    init(k) { const q = F.add(this, k, '<rect width="1920" height="1080" style="fill:#3B2A2A"/>' + W.glow(960, 560, 600, '#FFC86B', 0.2) + F.who('wa-ft', 'ft', { face: 0 }) +
      '<g class="wa-in"><circle cx="960" cy="830" r="10" style="fill:#F08A7E"/><path class="wa-l" d="M900 830 L860 830" ' + F.ln('#F3DDB0', 8) + '/><path class="wa-r" d="M1020 830 L1060 830" ' + F.ln('#F08A7E', 8) + '/></g>');
      this.m = W.bindPerson(k.stage, 'wa-ft'); this.inn = q('.wa-in'); },
    render(a) { F.framing(this.cam, lerp(1, 1.6, eio(seg(a, T(155), T(159)))), 960, 700);
      this.inn.style.opacity = seg(a, T(156), T(157)).toFixed(2); this.inn.setAttribute('transform', 'translate(' + (6 * Math.sin(a * 14)).toFixed(1) + ' 0)');
      W.posePerson(this.m, { x: 960, y: 1080, s: 2.8, expr: 'worried', blink: F.blink(a, 3), head: 2 * Math.sin(a * 5) }); } }); })();

//@scene church 160
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'church', {
    init(k) { const M = W.MOODS.fieldSpring; const fire = '<g class="ch-f"><path d="M-80 0 Q-90 -80 -40 -120 Q-30 -60 0 -150 Q30 -60 50 -110 Q100 -60 80 0 Z" ' + F.st('#F08A7E', 5) + '/></g>';
      const q = F.add(this, k, W.bg.field(M) + W.prop.church(1340, 700, 1.0, W.MOODS.stonePale) + W.prop.house(380, 700, 1.1, M, 5) + F.chalkboard(820, 1020, 0.9) + '<g transform="translate(820 670)">' + fire + '</g>' +
        F.who('ch-pr', 'baron', { hat: 'none', outfit: 'suit', facial: 'longbeard', hairColor: 'grey', face: 0.3, item: 'book' }) + F.who('ch-kid', 'ft', { age: 'child', hat: 'none', hair: 'short', face: -0.3 }),
        F.label('Methodist', 1200, 330, 60, 'ch-me') + F.label('Rural Missouri', 220, 470, 56, 'ch-mo'));
      this.P = W.bindPerson(k.stage, 'ch-pr'); this.K = W.bindPerson(k.stage, 'ch-kid'); Object.assign(this, { f: q('.ch-f'), me: q('.ch-me'), mo: q('.ch-mo') }); },
    render(a) { F.framing(this.cam, 1.0 + 0.03 * seg(a, this.S, this.E), 960, 600);
      W.pop(this.me, a, T(165), 'left'); W.pop(this.mo, a, T(168), 'left'); W.pop(this.f, a, T(177), 'bottom'); if (a > T(177)) this.f.style.transform += ' scale(' + (1 + 0.06 * Math.sin(a * 12)).toFixed(3) + ')';
      const pt = seg(a, T(175), T(176));
      W.posePerson(this.P, { x: 560, y: 1000, s: 1.4, expr: F.talk(a, [[T(170), T(184)]]) || 'angry', blink: F.blink(a, 3), a1: lerp(-10, -110, pt), a2: lerp(-6, 10, pt) });
      W.posePerson(this.K, { x: 1060, y: 1010, s: 1.4, expr: a > T(177) ? 'surprised' : 'worried', sq: W.take(a, T(177)), blink: F.blink(a, 2.6) }); } }); })();

//@scene voice 184
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'voice', {
    init(k) { const bub = '<g class="vc-b"><g class="vc-bi"><rect x="-120" y="-80" width="240" height="160" rx="60" ' + F.st('#FFFDF4', 5) + '/><path d="M-40 70 L-70 120 L0 76" ' + F.st('#FFFDF4', 5) + '/>' + W.prop.church(30, 50, 0.32, W.MOODS.stonePale) + '</g></g>';
      const drum = '<g class="vc-d"><g class="vc-di"><path d="M0 40 L-110 -50 Q-150 -120 -90 -150 Q-30 -170 0 -110 Q30 -170 90 -150 Q150 -120 110 -50 Z" ' + F.st('#F08A7E', 6) + '/></g></g>';
      const q = F.add(this, k, F.trailMap() + '<path d="M1060 1000 C1000 860 1100 740 1040 600 S1100 420 1180 330" style="fill:none;stroke:#C0503F;stroke-width:14;stroke-linecap:round"/>' + '<g class="vc-rider">' + F.horse(0, 0, 0.35) + '<g transform="translate(0 -110) scale(.35)">' + F.who('vc-ft', 'ft') + '</g></g>' + bub + drum,
        F.label('2,000 miles', 1240, 760, 76, 'vc-mi', 'color:#B5503F'), '', { noVig: true });
      W.posePerson(W.bindPerson(k.stage, 'vc-ft'), { expr: 'neutral', legL: -40, legR: 40 });
      Object.assign(this, { r: q('.vc-rider'), b: q('.vc-b'), bi: q('.vc-bi'), d: q('.vc-d'), di: q('.vc-di'), mi: q('.vc-mi') }); },
    render(a) { F.framing(this.cam, 1, 1000, 560);
      const p = eio(seg(a, this.S, T(194))), pts = [[1060, 1000], [1040, 600], [1180, 330]], P = p < 0.5 ? [lerp(1060, 1040, p * 2), lerp(1000, 600, p * 2)] : [lerp(1040, 1180, p * 2 - 1), lerp(600, 330, p * 2 - 1)];
      this.r.setAttribute('transform', 'translate(' + P[0].toFixed(1) + ' ' + P[1].toFixed(1) + ')'); W.pop(this.mi, a, T(184) + 0.2, 'left');
      this.b.setAttribute('transform', 'translate(' + (P[0] - 260).toFixed(1) + ' ' + (P[1] - 220).toFixed(1) + ')');
      const quiet = eio(seg(a, T(197), T(206))); this.bi.setAttribute('transform', 'scale(' + (1 - 0.6 * quiet).toFixed(3) + ')');
      W.pop(this.d, a, T(209)); const beat = 1 + 0.12 * Math.abs(Math.sin(a * 6)); this.d.setAttribute('transform', 'translate(' + (P[0] + 260).toFixed(1) + ' ' + (P[1] - 200).toFixed(1) + ')'); this.di.setAttribute('transform', 'scale(' + (beat * (1 + 0.6 * seg(a, T(210), T(215)))).toFixed(3) + ')'); } }); })();

//@scene nights 216
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'nights', {
    init(k) { let herd = ''; for (let i = 0; i < 7; i++) herd += F.cow(1100 + i * 120, 760 + (i % 2) * 40, 0.4, i % 2, true);
      const blanket = (x) => '<rect x="' + (x - 140) + '" y="930" width="280" height="60" rx="26" ' + F.st('#7A8C6A', 5) + '/>';
      const q = F.add(this, k, F.nightSky(12) + herd + blanket(400) + blanket(780) + '<g class="ni-dust">' + W.info.blob(1400, 880, 140, '#C9A27A', 3) + '</g>' +
        '<g transform="translate(400 970)"><circle cx="-110" cy="-20" r="44" ' + F.st('#FFFFFF', 4) + '/><path d="M-140 -26 q10 6 20 0 M-100 -26 q10 6 20 0" ' + F.ln(F.INK, 3) + '/></g><g transform="translate(780 970)"><circle cx="-110" cy="-20" r="44" ' + F.st('#FFFFFF', 4) + '/><path d="M-140 -26 q10 6 20 0 M-100 -26 q10 6 20 0" ' + F.ln(F.INK, 3) + '/></g>' +
        '<g transform="translate(1180 970)"><rect x="-140" y="-40" width="280" height="60" rx="26" ' + F.st('#8C6440', 5) + '/><circle cx="-110" cy="-50" r="46" ' + F.st('#FFFFFF', 4) + '/><ellipse cx="-122" cy="-56" rx="4" ry="7" style="fill:#2A2522"/><ellipse cx="-98" cy="-56" rx="4" ry="7" style="fill:#2A2522"/></g>' +
        '<g class="ni-z">' + [0, 1, 2].map((i) => '<path d="M' + (300 + i * 30) + ' ' + (880 - i * 40) + ' h24 l-24 24 h24" ' + F.ln('#F4EFD8', 5) + '/>').join('') + '</g>', '', F.tag('11 weeks', 90, 80, 'ni-11', 'font-size:72px;color:#B5503F'));
      Object.assign(this, { e11: q('.ni-11'), dust: q('.ni-dust'), z: q('.ni-z') }); },
    render(a) { F.framing(this.cam, lerp(1.0, 1.5, eio(seg(a, T(238), T(244)))), lerp(960, 1080, eio(seg(a, T(238), T(244)))), 820);
      W.pop(this.e11, a, T(222), 'left'); this.dust.style.opacity = a > T(225) && a < T(228) ? 0.5 : 0; this.z.style.opacity = (0.5 + 0.5 * Math.sin(a * 3)).toFixed(2); } }); })();

//@scene clergy 245
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'clergy', {
    init(k) { const booth = '<g class="cl-b"><rect x="-90" y="-260" width="180" height="260" ' + F.st('#6B4A2E', 5) + '/><rect x="-60" y="-220" width="120" height="120" ' + F.st('#3E2A22', 4) + '/><path d="M-60 -160 H60 M0 -220 V-100" ' + F.ln('#C79A3A', 4) + '/></g>';
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + '<circle class="cl-r" cx="700" cy="560" r="380" style="fill:rgba(240,138,126,.12);stroke:#F08A7E;stroke-width:8;stroke-dasharray:24 18"/>' + '<g transform="translate(700 560) scale(.4)">' + F.who('cl-ft', 'ft') + '</g>' +
        W.prop.church(1240, 260, 0.35, W.MOODS.stonePale) + W.prop.church(160, 1040, 0.3, W.MOODS.stonePale) +
        '<g transform="translate(1400 700)">' + booth + '<g class="cl-x1">' + F.coralX('', 1.2) + '</g></g><g transform="translate(1700 700) scale(.9)"><g class="cl-p">' + F.who('cl-pr', 'baron', { hat: 'none', facial: 'longbeard', hairColor: 'grey', item: 'book', face: -0.3 }) + '</g><g class="cl-x2" transform="translate(0 -150)">' + F.coralX('', 1.2) + '</g></g>',
        F.label('200 miles', 520, 220, 72, 'cl-mi', 'color:#B5503F'), '', { noVig: true });
      W.posePerson(W.bindPerson(k.stage, 'cl-ft'), { expr: 'sad' }); W.posePerson(W.bindPerson(k.stage, 'cl-pr'), { expr: 'neutral', a1: -60 });
      Object.assign(this, { r: q('.cl-r'), mi: q('.cl-mi'), b: q('.cl-b'), x1: q('.cl-x1'), p: q('.cl-p'), x2: q('.cl-x2') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      W.pop(this.r, a, T(250)); W.pop(this.mi, a, T(251), 'left');
      W.pop(this.b, a, T(259), 'bottom'); W.pop(this.x1, a, T(259) + 0.35); W.pop(this.p, a, T(261), 'bottom'); W.pop(this.x2, a, T(261) + 0.35); } }); })();

//@scene ceasefire 262
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'ceasefire', {
    init(k) { const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + '<path class="ce-rope" d="M420 700 H1500" ' + F.ln('#C9A27A', 18) + '/>' + F.who('ce-g', 'baron', { hat: 'none', facial: 'longbeard', hairColor: 'grey', item: 'book', face: 0.3 }) + F.who('ce-n', 'ft', { face: -0.35 }) +
      '<g class="ce-ic1">' + W.prop.church(330, 520, 0.3, W.MOODS.stonePale) + '</g><g class="ce-ic2">' + F.heart('', 1600, 480, 0.5) + '</g><g class="ce-bt">' + F.bottle(960, 700, 1.1) + '</g>' + F.clock(960, 260, 80, 'ce-clk'), '', '', { noVig: true });
      this.G = W.bindPerson(k.stage, 'ce-g'); this.N = W.bindPerson(k.stage, 'ce-n'); Object.assign(this, { bt: q('.ce-bt'), rope: q('.ce-rope'), ic1: q('.ce-ic1'), ic2: q('.ce-ic2'), clk: q('.ce-clk-h') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      const calm = seg(a, T(281), T(283)) * (1 - seg(a, T(292), T(293) + 0.3)), pull = 1 - calm, wob = 8 * Math.sin(a * 10) * pull;
      W.pop(this.ic1, a, T(267)); W.pop(this.ic2, a, T(270)); W.pop(this.bt, a, T(272), 'bottom');
      this.rope.setAttribute('d', 'M420 700 Q960 ' + (700 + 60 * calm) + ' 1500 700');
      F.spinClock(this.root, 'ce-clk', a, T(291), T(293) + 0.3, 1);
      W.posePerson(this.G, { x: 380 + wob, y: 1000, s: 1.5, lean: -14 * pull, expr: calm > 0.5 ? 'sleep' : 'angry', blink: F.blink(a, 3), a1: -70, a2: -20 });
      W.posePerson(this.N, { x: 1540 + wob, y: 1000, s: 1.5, lean: 14 * pull, expr: calm > 0.5 ? 'sleep' : 'worried', blink: F.blink(a, 3.3), b1: 70, b2: 20 }); } }); })();

//@scene human 294
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'human', {
    init(k) { const weight = (x) => '<g transform="translate(' + x + ' 300)"><path d="M-70 60 L-50 -40 H50 L70 60 Z" ' + F.st('#4A3A4E', 5) + '/><path d="M-20 -40 Q0 -80 20 -40" ' + F.ln(F.INK, 8) + '/></g>';
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + F.who('hu-ft', 'ft', { face: 0.3 }) + W.person('hu-mo', { outfit: 'tunic', color: '#4E6E8C', shade: '#3E5A75', hair: 'short', hairColor: 'black', face: -0.3 }) +
        '<path class="hu-tl" d="M520 820 H1400" ' + F.ln(F.INK, 8) + '/><g class="hu-bk"><g transform="translate(960 560)">' + F.book('hu-b', 0, 0, 0.25) + '</g></g>' + '<g class="hu-w">' + weight(520) + weight(1400) + '</g>',
        F.label('1879', 440, 860, 64, 'hu-a') + F.label('Today', 1330, 860, 64, 'hu-b2') + F.label('150 years', 820, 740, 64, 'hu-150', 'color:#B5503F'), '', { noVig: true });
      this.A = W.bindPerson(k.stage, 'hu-ft'); this.B = W.bindPerson(k.stage, 'hu-mo');
      Object.assign(this, { tl: q('.hu-tl'), lab: [q('.hu-a'), q('.hu-b2'), q('.hu-150')], bk: q('.hu-bk'), w: q('.hu-w') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      W.posePerson(this.A, { x: 520, y: 760, s: 1.3, expr: 'worried', blink: F.blink(a, 3) }); W.posePerson(this.B, { x: 1400, y: 760, s: 1.3, expr: 'worried', blink: F.blink(a, 3.2, 1) });
      F.show(this.B.root.parentNode, a > T(306));
      this.lab.forEach((el, i) => W.pop(el, a, T(318) + i * 0.3, 'left')); this.tl.style.opacity = a > T(318) ? 1 : 0;
      W.pop(this.bk, a, T(325)); this.bk.firstChild.setAttribute('transform', 'translate(960 560) scale(' + lerp(1, 2.2, eo(seg(a, T(326), T(327) + 0.3))).toFixed(3) + ' 1)');
      W.pop(this.w, a, T(329)); } }); })();

//@scene ritual 332
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'ritual', {
    init(k) { const q = F.add(this, k, F.saloon(W.MOODS.prairieDust, { window: false }) + F.roundTable(900, 1000, 1.1) + F.batwing('ri-bw', 210, 760, 1.4) + '<g class="ri-gl">' + F.glass(980, 868, 0.8) + '</g>' + F.who('ri-ft', 'ft', { hat: 'none' }) + F.who('ri-ft2', 'ft') +
      '<g class="ri-hat">' + F.hatIcon(1060, 868, 0.6) + '</g><g class="ri-rw" style="opacity:0"><path d="M1200 300 A90 90 0 1 0 1290 390" ' + F.ln('#F08A7E', 14) + '/><path d="M1290 360 L1290 400 L1250 390" ' + F.st('#F08A7E', 4) + '/></g>',
      '', [1, 2, 3, 4].map((n, i) => F.label(String(n), 1500 + i * 90, 80, 90, 'ri-n' + i, 'color:#B5503F')).join(''));
      this.m = W.bindPerson(k.stage, 'ri-ft'); this.m2 = W.bindPerson(k.stage, 'ri-ft2'); Object.assign(this, { gl: q('.ri-gl'), hat: q('.ri-hat'), rw: q('.ri-rw'), n: [0, 1, 2, 3].map((i) => q('.ri-n' + i)) });
      this.hero = k.stage.querySelector('.ri-ft'); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      const drink = seg(a, T(336), T(338) + 0.3), stand = eio(seg(a, T(339), T(340) + 0.3)), hat = seg(a, T(343), T(345)), walk = eio(seg(a, T(347), T(351))), back = eio(seg(a, T(357), T(361)));
      this.gl.style.opacity = drink < 1 ? 1 : 0; this.hat.style.opacity = hat < 0.5 ? 1 : 0;
      [T(336), T(339), T(343), T(347)].forEach((t0, i) => W.pop(this.n[i], a, t0, 'left'));
      this.rw.style.opacity = a > T(357) && a < T(361) + 0.5 ? 1 : 0;
      const x = lerp(lerp(780, 380, walk), 700, back);
      F.poseBatwing(this.root, 'ri-bw', seg(a, T(350), T(351)) * (1 - back));
      if (hat >= 0.5 && !this.hatOn) { this.hatOn = true; }
      const P = Object.assign({ x, y: 1000, s: 1.6, flip: walk > 0 && back < 0.5, legL: -80 * (1 - stand), legR: -80 * (1 - stand), expr: back > 0 ? 'worried' : 'neutral', blink: F.blink(a, 3),
        a1: drink > 0 && drink < 1 ? -150 : hat > 0 && hat < 1 ? -160 : -10, a2: drink > 0 && drink < 1 ? -10 : -6 }, (walk > 0 && walk < 1) || (back > 0 && back < 1) ? W.walk(a) : {});
      W.posePerson(this.m, P); W.posePerson(this.m2, P); F.show(this.m.root.parentNode, hat < 0.5); F.show(this.m2.root.parentNode, hat >= 0.5); } }); })();

//@scene older 362
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'older', {
    init(k) { const q = F.add(this, k, F.saloon(W.MOODS.prairieDust, { window: false }) + F.roundTable(1000, 1000, 1.1) + F.batwing('ol-bw', 210, 760, 1.4) + F.who('ol-a', 'hand2', { face: -0.3 }) + F.who('ol-b', 'hand3', { face: -0.3 }) + F.who('ol-ft', 'ft', { face: -0.35 }) +
      '<g class="ol-cur" style="opacity:0">' + [0, 1, 2].map((i) => '<path d="M' + (1500 - i * 40) + ' ' + (1010 + i * 20) + ' q-80 -20 -160 0 t-160 0 t-160 0" ' + F.ln('#9ED3EE', 10) + '/>').join('') + '</g>');
      this.A = W.bindPerson(k.stage, 'ol-a'); this.B = W.bindPerson(k.stage, 'ol-b'); this.H = W.bindPerson(k.stage, 'ol-ft'); this.cur = q('.ol-cur'); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      const la = eio(seg(a, T(371), T(375))), lb = eio(seg(a, T(372), T(376))), drift = eio(seg(a, T(392), T(397) + 0.5));
      W.posePerson(this.A, Object.assign({ x: lerp(900, 120, la), y: 1000, s: 1.55, expr: 'neutral', blink: F.blink(a, 3), legL: la > 0 ? 0 : -80, legR: la > 0 ? 0 : -80 }, la > 0 && la < 1 ? W.walk(a) : {}));
      W.posePerson(this.B, Object.assign({ x: lerp(1120, 120, lb), y: 1000, s: 1.55, expr: 'smug', blink: F.blink(a, 3.3, 1), legL: lb > 0 ? 0 : -80, legR: lb > 0 ? 0 : -80 }, lb > 0 && lb < 1 ? W.walk(a) : {}));
      F.poseBatwing(this.root, 'ol-bw', Math.max(Math.sin(Math.PI * seg(a, T(374), T(375) + 0.4)), Math.sin(Math.PI * seg(a, T(375), T(376) + 0.4))));
      this.cur.style.opacity = seg(a, T(392), T(393)).toFixed(2); this.cur.setAttribute('transform', 'translate(' + (-((a * 80) % 160)).toFixed(1) + ' 0)');
      W.posePerson(this.H, { x: lerp(1500, 1100, drift), y: 1000, s: 1.55, expr: a > T(380) ? 'worried' : 'neutral', blink: F.blink(a, 2.9, 2), lean: -6 * drift }); } }); })();

//@scene seed 398
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'seed', {
    init(k) { const roots = '<g class="se-ro">' + [[-30, 60], [0, 80], [30, 60], [-60, 40], [60, 40]].map(([x, y]) => '<path d="M0 0 Q' + (x / 2) + ' ' + (y / 2) + ' ' + x + ' ' + y + '" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" ' + F.ln('#7A5236', 6) + '/>').join('') + '</g>';
      const q = F.add(this, k, '<rect width="1920" height="1080" style="fill:#6B4A33"/>' + W.glow(960, 360, 700, '#FFD27A', 0.3) + F.bunk(330, 1000, 1.4) + F.who('se-a', 'hand3', { face: 0.35 }) + F.who('se-ft', 'ft', { face: -0.35 }) +
        '<g class="se-b1">' + F.thought('', 760, 380, 160, 120, '<g transform="translate(0 30) scale(.7)">' + F.hatIcon(0, 0, 0.6) + '</g>') + '</g><g class="se-b2">' + F.thought('', 980, 300, 160, 120, W.prop.house(0, 40, 0.4, null, 2)) + '</g><g class="se-b3">' + F.thought('', 1200, 380, 180, 120, '<path d="M-60 20 H60 M-60 -10 H60" ' + F.ln(F.INK, 6) + '/>') + '</g>' +
        '<g class="se-sd"><g transform="translate(1340 520)">' + '<ellipse rx="14" ry="20" ' + F.st('#E3B341', 4) + '/></g></g>' + '<g transform="translate(1340 560)">' + roots + '</g>', '', F.label('No. 12', 1460, 300, 70, 'se-ad', 'color:#B5503F'));
      this.A = W.bindPerson(k.stage, 'se-a'); this.H = W.bindPerson(k.stage, 'se-ft');
      Object.assign(this, { b: [q('.se-b1'), q('.se-b2'), q('.se-b3')], ro: [...k.stage.querySelectorAll('.se-ro path')], ad: q('.se-ad') }); },
    render(a) { F.framing(this.cam, 1, 960, 600);
      W.posePerson(this.A, { x: 620, y: 1000, s: 1.5, expr: F.talk(a, [[T(411), T(418)]]) || 'smug', blink: F.blink(a, 3), a1: -60 });
      W.posePerson(this.H, { x: 1340, y: 1000, s: 1.5, expr: a > T(430) ? 'worried' : 'neutral', blink: F.blink(a, 3.1, 1) });
      [T(413), T(416), T(418)].forEach((t0, i) => { W.pop(this.b[i], a, t0); if (a > T(421)) this.b[i].style.opacity = 1 - seg(a, T(421), T(422)); });
      this.ro.forEach((el, i) => el.setAttribute('stroke-dashoffset', (100 * (1 - eo(seg(a, T(430) + i * 0.15, T(431) + 0.6 + i * 0.15)))).toFixed(1)));
      W.pop(this.ad, a, T(437), 'left'); } }); })();

//@scene dozen 439
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'dozen', {
    init(k) { const bub = '<g class="dz-v"><g class="dz-vi"><rect x="-110" y="-70" width="220" height="140" rx="50" ' + F.st('#FFFDF4', 5) + '/><path d="M60 60 L90 110 L20 66" ' + F.st('#FFFDF4', 5) + '/>' + W.prop.church(30, 40, 0.28, W.MOODS.stonePale) + '</g></g>';
      const q = F.add(this, k, F.saloon(W.MOODS.prairieDust, { window: false, door: false }) + F.roundTable(1100, 1000, 1.1) + F.chair(820, 1000, 1.1) + F.who('dz-ft', 'ft', { face: 0.35 }) + '<g transform="translate(560 330)">' + bub + '</g>' +
        '<g class="dz-z">' + [0, 1, 2].map((i) => '<path d="M' + (680 + i * 26) + ' ' + (230 - i * 34) + ' h20 l-20 20 h20" ' + F.ln(F.INK, 4) + '/>').join('') + '</g>', '', F.label('×1', 1520, 90, 120, 'dz-c', 'color:#B5503F'));
      this.m = W.bindPerson(k.stage, 'dz-ft'); Object.assign(this, { c: q('.dz-c'), v: q('.dz-v'), vi: q('.dz-vi'), z: q('.dz-z') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      const t0 = T(446), t1 = T(450) + 0.6, n = a < t0 ? 1 : Math.min(12, 1 + Math.floor(11 * seg(a, t0, t1)));
      this.c.textContent = '×' + n; W.pop(this.c, a, T(444), 'left');
      const ph = a > t0 && a < t1 ? (seg(a, t0, t1) * 11) % 1 : 0, up = Math.sin(Math.PI * ph);
      const vol = a < T(455) ? 0 : a < T(476) ? 1 : 1 - 0.75 * eio(seg(a, T(476), T(480)));
      W.pop(this.v, a, T(455)); this.vi.setAttribute('transform', 'scale(' + vol.toFixed(3) + ') rotate(' + (a > T(486) ? 18 * seg(a, T(486), T(488)) : 0).toFixed(1) + ')');
      this.z.style.opacity = a > T(487) ? 1 : 0;
      W.posePerson(this.m, { x: 860, y: 1000 - 60 * up, s: 1.6, legL: -80 * (1 - up), legR: -80 * (1 - up), expr: a > T(476) ? 'sad' : 'worried', blink: F.blink(a, 3) }); } }); })();

//@scene lonely9 490
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'lonely9', {
    init(k) { const page = (x, r, cls) => '<g class="' + cls + '"><g transform="translate(' + x + ' 560) rotate(' + r + ')"><rect x="-260" y="-340" width="520" height="680" ' + F.st('#F7F1DC', 5) + '/></g></g>';
      const words = Array.from({ length: 9 }, (_, i) => F.label('lonely', 560 + (i % 3) * 300 - 140, 300 + Math.floor(i / 3) * 170, 72 - (i % 2) * 10, 'lo-w lo-w' + i, 'transform:rotate(' + ((i % 3) - 1) * 4 + 'deg);color:#3E5A8C')).join('');
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + page(760, -4, 'lo-p1') + page(1160, 5, 'lo-p2'), words, '', { noVig: true });
      Object.assign(this, { p: [q('.lo-p1'), q('.lo-p2')], w: [...k.stage.querySelectorAll('.lo-w')] }); },
    render(a) { F.framing(this.cam, 1 + 0.04 * seg(a, this.S, this.E), 960, 560);
      this.p.forEach((el, i) => W.pop(el, a, T(491) + i * 0.3));
      this.w.forEach((el, i) => W.pop(el, a, T(517) + i * 0.22, 'left')); } }); })();

//@scene trail 527
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'trail', {
    init(k) { const M = W.MOODS.prairieDust; let fence = ''; for (let i = 0; i < 6; i++) fence += '<path d="M' + (1000 + i * 140) + ' 760 V640" ' + F.ln('#8C6440', 16) + '/>';
      let herd = ''; for (let i = 0; i < 5; i++) herd += F.cow(1100 + i * 150, 790 + (i % 2) * 30, 0.45, i % 2, false);
      const q = F.add(this, k, '<g class="tr-day"><rect width="1920" height="1080" style="fill:' + M.sky + '"/><rect y="720" width="1920" height="360" style="fill:' + M.floor + '"/>' + W.glow(1500, 160, 300, '#FFF6D8', 0.8) + '<g class="tr-d">' + W.info.blob(500, 760, 160, '#D9B48A', 7) + '</g><g class="tr-c">' + herd + '</g><g class="tr-f">' + fence + '</g></g>' +
        '<g class="tr-night" style="opacity:0">' + F.nightSky(4) + herd.replace(/#C9A27A/g, '#55627A') + '</g>' + F.who('tr-ft', 'ft', { face: 0.35 }) + '<g class="tr-hand"><circle cx="0" cy="0" r="22" ' + F.st('#FFFFFF', 4) + '/></g>');
      this.m = W.bindPerson(k.stage, 'tr-ft'); Object.assign(this, { day: q('.tr-day'), night: q('.tr-night'), d: q('.tr-d'), c: q('.tr-c'), f: q('.tr-f'), hand: q('.tr-hand') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      const reach = Math.sin(Math.PI * seg(a, T(532), T(538)));
      this.hand.setAttribute('transform', 'translate(' + (520 + 160 * reach).toFixed(1) + ' 760)'); this.hand.style.opacity = reach > 0.05 ? 1 : 0;
      W.pop(this.d, a, T(544)); W.pop(this.c, a, T(546), 'bottom'); W.pop(this.f, a, T(548), 'bottom');
      this.night.style.opacity = eio(seg(a, T(551), T(553))).toFixed(3);
      W.posePerson(this.m, { x: 380, y: 1000, s: 1.5, expr: a > T(551) ? 'sad' : 'neutral', blink: F.blink(a, 3), a1: lerp(-10, -80, reach), a2: lerp(-6, 0, reach) }); } }); })();

//@scene question 568
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'question', {
    init(k) { const M = W.MOODS.prairieDust; let letters = ''; for (let i = 0; i < 5; i++) letters += '<g class="qu-l">' + F.letter(0, 0, 0.35, 0) + '</g>';
      const q = F.add(this, k, '<rect width="1920" height="1080" style="fill:' + M.sky + '"/><rect y="760" width="1920" height="320" style="fill:' + M.floor + '"/><path d="M0 760 H1920" ' + F.ln(F.INK, 4) + '/>' +
        '<circle class="qu-hole" cx="1320" cy="420" r="110" style="fill:#2A2522;opacity:0"/>' + letters + '<g transform="translate(1320 430) scale(1.6)">' + F.qmark('qu-q') + '</g>' + '<g class="qu-bb"><rect x="1180" y="620" width="300" height="160" rx="60" ' + F.st('#FFFDF4', 5) + '/></g>' + W.person('qu-n', W.NARRATOR_WEST));
      this.m = W.bindPerson(k.stage, 'qu-n'); Object.assign(this, { l: [...k.stage.querySelectorAll('.qu-l')], qm: q('.qu-q'), hole: q('.qu-hole'), bb: q('.qu-bb') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      W.pop(this.qm, a, T(587)); this.qm.style.opacity = a > T(587) && a < T(592) ? 1 : 0;
      this.hole.style.opacity = seg(a, T(598), T(600)).toFixed(2);
      this.l.forEach((el, i) => { const ang = a * 0.9 + i * 1.256, r = 250; el.setAttribute('transform', 'translate(' + (1320 + r * Math.cos(ang)).toFixed(1) + ' ' + (420 + r * 0.6 * Math.sin(ang)).toFixed(1) + ')'); el.style.opacity = seg(a, T(592), T(593)).toFixed(2); });
      W.pop(this.bb, a, T(627));
      W.posePerson(this.m, { x: 520, y: 1000, s: 2.3, expr: F.talk(a, [[T(568), T(591)]]) || 'neutral', blink: F.blink(a, 2.8), head: 3 * Math.sin(a * 2), a1: a > T(627) ? -100 : -30, a2: -10 }); } }); })();

//@scene money 635
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'money', {
    init(k) { const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + '<rect x="960" y="0" width="960" height="1080" style="fill:#3B2A2A"/>' + F.who('mo-b', 'baron', { face: 0.3 }) + F.who('mo-c', 'ft', { face: -0.3 }) +
      '<g class="mo-bag"><path d="M-80 0 Q-110 -90 -40 -120 L-30 -150 H30 L40 -120 Q110 -90 80 0 Z" transform="translate(620 990) scale(1.2)" ' + F.st('#C2A27A') + '/></g><g class="mo-co">' + F.coins(1380, 990, 0.5) + '</g>', '', '', { noVig: true });
      this.B = W.bindPerson(k.stage, 'mo-b'); this.C = W.bindPerson(k.stage, 'mo-c'); Object.assign(this, { bag: q('.mo-bag'), co: q('.mo-co') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      W.posePerson(this.B, { x: 420, y: 1000, s: 1.7, expr: a > T(637) ? 'smug' : 'neutral', blink: F.blink(a, 3), a1: -20 });
      W.posePerson(this.C, { x: 1500, y: 1000, s: 1.7, expr: a > T(642) ? 'sad' : 'neutral', blink: F.blink(a, 3.2), head: a > T(642) ? 12 : 0 });
      W.pop(this.bag, a, T(645), 'bottom'); W.pop(this.co, a, T(646), 'bottom'); } }); })();

//@scene baron 647
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'baron', {
    init(k) { const M = W.MOODS.prairieDust; const sp = '<g class="ba-sp">' + [[-90, -330], [90, -350], [0, -420]].map(([x, y]) => '<path transform="translate(' + x + ' ' + y + ')" d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" style="fill:#FFE59A;stroke:#2A2522;stroke-width:3"/>').join('') + '</g>';
      const q = F.add(this, k, F.street(M) + F.redLamp(960, 470, 1.0) + F.who('ba-m', 'madam', { face: -0.3 }) + F.who('ba-b', 'baron', { face: 0.3 }) + '<g class="ba-spp">' + sp + '</g>', F.signs('ba'));
      this.Md = W.bindPerson(k.stage, 'ba-m'); this.B = W.bindPerson(k.stage, 'ba-b'); this.sp = q('.ba-spp'); this.spi = q('.ba-sp'); },
    render(a) { const walk = eio(seg(a, this.S, T(655))), tip = Math.sin(Math.PI * seg(a, T(659), T(662) + 0.3));
      F.framing(this.cam, 1.5, lerp(700, 940, walk), 560);
      const x = lerp(520, 880, walk);
      W.posePerson(this.Md, { x: 1010, y: 772, s: 1.0, expr: a > T(662) ? 'smug' : 'neutral', blink: F.blink(a, 3), flip: false, a1: -40 });
      W.posePerson(this.B, Object.assign({ x, y: 772, s: 1.05, expr: 'smug', blink: F.blink(a, 3.4), a1: lerp(-10, -165, tip), a2: lerp(-6, -10, tip) }, walk > 0 && walk < 1 ? W.walk(a) : {}));
      this.sp.setAttribute('transform', 'translate(' + x.toFixed(1) + ' 772)'); W.pop(this.spi, a, T(671)); } }); })();

//@scene alley 675
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'alley', {
    init(k) { const wall = (x, w, col) => '<rect x="' + x + '" y="0" width="' + w + '" height="900" style="fill:' + col + '"/>' + Array.from({ length: 14 }, (_, i) => '<path d="M' + x + ' ' + (i * 64) + ' H' + (x + w) + '" ' + F.ln('rgba(42,37,34,.3)', 4) + '/>').join('');
      const crib = '<g transform="translate(1600 900)"><path d="M-160 0 V-260 L0 -320 L160 -260 V0 Z" ' + F.st('#8C6C4F', 5) + '/><rect x="-50" y="-200" width="100" height="200" ' + F.st('#3B2A22', 4) + '/>' + F.redLamp(0, -230, 0.6) + '</g>';
      const q = F.add(this, k, '<rect width="1920" height="1080" style="fill:#2F3A4F"/>' + wall(0, 480, '#5A4A3A') + wall(1440, 480, '#4A3E33') + '<rect y="900" width="1920" height="180" style="fill:#3E3328"/><path d="M0 900 H1920" ' + F.ln(F.INK, 4) + '/>' + crib + W.prop.barrel(380, 920, 0.8) + F.who('al-ft', 'ft'),
        '', F.tag('$20 a month', 90, 80, 'al-t', 'font-size:72px;color:#B5503F'));
      this.m = W.bindPerson(k.stage, 'al-ft'); this.t = q('.al-t'); },
    render(a) { const w = eio(seg(a, T(680), T(690))), x = lerp(200, 1480, w), look = a > T(693) && a < T(700);
      F.framing(this.cam, 1.3, lerp(700, 1300, w), 640);
      W.pop(this.t, a, T(676), 'left');
      W.posePerson(this.m, Object.assign({ x, y: 960, s: 1.4, expr: look ? 'worried' : 'neutral', blink: F.blink(a, 3), flip: look && Math.floor(a * 2) % 2 === 0, lean: 8 }, w > 0 && w < 1 ? W.walk(a, 12) : {})); } }); })();

//@scene diner 701
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'diner', {
    init(k) { const halo = '<g class="di-h"><ellipse cx="560" cy="300" rx="120" ry="26" style="fill:none;stroke:#FFE59A;stroke-width:12"/></g>';
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + '<g class="di-l">' + F.diner(560, 980, 1.1) + '</g><g class="di-r">' + F.cart(1360, 980, 1.3) + '</g>' + '<path class="di-ln" d="M960 60 V1040" style="stroke:#2A2522;stroke-width:8;stroke-dasharray:30 20;opacity:0"/>' + halo + '<g class="di-c">' + F.cloud('', 1360, 330, 0.8) + '</g>',
        '', ['Same act', 'Same town', 'Same night'].map((t, i) => F.label(t, 760, 60 + i * 80, 64, 'di-s' + i)).join(''), { noVig: true });
      Object.assign(this, { l: q('.di-l'), r: q('.di-r'), ln: q('.di-ln'), h: q('.di-h'), c: q('.di-c'), s: [0, 1, 2].map((i) => q('.di-s' + i)) }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      W.pop(this.l, a, T(719), 'bottom'); W.pop(this.r, a, T(722), 'bottom');
      [T(728), T(730), T(732)].forEach((t0, i) => { W.pop(this.s[i], a, t0, 'left'); if (a > T(734)) this.s[i].style.opacity = 0; });
      this.ln.style.opacity = a > T(734) ? 1 : 0; W.pop(this.h, a, T(740)); W.pop(this.c, a, T(741)); } }); })();

//@scene dary 743
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'dary', {
    init(k) { const clip = '<g class="da-cl"><rect x="-150" y="-200" width="300" height="400" rx="12" ' + F.st('#8C5A3A', 5) + '/><rect x="-120" y="-160" width="240" height="340" ' + F.st('#FFFDF4', 4) + '/>' + [-110, -60, -10, 40, 90, 140].map((y) => '<path d="M-90 ' + y + ' H90" ' + F.ln('rgba(42,37,34,.5)', 6) + '/>').join('') + '</g>';
      const tx = 'M1000 340 L1500 340 L1520 640 L1260 760 L1060 640 Z';
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + '<g class="da-alone"><g transform="translate(560 980) scale(1.3)">' + F.who('da-ft', 'ft') + '</g><circle cx="560" cy="760" r="260" style="fill:none;stroke:#F08A7E;stroke-width:8;stroke-dasharray:20 16"/></g>' +
        '<g class="da-map">' + W.info.shadowed(tx) + W.info.pin(1200, 680) + W.info.pin(1180, 380) + '</g><g transform="translate(1660 820)">' + clip + '</g>', '',
        '<div class="da-card" style="position:absolute;left:470px;top:40px;width:980px;padding:22px 30px;background:#FFFDF4;border:4px solid #2A2522;border-radius:16px;box-shadow:8px 8px 0 rgba(42,37,34,.18);text-align:center"><p class="hand-label" style="position:static;font-size:72px">David Dary</p><p class="hand-label" style="position:static;font-size:46px">University of Kansas · 1981</p></div>' +
        F.label('11–14 weeks', 120, 360, 72, 'da-wk', 'color:#B5503F') + F.label('Fort Worth', 1150, 700, 46, 'da-fw') + F.label('Abilene', 1130, 300, 46, 'da-ab'), { noVig: true });
      W.posePerson(W.bindPerson(k.stage, 'da-ft'), { expr: 'sad' });
      Object.assign(this, { card: q('.da-card'), al: q('.da-alone'), map: q('.da-map'), cl: q('.da-cl'), wk: q('.da-wk'), fw: q('.da-fw'), ab: q('.da-ab') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      W.pop(this.card, a, T(743)); if (a > T(756)) this.card.style.opacity = 1 - seg(a, T(756), T(757));
      W.pop(this.wk, a, T(761), 'left'); W.pop(this.al, a, T(769)); W.pop(this.cl, a, T(776)); W.pop(this.map, a, T(779)); W.pop(this.fw, a, T(779), 'left'); W.pop(this.ab, a, T(782), 'left'); } }); })();

//@scene nightmare 793
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'nightmare', {
    init(k) { const q = F.add(this, k, '<rect width="1920" height="1080" style="fill:#2A2020"/><rect y="820" width="1920" height="260" style="fill:#1E1714"/>' + W.glow(1300, 500, 500, '#FFC86B', 0.25) + W.person('nm-n', W.NARRATOR_WEST) + F.who('nm-ft', 'ft', { face: -0.3 }) +
      '<g transform="translate(1300 520) scale(1.5)">' + F.coralX('nm-x', 1.2) + '</g>');
      this.N = W.bindPerson(k.stage, 'nm-n'); this.H = W.bindPerson(k.stage, 'nm-ft'); this.x = q('.nm-x'); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      const hero = a < T(816), col = eo(seg(a, T(818), T(819) + 0.4));
      W.posePerson(this.N, { x: 460, y: 1000, s: 2.2, expr: F.talk(a, [[T(793), T(799)]]) || 'neutral', blink: F.blink(a, 2.8), a1: -30 });
      W.posePerson(this.H, { x: 1300, y: 1000 + 80 * col, s: 1.9, expr: hero ? 'smug' : 'sad', blink: F.blink(a, 3), a1: hero ? -150 : -10, b1: hero ? 40 : 10, lean: 10 * col, head: 20 * col, legL: -50 * col, legR: -50 * col });
      W.pop(this.x, a, T(803)); this.x.style.opacity = a > T(803) && a < T(816) ? 1 : 0; } }); })();

//@scene runsout 820
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'runsout', {
    init(k) { const q = F.add(this, k, '<rect width="1920" height="1080" style="fill:#2A2020"/><rect y="820" width="1920" height="260" style="fill:#1E1714"/>' + '<rect x="1560" y="380" width="200" height="440" style="fill:#3B2A22"/>' + F.redLamp(1660, 340, 0.8) +
      '<g class="ru-cl">' + F.cloud('', 0, 0, 1.0) + '</g>' + F.who('ru-ft', 'ft', { face: 0.35 }) + '<g class="ru-bat">' + F.battery('ru-b', 520, 220, 0.8) + '</g>');
      this.m = W.bindPerson(k.stage, 'ru-ft'); Object.assign(this, { cl: q('.ru-cl'), bat: q('.ru-bat'), lv: q('.ru-b-lv') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      const pull = eio(seg(a, T(826), T(834))), x = lerp(500, 1200, pull);
      this.cl.setAttribute('transform', 'translate(' + (x + 260).toFixed(1) + ' ' + (360 + 10 * Math.sin(a * 2)).toFixed(1) + ')'); this.cl.style.opacity = seg(a, T(828), T(829)).toFixed(2);
      W.pop(this.bat, a, T(842)); const lv = 1 - eio(seg(a, T(849), T(858))); this.lv.setAttribute('width', (300 * lv).toFixed(1)); this.lv.style.fill = lv < 0.25 ? '#F08A7E' : '#7FB069';
      W.posePerson(this.m, Object.assign({ x, y: 1000, s: 1.7, expr: a > T(838) ? 'sad' : 'worried', blink: F.blink(a, 3), lean: 8 * pull }, pull > 0 && pull < 1 ? W.walk(a, 5) : {})); } }); })();

//@scene cover 859
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'cover', {
    init(k) { const party = F.bunting(-220, -150, 440) + F.trophy(-100, 60, 0.9) + '<g transform="translate(110 70) scale(.5)">' + F.chandelier(0, -80, 1) + '</g>';
      const q = F.add(this, k, '<g class="co-a"><rect width="1920" height="1080" style="fill:#6B4A33"/>' + F.thought('co-b', 960, 480, 620, 440, '<g class="co-p">' + party + '</g>') + '<g class="co-sheet" style="opacity:0"><path d="M640 300 Q960 240 1280 300 L1300 700 Q960 760 620 700 Z" ' + F.st('#E8DCC0', 6) + '/></g></g>' +
        '<g class="co-z" style="display:none">' + F.saloon(W.MOODS.prairieDust, { window: false }) + F.roundTable(960, 1000, 1.2) + F.chair(720, 1000, 1.1) + F.who('co-ft', 'ft', { face: 0.3 }) + '</g>');
      this.m = W.bindPerson(k.stage, 'co-ft'); Object.assign(this, { A: q('.co-a'), Z: q('.co-z'), b: q('.co-b-in'), sheet: q('.co-sheet') }); },
    render(a) { const sw = T(886);
      F.show(this.A, a < sw); F.show(this.Z, a >= sw);
      F.framing(this.cam, a < sw ? 1 : lerp(1.3, 1.9, eio(seg(a, sw, T(895)))), a < sw ? 960 : 800, a < sw ? 520 : 640);
      W.pop(this.b, a, this.S + 0.2); this.sheet.style.opacity = seg(a, T(879), T(880)).toFixed(2);
      const up = eio(seg(a, T(905), T(907) + 0.6));
      W.posePerson(this.m, { x: 760, y: 1000 - 20 * up, s: 1.6, legL: -80 * (1 - up), legR: -80 * (1 - up), head: lerp(18, 0, up), expr: 'sad', blink: F.blink(a, 3.4), a1: -60 * (1 - up), a2: -60 * (1 - up), b1: 30 * (1 - up), b2: 50 * (1 - up) }); } }); })();

//@scene broke 908
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'broke', {
    init(k) { let crowd = ''; for (let i = 0; i < 24; i++) crowd += '<g class="br-c"><g transform="translate(' + (200 + (i % 12) * 140) + ' ' + (560 + Math.floor(i / 12) * 220) + ') scale(.55)">' + F.who('br-p' + i, i % 3 ? 'ft' : 'hand2') + '</g></g>';
      const q = F.add(this, k, W.bg.paper(W.MOODS.infoPaper) + crowd + '<g class="br-sq"><rect x="760" y="380" width="400" height="320" rx="20" ' + F.st('#7A8C6A', 6) + '/>' + F.heart('br-h', 960, 560, 0.9) + '</g>', '', F.label('Tens of thousands', 600, 120, 80, 'br-t', 'color:#B5503F'), { noVig: true });
      for (let i = 0; i < 24; i++) W.posePerson(W.bindPerson(k.stage, 'br-p' + i), { expr: 'sad' });
      Object.assign(this, { c: [...k.stage.querySelectorAll('.br-c')], sq: q('.br-sq'), h: q('.br-h'), hL: q('.br-h-L'), hR: q('.br-h-R'), t: q('.br-t') }); },
    render(a) { F.framing(this.cam, 1, 960, 560);
      this.c.forEach((el, i) => { W.pop(el, a, T(915) + i * 0.06, 'bottom'); if (a > T(921)) el.style.opacity = 1 - seg(a, T(921), T(922)); });
      W.pop(this.t, a, T(916), 'left'); if (a > T(921)) this.t.style.opacity = 1 - seg(a, T(921), T(922));
      W.pop(this.sq, a, T(922)); const squeeze = eio(seg(a, T(926), T(934)));
      this.h.setAttribute('transform', 'translate(960 560) scale(' + (1 - 0.45 * squeeze).toFixed(3) + ' ' + (1 - 0.3 * squeeze).toFixed(3) + ') translate(-960 -560)');
      const cr = eo(seg(a, T(948), T(948) + 0.4));
      this.hL.setAttribute('transform', 'translate(' + (-30 * cr).toFixed(1) + ' ' + (10 * cr).toFixed(1) + ') rotate(' + (-14 * cr).toFixed(1) + ')'); this.hR.setAttribute('transform', 'translate(' + (30 * cr).toFixed(1) + ' ' + (10 * cr).toFixed(1) + ') rotate(' + (14 * cr).toFixed(1) + ')'); } }); })();

//@scene onedoor 949
(function () { const F = W.F, { seg, eio, eo, lerp } = F, T = F.T;
  F.scn(kit, 'onedoor', {
    init(k) { const M = W.MOODS.prairieDust;
      const night = '<rect class="od-n" width="1920" height="1080" style="fill:#1E2433;opacity:.62;mix-blend-mode:multiply"/>';
      const glowDoor = '<g class="od-g" style="opacity:0">' + W.glow(960, 640, 300, '#FFB86B', 0.9) + '<rect x="910" y="522" width="100" height="236" style="fill:#FFD58A"/></g>';
      const q = F.add(this, k, F.street(M) + night + glowDoor + F.redLamp(960, 470, 1.0) + F.who('od-ft', 'ft'), F.signs('od'));
      this.m = W.bindPerson(k.stage, 'od-ft'); Object.assign(this, { g: q('.od-g') }); },
    render(a) { const walk = eio(seg(a, T(976), T(980) + 0.5)), snap = T(1003);
      F.framing(this.cam, lerp(1.2, 1.7, eio(seg(a, T(966), T(972)))), lerp(960, 960, 0), lerp(560, 560, 0));
      this.g.style.opacity = seg(a, T(966), T(969)).toFixed(2);
      W.posePerson(this.m, Object.assign({ x: lerp(560, 880, walk), y: 772, s: 1.0, expr: a > snap ? 'sad' : 'neutral', blink: F.blink(a, 3), sq: W.take(a, snap) }, walk > 0 && walk < 1 ? W.walk(a) : {}));
      F.fade(this.root, a - this.S, this.E - this.S, 0, 1.5); } }); })();
