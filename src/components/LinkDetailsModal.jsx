import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Edit, Trash2, Download, QrCode, ExternalLink, Clock, Lock } from 'lucide-react';
import ExpiryCountdown from './ExpiryCountdown.jsx';

export default function LinkDetailsModal({ link, onClose, onEdit, onDelete, onDownloadQRCode, onDownloadInfo, onCopy }) {
  if (!link) return null;
  const shortUrl = link.getShortUrl ? link.getShortUrl() : `${window.location.origin}/${link.short_code}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Link Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl">&times;</button>
        </div>
        <CardContent className="space-y-4 p-6">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Title</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{link.title || 'Untitled'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Short URL</p>
            <div className="flex items-center space-x-2">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline break-all">{shortUrl}</a>
              <Button size="sm" variant="ghost" onClick={() => onCopy(shortUrl)}><Copy className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => window.open(shortUrl, '_blank')}><ExternalLink className="w-4 h-4" /></Button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original URL</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{link.original_url}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Created:</span>
            <span className="text-xs text-gray-900 dark:text-white">{link.getFormattedCreatedAt ? link.getFormattedCreatedAt() : 'Unknown'}</span>
            {link.start_at && new Date() < new Date(link.start_at) && (
              <ExpiryCountdown target={link.start_at} label="Goes live in" className="ml-2" />
            )}
            {link.expires_at && new Date() < new Date(link.expires_at) && (
              <ExpiryCountdown target={link.expires_at} label="Expires in" className="ml-2" />
            )}
            {link.is_locked && <Lock className="w-4 h-4 text-purple-500 ml-2" title="Password Protected" />}
            {link.expires_at && <Clock className="w-4 h-4 text-orange-500 ml-2" title="Has Expiry" />}
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Clicks</p>
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{link.click_count || 0}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => onDownloadQRCode(link)}><QrCode className="w-4 h-4 mr-1" /> QR Code</Button>
            <Button size="sm" variant="outline" onClick={() => onDownloadInfo(link)}><Download className="w-4 h-4 mr-1" /> Info</Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(link)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(link.id)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
} 