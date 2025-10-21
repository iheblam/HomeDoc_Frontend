import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { PatientDashboard } from './components/Patient/PatientDashboard';
import { DoctorDashboard } from './components/Doctor/DoctorDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Layout/Navbar';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading HomeDoc...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show landing page or auth page
  if (!user || !profile) {
    if (showAuth) {
      return <AuthPage />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // User is logged in, show appropriate dashboard
  return (
    <div className="min-h-screen">
      <Navbar />
      {profile.role === 'patient' && <PatientDashboard />}
      {profile.role === 'doctor' && <DoctorDashboard />}
      {profile.role === 'admin' && <AdminDashboard />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;