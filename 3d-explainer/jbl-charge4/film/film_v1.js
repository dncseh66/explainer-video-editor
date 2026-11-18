// JBL Charge 4 — 10 s pilot. Deterministic: everything on screen is a pure function of t (seconds = voiceover clock).
// Style rules: ../../STUDY.md (Jared Owen study). Shot list: ../timing.json.
import * as THREE from 'three';
import { RoomEnvironment } from './lib/RoomEnvironment.js';

const W = 1920, H = 1080, SS = 2;           // supersample: render 2x, downscale into the output canvas
const DUR = 12.0;
const err = (m) => (document.getElementById('err').textContent += m + '\n');
window.onerror = (m, s, l) => err(m + ' @' + l);

// ---------- easing / timing helpers
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
const eio = (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const lerp = (a, b, p) => a + (b - a) * p;
const inOut = (t, a, b, c, d) => eio(seg(t, a, b)) * (1 - eio(seg(t, c, d))); // 0 → 1 (a..b) hold → 0 (c..d)

// word starts from output/voiceover json (see timing.json)
const T = { title: 0.86, inside: 2.84, driver: 3.6, two: 5.2, passive: 5.44, rad: 5.84, pump: 6.42, and: 7.76, bat: 8.2, powers: 10.16 };

// ---------- renderer
const gl = document.createElement('canvas'); gl.id = 'gl';
const renderer = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W * SS, H * SS, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const out = document.getElementById('out'), ctx = out.getContext('2d');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;
const camera = new THREE.PerspectiveCamera(28, W / H, 0.5, 2000);

// lights: one strong "sun" key from upper front-left, soft fill, cool rim from behind (STUDY §3)
const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-14, 22, 18); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 80 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
scene.add(key);
const rim = new THREE.DirectionalLight(0xcfe0ff, 1.8); rim.position.set(10, 8, -20); scene.add(rim);
const fill = new THREE.DirectionalLight(0xffffff, 0.35); fill.position.set(18, -4, 10); scene.add(fill);

// ---------- seeded random + star field
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
{
  const n = 2600, p = new Float32Array(n * 3), c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = 900, s = Math.sqrt(1 - u * u);
    p.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th)], i * 3);
    const b = 0.25 + Math.pow(rnd(), 3) * 0.75; c.set([b, b, b * (0.95 + rnd() * 0.1)], i * 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true })));
}

// ---------- procedural textures
function canvasTex(w, h, draw, srgb = true) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// woven fabric: fine over/under weave tile (colour + bump)
function weave(ctx, w, h, base, dark, light) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
  const s = 8;
  for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
    const over = ((x + y) / s) % 2 === 0;
    const g = over ? ctx.createLinearGradient(x, y, x + s, y) : ctx.createLinearGradient(x, y, x, y + s);
    g.addColorStop(0, dark); g.addColorStop(0.5, light); g.addColorStop(1, dark);
    ctx.fillStyle = g; ctx.fillRect(x + 0.5, y + 0.5, s - 1, s - 1);
  }
}
const fabricMap = canvasTex(256, 256, (c, w, h) => weave(c, w, h, '#123a78', '#163f80', '#2a63b8'));
const fabricBump = canvasTex(256, 256, (c, w, h) => weave(c, w, h, '#000', '#202020', '#e0e0e0'), false);
for (const t of [fabricMap, fabricBump]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(16, 7); }

