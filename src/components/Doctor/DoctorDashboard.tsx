import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Diagnosis } from '../../lib/supabase';
import { CheckCircle, Clock, Stethoscope, AlertTriangle, Loader2 } from 'lucide-react';

interface DiagnosisWithPatient extends Diagnosis {
  patient_name?: string;
  symptoms_text?: string;
}

export function DoctorDashboard() {
  const { profile } = useAuth();
  const [diagnoses, setDiagnoses] = useState<DiagnosisWithPatient[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisWithPatient | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('pending');
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    loadDiagnoses();
  }, [filter]);

  const loadDiagnoses = async () => {
    try {
      let query = supabase
        .from('diagnoses')
        .select(`
          *,
          user_profiles!diagnoses_patient_id_fkey(full_name),
          symptoms(symptoms_text)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('is_validated', false);
      } else if (filter === 'validated') {
        query = query.eq('is_validated', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData: DiagnosisWithPatient[] = (data || []).map((item: any) => ({
        ...item,
        patient_name: item.user_profiles?.full_name,
        symptoms_text: item.symptoms?.[0]?.symptoms_text,
      }));

      setDiagnoses(formattedData);
    } catch (error) {
      console.error('Error loading diagnoses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (diagnosisId: string) => {
    if (!profile) return;

    setValidating(true);
    try {
      const { error } = await supabase
        .from('diagnoses')
        .update({
          is_validated: true,
          validated_at: new Date().toISOString(),
          doctor_id: profile.id,
        })
        .eq('id', diagnosisId);

      if (error) throw error;

      await loadDiagnoses();
      setSelectedDiagnosis(null);
    } catch (error) {
      console.error('Error validating diagnosis:', error);
    } finally {
      setValidating(false);
    }
  };

  const handleAddManualDiagnosis = async (
    patientId: string,
    symptomId: string,
    disease: string,
    recommendation: string,
    severity: 'low' | 'medium' | 'high',
    requiresDoctor: boolean
  ) => {
    if (!profile) return;

    try {
      const { error } = await supabase.from('diagnoses').insert({
        symptom_id: symptomId,
        patient_id: patientId,
        doctor_id: profile.id,
        diagnosis_type: 'manual',
        disease_name: disease,
        recommendation,
        severity_level: severity,
        requires_doctor: requiresDoctor,
        is_validated: true,
        validated_at: new Date().toISOString(),
      });

      if (error) throw error;

      await loadDiagnoses();
      setSelectedDiagnosis(null);
    } catch (error) {
      console.error('Error adding manual diagnosis:', error);
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const stats = {
    total: diagnoses.length,
    pending: diagnoses.filter((d) => !d.is_validated).length,
    validated: diagnoses.filter((d) => d.is_validated).length,
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600">
            Review and validate AI-generated diagnoses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Diagnoses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.validated}</p>
                <p className="text-sm text-gray-600">Validated</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('validated')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'validated'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Validated ({stats.validated})
            </button>
          </div>

          <div className="space-y-4">
            {diagnoses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No diagnoses found</p>
            ) : (
              diagnoses.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedDiagnosis(diagnosis)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {diagnosis.disease_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Patient: {diagnosis.patient_name || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {diagnosis.is_validated ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Validated
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-medium ${getSeverityColor(diagnosis.severity_level)}`}>
                      {diagnosis.severity_level.toUpperCase()} Severity
                    </span>
                    <span className="text-gray-500">
                      {diagnosis.diagnosis_type === 'ai' ? 'AI Generated' : 'Manual'}
                    </span>
                    {diagnosis.requires_doctor && (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        Requires Doctor
                      </span>
                    )}
                  </div>

                  {diagnosis.symptoms_text && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      Symptoms: {diagnosis.symptoms_text}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(diagnosis.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedDiagnosis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Diagnosis Details
                </h2>
                <p className="text-gray-600">
                  Patient: {selectedDiagnosis.patient_name}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Condition</h3>
                  <p className="text-gray-700">{selectedDiagnosis.disease_name}</p>
                </div>

                {selectedDiagnosis.symptoms_text && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Symptoms</h3>
                    <p className="text-gray-700">{selectedDiagnosis.symptoms_text}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Recommendation</h3>
                  <p className="text-gray-700">{selectedDiagnosis.recommendation}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Severity</h3>
                    <span className={`font-medium ${getSeverityColor(selectedDiagnosis.severity_level)}`}>
                      {selectedDiagnosis.severity_level.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Type</h3>
                    <span className="text-gray-700">
                      {selectedDiagnosis.diagnosis_type === 'ai' ? 'AI Generated' : 'Manual'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!selectedDiagnosis.is_validated && (
                  <button
                    onClick={() => handleValidate(selectedDiagnosis.id)}
                    disabled={validating}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {validating ? 'Validating...' : 'Validate Diagnosis'}
                  </button>
                )}
                <button
                  onClick={() => setSelectedDiagnosis(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
