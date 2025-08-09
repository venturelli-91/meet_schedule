import React, { useState, useEffect } from 'react';
import { HiCheckCircle, HiExclamationCircle, HiX } from 'react-icons/hi';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5" />;
      case 'error':
      case 'warning':
        return <HiExclamationCircle className="w-5 h-5" />;
      default:
        return <HiCheckCircle className="w-5 h-5" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 border-l-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${getToastStyles()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getIcon()}
          <span className="ml-2 text-sm font-medium">{message}</span>
        </div>
        <button onClick={onClose} className="ml-3 hover:opacity-70 transition-opacity">
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
