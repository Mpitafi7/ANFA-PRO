import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./src/components/ui/card.jsx";
import { Shield, FileText, Lock, Eye } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your privacy is important to us at ANFA Pro
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              Privacy Policy Coming Soon
            </h2>
            <p className="text-blue-800 dark:text-blue-200 text-lg">
              We're currently preparing our comprehensive privacy policy. 
              It will be available here shortly with detailed information about 
              how we collect, use, and protect your data.
            </p>
          </CardContent>
        </Card>

        {/* Placeholder Sections */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Information about how we secure and protect your personal data will be detailed here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Details about what data we collect and how we use it will be explained here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Information about your rights regarding your personal data will be outlined here.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            If you have any questions about our privacy practices, please contact us at{" "}
            <a href="mailto:privacy@anfa.pro" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              privacy@anfa.pro
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}