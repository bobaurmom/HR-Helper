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
      goToCreateForm: () => navigate('/hr/forms/new'),
      goToFormView: (formId) => navigate(`/hr/forms/${formId}`),
    }),
    [navigate]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  return useContext(NavigationContext);
}