import React, { useMemo } from 'react';
import { FlowNode } from './FlowNode';
import { FlowDiagram } from '../types';
import * as THREE from 'three';

interface PipelineRendererProps {
  diagram: FlowDiagram;
}

export const PipelineRenderer: React.FC<PipelineRendererProps> = ({ diagram }) => {
  const pipes = useMemo(() => {
    const nodeMap = new Map(
      diagram.nodes.map((node) => [node.id, node.position])
    );

    const pipeData = diagram.connections.map((connection) => {
      const from = nodeMap.get(connection.from);
      const to = nodeMap.get(connection.to);

      if (!from || !to) return null;

      const start = new THREE.Vector3(...from);
      const end = new THREE.Vector3(...to);

      const direction = end.clone().sub(start).normalize();

      const pipeStart = start.clone().add(direction.clone().multiplyScalar(1.5));
      const pipeEnd = end.clone().sub(direction.clone().multiplyScalar(1.5));
      const pipeLength = pipeStart.distanceTo(pipeEnd);

      const midPoint = pipeStart.clone().add(pipeEnd).multiplyScalar(0.5);
      const pipeCenter = new THREE.Vector3(...midPoint.toArray());

      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(
        new THREE.Vector3(1, 0, 0),
        direction
      );

      return {
        id: connection.id,
        length: pipeLength,
        position: pipeCenter,
        quaternion,
      };
    }).filter((pipe): pipe is NonNullable<typeof pipe> => pipe !== null);

    return pipeData;
  }, [diagram]);

  return (
    <group>
      {pipes.map((pipe) => (
        <group key={pipe.id} position={pipe.position}>
          <mesh quaternion={pipe.quaternion}>
            <cylinderGeometry args={[0.15, 0.15, pipe.length, 16]} />
            <meshStandardMaterial
              color="#B8C5D6"
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
          {pipe.length > 2 &&
            Array.from({ length: Math.floor(pipe.length / 2) - 1 }).map((_, i) => (
              <mesh
                key={i}
                position={[
                  -pipe.length / 2 + (i + 1) * 2,
                  0,
                  0,
                ]}
                quaternion={pipe.quaternion}
              >
                <torusGeometry args={[0.18, 0.04, 8, 16]} />
                <meshStandardMaterial
                  color="#9AA8B7"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            ))}
        </group>
      ))}

      {diagram.nodes.map((node) => (
        <FlowNode
          key={node.id}
          id={node.id}
          type={node.type}
          position={node.position}
          label={node.label}
          isActive={true}
        />
      ))}

      <gridHelper args={[40, 40, '#9AA8B7', '#DCEEFC']} position={[0, -2, 0]} />
    </group>
  );
};