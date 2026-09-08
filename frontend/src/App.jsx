import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HRPage from './pages/HRPage';
import Authentication from './pages/Authentication';
import { NavigationProvider } from './context/NavigationContext';
import User_Workspace from './pages/User_Workspace';
import CreateForm from './pages/CreateForm';
import FormView from './pages/FormView';
import { getToken, setToken } from './services/api';

function TokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      params.delete('token');
      const qs = params.toString();
      const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
      window.history.replaceState({}, '', newUrl);
      navigate('/hr', { replace: true });
    }
  }, [location, navigate]);

  return null;
}

function RequireAuth({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <NavigationProvider>
      <TokenHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Authentication />} />
        <Route
          path="/hr"
          element={
            <RequireAuth>
              <HRPage />
            </RequireAuth>
          }
        />
        <Route
          path="/hr/forms/new"
          element={
            <RequireAuth>
              <CreateForm />
            </RequireAuth>
          }
        />
        <Route
          path="/hr/forms/:formId"
          element={
            <RequireAuth>
              <FormView />
            </RequireAuth>
          }
        />
        <Route
          path="/workspace"
          element={
            <RequireAuth>
              <User_Workspace />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavigationProvider>
  );
}

export default App;