/*
 * Night valley: an endless field of glowing flowers the camera drifts through.
 * Ported to modern three.js; colour management is disabled so the additive point
 * colours render exactly as authored (as in the original r128 build).
 */
import * as THREE from "three";

type Options = {onReady: () => void};

const L = 150; // depth of the field that loops around the camera
const EYE = 2.4; // camera height above the ground
const hJS = (x: number, z: number) =>
  Math.sin(x * 0.045) * 2.2 + Math.sin(z * 0.031 + x * 0.017) * 2.0 + Math.sin(z * 0.013) * 3.5 +
  Math.pow(Math.min(Math.abs(x), 60) / 30, 2) * 5;
const hGL = `float h(vec2 p){ return sin(p.x*.045)*2.2 + sin(p.y*.031+p.x*.017)*2.0 + sin(p.y*.013)*3.5 + pow(min(abs(p.x),60.)/30.,2.)*5.; }`;
const pathX = (t: number) => Math.sin(t * 0.007) * 7 + Math.sin(t * 0.019) * 2;

export function createValley(host: HTMLElement, {onReady}: Options) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 820 || matchMedia("(pointer: coarse)").matches;

  THREE.ColorManagement.enabled = false;
  const renderer = new THREE.WebGLRenderer({antialias: false, alpha: true, powerPreference: "high-performance"});
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 400);

  // ---- ground: dark hills that fade into the horizon glow ----
  const groundGeo = new THREE.PlaneGeometry(700, L + 40, 160, 110);
  groundGeo.rotateX(-Math.PI / 2);
  groundGeo.translate(0, 0, -(L + 40) / 2 + 12);
  const groundMat = new THREE.ShaderMaterial({
    uniforms: {uTravel: {value: 0}, uL: {value: L}},
    vertexShader: `${hGL}
      uniform float uTravel; varying float vDist; varying float vY;
      void main(){
        vec3 p = position;
        p.y = h(vec2(p.x, p.z - uTravel)) - .15;
        vY = p.y;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uL; varying float vDist; varying float vY;
      void main(){
        vec3 near = vec3(.012,.016,.02);
        vec3 far  = vec3(.05,.04,.075);
        float f = smoothstep(uL*.25, uL*1.05, vDist) * .8;
        vec3 c = mix(near, far, f) + vec3(.01,.012,.01) * clamp(vY*.15, 0., 1.);
        gl_FragColor = vec4(c, 1.);
      }`,
  });
  scene.add(new THREE.Mesh(groundGeo, groundMat));

  // ---- points: flowers (0), leaves (1), floating dust (2) ----
  const N_FLOWER = small ? 7000 : 18000;
  const N_LEAF = small ? 9000 : 26000;
  const N_DUST = small ? 160 : 420;
  const N = N_FLOWER + N_LEAF + N_DUST;
  const aPos = new Float32Array(N * 3);
  const aCol = new Float32Array(N * 3);
  const aMisc = new Float32Array(N * 3);
  const hex = (h: string) => new THREE.Color(h);
  const flowerCols: Array<[THREE.Color, number]> = [
    [hex("#ffffff"), 0.34], [hex("#f5efe2"), 0.22], [hex("#ffc2d4"), 0.16], [hex("#c9bcff"), 0.16], [hex("#a9d4ff"), 0.12],
  ];
  const leafCols = [hex("#1d5f50"), hex("#2c7d62"), hex("#4b6a36"), hex("#21474f")];
  const dustCol = hex("#fff6ea");
  const pick = () => {
    let r = Math.random();
    for (const [c, w] of flowerCols) if ((r -= w) <= 0) return c;
    return flowerCols[0][0];
  };
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  for (let i = 0; i < N; i++) {
    const type = i < N_FLOWER ? 0 : i < N_FLOWER + N_LEAF ? 1 : 2;
    const spread = type === 0 ? 46 : type === 1 ? 70 : 30;
    aPos[i * 3] = gauss() * spread;
    aPos[i * 3 + 1] = Math.random() * L;
    aPos[i * 3 + 2] = Math.random();
    let c: THREE.Color, size: number, lift: number;
    if (type === 0) { c = pick(); size = 0.16 + Math.random() * 0.28; lift = 0.25 + Math.random() * 0.9; }
    else if (type === 1) { c = leafCols[i % 4]; size = 0.16 + Math.random() * 0.26; lift = Math.random() * 0.35; }
    else { c = dustCol; size = 0.05 + Math.random() * 0.07; lift = 1 + Math.random() * 6; }
    aCol.set([c.r, c.g, c.b], i * 3);
    aMisc.set([size, lift, type], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(aPos, 3));
  geo.setAttribute("aCol", new THREE.BufferAttribute(aCol, 3));
  geo.setAttribute("aMisc", new THREE.BufferAttribute(aMisc, 3));

  const uniforms = {
    uTravel: {value: 0}, uTime: {value: 0}, uL: {value: L},
    uMouse: {value: new THREE.Vector2(9, 9)}, uMouseOn: {value: 0}, uAspect: {value: 1},
    uScale: {value: 500}, uPR: {value: 1}, uIntro: {value: 0}, uGather: {value: 0},
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `${hGL}
      attribute vec3 aCol; attribute vec3 aMisc;
      uniform float uTravel, uTime, uL, uMouseOn, uAspect, uScale, uPR, uIntro, uGather;
      uniform vec2 uMouse;
      varying vec3 vCol; varying float vType, vSeed, vFade, vGlow;
      void main(){
        float seed = position.z, type = aMisc.z;
        float zr = -(uL - mod(position.y + uTravel, uL)) + 8.;
        float absZ = zr - uTravel;
        vec3 w = vec3(position.x, 0., zr);
        w.y = h(vec2(w.x, absZ)) + aMisc.y;
        if (type > 1.5) {
          w.y += sin(uTime*.5 + seed*40.)*.6;
          w.x += sin(uTime*.3 + seed*20.)*1.2;
        } else {
          w.x += sin(uTime*1.2 + seed*6.28 + absZ*.2) * .06 * (1. + type);
        }
        vec3 dir = normalize(vec3(fract(seed*17.3)-.5, .7 + fract(seed*7.1), fract(seed*29.7)-.5));
        float g = uGather * (.6 + fract(seed*91.)*.8);
        w += dir * g * (2.5 + fract(seed*53.)*5.);
        w.y += sin(uTime*.8 + seed*30.) * .4 * uGather;

        vec4 mv = modelViewMatrix * vec4(w, 1.);
        vec4 clip = projectionMatrix * mv;
        float dist = max(-mv.z, .01);

        float bloom = type < .5 ? smoothstep(uL*.8, uL*.22, dist)
                    : type < 1.5 ? smoothstep(uL*1., uL*.55, dist) : 1.;
        bloom = max(bloom, uGather*.7);
        bloom *= smoothstep(0., 1., uIntro*1.8 - seed*.8);

        vec2 ndc = clip.xy / clip.w;
        vec2 d = ndc - uMouse; d.x *= uAspect;
        float r = length(d);
        float push = uMouseOn * exp(-r*r / .035) * .11;
        vec2 off = d / max(r, 1e-4) * push; off.x /= uAspect;
        clip.xy += off * clip.w;
        vGlow = uMouseOn * exp(-r*r / .012);

        gl_Position = clip;
        float s = aMisc.x * bloom * uScale / dist;
        gl_PointSize = min(s * (1. + vGlow*.5), 90.*uPR);
        vFade = smoothstep(uL*.98, uL*.4, dist) * smoothstep(.6, 2.2, dist);
        vCol = aCol; vType = type; vSeed = seed;
      }`,
    fragmentShader: `
      varying vec3 vCol; varying float vType, vSeed, vFade, vGlow;
      void main(){
        vec2 p = gl_PointCoord*2. - 1.;
        float an = vSeed * 6.2831;
        p = mat2(cos(an), -sin(an), sin(an), cos(an)) * p;
        float r = length(p);
        vec3 col; float a;
        if (vType < .5) {
          float ang = atan(p.y, p.x);
          float R = .42 + .5 * pow(abs(cos(2.5*ang)), 1.4);
          float petal = smoothstep(R, R - .18, r);
          float core = smoothstep(.24, .0, r);
          float halo = exp(-r*r*2.6) * .35;
          col = vCol * petal * .95 + vec3(1., .96, .88) * core * .9 + vCol * halo;
          a = max(max(petal, core), halo);
        } else if (vType < 1.5) {
          float leaf = smoothstep(1., .6, length(p * vec2(1., 2.8)));
          col = vCol * leaf * .55; a = leaf;
        } else {
          float dot = exp(-r*r*5.);
          col = vCol * dot * 1.2; a = dot;
        }
        col += (vCol*.8 + .25) * vGlow * a * 1.4;
        col *= vFade;
        if (a < .01) discard;
        gl_FragColor = vec4(col, a * vFade);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  // ---- stars ride with the camera so they never move ----
  const starGeo = new THREE.BufferGeometry();
  const sp = new Float32Array((small ? 500 : 1200) * 3);
  for (let i = 0; i < sp.length; i += 3) {
    const th = Math.random() * Math.PI * 2, ph = Math.random() * 0.55 + 0.05;
    sp[i] = Math.cos(th) * Math.cos(ph) * 300; sp[i + 1] = Math.sin(ph) * 300; sp[i + 2] = Math.sin(th) * Math.cos(ph) * 300;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({color: 0xf5efe2, size: 1.2, sizeAttenuation: false, transparent: true, opacity: 0.55, depthWrite: false});
  camera.add(new THREE.Points(starGeo, starMat));
  scene.add(camera);

  // ---- input ----
  const mouse = new THREE.Vector2(9, 9);
  const look = new THREE.Vector2();
  const ZERO = new THREE.Vector2();
  let mouseTarget = 0;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    mouse.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    mouseTarget = 1;
  };
  const onLeave = () => { mouseTarget = 0; };
  let lastScroll = scrollY, boost = 0;
  const onScroll = () => { boost += Math.abs(scrollY - lastScroll) * 0.05; lastScroll = scrollY; };
  let gatherTarget = 0;

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uAspect.value = w / h;
    uniforms.uPR.value = renderer.getPixelRatio();
    uniforms.uScale.value = (h * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(30)));
  };
  addEventListener("pointermove", onMove, {passive: true});
  document.addEventListener("pointerleave", onLeave);
  addEventListener("scroll", onScroll, {passive: true});
  addEventListener("resize", resize);
  resize();

  // ---- loop ----
  const vignette = document.getElementById("vignette");
  let travel = 40, speed = 0, last = performance.now(), raf = 0, ready = false;
  const start = last;
  const clock = (t: number) => Math.min((t - start) / 3200, 1);

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const intro = reduce ? 1 : clock(now);
    const ease = 1 - Math.pow(1 - intro, 3);

    boost *= Math.pow(0.04, dt);
    const g = (uniforms.uGather.value += (gatherTarget - uniforms.uGather.value) * (1 - Math.pow(0.15, dt)));
    const target = reduce ? 0 : (1.6 + Math.min(boost, 14)) * (1 - g);
    speed += (target - speed) * (1 - Math.pow(0.2, dt));
    travel += speed * dt;

    uniforms.uTravel.value = groundMat.uniforms.uTravel.value = travel;
    uniforms.uTime.value = reduce ? 0 : (now - start) / 1000;
    uniforms.uIntro.value = intro;
    uniforms.uMouseOn.value += (mouseTarget - uniforms.uMouseOn.value) * (1 - Math.pow(0.1, dt));
    uniforms.uMouse.value.lerp(mouse, 1 - Math.pow(0.002, dt));
    look.lerp(mouseTarget ? mouse : ZERO, 1 - Math.pow(0.05, dt));

    const cx = pathX(travel), ax = pathX(travel + 25);
    const cy = Math.max(hJS(cx, -travel), hJS(cx, -travel - 4)) + EYE + (1 - ease) * 9;
    camera.position.set(cx, cy, 0);
    camera.lookAt(ax + look.x * 2.2, cy - 0.9 - (1 - ease) * 3 + look.y * 1.1, -25);

    if (vignette) vignette.style.opacity = Math.min(0.35 + speed * 0.05, 1).toFixed(3);
    renderer.render(scene, camera);

    if (!ready && intro > 0.45) { ready = true; onReady(); }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    gather(on: boolean) { gatherTarget = on ? 1 : 0; },
    dispose() {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", resize);
      [groundGeo, geo, starGeo].forEach((g) => g.dispose());
      [groundMat, mat, starMat].forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
