-- BMI Tracking Table
-- This table stores user's weight, height, waist measurements and calculated BMI
-- Connected to the existing users table via user_id

CREATE TABLE IF NOT EXISTS bmi_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  weight DECIMAL(5,2), -- Weight in kg (e.g., 70.5)
  height DECIMAL(5,2), -- Height in cm (e.g., 170.5)
  waist DECIMAL(5,2),  -- Waist circumference in cm (e.g., 85.0)
  bmi DECIMAL(4,2),    -- Calculated BMI (e.g., 24.3)
  bmi_category VARCHAR(20), -- Underweight, Normal, Overweight, Obese
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bmi_records_user_id ON bmi_records(user_id);
CREATE INDEX IF NOT EXISTS idx_bmi_records_date ON bmi_records(date);
CREATE INDEX IF NOT EXISTS idx_bmi_records_user_date ON bmi_records(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE bmi_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own BMI records
CREATE POLICY "Users can view own bmi_records" ON bmi_records
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own BMI records
CREATE POLICY "Users can insert own bmi_records" ON bmi_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own BMI records
CREATE POLICY "Users can update own bmi_records" ON bmi_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own BMI records
CREATE POLICY "Users can delete own bmi_records" ON bmi_records
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically calculate BMI when weight and height are provided
CREATE OR REPLACE FUNCTION calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate BMI if both weight and height are provided
  IF NEW.weight IS NOT NULL AND NEW.height IS NOT NULL AND NEW.height > 0 THEN
    -- BMI = weight(kg) / (height(m))^2
    -- Convert height from cm to m
    NEW.bmi = NEW.weight / ((NEW.height / 100) * (NEW.height / 100));
    
    -- Determine BMI category
    IF NEW.bmi < 18.5 THEN
      NEW.bmi_category = 'Underweight';
    ELSIF NEW.bmi >= 18.5 AND NEW.bmi < 25 THEN
      NEW.bmi_category = 'Normal';
    ELSIF NEW.bmi >= 25 AND NEW.bmi < 30 THEN
      NEW.bmi_category = 'Overweight';
    ELSE
      NEW.bmi_category = 'Obese';
    END IF;
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate BMI on insert or update
CREATE TRIGGER trigger_calculate_bmi
  BEFORE INSERT OR UPDATE ON bmi_records
  FOR EACH ROW
  EXECUTE FUNCTION calculate_bmi();

-- Add comments for documentation
COMMENT ON TABLE bmi_records IS 'Stores user BMI tracking data including weight, height, waist, and calculated BMI';
COMMENT ON COLUMN bmi_records.weight IS 'Weight in kilograms';
COMMENT ON COLUMN bmi_records.height IS 'Height in centimeters';
COMMENT ON COLUMN bmi_records.waist IS 'Waist circumference in centimeters';
COMMENT ON COLUMN bmi_records.bmi IS 'Calculated BMI (Body Mass Index)';
COMMENT ON COLUMN bmi_records.bmi_category IS 'BMI category: Underweight, Normal, Overweight, Obese';
