import { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (authMode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, fullName.trim());
        setSuccess(true);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccess(false);
          resetForm();
        }, 2000);
        setIsLoading(false);
        return;
      }
      setIsAuthModalOpen(false);
      resetForm();
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    resetForm();
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md relative overflow-hidden rounded-2xl border border-white/10"
          style={{
            background: 'rgba(10, 15, 30, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header with gradient accent */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600" />

          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-white/30 hover:text-white/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl text-white font-semibold mb-1">Account Created!</h3>
                <p className="text-white/50 text-sm">Welcome to InternVeritas, {fullName.split(' ')[0]}!</p>
              </motion.div>
            ) : (
              <>
                {/* Title */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {authMode === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    {authMode === 'login'
                      ? 'Sign in to access your analysis history'
                      : 'Join InternVeritas to save and track your analyses'}
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setError('');
                    }}
                    className={`flex-1 py-2 text-sm rounded-md transition-all ${
                      authMode === 'login'
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setError('');
                    }}
                    className={`flex-1 py-2 text-sm rounded-md transition-all ${
                      authMode === 'signup'
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name Field (Sign Up only) */}
                  {authMode === 'signup' && (
                    <div>
                      <label htmlFor="fullName" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <input
                          type="text"
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Sharwil Rajurwar"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition-all text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field (Sign Up only) */}
                  {authMode === 'signup' && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!email || !password || (authMode === 'signup' && (!confirmPassword || !fullName)) || isLoading}
                    className="w-full px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>

                  {/* Bottom text */}
                  <p className="text-center text-white/30 text-xs mt-4">
                    {authMode === 'login' ? (
                      <>Don't have an account?{' '}
                        <button type="button" onClick={() => { setAuthMode('signup'); setError(''); }} className="text-violet-400 hover:text-violet-300 transition-colors">
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>Already have an account?{' '}
                        <button type="button" onClick={() => { setAuthMode('login'); setError(''); }} className="text-violet-400 hover:text-violet-300 transition-colors">
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
