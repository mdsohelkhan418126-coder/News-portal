import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../api/axios';
import AuthLayout, { AuthLink } from '../components/AuthLayout';
import Field from '../components/Field';

export default function Register() {
  const { register, loading, token } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  if (token) return <Navigate to="/dashboard" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const user = await register({ name: form.name.trim(), email: form.email, password: form.password });
      toast.success(`Welcome to Ground Report, ${user.name.split(' ')[0]}`);
      navigate('/dashboard/news/new', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const cls = (name) => `input ${errors[name] ? 'input-error' : ''}`;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It is free and takes under a minute."
      footer={
        <>
          Already registered? <AuthLink to="/login">Log in</AuthLink>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" className={cls('name')} value={form.name} onChange={onChange} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" className={cls('email')} value={form.email} onChange={onChange} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password} hint="At least 6 characters">
          <input id="password" name="password" type="password" autoComplete="new-password" className={cls('password')} value={form.password} onChange={onChange} />
        </Field>
        <Field label="Confirm password" htmlFor="confirm" error={errors.confirm}>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" className={cls('confirm')} value={form.confirm} onChange={onChange} />
        </Field>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
