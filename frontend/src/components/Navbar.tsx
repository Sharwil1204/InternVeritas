import { Menu, X } from 'lucide-react';
import { InternVeritasLogo } from './InternVeritasLogo';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router';

interface NavbarProps {
  variant?: 'default' | 'analyzer';
  currentStep?: number;
  totalSteps?: number;
}

export const Navbar = ({ variant = 'default' }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  if (variant === 'analyzer') {
    return (
      <nav className="sticky top-0 z-50 bg-[#020818]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <InternVeritasLogo size={28} />
              <div className="flex flex-col">
                <span className="text-white font-semibold">InternVeritas</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#020818]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <InternVeritasLogo size={28} />
            <div className="flex flex-col">
              <span className="text-white font-semibold">InternVeritas</span>
              <span className="text-xs text-white/50">The Truth About Your Internship</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              About
            </button>
            {user && (
              <button
                onClick={() => navigate('/history')}
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                History
              </button>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-white/70 text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 text-sm border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="px-4 py-1.5 text-sm border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="px-4 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-white/70 hover:text-white transition-colors text-sm text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-white/70 hover:text-white transition-colors text-sm text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-white/70 hover:text-white transition-colors text-sm text-left"
              >
                About
              </button>
              {user && (
                <button
                  onClick={() => {
                    navigate('/history');
                    setMobileMenuOpen(false);
                  }}
                  className="text-white/70 hover:text-white transition-colors text-sm text-left"
                >
                  History
                </button>
              )}
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <>
                    <span className="text-white/70 text-sm">{user.email}</span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-1.5 text-sm border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-1.5 text-sm border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        handleSignup();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
