import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../../components/Avatar';

const link = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
    isActive ? 'bg-ink text-white' : 'text-ink hover:bg-white'
  }`;

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex items-center gap-4">
        <Avatar user={user} size={56} />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold sm:text-3xl">Hello, {user?.name}</h1>
          <p className="truncate text-sm text-mute">{user?.email}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[210px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Dashboard">
          <NavLink to="/dashboard" end className={link}>
            My stories
          </NavLink>
          <NavLink to="/dashboard/news/new" className={link}>
            Write a story
          </NavLink>
          <NavLink to="/dashboard/profile" className={link}>
            Profile settings
          </NavLink>
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
