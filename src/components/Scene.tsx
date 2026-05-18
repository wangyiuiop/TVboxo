import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, FXAA, Vignette } from '@react-three/postprocessing';
import { PipelineRenderer } from './PipelineRenderer';
import { FlowDiagram } from '../types';

interface SceneProps {
  diagram: FlowDiagram;
}

export const Scene: React.FC<SceneProps> = ({ diagram }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#DCEEFC] to-[#AED4F1]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={45} />
        <OrbitControls
          minDistance={5}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.2}
        />
        <Environment preset="city" />
        <color attach="background" args={['#DCEEFC']} />
        <fog attach="fog" args={['#DCEEFC', 20, 50]} />
        
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        >
          <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
        </directionalLight>
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4A90E2" />
        <pointLight position={[10, 5, 10]} intensity={0.5} color="#FFD700" />
        
        <PipelineRenderer diagram={diagram} />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.2} />
          <FXAA />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};