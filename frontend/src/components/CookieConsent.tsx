import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show after a small delay so it doesn't flash on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div
            className="p-5 rounded-2xl border border-white/15 shadow-2xl shadow-black/40"
            style={{
              background: 'rgba(10, 15, 40, 0.92)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="h-4 w-4 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium mb-1">We use cookies</h4>
                <p className="text-white/50 text-xs leading-relaxed">
                  We use essential cookies to maintain your session and preferences. No third-party tracking or advertising cookies are used.
                </p>
              </div>
              <button
                onClick={handleDecline}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4 ml-12">
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs rounded-lg transition-colors font-medium"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors border border-white/10"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
