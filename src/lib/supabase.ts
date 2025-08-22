// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database Types
export type Candidate = {
  id: string;
  user_id: string;
  full_name: string;
  applied_position: string;
  status: 'New' | 'Interviewing' | 'Hired' | 'Rejected';
  resume_url?: string;
  created_at: string;
  updated_at?: string;
};

export type CandidateInsert = Omit<Candidate, 'id' | 'created_at' | 'updated_at'>;
export type CandidateUpdate = Partial<Omit<Candidate, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Status constants
export const CANDIDATE_STATUSES = {
  NEW: 'New',
  INTERVIEWING: 'Interviewing',
  HIRED: 'Hired',
  REJECTED: 'Rejected'
};

export type CandidateStatus = 'New' | 'Interviewing' | 'Hired' | 'Rejected';

// Storage constants
export const STORAGE_BUCKETS = {
  RESUMES: 'resumes'
};

// Error types
export class SupabaseError extends Error {
  originalError?: unknown;
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'SupabaseError';
    this.originalError = originalError;
  }
}