import React, { useState, useMemo } from 'react';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const UTMGenerator = () => {
  const [formData, setFormData] = useState({
    baseUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: ''
  });
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation function
  const validateField = (name, value) => {
    const specialChars = /[<>:"|?*]/;
    if (specialChars.test(value)) {
      return 'Contains invalid characters';
    }
    if (value.length > 100) {
      return 'Too long (max 100 characters)';
    }
    return '';
  };

  // Handle input changes
  const handleInputChange = (name, value) => {
    // Convert spaces to hyphens for UTM parameters
    let processedValue = value;
    if (name !== 'baseUrl') {
      processedValue = value.replace(/\s+/g, '-').toLowerCase();
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Validate field
    const error = validateField(name, processedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Generate final URL with UTM parameters
  const finalUrl = useMemo(() => {
    if (!formData.baseUrl) return '';

    try {
      const url = new URL(formData.baseUrl);
      const params = new URLSearchParams(url.search);
      
      // Add UTM parameters
      if (formData.utmSource) params.set('utm_source', formData.utmSource);
      if (formData.utmMedium) params.set('utm_medium', formData.utmMedium);
      if (formData.utmCampaign) params.set('utm_campaign', formData.utmCampaign);
      if (formData.utmTerm) params.set('utm_term', formData.utmTerm);
      if (formData.utmContent) params.set('utm_content', formData.utmContent);
      
      url.search = params.toString();
      return url.toString();
    } catch (error) {
      return formData.baseUrl;
    }
  }, [formData]);

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Check if form is valid
  const isValid = Object.values(errors).every(error => !error) && formData.baseUrl;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          UTM Parameter Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create tracking URLs with UTM parameters for better analytics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.baseUrl}
              onChange={(e) => handleInputChange('baseUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com"
            />
            {errors.baseUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.baseUrl}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Source <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.utmSource}
              onChange={(e) => handleInputChange('utmSource', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="google, facebook, newsletter"
            />
            {errors.utmSource && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.utmSource}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medium
            </label>
            <input
              type="text"
              value={formData.utmMedium}
              onChange={(e) => handleInputChange('utmMedium', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="cpc, email, social"
            />
            {errors.utmMedium && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.utmMedium}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign
            </label>
            <input
              type="text"
              value={formData.utmCampaign}
              onChange={(e) => handleInputChange('utmCampaign', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="summer-sale, product-launch"
            />
            {errors.utmCampaign && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.utmCampaign}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Term
            </label>
            <input
              type="text"
              value={formData.utmTerm}
              onChange={(e) => handleInputChange('utmTerm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="keyword, search-term"
            />
            {errors.utmTerm && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.utmTerm}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <input
              type="text"
              value={formData.utmContent}
              onChange={(e) => handleInputChange('utmContent', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="banner, text-link, image"
            />
            {errors.utmContent && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.utmContent}
              </p>
            )}
          </div>
        </div>

        {/* URL Preview */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated URL
            </label>
            <div className="relative">
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 min-h-[120px]">
                {finalUrl ? (
                  <div className="break-all text-sm text-gray-800 dark:text-gray-200">
                    {finalUrl}
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 text-sm">
                    Enter a base URL to see the generated URL with UTM parameters
                  </div>
                )}
              </div>
              {finalUrl && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Copy URL"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Open URL"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* UTM Parameters Summary */}
          {finalUrl && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                UTM Parameters Summary
              </h4>
              <div className="space-y-2 text-sm">
                {formData.utmSource && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Source:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.utmSource}</span>
                  </div>
                )}
                {formData.utmMedium && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Medium:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.utmMedium}</span>
                  </div>
                )}
                {formData.utmCampaign && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Campaign:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.utmCampaign}</span>
                  </div>
                )}
                {formData.utmTerm && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Term:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.utmTerm}</span>
                  </div>
                )}
                {formData.utmContent && (
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Content:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.utmContent}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Templates */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Quick Templates
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    utmSource: 'google',
                    utmMedium: 'cpc',
                    utmCampaign: 'search-campaign'
                  }));
                }}
                className="text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                Google Ads
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    utmSource: 'facebook',
                    utmMedium: 'social',
                    utmCampaign: 'social-campaign'
                  }));
                }}
                className="text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                Facebook Ads
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    utmSource: 'email',
                    utmMedium: 'email',
                    utmCampaign: 'newsletter'
                  }));
                }}
                className="text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                Email Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UTMGenerator; 