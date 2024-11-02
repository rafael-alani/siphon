import { BarChart3, BookOpen, LogOut, Users, Zap } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-[10%]">
          <div className="flex justify-between h-16">
            <div className="flex">
            <Link to="/" className="flex items-center w-full md:w-auto mb-2.5 md:mb-0">
              <div className="flex-shrink-0 flex items-center font-['Raleway']">
                <img 
                  src="/wishaal old site/img/transparent-logo.png" 
                  alt="Siphon Logo" 
                  className="w-[60px] mr-2.5" 
                />
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-[#0056b3] m-0">Siphon</h2>
                  <span className="text-gray-600 text-sm hidden md:block">Revolutionising the exchange of reliable energy</span>
                </div>
              </div>
              </Link>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard/ledger"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard/ledger'
                      ? 'border-green-500 text-gray-900'
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
                      ? 'border-green-500 text-gray-900'
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
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </div>
            </div>

            <div className="flex items-center">
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
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}