'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface CredoSceneProps {
  scrollProgress: number; // 0 to 1 across the full page
  activeSection: string;
  activeCourseIndex: number;
  onSceneReady?: () => void;
  interactive?: boolean;
}

export default function Credo3DScene({
  scrollProgress,
  activeSection,
  activeCourseIndex,
  onSceneReady,
  interactive = true,
}: CredoSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // 3D Model Group Refs
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const goldShellGroupRef = useRef<THREE.Group | null>(null);
  const glassCubeMeshRef = useRef<THREE.Mesh | null>(null);
  const spikyCoreMeshRef = useRef<THREE.Mesh | null>(null);
  const shatterParticlesRef = useRef<THREE.Points | null>(null);
  const particleVelocitiesRef = useRef<Float32Array | null>(null);
  const particleOriginsRef = useRef<Float32Array | null>(null);
  
  // Caustic Glow Halo Mesh & Shader Uniforms Ref
  const causticHaloMeshRef = useRef<THREE.Mesh | null>(null);
  const causticMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const causticInternalLightRef = useRef<THREE.PointLight | null>(null);

  // Honeycomb golden tiles with foreground camera dolly trajectory
  const goldTilesDataRef = useRef<Array<{
    mesh: THREE.Mesh;
    basePos: THREE.Vector3;
    normal: THREE.Vector3;
    rotationAxis: THREE.Vector3;
    rotSpeed: number;
    delay: number;
    isForegroundDolly: boolean;
    flyByOffset: THREE.Vector3;
  }>>([]);

  // Mouse & Drag interaction with momentum / inertia
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const manualRotVelocityRef = useRef({ x: 0, y: 0 });
  const manualRotationRef = useRef({ x: 0, y: 0 });

  // Course spring bounce state
  const prevCourseIndexRef = useRef(activeCourseIndex);
  const courseBounceTimeRef = useRef(0);

  // Spline Trajectory & Physics State
  const stateRef = useRef({
    targetPosX: 0,
    targetPosY: 0,
    targetPosZ: 0,
    targetScale: 1.0,
    targetFOV: 42,
    currentPosX: 0,
    currentPosY: 0,
    currentPosZ: 0,
    currentScale: 1.0,
    currentFOV: 42,
    // Velocity tracking for dynamic banking & tilt
    lastPosX: 0,
    lastPosY: 0,
    velX: 0,
    velY: 0,
    bankRoll: 0,
    bankPitch: 0,
    // Explosion & Shatter
    explodeProgress: 0,
    currentExplode: 0,
    shatterProgress: 0,
    currentShatter: 0,
    // Caustic build-up intensity (0 to 1)
    causticBuildUp: 0,
    currentCaustic: 0,
    coreRotationY: 0,
  });

  // Track active course index changes for elastic hop animation
  useEffect(() => {
    if (prevCourseIndexRef.current !== activeCourseIndex) {
      prevCourseIndexRef.current = activeCourseIndex;
      courseBounceTimeRef.current = 1.0; // trigger bounce spring
    }
  }, [activeCourseIndex]);

  // Compute 3D Spline Path based on scrollProgress + active section
  useEffect(() => {
    const s = stateRef.current;
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Calculate caustic build-up right before and during the shatter transition
    // p in [0.22, 0.38] -> pre-shatter resonance
    if (p >= 0.20 && p <= 0.38) {
      // Build up to 1.0 at p ~ 0.28, then flash release
      const prePhase = (p - 0.20) / 0.08;
      const releasePhase = (p - 0.28) / 0.10;
      if (p < 0.28) {
        s.causticBuildUp = Math.min(1.0, prePhase);
      } else {
        s.causticBuildUp = Math.max(0.0, 1.0 - releasePhase);
      }
    } else {
      s.causticBuildUp = 0.0;
    }

    if (activeSection === 'courses') {
      const courseYPositions = [1.2, 0.4, -0.4, -1.2];
      s.targetPosX = -0.85;
      s.targetPosY = courseYPositions[activeCourseIndex] ?? 0;
      s.targetPosZ = 0.85;
      s.targetScale = 0.68;
      s.targetFOV = 40;
      s.explodeProgress = 1.0;
      s.shatterProgress = 1.0;
    } else {
      if (p <= 0.12) {
        // Hero
        const t = p / 0.12;
        s.targetPosX = 0;
        s.targetPosY = THREE.MathUtils.lerp(-0.7, -0.3, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.0, 0.2, t);
        s.targetScale = THREE.MathUtils.lerp(1.15, 1.25, t);
        s.targetFOV = THREE.MathUtils.lerp(42, 39, t);
        s.explodeProgress = 0.0;
        s.shatterProgress = 0.0;
      } else if (p <= 0.28) {
        // Elevate (Golden Shell Explodes + Foreground Dolly Fly-through)
        const t = (p - 0.12) / 0.16;
        s.targetPosX = 0;
        s.targetPosY = THREE.MathUtils.lerp(-0.3, 0.0, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.2, 0.5, t);
        s.targetScale = THREE.MathUtils.lerp(1.25, 1.28, t);
        s.targetFOV = 39;
        s.explodeProgress = Math.min(1.0, t * 1.35);
        s.shatterProgress = 0.0;
      } else if (p <= 0.42) {
        // Discover (Caustic Glow Flare + Glass Cube Shatters into sparkling dust)
        const t = (p - 0.28) / 0.14;
        s.targetPosX = 0;
        s.targetPosY = THREE.MathUtils.lerp(0.0, -0.4, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.5, 0.1, t);
        s.targetScale = THREE.MathUtils.lerp(1.28, 1.18, t);
        s.targetFOV = 41;
        s.explodeProgress = 1.0;
        s.shatterProgress = Math.min(1.0, t * 1.4);
      } else if (p <= 0.56) {
        // Financial Path
        const t = (p - 0.42) / 0.14;
        s.targetPosX = THREE.MathUtils.lerp(0.0, -0.4, t);
        s.targetPosY = THREE.MathUtils.lerp(-0.4, -1.6, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.1, 0.0, t);
        s.targetScale = THREE.MathUtils.lerp(1.18, 1.22, t);
        s.targetFOV = 42;
        s.explodeProgress = 1.0;
        s.shatterProgress = 1.0;
      } else if (p <= 0.70) {
        // Benefits Section
        const t = (p - 0.56) / 0.14;
        s.targetPosX = THREE.MathUtils.lerp(-0.4, -0.85, t);
        s.targetPosY = THREE.MathUtils.lerp(-1.6, 0.0, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.0, 0.35, t);
        s.targetScale = THREE.MathUtils.lerp(1.22, 1.15, t);
        s.targetFOV = 41;
        s.explodeProgress = 1.0;
        s.shatterProgress = 1.0;
      } else if (p <= 0.85) {
        // Towards Courses Section
        const t = (p - 0.70) / 0.15;
        const courseYPositions = [1.2, 0.4, -0.4, -1.2];
        const targetY = courseYPositions[activeCourseIndex] ?? 0;
        s.targetPosX = -0.85;
        s.targetPosY = THREE.MathUtils.lerp(0.0, targetY, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.35, 0.85, t);
        s.targetScale = THREE.MathUtils.lerp(1.15, 0.68, t);
        s.targetFOV = 40;
        s.explodeProgress = 1.0;
        s.shatterProgress = 1.0;
      } else if (p <= 0.94) {
        // Values Grid Section
        const t = (p - 0.85) / 0.09;
        s.targetPosX = THREE.MathUtils.lerp(-0.85, 0.0, t);
        s.targetPosY = THREE.MathUtils.lerp(0.0, 0.0, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.85, 0.0, t);
        s.targetScale = THREE.MathUtils.lerp(0.68, 1.05, t);
        s.targetFOV = 44;
        s.explodeProgress = 1.0;
        s.shatterProgress = 1.0;
      } else {
        // Footer Section
        const t = (p - 0.94) / 0.06;
        s.targetPosX = THREE.MathUtils.lerp(0.0, -1.8, t);
        s.targetPosY = THREE.MathUtils.lerp(0.0, -0.5, t);
        s.targetPosZ = THREE.MathUtils.lerp(0.0, -0.5, t);
        s.targetScale = THREE.MathUtils.lerp(1.05, 0.7, t);
        s.targetFOV = 42;
        s.explodeProgress = 1.0;
        s.shatterProgress = 1.0;
      }
    }
  }, [activeSection, scrollProgress, activeCourseIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Z = 8.2)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ed, 3.2);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa0c4e8, 1.5);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // Coral-red rim light behind
    const rimLight = new THREE.DirectionalLight(0xff4d37, 3.0);
    rimLight.position.set(0, 4, -6);
    scene.add(rimLight);

    // Dynamic point light for surface glints
    const dynamicPointLight = new THREE.PointLight(0xffaa44, 2.2, 12);
    scene.add(dynamicPointLight);

    // Caustic internal point light that pulses right before shatter
    const causticInternalLight = new THREE.PointLight(0xffeedd, 0.0, 10);
    causticInternalLight.position.set(0, 0, 0);
    scene.add(causticInternalLight);
    causticInternalLightRef.current = causticInternalLight;

    // 5. Main Hierarchical Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // -------------------------------------------------------------
    // A. RED SPIKY CORE (Stellated Polyhedron)
    // -------------------------------------------------------------
    const createStellatedCore = () => {
      const baseGeo = new THREE.IcosahedronGeometry(1.0, 1);
      const posAttr = baseGeo.attributes.position;
      const count = posAttr.count;

      const positions: number[] = [];
      const normals: number[] = [];

      for (let i = 0; i < count; i += 3) {
        const vA = new THREE.Vector3().fromBufferAttribute(posAttr, i);
        const vB = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
        const vC = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);

        const center = new THREE.Vector3().add(vA).add(vB).add(vC).divideScalar(3);
        const edge1 = new THREE.Vector3().subVectors(vB, vA);
        const edge2 = new THREE.Vector3().subVectors(vC, vA);
        const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

        const spikeHeight = 0.72;
        const apex = center.clone().add(normal.clone().multiplyScalar(spikeHeight));

        const addTri = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) => {
          const fn = new THREE.Vector3()
            .crossVectors(
              new THREE.Vector3().subVectors(p2, p1),
              new THREE.Vector3().subVectors(p3, p1)
            )
            .normalize();

          positions.push(p1.x, p1.y, p1.z);
          positions.push(p2.x, p2.y, p2.z);
          positions.push(p3.x, p3.y, p3.z);

          for (let k = 0; k < 3; k++) {
            normals.push(fn.x, fn.y, fn.z);
          }
        };

        addTri(vA, vB, apex);
        addTri(vB, vC, apex);
        addTri(vC, vA, apex);
      }

      const stellatedGeo = new THREE.BufferGeometry();
      stellatedGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      stellatedGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

      const spikyMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xdc2626),
        emissive: new THREE.Color(0x330005),
        roughness: 0.22,
        metalness: 0.18,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        sheen: 0.65,
        sheenColor: new THREE.Color(0xff4d37),
        flatShading: true,
      });

      return new THREE.Mesh(stellatedGeo, spikyMaterial);
    };

    const spikyCore = createStellatedCore();
    mainGroup.add(spikyCore);
    spikyCoreMeshRef.current = spikyCore;

    // -------------------------------------------------------------
    // B. TRANSLUCENT REFRACTIVE GLASS CUBE
    // -------------------------------------------------------------
    const cubeGeo = new THREE.BoxGeometry(2.35, 2.35, 2.35);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 0.85,
      transparent: true,
      roughness: 0.06,
      ior: 1.52,
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      reflectivity: 0.85,
    });
    const glassCube = new THREE.Mesh(cubeGeo, glassMaterial);
    
    const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    glassCube.add(edgeLines);

    mainGroup.add(glassCube);
    glassCubeMeshRef.current = glassCube;

    // -------------------------------------------------------------
    // C. REFRACTIVE LIGHT CAUSTICS / GLOW HALO SHADER
    // Volumetric pre-shatter resonance halo pulsing behind the cube
    // -------------------------------------------------------------
    const causticVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const causticFragmentShader = `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColorCore;
      uniform vec3 uColorRim;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        // Centered radial distance (0 to 1)
        vec2 center = vUv - vec2(0.5);
        float dist = length(center) * 2.0;

        if (dist > 1.0 || uIntensity <= 0.001) {
          discard;
        }

        // Concentric caustic ripples pulsing outward
        float ripple1 = sin(dist * 22.0 - uTime * 9.0) * 0.5 + 0.5;
        float ripple2 = sin(dist * 14.0 + uTime * 6.0) * 0.5 + 0.5;
        float causticRings = mix(ripple1, ripple2, 0.5);

        // Angular caustic refraction spikes
        float angle = atan(center.y, center.x);
        float spikes = sin(angle * 12.0 + uTime * 3.0) * 0.5 + 0.5;
        float rays = pow(spikes, 3.0) * 0.4;

        // Exponential falloff towards perimeter
        float falloff = pow(1.0 - dist, 1.8);

        // Core radiant glow
        float coreGlow = exp(-dist * 3.2);

        // Composite illumination
        float totalAlpha = (falloff * causticRings * 0.7 + rays * falloff + coreGlow * 1.2) * uIntensity;
        vec3 finalColor = mix(uColorCore, uColorRim, dist * 0.8 + causticRings * 0.2);

        gl_FragColor = vec4(finalColor, clamp(totalAlpha, 0.0, 1.0));
      }
    `;

    const causticHaloGeo = new THREE.PlaneGeometry(5.8, 5.8);
    const causticHaloMat = new THREE.ShaderMaterial({
      vertexShader: causticVertexShader,
      fragmentShader: causticFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uColorCore: { value: new THREE.Color(0xffeedd) }, // warm crystalline core
        uColorRim: { value: new THREE.Color(0xff4d37) },  // Credo coral-red edge
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const causticHaloMesh = new THREE.Mesh(causticHaloGeo, causticHaloMat);
    causticHaloMesh.position.set(0, 0, -0.4); // placed directly behind glass cube
    mainGroup.add(causticHaloMesh);
    causticHaloMeshRef.current = causticHaloMesh;
    causticMaterialRef.current = causticHaloMat;

    // -------------------------------------------------------------
    // D. GLASS SHATTER PARTICLE SYSTEM (5,500 sparkling shards)
    // -------------------------------------------------------------
    const particleCount = 5500;
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities = new Float32Array(particleCount * 3);
    const pOrigins = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);

    const halfSize = 1.18;
    for (let i = 0; i < particleCount; i++) {
      const face = Math.floor(Math.random() * 6);
      const u = (Math.random() - 0.5) * 2 * halfSize;
      const v = (Math.random() - 0.5) * 2 * halfSize;
      let x = 0, y = 0, z = 0;

      switch (face) {
        case 0: x = halfSize; y = u; z = v; break;
        case 1: x = -halfSize; y = u; z = v; break;
        case 2: y = halfSize; x = u; z = v; break;
        case 3: y = -halfSize; x = u; z = v; break;
        case 4: z = halfSize; x = u; y = v; break;
        case 5: z = -halfSize; x = u; y = v; break;
      }

      pOrigins[i * 3] = x;
      pOrigins[i * 3 + 1] = y;
      pOrigins[i * 3 + 2] = z;

      pPositions[i * 3] = x;
      pPositions[i * 3 + 1] = y;
      pPositions[i * 3 + 2] = z;

      const dir = new THREE.Vector3(x, y, z).normalize();
      const speed = 1.8 + Math.random() * 4.2;
      const swirl = new THREE.Vector3(
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.9
      );
      const vel = dir.add(swirl).normalize().multiplyScalar(speed);

      pVelocities[i * 3] = vel.x;
      pVelocities[i * 3 + 1] = vel.y;
      pVelocities[i * 3 + 2] = vel.z;

      pSizes[i] = Math.random() * 2.5 + 0.8;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    const pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const shatterParticles = new THREE.Points(pGeo, pMaterial);
    mainGroup.add(shatterParticles);
    shatterParticlesRef.current = shatterParticles;
    particleVelocitiesRef.current = pVelocities;
    particleOriginsRef.current = pOrigins;

    // -------------------------------------------------------------
    // E. GOLDEN HONEYCOMB SPHERICAL SHELL & FOREGROUND CAMERA DOLLY
    // A subset of front-facing tiles fly directly past the camera (Z > 8)
    // -------------------------------------------------------------
    const goldShellGroup = new THREE.Group();
    mainGroup.add(goldShellGroup);
    goldShellGroupRef.current = goldShellGroup;

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd4af37),
      roughness: 0.16,
      metalness: 0.95,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      flatShading: true,
    });

    const createHexPrismGeo = (radius = 0.28, thickness = 0.08) => {
      const shape = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const hx = radius * Math.cos(angle);
        const hy = radius * Math.sin(angle);
        if (i === 0) shape.moveTo(hx, hy);
        else shape.lineTo(hx, hy);
      }
      shape.closePath();

      return new THREE.ExtrudeGeometry(shape, {
        depth: thickness,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      });
    };

    const hexTileGeo = createHexPrismGeo(0.28, 0.08);
    const tileCount = 104;
    const sphereRadius = 2.05;
    const tilesData: Array<{
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      normal: THREE.Vector3;
      rotationAxis: THREE.Vector3;
      rotSpeed: number;
      delay: number;
      isForegroundDolly: boolean;
      flyByOffset: THREE.Vector3;
    }> = [];

    let foregroundDollyCount = 0;

    for (let i = 0; i < tileCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / tileCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      const normal = new THREE.Vector3(x, y, z).normalize();
      const basePos = normal.clone().multiplyScalar(sphereRadius);

      const tileMesh = new THREE.Mesh(hexTileGeo, goldMaterial);
      tileMesh.position.copy(basePos);
      tileMesh.lookAt(basePos.clone().add(normal));

      goldShellGroup.add(tileMesh);

      // Identify foreground tiles that face forward towards the camera (Z > 0.35)
      // Limit to ~14 tiles so they form a balanced, cinematic debris fly-past
      const isForegroundDolly = normal.z > 0.4 && foregroundDollyCount < 14;
      if (isForegroundDolly) {
        foregroundDollyCount++;
      }

      // Fly-by offset: slightly outwards to the screen periphery as it passes the lens
      const flyByOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 2.8,
        0
      );

      tilesData.push({
        mesh: tileMesh,
        basePos: basePos.clone(),
        normal: normal.clone(),
        rotationAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize(),
        rotSpeed: (Math.random() * 2 + 1.2) * (Math.random() > 0.5 ? 1 : -1),
        delay: isForegroundDolly ? Math.random() * 0.12 : Math.random() * 0.25,
        isForegroundDolly,
        flyByOffset,
      });
    }
    goldTilesDataRef.current = tilesData;

    // 6. Pointer Parallax & Inertial Drag Interaction
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = nx * 0.45;
      mouseRef.current.targetY = ny * 0.35;

      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        manualRotVelocityRef.current.y = dx * 0.006;
        manualRotVelocityRef.current.x = dy * 0.006;
        manualRotationRef.current.y += manualRotVelocityRef.current.y;
        manualRotationRef.current.x += manualRotVelocityRef.current.x;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      manualRotVelocityRef.current = { x: 0, y: 0 };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Render Loop with Cinematic Debris Dolly & Caustic Pulses
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const s = stateRef.current;

      // Smooth lerp positions & transformations
      const lerpFactor = 0.085;
      s.currentPosX += (s.targetPosX - s.currentPosX) * lerpFactor;
      s.currentPosY += (s.targetPosY - s.currentPosY) * lerpFactor;
      s.currentPosZ += (s.targetPosZ - s.currentPosZ) * lerpFactor;
      s.currentScale += (s.targetScale - s.currentScale) * lerpFactor;
      s.currentFOV += (s.targetFOV - s.currentFOV) * lerpFactor;
      s.currentExplode += (s.explodeProgress - s.currentExplode) * 0.07;
      s.currentShatter += (s.shatterProgress - s.currentShatter) * 0.08;
      s.currentCaustic += (s.causticBuildUp - s.currentCaustic) * 0.12;

      // Dynamic Camera FOV Adjustment
      if (camera.fov !== s.currentFOV) {
        camera.fov = s.currentFOV;
        camera.updateProjectionMatrix();
      }

      // Compute velocity for kinetic banking & tilt
      s.velX = s.currentPosX - s.lastPosX;
      s.velY = s.currentPosY - s.lastPosY;
      s.lastPosX = s.currentPosX;
      s.lastPosY = s.currentPosY;

      const targetRoll = -s.velX * 3.5;
      const targetPitch = s.velY * 3.5;
      s.bankRoll += (targetRoll - s.bankRoll) * 0.12;
      s.bankPitch += (targetPitch - s.bankPitch) * 0.12;

      // Course switch elastic hop & squash
      let bounceOffset = 0;
      let squashY = 1.0;
      if (courseBounceTimeRef.current > 0) {
        courseBounceTimeRef.current = Math.max(0, courseBounceTimeRef.current - delta * 3.0);
        const bt = 1.0 - courseBounceTimeRef.current;
        bounceOffset = Math.sin(bt * Math.PI) * 0.22;
        squashY = 1.0 - Math.sin(bt * Math.PI) * 0.14;
      }

      // Mouse parallax & inertia decay
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      if (!isDraggingRef.current) {
        manualRotationRef.current.y += manualRotVelocityRef.current.y;
        manualRotationRef.current.x += manualRotVelocityRef.current.x;
        manualRotVelocityRef.current.y *= 0.94;
        manualRotVelocityRef.current.x *= 0.94;
      }

      // Apply transformations to Main Group
      if (mainGroupRef.current) {
        mainGroupRef.current.position.set(
          s.currentPosX,
          s.currentPosY + bounceOffset,
          s.currentPosZ
        );
        mainGroupRef.current.scale.set(
          s.currentScale,
          s.currentScale * squashY,
          s.currentScale
        );

        s.coreRotationY += delta * 0.55;
        mainGroupRef.current.rotation.y =
          s.coreRotationY + mouseRef.current.x + manualRotationRef.current.y;
        mainGroupRef.current.rotation.x =
          mouseRef.current.y + manualRotationRef.current.x + s.bankPitch;
        mainGroupRef.current.rotation.z = s.bankRoll;
      }

      // Continuous subtle breathing on spiky core
      if (spikyCoreMeshRef.current) {
        const breath = 1.0 + Math.sin(elapsedTime * 2.2) * 0.035;
        spikyCoreMeshRef.current.scale.set(breath, breath, breath);
      }

      // Orbiting dynamic point light for surface glints
      dynamicPointLight.position.set(
        s.currentPosX + Math.sin(elapsedTime * 1.5) * 1.2,
        s.currentPosY + Math.cos(elapsedTime * 1.5) * 1.2,
        s.currentPosZ + 1.2
      );

      // Update Caustic Halo Shader & Internal Glow Light
      if (causticMaterialRef.current && causticHaloMeshRef.current) {
        causticMaterialRef.current.uniforms.uTime.value = elapsedTime;
        
        // Intensity pulses rapidly right before shatter
        const pulseFrequency = 12.0 + s.currentCaustic * 18.0;
        const pulseWobble = 0.85 + Math.sin(elapsedTime * pulseFrequency) * 0.15;
        const haloIntensity = Math.max(0, s.currentCaustic * pulseWobble);
        
        causticMaterialRef.current.uniforms.uIntensity.value = haloIntensity;
        causticHaloMeshRef.current.visible = haloIntensity > 0.01;

        // Scale caustic halo plane dynamically as it builds up
        const haloScale = 1.0 + s.currentCaustic * 0.35 + Math.sin(elapsedTime * 10.0) * 0.05;
        causticHaloMeshRef.current.scale.set(haloScale, haloScale, 1.0);

        // Internal light intensity tracks caustic resonance
        if (causticInternalLightRef.current) {
          causticInternalLightRef.current.intensity = haloIntensity * 3.5;
        }
      }

      // Update Golden Shell Explosion with Foreground Camera Dolly
      const explodeVal = s.currentExplode;
      const tiles = goldTilesDataRef.current;
      for (let i = 0; i < tiles.length; i++) {
        const item = tiles[i];
        const tVal = Math.max(0, Math.min(1, (explodeVal - item.delay) / (1 - item.delay)));
        
        if (tVal <= 0.001) {
          item.mesh.position.copy(item.basePos);
          item.mesh.lookAt(item.basePos.clone().add(item.normal));
          item.mesh.scale.set(1, 1, 1);
          item.mesh.visible = true;
        } else {
          if (item.isForegroundDolly) {
            // FOREGROUND DOLLY TRAJECTORY:
            // Fly forward along Z from ~2.0 up to 9.5 (past the camera lens at Z=8.2!)
            // Camera position is at (0, 0, 8.2), so tiles will shoot right past the lens
            const progressEased = Math.pow(tVal, 1.2);
            const dollyZ = item.basePos.z + progressEased * 9.8;
            const dollyX = item.basePos.x + item.normal.x * (progressEased * 2.5) + item.flyByOffset.x * progressEased;
            const dollyY = item.basePos.y + item.normal.y * (progressEased * 2.5) + item.flyByOffset.y * progressEased;

            item.mesh.position.set(dollyX, dollyY, dollyZ);
            item.mesh.rotateOnAxis(item.rotationAxis, delta * item.rotSpeed * 4.2);

            // Perspective scale: grows larger as it nears lens, then fades as it passes behind camera
            const distToCam = 8.2 - (dollyZ + s.currentPosZ);
            if (distToCam < -0.2) {
              // Passed behind the camera lens
              item.mesh.visible = false;
            } else if (distToCam < 1.2) {
              // Very close to camera lens: huge cinematic scale & soft fade out
              item.mesh.visible = true;
              const nearScale = 1.0 + (1.2 - distToCam) * 0.8;
              item.mesh.scale.set(nearScale, nearScale, nearScale);
            } else {
              item.mesh.visible = true;
              item.mesh.scale.set(1.0, 1.0, 1.0);
            }
          } else {
            // STANDARD AMBIENT DEBRIS EXPLOSION:
            const explodeDistance = Math.pow(tVal, 1.4) * 8.5;
            const pos = item.basePos.clone().add(item.normal.clone().multiplyScalar(explodeDistance));
            item.mesh.position.copy(pos);
            item.mesh.rotateOnAxis(item.rotationAxis, delta * item.rotSpeed * 2.5);

            const scale = Math.max(0.01, 1 - tVal * 0.5);
            item.mesh.scale.set(scale, scale, scale);
            item.mesh.visible = tVal < 0.98;
          }
        }
      }

      // Update Glass Cube & Shatter Particles
      const shatterVal = s.currentShatter;
      if (glassCubeMeshRef.current && shatterParticlesRef.current) {
        if (shatterVal <= 0.01) {
          glassCubeMeshRef.current.visible = true;
          (glassCubeMeshRef.current.material as THREE.MeshPhysicalMaterial).opacity = 0.85;
          (shatterParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.0;
        } else {
          const cubeOpacity = Math.max(0, 0.85 * (1 - shatterVal * 2.5));
          (glassCubeMeshRef.current.material as THREE.MeshPhysicalMaterial).opacity = cubeOpacity;
          glassCubeMeshRef.current.visible = cubeOpacity > 0.01;

          const pMat = shatterParticlesRef.current.material as THREE.PointsMaterial;
          pMat.opacity = Math.max(0, Math.sin(shatterVal * Math.PI) * 0.95);

          const posAttr = shatterParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
          const posArr = posAttr.array as Float32Array;
          const velArr = particleVelocitiesRef.current;
          const origArr = particleOriginsRef.current;

          if (velArr && origArr) {
            const spread = shatterVal * 3.8;
            for (let i = 0; i < particleCount; i++) {
              const idx = i * 3;
              posArr[idx] = origArr[idx] + velArr[idx] * spread;
              posArr[idx + 1] = origArr[idx + 1] + velArr[idx + 1] * spread;
              posArr[idx + 2] = origArr[idx + 2] + velArr[idx + 2] * spread;
            }
            posAttr.needsUpdate = true;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();
    if (onSceneReady) onSceneReady();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [interactive, onSceneReady]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
}
