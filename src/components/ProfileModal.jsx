import React, { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { 
  X, 
  User, 
  Mail, 
  Edit,
  Save,
  Camera,
  Shield,
  Crown,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Star
} from 'lucide-react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { User as UserEntity } from '../entities/User.js';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    customId: '',
    publicId: ''
  });

  // Generate unique 8-character ID
  const generateUniqueId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    if (user && isOpen) {
      // Load custom ID from localStorage
      let customId = localStorage.getItem(`customId_${user.uid}`);
      if (!customId) {
        customId = generateUniqueId();
        localStorage.setItem(`customId_${user.uid}`, customId);
      }

      // Load public ID from localStorage
      let publicId = localStorage.getItem(`publicId_${user.uid}`);
      if (!publicId) {
        publicId = 'u_' + Math.random().toString(36).substr(2, 6);
        localStorage.setItem(`publicId_${user.uid}`, publicId);
      }

      // Load profile image from localStorage if Firebase doesn't have one
      const savedImage = localStorage.getItem(`profileImage_${user.uid}`);
      if (savedImage && !user.photoURL) {
        user.photoURL = savedImage;
      }

      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        customId: customId,
        publicId: publicId
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
        photoURL: user?.photoURL
      });
      
      // Save custom ID and public ID to user data
      if (user) {
        user.customId = formData.customId;
        user.publicId = formData.publicId;
      }
      
      // Update public profile
      await UserEntity.updatePublicProfile(user.uid, {
        name: formData.displayName,
        plan: user.plan || 'basic'
      });
      
      console.log('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const regenerateId = () => {
    setFormData(prev => ({ ...prev, customId: generateUniqueId() }));
  };

  const regeneratePublicId = () => {
    const newPublicId = 'u_' + Math.random().toString(36).substr(2, 6);
    setFormData(prev => ({ ...prev, publicId: newPublicId }));
  };

  const openPublicProfile = () => {
    const profileUrl = `${window.location.origin}/u/${formData.publicId}`;
    window.open(profileUrl, '_blank');
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 17) return 'Good Afternoon';
    if (hours >= 17 && hours < 21) return 'Good Evening';
    return 'Good Night';
  };

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
            
            {/* Welcome Message */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {getGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}! 👋
              </h2>
              <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                ANFA PRO User
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  ) : user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <User className="w-10 h-10 text-white" style={{ display: (user?.photoURL && !isLoading) ? 'none' : 'flex' }} />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => document.getElementById('profile-image-input').click()}
                  disabled={isLoading}
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                  ) : (
                    <Camera className="w-3 h-3" />
                  )}
                </Button>
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        user.photoURL = e.target.result;
                        localStorage.setItem(`profileImage_${user.uid}`, e.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            {/* Public Profile Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Public Profile
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openPublicProfile}
                  className="h-6 px-2 text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Public ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {formData.publicId}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`${window.location.origin}/u/${formData.publicId}`)}
                      className="h-6 w-6 p-0"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Star className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Enter your display name"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  value={formData.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom ID
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.customId}
                    onChange={(e) => handleInputChange('customId', e.target.value)}
                    placeholder="Enter custom ID"
                    disabled={!isEditing}
                  />
                  <Button
                    variant="outline"
                    onClick={regenerateId}
                    disabled={!isEditing}
                    className="px-3"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {user?.totalLinks || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Links Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {user?.totalClicks || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Clicks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileModal; 