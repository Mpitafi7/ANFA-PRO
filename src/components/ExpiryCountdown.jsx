import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const ExpiryCountdown = ({ expiresAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        if (onExpired) onExpired();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  if (!expiresAt) return null;

  if (isExpired) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-800 dark:text-red-200">
            This link has expired
          </span>
        </div>
      </div>
    );
  }

  if (!timeLeft) return null;

  const getTimeDisplay = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
    } else if (timeLeft.minutes > 0) {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
    } else {
      return `${timeLeft.seconds}s`;
    }
  };

  const getProgressPercentage = () => {
    const total = new Date(expiresAt).getTime() - new Date().getTime();
    const elapsed = Date.now() - new Date().getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getStatusColor = () => {
    const totalHours = timeLeft.days * 24 + timeLeft.hours;
    if (totalHours < 1) return 'text-red-600 dark:text-red-400';
    if (totalHours < 24) return 'text-orange-600 dark:text-orange-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className={`h-5 w-5 ${getStatusColor()}`} />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Link expires in
            </p>
            <p className={`text-lg font-bold ${getStatusColor()}`}>
              {getTimeDisplay()}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Expiry Date */}
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
        Expires on {new Date(expiresAt).toLocaleDateString()} at {new Date(expiresAt).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default ExpiryCountdown; 