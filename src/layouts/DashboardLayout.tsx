import { BarChart3, BookOpen, LogOut, Menu, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingLayout.css';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.1)]">
        <div className="max-w-full mx-auto px-[5%]">
          <div className="flex flex-1 justify-between h-16">
            <div className="flex flex-1 justify-between">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center font-['Raleway']">
                <img 
                  src="/old_site/img/transparent-logo.png" 
                  alt="Siphon Logo" 
                  className="w-[60px] mr-2.5" 
                />
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-[#0056b3] m-0">Siphon</h2>
                  <span className="text-gray-600 text-sm hidden md:block">Revolutionising the exchange of reliable energy</span>
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex space-x-8">
                <Link
                  to="/dashboard/ledger"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard/ledger'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ledger
                </Link>
                
                <Link
                  to="/dashboard/participants"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard/participants'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </Link>
                
                <Link
                  to="/dashboard/analytics"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard/analytics'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </div>
            </div>

            <div className="relative flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 hamburger ${isMenuOpen ? "hamburger-open" : ""}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>

              {isMenuOpen && (
                <div className={`absolute right-0 top-16 w-48 bg-white shadow-lg rounded-lg dropdown-menu ${
                  isMenuOpen ? "dropdown-menu-open" : "dropdown-menu-close"
                }`}>
                  <div className="py-2">
                    <Link
                      to="/dashboard/ledger"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <BookOpen className="h-4 w-4 inline mr-2" />
                      Ledger
                    </Link>
                    
                    <Link
                      to="/dashboard/participants"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="h-4 w-4 inline mr-2" />
                      Participants
                    </Link>
                    
                    <Link
                      to="/dashboard/analytics"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <BarChart3 className="h-4 w-4 inline mr-2" />
                      Analytics
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}