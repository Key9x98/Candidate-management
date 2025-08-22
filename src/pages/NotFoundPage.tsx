// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">
      <FileSearch className="w-24 h-24 text-blue-400 mb-6" />
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage