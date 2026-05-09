import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Building2,
  Globe,
  Activity,
  MessageSquare,
  Download,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'motion/react';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';

interface RiskFactor {
  name: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'very-high';
}

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const backendResult = location.state?.backendResult;
  const [riskScore, setRiskScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!formData) {
      navigate('/');
    }
  }, [formData, navigate]);

  const calculateRiskScore = () => {
    if (!formData) return 0;

    let totalRisk = 0;
    let factors = 0;

    // Advertisement risk
    if (backendResult?.finalRiskScore !== undefined) {
      factors += 2; // AI analysis is more comprehensive, weight it stronger
      totalRisk += backendResult.finalRiskScore * 2;
    } else if (formData.advertisement) {
      factors++;
      const hasRedFlags = /urgent|immediate|payment|fee|deposit|training fee/i.test(
        formData.advertisement,
      );
      totalRisk += hasRedFlags ? 80 : 30;
    }

    // Email risk
    if (formData.email && formData.email !== 'Not Given') {
      factors++;
      if (backendResult?.emailAnalysis?.score !== undefined) {
        totalRisk += backendResult.emailAnalysis.score;
      } else {
        const isGeneric = /@gmail|@yahoo|@hotmail|@outlook/i.test(formData.email);
        totalRisk += isGeneric ? 75 : 20;
      }
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
      score: backendResult?.finalRiskScore ?? (/urgent|immediate|payment|fee/i.test(formData?.advertisement || '') ? 75 : 35),
      level: getFactorLevel(backendResult?.finalRiskScore ?? (/urgent|immediate|payment|fee/i.test(formData?.advertisement || '') ? 75 : 35)),
    },
    {
      name: 'Email',
      score: backendResult?.emailAnalysis?.score ?? (
        formData?.email && formData.email !== 'Not Given'
          ? /@gmail|@yahoo|@hotmail/i.test(formData.email)
            ? 80
            : 25
          : 50),
      level: getFactorLevel(
        backendResult?.emailAnalysis?.score ?? (
          formData?.email && formData.email !== 'Not Given'
            ? /@gmail|@yahoo|@hotmail/i.test(formData.email)
              ? 80
              : 25
            : 50)
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
    ...(backendResult?.ruleFlags || []),
    ...(backendResult?.emailAnalysis?.flag && backendResult.emailAnalysis.score > 50 ? [backendResult.emailAnalysis.flag] : []),
    ...(!backendResult && formData?.advertisement?.toLowerCase().includes('urgent') ? ['Contains "urgent" language'] : []),
    ...(!backendResult && (formData?.advertisement?.toLowerCase().includes('payment') ||
      formData?.advertisement?.toLowerCase().includes('fee'))
      ? ['Mentions payment/fees']
      : []),
    ...(!backendResult && formData?.email && /@gmail|@yahoo/i.test(formData.email) ? ['Uses generic email domain'] : []),
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

  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      try {
        const { error } = await supabase.from('feedback').insert([
          {
            company_name: backendResult?.companyName || formData.companyName || 'Unknown',
            risk_score: score.toString(),
            feedback_text: feedback.trim()
          }
        ]);

        if (error) throw error;

        alert('Thank you for your feedback! It has been saved to the database.');
        setFeedback('');
      } catch (err: any) {
        console.error('Error saving feedback:', err.message);
        alert('Could not save feedback. Please check console for details.');
      }
    }
  };

  const handleDownloadReport = () => {
    console.log('Download button clicked');
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const date = new Date().toLocaleDateString();

      // --- Header ---
      doc.setFillColor(10, 15, 30); // Dark theme color
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('InternVeritas', 20, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Internship Trust Analysis Report', 20, 32);
      doc.text(`Generated on: ${date}`, pageWidth - 20, 32, { align: 'right' });

      // --- Main Score ---
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(18);
      doc.text('Analysis Summary', 20, 55);
      
      // Score Box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(20, 62, pageWidth - 40, 30, 3, 3, 'FD');
      
      doc.setFontSize(12);
      doc.text('Overall Risk Score:', 30, 75);
      
      const scoreColor = score < 30 ? [16, 185, 129] : score < 60 ? [234, 179, 8] : score < 80 ? [249, 115, 22] : [239, 68, 68];
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.setFontSize(24);
      doc.text(`${score}%`, 75, 76);
      
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.setFontSize(14);
      doc.text(riskLevel.level, pageWidth - 30, 75, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(riskLevel.message, pageWidth - 30, 82, { align: 'right' });

      // --- Factor Breakdown Table ---
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.text('Risk Factor Breakdown', 20, 105);
      
      const tableData = riskFactors.map(f => [
        f.name,
        `${f.score}%`,
        f.level.toUpperCase().replace('-', ' ')
      ]);

      autoTable(doc, {
        startY: 110,
        head: [['Factor', 'Risk Score', 'Risk Level']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
        margin: { left: 20, right: 20 }
      });

      const finalY = (doc as any).lastAutoTable?.finalY || 150;

      // --- AI Explanation ---
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.text('Detailed Observations', 20, finalY + 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      
      const explanationText = backendResult?.explanation || 
        `The internship posting shows ${score >= 80 ? 'multiple red flags' : score >= 60 ? 'several warning signs' : 'some concerns'}. We evaluated factors including advertisement language, email authenticity, and company legitimacy.`;
      
      const splitExplanation = doc.splitTextToSize(explanationText, pageWidth - 40);
      doc.text(splitExplanation, 20, finalY + 22);

      // --- Suspicious Indicators ---
      if (suspiciousIndicators.length > 0) {
        const indicatorsY = finalY + 22 + (splitExplanation.length * 5) + 10;
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 30);
        doc.text('Key Warning Signs', 20, indicatorsY);
        
        doc.setFontSize(10);
        doc.setTextColor(239, 68, 68); // Red for warnings
        suspiciousIndicators.forEach((indicator, index) => {
          doc.text(`• ${indicator}`, 25, indicatorsY + 8 + (index * 6));
        });
      }

      // --- Footer ---
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const footerText = 'Disclaimer: This report is generated by InternVeritas AI for educational purposes only. We provide risk assessments based on available data, but we do not guarantee absolute accuracy. Please perform your own due diligence before accepting any internship.';
      const splitFooter = doc.splitTextToSize(footerText, pageWidth - 40);
      doc.text(splitFooter, pageWidth / 2, 285, { align: 'center' });

      // Save PDF
      doc.save(`InternVeritas_Report_${formData.companyName || 'Analysis'}.pdf`);
      console.log('Report saved successfully');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Error generating report. Please try again.');
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
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 553' }}
                    animate={{ strokeDasharray: `${(score / 100) * 553} 553` }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-5xl">{riskScore}%</span>
                </div>
              </div>

              {/* Risk Badge */}
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl mb-2 ${riskLevel.color === 'green'
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
                {backendResult?.explanation ? (
                  <>
                    <span className={score >= 60 ? 'text-red-400 font-medium' : 'text-yellow-400 font-medium'}>
                      Analysis:
                    </span>{' '}
                    {backendResult.explanation}
                  </>
                ) : (
                  <>
                    The internship posting shows{' '}
                    <span className={score >= 60 ? 'text-red-400 font-medium' : 'text-yellow-400 font-medium'}>
                      {score >= 80 ? 'multiple red flags' : score >= 60 ? 'several warning signs' : 'some concerns'}
                    </span>
                    . {formData.paymentRequired === 'yes' && 'Requesting payment from candidates is a major warning sign. '}
                    {formData.email && /@gmail|@yahoo/i.test(formData.email) &&
                      'Generic email domains are commonly used in scams. '}
                    {formData.interviewProcess === 'no' && 'Lack of formal interview process is concerning. '}
                    We recommend {score >= 80 ? 'avoiding this opportunity' : score >= 60 ? 'thorough verification before proceeding' : 'proceeding with caution'}.
                  </>
                )}
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
            ) : backendResult?.searchResults?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-violet-400" />
                    <span className="text-white/70">Company Detected: {backendResult.companyName || formData.companyName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-white/70">
                      Website: Live Search Performed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-green-400" />
                    <span className="text-white/70">Top Match URL: {backendResult.searchResults[0].url}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white/90">
                        Automatic AI Verification
                      </span>
                      <p className="text-white/60 text-xs mt-1">
                        We detected this company purely from the advertisement text and found matching live domains via Google Search.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-white/60 text-sm">No company detected for verification.</p>
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
                  <div className="mt-3 space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-white/70 text-sm italic">"{formData.linkedinObservations}"</p>
                    </div>
                    {backendResult?.linkedinAnalysis && (
                      <div className={`p-3 rounded-lg border ${backendResult.linkedinAnalysis.score > 50 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                        <div className="flex items-start gap-2 text-sm">
                          <Activity className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white/90">Observation Analysis: </span>
                            <span>{backendResult.linkedinAnalysis.flag}</span>
                          </div>
                        </div>
                      </div>
                    )}
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
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => {
                navigate('/');
              }}
              className="w-full sm:w-auto px-8 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Scan Again
            </button>
            <button
              onClick={handleDownloadReport}
              className="w-full sm:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download Detailed Report
            </button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};