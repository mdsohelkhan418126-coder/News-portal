import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import Avatar from './Avatar';
import { CloseIcon, MenuIcon, PlusIcon } from './Icons';

export function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Ground Report home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-flash font-display text-lg font-extrabold text-ink">
        G
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Ground Report
      </span>
    </Link>
  );
}

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-ink text-white' : 'text-ink hover:bg-white'
  }`;

export default function Header() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/news" className={navClass}>
            News
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/dashboard/news/new" className="btn-primary">
                <PlusIcon width={16} height={16} /> Write a story
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 hover:border-ink"
                  aria-expanded={userOpen}
                  aria-haspopup="menu"
                >
                  <Avatar user={user} size={30} />
                  <span className="max-w-[110px] truncate text-sm font-semibold">{user.name.split(' ')[0]}</span>
                </button>
                {userOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-lg"
                  >
                    <Link role="menuitem" to="/dashboard" className="block px-4 py-2.5 text-sm hover:bg-paper">
                      My stories
                    </Link>
                    <Link role="menuitem" to="/dashboard/profile" className="block px-4 py-2.5 text-sm hover:bg-paper">
                      Profile settings
                    </Link>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="block w-full border-t border-line px-4 py-2.5 text-left text-sm text-alert hover:bg-paper"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Log in
              </Link>
              <Link to="/register" className="btn-dark">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 hover:bg-white md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-paper md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/news" className={navClass}>
              News
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              {user ? (
                <>
                  <Link to="/dashboard/news/new" className="btn-primary">
                    Write a story
                  </Link>
                  <Link to="/dashboard" className="btn-outline">
                    My stories
                  </Link>
                  <Link to="/dashboard/profile" className="btn-outline">
                    Profile settings
                  </Link>
                  <button onClick={handleLogout} className="btn-outline text-alert">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-dark">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
