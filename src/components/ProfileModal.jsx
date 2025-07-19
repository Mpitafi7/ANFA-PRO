import React, { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { 
  User, 
  Settings, 
  LogOut, 
  ExternalLink,
  Copy,
  Check,
  X,
  Crown,
  Shield,
  Star,
  Calendar,
  BarChart3,
  Link as LinkIcon,
  Eye
} from 'lucide-react';
import { User as UserEntity } from '../entities/User.js';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const copyProfileLink = async () => {
    if (!user?.publicId) return;
    
    try {
      const profileUrl = `${window.location.origin}/u/${user.publicId}`;
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const openPublicProfile = () => {
    if (user?.publicId) {
      window.open(`/u/${user.publicId}`, '_blank');
    }
  };

  const handleLogout = async () => {
    try {
      await UserEntity.logout();
      onClose();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { 
        label: 'Free Plan', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        icon: null
      },
      pro: { 
        label: 'Pro Plan', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: <Crown className="w-3 h-3" />
      },
      team: { 
        label: 'Team Plan', 
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        icon: <Shield className="w-3 h-3" />
      }
    };
    
    const config = planConfig[plan] || planConfig.basic;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

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
                <Star className="w-3 h-3 mr-1" />
                ANFA PRO User
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {user?.displayName || 'Anonymous User'}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {user?.email}
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {getPlanBadge(user?.plan)}
                {(user?.plan === 'pro' || user?.plan === 'team') && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <LinkIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.total_links || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Links</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.total_clicks || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Member since {user?.joined ? new Date(user.joined).toLocaleDateString() : 'Recently'}</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {user?.publicId && (
                <>
                  <Button
                    onClick={copyProfileLink}
                    variant="outline"
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Profile Link
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={openPublicProfile}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Profile
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileModal; 