import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function SimpleCharacter({ message, isTalking }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isTalking) {
        meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh
        ref={meshRef}
        position={[0, 1.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={hovered ? "#ff6b6b" : "#ffd93d"} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 1.6, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.2, 1.6, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 1.3, 0.4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1, 32]} />
        <meshStandardMaterial color="#4ecdc4" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#4ecdc4" />
      </mesh>
      <mesh position={[0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#4ecdc4" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#45b7d1" />
      </mesh>
      <mesh position={[0.3, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#45b7d1" />
      </mesh>

      {/* Speech Bubble */}
      {message && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs animate-bounce border-2 border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">💬</span>
              <span>{message}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Simple3DCharacter() {
  const [message, setMessage] = useState("Hello! I'm your ANFA assistant 🤖");
  const [isTalking, setIsTalking] = useState(false);

  const funnyMessages = [
    "This link is shorter than my attention span! 🤓",
    "Boom! Link got a glow-up ✨",
    "Copied like a digital ninja 🥷",
    "Why scroll when you can stroll? 🧳",
    "Link so short, it ghosted your scroll bar 🧙‍♂️",
    "Bench-pressed 300 bytes 💪",
    "Cut, copied, and cupcake cute 🧁",
    "Just dropped a digital mic 🎤",
    "Your URL just went on a diet 🥗",
    "Link shorter than a tweet 🐦"
  ];

  const handleSendMessage = (newMsg) => {
    setIsTalking(true);
    setTimeout(() => {
      setMessage(newMsg);
      setIsTalking(false);
    }, 1500);
  };

  const handleRandomMessage = () => {
    const randomMsg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    handleSendMessage(randomMsg);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-80 z-50">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 5, 2]} intensity={1.5} />
        <pointLight position={[-2, 2, 2]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <SimpleCharacter message={message} isTalking={isTalking} />
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-2 left-2 space-x-2">
        <button
          onClick={handleRandomMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 text-xs"
        >
          Random Message
        </button>
        <button
          onClick={() => handleSendMessage("Hello! I'm your ANFA assistant 🤖")}
          className="bg-green-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-green-600 text-xs"
        >
          Reset
        </button>
      </div>

      {isTalking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-2 right-2 text-xs bg-white px-3 py-1 rounded-lg shadow"
        >
          Typing...
        </motion.div>
      )}
    </div>
  );
} 