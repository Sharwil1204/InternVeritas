import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Clock, Building2, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { useAuth } from '../context/AuthContext';

interface Analysis {
  id: string;
  companyName: string;
  date: string;
  riskScore?: number;
  advertisement: string;
  email: string;
  paymentRequired: string;
  linkedinUrl: string;
  interviewProcess: string;
}

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    if (!user) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      navigate('/');
      return;
    }

    // Load analyses from localStorage
    const stored = localStorage.getItem('internveritas_analyses');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAnalyses(parsed);
    }
  }, [user, navigate, setIsAuthModalOpen, setAuthMode]);

  const calculateRiskScore = (analysis: Analysis) => {
    if (analysis.riskScore) return analysis.riskScore;

    let totalRisk = 0;
    let factors = 0;

    if (analysis.advertisement) {
      factors++;
      const hasRedFlags = /urgent|immediate|payment|fee|deposit|training fee/i.test(
        analysis.advertisement,
      );
      totalRisk += hasRedFlags ? 80 : 30;
    }

    if (analysis.email && analysis.email !== 'Not Given') {
      factors++;
      const isGeneric = /@gmail|@yahoo|@hotmail|@outlook/i.test(analysis.email);
      totalRisk += isGeneric ? 75 : 20;
    }

    if (analysis.paymentRequired) {
      factors++;
      totalRisk +=
        analysis.paymentRequired === 'yes' ? 95 : analysis.paymentRequired === 'no' ? 10 : 50;
    }

    if (analysis.companyName) {
      factors++;
      totalRisk += 40;
    }

    if (analysis.linkedinUrl && analysis.linkedinUrl !== 'Not Given') {
      factors++;
      totalRisk += 30;
    } else {
      factors++;
      totalRisk += 60;
    }

    if (analysis.interviewProcess) {
      factors++;
      totalRisk +=
        analysis.interviewProcess === 'yes' ? 15 : analysis.interviewProcess === 'no' ? 85 : 55;
    }

    return Math.round(totalRisk / factors);
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low Risk', color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30', textColor: 'text-green-300' };
    if (score < 60) return { level: 'Medium Risk', color: 'yellow', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30', textColor: 'text-yellow-300' };
    if (score < 80) return { level: 'High Risk', color: 'orange', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30', textColor: 'text-orange-300' };
    return { level: 'Very High Risk', color: 'red', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30', textColor: 'text-red-300' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewReport = (analysis: Analysis) => {
    navigate('/results', { state: { formData: analysis } });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl mb-2">Your Analysis History</h1>
            <p className="text-white/70">
              View all your previous internship scam analyses
            </p>
          </motion.div>

          {analyses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-2xl border border-white/20 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl text-white/90 mb-2">No analyses yet</h3>
              <p className="text-white/60 mb-6">
                Start by analyzing an internship offer to see your results here.
              </p>
              <button
                onClick={() => navigate('/analyze')}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
              >
                Analyze Now
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {analyses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((analysis, idx) => {
                  const riskScore = calculateRiskScore(analysis);
                  const riskLevel = getRiskLevel(riskScore);

                  return (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="p-6 rounded-2xl border border-white/20 cursor-pointer transition-all hover:border-violet-500/50"
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(20px)',
                      }}
                      onClick={() => handleViewReport(analysis)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Building2 className="h-5 w-5 text-violet-400" />
                            <h3 className="text-xl text-white">
                              {analysis.companyName || 'Unknown Company'}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(analysis.date)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Risk Score */}
                          <div className="text-center">
                            <div className="text-3xl text-white mb-1">{riskScore}%</div>
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${riskLevel.bgColor} ${riskLevel.borderColor} ${riskLevel.textColor} text-sm`}
                            >
                              {riskLevel.color === 'green' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <AlertTriangle className="h-4 w-4" />
                              )}
                              <span>{riskLevel.level}</span>
                            </div>
                          </div>

                          {/* View Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewReport(analysis);
                            }}
                            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                          >
                            View Full Report
                          </button>
                        </div>
                      </div>

                      {/* Preview Details */}
                      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-white/50">Email:</span>
                          <div className="text-white/80 truncate">
                            {analysis.email || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/50">Payment:</span>
                          <div className="text-white/80 capitalize">
                            {analysis.paymentRequired || 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/50">LinkedIn:</span>
                          <div className="text-white/80">
                            {analysis.linkedinUrl && analysis.linkedinUrl !== 'Not Given'
                              ? 'Provided'
                              : 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/50">Interview:</span>
                          <div className="text-white/80 capitalize">
                            {analysis.interviewProcess || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
