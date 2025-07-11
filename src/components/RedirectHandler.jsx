import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Link from '../entities/Link.js';
import { Card, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkData, setLinkData] = useState(null);
  const [pixelInjected, setPixelInjected] = useState(false);
  const [expiredByClicks, setExpiredByClicks] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Check if we have cached data first
        const cachedData = sessionStorage.getItem(`redirect_${shortCode}`);
        if (cachedData) {
          const link = JSON.parse(cachedData);
          setLinkData(link);
          
          // Check for scheduling
          if (link.start_at && new Date() < new Date(link.start_at)) {
            setError(link.scheduled_message || 'This link is scheduled for the future.');
            setLoading(false);
            return;
          }
          // Check for expiry
          if (link.expires_at && new Date() > new Date(link.expires_at)) {
            setError(link.expiry_message || 'This link has expired');
            setLoading(false);
            return;
          }
          // Check for lock
          if (link.is_locked) {
            setError(link.locked_message || 'This link is password protected.');
            setLoading(false);
            return;
          }
          // Check for pixel script
          if (link.pixel_script) {
            setLinkData(link);
            setPixelInjected(true);
            setTimeout(() => {
              window.location.href = link.original_url;
            }, 1200); // 1.2s delay for pixel firing
            return;
          }
          // Check for max_clicks and click_count
          if (link.max_clicks && link.click_count >= link.max_clicks) {
            setExpiredByClicks(true);
            setLoading(false);
            return;
          }
          // Increment click count in background (don't wait for it)
          Link.incrementClickCount(link.id).catch(console.error);
          // Immediate redirect
          window.location.href = link.original_url;
          return;
        }

        // Get link data by short code
        const link = await Link.getByShortCode(shortCode);
        if (!link) {
          setError('Link not found');
          setLoading(false);
          return;
        }
        // Check for scheduling
        if (link.start_at && new Date() < new Date(link.start_at)) {
          setError(link.scheduled_message || 'This link is scheduled for the future.');
          setLoading(false);
          return;
        }
        // Check for expiry
        if (link.expires_at && new Date() > link.expires_at) {
          setError(link.expiry_message || 'This link has expired');
          setLoading(false);
          return;
        }
        // Check for lock
        if (link.is_locked) {
          setError(link.locked_message || 'This link is password protected.');
          setLoading(false);
          return;
        }
        // Check for pixel script
        if (link.pixel_script) {
          setLinkData(link);
          setPixelInjected(true);
          setTimeout(() => {
            window.location.href = link.original_url;
          }, 1200); // 1.2s delay for pixel firing
          return;
        }
        // Check for max_clicks and click_count
        if (link.max_clicks && link.click_count >= link.max_clicks) {
          setExpiredByClicks(true);
          setLoading(false);
          return;
        }
        // Cache the link data for future use
        sessionStorage.setItem(`redirect_${shortCode}`, JSON.stringify(link));
        setLinkData(link);
        // Increment click count in background (don't wait for it)
        Link.incrementClickCount(link.id).catch(console.error);
        // Immediate redirect
        window.location.href = link.original_url;
      } catch (error) {
        console.error('Redirect error:', error);
        setError('Failed to redirect to the original URL');
        setLoading(false);
      }
    };
    // Start immediately without delay
    handleRedirect();
  }, [shortCode]);

  if (pixelInjected && linkData && linkData.pixel_script) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Retargeting Pixel Injected
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we redirect you to the original URL.
            </p>
            {/* Inject pixel script */}
            <div dangerouslySetInnerHTML={{ __html: linkData.pixel_script }} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Redirecting...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we redirect you to the original URL.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              If you're not redirected automatically, 
              <button 
                onClick={() => linkData && (window.location.href = linkData.original_url)}
                className="text-blue-600 hover:underline ml-1"
              >
                click here
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {error}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The link you're looking for could not be found or has expired.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go to Homepage
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (expiredByClicks) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Link Expired
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This link has reached its maximum allowed clicks and is no longer available.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default RedirectHandler; 