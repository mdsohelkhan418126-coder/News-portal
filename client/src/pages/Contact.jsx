import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/axios';
import { useAuthStore } from '../store/authStore';
import Field from '../components/Field';
import { MailIcon, PhoneIcon, PinIcon } from '../components/Icons';

export default function Contact() {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.subject.trim()) next.subject = 'Add a subject';
    if (form.message.trim().length < 10) next.message = 'Write at least 10 characters';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      const { data } = await api.post('/contact', form);
      toast.success(data.message);
      setSent(true);
      setForm({ ...form, subject: '', message: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const cls = (n) => `input ${errors[n] ? 'input-error' : ''}`;

  return (
    <div className="container-page py-12">
      <h1 className="text-4xl font-extrabold">Contact us</h1>
      <p className="mt-2 max-w-xl text-mute">
        Found a mistake in a story, want to report a problem, or have an idea for the site? Send us a note.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="text-lg font-bold">Newsroom</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 shrink-0 text-signal" />
                <span>
                  <span className="block font-semibold">Email</span>
                  <a className="text-mute hover:text-signal" href="mailto:hello@groundreport.com">
                    hello@groundreport.com
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 shrink-0 text-signal" />
                <span>
                  <span className="block font-semibold">Phone</span>
                  <a className="text-mute hover:text-signal" href="tel:+8801000000000">
                    +880 1000 000000
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 shrink-0 text-signal" />
                <span>
                  <span className="block font-semibold">Address</span>
                  <span className="text-mute">House 12, Road 5, Dhanmondi, Dhaka 1205</span>
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl bg-flash/50 p-6 text-sm">
            <p className="font-bold">Response time</p>
            <p className="mt-1 text-ink/80">We answer messages on weekdays, usually within two working days.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-xl border border-line bg-white p-6 sm:p-8 lg:col-span-3">
          {sent && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800" role="status">
              Message sent. We will get back to you by email.
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" htmlFor="name" error={errors.name}>
              <input id="name" name="name" className={cls('name')} value={form.name} onChange={onChange} />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <input id="email" name="email" type="email" className={cls('email')} value={form.email} onChange={onChange} />
            </Field>
          </div>
          <Field label="Subject" htmlFor="subject" error={errors.subject}>
            <input id="subject" name="subject" className={cls('subject')} value={form.subject} onChange={onChange} />
          </Field>
          <Field label="Message" htmlFor="message" error={errors.message}>
            <textarea id="message" name="message" rows={6} className={cls('message')} value={form.message} onChange={onChange} />
          </Field>
          <button className="btn-primary" disabled={sending}>
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}
