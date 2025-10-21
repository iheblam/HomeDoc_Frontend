/*
  # HomeDoc Medical Diagnostic Platform Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `role` (text: 'patient', 'doctor', 'admin')
      - `specialization` (text, nullable - for doctors)
      - `phone` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `symptoms`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references user_profiles)
      - `symptoms_text` (text)
      - `severity` (text: 'mild', 'moderate', 'severe')
      - `created_at` (timestamptz)
    
    - `diagnoses`
      - `id` (uuid, primary key)
      - `symptom_id` (uuid, references symptoms)
      - `patient_id` (uuid, references user_profiles)
      - `doctor_id` (uuid, nullable, references user_profiles)
      - `diagnosis_type` (text: 'ai', 'manual')
      - `disease_name` (text)
      - `recommendation` (text)
      - `severity_level` (text: 'low', 'medium', 'high')
      - `requires_doctor` (boolean)
      - `is_validated` (boolean, default false)
      - `validated_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
    
    - `feedback`
      - `id` (uuid, primary key)
      - `diagnosis_id` (uuid, references diagnoses)
      - `patient_id` (uuid, references user_profiles)
      - `rating` (integer, 1-5)
      - `comment` (text, nullable)
      - `created_at` (timestamptz)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `diagnosis_id` (uuid, nullable, references diagnoses)
      - `message` (text)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for each user role with appropriate permissions
    - Patients can only access their own data
    - Doctors can view diagnoses and validate AI predictions
    - Admins have full access to statistics and user management
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  specialization text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  symptoms_text text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  created_at timestamptz DEFAULT now()
);

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_id uuid NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  diagnosis_type text NOT NULL CHECK (diagnosis_type IN ('ai', 'manual')),
  disease_name text NOT NULL,
  recommendation text NOT NULL,
  severity_level text NOT NULL CHECK (severity_level IN ('low', 'medium', 'high')),
  requires_doctor boolean DEFAULT false,
  is_validated boolean DEFAULT false,
  validated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id uuid NOT NULL REFERENCES diagnoses(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  diagnosis_id uuid REFERENCES diagnoses(id) ON DELETE SET NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Symptoms Policies
CREATE POLICY "Patients can view own symptoms"
  ON symptoms FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert own symptoms"
  ON symptoms FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can view all symptoms"
  ON symptoms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('doctor', 'admin')
    )
  );

-- Diagnoses Policies
CREATE POLICY "Patients can view own diagnoses"
  ON diagnoses FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view all diagnoses"
  ON diagnoses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('doctor', 'admin')
    )
  );

CREATE POLICY "System can insert diagnoses"
  ON diagnoses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Doctors can update diagnoses"
  ON diagnoses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('doctor', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('doctor', 'admin')
    )
  );

-- Feedback Policies
CREATE POLICY "Patients can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert own feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors and admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('doctor', 'admin')
    )
  );

-- Notifications Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_symptoms_patient_id ON symptoms(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_patient_id ON diagnoses(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_doctor_id ON diagnoses(doctor_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_created_at ON diagnoses(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_diagnosis_id ON feedback(diagnosis_id);