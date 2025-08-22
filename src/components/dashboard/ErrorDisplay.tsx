// src/components/dashboard/ErrorDisplay.tsx
import type React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  onClearError: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClearError }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
        <span className="text-red-800 text-sm">{error}</span>
        <button
          onClick={onClearError}
          className="ml-auto text-red-500 hover:text-red-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;