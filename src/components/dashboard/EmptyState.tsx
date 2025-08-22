// src/components/dashboard/EmptyState.tsx
import type React from 'react';
import { ClipboardList } from 'lucide-react';

const EmptyState: React.FC = () => (
  <tr>
    <td colSpan={7} className="px-4 py-16 text-center text-gray-500">
      <div className="flex flex-col items-center">
        <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
        <p className="font-semibold text-lg">Chưa có dữ liệu ứng viên</p>
        <p className="text-sm">Hãy thêm ứng viên đầu tiên để bắt đầu quản lý.</p>
      </div>
    </td>
  </tr>
);

export default EmptyState;