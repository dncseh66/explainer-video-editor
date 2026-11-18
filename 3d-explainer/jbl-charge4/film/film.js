// JBL Charge 4 — 10 s pilot, v2 (model rebuilt from real reference: ../reference/REFERENCE.md).
// Deterministic: everything on screen is a pure function of t (seconds = voiceover clock).
// Style rules: ../../STUDY.md (Jared Owen study). Shot list: ../timing.json. Previous version: film_v1.js.
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
const inOut = (t, a, b, c, d) => eio(seg(t, a, b)) * (1 - eio(seg(t, c, d)));

// word starts from the voiceover json (see timing.json)
const T = { title: 0.86, inside: 2.84, driver: 3.6, two: 5.2, passive: 5.44, rad: 5.84, pump: 6.42, and: 7.76, bat: 8.2, powers: 10.16 };

// ---------- renderer
const gl = document.createElement('canvas');
const renderer = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W * SS, H * SS, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const out = document.getElementById('out'), ctx = out.getContext('2d');

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.7;
const camera = new THREE.PerspectiveCamera(28, W / H, 0.5, 2000);

// lights: key from upper front-left, strong cool rim from behind-right so the black product separates from the backdrop
const key = new THREE.DirectionalLight(0xffffff, 2.8); key.position.set(-16, 26, 20); key.castShadow = true;
key.shadow.mapSize.set(4096, 4096); Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90 });
key.shadow.bias = -0.0003; key.shadow.normalBias = 0.03; key.shadow.radius = 6; scene.add(key);
const rim = new THREE.DirectionalLight(0xdce8ff, 3.0); rim.position.set(14, 12, -22); scene.add(rim);
const rim2 = new THREE.DirectionalLight(0xffffff, 1.2); rim2.position.set(-20, 6, -14); scene.add(rim2);
const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(20, -2, 14); scene.add(fill);

