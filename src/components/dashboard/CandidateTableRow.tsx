// src/components/dashboard/CandidateTableRow.tsx
import type React from 'react';
import type { Candidate, CandidateStatus } from '../../lib/supabase';
import { Eye, Edit3, Trash2 } from 'lucide-react';

interface CandidateTableRowProps {
  candidate: Candidate;
  index: number;
  onStatusUpdate: (id: string, status: CandidateStatus) => void;
  onDelete: (id: string) => void;
}

const CandidateTableRow: React.FC<CandidateTableRowProps> = ({ candidate, index, onStatusUpdate, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-4 py-3 text-sm text-gray-600 font-medium">{index + 1}</td>
    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{candidate.full_name}</td>
    <td className="px-4 py-3 text-sm text-gray-800">{candidate.applied_position}</td>
    <td className="px-4 py-3 text-sm text-gray-800">{new Date(candidate.created_at).toLocaleDateString('vi-VN')}</td>
    <td className="px-4 py-3 text-sm">
      <select
        value={candidate.status}
        onChange={(e) => onStatusUpdate(candidate.id, e.target.value as CandidateStatus)}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="New">Mới</option>
        <option value="Interviewing">Phỏng vấn</option>
        <option value="Hired">Đã tuyển</option>
        <option value="Rejected">Từ chối</option>
      </select>
    </td>
    <td className="px-4 py-3 text-sm">
      {candidate.resume_url ? (
        <div className="flex space-x-2">
          <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
            <Eye className="w-3 h-3" /> <span>Xem</span>
          </a>
        </div>
      ) : (
        <span className="text-gray-400 text-xs italic">Chưa có</span>
      )}
    </td>
    <td className="px-4 py-3 text-sm">
      <div className="flex space-x-2">
        <button
          onClick={() => alert("Tính năng sửa đang được phát triển!")}
          className="p-1.5 text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(candidate.id)}
          className="p-1.5 text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

export default CandidateTableRow;