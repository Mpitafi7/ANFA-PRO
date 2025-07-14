import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, HelpCircle, Globe, Mail, Flag, Settings, Sparkles, History, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { User as UserEntity } from '../entities/User.js';

// Multi-language support
const LANGUAGES = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    welcome: "Hello! I'm your ANFA Pro AI assistant. I can help you with URL shortening, explain features, answer questions, and even draft professional emails based on your problems. Just describe your issue and I'll create a complete email for you! 🤖",
    placeholder: "Describe your problem or ask a question...",
    thinking: "AI is thinking",
    error: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
    sendEmail: "Send Email Report",
    language: "Language",
    assistant: "ANFA Pro Assistant",
    history: "Chat History",
    clearHistory: "Clear History",
    noHistory: "No chat history found",
    deleteConfirm: "Are you sure you want to delete this chat?",
    autoDelete: "Chats auto-delete after 3 days",
    emailPrompt: "I'll create a professional email based on your problem. Here's your complete email draft:",
    emailSubject: "Subject: ",
    emailBody: "Email Body:",
    copyEmail: "Copy Email",
    emailCopied: "Email copied to clipboard!"
  },
  ur: {
    name: 'اردو',
    flag: '🇵🇰',
    welcome: "السلام علیکم! میں آپ کا ANFA Pro AI اسسٹنٹ ہوں۔ میں URL شارٹننگ، فیچرز کی وضاحت، سوالات کے جوابات دے سکتا ہوں، اور آپ کے مسائل کی بنیاد پر پیشہ ورانہ ای میلز بھی تیار کر سکتا ہوں۔ اپنا مسئلہ بیان کریں اور میں آپ کے لیے مکمل ای میل بنا دوں گا! 🤖",
    placeholder: "اپنا مسئلہ بیان کریں یا سوال پوچھیں...",
    thinking: "AI سوچ رہا ہے",
    error: "معذرت، ابھی میں رابطہ کرنے میں مشکل کا سامنا کر رہا ہوں۔ براہ کرم ایک لمحے میں دوبارہ کوشش کریں۔",
    sendEmail: "ای میل رپورٹ بھیجیں",
    language: "زبان",
    assistant: "ANFA Pro اسسٹنٹ",
    history: "چیٹ ہسٹری",
    clearHistory: "ہسٹری صاف کریں",
    noHistory: "کوئی چیٹ ہسٹری نہیں ملی",
    deleteConfirm: "کیا آپ واقعی اس چیٹ کو حذف کرنا چاہتے ہیں؟",
    autoDelete: "چیٹس 3 دن بعد خود بخود حذف ہو جاتی ہیں",
    emailPrompt: "میں آپ کے مسئلے کی بنیاد پر ایک پیشہ ورانہ ای میل تیار کروں گا۔ یہاں آپ کا مکمل ای میل ڈرافٹ ہے:",
    emailSubject: "موضوع: ",
    emailBody: "ای میل کا متن:",
    copyEmail: "ای میل کاپی کریں",
    emailCopied: "ای میل کلپ بورڈ پر کاپی ہو گیا!"
  },
  hi: {
    name: 'हिंदी',
    flag: '🇮🇳',
    welcome: "नमस्ते! मैं आपका ANFA Pro AI सहायक हूं। मैं URL शॉर्टनिंग, फीचर्स की व्याख्या, प्रश्नों का उत्तर दे सकता हूं, और आपकी समस्याओं के आधार पर पेशेवर ईमेल भी तैयार कर सकता हूं। बस अपनी समस्या बताएं और मैं आपके लिए पूरा ईमेल बना दूंगा! 🤖",
    placeholder: "अपनी समस्या बताएं या प्रश्न पूछें...",
    thinking: "AI सोच रहा है",
    error: "क्षमा करें, अभी मुझे कनेक्ट करने में समस्या आ रही है। कृपया एक क्षण में पुनः प्रयास करें।",
    sendEmail: "ईमेल रिपोर्ट भेजें",
    language: "भाषा",
    assistant: "ANFA Pro सहायक",
    history: "चैट इतिहास",
    clearHistory: "इतिहास साफ़ करें",
    noHistory: "कोई चैट इतिहास नहीं मिला",
    deleteConfirm: "क्या आप वाकई इस चैट को हटाना चाहते हैं?",
    autoDelete: "चैट्स 3 दिन बाद स्वचालित रूप से हट जाती हैं",
    emailPrompt: "मैं आपकी समस्या के आधार पर एक पेशेवर ईमेल तैयार करूंगा। यहाँ आपका पूरा ईमेल ड्राफ्ट है:",
    emailSubject: "विषय: ",
    emailBody: "ईमेल का मुख्य भाग:",
    copyEmail: "ईमेल कॉपी करें",
    emailCopied: "ईमेल क्लिपबोर्ड पर कॉपी हो गया!"
  }
};

