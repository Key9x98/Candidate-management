-- Database Setup Script for HR Candidate Manager
-- Run this in Supabase SQL Editor

-- 1. Create candidates table
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

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON public.candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON public.candidates(created_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
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

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger to automatically update updated_at
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON public.candidates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Grant necessary permissions
GRANT ALL ON public.candidates TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