const logoTex = (bg, fg, w = 512, h = 192, r = 40) => canvasTex(w, h, (c) => {
  c.fillStyle = bg; c.beginPath(); c.roundRect(0, 0, w, h, r); c.fill();
  c.fillStyle = fg; c.font = 'italic 900 150px "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('JBL', w / 2, h / 2 + 8);
});
// cap UVs (CylinderGeometry, axis turned to X): the left (-X) cap shows the canvas as drawn, the right (+X) cap shows it turned 180°
const plateCanvas = (turn) => canvasTex(512, 512, (c, w, h) => {
  const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); g.addColorStop(0, '#1e4f99'); g.addColorStop(1, '#173f7c');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(255,255,255,0.22)'; c.font = 'italic 900 120px "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.translate(w / 2, h / 2); c.rotate(turn); c.fillText('JBL', 0, 0);
});
const plateTex = plateCanvas(Math.PI), plateTexL = plateCanvas(0);
const batteryTex = canvasTex(1024, 256, (c, w, h) => {
  c.fillStyle = '#1b1d22'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#e8e8e8'; c.fillRect(40, 40, 520, 176);
  c.fillStyle = '#16181c'; c.font = 'bold 54px "Helvetica Neue", Arial, sans-serif'; c.fillText('Li-ion Battery Pack', 64, 110);
  c.font = '44px "Helvetica Neue", Arial, sans-serif'; c.fillText('3.6V   7500mAh', 64, 180);
  c.fillStyle = '#f2c230'; c.fillRect(620, 40, 120, 176); c.fillStyle = '#1b1d22'; c.font = 'bold 40px Arial'; c.fillText('!', 670, 145);
});
const pcbTex = canvasTex(1024, 256, (c, w, h) => {
  c.fillStyle = '#145c34'; c.fillRect(0, 0, w, h);
  c.strokeStyle = 'rgba(160,220,170,0.35)'; c.lineWidth = 3;
  for (let i = 0; i < 40; i++) { c.beginPath(); const y = 20 + rnd() * 216; c.moveTo(rnd() * w, y); c.lineTo(rnd() * w, y); c.lineTo(rnd() * w, 20 + rnd() * 216); c.stroke(); }
  c.fillStyle = '#c9a54a'; for (let i = 0; i < 120; i++) c.fillRect(rnd() * w, rnd() * h, 6, 6);
});

// ---------- materials
const M = {
  fabric: new THREE.MeshStandardMaterial({ map: fabricMap, bumpMap: fabricBump, bumpScale: 1.6, roughness: 0.92, metalness: 0 }),
  fabricIn: new THREE.MeshStandardMaterial({ color: 0x0c1f40, roughness: 1, side: THREE.BackSide }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x15396f, roughness: 0.62, metalness: 0 }),
  rubberDark: new THREE.MeshStandardMaterial({ color: 0x0f2a55, roughness: 0.55 }),
  plate: new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.4, metalness: 0.1 }),
  plateL: new THREE.MeshStandardMaterial({ map: plateTexL, roughness: 0.4, metalness: 0.1 }),
  enclosure: new THREE.MeshStandardMaterial({ color: 0x17181b, roughness: 0.55, side: THREE.DoubleSide }),
  basket: new THREE.MeshStandardMaterial({ color: 0x232427, roughness: 0.45, metalness: 0.2 }),
  cone: new THREE.MeshStandardMaterial({ color: 0x2b2c30, roughness: 0.85 }),
  surround: new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.5 }),
  cap: new THREE.MeshStandardMaterial({ color: 0x0d0d0f, roughness: 0.18, metalness: 0.3 }),
  magnet: new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.25, metalness: 1 }),
  battery: new THREE.MeshStandardMaterial({ map: batteryTex, roughness: 0.5 }),
  batteryEdge: new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.5 }),
  pcb: new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.5 }),
  chip: new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.35 }),
  wireR: new THREE.MeshStandardMaterial({ color: 0xc8241f, roughness: 0.5 }),
  wireK: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }),
};

