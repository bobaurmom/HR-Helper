import { useCallback, useEffect, useMemo, useState } from 'react';
import LandingPage from './pages/LandingPage';
import HRPage from './pages/HRPage';
import Authentication from './pages/Authentication';
import { NavigationProvider } from './context/NavigationContext';
import User_Workspace from './pages/User_Workspace';
import CreateForm from './pages/CreateForm';
import FormView from './pages/FormView';
import { setToken } from './services/api';

function App() {
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('hr-helper:view');
    const valid = ['landing', 'hr', 'workspace'];
    return valid.includes(saved) ? saved : 'landing';
  });
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formViewId, setFormViewId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      params.delete('token');
      const qs = params.toString();
      const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
      window.history.replaceState({}, '', newUrl);
      setView('hr');
      localStorage.setItem('hr-helper:view', 'hr');
    }
  }, []);

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

  const goToCreateForm = useCallback(() => {
    setAuthOpen(false);
    setView('create-form');
    localStorage.setItem('hr-helper:view', 'create-form');
  }, []);

  const goToFormView = useCallback((formId) => {
    setAuthOpen(false);
    setFormViewId(formId);
    setView('form-view');
  }, []);

  const navigation = useMemo(
    () => ({ goToLogin, goToSignup, goToHR, goToWorkspace, goToLanding, goToCreateForm, goToFormView }),
    [goToLogin, goToSignup, goToHR, goToWorkspace, goToLanding, goToCreateForm, goToFormView]
  );

  return (
    <NavigationProvider value={navigation}>
      {view === 'landing' && <LandingPage />}
      {view === 'hr' && <HRPage />}
      {view === 'workspace' && <User_Workspace />}
      {view === 'create-form' && <CreateForm />}
      {view === 'form-view' && formViewId && <FormView formId={formViewId} />}
      <Authentication open={authOpen} initialMode={authMode} onClose={closeAuth} />
    </NavigationProvider>
  );
}
export default App;
