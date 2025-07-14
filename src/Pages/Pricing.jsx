import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { PLAN_DETAILS, PLANS } from '../utils/featureAccess.js';
import { Crown, User, Users, Check, Lock } from 'lucide-react';

const plans = [PLANS.BASIC, PLANS.PRO, PLANS.TEAM];

// Dummy Stripe URLs (replace with real ones later)
const STRIPE_URLS = {
  pro: 'https://buy.stripe.com/test_4gwcNw0Qw6kQ2yQeUU',
  team: 'https://buy.stripe.com/test_7sI7uQ0Qw6kQ2yQeUV'
};

const Pricing = () => {
  const handleUpgrade = (plan) => {
    if (plan === PLANS.PRO) {
      window.location.href = STRIPE_URLS.pro;
    } else if (plan === PLANS.TEAM) {
      window.location.href = STRIPE_URLS.team;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Upgrade anytime. Cancel anytime. No hidden fees.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, idx) => {
          const details = PLAN_DETAILS[plan];
          return (
            <Card key={plan} className={`relative shadow-xl border-2 ${plan === PLANS.PRO ? 'border-blue-500' : plan === PLANS.TEAM ? 'border-purple-600' : 'border-gray-200'}`}>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${plan === PLANS.BASIC ? 'bg-gray-200' : plan === PLANS.PRO ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                    {plan === PLANS.BASIC && <User className="w-7 h-7 text-gray-500" />}
                    {plan === PLANS.PRO && <Crown className="w-7 h-7 text-white" />}
                    {plan === PLANS.TEAM && <Users className="w-7 h-7 text-white" />}
              </div>
                </div>
                <h2 className={`text-2xl font-bold mb-1 ${plan === PLANS.PRO ? 'text-blue-700' : plan === PLANS.TEAM ? 'text-purple-700' : 'text-gray-900 dark:text-white'}`}>{details.name}</h2>
                <Badge className={`mb-2 ${plan === PLANS.PRO ? 'bg-blue-600' : plan === PLANS.TEAM ? 'bg-purple-700' : 'bg-gray-400'}`}>{details.price}</Badge>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-2 text-left">
                  {details.features.map((f, i) => (
                    <li key={i} className="flex items-center text-gray-700 dark:text-gray-200 text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2" /> {f}
                    </li>
                  ))}
                </ul>
                {details.limitations.length > 0 && (
                  <ul className="mb-4 space-y-1 text-left">
                    {details.limitations.map((l, i) => (
                      <li key={i} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Lock className="w-3 h-3 text-red-400 mr-2" /> {l}
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  className={`w-full mt-2 ${plan === PLANS.BASIC ? 'bg-gray-400' : plan === PLANS.PRO ? 'bg-blue-600' : 'bg-purple-700'} text-white font-semibold`}
                  disabled={plan === PLANS.BASIC}
                  onClick={() => handleUpgrade(plan)}
                >
                  {plan === PLANS.BASIC ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing; 