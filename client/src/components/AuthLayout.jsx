import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2 lg:py-20">
      <div className="hidden flex-col justify-between rounded-2xl bg-ink p-10 text-white lg:flex">
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Every neighbourhood has a story worth telling.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Ground Report is written by its readers. Log in to publish your own news, edit it later and see how many
            people read it.
          </p>
        </div>
        <ul className="mt-10 space-y-3 text-sm text-white/80">
          <li className="border-l-4 border-flash pl-3">Publish stories with a cover image and tags</li>
          <li className="border-l-4 border-flash pl-3">Edit or delete your stories at any time</li>
          <li className="border-l-4 border-flash pl-3">Track readership from your dashboard</li>
        </ul>
      </div>

      <div className="mx-auto w-full max-w-md self-center">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mt-2 text-sm text-mute">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-sm text-mute">{footer}</p>
      </div>
    </div>
  );
}

export const AuthLink = ({ to, children }) => (
  <Link to={to} className="font-semibold text-signal hover:underline">
    {children}
  </Link>
);