// ---------- highlight: cyan screen-space contour around a part (STUDY §3 "cyan outline")
// Each highlighted group lives on its own layer (1..3). Its silhouette is drawn white into one channel of a mask,
// then a full-screen pass draws cyan where the dilated mask is set but the pixel itself is not → a clean outer contour.
const HL = [];                                 // { layer, alpha }
function outline(group) {
  const L = HL.length + 1; group.traverse((o) => { if (o.isMesh) o.layers.enable(L); });
  const h = { layer: L, a: 0 }; HL.push(h); return h;
}
const maskRT = new THREE.WebGLRenderTarget(W * SS, H * SS);
const maskMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const edgeMat = new THREE.ShaderMaterial({
  uniforms: { mask: { value: maskRT.texture }, px: { value: new THREE.Vector2(1 / (W * SS), 1 / (H * SS)) }, rad: { value: 4.0 * SS }, al: { value: new THREE.Vector3() }, col: { value: new THREE.Color(0x3fe8d6) } },
  vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
  fragmentShader: `uniform sampler2D mask; uniform vec2 px; uniform float rad; uniform vec3 al; uniform vec3 col; varying vec2 v;
    void main(){
      vec3 c = texture2D(mask, v).rgb; vec3 m = c;
      for (int i = 0; i < 24; i++) { float a = 6.2831853 * float(i) / 24.0;
        for (int k = 1; k <= 3; k++) m = max(m, texture2D(mask, v + vec2(cos(a), sin(a)) * px * rad * float(k) / 3.0).rgb); }
      vec3 e = clamp(m - c, 0.0, 1.0) * al;
      float A = max(e.r, max(e.g, e.b));
      gl_FragColor = vec4(col, A);
    }`,
  transparent: true, depthTest: false, depthWrite: false,
});
const quadScene = new THREE.Scene(); quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), edgeMat));
const CH = [new THREE.Color(1, 0, 0), new THREE.Color(0, 1, 0), new THREE.Color(0, 0, 1)];
function renderHighlights() {
  if (!HL.some((h) => h.a > 0.001)) return;
  const bg = scene.background; scene.background = null; scene.overrideMaterial = maskMat;
  renderer.setRenderTarget(maskRT); renderer.setClearColor(0x000000, 1); renderer.clear();
  renderer.autoClear = false;
  for (const h of HL) if (h.a > 0.001) { maskMat.color.copy(CH[h.layer - 1]); camera.layers.set(h.layer); renderer.render(scene, camera); }
  camera.layers.set(0); scene.overrideMaterial = null; scene.background = bg;
  renderer.setRenderTarget(null);
  edgeMat.uniforms.al.value.set(...[0, 1, 2].map((i) => (HL[i] ? HL[i].a : 0)));
  renderer.render(quadScene, quadCam);
  renderer.autoClear = true;
}

// ---------- the speaker (units: cm; length 22, Ø ~9.5; axis = X, front = +Z, up = +Y)
const R = 4.62, HALF = 8.6;
const speaker = new THREE.Group(); scene.add(speaker);
const cast = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
const alongX = (g) => g.rotateZ(-Math.PI / 2); // cylinder/lathe axis Y → X

// fabric shell in two halves: theta 0..π = lower half (incl. front-lower), π..2π = upper half (see geometry note in timing)
function shellHalf(upper) {
  const g = alongX(new THREE.CylinderGeometry(R, R, HALF * 2, 160, 1, true, upper ? Math.PI : 0, Math.PI));
  return new THREE.Mesh(g, M.fabric);
}
const lower = new THREE.Group(), upper = new THREE.Group(); speaker.add(lower, upper);
lower.add(cast(shellHalf(false)));
const upperShell = cast(shellHalf(true)); upper.add(upperShell);
// inner black enclosure (only the lower half: it is what we look into once the top is off)
lower.add(new THREE.Mesh(alongX(new THREE.CylinderGeometry(R - 0.32, R - 0.32, HALF * 2, 120, 1, true, 0, Math.PI)), M.enclosure));
{ // the enclosure's cut edge rim so the open shell reads as a solid wall
  const rimG = new THREE.BoxGeometry(HALF * 2, 0.12, 0.34);
  for (const z of [R - 0.16, -(R - 0.16)]) { const b = new THREE.Mesh(rimG, M.enclosure); b.position.set(0, 0, z); lower.add(b); }
}

