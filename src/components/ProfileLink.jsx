import React, { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Card, CardContent } from './ui/card.jsx';
import { 
  User, 
  Copy, 
  Check, 
  ExternalLink,
  Star,
  Crown,
  Shield
} from 'lucide-react';

const ProfileLink = ({ user, showStats = true, compact = false }) => {
  const [copied, setCopied] = useState(false);

  if (!user || !user.publicId) {
    return null;
  }

  const copyProfileLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/u/${user.publicId}`;
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const openProfile = () => {
    window.open(`/u/${user.publicId}`, '_blank');
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

  const isVerified = user.plan === 'pro' || user.plan === 'team';

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {user.displayName || 'Anonymous'}
          </span>
          {isVerified && <Star className="w-4 h-4 text-blue-500" />}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {getPlanBadge(user.plan)}
          <Button
            size="sm"
            variant="ghost"
            onClick={copyProfileLink}
            className="h-6 w-6 p-0"
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {user.displayName || 'Anonymous User'}
                </h3>
                {user.plan === 'pro' && <Crown className="w-4 h-4 text-yellow-500" />}
                {user.plan === 'team' && <Shield className="w-4 h-4 text-purple-500" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {getPlanBadge(user.plan)}
                {isVerified && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showStats && (
              <div className="text-right text-sm text-gray-600 dark:text-gray-300">
                <div>{user.total_links || 0} links</div>
                <div>{user.total_clicks || 0} views</div>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={copyProfileLink}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={openProfile}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {showStats && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Profile: <span className="font-mono">{window.location.origin}/u/{user.publicId}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileLink; 