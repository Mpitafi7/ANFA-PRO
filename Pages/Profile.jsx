import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Lock, 
  Shield, 
  Bell, 
  Settings, 
  Trash2, 
  Download, 
  LogOut, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Check,
  Home,
  BarChart3,
  MessageSquare,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../src/components/ThemeContext.jsx';

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    bio: 'Passionate developer and tech enthusiast',
    gender: 'male',
    avatar: null,
    coverPhoto: null,
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: ''
    },
    preferences: {
      theme: theme || 'system',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      language: 'English'
    },
    security: {
      twoFactor: false,
      passwordStrength: 'strong',
      lastPasswordChange: '3 months ago'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  });
  const [twoFactorData, setTwoFactorData] = useState({
    email: '',
    code: '',
    step: 'email' // 'email' or 'code'
  });
  const [mediaGallery, setMediaGallery] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', name: 'profile1.jpg' },
    { id: 2, url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop', name: 'profile2.jpg' },
    { id: 3, url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', name: 'profile3.jpg' }
  ]);

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'iPhone 13 Pro', location: 'New York, US', lastActive: '2 hours ago', current: true },
    { id: 2, device: 'MacBook Pro', location: 'San Francisco, US', lastActive: '5 days ago', current: false },
    { id: 3, device: 'Samsung Galaxy S22', location: 'London, UK', lastActive: '1 month ago', current: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Handle theme changes
  useEffect(() => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: theme
      }
    }));
    // eslint-disable-next-line
  }, [theme]);

  const loadUserData = async () => {
    try {
      console.log('Loading user data...');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Default avatar SVGs
  const defaultAvatars = {
    male: (
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="35" r="20" fill="#3B82F6"/>
        <circle cx="50" cy="100" r="40" fill="#3B82F6"/>
        <circle cx="35" cy="35" r="3" fill="white"/>
        <circle cx="65" cy="35" r="3" fill="white"/>
        <path d="M 40 45 Q 50 55 60 45" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    ),
    female: (
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="35" r="20" fill="#EC4899"/>
        <circle cx="50" cy="100" r="40" fill="#EC4899"/>
        <circle cx="35" cy="35" r="3" fill="white"/>
        <circle cx="65" cy="35" r="3" fill="white"/>
        <path d="M 40 45 Q 50 55 60 45" stroke="white" strokeWidth="2" fill="none"/>
        <path d="M 30 25 Q 50 15 70 25" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    ),
    other: (
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="35" r="20" fill="#8B5CF6"/>
        <circle cx="50" cy="100" r="40" fill="#8B5CF6"/>
        <circle cx="35" cy="35" r="3" fill="white"/>
        <circle cx="65" cy="35" r="3" fill="white"/>
        <path d="M 40 45 Q 50 55 60 45" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    )
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploadProgress(0);
          
          const reader = new FileReader();
          reader.onload = (e) => {
            if (type === 'avatar') {
              setProfile(prev => ({ ...prev, avatar: e.target.result }));
            } else if (type === 'cover') {
              setProfile(prev => ({ ...prev, coverPhoto: e.target.result }));
            }
          };
          reader.readAsDataURL(file);
        }
      }, 100);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
    console.log('Profile saved:', profile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    setShowDeleteModal(false);
      alert('Account deleted successfully. You will be logged out.');
      // Here you would redirect to logout
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    }
  };

  const addToGallery = () => {
    if (mediaGallery.length < 12) {
      const newImage = {
        id: Date.now(),
        url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop`,
        name: `image${mediaGallery.length + 1}.jpg`
      };
      setMediaGallery(prev => [...prev, newImage]);
    }
  };

  const removeFromGallery = (id) => {
    setMediaGallery(prev => prev.filter(img => img.id !== id));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const savePassword = async () => {
    try {
      // Password validation
      if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
        alert('Please fill in all password fields.');
        return;
      }
      
      if (passwordData.new !== passwordData.confirm) {
        alert('New passwords do not match!');
        return;
      }
      
      if (passwordData.new.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Password changed:', passwordData);
      setShowPasswordModal(false);
      setPasswordData({ 
        current: '', 
        new: '', 
        confirm: '', 
        showCurrent: false, 
        showNew: false, 
        showConfirm: false 
      });
      
      // Update password strength and last change date
      setProfile(prev => ({
        ...prev,
        security: {
          ...prev.security,
          passwordStrength: 'strong',
          lastPasswordChange: 'Just now'
        }
      }));
      
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  const handleTwoFactorSetup = async () => {
    try {
      if (twoFactorData.step === 'email') {
        // Validate email
        if (!twoFactorData.email || !twoFactorData.email.includes('@')) {
          alert('Please enter a valid email address.');
          return;
        }
        
        // Simulate sending verification code
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Verification code sent:', code);
        
        setTwoFactorData(prev => ({ ...prev, step: 'code' }));
        alert(`Verification code sent to ${twoFactorData.email}. Please check your email.`);
    } else {
        // Verify code
        if (twoFactorData.code.length !== 6) {
          alert('Please enter the 6-digit verification code.');
          return;
        }
        
        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Enable 2FA
        setProfile(prev => ({
          ...prev,
          security: {
            ...prev.security,
            twoFactor: true
          }
        }));
        
        setShowTwoFactorModal(false);
        setTwoFactorData({ email: '', code: '', step: 'email' });
        alert('Two-Factor Authentication enabled successfully!');
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      alert('Error setting up Two-Factor Authentication. Please try again.');
    }
  };

  const disableTwoFactor = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => ({
        ...prev,
        security: {
          ...prev.security,
          twoFactor: false
        }
      }));
      
      alert('Two-Factor Authentication disabled successfully!');
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      alert('Error disabling Two-Factor Authentication. Please try again.');
    }
  };

  const renderPasswordStrength = () => {
    const strength = profile.security.passwordStrength;
    const colors = {
      weak: 'bg-red-500',
      medium: 'bg-yellow-500',
      strong: 'bg-green-500'
    };
    
    return (
      <div className="mt-2">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${colors[strength]} h-2 rounded-full`} style={{ width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%' }}></div>
          </div>
          <span className="ml-2 text-xs capitalize text-gray-600 dark:text-gray-400">{strength}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        {profile.coverPhoto && (
          <img 
            src={profile.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'cover')}
          className="hidden"
        />
        
        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-full">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 -mt-20 relative">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl text-gray-400">
                        {defaultAvatars[profile.gender]}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                    className="hidden"
                  />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                  {profile.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                  {profile.bio}
                </p>
                
                <div className="flex items-center mt-4 space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {profile.gender === 'male' ? '♂' : profile.gender === 'female' ? '♀' : '⚧'} {profile.gender}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Links</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">1.2K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">89%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success</div>
                </div>
              </div>
              
              {/* Account Actions */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                    <span>Change Password</span>
                  </div>
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                
                <button 
                  onClick={() => profile.security.twoFactor ? disableTwoFactor() : setShowTwoFactorModal(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                    <span>Two-Factor Auth</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {profile.security.twoFactor ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Enabled</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Disabled</span>
                    )}
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                    <span>Download Data</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  <div className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span>Delete Account</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                <div className="flex items-center space-x-2">
                  {isEditing && (
                <button
                      onClick={() => setIsEditing(false)}
                      disabled={saveLoading}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={saveLoading}
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEditing ? (
                      saveLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  >
                    <option value="male">Male ♂</option>
                    <option value="female">Female ♀</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="flex items-center">
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    />
                    <Check className="w-4 h-4 text-green-500 ml-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <div className="flex items-center">
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    />
                    <Edit3 className="w-4 h-4 text-gray-500 ml-2" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/username"
                    value={profile.socialLinks.twitter}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={profile.socialLinks.linkedin}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={profile.socialLinks.github}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, github: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Media Gallery</h3>
                {mediaGallery.length < 12 && (
                  <button
                    onClick={addToGallery}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add More
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaGallery.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                      <button 
                        onClick={() => removeFromGallery(image.id)}
                        className="opacity-0 group-hover:opacity-100 text-white p-1 bg-red-500 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {mediaGallery.length >= 12 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Maximum 12 images reached
                </p>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={e => setTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={profile.preferences.language}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      preferences: { ...prev.preferences, language: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notifications
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                        <span>Email Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={profile.preferences.notifications.email}
                          onChange={() => setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                email: !prev.preferences.notifications.email
                              }
                            }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                        <span>Push Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={profile.preferences.notifications.push}
                          onChange={() => setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                push: !prev.preferences.notifications.push
                              }
                            }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                        <span>SMS Alerts</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={profile.preferences.notifications.sms}
                          onChange={() => setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                sms: !prev.preferences.notifications.sms
                              }
                            }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account via email
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {profile.security.twoFactor ? (
                      <>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Enabled</span>
                        <button
                          onClick={disableTwoFactor}
                          className="px-3 py-1 text-xs border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Disable
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Disabled</span>
                        <button
                          onClick={() => setShowTwoFactorModal(true)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Enable
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Password Strength</h4>
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Last changed: {profile.security.lastPasswordChange}
                    </span>
                  </div>
                  {renderPasswordStrength()}
              <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="mt-3 px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                    Change Password
              </button>
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                <input
                    type={passwordData.showCurrent ? "text" : "password"}
                  name="current"
                  value={passwordData.current}
                  onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('showCurrent')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {passwordData.showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                <input
                    type={passwordData.showNew ? "text" : "password"}
                  name="new"
                  value={passwordData.new}
                  onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('showNew')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {passwordData.showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                <input
                    type={passwordData.showConfirm ? "text" : "password"}
                  name="confirm"
                  value={passwordData.confirm}
                  onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('showConfirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {passwordData.showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={savePassword}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
              <button 
                onClick={() => setShowTwoFactorModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {twoFactorData.step === 'email' ? (
                  <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email Verification</span>
                    </div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={twoFactorData.email}
                    onChange={(e) => setTwoFactorData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    We'll send a 6-digit verification code to this email address.
                  </p>
                    </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Key className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Enter Verification Code</span>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={twoFactorData.code}
                    onChange={(e) => setTwoFactorData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter the 6-digit code sent to {twoFactorData.email}
                  </p>
                </div>
                  )}
                </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowTwoFactorModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleTwoFactorSetup}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {twoFactorData.step === 'email' ? 'Send Code' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Account</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;