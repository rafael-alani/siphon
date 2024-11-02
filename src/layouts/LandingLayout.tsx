import { Zap } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function LandingLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">EnergyPeer</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                location.pathname === '/'
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium ${
                location.pathname === '/about'
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              About
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Login
            </Link>
          </div>
        </nav>
      </header> */}

      <main className="flex-grow h-[calc(100vh-4rem-176px)]">
        {location.pathname === '/' ? (
          <iframe src="wishaal old site/index.html" className="w-full h-full" title="Landing Page" />
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              © 2024 EnergyPeer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}