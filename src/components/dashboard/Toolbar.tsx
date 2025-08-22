// src/components/dashboard/Toolbar.tsx
import type React from 'react';
import type { CandidateStatus } from '../../lib/supabase';
import { Search, Plus, X } from 'lucide-react';

interface ToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  statusFilter: CandidateStatus | "";
  onStatusFilterChange: (status: CandidateStatus | "") => void;
  showForm: boolean;
  onToggleForm: () => void;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    searchQuery, onSearchQueryChange, onSearch,
    statusFilter, onStatusFilterChange,
    showForm, onToggleForm
  } = props;

  return (
    <div className="px-4 py-3 border-b border-gray-300 bg-gray-50">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Quản lý ứng viên</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={onSearch}
              className="px-3 py-1.5 bg-gray-600 text-white rounded-r-md hover:bg-gray-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as CandidateStatus | "")}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="New">Mới</option>
            <option value="Interviewing">Phỏng vấn</option>
            <option value="Hired">Đã tuyển</option>
            <option value="Rejected">Từ chối</option>
          </select>

          <button
            onClick={onToggleForm}
            className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? "Hủy" : "Thêm mới"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;