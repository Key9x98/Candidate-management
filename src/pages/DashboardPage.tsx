// src/app/dashboard/page.tsx
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { CandidateService } from "../lib/candidateService" // Assuming paths
import { useAuth } from "../contexts/AuthContext" // Assuming paths
import type { Candidate, CandidateStatus } from "../lib/supabase" // Assuming paths

// Import the new components
import ErrorDisplay from "../components/dashboard/ErrorDisplay"
import Toolbar from "../components/dashboard/Toolbar"
import CandidateForm from "../components/dashboard/CandidateForm"
import CandidateTable from "../components/dashboard/CandidateTable"
import LoadingSpinner from "../components/dashboard/LoadingSpinner"
import DashboardHeader from "../components/dashboard/DashboardHeader"
import EditCandidateModal from "../components/dashboard/EditCandidateModal"

const DashboardPage: React.FC = () => {
  const { signOut, user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Edit modal states
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch candidates function
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CandidateService.fetchCandidates();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup realtime subscription
  useEffect(() => {
    if (!user) return;
    fetchCandidates();
    const subscription = CandidateService.setupRealtimeSubscription((_payload) => {
      fetchCandidates();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchCandidates]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      let resumeUrl: string | undefined;
      if (resumeFile) {
        resumeUrl = await CandidateService.uploadResume(resumeFile, user.id);
      }
      await CandidateService.addCandidate({
        user_id: user.id,
        full_name: fullName,
        applied_position: position,
        status: 'New',
        resume_url: resumeUrl,
      });
      setFullName("");
      setPosition("");
      setResumeFile(null);
      setShowForm(false);
      alert("Ứng viên đã được thêm thành công!");
    } catch (err: any) {
      setError(err.message || 'Failed to add candidate');
    } finally {
      setSubmitting(false);
      fetchCandidates();
    }
  };

  // Handle status update
  const handleStatusUpdate = async (candidateId: string, newStatus: CandidateStatus) => {
    try {
      setError(null);
      const current = candidates.find(c => c.id === candidateId);
      if (current && current.status === newStatus) return;
      await CandidateService.updateCandidateStatus(candidateId, newStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
    finally{
      fetchCandidates(); // Refetch as a fallback
    }
  };

  // Handle candidate deletion
  const handleDeleteCandidate = async (candidateId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ứng viên này?')) return;
    try {
      setError(null);
      await CandidateService.deleteCandidate(candidateId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete candidate');
    }
    finally{
      fetchCandidates(); // Refetch as a fallback
    }
  };

  // Handle candidate edit
  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowEditModal(true);
  };

  // Handle candidate update
  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(prev => 
      prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c)
    );
    setShowEditModal(false);
    setEditingCandidate(null);
  };

  // Handle search
 const handleSearch = async () => {
  if (!searchQuery.trim()) {
    fetchCandidates();
    return;
  }
  try {
    setLoading(true);
    setError(null);
    const results = await CandidateService.searchCandidates(searchQuery);
    setCandidates(results);
  } catch (err: any) {
    setError(err.message || 'Search failed');
  } finally {
    setLoading(false);
  }
};

  // Filter candidates by status
  const filteredCandidates = statusFilter
    ? candidates.filter(c => c.status === statusFilter)
    : candidates;

  if (loading && candidates.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader onSignOut={signOut} />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <ErrorDisplay error={error} onClearError={() => setError(null)} />
        
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm mb-6">
          <Toolbar 
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            showForm={showForm}
            onToggleForm={() => setShowForm(!showForm)}
          />

          {showForm && (
            <CandidateForm 
              fullName={fullName}
              onFullNameChange={setFullName}
              position={position}
              onPositionChange={setPosition}
              onResumeFileChange={setResumeFile}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        <CandidateTable 
          candidates={filteredCandidates}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteCandidate}
          onEdit={handleEditCandidate}
        />

        {/* Edit Candidate Modal */}
        {editingCandidate && (
          <EditCandidateModal
            candidate={editingCandidate}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingCandidate(null);
            }}
            onUpdate={handleUpdateCandidate}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;