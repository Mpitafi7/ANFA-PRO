import React from 'react';
import { AlertTriangle, Shield, X, ExternalLink } from 'lucide-react';

const SecurityWarning = ({ isVisible, onClose, onContinue, warnings, url }) => {
  if (!isVisible) return null;

  const getWarningMessage = (warning) => {
    switch (warning) {
      case 'suspicious_domain':
        return 'This link contains a suspicious domain that may be unsafe.';
      case 'phishing':
        return 'This link appears to be a phishing attempt.';
      case 'malware':
        return 'This link has been flagged for potential malware.';
      case 'http_redirect':
        return 'This link uses HTTP instead of HTTPS, which is less secure.';
      default:
        return 'This link has been flagged as potentially unsafe.';
    }
  };

  const getWarningIcon = (warning) => {
    switch (warning) {
      case 'suspicious_domain':
        return '🚨';
      case 'phishing':
        return '🎣';
      case 'malware':
        return '🦠';
      case 'http_redirect':
        return '⚠️';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Warning
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This link has been flagged as potentially unsafe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Warning Details */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="space-y-3">
              {warnings.map((warning, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-xl">{getWarningIcon(warning)}</span>
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      {getWarningMessage(warning)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* URL Display */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Destination URL:
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
              {url}
            </p>
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Security Tips:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Verify the URL before proceeding</li>
                  <li>• Check for HTTPS in the address</li>
                  <li>• Be cautious with login forms</li>
                  <li>• Use antivirus software</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Proceed Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityWarning; 