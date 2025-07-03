import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Download, 
  Palette, 
  Settings, 
  Eye, 
  EyeOff,
  RefreshCw,
  Copy,
  Share2
} from 'lucide-react';

const QRCodeGenerator = ({ url, onDownload }) => {
  const [qrCodeData, setQrCodeData] = useState(url || '');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
  // QR Code styling options
  const [qrOptions, setQrOptions] = useState({
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M',
    rendererOpts: {
      quality: 0.92
    }
  });

  // Custom design options
  const [designOptions, setDesignOptions] = useState({
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    cornerSquareColor: '#3B82F6',
    cornerDotColor: '#3B82F6',
    logo: null,
    logoSize: 0.2,
    logoBackgroundColor: '#FFFFFF',
    logoBackgroundRadius: 0.5,
    dotsStyle: 'dots',
    cornersSquareStyle: 'dot',
    cornersDotStyle: 'dot',
  });

  // Generate QR Code
  const generateQRCode = async () => {
    if (!qrCodeData.trim()) return;
    
    setIsGenerating(true);
    try {
      const options = {
        ...qrOptions,
        color: {
          dark: designOptions.foregroundColor,
          light: designOptions.backgroundColor
        },
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        rendererOpts: qrOptions.rendererOpts
      };

      const qrDataURL = await QRCode.toDataURL(qrCodeData, options);
      setQrCodeImage(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download QR Code
  const downloadQRCode = () => {
    if (!qrCodeImage) return;
    
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (onDownload) onDownload(qrCodeImage);
  };

  // Copy QR Code to clipboard
  const copyQRCode = async () => {
    if (!qrCodeImage) return;
    
    try {
      const response = await fetch(qrCodeImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    } catch (error) {
      console.error('Error copying QR code:', error);
    }
  };

  // Share QR Code
  const shareQRCode = async () => {
    if (!qrCodeImage || !navigator.share) return;
    
    try {
      const response = await fetch(qrCodeImage);
      const blob = await response.blob();
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'QR Code',
        text: 'Check out this QR code!',
        files: [file]
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  // Update design option
  const updateDesignOption = (key, value) => {
    setDesignOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Preset designs
  const presetDesigns = [
    {
      name: 'Classic',
      colors: { backgroundColor: '#FFFFFF', foregroundColor: '#000000' }
    },
    {
      name: 'Blue Theme',
      colors: { backgroundColor: '#FFFFFF', foregroundColor: '#3B82F6' }
    },
    {
      name: 'Dark Mode',
      colors: { backgroundColor: '#1F2937', foregroundColor: '#FFFFFF' }
    },
    {
      name: 'Green Theme',
      colors: { backgroundColor: '#FFFFFF', foregroundColor: '#10B981' }
    },
    {
      name: 'Purple Theme',
      colors: { backgroundColor: '#FFFFFF', foregroundColor: '#8B5CF6' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* QR Code Input */}
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              URL or Text
            </label>
            <Input
              type="text"
              placeholder="Enter URL or text to generate QR code..."
              value={qrCodeData}
              onChange={(e) => setQrCodeData(e.target.value)}
              className="h-12"
            />
          </div>
          
          <Button
            onClick={generateQRCode}
            disabled={!qrCodeData.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </div>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Preview */}
      {qrCodeImage && (
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                QR Code Preview
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showPreview && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={copyQRCode}
                    variant="outline"
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    onClick={shareQRCode}
                    variant="outline"
                    className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Design Options */}
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Customize Design
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Designs */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {presetDesigns.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDesignOptions(prev => ({
                      ...prev,
                      ...preset.colors
                    }));
                  }}
                  className="text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={designOptions.backgroundColor}
                  onChange={(e) => updateDesignOption('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                />
                <Input
                  value={designOptions.backgroundColor}
                  onChange={(e) => updateDesignOption('backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={designOptions.foregroundColor}
                  onChange={(e) => updateDesignOption('foregroundColor', e.target.value)}
                  className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                />
                <Input
                  value={designOptions.foregroundColor}
                  onChange={(e) => updateDesignOption('foregroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* QR Code Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Size (px)
              </label>
              <Input
                type="number"
                min="100"
                max="1000"
                value={qrOptions.width}
                onChange={(e) => setQrOptions(prev => ({
                  ...prev,
                  width: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Error Correction
              </label>
              <select
                value={qrOptions.errorCorrectionLevel}
                onChange={(e) => setQrOptions(prev => ({
                  ...prev,
                  errorCorrectionLevel: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
          </div>

          {/* Margin */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Margin
            </label>
            <Input
              type="number"
              min="0"
              max="10"
              value={qrOptions.margin}
              onChange={(e) => setQrOptions(prev => ({
                ...prev,
                margin: parseInt(e.target.value)
              }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator; 