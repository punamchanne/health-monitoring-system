import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Our Services', href: '/#services' },
  ];

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 group">
            <div className="bg-primary-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Activity className="text-white" size={24} />
            </div>
            <span>Smart <span className="text-primary-600">Health</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-slate-600 hover:text-primary-600 font-medium transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to={user.role === 'caretaker' ? '/caretaker-dashboard' : '/patient-dashboard'}
                  className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-bold hover:bg-primary-100 transition-colors"
                >
                  <UserIcon size={20} />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-3 text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-all"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100">
              {!user ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="flex items-center justify-center px-4 py-3 text-slate-600 font-bold border border-slate-200 rounded-lg">Login</Link>
                  <Link to="/register" className="flex items-center justify-center px-4 py-3 btn-primary">Register</Link>
                </div>
              ) : (
                <div className="space-y-2">
                   <Link 
                    to={user.role === 'caretaker' ? '/caretaker-dashboard' : '/patient-dashboard'}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-lg font-bold shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon size={20} />
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