// rubber end rings + passive radiators (each end)
const radiators = [];
for (const side of [-1, 1]) {
  const prof = [];
  for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI; prof.push(new THREE.Vector2(R - 0.55 + Math.sin(a) * 0.75, (Math.cos(a) * 0.95))); }
  const ringG = new THREE.LatheGeometry(prof.concat([new THREE.Vector2(3.45, -0.95), new THREE.Vector2(3.45, 0.95), prof[0].clone()]), 160);
  const ring = cast(new THREE.Mesh(alongX(ringG), M.rubber)); ring.position.x = side * (HALF + 0.55); speaker.add(ring);

  const rad = new THREE.Group(); rad.position.x = side * (HALF + 1.2); speaker.add(rad);
  // surround roll + flat plate facing outward (±X)
  const sur = cast(new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.42, 24, 160), M.rubberDark)); sur.rotation.y = Math.PI / 2; rad.add(sur);
  const plateG = new THREE.CylinderGeometry(2.75, 2.75, 0.34, 120); plateG.rotateZ(-side * Math.PI / 2);
  const pm = side > 0 ? M.plate : M.plateL;
  const plate = cast(new THREE.Mesh(plateG, [M.rubberDark, pm, M.rubberDark])); // logo only on the outer face
  plate.position.x = side * 0.08; rad.add(plate);
  plate.rotation.x = side * 0; rad.userData.base = rad.position.x; rad.userData.side = side;
  // the plate's cap face texture needs its logo upright: rotate around the axis so "JBL" reads horizontally
  plate.rotation.x = 0;
  radiators.push(rad);
}

// rubber base (keeps it from rolling), button strip on top, JBL badge on the front
{
  const base = cast(new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.9, 3.2), M.rubber)); base.position.set(0, -R + 0.25, 0); lower.add(base);
  const strip = cast(new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.5, 1.7), M.rubber)); strip.position.set(0, R - 0.05, 0); upper.add(strip);
  const btnG = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 40);
  [-3.6, -1.8, 0, 1.8, 3.6].forEach((x, i) => { const b = cast(new THREE.Mesh(btnG, i === 2 ? M.rubberDark : M.rubber)); b.position.set(x, R + 0.32, 0); b.scale.set(i === 2 ? 1.25 : 1, 1, 1); upper.add(b); });
  const badgeMat = new THREE.MeshStandardMaterial({ map: logoTex('#ff5a0a', '#ffffff'), roughness: 0.35 });
  const badgeG = new THREE.CylinderGeometry(R + 0.06, R + 0.06, 3.9, 64, 1, true, -0.2, 0.4); alongX(badgeG);
  // map the badge texture onto that small patch of cylinder: rewrite UVs from position
  const pos = badgeG.attributes.position, uv = badgeG.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / 3.9 + 0.5, (pos.getY(i) / (R * 0.4)) * 0.5 + 0.5);
  const badge = new THREE.Mesh(badgeG, badgeMat); badge.rotation.x = -0.1; upper.add(badge);
  // a short real front band: the Charge 4 badge sits a little above centre on the front
}

// ---------- internals
const internals = new THREE.Group(); speaker.add(internals);

// the driver: oval cone (racetrack-ish), facing front (+Z)
const driver = new THREE.Group(); driver.position.set(0, 0.2, 2.1); internals.add(driver);
const SX = 1.65; // oval stretch along X
const coneG = new THREE.LatheGeometry([0, 0.35, 0.8, 1.3, 1.8, 2.25].map((r, i) => new THREE.Vector2(r, -1.1 + i * 0.22 + r * 0.1)), 96);
coneG.rotateX(Math.PI / 2);
const coneMove = new THREE.Group(); driver.add(coneMove);
const cone = cast(new THREE.Mesh(coneG, M.cone)); cone.scale.set(SX, 1, 1); coneMove.add(cone);
const capM = cast(new THREE.Mesh(new THREE.SphereGeometry(0.8, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), M.cap)); capM.rotation.x = Math.PI / 2; capM.scale.set(SX * 0.9, 0.5, 1); capM.position.z = -0.6; coneMove.add(capM);
const surD = cast(new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.22, 20, 120), M.surround)); surD.scale.set(SX, 1, 1); surD.position.z = 0.12; driver.add(surD);
const frame = cast(new THREE.Mesh(new THREE.TorusGeometry(2.78, 0.16, 12, 120), M.basket)); frame.scale.set(SX, 1, 0.6); frame.position.z = 0.1; driver.add(frame);
const basket = cast(new THREE.Mesh(new THREE.CylinderGeometry(2.6, 1.0, 1.4, 64, 1, true), M.basket)); basket.rotation.x = Math.PI / 2; basket.scale.set(SX, 1, 1); basket.position.z = -0.75; driver.add(basket);
const magnet = cast(new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.9, 64), M.magnet)); magnet.rotation.x = Math.PI / 2; magnet.position.z = -1.75; driver.add(magnet);
driver.rotation.x = -0.08;

