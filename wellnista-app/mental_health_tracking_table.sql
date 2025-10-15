-- Mental Health Tracking Table
-- This table stores mental health records from voice recordings and AI analysis

CREATE TABLE IF NOT EXISTS mental_health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  transcript TEXT NOT NULL,
  mental_score INTEGER NOT NULL CHECK (mental_score >= 0 AND mental_score <= 100),
  mood_category VARCHAR(20) NOT NULL CHECK (mood_category IN ('excellent', 'good', 'fair', 'poor', 'critical')),
  stress_level INTEGER NOT NULL CHECK (stress_level >= 0 AND stress_level <= 100),
  anxiety_level INTEGER NOT NULL CHECK (anxiety_level >= 0 AND anxiety_level <= 100),
  depression_level INTEGER NOT NULL CHECK (depression_level >= 0 AND depression_level <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mental_health_records_user_id ON mental_health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_health_records_date ON mental_health_records(date);
CREATE INDEX IF NOT EXISTS idx_mental_health_records_created_at ON mental_health_records(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_mental_health_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_mental_health_records_updated_at
  BEFORE UPDATE ON mental_health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_mental_health_records_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE mental_health_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own records
CREATE POLICY "Users can view their own mental health records" ON mental_health_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mental health records" ON mental_health_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mental health records" ON mental_health_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mental health records" ON mental_health_records
  FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE mental_health_records IS 'Stores mental health records from voice recordings and AI analysis';
COMMENT ON COLUMN mental_health_records.mental_score IS 'Overall mental health score from 0-100';
COMMENT ON COLUMN mental_health_records.mood_category IS 'Categorized mood: excellent, good, fair, poor, critical';
COMMENT ON COLUMN mental_health_records.stress_level IS 'Stress level from 0-100';
COMMENT ON COLUMN mental_health_records.anxiety_level IS 'Anxiety level from 0-100';
COMMENT ON COLUMN mental_health_records.depression_level IS 'Depression level from 0-100';
COMMENT ON COLUMN mental_health_records.transcript IS 'Voice-to-text transcript of user thoughts';
COMMENT ON COLUMN mental_health_records.notes IS 'Additional user notes (optional)';
