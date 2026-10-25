import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../auth/authSlice.js';
import { AuthForm } from './AuthForm.jsx';
import { AccountDashboard } from './AccountDashboard.jsx';

const WELCOME_DURATION_MS = 4600;

export function Account() {
  const user = useSelector(selectUser);
  const [welcomeMode, setWelcomeMode] = useState(null);

  useEffect(() => {
    if (!welcomeMode) return;
    const timer = setTimeout(() => setWelcomeMode(null), WELCOME_DURATION_MS);
    return () => clearTimeout(timer);
  }, [welcomeMode]);

  if (!user) return <AuthForm onAuthenticated={setWelcomeMode} />;
  return <AccountDashboard user={user} welcomeMode={welcomeMode} onDismissWelcome={() => setWelcomeMode(null)} />;
}
