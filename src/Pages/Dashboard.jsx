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
  HelpCircle
} from "lucide-react";
import { User } from "../entities/User.js";
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

export default function Dashboard() {
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
    maxClicks: '' // NEW FIELD
  });
  const navigate = useNavigate();
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState("");
  const [selectedDetailsLink, setSelectedDetailsLink] = useState(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const db = getFirestore();
  const [webhooks, setWebhooks] = useState([]);
  const [newWebhook, setNewWebhook] = useState("");
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [requiredPlan, setRequiredPlan] = useState(null);
  const [featureName, setFeatureName] = useState('');

  useEffect(() => {
    checkUser();
    loadLinks();
    // TODO: Implement URL fetching, creation, and deletion with Firebase
  }, []);

  // Load webhooks from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchWebhooks = async () => {
      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().webhooks) {
        setWebhooks(userSnap.data().webhooks);
      }
    };
    fetchWebhooks();
  }, [user]);

  const checkUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      if (!userData) {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const handleFeatureClick = (feature) => {
    const userPlan = user?.plan || 'basic';
    
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
      const userLinks = await Link.list();
      setLinks(userLinks);
      setUrls(userLinks); // Also update urls state for compatibility
    } catch (error) {
      console.error("Error loading links:", error);
    }
    setIsLoading(false);
  };

  // TODO: Implement URL fetching, creation, and deletion with Firebase
  const handleCreateUrl = async (e) => {
    e.preventDefault();
    
    try {
      // Create link using Link entity
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
        pixel_script: formData.pixelScript, // NEW FIELD
        max_clicks: formData.maxClicks ? parseInt(formData.maxClicks) : null // NEW FIELD
      });

      // Update local state
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
          pixelScript: '', // NEW FIELD
          maxClicks: '' // NEW FIELD
        });
    } catch (error) {
      console.error('Error creating URL:', error);
    }
  };

  // TODO: Implement URL fetching, creation, and deletion with Firebase
  const handleDeleteUrl = async (urlId) => {
    if (!user) {
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        // Delete from Firestore
        await Link.deleteById(urlId);
        
        // Update local state
        setUrls(prev => prev.filter(url => url.id !== urlId));
        setLinks(prev => prev.filter(link => link.id !== urlId));
        
        // Show success message
        alert('Link deleted successfully!');
      } catch (error) {
        console.error('Error deleting URL:', error);
        alert('Failed to delete link. Please try again.');
      }
    }
  };

  // Handle edit link
  const handleEditLink = (link) => {
    setEditingLink(link);
    setFormData({
      originalUrl: link.original_url || '',
      customAlias: link.short_code || '',
      title: link.title || '',
      description: link.description || '',
      tags: link.tags || '',
      password: link.password || '',
      expiryHours: link.expiry_hours ? link.expiry_hours.toString() : '',
      utmSource: link.utm_source || '',
      utmMedium: link.utm_medium || '',
      utmCampaign: link.utm_campaign || '',
      utmTerm: link.utm_term || '',
      utmContent: link.utm_content || '',
      pixelScript: link.pixel_script || '', // NEW FIELD
      maxClicks: link.max_clicks ? link.max_clicks.toString() : '' // NEW FIELD
    });
    setShowEditModal(true);
  };

  // Handle update link
  const handleUpdateLink = async (e) => {
    e.preventDefault();
    
    if (!editingLink) return;
    
    try {
      // Update link using Link entity
      const updatedLink = new Link({
        ...editingLink,
        original_url: formData.originalUrl,
        short_code: formData.customAlias,
        title: formData.title,
        description: formData.description,
        utm_source: formData.utmSource,
        utm_medium: formData.utmMedium,
        utm_campaign: formData.utmCampaign,
        utm_term: formData.utmTerm,
        utm_content: formData.utmContent,
        pixel_script: formData.pixelScript, // NEW FIELD
        max_clicks: formData.maxClicks ? parseInt(formData.maxClicks) : null // NEW FIELD
      });

      await updatedLink.save();

      // Update local state
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
        pixelScript: '', // NEW FIELD
        maxClicks: '' // NEW FIELD
      });

      alert('Link updated successfully!');
    } catch (error) {
      console.error('Error updating URL:', error);
      alert('Failed to update link. Please try again.');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success message
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const totalClicks = urls.reduce((sum, url) => sum + (url.click_count || 0), 0);

  const filteredUrls = urls.filter(url => {
    const matchesSearch = url.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         url.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && url.isActive) ||
                         (filter === 'expired' && url.expiresAt && new Date() > new Date(url.expiresAt)) ||
                         (filter === 'protected' && url.isPasswordProtected);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: urls.length,
    active: urls.filter(url => url.isActive).length,
    expired: urls.filter(url => url.expiresAt && new Date() > new Date(url.expiresAt)).length,
    protected: urls.filter(url => url.isPasswordProtected).length
  };

  const handleQRCodeClick = (link) => {
    setSelectedLink(link);
    setShowQRCode(true);
  };

  const handleDownloadQRCode = async (link) => {
    // Show QR code and trigger download
    const qr = document.createElement('a');
    const QRCode = await import('qrcode');
    const url = link.getShortUrl ? link.getShortUrl() : `${window.location.origin}/${link.short_code}`;
    const qrDataURL = await QRCode.toDataURL(url, { width: 300, margin: 2 });
    qr.href = qrDataURL;
    qr.download = `qr-code-${link.short_code}.png`;
    document.body.appendChild(qr);
    qr.click();
    document.body.removeChild(qr);
    setDownloadMessage('QR code downloaded!');
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 2500);
  };

  const handleDownloadInfo = (link) => {
    const url = link.getShortUrl ? link.getShortUrl() : `${window.location.origin}/${link.short_code}`;
    const info = `Title: ${link.title || 'Untitled'}\nShort URL: ${url}\nOriginal URL: ${link.original_url}\nCreated: ${link.getFormattedCreatedAt ? link.getFormattedCreatedAt() : 'Unknown'}`;
    const blob = new Blob([info], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `link-info-${link.short_code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadMessage('Link info downloaded!');
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 2500);
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

  if (!user) {
    return null; // Or a loading spinner if you want
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your short links and track their performance
            </p>
            {user && (
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome back, <span className="font-medium text-gray-700 dark:text-gray-300">
                    {user.full_name || user.username || user.email || 'User'}
                  </span>! 👋
                </p>
                  <Badge className={`${
                    user.plan === 'pro' ? 'bg-blue-600' : 
                    user.plan === 'team' ? 'bg-purple-700' : 
                    'bg-gray-500'
                  } text-white`}>
                    {user.plan === 'pro' ? 'Pro Plan' : 
                     user.plan === 'team' ? 'Team Plan' : 
                     'Basic Plan'}
                  </Badge>
                </div>
                
                {/* Public Profile Link */}
                <ProfileLink user={user} compact={true} />
              </div>
            )}
            {!user && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  You are not logged in. Please <a href="/login" className="underline">log in</a> to access your dashboard.
                </p>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUTMGenerator(!showUTMGenerator)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              UTM Generator
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Link</span>
            </button>
          </div>
        </div>

        {/* Install Prompt (PWA) */}
        <InstallPrompt isDarkMode={isDarkMode} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.expired}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Protected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.protected}</p>
              </div>
            </div>
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

        {/* Webhook Integration Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Webhook Integrations</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="url"
              value={newWebhook}
              onChange={(e) => setNewWebhook(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Add webhook URL (Slack, Discord, Zapier, etc.)"
              disabled={webhookLoading}
            />
            <Button onClick={addWebhook} disabled={webhookLoading || !newWebhook.trim()}>
              Add Webhook
            </Button>
          </div>
          <ul className="space-y-2">
            {webhooks.length === 0 && <li className="text-gray-500 dark:text-gray-400">No webhooks added yet.</li>}
            {webhooks.map((url) => (
              <li key={url} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                <span className="break-all text-sm">{url}</span>
                <Button size="sm" variant="outline" onClick={() => deleteWebhook(url)} disabled={webhookLoading}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Recent Links Tab */}
          <TabsContent value="recent" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.slice(0, 6).map((link) => (
                <Card key={link.id} className="hover:shadow-lg transition-shadow" onClick={() => setSelectedDetailsLink(link)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{link.title || "Untitled"}</span>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary">{link.click_count || 0} clicks</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {link.description || "No description"}
                    </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {link.getFormattedCreatedAt ? link.getFormattedCreatedAt() : 'Unknown'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                    <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Short URL:</span>
                          <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                            {link.getShortUrl ? link.getShortUrl() : `${window.location.origin}/${link.short_code}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Original:</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-32">
                            {link.original_url}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                            onClick={() => copyToClipboard(link.getShortUrl ? link.getShortUrl() : `${window.location.origin}/${link.short_code}`)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQRCodeClick(link)}
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          QR
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadQRCode(link)}
                          title="Download QR Code"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadInfo(link)}
                          title="Download Link Info"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                            onClick={() => handleEditLink(link)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(link.getShortUrl ? link.getShortUrl() : `${window.location.origin}/${link.short_code}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUrl(link.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Clicks</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalClicks}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Active Links</CardTitle>
                  <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{links.length}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +2 new this week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Top Country</CardTitle>
                  <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">US</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    45% of total clicks
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Mobile Users</CardTitle>
                  <Smartphone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">65%</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all" className="dark:bg-gray-700 dark:text-white">All Links</option>
            <option value="active" className="dark:bg-gray-700 dark:text-white">Active</option>
            <option value="expired" className="dark:bg-gray-700 dark:text-white">Expired</option>
            <option value="protected" className="dark:bg-gray-700 dark:text-white">Password Protected</option>
          </select>
        </div>

        {/* URLs List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredUrls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-300">No links found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUrls.map((url) => (
                    <tr key={url.id} className="hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setSelectedDetailsLink(url)}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {url.title || 'Untitled'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                                {url.getShortUrl ? url.getShortUrl() : `${window.location.origin}/${url.short_code}`}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-400 truncate">
                                {url.original_url}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {url.isPasswordProtected && (
                                <Lock className="h-4 w-4 text-purple-500" title="Password Protected" />
                              )}
                              {url.expires_at && new Date() < new Date(url.expires_at) && (
                                <ExpiryCountdown target={url.expires_at} label="Expires in" className="ml-2" />
                              )}
                              {url.utm_source && (
                                <Globe className="h-4 w-4 text-blue-500" title="Has UTM Parameters" />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {url.click_count || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {/* Health Status Icon */}
                        {url.health_status === 'healthy' && <CheckCircle className="h-5 w-5 text-green-500" title="Healthy" />}
                        {url.health_status === 'broken' && <XCircle className="h-5 w-5 text-red-500" title="Broken" />}
                        {url.health_status === 'timeout' && <AlertTriangle className="h-5 w-5 text-yellow-500" title="Timeout" />}
                        {url.health_status === 'redirect_loop' && <RefreshCw className="h-5 w-5 text-orange-500" title="Redirect Loop" />}
                        {(!url.health_status || url.health_status === 'unknown') && <HelpCircle className="h-5 w-5 text-gray-400" title="Unknown" />}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {url.getFormattedCreatedAt ? url.getFormattedCreatedAt() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(url.getShortUrl ? url.getShortUrl() : `${window.location.origin}/${url.short_code}`)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditLink(url)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUrl(url.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Call backend to check link health
                              alert('Manual health check not yet implemented.');
                            }}
                            title="Check Now"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create URL Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Create New Link
                </h2>
                
                <form onSubmit={handleCreateUrl} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Original URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.originalUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom Alias (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.customAlias}
                      onChange={(e) => setFormData(prev => ({ ...prev, customAlias: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="my-custom-link"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Link title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Link description"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  {/* Password Protection */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Security Options
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password Protection
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Leave empty for no password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Time (hours)
                        </label>
                        <select
                          value={formData.expiryHours}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiryHours: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">No expiry</option>
                          <option value="1">1 hour</option>
                          <option value="24">1 day</option>
                          <option value="168">1 week</option>
                          <option value="720">1 month</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* UTM Parameters */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      UTM Parameters
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Source
                        </label>
                        <input
                          type="text"
                          value={formData.utmSource}
                          onChange={(e) => setFormData(prev => ({ ...prev, utmSource: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="google, facebook"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Medium
                        </label>
                        <input
                          type="text"
                          value={formData.utmMedium}
                          onChange={(e) => setFormData(prev => ({ ...prev, utmMedium: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="cpc, email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Campaign
                        </label>
                        <input
                          type="text"
                          value={formData.utmCampaign}
                          onChange={(e) => setFormData(prev => ({ ...prev, utmCampaign: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="summer-sale"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Term
                        </label>
                        <input
                          type="text"
                          value={formData.utmTerm}
                          onChange={(e) => setFormData(prev => ({ ...prev, utmTerm: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="keyword"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Content
                        </label>
                        <input
                          type="text"
                          value={formData.utmContent}
                          onChange={(e) => setFormData(prev => ({ ...prev, utmContent: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="banner, text-link"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Retargeting Pixel Script */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Retargeting Pixel Script
                    </h3>
                    <textarea
                      value={formData.pixelScript}
                      onChange={(e) => setFormData(prev => ({ ...prev, pixelScript: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Paste your pixel script here (e.g. Facebook, Google, TikTok)"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Clicks (optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxClicks}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxClicks: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter max allowed clicks (leave blank for unlimited)"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Link
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit URL Modal */}
        {showEditModal && editingLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Link
                </h2>
                
                <form onSubmit={handleUpdateLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Original URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.originalUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom Alias
                    </label>
                    <input
                      type="text"
                      value={formData.customAlias}
                      onChange={(e) => setFormData(prev => ({ ...prev, customAlias: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="my-custom-link"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Link title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Link description"
                      rows="3"
                    />
                  </div>

                  {/* Retargeting Pixel Script */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Retargeting Pixel Script
                    </h3>
                    <textarea
                      value={formData.pixelScript}
                      onChange={(e) => setFormData(prev => ({ ...prev, pixelScript: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Paste your pixel script here (e.g. Facebook, Google, TikTok)"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Clicks (optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxClicks}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxClicks: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter max allowed clicks (leave blank for unlimited)"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingLink(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Update Link
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <LinkDetailsModal
          link={selectedDetailsLink}
          onClose={() => setSelectedDetailsLink(null)}
          onEdit={handleEditLink}
          onDelete={handleDeleteUrl}
          onDownloadQRCode={handleDownloadQRCode}
          onDownloadInfo={handleDownloadInfo}
          onCopy={copyToClipboard}
        />
      </div>
      {/* Toast notification */}
      {showDownloadToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          {downloadMessage}
        </div>
      )}
    </div>
  );
}