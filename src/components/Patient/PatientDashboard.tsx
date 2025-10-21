import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Diagnosis } from '../../lib/supabase';
import { SymptomChecker } from './SymptomChecker';
import { DiagnosisResult } from './DiagnosisResult';
import { History, Loader2, Plus } from 'lucide-react';

export function PatientDashboard() {
  const { profile } = useAuth();
  const [isCheckingSymptoms, setIsCheckingSymptoms] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Diagnosis | null>(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiagnosisHistory();
  }, []);

  const loadDiagnosisHistory = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiagnosisHistory(data || []);
    } catch (error) {
      console.error('Error loading diagnosis history:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateAIDiagnosis = (symptoms: string, severity: string): Diagnosis => {
    const conditions = [
      {
        disease: 'Common Cold',
        recommendation: 'Rest and stay hydrated. Take over-the-counter medications for symptom relief. Should improve within 7-10 days.',
        severityLevel: 'low' as const,
        requiresDoctor: false,
      },
      {
        disease: 'Seasonal Flu',
        recommendation: 'Get plenty of rest, drink fluids, and consider antiviral medications. Monitor symptoms and seek medical care if they worsen.',
        severityLevel: 'medium' as const,
        requiresDoctor: false,
      },
      {
        disease: 'Possible Infection',
        recommendation: 'Your symptoms suggest a possible infection. Please consult with a doctor for proper examination and potential antibiotic treatment.',
        severityLevel: 'high' as const,
        requiresDoctor: true,
      },
      {
        disease: 'Tension Headache',
        recommendation: 'Rest in a quiet, dark room. Apply cold or warm compress. Stay hydrated and manage stress levels.',
        severityLevel: 'low' as const,
        requiresDoctor: false,
      },
      {
        disease: 'Migraine',
        recommendation: 'Rest in a quiet, dark room. Consider over-the-counter pain relievers. If migraines are frequent, consult a doctor for preventive treatment.',
        severityLevel: 'medium' as const,
        requiresDoctor: severity === 'severe',
      },
    ];

    const condition = severity === 'severe'
      ? conditions[2]
      : conditions[Math.floor(Math.random() * conditions.length)];

    return {
      id: Date.now().toString(),
      symptom_id: '',
      patient_id: profile?.id || '',
      diagnosis_type: 'ai',
      disease_name: condition.disease,
      recommendation: condition.recommendation,
      severity_level: condition.severityLevel,
      requires_doctor: condition.requiresDoctor,
      is_validated: false,
      created_at: new Date().toISOString(),
    };
  };

  const handleSubmitSymptoms = async (symptoms: string, severity: 'mild' | 'moderate' | 'severe') => {
    if (!profile) return;

    try {
      const { data: symptomData, error: symptomError } = await supabase
        .from('symptoms')
        .insert({
          patient_id: profile.id,
          symptoms_text: symptoms,
          severity,
        })
        .select()
        .single();

      if (symptomError) throw symptomError;

      const aiDiagnosis = simulateAIDiagnosis(symptoms, severity);

      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('diagnoses')
        .insert({
          symptom_id: symptomData.id,
          patient_id: profile.id,
          diagnosis_type: 'ai',
          disease_name: aiDiagnosis.disease_name,
          recommendation: aiDiagnosis.recommendation,
          severity_level: aiDiagnosis.severity_level,
          requires_doctor: aiDiagnosis.requires_doctor,
        })
        .select()
        .single();

      if (diagnosisError) throw diagnosisError;

      await supabase.from('notifications').insert({
        user_id: profile.id,
        diagnosis_id: diagnosisData.id,
        message: `Your diagnosis for "${aiDiagnosis.disease_name}" is ready.`,
      });

      setCurrentDiagnosis(diagnosisData);
      setIsCheckingSymptoms(false);
      loadDiagnosisHistory();
    } catch (error) {
      console.error('Error submitting symptoms:', error);
    }
  };

  const handleFeedback = async (rating: number, comment: string) => {
    if (!profile || !currentDiagnosis) return;

    try {
      await supabase.from('feedback').insert({
        diagnosis_id: currentDiagnosis.id,
        patient_id: profile.id,
        rating,
        comment,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleNewCheck = () => {
    setCurrentDiagnosis(null);
    setIsCheckingSymptoms(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {profile?.full_name}
          </h1>
          <p className="text-gray-600">
            Describe your symptoms to get an AI-powered diagnosis
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isCheckingSymptoms && !currentDiagnosis && (
              <SymptomChecker onSubmitSymptoms={handleSubmitSymptoms} />
            )}

            {currentDiagnosis && (
              <div className="space-y-4">
                <DiagnosisResult
                  diagnosis={currentDiagnosis}
                  onFeedback={handleFeedback}
                />
                <button
                  onClick={handleNewCheck}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Symptom Check
                </button>
              </div>
            )}

            {!isCheckingSymptoms && !currentDiagnosis && (
              <button
                onClick={() => setIsCheckingSymptoms(true)}
                className="w-full bg-white rounded-2xl shadow-lg p-12 hover:shadow-xl transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500"
              >
                <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700">
                  Start New Symptom Check
                </p>
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <History className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">History</h2>
              </div>
              <div className="space-y-3">
                {diagnosisHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm">No diagnosis history yet</p>
                ) : (
                  diagnosisHistory.slice(0, 5).map((diagnosis) => (
                    <button
                      key={diagnosis.id}
                      onClick={() => setCurrentDiagnosis(diagnosis)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {diagnosis.disease_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(diagnosis.created_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
