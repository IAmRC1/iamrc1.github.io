"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  PointMaterial,
  Points,
} from "@react-three/drei";
import { Component, type ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Group } from "three";
import { HeroMiniGame } from "@/components/HeroMiniGame";

function useWebGLSupport() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

function HeroFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
      <Image
        src="/images/hero-large.svg"
        alt="Developer illustration"
        fill
        priority
        className="object-contain p-10"
      />
    </div>
  );
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(Boolean(mq.matches));
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function Constellation({ pointer }: { pointer: { x: number; y: number } }) {
  const groupRef = useRef<Group>(null);
  const { size } = useThree();

  const positions = useMemo(() => {
    const isSmall = size.width < 640;
    const isMedium = size.width >= 640 && size.width < 1024;
    const count = isSmall ? 700 : isMedium ? 1100 : 1400;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 2.0 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const idx = i * 3;
      data[idx + 0] = x;
      data[idx + 1] = y;
      data[idx + 2] = z;
    }

    return data;
  }, [size.width]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    g.rotation.y = t * 0.06 + pointer.x * 0.15;
    g.rotation.x = t * 0.03 + pointer.y * 0.12;
    g.position.x = pointer.x * 0.12;
    g.position.y = pointer.y * 0.12;
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="white"
          size={0.012}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
    </group>
  );
}

export function Hero3D() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebGLSupport();
  const [pointer] = useState({ x: 0, y: 0 });

  if (prefersReducedMotion) {
    return (
      <div className="h-full w-full rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white" />
    );
  }

  if (!webglSupported) {
    return <HeroFallback />;
  }

  return (
    <CanvasErrorBoundary fallback={<HeroFallback />}>
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
        <Canvas
          camera={{ position: [0, 0, 3.6], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.7} />
          <hemisphereLight intensity={0.9} color="white" groundColor="gray" />
          <directionalLight position={[4, 5, 3]} intensity={1.35} />
          <pointLight position={[-4, -2, 2]} intensity={0.6} />

          <Constellation pointer={pointer} />

          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={7}
            blur={2.6}
            far={2.2}
          />

          <Suspense fallback={null}>
            {/* Reserved for future content */}
          </Suspense>
        </Canvas>

        <HeroMiniGame />
      </div>
    </CanvasErrorBoundary>
  );
}
