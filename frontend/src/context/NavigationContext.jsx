import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const navigate = useNavigate();

  const value = useMemo(
    () => ({
      goToLogin: () => navigate('/login'),
      goToSignup: () => navigate('/login?mode=signup'),
      closeAuth: () => navigate('/'),
      goToHR: () => navigate('/hr'),
      goToWorkspace: () => navigate('/workspace'),
      goToLanding: () => navigate('/'),
      goToCreateForm: (template) => navigate('/hr/forms/new', { state: { template } }),
      goToEditForm: (formId) => navigate(`/hr/forms/${formId}/edit`),
      goToFormView: (formId) => navigate(`/hr/forms/${formId}`),
    }),
    [navigate]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  return useContext(NavigationContext);
}