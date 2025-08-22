// src/components/dashboard/DashboardHeader.tsx
import type React from 'react';
import { Users, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSignOut }) => (
  <header className="bg-white border-b border-gray-300 px-6 py-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">HR Candidate Manager</h1>
          <p className="text-sm text-gray-500">Quản lý hồ sơ ứng viên</p>
        </div>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Đăng xuất</span>
      </button>
    </div>
  </header>
);

export default DashboardHeader;