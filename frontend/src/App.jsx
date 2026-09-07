import { useCallback, useMemo, useState } from 'react';
import LandingPage from './pages/LandingPage';
import HRPage from './pages/HRPage';
import Authentication from './pages/Authentication';
import { NavigationProvider } from './context/NavigationContext';
import User_Workspace from './pages/User_Workspace';

function App() {
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('hr-helper:view');
    const valid = ['landing', 'hr', 'workspace'];
    return valid.includes(saved) ? saved : 'landing';
  });
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const goToLogin = useCallback(() => {
    setAuthMode('login');
    setAuthOpen(true);
  }, []);

  const goToSignup = useCallback(() => {
    setAuthMode('signup');
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const goToHR = useCallback(() => {
    setAuthOpen(false);
    setView('hr');
    localStorage.setItem('hr-helper:view', 'hr');
  }, []);

  const goToWorkspace = useCallback(() => {
    setAuthOpen(false);
    setView('workspace');
    localStorage.setItem('hr-helper:view', 'workspace');
  }, []);

  const goToLanding = useCallback(() => {
    setAuthOpen(false);
    setView('landing');
    localStorage.setItem('hr-helper:view', 'landing');
  }, []);

  const navigation = useMemo(
    () => ({ goToLogin, goToSignup, goToHR, goToWorkspace, goToLanding }),
    [goToLogin, goToSignup, goToHR, goToWorkspace, goToLanding]
  );

  return (
    <NavigationProvider value={navigation}>
      {view === 'landing' && <LandingPage />}
      {view === 'hr' && <HRPage />}
      {view === 'workspace' && <User_Workspace />}
      <Authentication open={authOpen} initialMode={authMode} onClose={closeAuth} />
    </NavigationProvider>
  );
}
export default App;
