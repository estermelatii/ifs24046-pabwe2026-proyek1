import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../auth/authSlice.js";
import { AuthForm } from "./AuthForm.jsx";
import { AccountDashboard } from "./AccountDashboard.jsx";

export function Account() {
  const user = useSelector(selectUser);
  const [welcomeMode, setWelcomeMode] = useState(null);

  if (!user) return <AuthForm onAuthenticated={setWelcomeMode} />;
  return (
    <AccountDashboard
      user={user}
      welcomeMode={welcomeMode}
      onDismissWelcome={() => setWelcomeMode(null)}
    />
  );
}
