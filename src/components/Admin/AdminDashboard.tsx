import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Activity, TrendingUp, Stethoscope, Loader2 } from 'lucide-react';

interface Statistics {
  totalPatients: number;
  totalDoctors: number;
  totalDiagnoses: number;
  pendingValidations: number;
  diseaseStats: { disease_name: string; count: number }[];
  specializationStats: { specialization: string; count: number }[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const [patientsResult, doctorsResult, diagnosesResult, pendingResult] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact' }).eq('role', 'patient'),
        supabase.from('user_profiles').select('id', { count: 'exact' }).eq('role', 'doctor'),
        supabase.from('diagnoses').select('id', { count: 'exact' }),
        supabase.from('diagnoses').select('id', { count: 'exact' }).eq('is_validated', false),
      ]);

      const { data: diseaseData } = await supabase
        .from('diagnoses')
        .select('disease_name')
        .order('created_at', { ascending: false });

      const { data: doctorData } = await supabase
        .from('user_profiles')
        .select('specialization')
        .eq('role', 'doctor')
        .not('specialization', 'is', null);

      const diseaseCounts = (diseaseData || []).reduce((acc: any, curr) => {
        acc[curr.disease_name] = (acc[curr.disease_name] || 0) + 1;
        return acc;
      }, {});

      const diseaseStats = Object.entries(diseaseCounts)
        .map(([disease_name, count]) => ({ disease_name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const specializationCounts = (doctorData || []).reduce((acc: any, curr) => {
        if (curr.specialization) {
          acc[curr.specialization] = (acc[curr.specialization] || 0) + 1;
        }
        return acc;
      }, {});

      const specializationStats = Object.entries(specializationCounts)
        .map(([specialization, count]) => ({ specialization, count: count as number }))
        .sort((a, b) => b.count - a.count);

      setStats({
        totalPatients: patientsResult.count || 0,
        totalDoctors: doctorsResult.count || 0,
        totalDiagnoses: diagnosesResult.count || 0,
        pendingValidations: pendingResult.count || 0,
        diseaseStats,
        specializationStats,
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Platform statistics and insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
                <p className="text-sm text-gray-600">Total Doctors</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-teal-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDiagnoses}</p>
                <p className="text-sm text-gray-600">Total Diagnoses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingValidations}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Most Common Diagnoses
            </h2>
            <div className="space-y-3">
              {stats.diseaseStats.length === 0 ? (
                <p className="text-gray-500 text-sm">No data available</p>
              ) : (
                stats.diseaseStats.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{item.disease_name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Doctor Specializations
            </h2>
            <div className="space-y-3">
              {stats.specializationStats.length === 0 ? (
                <p className="text-gray-500 text-sm">No data available</p>
              ) : (
                stats.specializationStats.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{item.specialization}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalDiagnoses > 0
                  ? Math.round((stats.totalDiagnoses - stats.pendingValidations) / stats.totalDiagnoses * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Validation Rate</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {stats.totalPatients > 0
                  ? (stats.totalDiagnoses / stats.totalPatients).toFixed(1)
                  : 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Avg. Diagnoses per Patient</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <p className="text-3xl font-bold text-teal-600">
                {stats.totalDoctors > 0
                  ? Math.round(stats.totalDiagnoses / stats.totalDoctors)
                  : 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Diagnoses per Doctor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
