import { useNavigate } from 'react-router';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/10 mt-20 relative z-10 w-full bg-[#020818]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/50 text-sm text-center md:text-left">
            © 2024 InternVeritas. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span 
              onClick={() => navigate('/privacy')} 
              className="text-white/50 hover:text-violet-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </span>
            <span 
              onClick={() => navigate('/terms')} 
              className="text-white/50 hover:text-violet-400 transition-colors cursor-pointer"
            >
              Terms of Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