// Chat history management
const CHAT_STORAGE_KEY = 'anfa_pro_chat_history';
const AUTO_DELETE_DAYS = 3;

const HelpChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [fullMessage, setFullMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: LANGUAGES.en.welcome,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Save messages to history when they change
  useEffect(() => {
    if (messages.length > 1) { // Don't save welcome message
      saveChatToHistory();
    }
  }, [messages]);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await UserEntity.me();
        setUser(userData);
      } catch (error) {
        console.log('No user found');
      }
    };
    loadUser();
  }, []);

  // Update welcome message when language changes
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{
        id: 1,
        type: 'assistant',
        content: LANGUAGES[currentLanguage].welcome,
        timestamp: new Date()
      }]);
    }
  }, [currentLanguage]);

  // Typing animation effect
  useEffect(() => {
    if (isTyping && fullMessage) {
      const words = fullMessage.split(' ');
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < words.length) {
          setTypingMessage(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          // Add the complete message to messages array
          const assistantMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            content: fullMessage,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Reset typing state
          setIsTyping(false);
          setTypingMessage('');
          setFullMessage('');
          clearInterval(typingInterval);
        }
      }, 80); // Faster typing for better UX

      return () => clearInterval(typingInterval);
    }
  }, [isTyping, fullMessage]);

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        // Filter out expired chats (older than 3 days)
        const now = new Date();
        const validHistory = history.filter(chat => {
          const chatDate = new Date(chat.lastUpdated);
          const daysDiff = (now - chatDate) / (1000 * 60 * 60 * 24);
          return daysDiff < AUTO_DELETE_DAYS;
        });
        
        setChatHistory(validHistory);
        
        // Update localStorage with filtered history
        if (validHistory.length !== history.length) {
          localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(validHistory));
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save current chat to history
  const saveChatToHistory = () => {
    try {
      const chatData = {
        id: currentChatId || Date.now(),
        messages: messages.filter(msg => msg.id !== 1), // Exclude welcome message
        lastUpdated: new Date().toISOString(),
        language: currentLanguage
      };

      const existingHistory = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '[]');
      const updatedHistory = existingHistory.filter(chat => chat.id !== chatData.id);
      updatedHistory.unshift(chatData);

      // Keep only last 10 chats
      const limitedHistory = updatedHistory.slice(0, 10);
      
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(limitedHistory));
      setChatHistory(limitedHistory);
      setCurrentChatId(chatData.id);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Load a specific chat from history
  const loadChatFromHistory = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages([
        {
          id: 1,
          type: 'assistant',
          content: LANGUAGES[chat.language || 'en'].welcome,
          timestamp: new Date()
        },
        ...chat.messages
      ]);
      setCurrentLanguage(chat.language || 'en');
      setCurrentChatId(chatId);
      setShowHistory(false);
    }
  };

  // Clear all chat history
  const clearAllHistory = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setChatHistory([]);
    setShowHistory(false);
    setShowDeleteConfirm(false);
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([{
      id: 1,
      type: 'assistant',
      content: LANGUAGES[currentLanguage].welcome,
      timestamp: new Date()
    }]);
    setCurrentChatId(null);
    setShowHistory(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Send email report
  const sendEmailReport = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) return;
    
    setIsSendingEmail(true);
    
    try {
      const emailData = {
        to: 'support@anfa.pro',
        subject: `[ANFA Pro Support] ${emailSubject}`,
        message: `
User ID: ${user?.id || 'Not logged in'}
User Email: ${user?.email || 'Not provided'}
Language: ${LANGUAGES[currentLanguage].name}
Timestamp: ${new Date().toISOString()}

User Message:
${emailMessage}

Chat History:
${messages.map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}
        `,
        userPermission: true
      };

      // Here you would integrate with your email service
      // For now, we'll simulate the email sending
      console.log('Sending email report:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add success message to chat
      const successMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: currentLanguage === 'ur' 
          ? 'آپ کا ای میل رپورٹ کامیابی سے بھیج دیا گیا ہے۔ ہم جلد ہی آپ سے رابطہ کریں گے۔ 📧'
          : currentLanguage === 'hi'
          ? 'आपकी ईमेल रिपोर्ट सफलतापूर्वक भेज दी गई है। हम जल्द ही आपसे संपर्क करेंगे। 📧'
          : 'Your email report has been sent successfully. We will contact you soon. 📧',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, successMessage]);
      setShowEmailForm(false);
      setEmailSubject('');
      setEmailMessage('');
      
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: currentLanguage === 'ur'
          ? 'ای میل بھیجنے میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔'
          : currentLanguage === 'hi'
          ? 'ईमेल भेजने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'There was an issue sending the email. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSendingEmail(false);
    }
  };

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
      const apiKey = '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';
      
      console.log('Sending message to AI...');
      
      // Check if user is asking for email help
      const isEmailRequest = inputMessage.toLowerCase().includes('email') || 
                           inputMessage.toLowerCase().includes('mail') ||
                           inputMessage.toLowerCase().includes('problem') ||
                           inputMessage.toLowerCase().includes('issue') ||
                           inputMessage.toLowerCase().includes('help') ||
                           inputMessage.toLowerCase().includes('complaint');
      
      const systemPrompt = isEmailRequest 
        ? `You are ANFA Pro's AI assistant with email drafting capabilities. ANFA Pro is an AI-powered URL shortener.

When a user describes a problem or asks for email help, create a professional email draft with:
1. A clear subject line
2. Professional greeting
3. Detailed explanation of the problem
4. Request for assistance or resolution
5. Professional closing

Format the response as:
**EMAIL DRAFT**
**Subject:** [Clear subject line]
**Body:**
[Professional email content]

Keep the tone professional, clear, and helpful. If the user is using Urdu (اردو), respond in Urdu. If they're using Hindi (हिंदी), respond in Hindi. Otherwise, respond in English.

For regular questions about ANFA Pro features, provide helpful information about URL shortening, analytics, QR codes, etc.`
        : `You are ANFA Pro's AI assistant. ANFA Pro is an AI-powered URL shortener with features like:
- URL shortening and customization
- Click tracking and analytics
- QR code generation
- AI-powered insights and feedback
- User account management
- Link performance monitoring

Help users understand these features, guide them through the process, and provide helpful information about URL shortening. Be friendly, informative, and conversational. Keep responses concise but helpful.

IMPORTANT: Respond in the user's preferred language. If they're using Urdu (اردو), respond in Urdu. If they're using Hindi (हिंदी), respond in Hindi. Otherwise, respond in English.`;
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ANFA Pro Help Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            {
              role: 'system',
              content: systemPrompt
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
          max_tokens: 800,
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

      // Start typing animation
      setFullMessage(data.choices[0].message.content);
      setIsTyping(true);

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: LANGUAGES[currentLanguage].error,
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setShowLanguageMenu(false);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          } text-white hover:scale-110 transform`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 animate-in backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-t-3xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="text-white font-semibold text-sm">{LANGUAGES[currentLanguage].assistant}</span>
                <div className="text-white/80 text-xs">Online • AI Assistant</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* History Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="text-white hover:bg-white/20 rounded-full"
                title={LANGUAGES[currentLanguage].history}
              >
                <History className="w-4 h-4" />
              </Button>
              
              {/* Language Selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <Globe className="w-4 h-4" />
                </Button>
                {showLanguageMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[140px]">
                    {Object.entries(LANGUAGES).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center space-x-2 transition-colors ${
                          currentLanguage === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
            </div>
              
              {/* Email Report Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="text-white hover:bg-white/20 rounded-full"
                title={LANGUAGES[currentLanguage].sendEmail}
              >
                <Mail className="w-4 h-4" />
              </Button>
              
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{LANGUAGES[currentLanguage].history}</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={startNewChat}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg"
                  >
                    New Chat
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50 text-xs rounded-lg"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear All
                  </Button>
                </div>
              </div>
              
              {chatHistory.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {LANGUAGES[currentLanguage].noHistory}
                </div>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => loadChatFromHistory(chat.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        currentChatId === chat.id
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {chat.messages.length} messages
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(chat.lastUpdated)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 truncate">
                        {chat.messages[0]?.content || 'Empty chat'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                {LANGUAGES[currentLanguage].autoDelete}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-3xl">
              <div className="bg-white rounded-xl p-6 mx-4 max-w-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Confirm Delete</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {LANGUAGES[currentLanguage].deleteConfirm}
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={clearAllHistory}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm"
                    size="sm"
                  >
                    Delete All
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Email Form */}
          {showEmailForm && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="space-y-3">
                <Input
                  placeholder="Email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Describe your issue..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm resize-none focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={sendEmailReport}
                    disabled={!emailSubject.trim() || !emailMessage.trim() || isSendingEmail}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm rounded-xl"
                    size="sm"
                  >
                    {isSendingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Mail className="w-4 h-4 mr-1" />
                    )}
                    {LANGUAGES[currentLanguage].sendEmail}
                  </Button>
                  <Button
                    onClick={() => setShowEmailForm(false)}
                    variant="outline"
                    size="sm"
                    className="text-sm rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-4 chat-scrollbar ${
            showEmailForm || showHistory ? 'h-[280px]' : 'h-[380px]'
          }`}>
            {messages.map((message) => {
              // Check if message contains email draft
              const isEmailDraft = message.content.includes('**EMAIL DRAFT**') || 
                                  message.content.includes('**Subject:**') ||
                                  message.content.includes('**Body:**');
              
              return (
              <div
                key={message.id}
                className={`flex message-bubble ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                    )}
                    {message.type === 'user' && (
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-white" />
                        </div>
                    )}
                    <div className="flex-1">
                        {isEmailDraft ? (
                          <div className="space-y-3">
                            <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed font-mono">
                                {message.content}
                              </p>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                onClick={async () => {
                                  const success = await copyToClipboard(message.content);
                                  if (success) {
                                    // Show success message
                                    const successMsg = {
                                      id: Date.now() + 2,
                                      type: 'assistant',
                                      content: LANGUAGES[currentLanguage].emailCopied,
                                      timestamp: new Date()
                                    };
                                    setMessages(prev => [...prev, successMsg]);
                                  }
                                }}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg"
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                {LANGUAGES[currentLanguage].copyEmail}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        )}
                        <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Animation */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-md max-w-[80%]">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {typingMessage}
                        <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {LANGUAGES[currentLanguage].thinking}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-red-600">Error: {error}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                  placeholder={LANGUAGES[currentLanguage].placeholder}
                  className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                disabled={isLoading}
              />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 rounded-xl px-4"
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