// ---------- seeded random
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ---------- procedural textures
function canvasTex(w, h, draw, srgb = true) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// studio backdrop: soft charcoal radial gradient (STUDY §3: neutral grey studio for an isolated product)
scene.background = canvasTex(1024, 576, (c, w, h) => {
  const g = c.createRadialGradient(w * 0.5, h * 0.42, 20, w * 0.5, h * 0.5, w * 0.62);
  g.addColorStop(0, '#4a4e55'); g.addColorStop(0.55, '#2b2d32'); g.addColorStop(1, '#121315'); c.fillStyle = g; c.fillRect(0, 0, w, h);
});
// woven fabric (colour + bump)
function weave(c, w, h, base, dark, light) {
  c.fillStyle = base; c.fillRect(0, 0, w, h); const s = 8;
  for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
    const over = ((x + y) / s) % 2 === 0;
    const g = over ? c.createLinearGradient(x, y, x + s, y) : c.createLinearGradient(x, y, x, y + s);
    g.addColorStop(0, dark); g.addColorStop(0.5, light); g.addColorStop(1, dark); c.fillStyle = g; c.fillRect(x + 0.5, y + 0.5, s - 1, s - 1);
  }
}
const fabricMap = canvasTex(256, 256, (c, w, h) => weave(c, w, h, '#141518', '#191a1e', '#3a3d44'));
const fabricBump = canvasTex(256, 256, (c, w, h) => weave(c, w, h, '#000', '#1a1a1a', '#e8e8e8'), false);
for (const t of [fabricMap, fabricBump]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(20, 9); }
// knurled bumper edge
const knurl = canvasTex(2048, 16, (c, w, h) => { c.fillStyle = '#777'; c.fillRect(0, 0, w, h); c.fillStyle = '#222'; for (let x = 0; x < w; x += 8) c.fillRect(x, 0, 3, h); }, false);

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';
// the JBL "!" mark: a down-pointing triangle over a dot
function bang(c, x, y, s) { c.beginPath(); c.moveTo(x - s * 0.5, y - s); c.lineTo(x + s * 0.5, y - s); c.lineTo(x, y + s * 0.25); c.closePath(); c.fill(); c.beginPath(); c.arc(x, y + s * 0.62, s * 0.27, 0, Math.PI * 2); c.fill(); }
// front badge: orange-red rounded square, white "!JBL"
const badgeTex = canvasTex(256, 288, (c, w, h) => {
  c.fillStyle = '#ee4a1f'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 34); c.fill();
  c.fillStyle = '#fff'; bang(c, 52, 132, 26);
  c.font = `bold 108px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.save(); c.scale(0.86, 1); c.fillText('JBL', 92 / 0.86, 150); c.restore();
});
// radiator plate: grey with fine diagonal hatching + embossed logo
function plateDraw(logo, bump) {
  return (c, w, h) => {
    c.fillStyle = bump ? '#808080' : '#8d9196'; c.fillRect(0, 0, w, h);
    c.strokeStyle = bump ? '#5a5a5a' : '#7a7e83'; c.lineWidth = 3;
    for (let k = -h; k < w; k += 9) { c.beginPath(); c.moveTo(k, h); c.lineTo(k + h, 0); c.stroke(); }
    c.save(); c.translate(w / 2, h / 2);
    const fillLogo = () => { if (logo === 'JBL') { bang(c, -150, -10, 44); c.font = `bold 210px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('JBL', -112, 8); } else { bang(c, 0, -40, 120); } };
    c.fillStyle = bump ? '#d8d8d8' : '#a4a8ad'; fillLogo();
    c.restore();
  };
}
const plateTex = { JBL: canvasTex(512, 512, plateDraw('JBL', false)), bang: canvasTex(512, 512, plateDraw('bang', false)) };
const plateBump = { JBL: canvasTex(512, 512, plateDraw('JBL', true), false), bang: canvasTex(512, 512, plateDraw('bang', true), false) };
// top control strip: icons pressed into the fabric + glossy pill with Power and Bluetooth (texture spans x -5..5)
const topTex = canvasTex(2048, 256, (c, w, h) => {
  const X = (cm) => (cm + 5) / 10 * w, cy = h / 2;
  c.clearRect(0, 0, w, h);
  c.fillStyle = '#25272c'; c.strokeStyle = '#6b6f77'; c.lineWidth = 7; c.beginPath(); c.roundRect(X(-1.25), cy - 66, X(1.25) - X(-1.25), 132, 66); c.fill(); c.stroke();
  c.strokeStyle = '#d9dce0'; c.fillStyle = '#d9dce0'; c.lineWidth = 9; c.lineCap = 'round';
  c.beginPath(); c.arc(X(-0.5), cy + 4, 30, -Math.PI * 0.32, Math.PI * 1.32); c.stroke(); c.beginPath(); c.moveTo(X(-0.5), cy - 34); c.lineTo(X(-0.5), cy); c.stroke(); // power
  const bx = X(0.5); c.lineWidth = 7; c.beginPath(); c.moveTo(bx - 18, cy - 18); c.lineTo(bx + 18, cy + 18); c.lineTo(bx, cy + 36); c.lineTo(bx, cy - 36); c.lineTo(bx + 18, cy - 18); c.lineTo(bx - 18, cy + 18); c.stroke(); // bluetooth
  c.strokeStyle = '#55585f'; c.fillStyle = '#55585f'; c.lineWidth = 9;
  c.beginPath(); c.moveTo(X(-2.6) - 30, cy); c.lineTo(X(-2.6) + 30, cy); c.stroke(); // −
  c.beginPath(); c.moveTo(X(2.6) - 30, cy); c.lineTo(X(2.6) + 30, cy); c.moveTo(X(2.6), cy - 30); c.lineTo(X(2.6), cy + 30); c.stroke(); // +
  c.beginPath(); c.moveTo(X(4.0) - 22, cy - 32); c.lineTo(X(4.0) + 30, cy); c.lineTo(X(4.0) - 22, cy + 32); c.closePath(); c.stroke(); // ▷
  const cx = X(-4.0); c.beginPath(); c.moveTo(cx - 34, cy - 26); c.lineTo(cx + 34, cy + 26); c.lineTo(cx + 34, cy - 26); c.lineTo(cx - 34, cy + 26); c.closePath(); c.stroke(); // Connect+ bow-tie
});
// back rubber panel: stadium, raised pill "CHARGE4", hatched oval below (x -5.4..5.4)
const backTex = canvasTex(1024, 512, (c, w, h) => {
  c.clearRect(0, 0, w, h); c.fillStyle = '#1f2023'; c.beginPath(); c.roundRect(6, 6, w - 12, h + 200, 200); c.fill();
  c.fillStyle = '#2a2c30'; c.beginPath(); c.roundRect(w * 0.22, 36, w * 0.56, 120, 60); c.fill();
  c.fillStyle = '#7d8187'; c.font = `bold 78px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CHARGE', w * 0.5 - 22, 98); c.font = `300 78px ${FONT}`; c.fillText('4', w * 0.5 + 160, 98);
  c.save(); c.beginPath(); c.ellipse(w / 2, 340, 300, 120, 0, 0, Math.PI * 2); c.clip(); c.strokeStyle = '#2c2e33'; c.lineWidth = 5;
  for (let k = -400; k < w; k += 16) { c.beginPath(); c.moveTo(k, 480); c.lineTo(k + 260, 200); c.stroke(); } c.restore();
});
const batteryLabel = canvasTex(512, 256, (c, w, h) => {
  c.fillStyle = '#f2f2ef'; c.fillRect(0, 0, w, h); c.fillStyle = '#16181c';
  c.font = `bold 40px ${FONT}`; c.fillText('Li-ion Battery Pack', 28, 62);
  c.font = `34px ${FONT}`; c.fillText('3.6V  7500mAh  27.0Wh', 28, 120); c.fillText('IAA011NA', 28, 172);
  c.fillStyle = '#e8b62a'; c.fillRect(400, 150, 80, 80); c.fillStyle = '#16181c'; c.font = `bold 60px ${FONT}`; c.fillText('!', 428, 212);
});
const pcbTex = canvasTex(512, 128, (c, w, h) => {
  c.fillStyle = '#17643a'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(170,230,180,0.35)'; c.lineWidth = 2;
  for (let i = 0; i < 30; i++) { c.beginPath(); const y = rnd() * h; c.moveTo(rnd() * w, y); c.lineTo(rnd() * w, y); c.stroke(); }
});

// ---------- materials
const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ side: THREE.DoubleSide }, o));
const M = {
  fabric: std({ map: fabricMap, bumpMap: fabricBump, bumpScale: 2.2, roughness: 0.9 }),
  rubber: std({ color: 0x1d1e21, roughness: 0.55 }),
  bumper: std({ color: 0x1b1c1f, roughness: 0.5, bumpMap: knurl, bumpScale: 0.6 }),
  rim: std({ color: 0x9ea3a9, roughness: 0.28, metalness: 1 }),
  surround: std({ color: 0x18191b, roughness: 0.42 }),
  plate: { JBL: std({ map: plateTex.JBL, bumpMap: plateBump.JBL, bumpScale: 1.5, roughness: 0.45, metalness: 0.35 }), bang: std({ map: plateTex.bang, bumpMap: plateBump.bang, bumpScale: 1.5, roughness: 0.45, metalness: 0.35 }) },
  plateEdge: std({ color: 0x777b80, roughness: 0.4, metalness: 0.5 }),
  badge: std({ map: badgeTex, roughness: 0.35, transparent: true, alphaTest: 0.5 }),
  top: std({ map: topTex, roughness: 0.3, transparent: true, alphaTest: 0.3 }),
  back: std({ map: backTex, roughness: 0.6, transparent: true, alphaTest: 0.5 }),
  chassis: std({ color: 0x141518, roughness: 0.45 }),
  chassisMatte: std({ color: 0x101113, roughness: 0.7 }),
  cone: std({ color: 0x1a1b1e, roughness: 0.75 }),
  driverRubber: std({ color: 0x111214, roughness: 0.4 }),
  plug: std({ color: 0x0b0b0c, roughness: 0.15, metalness: 0.2 }),
  magnet: std({ color: 0xb9bec4, roughness: 0.22, metalness: 1 }),
  steel: std({ color: 0x5f6368, roughness: 0.35, metalness: 1 }),
  screw: std({ color: 0x2a2b2e, roughness: 0.3, metalness: 0.8 }),
  gasket: std({ color: 0xf06a1c, roughness: 0.6 }),
  cell: std({ color: 0x1757a8, roughness: 0.42, envMapIntensity: 0.6 }),
  foam: std({ color: 0x18191b, roughness: 1 }),
  label: std({ map: batteryLabel, roughness: 0.6 }),
  wireR: std({ color: 0xd0261f, roughness: 0.45 }), wireK: std({ color: 0x111111, roughness: 0.45 }),
  connector: std({ color: 0xeeeeea, roughness: 0.5 }),
  pcb: std({ map: pcbTex, roughness: 0.5 }),
  led: new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.3 }),
};

// ---------- geometry helpers (units: cm; X = length, +Z = front, +Y = up)
const cast = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
const mesh = (g, m) => cast(new THREE.Mesh(g, m));
function latheX(prof, segs = 180) { // prof: [[x, r], ...]; revolved around the X axis
  const g = new THREE.LatheGeometry(prof.map(([x, r]) => new THREE.Vector2(r, x)), segs); g.rotateZ(-Math.PI / 2); return g;
}
// patch of a cylinder around X. th: 0 = front (+Z), π/2 = bottom, π = back, 3π/2 = top. Texture: u along x0→x1, v along th0→th1 (v=1 is the canvas top)
function patch(r, x0, x1, th0, th1, sx = 48, st = 24) {
  const g = new THREE.PlaneGeometry(1, 1, sx, st), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) { const u = p.getX(i) + 0.5, v = p.getY(i) + 0.5, th = th0 + (th1 - th0) * v;
    p.setXYZ(i, x0 + (x1 - x0) * u, -r * Math.sin(th), r * Math.cos(th)); uv.setXY(i, u, v); }
  g.computeVertexNormals(); return g;
}
// racetrack outline (stadium) with half-straight a and end radius r, in the XY plane
function stadium(a, r, z = 0, n = 48) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = -Math.PI / 2 + Math.PI * i / n; pts.push(new THREE.Vector3(a + r * Math.cos(t), r * Math.sin(t), z)); }
  for (let i = 0; i <= n; i++) { const t = Math.PI / 2 + Math.PI * i / n; pts.push(new THREE.Vector3(-a + r * Math.cos(t), r * Math.sin(t), z)); }
  return pts;
}
function ringsMesh(rings, mat) { // rings: arrays of equal length, closed loops; quads between consecutive rings
  const n = rings[0].length, pos = [], idx = [];
  rings.forEach((r) => r.forEach((v) => pos.push(v.x, v.y, v.z)));
  for (let j = 0; j < rings.length - 1; j++) for (let i = 0; i < n; i++) {
    const a = j * n + i, b = j * n + ((i + 1) % n), c = (j + 1) * n + ((i + 1) % n), d = (j + 1) * n + i; idx.push(a, b, c, a, c, d);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return mesh(g, mat);
}

// ---------- the speaker
const speaker = new THREE.Group(); scene.add(speaker);
const fabricR = (x) => { const ax = Math.abs(x); return ax <= 7.0 ? 4.72 : 4.72 - 0.55 * Math.pow((ax - 7.0) / 2.7, 2); };

// fabric sleeve (+ badge, top controls, back rubber panel): lifts off as one cover, like the real one (iFixit step 1–3)
const sleeve = new THREE.Group(); speaker.add(sleeve);
{
  const prof = []; for (let i = 0; i <= 80; i++) { const x = -9.7 + 19.4 * i / 80; prof.push([x, fabricR(x)]); }
  sleeve.add(mesh(latheX(prof, 200), M.fabric));
  const badge = mesh(patch(4.735, -1.0, 1.0, 0.245, -0.245, 8, 8), M.badge); badge.castShadow = false; sleeve.add(badge);          // front centre
  const top = mesh(patch(4.73, -5, 5, 1.5 * Math.PI + 0.13, 1.5 * Math.PI - 0.13, 64, 6), M.top); top.castShadow = false; sleeve.add(top); // top, readable from the front
  const back = mesh(patch(4.745, 5.4, -5.4, Math.PI / 2 + 0.42, Math.PI - 0.1, 64, 24), M.back); back.castShadow = false; sleeve.add(back); // lower back
}

// rubber end bumpers with the thin silver rim
for (const s of [-1, 1]) {
  const p = [[9.35, 4.0], [9.6, 4.18], [9.9, 4.33], [10.25, 4.41], [10.6, 4.38], [10.85, 4.27], [11.0, 4.08], [11.02, 3.9], [10.92, 3.78], [10.7, 3.72], [10.5, 3.7]];
  speaker.add(mesh(latheX(p.map(([x, r]) => [s * x, r]), 200), M.bumper));
  const rimT = mesh(new THREE.TorusGeometry(4.13, 0.055, 12, 200), M.rim); rimT.rotation.y = Math.PI / 2; rimT.position.x = s * 10.97; speaker.add(rimT);
}

// passive radiators: wide rubber surround roll + grey hatched plate (−X end: "!JBL", +X end: "!")
const radiators = [];
for (const s of [-1, 1]) {
  const rad = new THREE.Group(); rad.userData = { base: s * 10.45, side: s }; rad.position.x = rad.userData.base; speaker.add(rad);
  const prof = []; for (let i = 0; i <= 24; i++) { const k = i / 24, r = 2.3 + 1.42 * k; prof.push([s * 0.33 * Math.sin(Math.PI * k), r]); }
  rad.add(mesh(latheX(prof, 160), M.surround));
  const edge = mesh(new THREE.CylinderGeometry(2.32, 2.32, 0.2, 120, 1, true), M.plateEdge); edge.rotation.z = Math.PI / 2; edge.position.x = s * 0.02; rad.add(edge);
  const face = mesh(new THREE.CircleGeometry(2.32, 120), s < 0 ? M.plate.JBL : M.plate.bang); face.rotation.y = s * Math.PI / 2; face.position.x = s * 0.12; rad.add(face);
  radiators.push(rad);
}

// inner chassis (black plastic tube, tapered like the outside)
const chassis = new THREE.Group(); speaker.add(chassis);
{
  // three lathe sections: the middle one leaves a window at the front (phi ±0.66 around +Z) where the driver mounts
  const prof = (a, b) => { const p = []; for (let i = 0; i <= 30; i++) { const x = a + (b - a) * i / 30; p.push([x, Math.min(4.42, fabricR(x) - 0.3)]); } return p; };
  const lx = (pr, ps, pl) => { const g = new THREE.LatheGeometry(pr.map(([x, r]) => new THREE.Vector2(r, x)), 160, ps, pl); g.rotateZ(-Math.PI / 2); return g; };
  chassis.add(mesh(lx(prof(-9.6, -8.95), 0, Math.PI * 2), M.chassis));
  chassis.add(mesh(lx(prof(-8.95, 1.75), 0.66, Math.PI * 2 - 1.32), M.chassis));
  chassis.add(mesh(lx(prof(1.75, 9.6), 0, Math.PI * 2), M.chassis));
  // flat mounting face for the driver on the front-left half, ringed by the orange gasket
  const fs = new THREE.Shape(); fs.moveTo(-5.25, -2.9); fs.lineTo(5.55, -2.9); fs.lineTo(5.55, 2.9); fs.lineTo(-5.25, 2.9); fs.closePath();
  fs.holes.push(new THREE.Path(stadium(2.0, 2.62, 0, 32).map((v) => new THREE.Vector2(v.x, v.y)).reverse()));
  const face = mesh(new THREE.ExtrudeGeometry(fs, { depth: 1.2, bevelEnabled: false, curveSegments: 24 }), M.chassisMatte); face.position.set(-3.6, 0.15, 2.0); chassis.add(face);
  const gpts = []; const hw = 5.25, hh = 2.85, cr = 0.5;
  for (const [cx, cy, a0] of [[hw - cr, hh - cr, 0], [-hw + cr, hh - cr, Math.PI / 2], [-hw + cr, -hh + cr, Math.PI], [hw - cr, -hh + cr, 1.5 * Math.PI]])
    for (let i = 0; i <= 6; i++) { const a = a0 + (Math.PI / 2) * i / 6; gpts.push(new THREE.Vector3(-3.6 + cx + cr * Math.cos(a), 0.15 + cy + cr * Math.sin(a), 3.21)); }
  chassis.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(gpts, true), 200, 0.045, 6, true), M.gasket));
  // internal wall that closes the driver's sealed chamber from the battery bay
  const wall = mesh(new THREE.CircleGeometry(4.36, 96), M.chassisMatte); wall.rotation.y = Math.PI / 2; wall.position.x = 1.9; chassis.add(wall);
  // seam + screw bosses on the right half (battery bay side), as in the teardown photos
  for (const [x, y] of [[2.2, 2.3], [7.0, 2.2], [2.2, -2.0], [7.0, -1.9]]) { const b = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.2, 20), M.screw); b.rotation.x = Math.PI / 2; b.position.set(x, y, Math.sqrt(4.42 * 4.42 - y * y) + 0.02); chassis.add(b); }
}

// ---------- the driver: 50 × 90 mm racetrack, black ribbed cone, 4-lobe star phase plug, big silver magnet, 4 screws
const driver = new THREE.Group(); driver.position.set(-3.6, 0.15, 3.5); speaker.add(driver);
const coneMove = new THREE.Group(); driver.add(coneMove);
{
  const A = 2.0, R0 = 2.5;  // 9.0 × 5.0 cm outer (surround edge)
  // frame: rounded rectangle with the racetrack opening
  const sh = new THREE.Shape(); sh.moveTo(-4.85, -2.75); sh.lineTo(4.85, -2.75); sh.quadraticCurveTo(5.15, -2.75, 5.15, -2.45); sh.lineTo(5.15, 2.45); sh.quadraticCurveTo(5.15, 2.75, 4.85, 2.75);
  sh.lineTo(-4.85, 2.75); sh.quadraticCurveTo(-5.15, 2.75, -5.15, 2.45); sh.lineTo(-5.15, -2.45); sh.quadraticCurveTo(-5.15, -2.75, -4.85, -2.75);
  const hole = new THREE.Path(stadium(A, R0 + 0.12, 0, 32).map((v) => new THREE.Vector2(v.x, v.y)).reverse()); sh.holes.push(hole);
  const fr = mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2, curveSegments: 24 }), M.chassis); fr.position.z = -0.3; driver.add(fr);
  for (const [x, y] of [[-4.6, 2.25], [4.6, 2.25], [-4.6, -2.25], [4.6, -2.25]]) {
    const sc = mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24), M.screw); sc.rotation.x = Math.PI / 2; sc.position.set(x, y, 0.06); driver.add(sc);
    for (const r of [0, Math.PI / 2]) { const sl = mesh(new THREE.BoxGeometry(0.3, 0.05, 0.03), M.chassisMatte); sl.rotation.z = r + 0.4; sl.position.set(x, y, 0.13); driver.add(sl); }
  }
  // surround (half roll) and cone, built ring by ring on the racetrack outline
  const surr = []; for (let i = 0; i <= 10; i++) { const k = i / 10; surr.push(stadium(A, R0 - 0.45 + 0.55 * k, 0.24 * Math.sin(Math.PI * k) - 0.02)); }
  driver.add(ringsMesh(surr, M.driverRubber));
  const cone = []; for (let i = 0; i <= 10; i++) { const k = i / 10; const r = R0 - 0.45 - (R0 - 1.15) * k; cone.push(stadium(A * (1 - 0.35 * k), r, -0.02 - 0.95 * Math.pow(k, 0.85))); }
  coneMove.add(ringsMesh(cone, M.cone));
  // moulded ribs: two curved ridges on each half of the cone (visible in the teardown photo)
  for (const s of [-1, 1]) for (const off of [0.0, 0.55]) {
    const pts = []; for (let i = 0; i <= 16; i++) { const k = i / 16, ang = -1.1 + 2.2 * k; pts.push(new THREE.Vector3(s * (1.55 + off + 0.55 * Math.cos(ang)), 1.15 * Math.sin(ang), -0.42 - off * 0.25)); }
    coneMove.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.045, 6), M.cone));
  }
  // 4-lobe star phase plug
  const star = new THREE.Shape(); for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 2, r = 0.62 + 0.3 * Math.cos(4 * (a - Math.PI / 4)); const p = [r * Math.cos(a), r * Math.sin(a)]; i ? star.lineTo(...p) : star.moveTo(...p); }
  const plug = mesh(new THREE.ExtrudeGeometry(star, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.1, bevelSegments: 4 }), M.plug); plug.position.z = -0.95; coneMove.add(plug);
  // basket + magnet behind
  driver.add(ringsMesh([stadium(A, R0 + 0.1, -0.3), stadium(0.5, 2.0, -1.5)], M.chassisMatte));
  const mag = mesh(new THREE.CylinderGeometry(2.0, 2.0, 1.25, 64), M.magnet); mag.rotation.x = Math.PI / 2; mag.position.z = -2.15; driver.add(mag);
  const yoke = mesh(new THREE.CylinderGeometry(2.08, 2.08, 0.22, 64), M.steel); yoke.rotation.x = Math.PI / 2; yoke.position.z = -1.48; driver.add(yoke);
  for (const [m, y] of [[M.wireR, 0.35], [M.wireK, -0.35]]) driver.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(2.3, y, -0.9), new THREE.Vector3(3.2, y, -1.6), new THREE.Vector3(3.6, y * 2, -2.9)]), 20, 0.07, 8), m));
}

// ---------- bottom: rubber foot + battery cover with the LED light guide (drops away first)
const bottom = new THREE.Group(); speaker.add(bottom);
const leds = [];
{
  const st = new THREE.Shape(stadium(5.6, 1.5, 0, 24).map((v) => new THREE.Vector2(v.x, v.y)));
  const foot = mesh(new THREE.ExtrudeGeometry(st, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 }), M.rubber);
  foot.rotation.x = Math.PI / 2; foot.position.y = -4.36; bottom.add(foot);
  bottom.add(mesh(patch(4.48, -8.0, 8.6, Math.PI / 2 - 0.78, Math.PI / 2 + 0.78, 48, 16), M.chassis));
  for (let i = 0; i < 5; i++) { const l = mesh(new THREE.SphereGeometry(0.075, 16, 8), M.led.clone()); const th = 0.98; l.position.set(-1.2 + i * 0.6, -4.76 * Math.sin(th), 4.76 * Math.cos(th)); l.scale.set(1, 1, 0.4); l.castShadow = false; bottom.add(l); leds.push(l); }
  const lb = mesh(new THREE.BoxGeometry(3.4, 0.08, 0.9), M.pcb); lb.position.set(0, -3.6, 2.35); lb.rotation.x = -0.55; bottom.add(lb);
}

// ---------- battery: IAA011NA pack, 3 × 18650 cells in parallel, blue wrap, foam on both ends
const battery = new THREE.Group(); speaker.add(battery);
const BAT_HOME = new THREE.Vector3(5.2, -2.1, -0.1);
battery.position.copy(BAT_HOME);
{
  for (const z of [-1.82, 0, 1.82]) { const c = mesh(new THREE.CylinderGeometry(0.9, 0.9, 6.5, 48), M.cell); c.rotation.z = Math.PI / 2; c.position.z = z; battery.add(c); }
  const fillb = mesh(new THREE.BoxGeometry(6.5, 1.5, 3.64), M.cell); battery.add(fillb);
  for (const x of [-3.42, 3.42]) { const f = mesh(new THREE.BoxGeometry(0.42, 1.95, 5.6), M.foam); f.position.x = x; battery.add(f); }
  const lab = mesh(new THREE.PlaneGeometry(3.8, 1.9), M.label); lab.rotation.x = -Math.PI / 2; lab.position.set(-0.4, 0.915, 0.0); lab.castShadow = false; battery.add(lab);
  for (const [m, z] of [[M.wireR, 0.25], [M.wireK, -0.25]]) battery.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(3.6, 0.3, z), new THREE.Vector3(4.3, 0.6, z), new THREE.Vector3(4.7, 1.2, z * 2)]), 20, 0.08, 8), m));
  const con = mesh(new THREE.BoxGeometry(0.5, 0.45, 1.0), M.connector); con.position.set(4.85, 1.3, 0); battery.add(con);
}

// floor shadow catcher
const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.42 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -4.74; floor.receiveShadow = true; scene.add(floor);

// ---------- highlight: cyan screen-space contour (STUDY §3). Each group on its own layer → mask → edge pass.
const HL = [];
function outline(objs) { const L = HL.length + 1; [].concat(objs).forEach((g) => g.traverse((o) => o.isMesh && o.layers.enable(L))); const h = { layer: L, a: 0 }; HL.push(h); return h; }
const maskRT = new THREE.WebGLRenderTarget(W * SS, H * SS);
const maskMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const edgeMat = new THREE.ShaderMaterial({
  uniforms: { mask: { value: maskRT.texture }, px: { value: new THREE.Vector2(1 / (W * SS), 1 / (H * SS)) }, rad: { value: 4.0 * SS }, al: { value: new THREE.Vector3() }, col: { value: new THREE.Color(0x3fe8d6) } },
  vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
  fragmentShader: `uniform sampler2D mask; uniform vec2 px; uniform float rad; uniform vec3 al; uniform vec3 col; varying vec2 v;
    void main(){ vec3 c = texture2D(mask, v).rgb; vec3 m = c;
      for (int i = 0; i < 24; i++) { float a = 6.2831853 * float(i) / 24.0;
        for (int k = 1; k <= 3; k++) m = max(m, texture2D(mask, v + vec2(cos(a), sin(a)) * px * rad * float(k) / 3.0).rgb); }
      vec3 e = clamp(m - c, 0.0, 1.0) * al; gl_FragColor = vec4(col, max(e.r, max(e.g, e.b))); }`,
  transparent: true, depthTest: false, depthWrite: false,
});
const quadScene = new THREE.Scene(); quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), edgeMat));
const CH = [new THREE.Color(1, 0, 0), new THREE.Color(0, 1, 0), new THREE.Color(0, 0, 1)];
function renderHighlights() {
  if (!HL.some((h) => h.a > 0.001)) return;
  const bg = scene.background; scene.background = null; scene.overrideMaterial = maskMat; floor.visible = false;
  renderer.setRenderTarget(maskRT); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.autoClear = false;
  for (const h of HL) if (h.a > 0.001) { maskMat.color.copy(CH[h.layer - 1]); camera.layers.set(h.layer); renderer.render(scene, camera); }
  camera.layers.set(0); scene.overrideMaterial = null; scene.background = bg; floor.visible = true;
  renderer.setRenderTarget(null);
  edgeMat.uniforms.al.value.set(...[0, 1, 2].map((i) => (HL[i] ? HL[i].a : 0)));
  renderer.render(quadScene, quadCam); renderer.autoClear = true;
}
const hiDriver = outline(driver), hiRad = outline(radiators), hiBat = outline(battery);

// ---------- labels (2D, drawn over the render; STUDY §4)
const SERIF = 'bold 54px Georgia, "Times New Roman", serif', SANS = `34px ${FONT}`;
const screen = (v3) => { const p = v3.clone().project(camera); return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H }; };
function text(str, x, y, font, a, align = 'left') {
  ctx.save(); ctx.globalAlpha = a; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 2; ctx.fillStyle = '#fff'; ctx.fillText(str, x, y); ctx.restore();
}
function leader(from, to, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke(); ctx.beginPath(); ctx.arc(from.x, from.y, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
}
const wp = (obj, x, y, z) => obj.localToWorld(new THREE.Vector3(x, y, z));

// ---------- camera path (eased keys; az/el in degrees; tx/ty/tz = look-at target)
const camKeys = [
  { t: 0.0, az: -40, el: 15, d: 46, tx: 0, ty: -0.6, tz: 0 },
  { t: 2.7, az: -29, el: 12, d: 43, tx: 0, ty: -0.6, tz: 0 },
  { t: 3.9, az: -15, el: 7, d: 27, tx: -3.2, ty: 0.1, tz: 1 },
  { t: 5.1, az: -9, el: 6, d: 26, tx: -3.4, ty: 0.1, tz: 1 },
  { t: 6.2, az: -30, el: 13, d: 48, tx: 0, ty: -0.4, tz: 0 },
  { t: 7.6, az: -35, el: 13, d: 47, tx: 0, ty: -0.4, tz: 0 },
  { t: 8.9, az: -13, el: 16, d: 44, tx: 2.6, ty: -1.6, tz: 3.2 },
  { t: 10.1, az: -9, el: 15, d: 43, tx: 2.6, ty: -1.6, tz: 3.2 },
  { t: 11.1, az: -31, el: 12, d: 44, tx: 0, ty: -0.6, tz: 0 },
  { t: 12.0, az: -26, el: 12, d: 43, tx: 0, ty: -0.6, tz: 0 },
];
function camAt(t) {
  let i = 0; while (i < camKeys.length - 2 && t > camKeys[i + 1].t) i++;
  const A = camKeys[i], B = camKeys[i + 1], p = eio(seg(t, A.t, B.t)), L = (k) => lerp(A[k], B[k], p);
  const az = THREE.MathUtils.degToRad(L('az')), el = THREE.MathUtils.degToRad(L('el')), d = L('d'), tx = L('tx'), ty = L('ty'), tz = L('tz');
  camera.position.set(tx + d * Math.sin(az) * Math.cos(el), ty + d * Math.sin(el), tz + d * Math.cos(az) * Math.cos(el));
  camera.lookAt(tx, ty, tz);
}

// fade helper for groups (clones materials once so shared materials are untouched)
function setOpacity(group, a) {
  group.traverse((o) => { if (!o.isMesh) return;
    if (!o.userData.fm) { o.userData.fm = (Array.isArray(o.material) ? o.material : [o.material]).map((m) => { const c = m.clone(); c.transparent = true; return c; }); o.material = o.userData.fm.length === 1 ? o.userData.fm[0] : o.userData.fm; }
    o.userData.fm.forEach((m) => { m.opacity = a; m.depthWrite = a > 0.98; }); o.castShadow = a > 0.5; });
  group.visible = a > 0.01;
}

// ---------- the timeline
function render(t) {
  // fabric cover lifts off on "Inside", comes back on "powers it all"
  const open = eio(seg(t, T.inside - 0.1, T.inside + 0.8)) * (1 - eio(seg(t, T.powers + 0.2, T.powers + 1.0)));
  sleeve.position.set(0, open * 10, -open * 2.0);
  setOpacity(sleeve, 1 - eio(seg(open, 0.15, 0.8)));

  // driver plays; radiators slide out on "Two passive radiators", pump hard on "pump", go home on "and"
  const play = seg(t, T.inside, T.inside + 0.6);
  coneMove.position.z = play * (0.05 * Math.sin(t * Math.PI * 2 * 7) + 0.1 * Math.max(0, Math.sin(t * Math.PI * 2 * 2)) * seg(t, T.driver, T.driver + 0.3));
  const radOut = inOut(t, T.two - 0.1, T.two + 0.6, T.and - 0.2, T.and + 0.5);
  const big = inOut(t, T.pump - 0.15, T.pump + 0.15, 7.5, 7.9);
  const small = 0.06 * seg(t, 1.0, 1.6);
  radiators.forEach((r) => { const s = r.userData.side, ex = (small + big * 0.7) * Math.max(-0.4, Math.sin(t * Math.PI * 2 * 2.2)); r.position.x = r.userData.base + s * (radOut * 2.6 + ex); });

  // battery: bottom cover drops and slides out front, then the pack follows out and floats in front (reversible path)
  const close = eio(seg(t, T.powers - 0.15, T.powers + 0.75));
  const uc = eio(seg(t, T.and - 0.1, T.and + 0.7)) * (1 - close), ub = eio(seg(t, T.and + 0.1, T.and + 1.1)) * (1 - close);
  bottom.position.set(0, -1.6 * uc, 0.6 * uc);
  setOpacity(bottom, 1 - eio(seg(uc, 0.2, 0.75)));
  const b1 = clamp01(ub / 0.35), b2 = clamp01((ub - 0.35) / 0.65);
  battery.position.set(BAT_HOME.x - 0.6 * eio(b2), BAT_HOME.y - 2.6 * eio(b1) + 3.6 * eio(b2), BAT_HOME.z + 7.0 * eio(b2));
  battery.rotation.set(0.32 * eio(b2), -0.12 * eio(b2), 0);
  // the 5 battery LEDs fill up one by one
  leds.forEach((l, i) => { l.material.emissiveIntensity = 2.4 * seg(t, 10.75 + 0.14 * i, 10.75 + 0.14 * i + 0.1); }); // fill up as it 'powers it all'

  hiDriver.a = 0.95 * inOut(t, T.driver - 0.05, T.driver + 0.2, 4.85, 5.2);
  hiRad.a = 0.95 * inOut(t, T.passive, T.passive + 0.25, 7.45, 7.8);
  hiBat.a = 0.95 * inOut(t, T.bat - 0.1, T.bat + 0.15, 9.9, 10.2);

  camAt(t);
  const dbg = new URLSearchParams(location.search).get('cam');
  if (dbg) { const D = { top: [0, 40, 6], front: [0, 3, 42], back: [0, 3, -42], end: [42, 3, 0] }[dbg]; camera.position.set(...D); camera.lookAt(0, 0, 0); }
  speaker.updateMatrixWorld(true);
  renderer.render(scene, camera); renderHighlights();
  ctx.drawImage(gl, 0, 0, W, H);

  // title under the hero (start + end card)
  for (const a of [inOut(t, T.title, T.title + 0.45, 2.45, 2.85), seg(t, 11.0, 11.5)]) if (a > 0) {
    const p = screen(new THREE.Vector3(0, -4.74, 2.0));
    text('JBL Charge 4', p.x, p.y + 70 - 8 * eo(a), 'bold 76px Georgia, "Times New Roman", serif', a, 'center');
    text('2018', p.x, p.y + 132 - 8 * eo(a), SANS, a * seg(a, 0.4, 1), 'center');
  }
  const aDrv = inOut(t, T.driver, T.driver + 0.35, 4.85, 5.15);
  if (aDrv > 0) { const p = screen(wp(driver, 3.6, 1.6, 0.1)); const L = { x: p.x + 150, y: p.y - 110 }; leader(p, { x: L.x - 14, y: L.y }, aDrv); text('Driver', L.x, L.y, SERIF, aDrv); text('50 × 90 mm', L.x + 2, L.y + 52, SANS, aDrv * seg(aDrv, 0.5, 1)); }
  const aRad = inOut(t, T.rad, T.rad + 0.35, 7.45, 7.8);
  if (aRad > 0) {
    const pa = screen(wp(radiators[0], 0, 1.6, 0)), pb = screen(wp(radiators[1], 0, 1.6, 0));
    const L = { x: (pa.x + pb.x) / 2, y: Math.min(pa.y, pb.y) - 190 };
    leader(pa, { x: L.x - 120, y: L.y + 28 }, aRad); leader(pb, { x: L.x + 120, y: L.y + 28 }, aRad);
    text('Passive Radiators', L.x, L.y - 4, SERIF, aRad, 'center');
  }
  const aBat = inOut(t, T.bat, T.bat + 0.35, 9.85, 10.2);
  if (aBat > 0) {
    const p = screen(wp(battery, 3.3, 0.9, -1.0)); const L = { x: p.x + 130, y: p.y - 90 };
    leader(p, { x: L.x - 14, y: L.y }, aBat); text('Battery', L.x, L.y, SERIF, aBat);
    text('7,500 mAh', L.x + 2, L.y + 52, SANS, aBat * seg(aBat, 0.4, 1)); text('3 × 18650 cells', L.x + 2, L.y + 94, SANS, aBat * seg(aBat, 0.6, 1));
  }
}

// ---------- player + offline frame export (POST /frame/<n>, /log, /done)
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
