import React, { useState, useEffect } from 'react';
import { X, Sparkles, Star, Heart, Zap, Coffee, Pizza, Rocket } from 'lucide-react';
import { Button } from './ui/button.jsx';

const FunnyCharacter = ({ message, position, onClose }) => {
  const [currentCharacter, setCurrentCharacter] = useState('dev');
  const [showCartoonAnimation, setShowCartoonAnimation] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [comments, setComments] = useState([
    "When the code works on first try! 🎉",
    "Me debugging at 3 AM: 🤖",
    "Git commit message: 'fix stuff' 💻",
    "Stack Overflow is my best friend! 📚",
    "Coffee is not a solution, but it helps! ☕",
    "Why do I always forget the semicolon? 😅",
    "My code vs My documentation 📝",
    "Pizza is the best debugging tool! 🍕",
    "404: Sleep not found 😴",
    "Ctrl+C, Ctrl+V is my superpower! ⚡",
    "When you finally fix that bug! 🎯",
    "Me explaining my code to rubber duck 🦆",
    "Stack overflow: 'Have you tried turning it off and on?' 🔄",
    "My IDE: 'You have 47 errors' 😱",
    "Me: 'It works on my machine!' 💻",
    "When the client says 'Make it pop!' 🎨",
    "Debugging: The art of being confused systematically 🕵️",
    "Code review: 'This looks good to me' 👀",
    "Me after 8 hours of coding: 'What was I doing?' 🤔",
    "Git: 'You have uncommitted changes' 😤"
  ]);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  useEffect(() => {
    if (message) {
      setCurrentCharacter('dev');
      setShowCartoonAnimation(false);
      setAnimationPhase(0);
    }
  }, [message]);

  useEffect(() => {
    // Auto-refresh comments every 40 seconds (40000ms)
    const commentInterval = setInterval(() => {
      setCurrentCommentIndex(prev => (prev + 1) % comments.length);
    }, 40000); // 40 seconds

    return () => clearInterval(commentInterval);
  }, [comments.length]);

  const handleClose = () => {
    if (currentCharacter === 'dev') {
      // Start cartoon animation
      setShowCartoonAnimation(true);
      setAnimationPhase(1);
      
      // Cartoon animation sequence
      setTimeout(() => setAnimationPhase(2), 1000);
      setTimeout(() => setAnimationPhase(3), 2000);
      setTimeout(() => {
        setAnimationPhase(4);
        setCurrentCharacter('user');
        setShowCartoonAnimation(false);
      }, 3000);
    } else {
      onClose();
    }
  };

  const getCharacterStyle = () => {
    const baseStyle = {
      transform: 'perspective(1000px) rotateY(15deg) rotateX(10deg)',
      transition: 'all 0.5s ease',
      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
    };

    if (currentCharacter === 'dev') {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '3px solid #4f46e5',
        boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)',
      };
    } else {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        border: '3px solid #ec4899',
        boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
      };
    }
  };

  const getCartoonAnimation = () => {
    if (!showCartoonAnimation) return {};
    
    const animations = {
      1: { transform: 'scale(1.2) rotate(5deg)', animation: 'bounce 0.5s ease-in-out' },
      2: { transform: 'scale(0.8) rotate(-5deg)', animation: 'wiggle 0.5s ease-in-out' },
      3: { transform: 'scale(1.1) rotate(10deg)', animation: 'spin 0.5s ease-in-out' },
      4: { transform: 'scale(1) rotate(0deg)', animation: 'celebrate 1s ease-in-out' }
    };
    
    return animations[animationPhase] || {};
  };

  if (!message && !showCartoonAnimation) return null;

  const displayMessage = showCartoonAnimation 
    ? "🎭 Cartoon Mode Activated! 🎭"
    : comments[currentCommentIndex];

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: scale(1.2) rotate(5deg); }
            50% { transform: scale(1.4) rotate(10deg); }
          }
          
          @keyframes wiggle {
            0%, 100% { transform: scale(0.8) rotate(-5deg); }
            25% { transform: scale(0.9) rotate(-10deg); }
            50% { transform: scale(0.7) rotate(0deg); }
            75% { transform: scale(0.8) rotate(10deg); }
          }
          
          @keyframes spin {
            0% { transform: scale(1.1) rotate(10deg); }
            100% { transform: scale(1.1) rotate(370deg); }
          }
          
          @keyframes celebrate {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(5deg); }
            50% { transform: scale(1.2) rotate(-5deg); }
            75% { transform: scale(1.1) rotate(5deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotateY(15deg) rotateX(10deg); }
            50% { transform: translateY(-10px) rotateY(20deg) rotateX(15deg); }
          }
          
          .character-3d {
            animation: float 3s ease-in-out infinite;
          }
          
          .cartoon-effect {
            filter: brightness(1.2) contrast(1.1) saturate(1.3);
          }
          
          .emoji-rain {
            position: absolute;
            animation: fall 2s linear infinite;
          }
          
          @keyframes fall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
      
      <div 
        className={`fixed z-50 ${position} p-4 max-w-sm`}
        style={{ 
          left: position === 'top' ? '20px' : position === 'bottom' ? '20px' : '50%',
          top: position === 'top' ? '20px' : position === 'bottom' ? 'auto' : '50%',
          bottom: position === 'bottom' ? '20px' : 'auto',
          transform: position === 'center' ? 'translate(-50%, -50%)' : 'none'
        }}
      >
        <div 
          className={`character-3d rounded-2xl p-6 text-white font-bold text-lg relative overflow-hidden ${showCartoonAnimation ? 'cartoon-effect' : ''}`}
          style={{...getCharacterStyle(), ...getCartoonAnimation()}}
        >
          {/* Character Avatar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                {currentCharacter === 'dev' ? (
                  <Coffee className="w-6 h-6 text-white" />
                ) : (
                  <Star className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className="text-sm opacity-90">
                  {currentCharacter === 'dev' ? 'Dev' : 'User'}
                </div>
                <div className="text-xs opacity-70">
                  {currentCharacter === 'dev' ? 'Cartoon Mode' : 'Winner!'}
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
              style={getCartoonAnimation()}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message */}
          <div className="mb-4">
            <p className="text-white text-base leading-relaxed">
              {displayMessage}
            </p>
          </div>

          {/* Cartoon Animation Effects */}
          {showCartoonAnimation && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="emoji-rain" style={{ left: '10%', animationDelay: '0s' }}>
                🎭
              </div>
              <div className="emoji-rain" style={{ left: '30%', animationDelay: '0.5s' }}>
                ⭐
              </div>
              <div className="emoji-rain" style={{ left: '50%', animationDelay: '1s' }}>
                🎪
              </div>
              <div className="emoji-rain" style={{ left: '70%', animationDelay: '1.5s' }}>
                🎨
              </div>
              <div className="emoji-rain" style={{ left: '90%', animationDelay: '2s' }}>
                🎯
              </div>
              
              {/* Floating Icons */}
              <div className="absolute top-0 left-0 animate-ping">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="absolute top-0 right-0 animate-ping" style={{ animationDelay: '0.2s' }}>
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div className="absolute bottom-0 left-0 animate-ping" style={{ animationDelay: '0.4s' }}>
                <Pizza className="w-6 h-6 text-orange-400" />
              </div>
              <div className="absolute bottom-0 right-0 animate-ping" style={{ animationDelay: '0.6s' }}>
                <Rocket className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          )}

          {/* Character Status */}
          <div className="text-xs opacity-70 text-center">
            {currentCharacter === 'dev' ? (
              <span>🎭 Ready for cartoon fun!</span>
            ) : (
              <span>🏆 User wins the cartoon battle!</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FunnyCharacter; 