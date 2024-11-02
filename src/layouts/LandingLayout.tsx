import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_CREDENTIALS } from '../contexts/mockAuth';

export default function LandingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    login("demo@example.com", "password");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-[0px_4px_12px_rgba(0,0,0,0.1)] font-['Raleway']">
        <nav className="flex justify-between items-center px-[10%] py-5 bg-white md:flex-row flex-col">
          <Link to="/" className="flex items-center w-full md:w-auto mb-2.5 md:mb-0">
            <img src="/wishaal old site/img/transparent-logo.png" alt="Siphon Logo" className="w-[60px] mr-2.5" />
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-[#0056b3] m-0">Siphon</h2>
              <span className="text-gray-600 hidden md:block">Revolutionising the exchange of reliable energy</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <ul className="flex gap-6 list-none w-full md:w-auto justify-center items-center pt-2.5 md:pt-0 border-t md:border-t-0 border-gray-200">
              <li>
                <Link
                  to="/solutions"
                  className="text-gray-700 no-underline font-semibold hover:text-[#007bff] transition-colors duration-300"
                >
                  Our solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 no-underline font-semibold hover:text-[#007bff] transition-colors duration-300"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 no-underline font-semibold hover:text-[#007bff] transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 bg-[#007bff] text-white rounded-md hover:bg-[#0056b3] transition-colors duration-300 font-semibold"
              >
                Login
              </Link>
              <button
                onClick={handleDemoClick}
                className="px-4 py-2 bg-[#007bff] text-white rounded-md hover:bg-[#0056b3] transition-colors duration-300 font-semibold"
              >
                Demo
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow h-[calc(100vh-4rem-176px)]">
        {location.pathname === '/' ? (
          <iframe src="/wishaal old site/index.html" className="w-full h-full" title="Landing Page" />
        ) : location.pathname === '/solutions' ? (
          <iframe src="/wishaal old site/solutions.html" className="w-full h-full" title="Solutions" />
        ) : location.pathname === '/about' ? (
          <iframe src="/wishaal old site/about-us.html" className="w-full h-full" title="About Us" />
        ) : location.pathname === '/contact' ? (
          <iframe src="/wishaal old site/contact.html" className="w-full h-full" title="Contact" />
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