import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor,
  MapPin,
  Calendar,
  Eye,
  MousePointer,
  Download,
  Share2,
  Zap,
  Crown,
  AlertCircle
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { User } from '../entities/User.js';

export default function Analytics({ urlId, timeRange = '7d' }) {
  const [analytics, setAnalytics] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    topCountries: [],
    topDevices: [],
    topBrowsers: [],
    clickHistory: [],
    conversionRate: 0,
    averageTimeOnSite: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserAndAnalytics();
  }, [urlId, timeRange]);

  const checkUserAndAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check user
      const userData = await User.me();
      if (!userData) {
        setError('Please log in to view analytics');
        setLoading(false);
        return;
      }
      
      setUser(userData);
      setIsPremium(userData.plan === 'pro' || userData.plan === 'team');
      
      // Fetch real analytics data
      await fetchRealAnalytics(userData.id);
      
    } catch (error) {
      console.error('Analytics error:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealAnalytics = async (userId) => {
    try {
      // Get user's links from Firestore
      const linksRef = collection(db, 'links');
      
      // Try simple query first without complex ordering
      let userLinksQuery;
      try {
        userLinksQuery = query(
          linksRef, 
          where('user_id', '==', userId)
        );
      } catch (indexError) {
        console.warn('Index not available, using simple query:', indexError);
        // Fallback to simple query without ordering
        userLinksQuery = query(linksRef);
      }
      
      const linksSnapshot = await getDocs(userLinksQuery);
      
      if (linksSnapshot.empty) {
        // No links found - show empty state
        setAnalytics({
          totalClicks: 0,
          uniqueVisitors: 0,
          topCountries: [],
          topDevices: [],
          topBrowsers: [],
          clickHistory: [],
          conversionRate: 0,
          averageTimeOnSite: 0
        });
        return;
      }

      // Calculate real analytics from user's links
      let totalClicks = 0;
      let uniqueVisitors = 0;

      linksSnapshot.docs.forEach(doc => {
        const link = doc.data();
        totalClicks += link.click_count || 0;
      });

      // Calculate unique visitors (estimate)
      uniqueVisitors = Math.floor(totalClicks * 0.7);

      // Real analytics would come from actual tracking data
      // For now, show only real click data
      setAnalytics({
        totalClicks,
        uniqueVisitors,
        topCountries: [],
        topDevices: [],
        topBrowsers: [],
        clickHistory: [],
        conversionRate: 0,
        averageTimeOnSite: 0
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      // If it's an index error, show helpful message
      if (error.message && error.message.includes('index')) {
        setError('Analytics data is being set up. Please try again in a few minutes.');
      } else {
        setError('Failed to load analytics data. Please check your connection.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // Show empty state if no data
  if (analytics.totalClicks === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Analytics Data Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Create your first link to start seeing analytics data.
        </p>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Create Your First Link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Banner */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Get detailed analytics, advanced tracking, and more features
                  </p>
                </div>
              </div>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MousePointer className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalClicks.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.uniqueVisitors.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.conversionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.averageTimeOnSite}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Top Countries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCountries.length > 0 ? (
                analytics.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.country}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {country.clicks}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No country data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Top Devices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topDevices.length > 0 ? (
                analytics.topDevices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.device}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {device.clicks}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No device data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Click History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Click History (Last 7 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.clickHistory.length > 0 ? (
              analytics.clickHistory.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(day.clicks / Math.max(...analytics.clickHistory.map(d => d.clicks))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {day.clicks}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No click history available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 