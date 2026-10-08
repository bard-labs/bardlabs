"use client"

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { createClient } from '@/utils/supabase/client';
import { X } from 'lucide-react';


type BrainNode = {
    id: string;
    label: string;
    description: string;
    category_id: string;
    parent_id: string | null;
    position: THREE.Vector3;
};

type SupabaseBrainNode = {
    id: string;
    label: string;
    description: string;
    category_id: string;
    parent_id: string | null;
    position: { x: number; y: number; z: number };
};

type Category = {
    id: string;
    name: string;
    color: string;
};

type SceneObject = {
    id: string;
    type: 'star' | 'planet';
    position: THREE.Vector3;
    color: string;
    label: string;
    description: string;
};

type ConnectionObject = {
    start: THREE.Vector3;
    end: THREE.Vector3;
    color: string;
};

// --- CONFIGURATION ---
// Tweak these values to adjust the galaxy visualization
const CONFIG = {
    // The Brain (Sun)
    sun: {
        size: 2,           // Size of the central sun
        color: '#2d2e2d',    // Color of the sun
        intensity: 2,        // Glow intensity
        rotationSpeed: 0.1   // Speed of rotation
    },
    // Categories (Stars)
    stars: {
        size: 1,           // Size of category nodes
        orbitRadius: 8,      // Distance from the center
        floatSpeed: 2,       // Speed of floating animation
        floatIntensity: 0.5, // Intensity of floating
        rotationSpeed: 0.5   // Speed of rotation
    },
    // Nodes (Planets)
    planets: {
        size: 0.4,           // Size of project/log nodes
        orbitDistance: 3,    // Base distance from their category star
        orbitVariance: 1.5,  // Random variance in distance
        hoverScale: 1.2      // Scale multiplier on hover
    },
    // Connections
    connections: {
        opacity: 0.35,       // Opacity of lines
        width: 2             // Width of lines
    },
    // Background
    galaxy: {
        count: 3000,         // Number of background stars
        radius: 100,         // Radius of the star field
        depth: 50            // Depth of the star field
    },
    // Milky Way Particle System
    milkyWay: {
        count: 10000,
        radius: 35,
        branches: 3,
        spin: 0.8,
        randomness: 0.2,
        randomnessPower: 3,
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
        size: 0.15
    }
};

// --- Components ---

