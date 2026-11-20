import * as THREE from "three";
import {
  glassOrbitsConfig,
  type FragmentBudget,
  type OrbitDefinition,
  type OrbitSystemDefinition,
  type QualityDefinition,
  type QualityTier,
} from "./config";
import {
  fragmentFragmentShader,
  fragmentVertexShader,
  ringFragmentShader,
  ringVertexShader,
} from "./shaders";

export interface GlassOrbitsOptions {
  onReady?: () => void;
  onFailure?: () => void;
}

export interface GlassOrbitsHandle {
  dispose: () => void;
}

interface FragmentSeed {
  orbitIndex: number;
  radius: number;
  phase: number;
  depth: number;
  size: number;
  spin: readonly [number, number, number];
}

interface OrbitRuntime {
  definition: OrbitDefinition;
  euler: THREE.Euler;
}

interface FragmentRuntime {
  mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  seeds: FragmentSeed[];
}

interface SystemRuntime {
  group: THREE.Group;
  baseRotation: readonly [number, number, number];
  orbits: OrbitRuntime[];
  fragments: FragmentRuntime[];
}

interface SharedUniforms {
  uPointer: { value: THREE.Vector3 };
  uPointerRadius: { value: number };
  uPointerStrength: { value: number };
  uTime: { value: number };
}

function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function resolveQuality(): { tier: QualityTier; definition: QualityDefinition } {
  const width = window.innerWidth;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;

  let tier: QualityTier = "desktop";

  if (width < 768 || coarsePointer) {
    tier = "mobile";
  } else if (width < 1180) {
    tier = "tablet";
  }

  if (tier === "desktop" && cores <= 4) {
    tier = "tablet";
  }

  return { tier, definition: glassOrbitsConfig.quality[tier] };
}

function createFragmentRuntime(
  kind: "icosa" | "octa",
  count: number,
  orbits: OrbitRuntime[],
  material: THREE.ShaderMaterial,
  random: () => number,
): FragmentRuntime {
  const geometry: THREE.BufferGeometry =
    kind === "icosa"
      ? new THREE.IcosahedronGeometry(1, 1)
      : new THREE.OctahedronGeometry(1, 0);

  const phases = new Float32Array(count);
  const seeds: FragmentSeed[] = [];

  for (let index = 0; index < count; index += 1) {
    const orbitIndex = index % orbits.length;
    const orbit = orbits[orbitIndex].definition;
    const phase = random() * Math.PI * 2;
    const sizeBoost = index % 6 === 0 ? 0.07 : 0;

    seeds.push({
      orbitIndex,
      radius: orbit.radius + (random() - 0.5) * 0.22,
      phase,
      depth: (random() - 0.5) * 0.55,
      size: 0.055 + random() * 0.1 + sizeBoost,
      spin: [
        (random() - 0.5) * 0.45,
        (random() - 0.5) * 0.45,
        (random() - 0.5) * 0.45,
      ],
    });

    phases[index] = random();
  }

  geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));

  const mesh = new THREE.InstancedMesh<THREE.BufferGeometry, THREE.ShaderMaterial>(
    geometry,
    material,
    count,
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;

  return { mesh, seeds };
}

function buildSystem(
  definition: OrbitSystemDefinition,
  budget: FragmentBudget,
  quality: QualityDefinition,
  sharedUniforms: SharedUniforms,
  randomSeed: number,
): SystemRuntime {
  const group = new THREE.Group();
  group.position.set(
    definition.offset[0],
    definition.offset[1],
    definition.offset[2],
  );
  group.rotation.set(
    definition.rotation[0],
    definition.rotation[1],
    definition.rotation[2],
  );
  group.scale.setScalar(quality.scale);

  const orbits: OrbitRuntime[] = definition.orbits.map((orbit) => ({
    definition: orbit,
    euler: new THREE.Euler(orbit.tilt[0], orbit.tilt[1], orbit.tilt[2]),
  }));

  for (const orbit of orbits) {
    const geometry = new THREE.TorusGeometry(
      orbit.definition.radius,
      orbit.definition.thickness,
      3,
      220,
    );
    const material = new THREE.ShaderMaterial({
      uniforms: {
        ...sharedUniforms,
        uColor: { value: new THREE.Color(glassOrbitsConfig.colors.steel) },
        uHighlight: { value: new THREE.Color(glassOrbitsConfig.colors.ice) },
        uOpacity: { value: orbit.definition.opacity },
        uPhase: { value: orbit.definition.phase },
      },
      vertexShader: ringVertexShader,
      fragmentShader: ringFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      toneMapped: false,
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.set(
      orbit.definition.tilt[0],
      orbit.definition.tilt[1],
      orbit.definition.tilt[2],
    );
    group.add(ring);
  }

  const fragmentMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...sharedUniforms,
      uColorCool: { value: new THREE.Color(glassOrbitsConfig.colors.cyan) },
      uColorWarm: { value: new THREE.Color(glassOrbitsConfig.colors.ice) },
      uOpacity: { value: 0.9 },
    },
    vertexShader: fragmentVertexShader,
    fragmentShader: fragmentFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    toneMapped: false,
  });

  const random = createRandom(randomSeed);
  const fragments: FragmentRuntime[] = [];

  if (budget.icosa > 0) {
    const runtime = createFragmentRuntime(
      "icosa",
      budget.icosa,
      orbits,
      fragmentMaterial,
      random,
    );
    fragments.push(runtime);
    group.add(runtime.mesh);
  }

  if (budget.octa > 0) {
    const runtime = createFragmentRuntime(
      "octa",
      budget.octa,
      orbits,
      fragmentMaterial,
      random,
    );
    fragments.push(runtime);
    group.add(runtime.mesh);
  }

  return {
    group,
    baseRotation: definition.rotation,
    orbits,
    fragments,
  };
}

