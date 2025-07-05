import React from "react";
import { Card, CardContent } from "./components/ui/card.jsx";
import { Shield, Eye, Lock, Database, Users, Bell } from "lucide-react";

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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              At ANFA Pro, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortening service.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              By using our service, you consent to the data practices described in this policy. We may update this policy from time to time, and we will notify you of any material changes.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
              Information We Collect
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and email address when you create an account</li>
                <li>Profile information and preferences</li>
                <li>Communication preferences and settings</li>
                <li>Payment information (if applicable)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">Usage Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>URLs you shorten and customize</li>
                <li>Click analytics and performance data</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Service usage patterns and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">Technical Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Log files and error reports</li>
                <li>Performance metrics and analytics</li>
                <li>Security and fraud prevention data</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Provision:</strong> To provide and maintain our URL shortening service</li>
                <li><strong>Account Management:</strong> To create and manage your user account</li>
                <li><strong>Analytics:</strong> To provide click tracking and performance insights</li>
                <li><strong>Communication:</strong> To send service updates and respond to inquiries</li>
                <li><strong>Security:</strong> To protect against fraud and ensure service security</li>
                <li><strong>Improvement:</strong> To enhance our service and user experience</li>
                <li><strong>Compliance:</strong> To comply with legal obligations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-red-600 dark:text-red-400" />
              Data Security
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We implement appropriate technical and organizational measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
              <p className="mt-4">
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bell className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              Your Privacy Rights
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at privacy@anfa.pro. We will respond to your request within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">
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