
//This file includes the main header and
//  footer.


import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaTrain, FaTicketAlt, FaUserCircle, FaShieldAlt, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50  text-slate-900  transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-50 border-b border-slate-200  bg-white  shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-5">
          <Link to="/" className="flex items-center gap-2 text-3xl font-bold text-indigo-600">
            <FaTrain className="h-8 w-8 text-indigo-600" />
            <span>BookMyTrain</span>
          </Link>
          <div className="flex items-center gap-12">
            {/* <ThemeToggle /> */}
            {isAuthenticated && (
              <>
                <Link to="/history" className="flex items-center gap-1 text-sm text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                      <FaTicketAlt className="h-4 w-4" />
                  My Bookings
                </Link>
                <Link to="/profile" className="flex items-center gap-1 text-sm text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                      <FaUserCircle className="h-4 w-4" />
                  {user?.name}
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={handleAuthClick}
              className={`rounded-full border px-6 py-3 text-md font-semibold transition ${
                isAuthenticated
                  ? 'border-indigo-600 bg-white  text-indigo-600 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-slate-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              }`}
            >
              <span className="mr-2">
                {isAuthenticated ? <FaShieldAlt className="h-4 w-14" /> : <FaLock className="h-4 w-4" />}
              </span>
              {isAuthenticated ? 'Logout' : 'Login / Signup'}
            </button>
          </div>
        </nav>
      </header>

      <main className="grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-12 bg-gray-800 py-8 text-gray-300 dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BookMyTrain. All rights reserved.</p>
          <p className="mt-2 text-sm">A professional booking experience built with React & Node.js</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;