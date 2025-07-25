import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Checkbox } from './ui/checkbox.jsx';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Shield,
  MousePointer
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import ProfileModal from './ProfileModal.jsx';
import { motion } from 'framer-motion';
import { User as UserEntity } from '../entities/User.js';

// Memoized social login icons
const GoogleIcon = React.memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
));

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) return 'Good Morning';
  if (hours >= 12 && hours < 17) return 'Good Afternoon';
  if (hours >= 17 && hours < 21) return 'Good Evening';
  return 'Good Night';
};
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const AuthModal = React.memo(({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Memoized handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.username) {
      newErrors.username = 'Username is required';
    } else if (!isLogin && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!isLogin && !acceptedTerms) {
      newErrors.terms = 'You must accept the Terms of Service';
    }

    if (!isLogin && !acceptedPrivacy) {
      newErrors.privacy = 'You must accept the Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin, acceptedTerms, acceptedPrivacy]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Firebase login
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        if (userCredential.user) {
          onSuccess(userCredential.user);
          onClose();
        }
      } else {
        // Firebase register
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        if (userCredential.user) {
          // Set display name and initialize public profile
          await updateProfile(userCredential.user, {
            displayName: formData.username
          });
          
          // Initialize user data with public profile
          const userData = await UserEntity.me();
          if (userData) {
            // Set join date
            localStorage.setItem(`joined_${userCredential.user.uid}`, new Date().toISOString());
            
            // Update public profile
            await UserEntity.updatePublicProfile(userCredential.user.uid, {
              name: formData.username,
              plan: 'basic',
              linksCreated: 0,
              totalViews: 0
            });
          }
          
          onSuccess(userCredential.user);
          onClose();
        }
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isLogin, validateForm, onSuccess, onClose]);

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
    setErrors({});
    setAcceptedTerms(false);
    setAcceptedPrivacy(false);
  }, [isLogin]);

  // Social login handler (only Google)
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setCurrentUser(result.user);
        setShowProfileModal(true);
        onSuccess(result.user);
        onClose();
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized modal content
  const modalContent = useMemo(() => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
        <div className="relative w-full max-w-md">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl">
          <CardHeader className="text-center pb-4 relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
                className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Header Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
            </div>
            
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {isLogin ? 'Sign in to your ANFA Pro account' : 'Join ANFA Pro to get started'}
            </p>
            
              <Badge className="mt-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Platform
            </Badge>
          </CardHeader>
          
            <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {currentUser && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-xl font-semibold text-center mb-4"
  >
    👋 {getGreeting()}, {currentUser.displayName || currentUser.email || 'User'}! Welcome back from {timeZone} 🗺️
  </motion.div>
)}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`pl-10 h-12 transition-all duration-300 ${
                        errors.username ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                      {errors.username}
                    </p>
                  )}
                </div>
              )}
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-12 transition-all duration-300 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 h-12 transition-all duration-300 ${
                      errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                    {errors.password}
                  </p>
                )}
              </div>

                {/* Terms and Privacy Checkboxes (Register only) */}
                {!isLogin && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={setAcceptedTerms}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        I accept the{' '}
                        <a href="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Terms of Service
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                        {errors.terms}
                      </p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={acceptedPrivacy}
                        onCheckedChange={setAcceptedPrivacy}
                        className="mt-1"
                      />
                      <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        I accept the{' '}
                        <a href="/privacy" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {errors.privacy && (
                      <p className="text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
                        {errors.privacy}
                      </p>
                    )}
                  </div>
                )}
              
              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-1 duration-200">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.general}
                  </p>
                  {errors.needsVerification && (
                    <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Didn't receive the email? Check your spam folder or:
                      </p>
                      {/* TODO: Implement resend verification with Firebase if needed */}
                    </div>
                  )}
                </div>
              )}
              
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>
              
              {/* Social Login Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-300">
                    Or continue with
                  </span>
                </div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="h-12 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <GoogleIcon />
                </Button>
              </div>
            
            {/* Toggle Mode */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="link"
                onClick={toggleMode}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                {isLogin ? 'Create new account' : 'Sign in instead'}
              </Button>
            </div>
            
            {/* Features */}
            <div className="pt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Unlimited URL shortening
              </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                QR code generation
              </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Advanced analytics
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  }, [isOpen, isLoading, formData, errors, acceptedTerms, acceptedPrivacy, handleSubmit, handleGoogleLogin, toggleMode, currentUser, timeZone]);

  return (
    <>
      {modalContent}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        user={currentUser}
      />
    </>
  );
});

export default AuthModal; 