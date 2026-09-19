import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Dashboard from './pages/dashboard/Dashboard';
import MyStories from './pages/dashboard/MyStories';
import NewsEditor from './pages/dashboard/NewsEditor';
import Profile from './pages/dashboard/Profile';

function Layout() {
  const { pathname } = useLocation();

  // Start each page at the top (the news details page handles its own scroll)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-flash focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const refreshUser = useAuthStore((s) => s.refreshUser);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ style: { fontSize: '14px', fontWeight: 500, color: '#13202E' } }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyStories />} />
            <Route path="news/new" element={<NewsEditor />} />
            <Route path="news/:id/edit" element={<NewsEditor />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