function updateSystem(
  system: SystemRuntime,
  time: number,
  dummy: THREE.Object3D,
  position: THREE.Vector3,
): void {
  for (const fragment of system.fragments) {
    for (let index = 0; index < fragment.seeds.length; index += 1) {
      const seed = fragment.seeds[index];
      const orbit = system.orbits[seed.orbitIndex];
      const angle = seed.phase + time * orbit.definition.speed;

      position.set(
        Math.cos(angle) * seed.radius,
        Math.sin(angle) * seed.radius,
        seed.depth,
      );
      position.applyEuler(orbit.euler);

      dummy.position.copy(position);
      dummy.rotation.set(
        time * seed.spin[0] + seed.phase,
        time * seed.spin[1] + seed.phase * 1.7,
        time * seed.spin[2] + seed.phase * 0.6,
      );
      dummy.scale.setScalar(seed.size);
      dummy.updateMatrix();

      fragment.mesh.setMatrixAt(index, dummy.matrix);
    }

    fragment.mesh.instanceMatrix.needsUpdate = true;
  }
}

function damp(
  current: number,
  target: number,
  smoothing: number,
  delta: number,
): number {
  return current + (target - current) * (1 - Math.exp(-smoothing * delta));
}

export function createGlassOrbits(
  canvas: HTMLCanvasElement,
  options: GlassOrbitsOptions = {},
): GlassOrbitsHandle | null {
  const { definition: quality } = resolveQuality();

  let renderer: THREE.WebGLRenderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: quality.antialias,
      powerPreference: "high-performance",
    });
  } catch {
    options.onFailure?.();
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxDpr));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    glassOrbitsConfig.camera.fov,
    window.innerWidth / Math.max(window.innerHeight, 1),
    glassOrbitsConfig.camera.near,
    glassOrbitsConfig.camera.far,
  );
  camera.position.set(0, 0, glassOrbitsConfig.camera.z);

  const sharedUniforms: SharedUniforms = {
    uPointer: { value: new THREE.Vector3(999, 999, 0) },
    uPointerRadius: { value: glassOrbitsConfig.pointer.radius },
    uPointerStrength: { value: 0 },
    uTime: { value: 0 },
  };

  const primary = buildSystem(
    glassOrbitsConfig.systems.primary,
    quality.primary,
    quality,
    sharedUniforms,
    0x1a2b3c4d,
  );
  scene.add(primary.group);

  const hasSecondary =
    quality.secondary.icosa + quality.secondary.octa > 0;
  const secondary = hasSecondary
    ? buildSystem(
        glassOrbitsConfig.systems.secondary,
        quality.secondary,
        quality,
        sharedUniforms,
        0x5e6f7a8b,
      )
    : null;

  if (secondary) {
    scene.add(secondary.group);
  }

  const pointerTarget = new THREE.Vector2(0, 0);
  const pointer = new THREE.Vector2(0, 0);
  let pointerStrength = 0;
  let pointerStrengthTarget = 0;

  const raycaster = new THREE.Raycaster();
  const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const pointerWorld = new THREE.Vector3(999, 999, 0);

  const dummy = new THREE.Object3D();
  const fragmentPosition = new THREE.Vector3();

  let elapsed = 0;
  let lastFrame = 0;
  let frameId = 0;
  let running = false;
  let ready = false;
  let disposed = false;

  const updateScene = (delta: number) => {
    pointer.x = damp(
      pointer.x,
      pointerTarget.x,
      glassOrbitsConfig.motion.pointerSmoothing,
      delta,
    );
    pointer.y = damp(
      pointer.y,
      pointerTarget.y,
      glassOrbitsConfig.motion.pointerSmoothing,
      delta,
    );
    pointerStrength = damp(
      pointerStrength,
      pointerStrengthTarget,
      3.2,
      delta,
    );

    if (pointerStrength < 0.001) {
      pointerStrength = 0;
    }

    const cameraTargetX =
      pointer.x * glassOrbitsConfig.pointer.parallaxX +
      Math.sin(elapsed * 0.11) * 0.07;
    const cameraTargetY =
      pointer.y * glassOrbitsConfig.pointer.parallaxY +
      Math.cos(elapsed * 0.09) * 0.05;

    camera.position.x = damp(
      camera.position.x,
      cameraTargetX,
      glassOrbitsConfig.motion.cameraSmoothing,
      delta,
    );
    camera.position.y = damp(
      camera.position.y,
      cameraTargetY,
      glassOrbitsConfig.motion.cameraSmoothing,
      delta,
    );
    camera.lookAt(0, 0, 0);

    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(pointerPlane, pointerWorld)) {
      sharedUniforms.uPointer.value.copy(pointerWorld);
    }

    sharedUniforms.uPointerStrength.value = pointerStrength;
    sharedUniforms.uTime.value = elapsed;

    const primaryRotation = primary.baseRotation;
    primary.group.rotation.x =
      primaryRotation[0] +
      pointer.y * glassOrbitsConfig.pointer.tiltX +
      Math.sin(elapsed * 0.1) * 0.014;
    primary.group.rotation.y =
      primaryRotation[1] +
      pointer.x * glassOrbitsConfig.pointer.tiltY +
      Math.cos(elapsed * 0.085) * 0.014;
    primary.group.rotation.z =
      primaryRotation[2] + pointer.x * 0.02;

    if (secondary) {
      const secondaryRotation = secondary.baseRotation;
      secondary.group.rotation.x =
        secondaryRotation[0] +
        pointer.y * glassOrbitsConfig.pointer.tiltX * 1.4 +
        Math.sin(elapsed * 0.12 + 1.4) * 0.012;
      secondary.group.rotation.y =
        secondaryRotation[1] +
        pointer.x * glassOrbitsConfig.pointer.tiltY * 1.4 +
        Math.cos(elapsed * 0.1 + 0.8) * 0.012;
      secondary.group.rotation.z =
        secondaryRotation[2] + pointer.x * 0.025;
    }

    updateSystem(primary, elapsed, dummy, fragmentPosition);
    if (secondary) {
      updateSystem(secondary, elapsed, dummy, fragmentPosition);
    }
  };

  const render = () => {
    renderer.render(scene, camera);

    if (!ready) {
      ready = true;
      options.onReady?.();
    }
  };

  const tick = (now: number) => {
    frameId = window.requestAnimationFrame(tick);

    const delta = (now - lastFrame) / 1000;
    const minimumDelta = 1 / glassOrbitsConfig.motion.maxFps - 0.002;

    if (delta < minimumDelta) {
      return;
    }

    lastFrame = now;
    const clampedDelta = Math.min(delta, 0.05);
    elapsed += clampedDelta;

    updateScene(clampedDelta);
    render();
  };

  const start = () => {
    if (running || disposed) return;
    running = true;
    lastFrame = performance.now();
    frameId = window.requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    window.cancelAnimationFrame(frameId);
  };

  const onResize = () => {
    const width = window.innerWidth;
    const height = Math.max(window.innerHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, quality.maxDpr),
    );
    renderer.setSize(width, height, false);
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerTarget.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
    pointerStrengthTarget = 1;
  };

  const onPointerEnd = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      pointerStrengthTarget = 0;
    }
  };

  const onPointerOut = (event: PointerEvent) => {
    if (!event.relatedTarget) {
      pointerStrengthTarget = 0;
    }
  };

  const onWindowBlur = () => {
    pointerStrengthTarget = 0;
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    options.onFailure?.();
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerEnd, { passive: true });
  window.addEventListener("pointercancel", onPointerEnd, { passive: true });
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("blur", onWindowBlur);
  document.addEventListener("visibilitychange", onVisibilityChange);
  canvas.addEventListener("webglcontextlost", onContextLost);

  updateScene(0);
  render();
  start();

  const dispose = () => {
    if (disposed) return;
    disposed = true;

    stop();

    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerEnd);
    window.removeEventListener("pointercancel", onPointerEnd);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("blur", onWindowBlur);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        geometries.add(object.geometry);
        const material = object.material;
        if (Array.isArray(material)) {
          for (const entry of material) {
            materials.add(entry);
          }
        } else {
          materials.add(material);
        }
      }
    });

    for (const geometry of geometries) {
      geometry.dispose();
    }
    for (const material of materials) {
      material.dispose();
    }

    renderer.dispose();
  };

  return { dispose };
}
