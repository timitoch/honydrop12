import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { IEnemy } from '../types';
import { useGameStore } from '../store';

interface EnemyProps {
  data: IEnemy;
}

export const Enemy: React.FC<EnemyProps> = ({ data }) => {
  const groupRef = useRef<Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const changeDirTimer = useRef(0);
  const initialized = useRef(false);
  const updateEnemyPosition = useGameStore(state => state.updateEnemyPosition);

  // Initialize position only once
  useEffect(() => {
    if (groupRef.current && !initialized.current) {
      groupRef.current.position.set(...data.position);
      initialized.current = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    changeDirTimer.current += delta;
    if (changeDirTimer.current > 2) {
      angleRef.current += (Math.random() - 0.5) * 2;
      changeDirTimer.current = 0;
    }

    const speed = data.speed * delta;

    // Update Position
    const newX = groupRef.current.position.x + Math.sin(angleRef.current) * speed;
    const newZ = groupRef.current.position.z + Math.cos(angleRef.current) * speed;

    // Simple bounds
    if (newX > 20 || newX < -20 || newZ > 20 || newZ < -20) {
      angleRef.current += Math.PI; // Turn around
    } else {
      groupRef.current.position.x = newX;
      groupRef.current.position.z = newZ;
    }

    // Rotation to face movement
    groupRef.current.rotation.y = angleRef.current;

    // Walking animation wobble
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 15) * 0.1;

    // Sync position back to store for collision detection
    updateEnemyPosition(data.id, [
      groupRef.current.position.x,
      groupRef.current.position.y,
      groupRef.current.position.z
    ]);
  });

  return (
    <group ref={groupRef}>
      {/* Body - Red rounded */}
      <mesh castShadow position={[0, 0.3, 0]} scale={[1, 0.7, 1.2]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ff3333" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Head - Black */}
      <mesh castShadow position={[0, 0.3, 0.65]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>

      {/* Black spots - flat circles embedded in body */}
      {/* Left side */}
      <mesh position={[-0.25, 0.5, 0.2]} rotation={[-0.3, -0.3, 0]}>
        <circleGeometry args={[0.12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.3, 0.45, -0.2]} rotation={[-0.2, -0.4, 0]}>
        <circleGeometry args={[0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Right side */}
      <mesh position={[0.25, 0.5, 0.2]} rotation={[-0.3, 0.3, 0]}>
        <circleGeometry args={[0.12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.3, 0.45, -0.2]} rotation={[-0.2, 0.4, 0]}>
        <circleGeometry args={[0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Center back spot */}
      <mesh position={[0, 0.48, -0.35]} rotation={[-0.3, 0, 0]}>
        <circleGeometry args={[0.11]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};