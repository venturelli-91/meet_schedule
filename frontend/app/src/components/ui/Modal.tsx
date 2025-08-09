import React from 'react';
import { HiX } from 'react-icons/hi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Mapeamento de tamanhos - criado apenas uma vez
const SIZE_MAP = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const getSizeClasses = () => SIZE_MAP[size] || 'max-w-lg';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${getSizeClasses()} bg-white rounded-lg shadow-xl`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close modal"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
