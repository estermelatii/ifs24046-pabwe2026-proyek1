import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authenticate } from '../auth/authSlice.js';

export function AuthForm({ onAuthenticated }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('login');
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const isLogin = mode === 'login';

  const handleInput = (field) => (event) => setCredentials({ ...credentials, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await dispatch(authenticate({ mode, credentials })).unwrap();
      onAuthenticated(mode);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="wrap narrow">
      <h1 className="page-title">{isLogin ? 'Masuk' : 'Daftar'}</h1>
      <form className="box form" onSubmit={handleSubmit}>
        {!isLogin && <label>Nama<input required value={credentials.name} onChange={handleInput('name')} /></label>}
        <label>Email<input id="username" required type="email" value={credentials.email} onChange={handleInput('email')} /></label>
        <label>Password<input id="password" required type="password" minLength="6" value={credentials.password} onChange={handleInput('password')} /></label>
        {error && <p className="error">{error}</p>}
        <button id="btn-submit" className="btn full">{isLogin ? 'Masuk' : 'Buat akun'}</button>
        <button type="button" className="link" onClick={() => setMode(isLogin ? 'register' : 'login')}>{isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}</button>
      </form>
    </section>
  );
}
