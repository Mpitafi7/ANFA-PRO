import React, { useState, useEffect } from "react";
import { Smile, Send, Sparkles, Heart, Star, Zap, MessageCircle, X } from "lucide-react";
import "./CartoonCharacter.css";

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

const CartoonCharacter = ({ isActive = true, triggerMessage = null }) => {
  const [currentExpression, setCurrentExpression] = useState('happy');
  const [isTalking, setIsTalking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [characterPosition, setCharacterPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  // Character expressions
  const expressions = {
    happy: { icon: '😊', color: 'from-yellow-300 to-orange-400' },
    excited: { icon: '🤩', color: 'from-pink-300 to-purple-400' },
    thinking: { icon: '🤔', color: 'from-blue-300 to-indigo-400' },
    surprised: { icon: '😲', color: 'from-green-300 to-teal-400' },
    laughing: { icon: '😂', color: 'from-red-300 to-pink-400' }
  };

  // Random movement
  useEffect(() => {
    if (!isActive) return;

    const moveInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to move
        setIsMoving(true);
        const newX = Math.random() * 80 - 40;
        const newY = Math.random() * 80 - 40;
        setCharacterPosition({ x: newX, y: newY });
        
        setTimeout(() => setIsMoving(false), 1000);
      }
    }, 4000);

    return () => clearInterval(moveInterval);
  }, [isActive]);

  // Expression changes
  useEffect(() => {
    if (!isActive) return;

    const expressionInterval = setInterval(() => {
      const expressionKeys = Object.keys(expressions);
      const randomExpression = expressionKeys[Math.floor(Math.random() * expressionKeys.length)];
      setCurrentExpression(randomExpression);
    }, 5000);

    return () => clearInterval(expressionInterval);
  }, [isActive]);

  // Auto messages
  useEffect(() => {
    if (!isActive) return;

    const messageInterval = setInterval(() => {
      const randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)];
      setCurrentMessage(randomComment);
      setShowSpeechBubble(true);
      setIsTalking(true);
      setCurrentExpression('excited');
      setIsGlowing(true);
      
      setTimeout(() => {
        setShowSpeechBubble(false);
        setIsTalking(false);
        setCurrentExpression('happy');
        setIsGlowing(false);
      }, 3000);
    }, 10000);

    return () => clearInterval(messageInterval);
  }, [isActive]);

  // Trigger specific message
  useEffect(() => {
    if (triggerMessage) {
      setCurrentMessage(triggerMessage);
      setShowSpeechBubble(true);
      setIsTalking(true);
      setCurrentExpression('excited');
      setIsGlowing(true);
      
      setTimeout(() => {
        setShowSpeechBubble(false);
        setIsTalking(false);
        setCurrentExpression('happy');
        setIsGlowing(false);
      }, 4000);
    }
  }, [triggerMessage]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div 
          className="speech-bubble absolute bottom-24 right-0 bg-white rounded-2xl px-4 py-3 shadow-2xl border-2 border-gray-200 max-w-xs"
          style={{
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-blue-500" size={16} />
            <span className="text-gray-800 font-medium text-sm">{currentMessage}</span>
          </div>
        </div>
      )}

      {/* Main Cartoon Character */}
      <div 
        className={`cartoon-character character-move relative ${isMoving ? 'animate-bounce' : ''}`}
        style={{
          transform: `translate(${characterPosition.x}px, ${characterPosition.y}px)`
        }}
      >
        {/* Character Body */}
        <div className={`w-24 h-24 bg-gradient-to-br ${expressions[currentExpression].color} rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden expression-transition ${isGlowing ? 'character-glow' : ''}`}>
          {/* Face */}
          <div className="text-5xl animate-pulse">
            {expressions[currentExpression].icon}
          </div>
          
          {/* Eyes blink animation */}
          <div className="character-eyes absolute top-3 left-3 w-3 h-3 bg-black rounded-full"></div>
          <div className="character-eyes absolute top-3 right-3 w-3 h-3 bg-black rounded-full" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Talking animation */}
          {isTalking && (
            <div className="character-mouth absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black rounded-full"></div>
          )}
        </div>

        {/* Character Name */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
          <span className="text-sm font-bold text-gray-700">ANFA Bot</span>
        </div>

        {/* Floating effects */}
        <div className="sparkle-effect absolute -top-3 -right-3">
          <Sparkles className="text-yellow-400" size={18} />
        </div>
        <div className="sparkle-effect absolute -bottom-3 -left-3" style={{ animationDelay: '1s' }}>
          <Heart className="text-pink-400" size={16} />
        </div>
        <div className="sparkle-effect absolute top-1/2 -right-4" style={{ animationDelay: '2s' }}>
          <Star className="text-blue-400" size={14} />
        </div>
        <div className="sparkle-effect absolute top-1/2 -left-4" style={{ animationDelay: '1.5s' }}>
          <Zap className="text-green-400" size={15} />
        </div>
      </div>

      {/* Interactive button */}
      <button 
        onClick={() => {
          const randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)];
          setCurrentMessage(randomComment);
          setShowSpeechBubble(true);
          setIsTalking(true);
          setCurrentExpression('excited');
          setIsGlowing(true);
          
          setTimeout(() => {
            setShowSpeechBubble(false);
            setIsTalking(false);
            setCurrentExpression('happy');
            setIsGlowing(false);
          }, 3000);
        }}
        className="cartoon-button absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-600 transition-colors shadow-lg"
      >
        <Send size={14} />
      </button>
    </div>
  );
};

export default CartoonCharacter; 