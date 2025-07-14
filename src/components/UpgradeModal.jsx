import React from 'react';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { 
  X, 
  Crown,
  Sparkles,
  Lock,
  Check,
  ArrowRight,
  Star
} from 'lucide-react';
import { PLAN_DETAILS, PLANS } from '../utils/featureAccess.js';

const UpgradeModal = ({ isOpen, onClose, requiredPlan, featureName }) => {
  if (!isOpen) return null;

  const planDetails = PLAN_DETAILS[requiredPlan];
  const isPro = requiredPlan === PLANS.PRO;
  const isTeam = requiredPlan === PLANS.TEAM;

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
            
            {/* Header */}
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isTeam 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upgrade to {planDetails.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Unlock <strong>{featureName}</strong> and many more features
              </p>
              <Badge className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                {planDetails.price}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Features List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What you'll get:
              </h3>
              <div className="space-y-2">
                {planDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            {planDetails.limitations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Current limitations:
                </h3>
                <div className="space-y-2">
                  {planDetails.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => {
                  // TODO: Implement payment integration
                  console.log('Upgrade to:', requiredPlan);
                  alert('Payment integration coming soon!');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                <Star className="w-4 h-4 mr-2" />
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cancel anytime • No setup fees • 30-day money-back guarantee
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpgradeModal; 