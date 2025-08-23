// src/components/dashboard/CandidateTable.tsx
import type React from 'react';
import type { Candidate, CandidateStatus } from '../../lib/supabase';
import CandidateTableRow from './CandidateTableRow';
import EmptyState from './EmptyState';

interface CandidateTableProps {
  candidates: Candidate[];
  onStatusUpdate: (id: string, status: CandidateStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (candidate: Candidate) => void;
}

const CandidateTable: React.FC<CandidateTableProps> = ({ 
  candidates, 
  onStatusUpdate, 
  onDelete, 
  onEdit 
}) => (
  <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-300">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STT</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Họ và tên</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vị trí</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày ứng tuyển</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CV</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.length === 0 ? (
            <EmptyState />
          ) : (
            candidates.map((candidate, index) => (
              <CandidateTableRow
                key={candidate.id}
                candidate={candidate}
                index={index}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-300">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Tổng cộng: <span className="font-semibold">{candidates.length}</span> ứng viên</span>
      </div>
    </div>
  </div>
);

export default CandidateTable;