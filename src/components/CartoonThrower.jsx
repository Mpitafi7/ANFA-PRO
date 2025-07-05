import React, { useEffect, useState } from "react";
import { Smile, Send, Sparkles, Heart, Star, Zap } from "lucide-react";

const funnyComments = [
  "This link is shorter than my attention span! 🤓",
  "Boom! Link got a glow-up ✨",
  "Copied like a digital ninja 🥷",
  "Why scroll when you can stroll? 🧳",
  "Link so short, it ghosted your scroll bar 🧙‍♂️",
  "Bench-pressed 300 bytes 💪",
  "Cut, copied, and cupcake cute 🧁",
  "Just dropped a digital mic 🎤",
  "Your URL just went on a diet 🥗",
  "Link shorter than a tweet 🐦",
  "Copied faster than my coffee gets cold ☕",
  "This link is so short, it's practically invisible 👻",
  "Your URL just joined the minimalist club 🎨",
  "Link so compact, it fits in your pocket 👖",
  "Copied with the speed of light ⚡",
  "This URL is shorter than my patience 😅",
  "Link got a makeover and it's fabulous 💅",
  "Your URL just won the compression Olympics 🏆",
  "Copied like a boss! 👑",
  "This link is so short, it's practically a haiku 📝"
];

const CommentBubble = ({ text, id }) => {
  const x = Math.floor(Math.random() * 200) - 100;
  const y = Math.floor(Math.random() * 150) - 75;
  
  return (
    <div
      key={id}
      className="absolute bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        maxWidth: '200px',
        wordWrap: 'break-word'
      }}
    >
      <div className="flex items-center">
        <Send className="inline-block mr-2" size={14} />
        <span>{text}</span>
      </div>
    </div>
  );
};

const CartoonThrower = ({ isActive = true, triggerMessage = null }) => {
  const [bubbles, setBubbles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)];
      const newBubble = { 
        id: Date.now() + Math.random(), 
        text: randomComment 
      };
      
      setBubbles((prev) => {
        const updated = [...prev, newBubble];
        return updated.slice(-3); // Keep only last 3 bubbles
      });
    }, 6000); // Show new bubble every 6 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  // Trigger specific message when provided
  useEffect(() => {
    if (triggerMessage) {
      const newBubble = { 
        id: Date.now() + Math.random(), 
        text: triggerMessage 
      };
      setBubbles((prev) => [...prev, newBubble]);
    }
  }, [triggerMessage]);

  // Remove bubbles after 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBubbles((prev) => prev.slice(1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative w-64 h-72 bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 overflow-hidden rounded-2xl shadow-2xl border-2 border-white/20">
        {/* Sparkles */}
        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles className="text-yellow-400" size={16} />
        </div>
        <div className="absolute top-6 left-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Star className="text-pink-400" size={14} />
        </div>
        <div className="absolute bottom-16 right-6 animate-pulse" style={{ animationDelay: '1s' }}>
          <Heart className="text-red-400" size={16} />
        </div>
        <div className="absolute bottom-24 left-6 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Zap className="text-blue-400" size={14} />
        </div>

        {/* ANFA Bot */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 animate-bounce">
            <Smile size={24} className="text-orange-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-700">ANFA Bot 🤖</span>
            <span className="text-xs text-gray-500">AI Assistant</span>
          </div>
        </div>

        {/* Comment Bubbles */}
        {bubbles.map((bubble) => (
          <CommentBubble 
            key={bubble.id} 
            id={bubble.id} 
            text={bubble.text}
          />
        ))}

        {/* Status indicator */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartoonThrower; 