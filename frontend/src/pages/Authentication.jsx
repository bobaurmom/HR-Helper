import { useEffect, useState } from 'react';
import AuthPanel from '../components/auth/AuthPanel';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';

function Authentication({ open, initialMode = 'login', onClose }) {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setShow(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const timeout = setTimeout(() => setShow(false), 250);
    return () => clearTimeout(timeout);
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 transition-opacity duration-300 sm:p-6 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'animate-[auth-backdrop-in_0.3s_ease-out]' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`relative flex max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-[#fffdf8] shadow-2xl transition-all duration-300 ease-out lg:rounded-[2.5rem] ${
          visible
            ? 'animate-[auth-card-in_0.45s_cubic-bezier(0.16,1,0.3,1)]'
            : 'translate-y-6 scale-95 opacity-0'
        }`}
      >
        <AuthPanel />

        <div className="relative flex flex-1 overflow-y-auto px-5 py-10 sm:px-8 lg:px-16 lg:py-12">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#d9d9d9] text-stone-600 transition hover:bg-plum hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="m-auto w-full max-w-md">
            {mode === 'login' ? (
              <Login onSwitch={() => setMode('signup')} />
            ) : (
              <SignUp onSwitch={() => setMode('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
