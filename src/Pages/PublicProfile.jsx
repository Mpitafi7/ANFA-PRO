import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../entities/User.js';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { 
  User as UserIcon, 
  Calendar, 
  Link, 
  Eye, 
  Crown, 
  Shield,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

const PublicProfile = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [publicId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profileData = await User.getPublicProfile(publicId);
      
      if (!profileData) {
        setError('Profile not found');
        return;
      }
      
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyProfileLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/u/${publicId}`;
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { label: 'Free', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
      pro: { label: 'Pro', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      team: { label: 'Team', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
    };
    
    const config = planConfig[plan] || planConfig.basic;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Profile Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-white dark:bg-gray-800">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10"></div>
          
          <CardContent className="relative p-8">
            {/* Profile Header */}
            <div className="text-center mb-8">
              {/* Profile Picture */}
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-white" />
                  )}
                </div>
                
                {/* Verified Badge */}
                {profile.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 shadow-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Name and Plan */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  {getPlanBadge(profile.plan)}
                  {profile.verified && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 mb-6">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Member since {formatDate(profile.joined)}</span>
              </div>

              {/* Copy Profile Link */}
              <Button 
                onClick={copyProfileLink}
                variant="outline"
                className="mb-6"
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
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Link className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile.linksCreated.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Links Created</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile.totalViews.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Total Views</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Plan */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Current Plan
              </h3>
              <div className="inline-flex items-center gap-2">
                {profile.plan === 'pro' && <Crown className="w-5 h-5 text-yellow-500" />}
                {profile.plan === 'team' && <Shield className="w-5 h-5 text-purple-500" />}
                {getPlanBadge(profile.plan)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile URL */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Profile URL: <span className="font-mono text-gray-700 dark:text-gray-300">
              {window.location.origin}/u/{publicId}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile; 