const Sun = ({ onClick }: { onClick: () => void }) => {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.y += delta * CONFIG.sun.rotationSpeed;
        }
    });

    return (
        <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <mesh ref={mesh}>
                <sphereGeometry args={[CONFIG.sun.size, 64, 64]} />
                <meshStandardMaterial
                    emissive={CONFIG.sun.color}
                    emissiveIntensity={CONFIG.sun.intensity}
                    color={CONFIG.sun.color}
                    toneMapped={false}
                />
            </mesh>
            <pointLight intensity={2} distance={20} decay={2} color="white" />
            <Text position={[0, 3.5, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
                The Brain
            </Text>
        </group>
    );
};

interface CategoryStarProps extends SceneObject {
    onClick: () => void;
    isFocused: boolean;
}

const CategoryStar = ({ position, color, label, onClick, isFocused }: CategoryStarProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (mesh.current && !isFocused) {
            mesh.current.rotation.y += delta * CONFIG.stars.rotationSpeed;
        }
    });

    return (
        <group position={position}>
            <Float speed={CONFIG.stars.floatSpeed} rotationIntensity={0.5} floatIntensity={CONFIG.stars.floatIntensity}>
                <mesh
                    ref={mesh}
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <sphereGeometry args={[CONFIG.stars.size, 32, 32]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 1}
                        roughness={0.4}
                        metalness={0.6}
                    />
                </mesh>
            </Float>
            <Text
                position={[0, 1.8, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="black"
            >
                {label}
            </Text>
        </group>
    );
};

interface NodePlanetProps extends SceneObject {
    onClick: () => void;
}

const NodePlanet = ({ position, color, label, onClick }: NodePlanetProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    return (
        <group position={position}>
            <mesh
                ref={mesh}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[CONFIG.planets.size, 16, 16]} />
                <meshStandardMaterial
                    color={hovered ? 'white' : color}
                    emissive={color}
                    emissiveIntensity={hovered ? 1 : 0.2}
                />
            </mesh>
            {hovered && (
                <Text
                    position={[0, 0.8, 0]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="black"
                >
                    {label}
                </Text>
            )}
        </group>
    );
};



const Connection = ({ start, end, color }: ConnectionObject) => {
    const points = useMemo(() => [start, end], [start, end]);

    return (
        <Line
            points={points}
            color={color}
            opacity={CONFIG.connections.opacity}
            transparent
            lineWidth={CONFIG.connections.width}
        />
    );
};

const MilkyWay = () => {
    const points = useRef<THREE.Points>(null);

    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(CONFIG.milkyWay.count * 3);
        const colors = new Float32Array(CONFIG.milkyWay.count * 3);
        const insideColor = new THREE.Color(CONFIG.milkyWay.insideColor);
        const outsideColor = new THREE.Color(CONFIG.milkyWay.outsideColor);

        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        for (let i = 0; i < CONFIG.milkyWay.count; i++) {
            const i3 = i * 3;
            const r1 = seededRandom(i);
            const r2 = seededRandom(i + 10000);
            const r3 = seededRandom(i + 20000);
            const r4 = seededRandom(i + 30000);
            const r5 = seededRandom(i + 40000);

            const radius = r1 * CONFIG.milkyWay.radius;
            const spinAngle = radius * CONFIG.milkyWay.spin;
            const branchAngle = (i % CONFIG.milkyWay.branches) / CONFIG.milkyWay.branches * Math.PI * 2;

            const randomX = Math.pow(r2, CONFIG.milkyWay.randomnessPower) * (r3 < 0.5 ? 1 : -1) * CONFIG.milkyWay.randomness * radius;
            const randomY = Math.pow(r2, CONFIG.milkyWay.randomnessPower) * (r4 < 0.5 ? 1 : -1) * CONFIG.milkyWay.randomness * radius;
            const randomZ = Math.pow(r2, CONFIG.milkyWay.randomnessPower) * (r5 < 0.5 ? 1 : -1) * CONFIG.milkyWay.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const mixedColor = insideColor.clone();
            mixedColor.lerp(outsideColor, radius / CONFIG.milkyWay.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        return { positions, colors };
    }, []);

    useFrame((state, delta) => {
        if (points.current) {
            points.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={CONFIG.milkyWay.size}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
                transparent
                opacity={0.6}
            />
        </points>
    );
};

const GalaxyScene = ({ onNodeSelect }: { onNodeSelect: (node: SceneObject | null) => void }) => {
    const supabase = useMemo(() => createClient(), []);
    const [nodes, setNodes] = useState<BrainNode[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [focusedItem, setFocusedItem] = useState<SceneObject | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: cats } = await supabase.from('categories').select('*').eq('type', 'brain');
            const { data: nds } = await supabase.from('brain_nodes').select('*');

            if (cats) setCategories(cats as Category[]);
            if (nds) {
                const parsedNodes = (nds as unknown as SupabaseBrainNode[]).map(n => ({
                    ...n,
                    position: new THREE.Vector3(n.position.x, n.position.y, n.position.z)
                }));
                setNodes(parsedNodes);
            }
        };
        fetchData();
    }, [supabase]);

    const handleFocus = (item: SceneObject) => {
        setFocusedItem(item);
        onNodeSelect(item);
    };

    const sceneObjects = useMemo(() => {
        const objects: SceneObject[] = [];
        const connections: ConnectionObject[] = [];

        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        categories.forEach((cat, i) => {
            const angle = (i / categories.length) * Math.PI * 2;
            const radius = CONFIG.stars.orbitRadius;
            const y = Math.sin(angle * 2) * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const pos = new THREE.Vector3(x, y, z);

            const catObj: SceneObject = {
                id: cat.id,
                type: 'star',
                position: pos,
                color: cat.color,
                label: cat.name,
                description: `Category: ${cat.name}`
            };
            objects.push(catObj);

            connections.push({
                start: new THREE.Vector3(0, 0, 0),
                end: pos,
                color: 'white'
            });

            const catNodes = nodes.filter(n => n.category_id === cat.id);
            const tempNodePositions: { id: string, pos: THREE.Vector3 }[] = [];

            catNodes.forEach((node, j) => {
                const spread = (j - (catNodes.length - 1) / 2) * 0.5;
                const centerToStar = pos.clone().normalize();
                const dist = CONFIG.planets.orbitDistance + (j * 1.5);
                const bendAngle = j * 0.2;
                const nodeDir = centerToStar.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), bendAngle + spread);
                const nodePos = pos.clone().add(nodeDir.multiplyScalar(dist));

                const randomVal = seededRandom(i * 100 + j);
                nodePos.y += (randomVal - 0.5) * 2;

                const minDistance = 4;
                const iterations = 3;

                for (let iter = 0; iter < iterations; iter++) {
                    const force = new THREE.Vector3(0, 0, 0);
                    let count = 0;

                    const distToStar = nodePos.distanceTo(pos);
                    if (distToStar < minDistance) {
                        const pushDir = nodePos.clone().sub(pos).normalize();
                        force.add(pushDir.multiplyScalar((minDistance - distToStar) * 0.5));
                        count++;
                    }

                    tempNodePositions.forEach(other => {
                        const d = nodePos.distanceTo(other.pos);
                        if (d < minDistance) {
                            const pushDir = nodePos.clone().sub(other.pos).normalize();
                            force.add(pushDir.multiplyScalar((minDistance - d) * 0.5));
                            count++;
                        }
                    });

                    if (count > 0) {
                        nodePos.add(force);
                    }
                }

                tempNodePositions.push({ id: node.id, pos: nodePos });

                const nodeObj: SceneObject = {
                    id: node.id,
                    type: 'planet',
                    position: nodePos,
                    color: cat.color,
                    label: node.label,
                    description: node.description
                };
                objects.push(nodeObj);

                connections.push({
                    start: pos,
                    end: nodePos,
                    color: cat.color
                });
            });
        });

        return { objects, connections };
    }, [categories, nodes]);

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffaa00" />
            <Sun onClick={() => handleFocus({ id: 'sun', type: 'star', position: new THREE.Vector3(0, 0, 0), color: '#ffffff', label: 'The Brain', description: 'The core of all knowledge.' })} />

            {sceneObjects.objects.map((obj, i) => (
                obj.type === 'star' ? (
                    <CategoryStar
                        key={i}
                        {...obj}
                        onClick={() => handleFocus(obj)}
                        isFocused={focusedItem?.id === obj.id}
                    />
                ) : (
                    <NodePlanet
                        key={i}
                        {...obj}
                        onClick={() => handleFocus(obj)}
                    />
                )
            ))}

            {sceneObjects.connections.map((conn, i) => (
                <Connection key={`conn-${i}`} start={conn.start} end={conn.end} color={conn.color} />
            ))}

            <MilkyWay />
            <Stars radius={CONFIG.galaxy.radius} depth={CONFIG.galaxy.depth} count={CONFIG.galaxy.count} factor={4} saturation={0} fade speed={0.5} />

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={5}
                maxDistance={40}
                autoRotate={false}
            />
        </>
    );
};

