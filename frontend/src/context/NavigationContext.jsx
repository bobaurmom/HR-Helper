import { createContext, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const value = useMemo(
    () => ({
      goToLogin: () => navigate('/login', { state: { background: location } }),
      goToSignup: () => navigate('/login?mode=signup', { state: { background: location } }),
      closeAuth: () => navigate('/'),
      goToHR: () => navigate('/hr'),
      goToWorkspace: () => navigate('/workspace'),
      goToLanding: () => navigate('/'),
      goToCreateForm: (template) => navigate('/hr/forms/new', { state: { template } }),
      goToEditForm: (formId) => navigate(`/hr/forms/${formId}/edit`),
      goToFormView: (formId) => navigate(`/hr/forms/${formId}`),
      goToSubmissions: (formId) => navigate(`/hr/forms/${formId}/submissions`),
    }),
    [navigate, location]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  return useContext(NavigationContext);
}