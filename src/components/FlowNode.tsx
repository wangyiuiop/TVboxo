import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  type: 'tank' | 'pump' | 'valve' | 'sensor' | 'reactor' | 'filter';
  position: [number, number, number];
  label: string;
  id: string;
  isActive?: boolean;
}

export const FlowNode: React.FC<NodeProps> = ({ type, position, label, isActive = false }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const renderNode = () => {
    switch (type) {
      case 'tank':
        return <Tank isActive={isActive} />;
      case 'pump':
        return <Pump isActive={isActive} />;
      case 'valve':
        return <Valve isActive={isActive} />;
      case 'sensor':
        return <Sensor isActive={isActive} />;
      case 'reactor':
        return <Reactor isActive={isActive} />;
      case 'filter':
        return <Filter isActive={isActive} />;
      default:
        return <Tank isActive={isActive} />;
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {renderNode()}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#2C3E50"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const Tank: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[1.2, 1.2, 2, 32]} />
        <meshStandardMaterial
          color={isActive ? '#4A90E2' : '#B8C5D6'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial
          color={isActive ? '#357ABD' : '#9AA8B7'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial
          color={isActive ? '#357ABD' : '#9AA8B7'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

const Pump: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const turbineRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (turbineRef.current) {
      turbineRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={isActive ? '#4A90E2' : '#B8C5D6'}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      <mesh ref={turbineRef}>
        <torusGeometry args={[0.4, 0.15, 8, 24]} />
        <meshStandardMaterial
          color={isActive ? '#FFD700' : '#C0C0C0'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

const Valve: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? '#4A90E2' : '#B8C5D6'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial
          color={isActive ? '#357ABD' : '#9AA8B7'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial
          color={isActive ? '#FFD700' : '#C0C0C0'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

const Sensor: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={isActive ? '#00FF88' : '#B8C5D6'}
            metalness={0.7}
            roughness={0.3}
            emissive={isActive ? '#00FF88' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </mesh>
      </Float>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.8, 16]} />
        <meshStandardMaterial
          color="#2C3E50"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};

const Reactor: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const rotationRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (rotationRef.current && isActive) {
      rotationRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 2.5, 32]} />
        <meshStandardMaterial
          color={isActive ? '#4A90E2' : '#B8C5D6'}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={isActive ? '#357ABD' : '#9AA8B7'}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      <group ref={rotationRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 1.2,
              0,
              Math.sin((i * Math.PI) / 2) * 1.2,
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <boxGeometry args={[0.15, 1.5, 0.4]} />
            <meshStandardMaterial
              color={isActive ? '#FFD700' : '#C0C0C0'}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Filter: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 2, 1.2]} />
        <meshStandardMaterial
          color={isActive ? '#4A90E2' : '#B8C5D6'}
          metalness={0.8}
          roughness={0.2}
          wireframe={isActive}
        />
      </mesh>
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={isActive ? '#AED4F1' : '#DCEEFC'}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};