export const GalaxyBrain = () => {
    const [selectedNode, setSelectedNode] = useState<SceneObject | null>(null);

    return (
        <div className="w-full h-screen bg-black relative">
            <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
                <GalaxyScene onNodeSelect={setSelectedNode} />
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                <h1 className="text-4xl font-bold text-white mb-2">The Brain</h1>
                <p className="text-neutral-400 text-sm max-w-xs">
                    Interactive Knowledge Graph. <br />
                    Click on a Star or Planet to focus.
                </p>
            </div>

            {/* Side Modal */}
            {selectedNode && (
                <div className="absolute right-0 top-0 h-full w-80 bg-neutral-900/90 border-l border-white/10 backdrop-blur-md p-8 z-20 flex flex-col animate-in slide-in-from-right duration-300">
                    <button
                        onClick={() => setSelectedNode(null)} // This just closes modal, scene handles unfocus via click elsewhere ideally, but for now this is fine
                        className="self-end p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="mt-8">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color || 'white' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{selectedNode.label}</h2>
                        <p className="text-neutral-400 leading-relaxed">
                            {selectedNode.description || "No description available."}
                        </p>
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5">
                        <p className="text-xs text-neutral-600 uppercase tracking-widest">
                            {selectedNode.type === 'star' ? 'Category' : 'Node'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
