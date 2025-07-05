import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function Character({ url, onSendMessage, message, gender }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);

  useFrame(() => {
    group.current.rotation.y += 0.002;
  });

  return (
    <group ref={group} scale={gender === 'female' ? 1.1 : 1}>
      <primitive object={scene} />
      {message && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs animate-bounce">
            {message}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function CartoonAssistant() {
  const [gender, setGender] = useState('male');
  const [message, setMessage] = useState("Hello! I'm your ANFA assistant 🤖");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (newMsg) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessage(newMsg);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 5, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <Character
            url={gender === 'male' ? '/models/male.glb' : '/models/female.glb'}
            onSendMessage={handleSendMessage}
            message={message}
            gender={gender}
          />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>

      <div className="absolute bottom-4 left-4 space-x-4">
        <button
          onClick={() => handleSendMessage("Here's a new message! 😄")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Send Message
        </button>
        <button
          onClick={() => setGender(gender === 'male' ? 'female' : 'male')}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
        >
          Switch to {gender === 'male' ? 'Female' : 'Male'}
        </button>
      </div>

      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4 text-sm bg-white px-4 py-2 rounded-lg shadow"
        >
          Typing...
        </motion.div>
      )}
    </div>
  );
}

useGLTF.preload('/models/male.glb');
useGLTF.preload('/models/female.glb'); 