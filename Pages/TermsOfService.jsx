import React from "react";
import { Shield, FileText, Users, Lock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/card.jsx";
import { Badge } from "../src/components/ui/badge.jsx";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to ANFA Pro ("we," "our," or "us"). These Terms of Service govern your use of our URL shortening service and related features. By accessing or using our service, you agree to be bound by these terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ANFA Pro provides AI-powered URL shortening, analytics, and link management services to help you create, track, and optimize your links.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-600" />
                Service Description
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>Our service includes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>URL shortening and customization</li>
                  <li>Click tracking and analytics</li>
                  <li>QR code generation</li>
                  <li>AI-powered insights and feedback</li>
                  <li>User account management</li>
                  <li>Link performance monitoring</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-purple-600" />
                User Accounts
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the security of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information is up to date</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                Acceptable Use
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>You agree not to use our service to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Distribute malware, viruses, or harmful content</li>
                  <li>Engage in spam or unsolicited communications</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the service's operation</li>
                  <li>Create links to illegal or inappropriate content</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  The service and its original content, features, and functionality are owned by ANFA Pro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of the content you create and the links you generate. We do not claim ownership of your user-generated content.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information.
                </p>
                <p>
                  We collect and process data to provide our services, improve user experience, and ensure security. This includes link analytics, user preferences, and technical information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We strive to provide reliable service but cannot guarantee uninterrupted availability. The service may be temporarily unavailable due to maintenance, updates, or technical issues.
                </p>
                <p>
                  We reserve the right to modify, suspend, or discontinue the service at any time with reasonable notice to users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  To the maximum extent permitted by law, ANFA Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                </p>
                <p>
                  Our total liability to you for any claims arising from the use of our service shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion feature in your dashboard.
                </p>
                <p>
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users or the service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
                </p>
                <p>
                  Your continued use of the service after such modifications constitutes acceptance of the updated terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> support@anfa.pro</p>
                  <p><strong>Website:</strong> https://anfa.pro</p>
                  <p><strong>Response Time:</strong> Within 24-48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 