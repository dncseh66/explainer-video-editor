// Film helpers used by every scene (pure functions of t). Appended after person.js + scenes.js in shared.js.
(function () {
  const W = (window.W = window.W || {});
  const c01 = (x) => Math.max(0, Math.min(1, x));
  const eob = (x, k) => { k = k || 1.7; x = c01(x); const y = x - 1; return 1 + (k + 1) * y * y * y + k * y * y; };
  W.c01 = c01; W.eobk = eob;
  // pop-in with overshoot (DIRECTING §5): returns scale 0..~1.15..1
  W.popS = (t, t0, d) => (t < t0 ? 0 : eob((t - t0) / (d || 0.28), 1.7));
  // apply a pop to an element (SVG <g> or HTML); origin 'center' or 'bottom'
  W.pop = (el, t, t0, origin, d) => {
    const s = W.popS(t, t0, d);
    el.style.transformBox = 'fill-box';
    el.style.transformOrigin = origin === 'bottom' ? '50% 100%' : origin === 'left' ? '0% 50%' : '50% 50%';
    el.style.transform = 'scale(' + Math.max(0.001, s).toFixed(3) + ')';
    el.style.opacity = t < t0 ? 0 : 1;
  };
  // drop from above with squash on landing
  W.drop = (el, t, t0, t1, dist) => {
    const p = c01((t - t0) / (t1 - t0)), y = (1 - p * p) * -(dist || 600);
    const sq = t > t1 ? 1 - 0.15 * Math.exp(-(t - t1) * 14) * Math.cos((t - t1) * 30) : 1;
    el.style.transformBox = 'fill-box'; el.style.transformOrigin = '50% 100%';
    el.style.transform = 'translateY(' + y.toFixed(1) + 'px) scale(' + (2 - sq).toFixed(3) + ',' + sq.toFixed(3) + ')';
    el.style.opacity = t < t0 ? 0 : 1;
  };
  // flicker every .kit-flame inside root
  W.flames = (root, t) => root.querySelectorAll('.kit-flame').forEach((g, i) => { const k = 1 + 0.07 * Math.sin(t * 13 + i * 2.1) + 0.04 * Math.sin(t * 29 + i); g.style.transform = 'scale(' + (1 / k).toFixed(3) + ',' + k.toFixed(3) + ')'; });
  // reaction take helper: head squash curve for a take starting at t0
  W.take = (t, t0) => 1 + 0.12 * Math.sin(Math.PI * c01((t - t0) / 0.3));
  W.tremble = (t, t0, t1) => (t > t0 && t < t1 ? 3 * Math.sin(t * 48) : 0);
  // the channel narrator
  W.NARRATOR = { outfit: 'robe', glasses: true, item: 'pointer', face: 0.35 };
})();
