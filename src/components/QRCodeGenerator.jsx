import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { Download, Copy, Settings, QrCode, BarChart3, Palette, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';

const QRCodeGenerator = ({ url, onClose }) => {
  // Temporary disable for testing
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">QR Code Generator</h2>
          <p className="text-gray-600 mb-4">Feature temporarily disabled for testing.</p>
          <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
  const [qrCodeData, setQrCodeData] = useState(url || '');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    size: 256,
    foreground: '#000000',
    background: '#FFFFFF',
    errorCorrectionLevel: 'M',
    margin: 4,
    includeMargin: true
  });
  const [barcodeType, setBarcodeType] = useState('qr'); // qr, code128, code39
  const [showPreview, setShowPreview] = useState(true);
  const canvasRef = useRef(null);

  // Generate QR Code or Barcode
  const generateCode = async () => {
    if (!qrCodeData.trim()) return;
    
    setIsLoading(true);
    try {
      if (barcodeType === 'qr') {
      const options = {
          width: settings.size,
          margin: settings.margin,
        color: {
            dark: settings.foreground,
            light: settings.background
          },
          errorCorrectionLevel: settings.errorCorrectionLevel
        };

        const dataUrl = await QRCode.toDataURL(qrCodeData, options);
        setQrCodeUrl(dataUrl);
      } else {
        // Generate 1D barcode
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = settings.size;
        canvas.height = settings.size / 3; // Barcode height
        
        // Clear canvas
        ctx.fillStyle = settings.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Generate barcode
        JsBarcode(canvas, qrCodeData, {
          format: barcodeType === 'code128' ? 'CODE128' : 'CODE39',
          width: 2,
          height: canvas.height - 20,
          displayValue: true,
          fontSize: 14,
          margin: 10,
          background: settings.background,
          lineColor: settings.foreground
        });
        
        const dataUrl = canvas.toDataURL('image/png');
        setQrCodeUrl(dataUrl);
      }
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Download Code
  const downloadCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    const extension = barcodeType === 'qr' ? 'png' : 'png';
    const typeName = barcodeType === 'qr' ? 'qr-code' : `${barcodeType}-barcode`;
    link.download = `${typeName}-${Date.now()}.${extension}`;
    link.href = qrCodeUrl;
    link.click();
  };

  // Copy Code to clipboard
  const copyCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      // Show success message
      const typeName = barcodeType === 'qr' ? 'QR Code' : `${barcodeType.toUpperCase()} Barcode`;
      alert(`${typeName} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Generate on component mount and when data changes
  useEffect(() => {
    if (qrCodeData.trim()) {
      generateCode();
    }
  }, [qrCodeData, settings, barcodeType]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">QR & Barcode Generator</h2>
              <p className="text-sm text-gray-600">Create custom QR codes, Code 128, and Code 39 barcodes</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
              </Button>
            </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
              <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter URL or Text
              </label>
              <Input
                value={qrCodeData}
                onChange={(e) => setQrCodeData(e.target.value)}
                placeholder="https://example.com or any text..."
                className="w-full"
              />
                </div>
                
            {/* Barcode Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode Type
              </label>
              <div className="flex space-x-2">
                  <Button
                  onClick={() => setBarcodeType('qr')}
                  variant={barcodeType === 'qr' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                  </Button>
                  <Button
                  onClick={() => setBarcodeType('code128')}
                  variant={barcodeType === 'code128' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Code 128</span>
                  </Button>
                <Button
                  onClick={() => setBarcodeType('code39')}
                  variant={barcodeType === 'code39' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Code 39</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Settings Toggle */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Customize</span>
            </Button>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-800">Customization Options</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (px)
                  </label>
                  <Input
                    type="number"
                    value={settings.size}
                    onChange={(e) => setSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                    min="128"
                    max="1024"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margin
                  </label>
                  <Input
                    type="number"
                    value={settings.margin}
                    onChange={(e) => setSettings(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                    min="0"
                    max="10"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foreground Color
              </label>
                  <div className="flex items-center space-x-2">
                <input
                  type="color"
                      value={settings.foreground}
                      onChange={(e) => setSettings(prev => ({ ...prev, foreground: e.target.value }))}
                      className="w-10 h-10 rounded border"
                />
                <Input
                      value={settings.foreground}
                      onChange={(e) => setSettings(prev => ({ ...prev, foreground: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
              </label>
                  <div className="flex items-center space-x-2">
                <input
                  type="color"
                      value={settings.background}
                      onChange={(e) => setSettings(prev => ({ ...prev, background: e.target.value }))}
                      className="w-10 h-10 rounded border"
                />
                <Input
                      value={settings.background}
                      onChange={(e) => setSettings(prev => ({ ...prev, background: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Correction Level
              </label>
              <select
                  value={settings.errorCorrectionLevel}
                  onChange={(e) => setSettings(prev => ({ ...prev, errorCorrectionLevel: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Preview</h3>
                <div className="flex space-x-2">
                                  <Button
                  onClick={downloadCode}
                  disabled={!qrCodeUrl || isLoading}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={copyCode}
                  disabled={!qrCodeUrl || isLoading}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
            </div>
          </div>

              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  {isLoading ? (
                    <div className="w-64 h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt={`Generated ${barcodeType === 'qr' ? 'QR Code' : `${barcodeType.toUpperCase()} Barcode`}`}
                      className={`max-w-full h-auto ${barcodeType !== 'qr' ? 'max-h-32' : ''}`}
                      ref={canvasRef}
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 mx-auto mb-2" />
                        <p>Enter text to generate {barcodeType === 'qr' ? 'QR code' : 'barcode'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
          </div>
    </div>
  );
};

export default QRCodeGenerator; 