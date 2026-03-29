import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Building2,
  Globe,
  Lock,
  Activity,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Navbar } from '../components/Navbar';

interface RiskFactor {
  name: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'very-high';
}

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const [riskScore, setRiskScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!formData) {
      navigate('/');
    }
  }, [formData, navigate]);

  const calculateRiskScore = () => {
    let totalRisk = 0;
    let factors = 0;

    // Advertisement risk
    if (formData.advertisement) {
      factors++;
      const hasRedFlags = /urgent|immediate|payment|fee|deposit|training fee/i.test(
        formData.advertisement,
      );
      totalRisk += hasRedFlags ? 80 : 30;
    }

    // Email risk
    if (formData.email && formData.email !== 'Not Given') {
      factors++;
      const isGeneric = /@gmail|@yahoo|@hotmail|@outlook/i.test(formData.email);
      totalRisk += isGeneric ? 75 : 20;
    }

    // Payment risk
    if (formData.paymentRequired) {
      factors++;
      totalRisk += formData.paymentRequired === 'yes' ? 95 : formData.paymentRequired === 'no' ? 10 : 50;
    }

    // Company risk
    if (formData.companyName) {
      factors++;
      totalRisk += 40; // Mock - would check against database
    }

    // LinkedIn risk
    if (formData.linkedinUrl && formData.linkedinUrl !== 'Not Given') {
      factors++;
      const checksCount = Object.values(formData.linkedinChecks).filter(Boolean).length;
      totalRisk += checksCount >= 4 ? 15 : checksCount >= 2 ? 50 : 80;
    } else {
      factors++;
      totalRisk += 60;
    }

    // Interview risk
    if (formData.interviewProcess) {
      factors++;
      totalRisk += formData.interviewProcess === 'yes' ? 15 : formData.interviewProcess === 'no' ? 85 : 55;
    }

    return Math.round(totalRisk / factors);
  };

  const score = calculateRiskScore();

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low Risk', color: 'green', message: 'Offer looks genuine' };
    if (score < 60)
      return { level: 'Medium Risk', color: 'yellow', message: 'Verify before applying' };
    if (score < 80)
      return { level: 'High Risk', color: 'orange', message: 'Strong red flags detected' };
    return { level: 'Very High Risk', color: 'red', message: 'Avoid — Scam chances high' };
  };

  const riskLevel = getRiskLevel(score);

  const getFactorLevel = (score: number): 'low' | 'medium' | 'high' | 'very-high' => {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    if (score < 80) return 'high';
    return 'very-high';
  };

  const riskFactors: RiskFactor[] = [
    {
      name: 'Advertisement',
      score: /urgent|immediate|payment|fee/i.test(formData?.advertisement || '') ? 75 : 35,
      level: getFactorLevel(/urgent|immediate|payment|fee/i.test(formData?.advertisement || '') ? 75 : 35),
    },
    {
      name: 'Email',
      score:
        formData?.email && formData.email !== 'Not Given'
          ? /@gmail|@yahoo|@hotmail/i.test(formData.email)
            ? 80
            : 25
          : 50,
      level: getFactorLevel(
        formData?.email && formData.email !== 'Not Given'
          ? /@gmail|@yahoo|@hotmail/i.test(formData.email)
            ? 80
            : 25
          : 50,
      ),
    },
    {
      name: 'Payment',
      score: formData?.paymentRequired === 'yes' ? 95 : formData?.paymentRequired === 'no' ? 10 : 50,
      level: getFactorLevel(formData?.paymentRequired === 'yes' ? 95 : formData?.paymentRequired === 'no' ? 10 : 50),
    },
    {
      name: 'Company',
      score: 45,
      level: 'medium' as const,
    },
    {
      name: 'Language',
      score: 40,
      level: 'medium' as const,
    },
    {
      name: 'Interview',
      score: formData?.interviewProcess === 'yes' ? 20 : formData?.interviewProcess === 'no' ? 85 : 55,
      level: getFactorLevel(formData?.interviewProcess === 'yes' ? 20 : formData?.interviewProcess === 'no' ? 85 : 55),
    },
  ];

  const suspiciousIndicators = [
    ...(formData?.advertisement?.toLowerCase().includes('urgent') ? ['Contains "urgent" language'] : []),
    ...(formData?.advertisement?.toLowerCase().includes('payment') ||
    formData?.advertisement?.toLowerCase().includes('fee')
      ? ['Mentions payment/fees']
      : []),
    ...(formData?.email && /@gmail|@yahoo/i.test(formData.email) ? ['Uses generic email domain'] : []),
    ...(formData?.paymentRequired === 'yes' ? ['Requires payment from candidate'] : []),
    ...(formData?.interviewProcess === 'no' ? ['No formal interview process'] : []),
  ];

  const getColorClass = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'very-high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      // In real app would save to Supabase
      console.log('Feedback submitted:', feedback);
      alert('Thank you for your feedback!');
      setFeedback('');
    }
  };

  useEffect(() => {
    let startTime: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setRiskScore(Math.floor(progress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  if (!formData) return null;

  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl mb-2">Analysis Complete</h1>
            <p className="text-white/70">We've analyzed your internship opportunity</p>
          </motion.div>

          {/* Risk Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl border border-white/20 mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Circular Meter */}
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="16"
                    fill="none"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={
                      riskLevel.color === 'green'
                        ? '#10b981'
                        : riskLevel.color === 'yellow'
                          ? '#eab308'
                          : riskLevel.color === 'orange'
                            ? '#f97316'
                            : '#ef4444'
                    }
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(riskScore / 100) * 553} 553`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 553' }}
                    animate={{ strokeDasharray: `${(riskScore / 100) * 553} 553` }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-5xl">{riskScore}%</span>
                </div>
              </div>

              {/* Risk Badge */}
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl mb-2 ${
                    riskLevel.color === 'green'
                      ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                      : riskLevel.color === 'yellow'
                        ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'
                        : riskLevel.color === 'orange'
                          ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300'
                          : 'bg-red-500/20 border border-red-500/30 text-red-300'
                  }`}
                >
                  {riskLevel.color === 'green' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                  <span className="text-lg">{riskLevel.level}</span>
                </div>
                <p className="text-white/70 text-sm">{riskLevel.message}</p>
              </div>
            </div>
          </motion.div>

          {/* Risk Factor Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-2xl border border-white/20 mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-2xl mb-6">Risk Factor Breakdown</h2>
            <div className="space-y-4">
              {riskFactors.map((factor, idx) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/90">{factor.name}</span>
                    <span className="text-white/70">{factor.score}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${getColorClass(factor.level)}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Suspicious Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl border border-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                <h3 className="text-xl">Suspicious Indicators</h3>
              </div>
              {suspiciousIndicators.length > 0 ? (
                <ul className="space-y-2">
                  {suspiciousIndicators.map((indicator, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                      <span className="text-white/80">{indicator}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60 text-sm">No major red flags found in text.</p>
              )}
            </motion.div>

            {/* AI Analysis Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl border border-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-violet-400" />
                <h3 className="text-xl">AI Analysis Summary</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                The internship posting shows{' '}
                <span className={score >= 60 ? 'text-red-400 font-medium' : 'text-yellow-400 font-medium'}>
                  {score >= 80 ? 'multiple red flags' : score >= 60 ? 'several warning signs' : 'some concerns'}
                </span>
                . {formData.paymentRequired === 'yes' && 'Requesting payment from candidates is a major warning sign. '}
                {formData.email && /@gmail|@yahoo/i.test(formData.email) &&
                  'Generic email domains are commonly used in scams. '}
                {formData.interviewProcess === 'no' && 'Lack of formal interview process is concerning. '}
                We recommend {score >= 80 ? 'avoiding this opportunity' : score >= 60 ? 'thorough verification before proceeding' : 'proceeding with caution'}.
              </p>
            </motion.div>
          </div>

          {/* Company Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 rounded-2xl border border-white/20 mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-violet-400" />
              <h3 className="text-xl">Company Verification</h3>
            </div>
            {formData.companyVerification && !formData.companyVerification.skipped ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-violet-400" />
                    <span className="text-white/70">Company: {formData.companyVerification.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {formData.companyVerification.websiteLive ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-white/70">
                      Website: {formData.companyVerification.websiteLive ? 'Live' : 'Not Accessible'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-green-400" />
                    <span className="text-white/70">Domain Age: {formData.companyVerification.domainAge}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {formData.companyVerification.sslCertificate ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                    )}
                    <span className="text-white/70">
                      SSL Certificate: {formData.companyVerification.sslCertificate ? 'Valid' : 'Not Found'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-start gap-2 text-sm">
                    {formData.companyVerification.internshipPostingStatus === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : formData.companyVerification.internshipPostingStatus === 'ended' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-white/90">
                        Internship Posting Status:{' '}
                        <span
                          className={
                            formData.companyVerification.internshipPostingStatus === 'active'
                              ? 'text-green-400'
                              : formData.companyVerification.internshipPostingStatus === 'ended'
                                ? 'text-yellow-400'
                                : 'text-orange-400'
                          }
                        >
                          {formData.companyVerification.internshipPostingStatus === 'active' && 'Active'}
                          {formData.companyVerification.internshipPostingStatus === 'ended' && 'Ended'}
                          {formData.companyVerification.internshipPostingStatus === 'not-found' && 'Not Found'}
                        </span>
                      </span>
                      {formData.companyVerification.websiteLive && formData.companyVerification.internshipPostingStatus === 'not-found' && (
                        <p className="text-white/60 text-xs mt-1">
                          Posting may have ended or is listed on a third-party platform
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : formData.companyVerification && formData.companyVerification.skipped ? (
              <p className="text-white/60 text-sm">Company verification was not performed.</p>
            ) : formData.companyName ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/70">Company: {formData.companyName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-green-400" />
                  <span className="text-white/70">Domain age: 2+ years</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-green-400" />
                  <span className="text-white/70">SSL Certificate: Valid</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-white/70">Website: Live</span>
                </div>
              </div>
            ) : (
              <p className="text-white/60 text-sm">Company verification was not performed.</p>
            )}
          </motion.div>

          {/* LinkedIn Factor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-6 rounded-2xl border border-white/20 mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-violet-400" />
              <h3 className="text-xl">LinkedIn Verification</h3>
            </div>
            {formData.linkedinUrl && formData.linkedinUrl !== 'Not Given' ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {Object.entries(formData.linkedinChecks).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                      )}
                      <span className="text-white/70">
                        {key === 'oneYearOld' && 'Profile age'}
                        {key === 'connections' && 'Connections count'}
                        {key === 'companyMatch' && 'Company name match'}
                        {key === 'recentActivity' && 'Recent activity'}
                        {key === 'recommendations' && 'Recommendations'}
                      </span>
                    </div>
                  ))}
                </div>
                {formData.linkedinObservations && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <p className="text-white/70 text-sm italic">"{formData.linkedinObservations}"</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/60 text-sm">LinkedIn verification was skipped.</p>
            )}
          </motion.div>

          {/* Feedback Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="p-6 rounded-2xl border border-white/20 mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h3 className="text-xl mb-2">💬 Share Your Experience (Optional)</h3>
            <p className="text-white/70 text-sm mb-4">
              Did this analysis help you? Share your thoughts, suggestions, or tell us about your
              experience with this internship offer. Your feedback helps us improve.
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type your feedback here..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none mb-3"
            />
            <button
              onClick={handleFeedbackSubmit}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm"
            >
              Submit Feedback
            </button>
            <p className="text-white/50 text-xs mt-2">
              Note: Feedback will be saved to database (Supabase integration pending)
            </p>
          </motion.div>

          {/* Scan Again Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center"
          >
            <button
              onClick={() => {
                navigate('/');
              }}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors shadow-lg shadow-violet-600/30"
            >
              Scan Again
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};