import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, HelpCircle } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';

const HelpChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your ANFA Pro AI assistant. I can help you with URL shortening, explain features, and answer any questions about our service. How can I help you today? 🤖",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // First try to get API key from environment or use a fallback
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
      
      console.log('Sending message to AI...');
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ANFA Pro Help Assistant'
        },
        body: JSON.stringify({
          model: 'deepseek-chat/deepseek-chat-33b-instruct',
          messages: [
            {
              role: 'system',
              content: `You are ANFA Pro's AI assistant. ANFA Pro is an AI-powered URL shortener with features like:
              - URL shortening and customization
              - Click tracking and analytics
              - QR code generation
              - AI-powered insights and feedback
              - User account management
              - Link performance monitoring
              
              Help users understand these features, guide them through the process, and provide helpful information about URL shortening. Be friendly, informative, and conversational. Keep responses concise but helpful.`
            },
            ...messages.slice(-10).map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('AI Response:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from AI');
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Sorry, I'm having trouble connecting right now. ${error.message.includes('API request failed') ? 'Please check your internet connection.' : 'Please try again in a moment.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white hover:scale-110`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">ANFA Pro Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-[380px] overflow-y-auto space-y-4 chat-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex message-bubble ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600 typing-dots">AI is thinking</span>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">Error: {error}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpChat; 