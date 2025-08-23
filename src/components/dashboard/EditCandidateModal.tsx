import React, { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import type { Candidate } from '../../lib/supabase';
import { CandidateService } from '../../lib/candidateService';

interface EditCandidateModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCandidate: Candidate) => void;
}

const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    full_name: candidate.full_name,
    applied_position: candidate.applied_position,
    created_at: candidate.created_at.split('T')[0], // Format for date input
    resume_file: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResumeName, setCurrentResumeName] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: candidate.full_name,
        applied_position: candidate.applied_position,
        created_at: candidate.created_at.split('T')[0],
        resume_file: null
      });
      setError(null);
      
      // Extract filename from current resume URL
      if (candidate.resume_url) {
        const url = new URL(candidate.resume_url);
        const pathParts = url.pathname.split('/');
        setCurrentResumeName(pathParts[pathParts.length - 1]);
      } else {
        setCurrentResumeName(null);
      }
    }
  }, [isOpen, candidate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      resume_file: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedCandidate = await CandidateService.updateCandidate(candidate.id, {
        full_name: formData.full_name,
        applied_position: formData.applied_position,
        created_at: new Date(formData.created_at).toISOString(),
        resume_file: formData.resume_file
      });

      onUpdate(updatedCandidate);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật ứng viên');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Sửa thông tin ứng viên</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Applied Position */}
          <div>
            <label htmlFor="applied_position" className="block text-sm font-medium text-gray-700 mb-2">
              Vị trí ứng tuyển *
            </label>
            <input
              type="text"
              id="applied_position"
              name="applied_position"
              value={formData.applied_position}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Application Date */}
          <div>
            <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-2">
              Ngày ứng tuyển *
            </label>
            <input
              type="date"
              id="created_at"
              name="created_at"
              value={formData.created_at}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Resume File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV (PDF)
            </label>
            
            {/* Current Resume Display */}
            {currentResumeName && (
              <div className="mb-3 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">CV hiện tại: {currentResumeName}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ upload file mới nếu muốn thay thế CV hiện tại
                </p>
              </div>
            )}

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume_file"
              />
              <label htmlFor="resume_file" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {formData.resume_file 
                    ? formData.resume_file.name 
                    : 'Click để chọn file PDF mới'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ hỗ trợ file PDF, tối đa 10MB
                </p>
              </label>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCandidateModal;
