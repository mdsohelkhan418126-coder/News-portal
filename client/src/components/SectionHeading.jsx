import { Link } from 'react-router-dom';

export default function SectionHeading({ title, subtitle, linkTo, linkText = 'See all' }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-mute">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="shrink-0 text-sm font-semibold text-signal hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}
