import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../src/utils/index.js";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../src/components/ui/tabs.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { Badge } from "../src/components/ui/badge.jsx";
import { 
  Link as LinkIcon,
  Plus,
  BarChart3,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Copy,
  ExternalLink,
  Calendar,
  QrCode
} from "lucide-react";
import { User } from "../src/entities/User.js";
import { Link } from "../src/entities/Link.js";
import { InvokeLLM } from "../src/integrations/Core.js";
import { format } from "date-fns";
import QRCodeGenerator from "../src/components/QRCodeGenerator.jsx";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");
  const [aiTip, setAiTip] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    loadLinks();
    generateAITip();
    generateAIMessage();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      navigate(createPageUrl("Login"));
    }
  };

  const loadLinks = async () => {
    try {
      const userLinks = await Link.filter({ created_by: (await User.me()).email }, "-created_date");
      setLinks(userLinks);
    } catch (error) {
      console.error("Error loading links:", error);
    }
    setIsLoading(false);
  };

  const generateAITip = async () => {
    try {
      const response = await InvokeLLM({
        prompt: `Generate a helpful, fun tip about URL shortening, link management, or social media marketing. Make it sound like ANFA Pro AI is giving advice. Keep it concise, actionable, and maybe add some Pakistani humor or cultural references. Examples: "Pro tip: Add UTM parameters to track your marketing campaigns like a boss!", "Did you know? Short links get 39% more clicks than long ones - that's hotter than biryani on Eid!"`,
        response_json_schema: {
          type: "object",
          properties: {
            tip: { type: "string" }
          }
        }
      });
      setAiTip(response.tip);
    } catch (error) {
      const defaultTips = [
        "Pro tip: Add UTM parameters to track your marketing campaigns like a boss! 📊",
        "Did you know? Short links get 39% more clicks than long ones! 🚀",
        "Custom aliases make your links more memorable than your favorite chai spot! ☕",
        "Track your link performance to see what content resonates with your audience! 📈",
        "Use descriptive custom aliases instead of random characters for better branding! ✨"
      ];
      setAiTip(defaultTips[Math.floor(Math.random() * defaultTips.length)]);
    }
  };

  const generateAIMessage = async () => {
    try {
      const response = await InvokeLLM({
        prompt: `Generate a fun, encouraging message for a user's dashboard. Make it sound like ANFA Pro AI is being friendly and motivational. Reference their link activity or just be generally encouraging about their digital marketing journey. Keep it fun and maybe add Pakistani cultural references. Examples: "Your links are working harder than a rickshaw in rush hour traffic!", "Keep shortening those URLs - you're building an empire one click at a time!"`,
        response_json_schema: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        }
      });
      setAiMessage(response.message);
    } catch (error) {
      const defaultMessages = [
        "Your links are working harder than a rickshaw in rush hour traffic! 🛺",
        "Keep shortening those URLs - you're building an empire one click at a time! 👑",
        "Your dashboard is looking fresher than a Lahore morning! 🌅",
        "Ready to create some link magic? Let's make those URLs work for you! ✨",
        "Your link game is stronger than karachi's internet during peak hours! 💪"
      ];
      setAiMessage(defaultMessages[Math.floor(Math.random() * defaultMessages.length)]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const totalClicks = links.reduce((sum, link) => sum + (link.click_count || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your links and track their performance
              </p>
            </div>
            <Button 
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Link
            </Button>
          </div>
        </div>

        {/* AI Message */}
        {aiMessage && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <p className="text-blue-800 dark:text-blue-200 font-medium text-lg">{aiMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{links.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClicks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. CTR</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {links.length > 0 ? ((totalClicks / links.length) || 0).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Recent Links
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="ai-tips" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              AI Tips
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Messages
            </TabsTrigger>
          </TabsList>

          {/* Recent Links Tab */}
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Links</CardTitle>
              </CardHeader>
              <CardContent>
                {links.length > 0 ? (
                  <div className="space-y-4">
                    {links.slice(0, 10).map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <LinkIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                anfa.pro/{link.short_code}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {link.original_url}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {link.click_count || 0} clicks
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(new Date(link.created_date), "MMM d, yyyy")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`https://anfa.pro/${link.short_code}`)}
                            title="Copy Link"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLink(link);
                              setShowQRCode(true);
                            }}
                            title="Generate QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(link.original_url, '_blank')}
                            title="Open Original URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No links yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first shortened link to get started
                    </p>
                    <Button onClick={() => navigate(createPageUrl("Home"))}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Link Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed charts and analytics will be available soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tips Tab */}
          <TabsContent value="ai-tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  AI-Powered Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">{aiTip}</p>
                  </div>
                  <Button onClick={generateAITip} variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Another Tip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Fun AI Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-purple-800 dark:text-purple-200 font-medium">{aiMessage}</p>
                  </div>
                  <Button onClick={generateAIMessage} variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get New Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Code Modal */}
        {showQRCode && selectedLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    QR Code for: anfa.pro/{selectedLink.short_code}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowQRCode(false);
                      setSelectedLink(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>
                <QRCodeGenerator url={`https://anfa.pro/${selectedLink.short_code}`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}