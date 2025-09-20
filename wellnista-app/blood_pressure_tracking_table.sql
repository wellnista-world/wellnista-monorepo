-- Blood Pressure Tracking Table
-- This table stores user's blood pressure measurements and pulse
-- Connected to the existing users table via user_id

CREATE TABLE IF NOT EXISTS blood_pressure_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  systolic INTEGER, -- Systolic blood pressure (mmHg)
  diastolic INTEGER, -- Diastolic blood pressure (mmHg)
  pulse INTEGER, -- Pulse rate (bpm)
  bp_category VARCHAR(20), -- Normal, Elevated, Stage1, Stage2, Crisis
  notes TEXT, -- Optional notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blood_pressure_records_user_id ON blood_pressure_records(user_id);
CREATE INDEX IF NOT EXISTS idx_blood_pressure_records_date ON blood_pressure_records(date);
CREATE INDEX IF NOT EXISTS idx_blood_pressure_records_user_date ON blood_pressure_records(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE blood_pressure_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own blood pressure records
CREATE POLICY "Users can view own blood_pressure_records" ON blood_pressure_records
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own blood pressure records
CREATE POLICY "Users can insert own blood_pressure_records" ON blood_pressure_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own blood pressure records
CREATE POLICY "Users can update own blood_pressure_records" ON blood_pressure_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own blood pressure records
CREATE POLICY "Users can delete own blood_pressure_records" ON blood_pressure_records
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically categorize blood pressure when systolic and diastolic are provided
CREATE OR REPLACE FUNCTION categorize_blood_pressure()
RETURNS TRIGGER AS $$
BEGIN
  -- Categorize blood pressure if both systolic and diastolic are provided
  IF NEW.systolic IS NOT NULL AND NEW.diastolic IS NOT NULL THEN
    -- Normal: < 120/80
    IF NEW.systolic < 120 AND NEW.diastolic < 80 THEN
      NEW.bp_category = 'Normal';
    -- Elevated: 120-129/< 80
    ELSIF NEW.systolic >= 120 AND NEW.systolic < 130 AND NEW.diastolic < 80 THEN
      NEW.bp_category = 'Elevated';
    -- Stage 1: 130-139/80-89
    ELSIF (NEW.systolic >= 130 AND NEW.systolic < 140) OR (NEW.diastolic >= 80 AND NEW.diastolic < 90) THEN
      NEW.bp_category = 'Stage1';
    -- Stage 2: >= 140/>= 90
    ELSIF NEW.systolic >= 140 OR NEW.diastolic >= 90 THEN
      NEW.bp_category = 'Stage2';
    -- Crisis: > 180/120
    ELSIF NEW.systolic > 180 OR NEW.diastolic > 120 THEN
      NEW.bp_category = 'Crisis';
    END IF;
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically categorize blood pressure on insert or update
CREATE TRIGGER trigger_categorize_blood_pressure
  BEFORE INSERT OR UPDATE ON blood_pressure_records
  FOR EACH ROW
  EXECUTE FUNCTION categorize_blood_pressure();

-- Add comments for documentation
COMMENT ON TABLE blood_pressure_records IS 'Stores user blood pressure tracking data including systolic, diastolic, pulse, and automatic categorization';
COMMENT ON COLUMN blood_pressure_records.systolic IS 'Systolic blood pressure in mmHg';
COMMENT ON COLUMN blood_pressure_records.diastolic IS 'Diastolic blood pressure in mmHg';
COMMENT ON COLUMN blood_pressure_records.pulse IS 'Pulse rate in beats per minute (bpm)';
COMMENT ON COLUMN blood_pressure_records.bp_category IS 'Blood pressure category: Normal, Elevated, Stage1, Stage2, Crisis';
COMMENT ON COLUMN blood_pressure_records.notes IS 'Optional notes about the measurement';
