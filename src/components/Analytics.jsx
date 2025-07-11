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
  Crown
} from 'lucide-react';
import { db } from '../firebase.js';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

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
  const [isPremium, setIsPremium] = useState(false); // TODO: Check user's premium status

  useEffect(() => {
    if (urlId) {
      fetchAnalytics();
    }
  }, [urlId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // TODO: Implement Firebase analytics fetching
      // For now, using mock data
      const mockAnalytics = {
        totalClicks: 1247,
        uniqueVisitors: 892,
        topCountries: [
          { country: 'Pakistan', clicks: 456, percentage: 36.6 },
          { country: 'United States', clicks: 234, percentage: 18.8 },
          { country: 'United Kingdom', clicks: 123, percentage: 9.9 },
          { country: 'Canada', clicks: 89, percentage: 7.1 },
          { country: 'Australia', clicks: 67, percentage: 5.4 }
        ],
        topDevices: [
          { device: 'Mobile', clicks: 678, percentage: 54.4 },
          { device: 'Desktop', clicks: 432, percentage: 34.7 },
          { device: 'Tablet', clicks: 137, percentage: 11.0 }
        ],
        topBrowsers: [
          { browser: 'Chrome', clicks: 567, percentage: 45.5 },
          { browser: 'Safari', clicks: 234, percentage: 18.8 },
          { browser: 'Firefox', clicks: 123, percentage: 9.9 },
          { browser: 'Edge', clicks: 89, percentage: 7.1 },
          { browser: 'Others', clicks: 234, percentage: 18.8 }
        ],
        clickHistory: [
          { date: '2024-01-01', clicks: 45 },
          { date: '2024-01-02', clicks: 67 },
          { date: '2024-01-03', clicks: 89 },
          { date: '2024-01-04', clicks: 123 },
          { date: '2024-01-05', clicks: 156 },
          { date: '2024-01-06', clicks: 178 },
          { date: '2024-01-07', clicks: 234 }
        ],
        conversionRate: 12.5,
        averageTimeOnSite: 2.3
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      setError('Failed to fetch analytics data.');
    } finally {
      setLoading(false);
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
        <p className="text-red-600 dark:text-red-400">{error}</p>
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
              {analytics.topCountries.map((country, index) => (
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
                ))}
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
              {analytics.topDevices.map((device, index) => (
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
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features Notice */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unlock Advanced Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get real-time tracking, detailed reports, and advanced insights with our premium plan.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Real-time Tracking</Badge>
              <Badge variant="secondary">Detailed Reports</Badge>
              <Badge variant="secondary">Advanced Insights</Badge>
              <Badge variant="secondary">Export Data</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 