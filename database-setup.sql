-- Database Setup Script for HR Candidate Manager
-- Run this in Supabase SQL Editor

-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    applied_position TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Interviewing', 'Hired', 'Rejected')),
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can only see their own candidates
CREATE POLICY "Users can view own candidates" ON public.candidates
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own candidates
CREATE POLICY "Users can insert own candidates" ON public.candidates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own candidates
CREATE POLICY "Users can update own candidates" ON public.candidates
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own candidates
CREATE POLICY "Users can delete own candidates" ON public.candidates
    FOR DELETE USING (auth.uid() = user_id);

-- Policy bucket resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Policies  storage
CREATE POLICY "Users can upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Users can delete own resumes" ON storage.objects
    FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Create function to update updated_at timestamp    
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_candidates_updated_at ON public.candidates;

CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
