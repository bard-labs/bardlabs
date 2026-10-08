"use client"

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Node Data
interface NodeData {
    id: string;
    label: string;
    position: [number, number, number];
    connections: string[];
    color: string;
}

const nodesData: NodeData[] = [
    { id: 'backend', label: 'Backend', position: [0, 0, 0], connections: ['iot', 'systems', 'ai'], color: '#ef4444' },
    { id: 'iot', label: 'IoT', position: [2, 1, 1], connections: ['electronics', 'backend'], color: '#f97316' },
    { id: 'electronics', label: 'Electronics', position: [3, -1, 2], connections: ['iot', 'physics'], color: '#eab308' },
    { id: 'physics', label: 'Physics', position: [1, -2, -1], connections: ['math', 'electronics', 'aerospace'], color: '#84cc16' },
    { id: 'math', label: 'Math', position: [-1, -1, -2], connections: ['physics', 'ai', 'systems'], color: '#10b981' },
    { id: 'aerospace', label: 'Aerospace', position: [2, -2, -2], connections: ['physics', 'systems'], color: '#06b6d4' },
    { id: 'ai', label: 'AI', position: [-2, 1, -1], connections: ['math', 'backend', 'systems'], color: '#3b82f6' },
    { id: 'systems', label: 'Systems', position: [-1, 2, 1], connections: ['backend', 'ai', 'business'], color: '#8b5cf6' },
    { id: 'business', label: 'Business', position: [-3, 0, 2], connections: ['systems'], color: '#d946ef' },
    { id: 'cybernetics', label: 'Cybernetics', position: [0, 3, 0], connections: ['systems', 'ai', 'iot'], color: '#f43f5e' },
];

// Custom Camera Controls (Orbit)
// Custom Camera Controls (Orbit)
interface OrbitControlsImpl {
    enableDamping: boolean;
    dampingFactor: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    update: () => void;
    dispose: () => void;
}

const CameraController = () => {
    const { camera, gl } = useThree();
    const controls = useRef<OrbitControlsImpl | null>(null);

    useEffect(() => {
        import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
            const ctrl = new OrbitControls(camera, gl.domElement) as unknown as OrbitControlsImpl;
            ctrl.enableDamping = true;
            ctrl.dampingFactor = 0.05;
            ctrl.autoRotate = true;
            ctrl.autoRotateSpeed = 0.5;
            controls.current = ctrl;
        });
        return () => controls.current?.dispose();
    }, [camera, gl]);

    useFrame(() => controls.current?.update());
    return null;
};

// Individual Node Component
const Node = ({ node, onHover }: { node: NodeData; onHover: (hovered: boolean) => void }) => {
    const ref = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.x += 0.01;
            ref.current.rotation.y += 0.01;
        }
    });

    return (
        <group position={node.position}>
            <mesh
                ref={ref}
                onPointerOver={() => { setHover(true); onHover(true); }}
                onPointerOut={() => { setHover(false); onHover(false); }}
            >
                <icosahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial
                    color={hovered ? '#ffffff' : node.color}
                    emissive={node.color}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    wireframe
                />
            </mesh>
            {/* Simple Text Label using HTML or Sprite could be better, but let's stick to 3D objects for now to avoid drei Text issues */}
        </group>
    );
};

// Connections Component
const Connections = ({ nodes }: { nodes: NodeData[] }) => {
    const linesGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const points: number[] = [];

        nodes.forEach(node => {
            node.connections.forEach(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (target) {
                    points.push(...node.position);
                    points.push(...target.position);
                }
            });
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        return geometry;
    }, [nodes]);

    return (
        <lineSegments geometry={linesGeometry}>
            <lineBasicMaterial color="white" opacity={0.1} transparent />
        </lineSegments>
    );
};

// Main Scene
export const MindMap = () => {

    return (
        <div className="w-full h-full absolute inset-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 5, 15]} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <group>
                    {nodesData.map(node => (
                        <Node key={node.id} node={node} onHover={() => { }} />
                    ))}
                    <Connections nodes={nodesData} />
                </group>

                <CameraController />
            </Canvas>
        </div>
    );
};
