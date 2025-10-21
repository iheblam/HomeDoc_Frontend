import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  specialization?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Symptom {
  id: string;
  patient_id: string;
  symptoms_text: string;
  severity: 'mild' | 'moderate' | 'severe';
  created_at: string;
}

export interface Diagnosis {
  id: string;
  symptom_id: string;
  patient_id: string;
  doctor_id?: string;
  diagnosis_type: 'ai' | 'manual';
  disease_name: string;
  recommendation: string;
  severity_level: 'low' | 'medium' | 'high';
  requires_doctor: boolean;
  is_validated: boolean;
  validated_at?: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  diagnosis_id: string;
  patient_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  diagnosis_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
