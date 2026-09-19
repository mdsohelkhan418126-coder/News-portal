import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-signal">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">This page does not exist</h1>
      <p className="mx-auto mt-2 max-w-md text-mute">The link may be broken, or the page may have been moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-dark">
          Go home
        </Link>
        <Link to="/news" className="btn-outline">
          Browse news
        </Link>
      </div>
    </div>
  );
}
