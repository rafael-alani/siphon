import { useState, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingLayout.css';

export default function LandingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDemoClick = useCallback((e?: React.MouseEvent) => {
    console.log("world")
    e?.preventDefault();
    login("demo@example.com", "password");
    navigate('/dashboard');
  }, [login, navigate]); 

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-[0px_4px_12px_rgba(0,0,0,0.1)] font-['Raleway']">
        <nav className="flex justify-between items-center px-[10%] py-5 bg-white">
          <Link to="/" className="flex items-center">
            <img src="./old_site/img/transparent-logo.png" alt="Siphon Logo" className="w-[60px] mr-2.5" />
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-[#0056b3] m-0">Siphon</h2>
              <span className="text-gray-600 hidden md:block">Revolutionising the exchange of reliable energy</span>
            </div>
          </Link>
          
          <div className="relative">
            <button
              className={`md:hidden p-2 hamburger ${isMobileMenuOpen ? "hamburger-open" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>

            <div className={`absolute right-0 top-16 w-48 bg-white shadow-lg rounded-lg md:hidden ${isMobileMenuOpen ? "dropdown-menu-open" : "dropdown-menu-close"}`}>
              <ul className="py-2">
                  <li><Link to="/solutions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Our solutions</Link></li>
                  <li><Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About us</Link></li>
                  <li><Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact</Link></li>
                  <li><Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link></li>
                  <li><button onClick={handleDemoClick} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Demo</button></li>
              </ul>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <ul className="flex gap-6 list-none justify-center items-center">
                <li><Link to="/solutions" className="text-gray-700 no-underline font-semibold hover:text-[#007bff] transition-colors duration-300">Our solutions</Link></li>
                <li><Link to="/about" className="text-gray-700 no-underline font-semibold hover:text-[#007bff] transition-colors duration-300">About us</Link></li>
                <li><Link to="/contact" className="text-gray-700 no-underline font-semibold hover:text-[#007bff] transition-colors duration-300">Contact</Link></li>
              </ul>
              <div className="flex gap-3">
                <Link to="/login" className="px-4 py-2 bg-[#007bff] text-white rounded-md hover:bg-[#0056b3] transition-colors duration-300 font-semibold">Login</Link>
                <button onClick={handleDemoClick} className="px-4 py-2 bg-[#007bff] text-white rounded-md hover:bg-[#0056b3] transition-colors duration-300 font-semibold">Demo</button>
              </div>
            </div>

            {isMobileMenuOpen && (
            <div
              className={`absolute right-0 top-16 w-48 bg-white shadow-lg rounded-lg md:hidden dropdown-menu ${
                isMobileMenuOpen ? "dropdown-menu-open" : ""
              }`}
            >
              <ul className="py-2">
                <li><Link to="/solutions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Our solutions</Link></li>
                <li><Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About us</Link></li>
                <li><Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact</Link></li>
                <li><Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link></li>
                <li><button onClick={handleDemoClick} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Demo</button></li>
              </ul>
            </div>
          )}
          </div>
        </nav>
      </header>

      <main className="flex-grow h-[calc(100vh-4rem-176px)]">
        {location.pathname === '/' ? (
          <iframe src="/old_site/index.html" className="w-full h-full" title="Landing Page" />
        ) : location.pathname === '/solutions' ? (
          <iframe src="/old_site/solutions.html" className="w-full h-full" title="Solutions" />
        ) : location.pathname === '/about' ? (
          <iframe src="/old_site/about-us.html" className="w-full h-full" title="About Us" />
        ) : location.pathname === '/contact' ? (
          <iframe src="/old_site/contact.html" className="w-full h-full" title="Contact" />
        ) : (
          <Outlet />
        )}  
      </main>

      {}
    </div>
  );
}