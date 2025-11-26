import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SoftShadows, Environment, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Collectible } from './Collectibles';
import { useGameStore } from '../store';

const WorldEnvironment: React.FC = () => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#d3f9d8" />
      </mesh>

      {/* Giant Flowers */}
      <Flower position={[-10, 0, -10]} color="#ff8787" />
      <Flower position={[12, 0, -5]} color="#9775fa" />
      <Flower position={[-8, 0, 12]} color="#748ffc" />
      <Flower position={[15, 0, 10]} color="#ffa94d" />
      <Flower position={[-15, 0, -5]} color="#63e6be" />

      {/* Decorative grass clumps */}
      <GrassClump position={[5, 0, 5]} />
      <GrassClump position={[-5, 0, -2]} />
      <GrassClump position={[2, 0, -8]} />
    </group>
  );
};

const Flower = ({ position, color }: { position: [number, number, number], color: string }) => (
  <group position={position} scale={[1.5, 1.5, 1.5]}>
    <mesh position={[0, 2, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 4, 6]} />
      <meshStandardMaterial color="#51cf66" />
    </mesh>
    {/* Petals */}
    <group position={[0, 4, 0]} rotation={[0.2, 0, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[Math.PI / 3, 0, (i / 5) * Math.PI * 2]} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.8, 2, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Center */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.6]} />
        <meshStandardMaterial color="#ffe066" />
      </mesh>
    </group>
  </group>
);

const GrassClump = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {[0, 1, 2].map(i => (
      <mesh key={i} position={[(i - 1) * 0.2, 0.3, 0]} rotation={[0, i, 0]}>
        <coneGeometry args={[0.1, 0.6, 4]} />
        <meshStandardMaterial color="#69db7c" />
      </mesh>
    ))}
  </group>
);

export const GameScene: React.FC = () => {
  const enemies = useGameStore(state => state.enemies);
  const honeyDrops = useGameStore(state => state.honeyDrops);
  const restartGame = useGameStore(state => state.restartGame);

  useEffect(() => {
    restartGame();
  }, []);

  return (
    <Canvas shadows camera={{ position: [0, 15, 10], fov: 50 }}>
      <SoftShadows size={30} samples={12} focus={0.5} />
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 25, 10]}
        intensity={1.2}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30]} />
      </directionalLight>

      <Sky sunPosition={[100, 20, 100]} turbidity={0.4} rayleigh={0.2} mieCoefficient={0.005} mieDirectionalG={0.9} />
      <Environment preset="park" />

      <WorldEnvironment />
      <Player />

      {enemies.map(enemy => (
        <Enemy key={enemy.id} data={enemy} />
      ))}

      {honeyDrops.map(drop => (
        <Collectible key={drop.id} data={drop} />
      ))}

    </Canvas>
  );
};