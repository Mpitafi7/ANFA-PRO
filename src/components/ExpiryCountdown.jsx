import React, { useEffect, useState } from 'react';

function getTimeLeft(targetDate) {
  const now = new Date();
  const diff = new Date(targetDate) - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function ExpiryCountdown({ target, label = 'Expires in', onExpire, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => {
      const left = getTimeLeft(target);
      setTimeLeft(left);
      if (!left && onExpire) onExpire();
    }, 1000);
    return () => clearInterval(interval);
  }, [target, onExpire]);

  if (!target) return null;
  if (!timeLeft) return (
    <span className={`text-xs font-semibold text-red-600 ${className}`}>Expired</span>
  );

  const { days, hours, minutes, seconds } = timeLeft;
  return (
    <span className={`text-xs font-semibold text-blue-600 ${className}`}>
      {label}: {days > 0 && `${days}d `}{hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m `}{seconds}s
    </span>
  );
} 