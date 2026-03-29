import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
function DriftParticles({ count = 400 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#67e8f9"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function SoftOrb() {
  const mesh = useRef();
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.position.x = Math.sin(t * 0.35) * 4;
    mesh.current.position.y = Math.cos(t * 0.28) * 2.2;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={mesh} position={[6, 2, -8]}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#312e81"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.25}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export function SciFiBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <color attach="background" args={["#05060f"]} />
        <fog attach="fog" args={["#05060f", 18, 48]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[8, 10, 6]} intensity={0.9} color="#22d3ee" />
        <Stars radius={90} depth={60} count={4500} factor={3} saturation={0} fade speed={0.4} />
        <DriftParticles count={320} />
        <SoftOrb />
      </Canvas>
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-void/40 to-void"
        aria-hidden
      />
    </div>
  );
}
