import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Link as LinkIcon,
  QrCode,
  BarChart3,
  Zap
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* 404 Icon */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">404</span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Oops! Page Not Found
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The page you're looking for seems to have wandered off like a lost URL. 
              Don't worry, we'll help you find your way back!
            </p>
            
            {/* Quick Actions */}
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 gap-3">
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/dashboard">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Features Reminder */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                What you can do with ANFA PRO:
              </h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Shorten URLs instantly
                </div>
                <div className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR codes
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Track analytics
                </div>
              </div>
            </div>
            
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 