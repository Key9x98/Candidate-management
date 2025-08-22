// src/components/dashboard/CandidateForm.tsx
import type React from 'react';
import { Save } from 'lucide-react';

interface CandidateFormProps {
  fullName: string;
  onFullNameChange: (name: string) => void;
  position: string;
  onPositionChange: (position: string) => void;
  onResumeFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = (props) => {
  const {
    fullName, onFullNameChange,
    position, onPositionChange,
    onResumeFileChange,
    onSubmit, submitting
  } = props;

  return (
    <div className="px-4 py-4 border-b border-gray-300 bg-blue-50">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Họ và tên *</label>
          <input
            type="text"
            placeholder="VD: Nguyễn Văn A"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Vị trí ứng tuyển *</label>
          <input
            type="text"
            placeholder="VD: Frontend Developer"
            value={position}
            onChange={(e) => onPositionChange(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Tải lên CV (PDF) *</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => onResumeFileChange(e.target.files?.[0] || null)}
            required
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? "Đang lưu..." : "Lưu ứng viên"}</span>
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;