import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../src/utils/index.js";
import { Button } from "../src/components/ui/button.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { Card, CardContent } from "../src/components/ui/card.jsx";
import { Badge } from "../src/components/ui/badge.jsx";
import QRCodeGenerator from "../src/components/QRCodeGenerator.jsx";
import { 
  Zap, 
  BarChart3, 
  Shield, 
  ArrowRight, 
  Link as LinkIcon,
  Sparkles,
  TrendingUp,
  Users,
  QrCode
} from "lucide-react";
import { User } from "../src/entities/User.js";
import { Link as LinkEntity } from "../src/entities/Link.js";
import { InvokeLLM } from "../src/integrations/Core.js";

export default function Home() {
  const [user, setUser] = useState(null);
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    totalUsers: 0
  });

  useEffect(() => {
    checkUser();
    loadStats();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadStats = async () => {
    try {
      const links = await LinkEntity.list();
      const users = await User.list();
      const totalClicks = links.reduce((sum, link) => sum + (link.click_count || 0), 0);
      
      setStats({
        totalLinks: links.length,
        totalClicks,
        totalUsers: users.length
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const generateAIFeedback = async (url) => {
    try {
      const response = await InvokeLLM({
        prompt: `Generate a funny, witty, and encouraging message about this URL: "${url}". Make it sound like ANFA Pro AI is commenting. Keep it short, fun, and maybe reference Pakistani culture or humor. Examples: "Whoa, that's a long URL!", "Your link is hotter than Karachi in June!", "This URL is longer than a Karachi traffic jam!"`,
        response_json_schema: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        }
      });
      return response.message;
    } catch (error) {
      const defaultMessages = [
        "Whoa, that's a long URL! 🚀",
        "Your link is hotter than Karachi in June! 🔥",
        "This URL is longer than a Karachi traffic jam! 🚗",
        "Time to make this URL as short as a Lahore winter! ❄️",
        "Let's shrink this link faster than chai gets cold! ☕"
      ];
      return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
    }
  };

  const handleShorten = async () => {
    if (!longUrl.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Generate AI feedback
      const feedback = await generateAIFeedback(longUrl);
      setAiMessage(feedback);
      
      // Generate short code
      const shortCode = customAlias || Math.random().toString(36).substring(2, 8);
      
      // Create link
      const newLink = await LinkEntity.create({
        original_url: longUrl,
        short_code: shortCode,
        custom_alias: customAlias || null,
        click_count: 0,
        analytics: [],
        is_active: true
      });
      
      setShortenedUrl(`https://anfa.pro/${shortCode}`);
      setLongUrl("");
      setCustomAlias("");
      
      // Update user stats if logged in
      if (user) {
        await User.updateMyUserData({
          total_links: (user.total_links || 0) + 1
        });
      }
      
    } catch (error) {
      console.error("Error shortening URL:", error);
      setAiMessage("Oops! Something went wrong. Our AI is having a chai break! ☕");
    }
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Shorten URLs instantly with our AI-powered engine. No waiting, just results.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Track clicks, analyze traffic, and get insights that matter to your business.",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your links are protected with enterprise-grade security and 99.9% uptime.",
      color: "from-green-400 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden animated-bg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%233b82f6%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Badge className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered URL Shortener
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                ANFA Pro
              </span>
              <br />
              Your Modern AI Based
              <br />
              URL Shortener
            </h1>
            
            <p className="text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Transform long URLs into powerful, trackable links with intelligent analytics and AI-powered insights. 
              Experience the future of link management.
            </p>

            {/* URL Shortener Form */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 shadow-2xl border-0 glass-effect">
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        type="url"
                        placeholder="Enter your long URL here..."
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        className="h-14 text-lg border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="text"
                        placeholder="Custom alias (optional)"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleShorten}
                    disabled={!longUrl.trim() || isLoading}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Shortening...
                      </div>
                    ) : (
                      <>
                        <LinkIcon className="w-5 h-5 mr-2" />
                        Shorten URL
                      </>
                    )}
                  </Button>

                  {/* AI Message */}
                  {aiMessage && (
                    <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-200 glass-effect">
                      <div className="flex items-center">
                        <Sparkles className="w-5 h-5 text-yellow-600 mr-2" />
                        <p className="text-yellow-800 font-medium">{aiMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Shortened URL Result */}
                  {shortenedUrl && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-2">Your shortened URL:</p>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={shortenedUrl}
                          readOnly
                          className="flex-1 bg-white dark:bg-gray-700 border-green-300 dark:border-green-600"
                        />
                        <Button
                          onClick={() => navigator.clipboard.writeText(shortenedUrl)}
                          variant="outline"
                          className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300"
                        >
                          Copy
                        </Button>
                      </div>
                      
                      {/* QR Code Button */}
                      <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                        <Button
                          onClick={() => setShowQRCode(!showQRCode)}
                          variant="outline"
                          className="w-full bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          {showQRCode ? 'Hide QR Code' : 'Generate QR Code'}
                        </Button>
                      </div>
                      
                      {/* QR Code Generator */}
                      {showQRCode && (
                        <div className="mt-4">
                          <QRCodeGenerator url={shortenedUrl} />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* CTA for non-logged users */}
            {!user && (
              <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={async () => await User.login()}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  onClick={async () => await User.login()}
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <LinkIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.totalLinks.toLocaleString()}+
              </div>
              <div className="text-gray-300">Links Created</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.totalClicks.toLocaleString()}+
              </div>
              <div className="text-gray-300">Total Clicks</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.totalUsers.toLocaleString()}+
              </div>
              <div className="text-gray-300">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ANFA Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of speed, intelligence, and reliability in URL shortening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Links?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust ANFA Pro for their link management needs. 
            Start shortening, tracking, and optimizing today.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={async () => await User.login()}
                size="lg" 
                className="bg-gradient-to-r from-white to-gray-100 text-blue-600 hover:from-gray-100 hover:to-gray-200 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link to={createPageUrl("Dashboard")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <Link to={createPageUrl("Dashboard")}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-white to-gray-100 text-blue-600 hover:from-gray-100 hover:to-gray-200 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}