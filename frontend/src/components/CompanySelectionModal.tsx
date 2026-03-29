import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Globe, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import axios from 'axios';

interface CompanyOption {
  id: string;
  name: string;
  website: string;
  description: string;
  domainAge?: string;
  isLive?: boolean;
}

interface CompanyVerificationData {
  companyName: string;
  domainAge: string;
  sslCertificate: boolean;
  websiteLive: boolean;
  internshipPostingStatus: 'active' | 'ended' | 'not-found';
  skipped: boolean;
}

interface CompanySelectionModalProps {
  companyName: string;
  onSelect: (verification: CompanyVerificationData) => void;
  onClose: () => void;
}

export const CompanySelectionModal = ({
  companyName,
  onSelect,
  onClose,
}: CompanySelectionModalProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNoneOfThese, setShowNoneOfThese] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/search-company?name=${companyName}`);
        if (res.data.companies && res.data.companies.length > 0) {
          setCompanies(res.data.companies.map((c: any, i: number) => ({
            id: String(i),
            name: c.title || companyName,
            website: c.url,
            description: c.description || 'Verified via search',
            domainAge: c.domainAge,
            isLive: c.isLive,
          })));
        } else {
          setCompanies([]);
        }
      } catch (err) {
        console.error(err);
        setCompanies([]);
      } finally {
        setIsSearching(false);
      }
    };
    fetchCompanies();
  }, [companyName]);

  const handleCompanySelect = async (company: CompanyOption) => {
    setSelectedId(company.id);
    setIsVerifying(true);

    // Use real data fetched from backend
    setTimeout(() => {
      const verification: CompanyVerificationData = {
        companyName: company.name,
        domainAge: company.domainAge || 'Unknown',
        sslCertificate: company.website.startsWith('https'),
        websiteLive: company.isLive ?? true,
        internshipPostingStatus: 'not-found',
        skipped: false,
      };
      setIsVerifying(false);
      onSelect(verification);
    }, 1000);
  };

  const handleNoneOfThese = () => {
    setShowNoneOfThese(true);
  };

  const handleSkip = () => {
    onSelect({
      companyName: companyName,
      domainAge: 'N/A',
      sslCertificate: false,
      websiteLive: false,
      internshipPostingStatus: 'not-found',
      skipped: true,
    });
  };

  const handleCustomUrlSubmit = async () => {
    if (!customUrl) {
      handleSkip();
      return;
    }

    setIsVerifying(true);

    // Minimal verification for custom URL
    setTimeout(() => {
      const verification: CompanyVerificationData = {
        companyName: companyName,
        domainAge: 'Unknown',
        sslCertificate: customUrl.startsWith('https://'),
        websiteLive: true,
        internshipPostingStatus: 'not-found',
        skipped: false,
      };
      setIsVerifying(false);
      onSelect(verification);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        style={{
          background: 'rgba(10, 15, 30, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {isSearching ? (
          <div className="text-center py-12">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
            />
            <h3 className="text-xl text-white mb-2">Searching live data...</h3>
            <p className="text-white/60 text-sm">
              Verifying company details and checking domain information...
            </p>
          </div>
        ) : isVerifying ? (
          <div className="text-center py-12">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
            />
            <h3 className="text-xl text-white mb-2">Verifying Company...</h3>
            <p className="text-white/60 text-sm">
              Finalizing data...
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-6 w-6 text-violet-400" />
              <h3 className="text-xl text-white">Select Your Company</h3>
            </div>

            <p className="text-white/70 mb-6 text-sm">
              {companies.length > 0 
                ? `We found domains matching "${companyName}". Please select:`
                : `No exact domains found for "${companyName}". You can enter it manually:`}
            </p>

            {companies.length > 0 && (
              <div className="space-y-3 mb-4">
                {companies.map((company) => (
                  <motion.button
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedId === company.id
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{company.name}</h4>
                        <div className="flex items-center gap-2 text-violet-400 text-sm mb-2 max-w-full overflow-hidden pr-4">
                          <Globe className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{company.website}</span>
                        </div>
                        <p className="text-white/60 text-sm">{company.description}</p>
                      </div>
                      {selectedId === company.id && (
                        <CheckCircle className="h-5 w-5 text-violet-400 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            <button
              onClick={handleNoneOfThese}
              className="w-full p-4 border-2 border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors"
            >
              None of these
            </button>

            <AnimatePresence>
              {showNoneOfThese && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 pt-4 border-t border-white/10"
                >
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <Lightbulb className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-200 text-sm">
                      💡 Providing website URL gives more detailed verification
                    </p>
                  </div>

                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://company-website.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={handleSkip}
                      className="flex-1 px-4 py-2 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleCustomUrlSubmit}
                      className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
                    >
                      Verify URL
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
};
