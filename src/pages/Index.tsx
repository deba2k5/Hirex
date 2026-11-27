import { useState } from 'react';
import RecruiterPortal from '@/components/RecruiterPortal';
import AuthGate from '@/components/auth/AuthGate';
import CandidateFlow from '@/components/exam/CandidateFlow';
import Landing from '@/components/landing/Landing';
import AdminLogin from '@/components/landing/AdminLogin';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { apiPost, clearToken, getToken, setToken } from '@/lib/api';

const Index = () => {
  // Recruiter/admin login is still Firebase-backed pending a later migration phase.
  const [userType, setUserType] = useState<'recruiter' | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Candidate identity/session lives in a JWT (localStorage) + the Express API's /auth/me.
  const { profile: candidateProfile, loading: authLoading, refreshProfile } = useAuthProfile();

  const handleCandidateLogout = () => {
    clearToken();
    setShowAuth(false);
    refreshProfile();
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setLoginError('');
    try {
      const { token } = await apiPost<{ token: string }>('/api/auth/recruiter-login', adminCredentials);
      setToken(token);
      setUserType('recruiter');
      setShowAdminLogin(false);
      setAdminCredentials({ id: '', password: '' });
      
    } catch (error: any) {
      const errorMessage = error instanceof Error && error.message !== 'Failed to fetch'
        ? error.message
        : 'Admin API is unavailable. Start the Recruitix backend on port 8787 and try again.';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecruiterAccess = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLogout = () => {
    setUserType(null);
    clearToken();
  };

  // Candidate access is authenticated with the account credentials. Facial verification
  // is intentionally not required; camera-based exam proctoring starts inside the exam.
  if (userType === 'recruiter') {
    return <RecruiterPortal onBack={handleAdminLogout} />;
  }

  if (getToken()) {
    if (authLoading) {
      return (
        <div className="hirex-app-shell min-h-screen flex items-center justify-center">
          <p className="text-white">Loading your profile...</p>
        </div>
      );
    }
    if (candidateProfile) {
      return <CandidateFlow onBack={handleCandidateLogout} />;
    }
    // Token existed but /auth/me rejected it (expired/invalid) — useAuthProfile already
    // cleared it, so fall through to the marketing/auth screens below.
  }

  if (showAuth) {
    return <AuthGate onBack={() => setShowAuth(false)} onAuthenticated={refreshProfile} />;
  }

  if (showAdminLogin) {
    return (
      <AdminLogin
        credentials={adminCredentials}
        onChange={setAdminCredentials}
        error={loginError}
        loading={isLoading}
        onSubmit={handleAdminLogin}
        onCancel={() => setShowAdminLogin(false)}
      />
    );
  }

  return <Landing onCandidate={() => setShowAuth(true)} onRecruiter={handleRecruiterAccess} />;
};

export default Index;