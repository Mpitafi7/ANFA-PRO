import React, { useState } from "react";
import { CheckCircle, Users, Star } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: 2,
    color: "from-green-400 to-green-600",
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    features: [
      "Unlimited URL shortening",
      "Dashboard access",
      "Basic link analytics",
      "Basic support",
    ],
    cta: "Start with Basic",
    highlight: false,
  },
  {
    name: "Pro",
    price: 4,
    color: "from-yellow-400 to-yellow-600",
    icon: <Star className="h-6 w-6 text-yellow-500" />,
    features: [
      "Everything in Basic",
      "QR code generator",
      "Custom short URLs",
      "Priority support",
      "Early access to features",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: 10,
    color: "from-purple-400 to-purple-600",
    icon: <Users className="h-6 w-6 text-purple-500" />,
    features: [
      "Everything in Pro",
      "Multi-user/team dashboard",
      "Company branding (logo/domain)",
      "Admin controls",
      "Advanced analytics",
    ],
    cta: "Get Team Access",
    highlight: false,
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-0 flex flex-col items-center font-sans">
      {/* Header Navigation */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-4 px-4 md:px-0 border-b border-gray-200 dark:border-gray-800 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur z-10 sticky top-0">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => navigate("/")}>ANFA PRO</div>
        <nav className="flex space-x-2">
          <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>Login / Signup</Button>
        </nav>
      </header>
      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Choose Your Plan</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Simple, transparent pricing. No hidden fees.</p>
        </div>
        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <span className={`px-3 py-1 rounded-l-lg text-sm font-medium ${billing === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>Monthly</span>
          <button
            type="button"
            className="px-3 py-1 rounded-r-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600 focus:outline-none"
            onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
          >
            Yearly
          </button>
          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">(Coming soon)</span>
        </div>
        {/* Pricing Cards */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200 ${plan.highlight ? "scale-105 ring-2 ring-yellow-400" : ""} min-h-[480px]`}
            >
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  {plan.icon}
                  <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="text-base text-gray-500 dark:text-gray-400 font-medium">/month</span>
                </div>
                <ul className="mb-8 space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700 dark:text-gray-200 text-base">
                      <svg className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 mt-auto rounded-lg font-semibold text-white shadow transition-colors duration-150 ${plan.highlight ? "bg-yellow-500 hover:bg-yellow-600" : plan.name === "Basic" ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"}`}>{plan.cta}</button>
              </div>
            </div>
          ))}
        </div>
        {/* Custom Plan Section */}
      </div>
      {/* Footer Navigation */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-0 border-t border-gray-200 dark:border-gray-800 mt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur z-10">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-0">&copy; {new Date().getFullYear()} ANFA PRO. All rights reserved.</div>
        <nav className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Home</Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>Login / Signup</Button>
        </nav>
      </footer>
    </div>
  );
} 