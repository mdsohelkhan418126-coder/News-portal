import { Link } from 'react-router-dom';
import { Logo } from './Header';

const CATEGORIES = ['Politics', 'Technology', 'Sports', 'Business', 'Health', 'World'];

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            News from your community, written by the people who live it. Anyone can create an account and publish a
            story.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-flash">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li>
              <Link className="hover:text-white" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/news">
                All news
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/contact">
                Contact us
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/register">
                Become a writer
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-flash">Sections</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link className="hover:text-white" to={`/news?category=${c}`}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        &copy; {new Date().getFullYear()} Ground Report. Built for the MERN 15 final assignment.
      </div>
    </footer>
  );
}
