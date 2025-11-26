import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { IHoneyDrop } from '../types';
import { useGameStore } from '../store';
import { Float } from '@react-three/drei';
import { playCollectSound } from '../sounds';

interface HoneyProps {
  data: IHoneyDrop;
}

export const Collectible: React.FC<HoneyProps> = ({ data }) => {
  const groupRef = useRef<Group>(null);
  const playerPos = useGameStore(state => state.playerPos);
  const collect = useGameStore(state => state.collectHoney);
  const initialized = useRef(false);

  // Initialize position only once
  useEffect(() => {
    if (groupRef.current && !initialized.current) {
      groupRef.current.position.set(...data.position);
      initialized.current = true;
    }
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Optimized distance calculation (avoid creating Vector3 objects)
    const dx = playerPos[0] - groupRef.current.position.x;
    const dy = playerPos[1] - groupRef.current.position.y;
    const dz = playerPos[2] - groupRef.current.position.z;
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq < 2.25) { // 1.5 * 1.5 = 2.25
      collect(data.id);
      playCollectSound();
    }

    groupRef.current.rotation.y += 0.02;
  });

  return (
    <group ref={groupRef}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
        {/* Honey Drop Shape */}
        <mesh castShadow scale={[0.5, 0.7, 0.5]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#fab005"
            emissive="#fab005"
            emissiveIntensity={0.4}
            metalness={0.2}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Sparkle */}
        <mesh position={[0.3, 0.5, 0.3]} scale={[0.2, 0.2, 0.2]}>
          <sphereGeometry args={[0.5]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </Float>

      {/* Ground Shadow/Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <ringGeometry args={[0.3, 0.6, 16]} />
        <meshBasicMaterial color="#fab005" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};