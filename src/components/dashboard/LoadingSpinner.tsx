// src/components/dashboard/LoadingSpinner.tsx
import type React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Đang tải...</p>
    </div>
  </div>
);

export default LoadingSpinner;