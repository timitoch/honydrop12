import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group, MathUtils } from 'three';
import { useGameStore } from '../store';
import { GameStatus } from '../types';
import { playDamageSound } from '../sounds';

const mapArrowToWasd = (key: string) => {
  if (key === 'arrowup') return 'w';
  if (key === 'arrowdown') return 's';
  if (key === 'arrowleft') return 'a';
  if (key === 'arrowright') return 'd';
  return key;
};

export const Player: React.FC = () => {
  const groupRef = useRef<Group>(null);
  const wingsRef = useRef<Group>(null);
  const { camera } = useThree();

  const setPlayerPos = useGameStore((state) => state.setPlayerPos);
  const takeDamage = useGameStore((state) => state.takeDamage);
  const setIsDamaged = useGameStore((state) => state.setIsDamaged);
  const enemies = useGameStore((state) => state.enemies);
  const status = useGameStore((state) => state.status);

  // Invulnerability state
  const lastHitTime = useRef(0);
  const isInvulnerable = useRef(false);
  const [flash, setFlash] = useState(false);

  // Movement state
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        setKeys(prev => ({ ...prev, [mapArrowToWasd(key)]: true }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        setKeys(prev => ({ ...prev, [mapArrowToWasd(key)]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || status !== GameStatus.PLAYING) return;

    // 1. Movement
    const speed = 8 * delta;
    const direction = new Vector3();

    // Camera relative movement
    const camForward = new Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    const camRight = new Vector3();
    camRight.crossVectors(camForward, camera.up);

    if (keys.w) direction.add(camForward);
    if (keys.s) direction.sub(camForward);
    if (keys.a) direction.sub(camRight);
    if (keys.d) direction.add(camRight);

    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(speed);
      groupRef.current.position.add(direction);

      // Smooth rotation with proper angle wrapping
      const targetRotation = Math.atan2(direction.x, direction.z);
      const currentRotation = groupRef.current.rotation.y;

      // Calculate shortest angular distance
      let angleDiff = targetRotation - currentRotation;

      // Normalize to [-π, π] range to ensure shortest path
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      // Interpolate using the shortest path
      groupRef.current.rotation.y = currentRotation + angleDiff * 0.2;
    }

    // Bobbing flight motion
    groupRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;

    // Boundary check
    groupRef.current.position.x = Math.max(-20, Math.min(20, groupRef.current.position.x));
    groupRef.current.position.z = Math.max(-20, Math.min(20, groupRef.current.position.z));

    // 2. Update Global State
    setPlayerPos([groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z]);

    // 3. Camera Follow
    const targetCamPos = groupRef.current.position.clone().add(new Vector3(0, 15, 12));
    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(groupRef.current.position);

    // 4. Wing Animation
    if (wingsRef.current) {
      wingsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 30) * 0.5;
    }

    // 5. Collision with Enemies - Performance optimized
    if (isInvulnerable.current) {
      if (state.clock.elapsedTime - lastHitTime.current > 2.0) {
        isInvulnerable.current = false;
        setFlash(false);
        setIsDamaged(false);
      } else {
        // Flashing effect logic
        setFlash(Math.sin(state.clock.elapsedTime * 20) > 0);
      }
    } else {
      const playerVec = groupRef.current.position;
      for (const enemy of enemies) {
        // Calculate distance squared for better performance (avoid sqrt)
        const dx = playerVec.x - enemy.position[0];
        const dy = playerVec.y - enemy.position[1];
        const dz = playerVec.z - enemy.position[2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 1.44) { // 1.2 * 1.2 = 1.44
          takeDamage();
          playDamageSound();
          lastHitTime.current = state.clock.elapsedTime;
          isInvulnerable.current = true;
          setFlash(true);
          setIsDamaged(true);
          break; // only take damage once per frame
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Bee Body */}
      <group>
        {/* Main Body (Yellow or Red when hit) */}
        <mesh castShadow scale={[0.4, 0.4, 0.5]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={flash ? "#ff0000" : "#fcc419"} />
        </mesh>

        {/* Stripes (Black) */}
        <mesh position={[0, 0, 0.1]} scale={[0.41, 0.41, 0.1]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#212529" />
        </mesh>
        <mesh position={[0, 0, -0.2]} scale={[0.38, 0.38, 0.1]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#212529" />
        </mesh>

        {/* Stinger */}
        <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshStandardMaterial color="#212529" />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="black" roughness={0.2} />
        </mesh>
        <mesh position={[-0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="black" roughness={0.2} />
        </mesh>

        {/* Wings */}
        <group ref={wingsRef} position={[0, 0.3, 0]}>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.3, 0.1, 0.02, 8]} />
            <meshStandardMaterial color="#a5d8ff" transparent opacity={0.7} />
          </mesh>
          <mesh position={[-0.4, 0, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.3, 0.1, 0.02, 8]} />
            <meshStandardMaterial color="#a5d8ff" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
};