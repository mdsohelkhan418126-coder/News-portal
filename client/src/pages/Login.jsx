import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../api/axios';
import AuthLayout, { AuthLink } from '../components/AuthLayout';
import Field from '../components/Field';

export default function Login() {
  const { login, loading, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  if (token) return <Navigate to={from} replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Enter your password';
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back. Log in to manage your stories."
      footer={
        <>
          New here? <AuthLink to="/register">Create an account</AuthLink>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            value={form.email}
            onChange={onChange}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={form.password}
            onChange={onChange}
          />
        </Field>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="mt-6 rounded-lg bg-white p-3 text-xs text-mute">
        Demo account (after running the seed script): <strong>demo@groundreport.com</strong> / <strong>password123</strong>
      </p>
    </AuthLayout>
  );
}
