import React, { useState } from "react";
import { CheckCircle, Star, CreditCard } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 0,
    priceYear: 0,
    features: [
      "Smart URL Shortening",
      "Dashboard access",
      "Limited analytics",
      "24-hour ads per tool",
      "UTM generator",
      "QR Code generation",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: 2,
    priceYear: 19.2, // 2*12*0.8
    features: [
      "Everything in Basic",
      "Ads Removed",
      "Unlimited analytics",
      "Password-protected links",
      "Link expiry and scheduling",
      "Tags and descriptions",
      "Advanced click tracking",
      "Email support",
    ],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Team",
    price: 10,
    priceYear: 96, // 10*12*0.8
    features: [
      "Everything in Pro",
      "Multi-user team dashboard",
      "Company branding",
      "Admin controls",
      "Priority support",
      "API access",
    ],
    cta: "Subscribe",
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I use ANFA PRO for free?",
    a: "Yes! The Basic plan is free forever with limited features.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Absolutely. You can change your plan at any time from your dashboard.",
  },
  {
    q: "How does the yearly discount work?",
    a: "Yearly billing gives you 20% off compared to paying monthly.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes, all payments are securely processed via Stripe.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on all paid plans.",
  },
];

const comparison = [
  ["Smart URL Shortening", true, true, true],
  ["Dashboard access", true, true, true],
  ["Limited analytics", true, false, false],
  ["Unlimited analytics", false, true, true],
  ["24-hour ads per tool", true, false, false],
  ["Ads Removed", false, true, true],
  ["Password-protected links", false, true, true],
  ["Link expiry & scheduling", false, true, true],
  ["Tags & descriptions", false, true, true],
  ["Advanced click tracking", false, true, true],
  ["Multi-user team dashboard", false, false, true],
  ["Company branding", false, false, true],
  ["Admin controls", false, false, true],
  ["API access", false, false, true],
  ["Email support", false, true, true],
  ["Priority support", false, false, true],
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Pricing Plans</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Choose the plan that fits your needs. Simple, transparent pricing for everyone.</p>
        <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none transition-colors ${!yearly ? 'bg-white dark:bg-gray-900 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none transition-colors ${yearly ? 'bg-white dark:bg-gray-900 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setYearly(true)}
          >
            Yearly <span className="ml-1 text-xs text-green-600 dark:text-green-400 font-semibold">20% off</span>
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
            className={`relative flex flex-col rounded-2xl shadow-lg border transition-all duration-300 ${
              plan.popular
                ? 'border-blue-600 bg-white dark:bg-gray-800 scale-105 z-10' 
                : 'border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
                <Star className="w-4 h-4 inline-block mr-1" /> Most Popular
              </div>
            )}
              <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h2>
                <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {plan.price === 0 ? "Free" : `$${(yearly ? plan.priceYear : plan.price).toFixed(2)}`}
                  {plan.price !== 0 && (
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">/{yearly ? 'yr' : 'mo'}</span>
                  )}
                </span>
                {plan.price !== 0 && yearly && (
                  <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-semibold">Billed yearly</span>
                )}
                </div>
              <ul className="mb-8 space-y-3 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2" /> {feature}
                    </li>
                  ))}
                </ul>
              <button className={`mt-auto w-full py-3 rounded-lg font-semibold transition-colors focus:outline-none ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-16">
        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span>Payments secured via <span className="font-semibold text-blue-600 dark:text-blue-400">Stripe</span>.</span>
      </div>
      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto mb-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Compare Plans</h3>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Feature</th>
                <th className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Basic</th>
                <th className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Pro</th>
                <th className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Team</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([feature, basic, pro, team]) => (
                <tr key={feature} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{feature}</td>
                  <td className="px-4 py-2 text-center">{basic ? <CheckCircle className="w-4 h-4 text-blue-500 mx-auto" /> : ''}</td>
                  <td className="px-4 py-2 text-center">{pro ? <CheckCircle className="w-4 h-4 text-blue-500 mx-auto" /> : ''}</td>
                  <td className="px-4 py-2 text-center">{team ? <CheckCircle className="w-4 h-4 text-blue-500 mx-auto" /> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
              </div>
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h4>
              <p className="text-gray-700 dark:text-gray-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 