// battery pack: behind the driver, low in the body
const battery = new THREE.Group(); battery.position.set(0, -1.6, -1.8); internals.add(battery);
{
  const g = new THREE.BoxGeometry(13.2, 2.1, 3.1);
  const b = cast(new THREE.Mesh(g, [M.batteryEdge, M.batteryEdge, M.battery, M.batteryEdge, M.batteryEdge, M.batteryEdge])); battery.add(b);
  // the label faces up (+Y) where the camera can read it once it rises
  const lead = (mat, z) => { const w = cast(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(6.6, 0.4, z), new THREE.Vector3(7.4, 1.0, z), new THREE.Vector3(7.2, 2.6, z - 0.6), new THREE.Vector3(4.8, 2.4, -1.0)]), 40, 0.09, 8), mat)); battery.add(w); };
  lead(M.wireR, 0.3); lead(M.wireK, -0.1);
}
const batteryCells = battery.children[0];

// main board along the back
const pcb = new THREE.Group(); pcb.position.set(0, 1.2, -2.6); pcb.rotation.x = -0.35; internals.add(pcb);
{
  pcb.add(cast(new THREE.Mesh(new THREE.BoxGeometry(11, 2.4, 0.14), [M.pcb, M.pcb, M.pcb, M.pcb, M.pcb, M.pcb])));
  [[-3.5, 0.2, 1.2, 1.2], [-1.2, -0.3, 0.8, 0.8], [1.5, 0.3, 1.6, 0.9], [3.8, -0.2, 0.7, 0.7]].forEach(([x, y, w, h]) => {
    const c = cast(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.18), M.chip)); c.position.set(x, y, 0.16); pcb.add(c);
  });
}

// highlights
const hiDriver = outline(driver);
const hiRad = { a: 0 }; { const L = HL.length + 1; radiators.forEach((r) => r.traverse((o) => o.isMesh && o.layers.enable(L))); Object.assign(hiRad, { layer: L }); HL.push(hiRad); }
const hiBat = outline(batteryCells);

