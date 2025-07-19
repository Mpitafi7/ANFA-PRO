import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/index.js";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Badge } from "../components/ui/badge.jsx";
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
  QrCode,
  Trash2,
  Edit,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  Download,
  Share2,
  Zap,
  Search,
  Filter,
  MoreVertical,
  Lock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  HelpCircle,
  Activity,
  Target,
  Shield,
  Zap as ZapIcon,
  Settings,
  Bell,
  User,
  Crown
} from "lucide-react";
import { User as UserEntity } from "../entities/User.js";
import Link from "../entities/Link.js";
import { format } from "date-fns";
import QRCodeGenerator from "../components/QRCodeGenerator.jsx";
import Analytics from '../components/Analytics';
import UTMGenerator from '../components/UTMGenerator';
import ExpiryCountdown from '../components/ExpiryCountdown.jsx';
import LinkDetailsModal from '../components/LinkDetailsModal.jsx';
import InstallPrompt from '../components/InstallPrompt.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import ProfileLink from '../components/ProfileLink.jsx';
import { useTheme } from '../components/ThemeContext.jsx';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { hasFeature, FEATURES, getMinimumPlan, getUserPlanDetails } from '../utils/featureAccess.js';

function Dashboard() {
  // State declarations
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showUTMGenerator, setShowUTMGenerator] = useState(false);
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    description: '',
    tags: '',
    password: '',
    expiryHours: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    pixelScript: '',
    maxClicks: ''
  });
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState("");
  const [selectedDetailsLink, setSelectedDetailsLink] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [newWebhook, setNewWebhook] = useState("");
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [requiredPlan, setRequiredPlan] = useState(null);
  const [featureName, setFeatureName] = useState('');
  const [error, setError] = useState(null);

  // Hooks
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const db = getFirestore();

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setError(null);
        await checkUser();
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Load links when user is set
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      loadLinks().finally(() => setIsLoading(false));
    }
  }, [user]);

  // Load webhooks
  useEffect(() => {
    if (!user) return;
    
    const fetchWebhooks = async () => {
      try {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().webhooks) {
          setWebhooks(userSnap.data().webhooks);
        }
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      }
    };
    
    fetchWebhooks();
  }, [user, db]);

  // Functions
  const checkUser = async () => {
    try {
      const userData = await UserEntity.me();
      if (!userData) {
        navigate('/login');
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error('User check error:', error);
      navigate('/login');
    }
  };

  const handleFeatureClick = (feature) => {
    if (!user) return false;
    
    const userPlan = user.plan || 'basic';
    
    if (!hasFeature(userPlan, feature)) {
      const minPlan = getMinimumPlan(feature);
      setRequiredPlan(minPlan);
      setFeatureName(feature);
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const loadLinks = async () => {
    try {
      if (!user) return;
      const userLinks = await Link.getByUserId(user.id);
      setLinks(userLinks || []);
      setUrls(userLinks || []);
    } catch (error) {
      console.error("Error loading links:", error);
      setLinks([]);
      setUrls([]);
    }
  };

  const handleCreateUrl = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create links');
      return;
    }
    
    try {
      const newLink = await Link.create({
        original_url: formData.originalUrl,
        short_code: formData.customAlias || Math.random().toString(36).substring(2, 8),
        custom_alias: formData.customAlias || null,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        password: formData.password,
        expiry_hours: formData.expiryHours ? parseInt(formData.expiryHours) : null,
        utmSource: formData.utmSource,
        utmMedium: formData.utmMedium,
        utmCampaign: formData.utmCampaign,
        utmTerm: formData.utmTerm,
        utmContent: formData.utmContent,
        pixel_script: formData.pixelScript,
        max_clicks: formData.maxClicks ? parseInt(formData.maxClicks) : null,
        user_id: user.id
      });

      setUrls(prev => [newLink, ...prev]);
      setLinks(prev => [newLink, ...prev]);
      
      setShowCreateModal(false);
      setFormData({
        originalUrl: '',
        customAlias: '',
        title: '',
        description: '',
        tags: '',
        password: '',
        expiryHours: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        pixelScript: '',
        maxClicks: ''
      });
    } catch (error) {
      console.error('Error creating URL:', error);
      setError('Failed to create link. Please try again.');
    }
  };

  const handleDeleteUrl = async (urlId) => {
    if (!user) {
      setError('You must be logged in to delete links');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await Link.deleteById(urlId);
        
        setUrls(prev => prev.filter(url => url.id !== urlId));
        setLinks(prev => prev.filter(link => link.id !== urlId));
      } catch (error) {
        console.error('Error deleting URL:', error);
        setError('Failed to delete link. Please try again.');
      }
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setFormData({
      originalUrl: link.original_url || '',
      customAlias: link.custom_alias || '',
      title: link.title || '',
      description: link.description || '',
      tags: link.tags || '',
      password: link.password || '',
      expiryHours: link.expiry_hours ? link.expiry_hours.toString() : '',
      utmSource: link.utmSource || '',
      utmMedium: link.utmMedium || '',
      utmCampaign: link.utmCampaign || '',
      utmTerm: link.utmTerm || '',
      utmContent: link.utmContent || '',
      pixelScript: link.pixel_script || '',
      maxClicks: link.max_clicks ? link.max_clicks.toString() : ''
    });
    setShowEditModal(true);
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    
    if (!user || !editingLink) {
      setError('You must be logged in to update links');
      return;
    }
    
    try {
      const updatedLink = await Link.updateById(editingLink.id, {
        original_url: formData.originalUrl,
        custom_alias: formData.customAlias || null,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        password: formData.password,
        expiry_hours: formData.expiryHours ? parseInt(formData.expiryHours) : null,
        utmSource: formData.utmSource,
        utmMedium: formData.utmMedium,
        utmCampaign: formData.utmCampaign,
        utmTerm: formData.utmTerm,
        utmContent: formData.utmContent,
        pixel_script: formData.pixelScript,
        max_clicks: formData.maxClicks ? parseInt(formData.maxClicks) : null
      });

      setUrls(prev => prev.map(url => url.id === editingLink.id ? updatedLink : url));
      setLinks(prev => prev.map(link => link.id === editingLink.id ? updatedLink : link));
      
      setShowEditModal(false);
      setEditingLink(null);
      setFormData({
        originalUrl: '',
        customAlias: '',
        title: '',
        description: '',
        tags: '',
        password: '',
        expiryHours: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        pixelScript: '',
        maxClicks: ''
      });
    } catch (error) {
      console.error('Error updating URL:', error);
      setError('Failed to update link. Please try again.');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setDownloadMessage("Link copied to clipboard!");
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setDownloadMessage("Failed to copy link");
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3000);
    }
  };

  const handleQRCodeClick = (link) => {
    setSelectedLink(link);
    setShowQRCode(true);
  };

  const handleDownloadQRCode = async (link) => {
    try {
      const canvas = document.createElement('canvas');
      const qrCode = new QRCode(canvas, {
        text: link.short_code,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      const link = document.createElement('a');
      link.download = `qr-${link.short_code}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setDownloadMessage("QR Code downloaded successfully!");
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3000);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setDownloadMessage("Failed to download QR code");
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3000);
    }
  };

  const handleDownloadInfo = (link) => {
    const info = {
      shortUrl: link.short_code,
      originalUrl: link.original_url,
      title: link.title,
      description: link.description,
      clicks: link.click_count || 0,
      createdAt: link.created_at,
      expiresAt: link.expires_at
    };

    const blob = new Blob([JSON.stringify(info, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `link-info-${link.short_code}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadMessage("Link info downloaded successfully!");
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 3000);
  };

  const addWebhook = async () => {
    if (!newWebhook.trim()) return;
    
    setWebhookLoading(true);
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { webhooks: arrayUnion(newWebhook.trim()) });
    setWebhooks((prev) => [...prev, newWebhook.trim()]);
    setNewWebhook("");
    setWebhookLoading(false);
  };

  const deleteWebhook = async (url) => {
    setWebhookLoading(true);
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { webhooks: arrayRemove(url) });
    setWebhooks((prev) => prev.filter((w) => w !== url));
    setWebhookLoading(false);
  };

  // Loading states
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Professional link management & analytics
                  </p>
                </div>
              </div>
              
              {user && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.displayName || user.email || 'User'}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`${
                            user.plan === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 
                            user.plan === 'team' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 
                            'bg-gradient-to-r from-gray-600 to-gray-700'
                          } text-white border-0 text-xs`}>
                            {user.plan === 'pro' ? <Crown className="h-3 w-3 mr-1" /> : null}
                            {user.plan === 'pro' ? 'Pro Plan' : 
                             user.plan === 'team' ? 'Team Plan' : 
                             'Free Plan'}
                          </Badge>
                          {user.publicId && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`/u/${user.publicId}`, '_blank')}
                              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Profile
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 lg:mt-0">
              <Button
                onClick={() => setShowUTMGenerator(!showUTMGenerator)}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ZapIcon className="h-4 w-4 mr-2" />
                UTM Generator
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Button>
            </div>
          </div>
        </div>

        {/* Install Prompt (PWA) */}
        <InstallPrompt isDarkMode={isDarkMode} />

        {/* Professional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{links.length}</p>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{links.filter(link => link.is_active).length}</p>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{links.filter(link => link.expires_at && new Date(link.expires_at) < new Date()).length}</p>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Protected</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{links.filter(link => link.password).length}</p>
                  </div>
                </div>
                <Lock className="h-8 w-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* UTM Generator */}
        {showUTMGenerator && (
          <div className="mb-8">
            <UTMGenerator />
          </div>
        )}

        {/* Analytics */}
        {showAnalytics && selectedLink && (
          <div className="mb-8">
            <Analytics urlId={selectedLink._id} />
          </div>
        )}

        {/* Professional Webhook Integration Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Webhook Integrations</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with your favorite tools</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="url"
                value={newWebhook}
                onChange={(e) => setNewWebhook(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add webhook URL (Slack, Discord, Zapier, etc.)"
                disabled={webhookLoading}
              />
            </div>
            <Button 
              onClick={addWebhook} 
              disabled={webhookLoading || !newWebhook.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              Add Webhook
            </Button>
          </div>
          
          <div className="space-y-3">
            {webhooks.length === 0 && (
              <div className="text-center py-8">
                <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No webhooks added yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add webhooks to get real-time notifications</p>
              </div>
            )}
            {webhooks.map((url) => (
              <div key={url} className="flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="break-all text-sm text-gray-700 dark:text-gray-300">{url}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => deleteWebhook(url)} 
                  disabled={webhookLoading}
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Main Content Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200/50 dark:border-gray-700/50">
              <TabsList className="grid w-full grid-cols-2 bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="recent" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
                >
                  Recent Links
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent" className="p-8">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white/50 dark:bg-gray-700/50"
                >
                  <option value="all">All Links</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="protected">Protected</option>
                </select>
              </div>

              {/* Links List */}
              <div className="space-y-4">
                {links.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <LinkIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No links yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Get started by creating your first short link. Track clicks, analyze performance, and grow your audience.
                    </p>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Link
                    </Button>
                  </div>
                ) : (
                  links.map((link) => (
                    <Card key={link.id} className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm">
                                <LinkIcon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {link.title || link.short_code}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-all">
                                  {link.original_url}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{link.click_count || 0} clicks</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(link.created_at), 'MMM dd, yyyy')}</span>
                              </div>
                              {link.password && (
                                <div className="flex items-center space-x-1">
                                  <Lock className="h-4 w-4 text-yellow-500" />
                                  <span>Protected</span>
                                </div>
                              )}
                              {link.expires_at && new Date(link.expires_at) < new Date() && (
                                <Badge variant="destructive" className="bg-red-500 text-white">Expired</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                                {link.short_code}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(link.short_code)}
                                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQRCodeClick(link)}
                              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditLink(link)}
                              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUrl(link.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-8">
              <Analytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      {showQRCode && selectedLink && (
        <QRCodeGenerator
          link={selectedLink}
          onClose={() => setShowQRCode(false)}
        />
      )}

      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          requiredPlan={requiredPlan}
          featureName={featureName}
        />
      )}

      {/* Professional Toast */}
      {showDownloadToast && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-green-200/50 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{downloadMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;