// All scenes of the typhus chapter. build.py splits this file at the //@scene markers into Motion modules.
// Every scene works in ABSOLUTE voiceover time: a = t + S (S = scene start), so event times match presets/timing/medieval-diseases-2min.json.

//@scene title 0 4.2
(function () {
  const S = 0, D = 4.2, { seg, eio, lerp, F } = { ...W.F, F: W.F };
  kit.scene('title', {
    init(kit) {
      const M = W.MOODS.hallSage;
      kit.stage.append(kit.h(F.frame(W.bg.stoneRoom(M, { seed: 4, floorY: 860 }) + W.prop.window(1650, 560, 1.1, M, true) + W.glow(1650, 380, 420, '#FFF6D8', 0.55) +
        '<ellipse cx="560" cy="996" rx="170" ry="18" style="fill:rgba(42,37,34,.14)"/>' + W.person('ti-n', W.NARRATOR),
        '', '<p class="hand-label big ti-num" style="left:1010px;top:170px;font-size:300px">#10</p>' + F.tag('Epidemic typhus', 930, 560, 'ti-tag', 'font-size:96px'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.m = W.bindPerson(kit.stage, 'ti-n');
      Object.assign(this, { cam: q('.cam'), num: q('.ti-num'), tag: q('.ti-tag') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, 0, D, 1.0, 1.05, 700, 600);
      const hit = W.eobk(seg(a, 0.9, 1.15), 1.6), back = eio(seg(a, 3.3, 3.8));
      const talk = F.talk(a, [[0.28, 1.2], [1.66, 3.6]]);
      W.posePerson(this.m, { x: 560, y: 990, s: 2.6, head: 3 * Math.sin(a * 2), sq: W.take(a, 1.94), expr: talk || 'smug', blink: F.blink(a, 2.7, 0.5),
        a1: lerp(lerp(-8, -100, hit), -10, back), a2: lerp(-6, 6, hit), b1: 8 + 1.5 * Math.sin(a * 2.1) });
      W.drop(this.num, a, 1.7, 1.94, 700);
      W.pop(this.tag, a, 2.7, 'left');
      F.fade(this.root, t, D, 0.3, 0);
    },
  });
})();

//@scene hall 4.2 5.2
(function () {
  const S = 4.2, D = 5.2, F = W.F, { seg, eio, lerp } = F;
  kit.scene('hall', {
    init(kit) {
      const M = W.MOODS.hospitalMint;
      kit.stage.append(kit.h(F.frame(W.bg.ward(M, { beds: false }) + W.prop.door(260, 900, 1.25, M) + '<g class="ha-board"><path d="M200 40 V70 M640 40 V70" ' + F.ln('#2A2522', 5) + '/><rect x="70" y="70" width="700" height="250" rx="14" ' + F.st('#FFFBEA', 6) + '/></g>' + F.lamp(980, 110, 1.0, 200) + F.lamp(1560, 110, 1.0, 200) + F.clock(1240, 360, 62, 'ha-clk') + F.picture(1420, 330, 200, 150) + F.plant(1820, 960, 1.1) + W.prop.bench(820, 960, 1.15, M) +
        W.person('ha-p1', { outfit: 'rags', hair: 'short', hairColor: 'black', facial: 'stubble', face: 0.3 }) +
        W.person('ha-p2', { outfit: 'rags', hat: 'straw', face: 0.3 }) +
        W.person('ha-p3', { outfit: 'peasant', hair: 'bun', hairColor: 'brown', face: 0.3 }) +
        W.person('ha-n', { outfit: 'scrubs', hair: 'bun', hairColor: 'brown', item: 'scroll', face: -0.3 }),
        F.label('Sadiki Hospital', 110, 90, 88, 'ha-t1') + F.label('Tunis', 110, 205, 76, 'ha-t2') + F.label('1909', 470, 205, 76, 'ha-t3', 'color:#B5503F'), '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      this.p = ['ha-p1', 'ha-p2', 'ha-p3', 'ha-n'].map((c) => W.bindPerson(kit.stage, c));
      Object.assign(this, { cam: q('.cam'), t1: q('.ha-t1'), t2: q('.ha-t2'), t3: q('.ha-t3') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.06, 960, 700);
      const sit = { legL: -70, legR: -70 };
      W.posePerson(this.p[0], Object.assign({ x: 700, y: 930, s: 1.5, expr: 'sad', blink: F.blink(a, 3.3), b1: 10, a1: -6, head: 2 * Math.sin(a) }, {}));
      W.posePerson(this.p[1], { x: 880, y: 930, s: 1.5, expr: 'worried', blink: F.blink(a, 2.9, 1), head: -3 });
      W.posePerson(this.p[2], { x: 1050, y: 930, s: 1.5, expr: 'neutral', blink: F.blink(a, 3.6, 2), a1: -12 });
      W.posePerson(this.p[3], { x: 1480, y: 960, s: 1.7, expr: F.talk(a, [[6.9, 7.2]]) || 'neutral', blink: F.blink(a, 3.1, 0.7), a1: -40 + 4 * Math.sin(a * 2), a2: -50, head: 2 * Math.sin(a * 1.3) });
      W.pop(this.t1, a, 5.36, 'left'); W.pop(this.t2, a, 6.42, 'left'); W.pop(this.t3, a, 8.04, 'left');
    },
  });
})();

//@scene bath 9.4 6.7
(function () {
  const S = 9.4, D = 6.7, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('bath', {
    init(kit) {
      const M = W.MOODS.hospitalMint;
      let bubbles = '';
      for (let i = 0; i < 9; i++) bubbles += '<circle class="ba-b" cx="' + (820 + (i * 53) % 260) + '" cy="760" r="' + (10 + (i % 3) * 6) + '" style="fill:#FFFFFF;stroke:#2A2522;stroke-width:3"/>';
      kit.stage.append(kit.h(F.frame(W.bg.ward(M, { beds: false }) + F.lamp(960, 110, 1.0, 200) + F.shelf(110, 560, 420, ['towel', 'towel', 'bowl']) + F.shelf(110, 760, 420, ['cup', 'cup', 'bowl', 'cup']) +
        '<ellipse cx="960" cy="1000" rx="230" ry="20" style="fill:rgba(42,37,34,.12)"/>' +
        W.person('ba-a', { outfit: 'rags', hair: 'short', hairColor: 'black', facial: 'stubble', face: 0.3 }) +
        W.person('ba-b', { outfit: 'none', hair: 'short', hairColor: 'black', facial: 'stubble', face: 0.3 }) +
        W.person('ba-c', { outfit: 'tunic', color: '#F7F4EC', shade: '#E2DDD0', hair: 'short', hairColor: 'black', facial: 'stubble', face: 0.3 }) +
        W.person('ba-o', { outfit: 'scrubs', hair: 'short', hairColor: 'brown', facial: 'mustache', face: -0.3 }) +
        '<g class="ba-rag">' + F.shirt(0, 0, 0.9, '#8C6C4F') + '</g>' +
        '<g class="ba-tubpos"><g class="ba-tub">' + F.tub(960, 1000, 1.2) + bubbles + '<path class="ba-steam" d="M860 760 q-20 -40 0 -80 q20 -40 0 -80 M960 740 q-20 -40 0 -80 q20 -40 0 -80 M1060 760 q-20 -40 0 -80 q20 -40 0 -80" style="fill:none;stroke:#FFFFFF;stroke-width:9;stroke-linecap:round;opacity:.8"/></g></g>' +
        '<g class="ba-spark">' + [[-140, -340], [150, -360], [-170, -120], [170, -140]].map(([x, y]) => '<path transform="translate(' + (960 + x) + ' ' + (1000 + y) + ')" d="M0 -26 L7 -7 L26 0 L7 7 L0 26 L-7 7 L-26 0 L-7 -7 Z" style="fill:#FFE59A;stroke:#2A2522;stroke-width:3"/>').join('') + '</g>',
        '', F.tag('Own clothes', 110, 90, 'ba-t1 cut') + F.tag('Stripped', 110, 90, 'ba-t2 cut') + F.tag('Soap + hot water', 110, 90, 'ba-t3 cut') + F.tag('Clean linen', 110, 90, 'ba-t4 cut'))));
      const q = F.q(kit.stage); this.root = kit.stage;
      this.A = W.bindPerson(kit.stage, 'ba-a'); this.B = W.bindPerson(kit.stage, 'ba-b'); this.C = W.bindPerson(kit.stage, 'ba-c'); this.O = W.bindPerson(kit.stage, 'ba-o');
      Object.assign(this, { cam: q('.cam'), rag: q('.ba-rag'), tub: q('.ba-tub'), tubpos: q('.ba-tubpos'), spark: q('.ba-spark'), steam: q('.ba-steam'),
        bub: [...kit.stage.querySelectorAll('.ba-b')], tags: ['.ba-t1', '.ba-t2', '.ba-t3', '.ba-t4'].map(q),
        gA: q('.ba-a'), gB: q('.ba-b'), gC: q('.ba-c') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.02, 1.08, 960, 640);
      // arrive: slide in with stepped walk
      const pin = eo(seg(a, 9.6, 10.6)), x = lerp(-200, 960, pin), w = a < 10.6 ? W.walk(a) : {};
      const stripped = a >= 11.66, linen = a >= 15.36;
      F.show(this.gA, !stripped); F.show(this.gB, stripped && !linen); F.show(this.gC, linen);
      const inTub = eio(seg(a, 12.3, 12.6)) * (1 - eio(seg(a, 14.4, 14.8)));
      const base = { x, y: 990 + 6 * inTub, s: 1.8, blink: F.blink(a, 2.8) };
      W.posePerson(this.A, Object.assign({}, base, w, { expr: 'worried' }));
      W.posePerson(this.B, Object.assign({}, base, { expr: a < 12.42 ? 'surprised' : 'worried', sq: W.take(a, 11.66), b1: 30, b2: 60, a1: -30, a2: -60 }));
      W.posePerson(this.C, Object.assign({}, base, { expr: a < 15.6 ? 'surprised' : 'joy', sq: W.take(a, 15.36), a1: -120, b1: 120, a2: -20, b2: 20 }));
      W.posePerson(this.O, { x: 1500, y: 990, s: 1.7, expr: a > 11.5 && a < 12.2 ? 'smug' : 'neutral', blink: F.blink(a, 3.4, 1), a1: a > 11.5 && a < 12.1 ? -70 : -10, a2: -20, flip: false });
      // rags fly off on 'stripped'
      const fl = seg(a, 11.66, 12.4);
      this.rag.setAttribute('transform', 'translate(' + (960 + 520 * eo(fl)) + ' ' + (800 - 380 * Math.sin(Math.PI * fl * 0.9)) + ') rotate(' + (300 * fl) + ')');
      this.rag.style.opacity = a < 11.66 || fl >= 1 ? 0 : 1;
      // tub pops up, stays, slides away
      W.pop(this.tub, a, 12.38, 'bottom');
      this.tubpos.setAttribute('transform', 'translate(0 ' + (500 * eio(seg(a, 14.5, 14.9))) + ')');
      this.bub.forEach((b, i) => { const p = ((a * 0.6 + i * 0.37) % 1); b.setAttribute('transform', 'translate(' + (8 * Math.sin(a * 3 + i)) + ' ' + (-260 * p) + ')'); b.style.opacity = a > 12.9 ? (1 - p) : 0; });
      this.steam.style.opacity = (a > 13.3 ? 0.8 : 0) * (0.6 + 0.4 * Math.sin(a * 5));
      W.pop(this.spark, a, 15.36);
      this.spark.style.opacity = a > 15.36 ? (0.6 + 0.4 * Math.sin(a * 14)) : 0;
      const tagAt = [9.86, 11.66, 12.96, 15.36];
      this.tags.forEach((el, i) => { W.pop(el, a, tagAt[i], 'left'); if (a > (tagAt[i + 1] || 99)) el.style.opacity = 0; });
    },
  });
})();

//@scene laundry 16.1 7.6
(function () {
  const S = 16.1, D = 7.6, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('laundry', {
    init(kit) {
      const M = W.MOODS.stonePale;
      let pile = '';
      const spots = [[0, 0], [130, 0], [260, 0], [65, -90], [195, -90], [130, -180], [-130, 0], [390, 0], [325, -90], [-65, -90], [260, -180], [0, -180], [195, -270], [65, -270], [130, -360]];
      spots.forEach(([x, y], i) => (pile += '<g class="la-pb">' + F.bundle(1440 + x, 960 + y, 0.95) + '</g>'));
      kit.stage.append(kit.h(F.frame(W.bg.stoneRoom(M, { seed: 8, floorY: 860 }) + W.prop.door(1600, 900, 1.3, M) + W.prop.window(620, 560, 0.9, M, true) + F.clock(960, 330, 72, 'la-clk') + F.lamp(1240, 100, 0.9, 160) + W.prop.barrel(1840, 940, 1.0, M) + W.prop.barrel(1760, 980, 0.8, M) +
        '<path class="la-rags" d="M330 960 Q360 900 420 920 Q470 880 520 930 Q560 950 540 965 Z" ' + F.st('#8C6C4F') + '/>' +
        pile +
        W.person('la-o', { outfit: 'scrubs', hair: 'short', hairColor: 'brown', facial: 'mustache', face: 0.4 }) + '<g class="la-bpos">' + F.bundle(0, 0, 1, 'la-b') + '</g>',
        F.label('Laundry', 1460, 330, 64, 'la-sign', 'background:#FFFDF4;border:4px solid #2A2522;border-radius:10px;padding:4px 18px'),
        F.tag('Routine hygiene', 110, 90, 'la-t1 cut') + F.label('x hundreds', 1240, 140, 110, 'la-t2 cut', 'color:#E0675A'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.O = W.bindPerson(kit.stage, 'la-o');
      Object.assign(this, { cam: q('.cam'), rags: q('.la-rags'), b: q('.la-b'), bpos: q('.la-bpos'), pile: [...kit.stage.querySelectorAll('.la-pb')], t1: q('.la-t1'), t2: q('.la-t2') });
    },
    render(t) {
      const a = t + S;
      F.spinClock(this.root, 'la-clk', a, 20.8, 22.6, 9);
      F.cam(this.cam, a, S, S + D, 1.0, 1.04, 1100, 700);
      // phase 1: bundle up (17.16), carry to door (17.66–19.1)
      // phase 2 (19.4+): shuttle back and forth, faster and faster
      let x = 560, flip = false, carrying = false, walking = false;
      if (a < 17.66) { x = 560; carrying = a > 17.3; }
      else if (a < 19.1) { x = lerp(560, 1500, eio(seg(a, 17.66, 19.1))); carrying = true; walking = true; }
      else {
        // phase variable: accelerating oscillation
        const u = a - 19.1, ph = 0.3 * u + 0.18 * u * u; // cycles
        const k = ph % 1; const goingBack = k < 0.5;
        x = goingBack ? lerp(1500, 560, eio(k * 2)) : lerp(560, 1500, eio((k - 0.5) * 2));
        flip = goingBack; carrying = !goingBack; walking = true;
      }
      const w = walking ? W.walk(a, a > 20.5 ? 14 : 8) : {};
      W.posePerson(this.O, Object.assign({ x, y: 960, s: 1.6, flip, blink: F.blink(a, 3), expr: a > 21.2 ? 'worried' : 'neutral' }, w,
        carrying ? { a1: -60, a2: -70, b1: 60, b2: 70 } : {}));
      // the rags become a bundle on 'bundled'
      this.rags.style.opacity = a < 17.16 ? 1 : 0;
      W.pop(this.b, a, 17.16, 'bottom');
      const bx = a < 17.3 ? 430 : x + (flip ? -60 : 60), by = a < 17.3 ? 960 : 850;
      this.bpos.setAttribute('transform', 'translate(' + bx + ' ' + by + ')');
      this.bpos.style.opacity = carrying || a < 17.3 ? 1 : 0;
      // pile grows on 'hundreds'
      this.pile.forEach((el, i) => W.pop(el, a, i === 0 ? 19.1 : 21.26 + i * 0.09, 'bottom'));
      W.pop(this.t1, a, 19.44, 'left'); W.pop(this.t2, a, 21.26, 'center');
      this.t2.style.transform += ' rotate(-6deg)';
    },
  });
})();

//@scene nicolle 23.7 7.2
(function () {
  const S = 23.7, D = 7.2, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('nicolle', {
    init(kit) {
      const M = W.MOODS.stonePale;
      kit.stage.append(kit.h(F.frame(W.bg.stoneRoom(M, { seed: 2, floorY: 860 }) + W.prop.window(1560, 560, 1.0, M, true) + W.glow(1560, 380, 380, '#FFF6D8', 0.5) + F.shelf(80, 470, 520, ['jar', 'jar', 'book', 'book', 'book', 'jar']) + F.shelf(80, 680, 520, ['book', 'book', 'book', 'book', 'jar', 'jar']) + F.picture(680, 300, 210, 160, 'paper') + F.lamp(1160, 110, 1.0, 230) + F.plant(1840, 980, 1.0) +
        '<ellipse cx="880" cy="996" rx="160" ry="18" style="fill:rgba(42,37,34,.14)"/>' +
        W.person('ni-n', { outfit: 'labcoat', hair: 'balding', hairColor: 'grey', facial: 'mustache', glasses: true, face: 0.35 }) +
        W.prop.table(1260, 1060, 1.0, M) + F.microscope(1180, 885, 1.0) + F.flask(1370, 885, 0.9, '#9DC3E2') + F.flask(1460, 885, 0.7, '#F08A7E') +
        '<g class="ni-qpos" transform="translate(690 450)">' + F.qmark('ni-q') + '</g>' +
        '<g class="ni-thought"><circle cx="1010" cy="400" r="14" ' + F.st('#FFFFFF', 3) + '/><circle cx="1060" cy="330" r="22" ' + F.st('#FFFFFF', 3) + '/><ellipse cx="1190" cy="210" rx="160" ry="115" ' + F.st('#FFFFFF') + '/>' + F.bundle(1190, 275, 0.9) + '</g>',
        '', F.tag('Charles Nicolle', 110, 80, 'ni-t1') + F.label('Pasteur Institute · Tunis', 120, 230, 58, 'ni-t2'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.N = W.bindPerson(kit.stage, 'ni-n');
      Object.assign(this, { cam: q('.cam'), q: q('.ni-q'), qpos: q('.ni-qpos'), th: q('.ni-thought'), t1: q('.ni-t1'), t2: q('.ni-t2') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.07, 900, 600);
      const look = eio(seg(a, 28.0, 28.4));
      const hand = eio(seg(a, 28.5, 28.9));
      W.posePerson(this.N, { x: 880, y: 990, s: 2.3, expr: a > 28.78 ? (a > 29.7 ? 'worried' : 'surprised') : 'neutral', sq: W.take(a, 28.78), blink: a > 28.78 ? 1 : F.blink(a, 3.2),
        head: lerp(0, -10, look) + 2 * Math.sin(a * 1.4), a1: lerp(-8, 130, hand), a2: lerp(-6, 40, hand), b1: 8 + Math.sin(a * 2) });
      W.pop(this.t1, a, 24.3, 'left'); W.pop(this.t2, a, 25.94, 'left');
      W.pop(this.q, a, 28.78, 'bottom');
      this.qpos.setAttribute('transform', 'translate(690 ' + (450 + 6 * Math.sin(a * 3)) + ') rotate(' + (5 * Math.sin(a * 2.4)) + ')');
      W.pop(this.th, a, 29.44, 'bottom');
    },
  });
})();

//@scene infect 30.9 8.0
(function () {
  const S = 30.9, D = 8.0, F = W.F, { seg, eio, eo, lerp } = F;
  const X = [820, 1210, 1600], AT = [33.1, 35.08, 37.06], IN = [32.64, 34.44, 36.5];
  kit.scene('infect', {
    init(kit) {
      const M = W.MOODS.infoPaper;
      let arrows = '';
      X.forEach((x, i) => (arrows += '<g class="in-ar' + i + '">' + W.info.arrow((i ? X[i - 1] : 300) + 110, 640, x - 110, 640) + '</g>'));
      kit.stage.append(kit.h(F.frame(W.bg.paper(M) + arrows +
        W.person('in-p', { outfit: 'rags', hair: 'short', hairColor: 'black', facial: 'stubble', face: 0.3 }) + F.fever('in-pf', 300, 350, 1) +
        W.person('in-a', { outfit: 'scrubs', hair: 'bun', hairColor: 'brown', item: 'scroll', face: -0.3 }) +
        W.person('in-b', { outfit: 'scrubs', hair: 'short', hairColor: 'brown', facial: 'mustache', face: -0.3 }) +
        W.person('in-c', { outfit: 'peasant', hair: 'bun', hairColor: 'red', face: -0.3 }) +
        X.map((x, i) => F.fever('in-f' + i, x - 10, 350, 0.9)).join(''),
        F.label('Typhus patient', 150, 840, 52, 'in-l cut') + F.label('Staff', 740, 840, 52, 'in-l0 cut') + F.label('Orderlies', 1090, 840, 52, 'in-l1 cut') + F.label('Laundry', 1500, 840, 52, 'in-l2 cut'),
        F.tag('Who got sick?', 110, 80, 'in-t cut'))));
      const q = F.q(kit.stage); this.root = kit.stage;
      this.P = W.bindPerson(kit.stage, 'in-p'); this.ppl = ['in-a', 'in-b', 'in-c'].map((c) => W.bindPerson(kit.stage, c));
      Object.assign(this, { cam: q('.cam'), pf: q('.in-pf-in'), t: q('.in-t'), l: q('.in-l'),
        f: [0, 1, 2].map((i) => q('.in-f' + i + '-in')), ar: [0, 1, 2].map((i) => q('.in-ar' + i)), ls: [0, 1, 2].map((i) => q('.in-l' + i)), g: ['in-a', 'in-b', 'in-c'].map((c) => q('.' + c)) });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.03);
      W.posePerson(this.P, { x: 300, y: 800, s: 1.6, expr: 'sad', blink: F.blink(a, 2.6), head: 3 * Math.sin(a * 1.5), b1: 12, a1: -12 });
      W.pop(this.pf, a, 31.08); W.pop(this.l, a, 31.08, 'left'); W.pop(this.t, a, 31.2, 'left');
      this.ppl.forEach((m, i) => {
        const sick = a > AT[i];
        this.g[i].style.opacity = a < IN[i] ? 0 : 1;
        W.posePerson(m, { x: X[i], y: 800, s: 1.6, expr: sick ? 'sad' : 'neutral', sq: W.take(a, AT[i]), blink: F.blink(a, 3, i), head: sick ? 6 : 0, a1: i === 1 ? -30 : -8 });
        W.pop(this.f[i], a, AT[i]); W.pop(this.ls[i], a, IN[i], 'left');
        const ar = this.ar[i]; ar.style.opacity = a > AT[i] - 0.3 ? 1 : 0;
        const p = eo(seg(a, AT[i] - 0.3, AT[i]));
        const x0 = (i ? X[i - 1] : 300) + 110; ar.setAttribute('transform', 'translate(' + x0 + ' 640) scale(' + Math.max(0.001, p).toFixed(3) + ' 1) translate(' + -x0 + ' -640)');
      });
    },
  });
})();

//@scene ward 38.9 4.6
(function () {
  const S = 38.9, D = 4.6, F = W.F, { seg, eio, lerp } = F;
  kit.scene('ward', {
    init(kit) {
      const M = W.MOODS.hospitalMint;
      kit.stage.append(kit.h(F.frame(W.bg.ward(M, { beds: true }) + F.lamp(700, 100, 0.95, 170) + F.lamp(1500, 100, 0.95, 170) + W.prop.table(1720, 900, 0.7, M) + W.prop.cup(1680, 810, 0.8) + W.prop.bowl(1770, 812, 0.7) +
        W.person('wa-c', { outfit: 'tunic', color: '#F7F4EC', shade: '#E2DDD0', hair: 'short', hairColor: 'black', facial: 'stubble', face: 0.3 }) +
        W.person('wa-n', { outfit: 'scrubs', hair: 'bun', hairColor: 'brown', face: -0.3 }),
        '', F.tag('On the ward', 110, 80, 'wa-t cut') + '<p class="hand-label big wa-zero" style="left:1080px;top:150px;font-size:150px">Infected: <span style="color:#E0675A">0</span></p>')));
      const q = F.q(kit.stage); this.root = kit.stage; this.C = W.bindPerson(kit.stage, 'wa-c'); this.N = W.bindPerson(kit.stage, 'wa-n');
      Object.assign(this, { cam: q('.cam'), t: q('.wa-t'), z: q('.wa-zero') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.05, 900, 700);
      W.posePerson(this.C, { x: 820, y: 990, s: 1.9, expr: a > 42.26 ? 'joy' : 'happy', sq: W.take(a, 42.26), blink: F.blink(a, 2.9), a1: a > 42.26 ? -120 : -10, a2: -20, head: 2 * Math.sin(a * 2) });
      W.posePerson(this.N, { x: 1250, y: 990, s: 1.8, expr: a > 42.4 ? 'happy' : 'neutral', blink: F.blink(a, 3.3, 1), a1: -10 });
      W.pop(this.t, a, 40.3, 'left'); W.pop(this.z, a, 42.26, 'center');
    },
  });
})();

//@scene map 43.5 4.0
(function () {
  const S = 43.5, D = 4.0, F = W.F, { seg, eio, lerp } = F;
  const GX = 900, GY = 790;
  kit.scene('map', {
    init(kit) {
      let heads = '';
      [[-150, -60], [-90, -130], [0, -150], [90, -130], [150, -60], [-60, -40], [60, -40]].forEach(([x, y], i) =>
        heads += '<g class="mp-h mp-h' + i + '" transform="translate(' + (GX + x) + ' ' + (GY + y) + ')"><g><path d="M-22 26 Q0 6 22 26 Z" ' + F.st('#9AA1A8', 3) + '/><circle cx="0" cy="0" r="22" ' + F.st('#FFFFFF', 3) + '/><path d="M-27 -6 Q0 -38 27 -6 Z" ' + F.st('#7E868E', 3) + '/><ellipse cx="-6" cy="4" rx="2.5" ry="4" style="fill:#2A2522"/><ellipse cx="6" cy="4" rx="2.5" ry="4" style="fill:#2A2522"/></g></g>');
      kit.stage.append(kit.h(F.frame(F.iberia() + '<g class="mp-pin">' + W.info.pin(GX, GY) + '<circle cx="' + GX + '" cy="' + GY + '" r="28" style="fill:none;stroke:#E0675A;stroke-width:6"/></g>' + heads,
        F.label('Granada', GX + 50, GY - 10, 64, 'mp-l') + F.label('Castile & Aragon', 690, 430, 56, 'mp-c', 'opacity:.75'), F.tag('The war for Granada', 110, 80, 'mp-t cut') + F.card('mp-card', 'Granada · 1489'), { noVig: false })));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), pin: q('.mp-pin'), l: q('.mp-l'), c: q('.mp-c'), t: q('.mp-t'), h: [...kit.stage.querySelectorAll('.mp-h > g')] });
    },
    render(t) {
      const a = t + S;
      F.show(this.root.querySelector('.mp-card'), a < 44.6);
      F.cam(this.cam, a, S, S + D, 1.0, 1.25, GX, GY - 60);
      W.pop(this.c, a, 43.6, 'left'); W.pop(this.t, a, 43.7, 'left');
      W.drop(this.pin, a, 43.95, 44.16, 300); W.pop(this.l, a, 44.2, 'left');
      this.h.forEach((g, i) => { W.pop(g, a, 45.38 + i * 0.09); });
    },
  });
})();

//@scene years 47.5 3.4
(function () {
  const S = 47.5, D = 3.4, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('years', {
    init(kit) {
      const M = W.MOODS.infoPaper;
      let ticks = ''; for (let i = 0; i <= 12; i++) ticks += '<path d="M' + (160 + i * 133) + ' 640 v' + (i % 3 ? 20 : 40) + '" ' + F.ln('#2A2522', 5) + '/>';
      kit.stage.append(kit.h(F.frame(W.bg.paper(M) + '<path d="M120 640 H1800" ' + F.ln('#2A2522', 7) + '/>' + ticks +
        '<g class="yr-ar">' + W.info.arrow(760, 520, 1150, 520) + '</g>',
        '<p class="hand-label big yr-a" style="left:360px;top:330px;font-size:200px">1489</p><p class="hand-label big yr-b" style="left:1200px;top:330px;font-size:200px">1490</p>' +
        F.label('Two campaigns', 700, 760, 72, 'yr-l cut'), '', {})));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), A: q('.yr-a'), B: q('.yr-b'), ar: q('.yr-ar'), l: q('.yr-l') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.04);
      W.pop(this.A, a, 48.5); W.pop(this.B, a, 49.56);
      const p = eo(seg(a, 49.3, 49.6)); this.ar.style.opacity = a > 49.3 ? 1 : 0;
      this.ar.setAttribute('transform', 'translate(760 0) scale(' + Math.max(0.001, p).toFixed(3) + ' 1) translate(-760 0)');
      W.pop(this.l, a, 47.82);
    },
  });
})();

//@scene tents 50.9 5.1
(function () {
  const S = 50.9, D = 5.1, F = W.F, { seg, eio, eo, lerp } = F;
  const N = 5;
  kit.scene('tents', {
    init(kit) {
      const M = W.MOODS.snowCold;
      const sky = '<rect width="1920" height="1080" style="fill:#AEB9C6"/>' + W.glow(400, 200, 600, '#F2D9B8', 0.5) +
        '<path d="M0 560 Q400 500 900 540 Q1400 580 1920 520 V1080 H0 Z" style="fill:#C9D1D8"/><path d="M0 700 Q600 660 1100 690 Q1500 710 1920 680 V1080 H0 Z" ' + F.st('#E4E8EB') + '/>';
      let tents = '';
      [[260, 610, 0.7], [620, 590, 0.6], [1350, 600, 0.65], [1700, 620, 0.75]].forEach(([x, y, s], i) => (tents += '<g class="te-tw"><g class="te-t">' + F.tent(x, y, s, '#D8C7A0') + '</g></g>'));
      let ppl = ''; for (let i = 0; i < N; i++) ppl += W.person('te-p' + i, { outfit: 'soldier', face: [0.3, -0.2, 0.1, 0.25, -0.3][i] });
      kit.stage.append(kit.h(F.frame(sky + tents + F.sack(260, 900, 1.1) + F.sack(370, 920, 0.9) + W.prop.barrel(1700, 900, 0.9, W.MOODS.stoneBlue || {}) + F.helmet(1560, 930, 0.8) + '<g class="te-earth"><path d="M1100 760 Q1300 690 1520 720 Q1760 690 1920 740 V820 H1100 Z" ' + F.st('#A88B6A') + '/></g>' + ppl,
        F.label('Tents', 560, 380, 60, 'te-l1 cut') + F.label('Earthworks', 1500, 640, 56, 'te-l2 cut'), F.tag('Shoulder to shoulder', 110, 80, 'te-t1 cut'))));
      const q = F.q(kit.stage); this.root = kit.stage;
      this.P = []; for (let i = 0; i < N; i++) this.P.push(W.bindPerson(kit.stage, 'te-p' + i));
      Object.assign(this, { cam: q('.cam'), tents: [...kit.stage.querySelectorAll('.te-t')], earth: q('.te-earth'), l1: q('.te-l1'), l2: q('.te-l2'), t1: q('.te-t1') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.06, 960, 800);
      this.tents.forEach((g, i) => W.pop(g, a, 52.2 + i * 0.1, 'bottom'));
      this.earth.style.transform = 'translateY(' + (200 * (1 - eo(seg(a, 52.6, 53.0)))) + 'px)';
      W.pop(this.l1, a, 52.2, 'left'); W.pop(this.l2, a, 52.7, 'left'); W.pop(this.t1, a, 53.7, 'left');
      const pack = eio(seg(a, 53.7, 54.4)), warm = a > 55.04;
      this.P.forEach((m, i) => {
        const spread = 520 + i * 220, packed = 760 + i * 100;
        const x = lerp(spread, packed, pack);
        const shiver = warm ? 0 : 3 * Math.sin(a * 40 + i);
        W.posePerson(m, { x: x + shiver, y: 990, s: 1.45, flip: i % 2 === 1 && pack < 0.5, expr: warm ? 'happy' : 'worried', blink: F.blink(a, 3, i * 0.7),
          sq: pack > 0 && pack < 1 ? 1.05 : 1, a1: pack > 0.9 ? 30 : -6, b1: pack > 0.9 ? -30 : 6, a2: 40 * pack, b2: -40 * pack, head: shiver });
      });
    },
  });
})();

//@scene blanket 56.0 3.6
(function () {
  const S = 56.0, D = 3.6, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('blanket', {
    init(kit) {
      const M = W.MOODS.dungeonWarm;
      const tent = '<rect width="1920" height="1080" style="fill:#C9A675"/>' + W.glow(960, 420, 700, '#FFD38A', 0.5) +
        '<path d="M960 -40 L-200 1080 H2120 Z" style="fill:#D8BC8A;stroke:#2A2522;stroke-width:5"/><path d="M960 -40 V1080" ' + F.ln('rgba(42,37,34,.35)', 6) + '/>' +
        '<rect y="900" width="1920" height="180" style="fill:#A8865C"/>' + W.prop.straw(960, 960, 1.4, 40, 3);
      kit.stage.append(kit.h(F.frame(tent + F.lantern(960, 230, 1.2) + F.sack(1760, 1000, 1.2) + F.helmet(200, 1010, 0.9) +
        W.person('bl-s', { outfit: 'tunic', hat: 'none', hair: 'short', hairColor: 'brown', facial: 'stubble', face: 0.3 }) + F.fever('bl-f', 560, 420, 1) +
        W.person('bl-w', { outfit: 'tunic', hair: 'curly', hairColor: 'black', face: -0.3 }) +
        '<g class="bl-pos">' + F.blanket('bl-b') + '</g>' + '<g class="bl-ar">' + W.info.arrow(700, 300, 1220, 300) + '</g>',
        F.label('Sick', 470, 230, 80, 'bl-l1 cut') + F.label('Well', 1300, 230, 80, 'bl-l2 cut'), '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.Sk = W.bindPerson(kit.stage, 'bl-s'); this.Wl = W.bindPerson(kit.stage, 'bl-w');
      Object.assign(this, { cam: q('.cam'), pos: q('.bl-pos'), f: q('.bl-f-in'), ar: q('.bl-ar'), l1: q('.bl-l1'), l2: q('.bl-l2') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.05, 960, 700);
      const p = eio(seg(a, 56.62, 57.3));
      W.posePerson(this.Sk, { x: 560, y: 990, s: 2.0, expr: 'sad', blink: F.blink(a, 2.4), head: 6 + 2 * Math.sin(a * 2), a1: lerp(-10, -80, eo(seg(a, 56.5, 56.8))) * (1 - eio(seg(a, 57.4, 57.8))), a2: -10 });
      W.posePerson(this.Wl, { x: 1360, y: 990, s: 2.0, expr: a > 58.2 ? 'smug' : 'happy', blink: F.blink(a, 3.1, 1), a1: lerp(-8, 40, p), b1: lerp(8, -40, p), a2: 50 * p, b2: -50 * p });
      const x = lerp(560, 1360, p), y = lerp(760, 760, p) - 180 * Math.sin(Math.PI * p);
      this.pos.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + (10 * Math.sin(Math.PI * p * 2)) + ')');
      W.pop(this.f, a, 56.1);
      W.pop(this.l1, a, 57.28, 'left'); W.pop(this.l2, a, 57.8, 'left');
      const q = eo(seg(a, 57.3, 57.75)); this.ar.style.opacity = a > 57.3 ? 1 : 0;
      this.ar.setAttribute('transform', 'translate(700 0) scale(' + Math.max(0.001, q).toFixed(3) + ' 1) translate(-700 0)');
    },
  });
})();

//@scene tunic 59.6 6.2
(function () {
  const S = 59.6, D = 6.2, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('tunic', {
    init(kit) {
      const M = Object.assign({}, W.MOODS.fieldSpring, { wall: '#B7C79A', floor: '#A9BE86', sky: '#D6DDD8' });
      let stains = '';
      [[-24, -160], [30, -120], [-10, -95], [26, -175]].forEach(([x, y], i) => (stains += '<ellipse class="tu-s" cx="' + x + '" cy="' + y + '" rx="' + (14 + i * 3) + '" ry="10" style="fill:#5C4632;opacity:.55"/>'));
      let flies = ''; for (let i = 0; i < 4; i++) flies += '<g class="tu-fly"><circle r="6" style="fill:#2A2522"/><ellipse cx="-6" cy="-8" rx="6" ry="4" style="fill:#FFFFFF;stroke:#2A2522;stroke-width:2"/><ellipse cx="6" cy="-8" rx="6" ry="4" style="fill:#FFFFFF;stroke:#2A2522;stroke-width:2"/></g>';
      kit.stage.append(kit.h(F.frame(W.bg.field(M, { seed: 11 }) + W.prop.fire(1500, 960, 1.0, 0) +
        '<path class="tu-smoke" d="M1500 820 q-40 -60 0 -120 q40 -60 0 -120 q-40 -60 0 -120" style="fill:none;stroke:#8E9AA6;stroke-width:26;stroke-linecap:round;opacity:.7"/>' +
        W.person('tu-p', { outfit: 'tunic', color: '#8C7A5B', shade: '#6F5F45', hat: 'kettle', facial: 'stubble', hairColor: 'brown', face: 0.2 }) +
        '<g class="tu-st" transform="translate(860 990) scale(1.9)">' + stains + '</g>' + flies +
        '<g class="tu-sw">' + [[0, 0], [40, 30], [-30, 40]].map(([x, y]) => '<path transform="translate(' + (980 + x) + ' ' + (560 + y) + ')" d="M0 -14 q10 14 0 22 q-10 -8 0 -22 Z" style="fill:#9ED3EE;stroke:#2A2522;stroke-width:3"/>').join('') + '</g>',
        F.label('Wool tunic', 300, 420, 60, 'tu-l1 cut') + F.label('Sweat', 1060, 470, 56, 'tu-l2 cut') + F.label('Wood smoke', 1240, 330, 56, 'tu-l3 cut'),
        '<p class="hand-label tag tu-wk" style="left:110px;top:80px;font-size:84px">Week <span class="tu-n">1</span></p>')));
      const q = F.q(kit.stage); this.root = kit.stage; this.P = W.bindPerson(kit.stage, 'tu-p');
      Object.assign(this, { cam: q('.cam'), wk: q('.tu-wk'), n: q('.tu-n'), st: [...kit.stage.querySelectorAll('.tu-s')], fl: [...kit.stage.querySelectorAll('.tu-fly')], sw: q('.tu-sw'), sm: q('.tu-smoke'),
        l1: q('.tu-l1'), l2: q('.tu-l2'), l3: q('.tu-l3') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.06, 900, 700);
      W.posePerson(this.P, { x: 860, y: 990, s: 1.9, expr: a > 63.66 ? 'smug' : 'neutral', blink: F.blink(a, 3.2), head: 2 * Math.sin(a * 1.4), a1: -10, b1: 10 });
      W.flames(this.root, a);
      W.pop(this.l1, a, 59.98, 'left');
      W.pop(this.wk, a, 60.9, 'left');
      this.n.textContent = String(Math.min(4, 1 + Math.max(0, Math.floor((a - 61.0) / 0.28))));
      this.st.forEach((s, i) => W.pop(s, a, 63.66 + i * 0.12));
      this.fl.forEach((g, i) => { const k = a * (2.4 + i * 0.4) + i * 1.7; g.setAttribute('transform', 'translate(' + (860 + 130 * Math.cos(k)) + ' ' + (650 + 60 * Math.sin(k * 1.3)) + ')'); g.style.opacity = a > 63.9 ? 1 : 0; });
      W.pop(this.sw, a, 64.28); W.pop(this.l2, a, 64.28, 'left');
      this.sw.style.transform += ' translateY(' + (20 * ((a * 1.2) % 1)) + 'px)';
      this.sm.style.opacity = a > 64.6 ? 0.7 : 0; this.sm.setAttribute('transform', 'translate(' + (14 * Math.sin(a * 2)) + ' ' + (-30 * ((a * 0.5) % 1)) + ')');
      W.pop(this.l3, a, 64.76, 'left');
    },
  });
})();

//@scene night 65.8 4.6
(function () {
  const S = 65.8, D = 4.6, F = W.F, { seg, eio, eo, lerp } = F;
  W.F.camp = (pfx) => {
    let s = F.nightSky(5);
    const T = [[230, 760, 0.62], [560, 720, 0.5], [880, 770, 0.68], [1200, 730, 0.52], [1520, 780, 0.66], [1790, 740, 0.5]];
    T.forEach(([x, y, sc], i) => {
      s += F.tent(x, y, sc, '#8C8574', '#F2B95E', 0.0);
      s += '<g class="' + pfx + '-glow' + i + '">' + W.glow(x, y - 50 * sc, 150 * sc, '#FFC86B', 0.55) + '</g>';
      s += '<g class="' + pfx + '-mk' + i + '" transform="translate(' + x + ' ' + (y - 260 * sc) + ')"><g>' + F.scratchMark(-40, 0, 0.9) + F.scratchMark(40, -30, 0.7) + '</g></g>';
    });
    return s;
  };
  kit.scene('night', {
    init(kit) {
      kit.stage.append(kit.h(F.frame(F.camp('ng'), '', F.tag('At night…', 110, 80, 'ng-t cut') + F.label('Scratch scratch scratch', 560, 900, 84, 'ng-l cut', 'color:#F4EFD8'))));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), t: q('.ng-t'), l: q('.ng-l'), mk: [0, 1, 2, 3, 4, 5].map((i) => q('.ng-mk' + i + ' > g')), stars: [...kit.stage.querySelectorAll('.star')] });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.04, 960, 700);
      W.pop(this.t, a, 66.04, 'left');
      this.stars.forEach((s, i) => (s.style.opacity = 0.6 + 0.4 * Math.sin(a * 3 + i * 1.7)));
      this.mk.forEach((g, i) => { W.pop(g, a, 69.3 + i * 0.07); if (a > 69.6) g.style.transform += ' translate(' + (5 * Math.sin(a * 37 + i)) + 'px,' + (4 * Math.sin(a * 29 + i * 2)) + 'px)'; });
      W.pop(this.l, a, 69.4, 'left');
      F.fade(this.root, t, D, 0.25, 0);
    },
  });
})();

//@scene scratch 70.4 7.1
(function () {
  const S = 70.4, D = 7.1, F = W.F, { seg, eio, eo, lerp } = F;
  // spots on the soldier (scale 2.4 around x=960, feet y=1010)
  const SP = [[960, 790, 'Waistband', 71.36], [905, 690, 'Armpits', 72.52], [960, 640, 'Collar', 73.24]];
  kit.scene('scratch', {
    init(kit) {
      const tent = '<rect width="1920" height="1080" style="fill:#B8925F"/>' + W.glow(960, 460, 760, '#FFCB7A', 0.55) +
        '<path d="M960 -40 L-260 1080 H2180 Z" style="fill:#CDAE7C;stroke:#2A2522;stroke-width:5"/><rect y="930" width="1920" height="150" style="fill:#9C7A50"/>';
      let tg = '';
      SP.forEach(([x, y], i) => (tg += '<g class="sc-c' + i + '" transform="translate(' + x + ' ' + y + ')"><g><circle r="44" style="fill:none;stroke:#E0675A;stroke-width:7;stroke-dasharray:14 10"/></g></g>' +
        '<g class="sc-w' + i + '" transform="translate(' + (x + 20) + ' ' + (y + 10) + ')"><g><path d="M-14 -8 l10 14 M2 -12 l10 14" style="fill:none;stroke:#E0675A;stroke-width:6;stroke-linecap:round"/></g></g>'));
      kit.stage.append(kit.h(F.frame(tent + F.lantern(1420, 260, 1.1) + F.sack(1720, 1000, 1.1) + F.helmet(260, 1000, 0.9) + W.person('sc-p', { outfit: 'tunic', color: '#8C7A5B', shade: '#6F5F45', hair: 'short', hairColor: 'brown', facial: 'stubble', face: 0.0 }) + tg +
        '<g class="sc-dirt"><circle cx="0" cy="0" r="5" style="fill:#3B2C20"/><circle cx="10" cy="4" r="4" style="fill:#3B2C20"/></g>',
        SP.map(([x, y, n], i) => F.label(n, i === 1 ? 470 : 1080, y - 50, 64, 'sc-l' + i + ' cut')).join(''), '')));
      const q = F.q(kit.stage); this.root = kit.stage; this.P = W.bindPerson(kit.stage, 'sc-p');
      Object.assign(this, { cam: q('.cam'), c: [0, 1, 2].map((i) => q('.sc-c' + i + ' > g')), w: [0, 1, 2].map((i) => q('.sc-w' + i + ' > g')), l: [0, 1, 2].map((i) => q('.sc-l' + i)), dirt: q('.sc-dirt') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.02, 1.1, 960, 700);
      const j = 10 * Math.sin(a * 42);
      let p = { a1: -8, a2: -6, b1: 8, b2: 6 };
      if (a >= 71.2 && a < 72.4) p = { a1: 28 + j, a2: 55, b1: 8, b2: 6 };
      else if (a >= 72.4 && a < 73.1) p = { a1: 70 + j, a2: 70, b1: 150, b2: 10 };
      else if (a >= 73.1 && a < 74.6) p = { a1: 150 + j * 0.6, a2: 40, b1: 8, b2: 6 };
      else if (a >= 74.6 && a < 75.4) p = { a1: 28 + j, a2: 55, b1: -20 - j, b2: -50 };
      else if (a >= 75.4) { const k = eio(seg(a, 75.4, 75.9)); p = { a1: lerp(28, 70, k), a2: lerp(55, 100, k), b1: 8, b2: 6 }; }
      const expr = a < 74.6 ? (Math.floor(a * 3) % 2 ? 'angry' : 'worried') : a < 76.4 ? 'angry' : 'worried';
      W.posePerson(this.P, Object.assign({ x: 960, y: 1010, s: 2.4, expr, blink: F.blink(a, 2.2), head: 3 * Math.sin(a * 6), sq: W.take(a, 76.6) }, p));
      this.c.forEach((g, i) => { W.pop(g, a, SP[i][3]); g.style.opacity = a > SP[i][3] && a < 74.7 ? 1 : 0; });
      this.l.forEach((el, i) => { W.pop(el, a, SP[i][3], 'left'); if (a > 74.7) el.style.opacity = 0; });
      this.w.forEach((g, i) => W.pop(g, a, 74.9 + i * 0.12));
      // dark under the nails: dirt sits at the hand once he looks at it
      const hand = this.P.armRh; this.dirt.style.opacity = a > 75.9 ? 1 : 0;
      if (a > 75.9) { const b = hand.getBoundingClientRect(), r = this.root.getBoundingClientRect(), sc = r.width / 1920; this.dirt.setAttribute('transform', 'translate(' + ((b.x + b.width / 2 - r.x) / sc) + ' ' + ((b.y + b.height / 2 - r.y) / sc) + ')'); }
    },
  });
})();

//@scene stopped 77.5 4.4
(function () {
  const S = 77.5, D = 4.4, F = W.F, { seg, eio } = F;
  const OFF = [80.2, 78.86, 80.6, 79.9, 79.46, 81.02];
  kit.scene('stopped', {
    init(kit) {
      kit.stage.append(kit.h(F.frame(F.camp('so'), '', '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), mk: [0, 1, 2, 3, 4, 5].map((i) => q('.so-mk' + i + ' > g')), gl: [0, 1, 2, 3, 4, 5].map((i) => q('.so-glow' + i)), stars: [...kit.stage.querySelectorAll('.star')] });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.04, 1.12, 960, 720);
      this.stars.forEach((s, i) => (s.style.opacity = 0.6 + 0.4 * Math.sin(a * 3 + i * 1.7)));
      this.mk.forEach((g, i) => {
        const off = a > OFF[i], k = 1 - eio(seg(a, OFF[i], OFF[i] + 0.25));
        g.style.transform = 'translate(' + (5 * Math.sin(a * 37 + i)) * k + 'px,' + (4 * Math.sin(a * 29 + i * 2)) * k + 'px) scale(' + Math.max(0.001, k) + ')';
        g.style.transformBox = 'fill-box'; g.style.transformOrigin = '50% 50%';
        this.gl[i].style.opacity = off ? Math.max(0.35, k) : 1;
      });
    },
  });
})();

//@scene still 81.9 6.2
(function () {
  const S = 81.9, D = 6.2, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('still', {
    init(kit) {
      const tent = '<rect width="1920" height="1080" style="fill:#7E6A52"/>' + W.glow(980, 560, 700, '#D9A867', 0.4) +
        '<path d="M960 -40 L-260 1080 H2180 Z" style="fill:#94805F;stroke:#2A2522;stroke-width:5"/><rect y="800" width="1920" height="280" style="fill:#6F5C44"/>' + W.prop.straw(980, 860, 1.8, 50, 8);
      kit.stage.append(kit.h(F.frame(tent + F.lantern(1500, 230, 1.0, false) + F.helmet(1780, 900, 0.9) + W.person('st-p', { outfit: 'tunic', color: '#8C7A5B', shade: '#6F5F45', hair: 'short', hairColor: 'brown', facial: 'stubble', face: 0.0 }) +
        '<g class="st-bl">' + F.blanket('st-b') + '</g>' + '<g class="st-heat">' + F.fever('st-f', 1080, 580, 1.5) + '</g>' + F.thermo('st-th', 1500, 640, 1.2) +
        '<g class="st-itch">' + F.scratchMark(760, 640, 1.2) + '</g>', '', '', {})));
      const q = F.q(kit.stage); this.root = kit.stage; this.P = W.bindPerson(kit.stage, 'st-p');
      Object.assign(this, { cam: q('.cam'), bl: q('.st-bl'), f: q('.st-f-in'), th: q('.st-th'), lvl: q('.st-th-lvl'), itch: q('.st-itch') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.12, 900, 640);
      // lying on his back across the frame: feet to the right
      W.posePerson(this.P, { x: 1020, y: 780, s: 2.2, lean: -90, expr: 'neutral', blink: 1, head: 0, a1: -4, b1: 4, legL: 0, legR: 0 });
      this.bl.setAttribute('transform', 'translate(1250 740) rotate(-4) scale(1.6 1.1)');
      W.pop(this.f, a, 85.9); this.f.style.opacity = a > 85.9 ? 0.7 + 0.3 * Math.sin(a * 6) : 0;
      W.pop(this.th, a, 85.9, 'bottom');
      const L = eo(seg(a, 86.0, 86.9)); this.lvl.setAttribute('transform', 'translate(0 ' + (180 * (1 - L) * 0.85) + ') scale(1 ' + (0.15 + 0.85 * L) + ')'); this.lvl.style.transformBox = 'fill-box'; this.lvl.style.transformOrigin = '50% 100%';
      this.lvl.setAttribute('transform', ''); this.lvl.style.transform = 'scaleY(' + (0.15 + 0.85 * L).toFixed(3) + ')';
      this.itch.style.opacity = (a > 86.6 ? 1 - seg(a, 86.9, 87.6) : 0) * 0.8;
      F.fade(this.root, t, D, 0.5, 0);
    },
  });
})();

//@scene host 88.1 4.1
(function () {
  const S = 88.1, D = 4.1, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('host', {
    init(kit) {
      const M = W.MOODS.hallSage;
      kit.stage.append(kit.h(F.frame(W.bg.stoneRoom(M, { seed: 4, floorY: 860 }) + W.prop.window(300, 560, 1.0, M, true) + W.glow(300, 380, 380, '#FFF6D8', 0.5) + F.shelf(1050, 380, 560, ['book', 'book', 'book', 'jar', 'book', 'book', 'book', 'book']) + F.picture(1660, 200, 180, 150, 'paper') +
        '<ellipse cx="760" cy="996" rx="170" ry="18" style="fill:rgba(42,37,34,.14)"/>' + W.person('ho-n', W.NARRATOR) +
        '<g class="ho-lens" transform="translate(1320 470)"><g><circle r="190" ' + F.st('#FFFFFF', 8) + '/><circle r="170" style="fill:#F4F7F2"/>' +
        '<g class="ho-lo">' + F.louse('ho-l', '#C9A27A') + '</g><path d="M130 130 L250 250" ' + F.ln('#2A2522', 40) + '/><path d="M130 130 L250 250" ' + F.ln('#8A5D3B', 26) + '/></g></g>',
        '', F.tag('Known to all · feared by none', 110, 80, 'ho-t cut'))));
      const q = F.q(kit.stage); this.root = kit.stage; this.N = W.bindPerson(kit.stage, 'ho-n');
      Object.assign(this, { cam: q('.cam'), lens: q('.ho-lens > g'), t: q('.ho-t') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.05, 1000, 600);
      const up = eo(seg(a, 88.2, 88.5)) * (1 - eio(seg(a, 90.3, 90.6)));
      const shrug = eio(seg(a, 91.2, 91.5));
      W.posePerson(this.N, { x: 760, y: 990, s: 2.6, expr: F.talk(a, [[88.16, 91.6]]) || 'smug', blink: F.blink(a, 2.9), head: 3 * Math.sin(a * 1.8) - 5 * shrug,
        a1: lerp(lerp(-8, -150, up), -60, shrug), a2: lerp(-6, 30, up) + shrug * -60, b1: lerp(8, 60, shrug), b2: 60 * shrug, sq: W.take(a, 90.44) });
      W.pop(this.lens, a, 90.44);
      F.poseLouse(this.root, 'ho-l', 0, 10, 0.6, 10 * Math.sin(a * 2), a, true);
      W.pop(this.t, a, 90.5, 'left');
    },
  });
})();

//@scene louse 92.2 3.2
(function () {
  const S = 92.2, D = 3.2, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('louse', {
    init(kit) {
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + F.louse('lo-l', '#FFFFFF', true) + '<g class="lo-seed">' + F.seed(1080, 600, 1.0) + '</g>' +
        '<g class="lo-eq"><path d="M950 585 h44 M950 615 h44" style="fill:none;stroke:#E0675A;stroke-width:10;stroke-linecap:round"/></g>' +
        '<g class="lo-ld">' + W.info.leader(1040, 300, 820, 380, 40) + '</g>',
        F.label('Body louse', 1060, 230, 80, 'lo-l1') + F.label('≈ a sesame seed', 1110, 650, 72, 'lo-l2 cut') + F.label('actual size: 3 mm', 820, 760, 48, 'lo-l3', 'opacity:.7'), '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), l1: q('.lo-l1'), l2: q('.lo-l2'), l3: q('.lo-l3'), seed: q('.lo-seed'), eq: q('.lo-eq'), ld: q('.lo-ld'), g: q('.lo-l') });
    },
    render(t) {
      const a = t + S;
      const shrink = eio(seg(a, 94.28, 94.75));
      W.pop(this.g.firstChild, a, 92.74);
      F.poseLouse(this.root, 'lo-l', lerp(760, 870, shrink), lerp(560, 610, shrink), lerp(1.7, 0.5, shrink), lerp(-8, 0, shrink), a, false);
      W.pop(this.l1, a, 92.74, 'left'); this.ld.style.opacity = a > 92.8 && shrink < 0.1 ? 1 : 0;
      if (shrink > 0.1) this.l1.style.opacity = 1 - shrink;
      W.pop(this.seed, a, 94.6); W.pop(this.eq, a, 94.7); W.pop(this.l2, a, 94.76, 'left'); W.pop(this.l3, a, 95.0, 'left');
    },
  });
})();

//@scene seam 95.4 13.4
(function () {
  const S = 95.4, D = 13.4, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('seam', {
    init(kit) {
      let cloth = '<path d="M0 120 H1920 V430 Q1600 470 1300 430 Q1180 520 1080 440 Q800 470 0 430 Z" ' + F.st('#A87650', 5) + '/>';
      for (let y = 160; y < 430; y += 34) cloth += '<path d="M0 ' + y + ' H1920" style="fill:none;stroke:#8A5D3B;stroke-width:5;stroke-dasharray:24 12"/>';
      cloth += '<path d="M1080 440 Q1180 520 1300 430" ' + F.ln('#2A2522', 6) + '/><path d="M1120 436 Q1190 490 1270 432" style="fill:none;stroke:#F6F7FB;stroke-width:5;stroke-dasharray:12 10"/>';
      const skin = '<path d="M0 760 Q480 740 960 760 Q1440 780 1920 756 V1080 H0 Z" ' + F.st('#F2D2B6', 5) + '/>' +
        [[200, 860], [520, 900], [880, 850], [1300, 900], [1660, 860]].map(([x, y]) => '<path d="M' + x + ' ' + y + ' q12 -8 24 0" ' + F.ln('#D9A88A', 5) + '/>').join('');
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + '<g class="se-warm">' + W.glow(1190, 560, 460, '#FFB86B', 0.6) + '</g>' + cloth + skin +
        '<circle class="se-bite" cx="1000" cy="762" r="12" style="fill:#E0675A;stroke:#2A2522;stroke-width:3"/>' +
        F.louse('se-l', '#FFFFFF', false) + '<g class="se-x" transform="translate(1000 640)">' + F.coralX('se-xx', 0.8) + '</g>',
        F.label('Clothing', 80, 300, 64, 'se-lc cut', 'color:#FFFDF4') + F.label('Skin', 80, 930, 64, 'se-ls cut') + F.label('Not here', 1110, 610, 64, 'se-ln cut', 'color:#E0675A') +
        F.label('Seams & folds', 1340, 470, 64, 'se-lf cut') + F.label('Body warmth', 1330, 580, 56, 'se-lw cut', 'color:#C8642E') +
        F.label('feeds several times a day', 260, 600, 60, 'se-lfd') + F.label('digest', 1330, 470, 64, 'se-ld cut', 'color:#E0675A'), '')));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), warm: q('.se-warm'), bite: q('.se-bite'), x: q('.se-xx'), gut: q('.se-l-gut'),
        lc: q('.se-lc'), ls: q('.se-ls'), ln: q('.se-ln'), lf: q('.se-lf'), lw: q('.se-lw'), lfd: q('.se-lfd'), ld: q('.se-ld') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.05, 1100, 560);
      // path: on skin (1000,690) → seam (1190,430, upside down hanging) → down to skin → back to seam
      const up1 = eio(seg(a, 97.98, 99.2)), down = eio(seg(a, 103.4, 104.1)), up2 = eio(seg(a, 106.3, 107.2));
      const skinP = [1000, 670, 0], seamP = [1190, 500, 180];
      let k = up1 * (1 - down) + up2 * down; // 0 = skin, 1 = seam
      const x = lerp(skinP[0], seamP[0], k), y = lerp(skinP[1], seamP[1], k) - 60 * Math.sin(Math.PI * k), rot = lerp(skinP[2], seamP[2], k);
      const moving = (a > 97.98 && a < 99.2) || (a > 103.4 && a < 104.1) || (a > 106.3 && a < 107.2) || (a > 104.1 && a < 105.4);
      F.poseLouse(this.root, 'se-l', x, y, 0.7, rot, a, moving);
      W.pop(this.lc, a, 97.98, 'left'); W.pop(this.ls, a, 96.56, 'left');
      W.pop(this.x, a, 96.56); this.x.style.opacity = a > 96.56 && a < 97.9 ? 1 : 0;
      W.pop(this.ln, a, 96.7, 'left'); if (a > 97.9) this.ln.style.opacity = 0;
      W.pop(this.lf, a, 99.66, 'left'); if (a > 103.2) this.lf.style.opacity = 0;
      this.warm.style.opacity = eio(seg(a, 101.6, 102.4)) * (0.75 + 0.25 * Math.sin(a * 3));
      W.pop(this.lw, a, 101.7, 'left'); if (a > 103.2) this.lw.style.opacity = 0;
      this.bite.style.opacity = a > 104.04 && a < 106.6 ? 1 : 0;
      W.pop(this.lfd, a, 104.34, 'left'); if (a > 106.4) this.lfd.style.opacity = 0;
      this.gut.style.opacity = (0.9 * eo(seg(a, 104.1, 105.2))).toFixed(2);
      W.pop(this.ld, a, 107.6, 'left');
    },
  });
})();

//@scene eggs 108.8 7.1
(function () {
  const S = 108.8, D = 7.1, F = W.F, { seg, eio, eo, lerp } = F;
  const EG = [[420, 0], [560, 1], [700, 2], [840, 3], [980, 4], [1120, 5]];
  kit.scene('eggs', {
    init(kit) {
      let nits = '';
      EG.forEach(([x], i) => (nits += F.nit(x, 516 + (i % 2 ? -10 : 10), i % 2 ? -12 : 12, 'eg-n' + i)));
      kit.stage.append(kit.h(F.frame('<rect width="1920" height="1080" style="fill:#F6F7FB"/>' + '<g class="eg-shake">' + F.weave() + nits + F.louse('eg-l', '#FFFFFF', false) + '</g>' +
        '<g class="eg-lines"><path d="M80 300 h-60 M80 540 h-80 M80 780 h-60 M1840 300 h60 M1840 540 h80 M1840 780 h60" ' + F.ln('#2A2522', 8) + '/></g>',
        '', F.tag('Female louse', 110, 80, 'eg-t1 cut') + F.label('Eggs, glued on', 540, 640, 72, 'eg-t2 cut') + F.label('Shake!', 1460, 160, 120, 'eg-t3 cut', 'color:#E0675A') +
        '<p class="hand-label big eg-t4 cut" style="left:700px;top:820px;font-size:130px">…nothing.</p>')));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), sh: q('.eg-shake'), lines: q('.eg-lines'), n: EG.map((e, i) => q('.eg-n' + i + '-in')), glue: [...kit.stage.querySelectorAll('.glue')],
        t1: q('.eg-t1'), t2: q('.eg-t2'), t3: q('.eg-t3'), t4: q('.eg-t4') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.04, 900, 520);
      // the louse walks along the middle thread laying eggs behind it
      const p = eio(seg(a, 109.4, 111.3));
      F.poseLouse(this.root, 'eg-l', lerp(260, 1300, p), 470, 0.55, 90, a, a > 109.4 && a < 111.3);
      this.n.forEach((g, i) => W.pop(g, a, 109.84 + i * 0.25, 'bottom'));
      this.glue.forEach((g, i) => (g.style.opacity = a > 111.58 + i * 0.05 ? 1 : 0));
      W.pop(this.t1, a, 109.02, 'left'); W.pop(this.t2, a, 111.58, 'left');
      const shaking = a > 113.94 && a < 114.95;
      const sx = shaking ? 40 * Math.sin(a * 55) : 0, sy = shaking ? 22 * Math.sin(a * 43) : 0;
      this.sh.setAttribute('transform', 'translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')');
      this.lines.style.opacity = shaking ? 1 : 0;
      W.pop(this.t3, a, 113.94); if (a > 114.95) this.t3.style.opacity = 0;
      W.pop(this.t4, a, 115.0, 'left');
    },
  });
})();

//@scene shirt 115.9 3.0
(function () {
  const S = 115.9, D = 3.0, F = W.F, { seg, eio, lerp } = F;
  kit.scene('shirt', {
    init(kit) {
      let dots = ''; let k = 3; const r = () => ((k = (k * 1664525 + 1013904223) >>> 0) / 4294967296);
      const inShirt = (x, y) => (y > -360 && y < 0 && Math.abs(x) < 150) || (y > -360 && y < -220 && Math.abs(x) < 280 - (y + 360) * 0.3);
      let n = 0; while (n < 160) { const x = (r() - 0.5) * 560, y = -r() * 380; if (!inShirt(x, y)) continue; dots += '<g class="sh-d" transform="translate(' + (960 + x).toFixed(0) + ' ' + (900 + y).toFixed(0) + ') rotate(' + (r() * 360).toFixed(0) + ')"><ellipse rx="6" ry="9" style="fill:#5C4632"/></g>'; n++; }
      kit.stage.append(kit.h(F.frame(W.bg.paper(W.MOODS.infoPaper) + '<g class="sh-s">' + F.shirt(960, 900, 2.0, '#B79B74') + '</g>' + dots,
        '', F.tag('One unwashed shirt', 110, 80, 'sh-t1 cut') + '<p class="hand-label big sh-t2" style="left:1300px;top:420px;font-size:140px;color:#E0675A">100s</p>')));
      const q = F.q(kit.stage); this.root = kit.stage;
      Object.assign(this, { cam: q('.cam'), s: q('.sh-s'), d: [...kit.stage.querySelectorAll('.sh-d > ellipse')], t1: q('.sh-t1'), t2: q('.sh-t2') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.06, 960, 700);
      W.pop(this.s, a, 116.04, 'bottom'); W.pop(this.t1, a, 116.4, 'left');
      this.d.forEach((e, i) => { const t0 = 117.76 + (i / this.d.length) * 0.7; e.style.opacity = a > t0 ? 1 : 0; e.setAttribute('transform', 'translate(' + (a > t0 ? 2 * Math.sin(a * 9 + i) : 0).toFixed(1) + ' 0)'); });
      W.pop(this.t2, a, 117.76);
    },
  });
})();

//@scene mud 118.9 7.4
(function () {
  const S = 118.9, D = 7.4, F = W.F, { seg, eio, eo, lerp } = F;
  kit.scene('mud', {
    init(kit) {
      const M = Object.assign({}, W.MOODS.fieldSpring, { sky: '#E8D3B6' });
      kit.stage.append(kit.h(F.frame(W.bg.field(M, { seed: 4 }) + F.tent(1560, 820, 0.9, '#D8C7A0') + W.prop.fire(1180, 1000, 1.0, 0) +
        F.log(760, 1000, 1.0) + W.person('md-p', { outfit: 'tunic', color: '#8C7A5B', shade: '#6F5F45', hat: 'kettle', facial: 'stubble', hairColor: 'brown', face: 0.3 }) +
        '<g class="md-flea"><ellipse rx="7" ry="10" style="fill:#5C4632"/></g>' + '<g class="md-mudpos" transform="translate(905 990)"><g>' + F.mudSplat('md-mud') + '</g></g>',
        '', '<p class="hand-label big md-eq cut" style="left:120px;top:110px;font-size:120px">Lice = mud</p>')));
      const q = F.q(kit.stage); this.root = kit.stage; this.P = W.bindPerson(kit.stage, 'md-p');
      Object.assign(this, { cam: q('.cam'), flea: q('.md-flea'), mud: q('.md-mudpos > g'), eq: q('.md-eq') });
    },
    render(t) {
      const a = t + S;
      F.cam(this.cam, a, S, S + D, 1.0, 1.08, 900, 760);
      W.flames(this.root, a);
      const pick = eo(seg(a, 120.2, 120.5)) * (1 - eio(seg(a, 120.9, 121.2)));
      const shrug = eio(seg(a, 122.4, 122.7)) * (1 - eio(seg(a, 123.3, 123.6)));
      const lie = eio(seg(a, 123.6, 124.4));
      W.posePerson(this.P, { x: 760 + 60 * lie, y: 960 - 20 * lie, s: 1.9, lean: -60 * lie, legL: -80 + 30 * lie, legR: -70 + 30 * lie,
        expr: a > 124.1 ? 'sleep' : a > 120.9 ? 'smug' : 'neutral', blink: F.blink(a, 3.1), head: 3 * Math.sin(a * 1.5),
        a1: lerp(lerp(-10, 150, pick), -120, shrug), a2: lerp(lerp(-6, 40, pick), -40, shrug), b1: lerp(10, 120, shrug), b2: 40 * shrug });
      // flick: louse flies off to the right
      const fp = seg(a, 120.9, 121.5); this.flea.style.opacity = a > 120.9 && fp < 1 ? 1 : 0;
      this.flea.setAttribute('transform', 'translate(' + (800 + 700 * fp) + ' ' + (640 - 300 * Math.sin(Math.PI * fp)) + ') rotate(' + (720 * fp) + ')');
      W.drop(this.mud, a, 121.5, 121.74, 500);
      W.pop(this.eq, a, 121.74, 'left');
      F.fade(this.root, t, D, 0, 1.0);
    },
  });
})();