// ---------- labels (drawn in 2D on top of the render; STUDY §4)
const SERIF = 'bold 54px Georgia, "Times New Roman", serif', SANS = '34px "Helvetica Neue", Arial, sans-serif';
function screen(v3) { const p = v3.clone().project(camera); return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H }; }
function text(str, x, y, font, a, align = 'left') {
  ctx.save(); ctx.globalAlpha = a; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 2; ctx.fillStyle = '#fff'; ctx.fillText(str, x, y); ctx.restore();
}
function leader(from, to, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
  ctx.beginPath(); ctx.arc(from.x, from.y, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
}
const wp = (obj, x, y, z) => obj.localToWorld(new THREE.Vector3(x, y, z));

// ---------- camera path (eased keys; az/el in degrees, camera always drifting)
const camKeys = [
  { t: 0.0, az: -38, el: 9, d: 46, ty: 0.0 },
  { t: 2.7, az: -26, el: 12, d: 43, ty: 0.0 },
  { t: 3.9, az: -14, el: 34, d: 36, ty: -0.4 },
  { t: 5.1, az: -6, el: 36, d: 35, ty: -0.4 },
  { t: 6.3, az: -40, el: 20, d: 37, ty: 0.0 },
  { t: 7.7, az: -46, el: 18, d: 37, ty: 0.0 },
  { t: 8.9, az: -18, el: 22, d: 44, ty: 3.2 },
  { t: 10.1, az: -12, el: 22, d: 44, ty: 3.2 },
  { t: 11.1, az: -26, el: 10, d: 44, ty: 0.0 },
  { t: 12.0, az: -21, el: 10, d: 43, ty: 0.0 },
];
function camAt(t) {
  let i = 0; while (i < camKeys.length - 2 && t > camKeys[i + 1].t) i++;
  const A = camKeys[i], B = camKeys[i + 1], p = eio(seg(t, A.t, B.t));
  const az = THREE.MathUtils.degToRad(lerp(A.az, B.az, p)), el = THREE.MathUtils.degToRad(lerp(A.el, B.el, p)), d = lerp(A.d, B.d, p), ty = lerp(A.ty, B.ty, p);
  camera.position.set(d * Math.sin(az) * Math.cos(el), ty + d * Math.sin(el), d * Math.cos(az) * Math.cos(el));
  camera.lookAt(0, ty, 0);
}

// ---------- the timeline
function render(t) {
  // shell opens on "Inside", closes on "powers"
  const open = eio(seg(t, T.inside - 0.1, T.inside + 0.75)) * (1 - eio(seg(t, T.powers + 0.1, T.powers + 0.95)));
  upper.position.set(0, open * 7.5, -open * 2.5);
  upper.rotation.x = -open * 0.25;
  M.fabric.opacity = 1; // lower half stays solid
  const upFade = 1 - eio(seg(open, 0.15, 0.85));
  upper.traverse((o) => { if (o.isMesh) { if (!o.userData.mats) o.userData.mats = (Array.isArray(o.material) ? o.material : [o.material]).map((m) => { const c = m.clone(); c.transparent = true; return c; }); o.material = o.userData.mats.length === 1 ? o.userData.mats[0] : o.userData.mats; o.userData.mats.forEach((m) => (m.opacity = upFade)); o.castShadow = upFade > 0.5; } });
  upper.visible = upFade > 0.02;

  // driver cone moves with the music; radiators follow in phase, big excursion on "pump"
  const beat = Math.sin(t * Math.PI * 2 * 2.0);
  const play = seg(t, T.inside, T.inside + 0.6);
  coneMove.position.z = play * (0.06 * Math.sin(t * Math.PI * 2 * 7) + 0.12 * Math.max(0, beat) * seg(t, T.driver, T.driver + 0.3));
  const big = inOut(t, T.pump - 0.15, T.pump + 0.15, 7.55, 7.95);
  const small = 0.07 * seg(t, 1.0, 1.6);
  radiators.forEach((r) => { const ex = (small + big * 0.75) * Math.max(-0.4, Math.sin(t * Math.PI * 2 * 2.2)); r.position.x = r.userData.base + r.userData.side * ex; });

  // battery rises out on "and", drops back on "powers"
  const up = eio(seg(t, T.and - 0.05, T.and + 0.75)) * (1 - eio(seg(t, T.powers - 0.1, T.powers + 0.6)));
  battery.position.set(0, -1.6 + up * 9.5, -1.8 + up * 1.8);
  battery.rotation.x = up * 0.32;

  // highlights
  hiDriver.a = 0.95 * inOut(t, T.driver - 0.05, T.driver + 0.2, 4.85, 5.2);
  hiRad.a = 0.95 * inOut(t, T.passive, T.passive + 0.25, 7.45, 7.8);
  hiBat.a = 0.95 * inOut(t, T.bat - 0.1, T.bat + 0.15, 9.9, 10.2);

  camAt(t);
  speaker.updateMatrixWorld(true);
  renderer.render(scene, camera);
  renderHighlights();

  ctx.drawImage(gl, 0, 0, W, H);

  // caption label under the hero (and back for the end card)
  const aTitle = inOut(t, T.title, T.title + 0.45, 2.45, 2.85);
  const aEnd = seg(t, 11.0, 11.5);
  for (const a of [aTitle, aEnd]) if (a > 0) {
    const p = screen(new THREE.Vector3(0, -R - 2.4, 0));
    text('JBL Charge 4', p.x, p.y + 30 - 8 * eo(a), 'bold 76px Georgia, "Times New Roman", serif', a, 'center');
    text('2018', p.x, p.y + 92 - 8 * eo(a), SANS, a * seg(a, 0.4, 1), 'center');
  }
  // callouts
  const aDrv = inOut(t, T.driver, T.driver + 0.35, 4.85, 5.15);
  if (aDrv > 0) { const p = screen(wp(driver, 2.4 * SX * 0.62, 1.4, 0.2)); const L = { x: p.x + 150, y: p.y - 90 }; leader(p, { x: L.x - 14, y: L.y }, aDrv); text('Driver', L.x, L.y, SERIF, aDrv); }
  const aRad = inOut(t, T.rad, T.rad + 0.35, 7.45, 7.8);
  if (aRad > 0) {
    const pa = screen(wp(radiators[0], 0, 2.2, 0)), pb = screen(wp(radiators[1], 0, 2.6, 0));
    const L = { x: (pa.x + pb.x) / 2 - 40, y: Math.min(pa.y, pb.y) - 170 };
    leader(pa, { x: L.x - 10, y: L.y + 26 }, aRad); leader(pb, { x: L.x + 130, y: L.y + 26 }, aRad);
    text('Passive Radiators', L.x + 60, L.y - 6, SERIF, aRad, 'center');
  }
  const aBat = inOut(t, T.bat, T.bat + 0.35, 9.85, 10.2);
  if (aBat > 0) {
    const p = screen(wp(battery, 6.6, 0.4, 1.4)); const L = { x: p.x + 120, y: p.y - 70 };
    leader(p, { x: L.x - 14, y: L.y }, aBat); text('Battery', L.x, L.y, SERIF, aBat);
    text('7,500 mAh', L.x + 2, L.y + 54, SANS, aBat * seg(aBat, 0.5, 1));
  }
}

// ---------- player + offline frame export (same protocol as the 2D films: POST /frame/<n>, /log, /done)
const sl = document.getElementById('t'); sl.max = DUR;
const show = (t) => { document.getElementById('lab').textContent = t.toFixed(2); render(t); };
sl.oninput = () => show(+sl.value);
let playing = false, base = 0, from = 0;
document.getElementById('play').onclick = () => { playing = !playing; base = performance.now(); from = +sl.value; };
(function loop(now) { if (playing) { let t = from + (now - base) / 1000; if (t > DUR) { t = 0; from = 0; base = now; } sl.value = t; show(t); } requestAnimationFrame(loop); })(0);

window.renderAll = async (fps = 30, a = 0, b = DUR) => {
  const st = document.getElementById('st'); let inflight = [];
  for (let i = Math.round(a * fps); i < Math.round(b * fps); i++) {
    render(i / fps);
    const blob = await new Promise((r) => out.toBlob(r, 'image/jpeg', 0.92));
    inflight.push(fetch('/frame/' + i, { method: 'POST', body: blob })); if (inflight.length > 6) await inflight.shift();
    if (i % 30 === 0) { st.textContent = ' frame ' + i; await fetch('/log', { method: 'POST', body: 'frame ' + i }); }
  }
  await Promise.all(inflight); await fetch('/done', { method: 'POST', body: 'ok' }); return 'done';
};
await document.fonts.ready;
const P = new URLSearchParams(location.search);
show(+(P.get('t') || 0));
window.ready = true;
if (P.get('auto')) renderAll(30, +(P.get('from') || 0), P.get('to') ? +P.get('to') : DUR).catch((e) => fetch('/log', { method: 'POST', body: 'ERR ' + e.stack }));
