import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../api/axios';
import Field from '../../components/Field';
import Avatar from '../../components/Avatar';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onPw = (e) => setPw({ ...pw, [e.target.name]: e.target.value });

  const saveProfile = async (ev) => {
    ev.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.avatar.trim() && !/^https?:\/\/.+/i.test(form.avatar.trim())) next.avatar = 'Enter a full link starting with http:// or https://';
    if (form.bio.length > 280) next.bio = 'Bio must be 280 characters or fewer';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await updateProfile({ ...form, name: form.name.trim(), avatar: form.avatar.trim() });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (ev) => {
    ev.preventDefault();
    const next = {};
    if (!pw.currentPassword) next.currentPassword = 'Enter your current password';
    if (pw.newPassword.length < 6) next.newPassword = 'New password must be at least 6 characters';
    if (pw.confirm !== pw.newPassword) next.confirm = 'Passwords do not match';
    setPwErrors(next);
    if (Object.keys(next).length) return;

    setPwSaving(true);
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success('Password changed');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPwSaving(false);
    }
  };

  const cls = (errs, n) => `input ${errs[n] ? 'input-error' : ''}`;

  return (
    <div className="space-y-8">
      <form onSubmit={saveProfile} noValidate className="space-y-6 rounded-xl border border-line bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar user={{ ...user, avatar: form.avatar, name: form.name }} size={64} />
          <div>
            <h2 className="text-2xl font-extrabold">Profile settings</h2>
            <p className="text-sm text-mute">This information appears next to your stories.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" error={errors.name}>
            <input id="name" name="name" className={cls(errors, 'name')} value={form.name} onChange={onChange} />
          </Field>
          <Field label="Email" htmlFor="email" error={errors.email}>
            <input id="email" name="email" type="email" className={cls(errors, 'email')} value={form.email} onChange={onChange} />
          </Field>
          <Field label="Phone" htmlFor="phone" hint="Optional. Not shown publicly.">
            <input id="phone" name="phone" className="input" value={form.phone} onChange={onChange} />
          </Field>
          <Field label="Profile photo link" htmlFor="avatar" error={errors.avatar} hint="Optional. Link to an image on the web.">
            <input id="avatar" name="avatar" className={cls(errors, 'avatar')} placeholder="https://" value={form.avatar} onChange={onChange} />
          </Field>
        </div>

        <Field label="Bio" htmlFor="bio" error={errors.bio} hint={`${form.bio.length}/280`}>
          <textarea id="bio" name="bio" rows={3} className={cls(errors, 'bio')} value={form.bio} onChange={onChange} maxLength={280} />
        </Field>

        <button className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <form onSubmit={savePassword} noValidate className="space-y-6 rounded-xl border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-extrabold">Change password</h2>
        <Field label="Current password" htmlFor="currentPassword" error={pwErrors.currentPassword}>
          <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" className={cls(pwErrors, 'currentPassword')} value={pw.currentPassword} onChange={onPw} />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="New password" htmlFor="newPassword" error={pwErrors.newPassword}>
            <input id="newPassword" name="newPassword" type="password" autoComplete="new-password" className={cls(pwErrors, 'newPassword')} value={pw.newPassword} onChange={onPw} />
          </Field>
          <Field label="Confirm new password" htmlFor="confirm" error={pwErrors.confirm}>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" className={cls(pwErrors, 'confirm')} value={pw.confirm} onChange={onPw} />
          </Field>
        </div>
        <button className="btn-dark" disabled={pwSaving}>
          {pwSaving ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
