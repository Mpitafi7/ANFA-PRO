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
  Star,
  TrendingUp,
  Globe,
  Clock,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

const PublicProfile = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [realtimeStats, setRealtimeStats] = useState({
    onlineUsers: 0,
    recentActivity: [],
    trendingLinks: []
  });

  useEffect(() => {
    loadProfile();
    loadRealtimeStats();
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

  const loadRealtimeStats = () => {
    // Real-time data will come from Firebase in production
    // For now, show empty state
    const stats = {
      onlineUsers: 0,
      recentActivity: [],
      trendingLinks: []
    };
    setRealtimeStats(stats);
  };

  const copyProfileLink = async () => {
    try {
      const profileUrl = `https://anfa.pro/${publicId}`;
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getProfileImage = (name, publicId) => {
    // Generate consistent avatar based on name and publicId
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-teal-500 to-green-600',
      'from-indigo-500 to-purple-600'
    ];
    
    const colorIndex = publicId.charCodeAt(publicId.length - 1) % colors.length;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return { colors: colors[colorIndex], initials };
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { 
        label: 'Free', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        icon: null
      },
      pro: { 
        label: 'Pro', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: <Crown className="w-3 h-3" />
      },
      team: { 
        label: 'Team', 
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

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
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

  const { colors, initials } = getProfileImage(profile.name, profile.publicId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
              
              <CardContent className="relative p-8">
                {/* Profile Header */}
                <div className="text-center mb-8">
                  {/* Profile Picture */}
                  <div className="relative inline-block mb-6">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${colors} flex items-center justify-center mx-auto shadow-2xl ring-4 ring-white dark:ring-gray-800`}>
                      <span className="text-3xl font-bold text-white">{initials}</span>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg ring-2 ring-white dark:ring-gray-800">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Verified Badge */}
                    {profile.verified && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg ring-2 ring-white dark:ring-gray-800">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name and Plan */}
                  <div className="mb-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {profile.name}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
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
                    className="mb-6 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Link className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {profile.linksCreated || 0}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">Links Created</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {profile.totalViews || 0}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">Total Views</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Plan */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Current Plan
                  </h3>
                  <div className="inline-flex items-center gap-2">
                    {profile.plan === 'pro' && <Crown className="w-6 h-6 text-yellow-500" />}
                    {profile.plan === 'team' && <Shield className="w-6 h-6 text-purple-500" />}
                    {getPlanBadge(profile.plan)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Stats Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 border border-green-200 dark:border-green-700 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Stats</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Links</span>
                    <span className="font-bold text-green-600">{profile.linksCreated || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Views</span>
                    <span className="font-bold text-blue-600">{profile.totalViews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Member Since</span>
                    <span className="font-bold text-purple-600">{formatDate(profile.joined)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-800/20 border border-orange-200 dark:border-orange-700 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                    No recent activity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-800/20 border border-purple-200 dark:border-purple-700 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Plan</span>
                    <span className="font-bold text-purple-600">{profile.plan === 'pro' ? 'Pro' : profile.plan === 'team' ? 'Team' : 'Free'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className="font-bold text-green-600">{profile.verified ? 'Verified' : 'Standard'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile URL */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Profile URL</h3>
              <div className="flex items-center justify-center space-x-2">
                <code className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200">
                  https://anfa.pro/{publicId}
                </code>
                <Button size="sm" variant="outline" onClick={copyProfileLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile; 