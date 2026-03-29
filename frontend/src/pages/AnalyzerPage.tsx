import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Upload,
  Mail,
  DollarSign,
  Link2,
  Video,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { CompanySelectionModal } from '../components/CompanySelectionModal';
import { motion, AnimatePresence } from 'motion/react';
import axios from "axios";

interface CompanyVerificationData {
  companyName: string;
  domainAge: string;
  sslCertificate: boolean;
  websiteLive: boolean;
  internshipPostingStatus: 'active' | 'ended' | 'not-found';
  skipped: boolean;
}

interface FormData {
  companyName: string;
  advertisement: string;
  advertisementFile: File | null;
  email: string;
  paymentRequired: 'yes' | 'no' | 'not-sure' | '';
  linkedinUrl: string;
  linkedinChecks: {
    oneYearOld: boolean;
    connections: boolean;
    companyMatch: boolean;
    recentActivity: boolean;
    recommendations: boolean;
  };
  linkedinObservations: string;
  interviewProcess: 'yes' | 'no' | 'not-sure' | '';
  companyVerification?: CompanyVerificationData;
}

export const AnalyzerPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showMismatchModal, setShowMismatchModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [detectedCompanyName, setDetectedCompanyName] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    advertisement: '',
    advertisementFile: null,
    email: '',
    paymentRequired: '',
    linkedinUrl: '',
    linkedinChecks: {
      oneYearOld: false,
      connections: false,
      companyMatch: false,
      recentActivity: false,
      recommendations: false,
    },
    linkedinObservations: '',
    interviewProcess: '',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // file + reset text
    setFormData((prev) => ({
      ...prev,
      advertisementFile: file,
      advertisement: ""
    }));

    // agar text file hai
    if (file.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          advertisement: event.target?.result as string,
        }));
      };

      reader.readAsText(file);
    }

    e.target.value = "";
  };

  const [isExtractingCompany, setIsExtractingCompany] = useState(false);

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (formData.advertisement || formData.advertisementFile) {
        setIsExtractingCompany(true);
        try {
          const form = new FormData();
          if (formData.advertisementFile) {
            form.append("file", formData.advertisementFile);
          } else if (formData.advertisement) {
            form.append("text", formData.advertisement);
          }

          const res = await axios.post("https://internveritas-production.up.railway.app/extract-company", form);
          const detected = res.data.companyName;

          if (detected) {
            // If user typed a company name, and it contradicts the AI detected name
            if (formData.companyName.trim() && detected.toLowerCase() !== formData.companyName.trim().toLowerCase() && !detected.toLowerCase().includes(formData.companyName.trim().toLowerCase())) {
              setDetectedCompanyName(detected);
              setShowMismatchModal(true);
              setIsExtractingCompany(false);
              return;
            }
            // If user left company blank, and AI detected one
            else if (!formData.companyName.trim()) {
              setFormData(prev => ({ ...prev, companyName: detected }));
              setShowCompanyModal(true);
              setIsExtractingCompany(false);
              return;
            }
          }
        } catch (err) {
          console.error("Extraction failed", err);
        }
        setIsExtractingCompany(false);
      }

      if (formData.companyName.trim()) {
        setShowCompanyModal(true);
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      if (field === 'advertisement') {
        // For textarea, Enter creates a new line
        return;
      }
      e.preventDefault();

      if (currentStep === 1 && field === 'companyName') {
        // Move focus to advertisement textarea
        return;
      }

      if (canProceed()) {
        handleNextStep();
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.advertisement.trim() !== '';
      case 2:
        return true; // Email is optional
      case 3:
        return formData.paymentRequired !== '';
      case 4:
        return true; // LinkedIn is optional
      case 5:
        return formData.interviewProcess !== '';
      default:
        return false;
    }
  };

  const handleMismatchChoice = (choice: 'user' | 'detected' | 'unknown') => {
    if (choice === 'user') {
      setShowMismatchModal(false);
      setShowCompanyModal(true);
    } else if (choice === 'detected') {
      setFormData({ ...formData, companyName: detectedCompanyName });
      setShowMismatchModal(false);
      setShowCompanyModal(true);
    } else {
      setShowUrlInput(true);
    }
  };

  const handleUnknownSubmit = () => {
    setShowMismatchModal(false);
    if (websiteUrl) {
      setFormData({
        ...formData,
        companyVerification: {
          companyName: "Custom URL Provided",
          domainAge: "Unknown",
          sslCertificate: websiteUrl.startsWith("https"),
          websiteLive: true,
          internshipPostingStatus: 'not-found',
          skipped: false
        }
      });
      setCurrentStep(2);
    } else {
      setCurrentStep(2);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsLoading(true);

      const form = new FormData();

      if (formData.advertisementFile) {
        form.append("file", formData.advertisementFile);
      } else {
        const blob = new Blob([formData.advertisement], { type: "text/plain" });
        form.append("file", blob, "input.txt");
      }

      if (formData.email) {
        form.append("email", formData.email);
      }
      
      if (formData.linkedinObservations) {
        form.append("linkedinObservations", formData.linkedinObservations);
      }

      const res = await axios.post("https://internveritas-production.up.railway.app/upload", form);

      setIsLoading(false);

      navigate("/results", {
        state: {
          backendResult: res.data,
          formData: formData
        }
      });

    } catch (err) {
      setIsLoading(false);
      alert("Backend error");
    }
  };
  const handleCompanyVerificationComplete = (verification: CompanyVerificationData) => {
    setFormData({ ...formData, companyVerification: verification });
    setShowCompanyModal(false);
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10">
        <Navbar variant="analyzer" currentStep={currentStep} totalSteps={5} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <AnimatePresence mode="wait">
            {/* Step 1: Advertisement + Company Name */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-white/90 mb-2">Company Name (optional)</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, 'companyName')}
                      placeholder="Enter company name if known"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* File Upload */}
                  <div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-violet-500 transition-colors"
                    >
                      <Upload className="h-12 w-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/70 mb-2">Click to upload or drag and drop</p>
                      <p className="text-white/40 text-sm">PDF, Image, PPT, TXT supported</p>
                      {formData.advertisementFile && (
                        <p className="text-violet-400 text-sm mt-2">
                          {formData.advertisementFile.name}
                        </p>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.ppt,.pptx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="text-center text-white/40 text-sm">OR</div>

                  {/* Textarea */}
                  <div>
                    <textarea
                      value={formData.advertisement}
                      onChange={(e) => setFormData({ ...formData, advertisement: e.target.value, advertisementFile: null })}
                      onKeyPress={(e) => handleKeyPress(e, 'advertisement')}
                      placeholder="Paste internship advertisement here..."
                      rows={8}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={!canProceed() || isExtractingCompany}
                    className="w-full flex justify-center items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExtractingCompany ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Analyzing Ad...
                      </div>
                    ) : 'Next'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Email */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="h-6 w-6 text-violet-400" />
                    <h2 className="text-2xl">Official Contact Email</h2>
                  </div>

                  <p className="text-white/70 text-sm">
                    Enter the recruiter or company email address that contacted you.
                  </p>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, 'email')}
                    placeholder="e.g., hr@company.com or 'Not Given'"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                  />

                  <button
                    onClick={() => {
                      setFormData({ ...formData, email: 'Not Given' });
                    }}
                    className="px-4 py-2 text-sm border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Not Given
                  </button>

                  <div className="flex items-start gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-200 text-sm">
                      Generic email domains (Gmail, Yahoo) are common in scams. Professional
                      organizations usually use their own company domain.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="h-6 w-6 text-violet-400" />
                    <h2 className="text-2xl">Payment Requested?</h2>
                  </div>

                  <p className="text-white/70 text-sm">Does the internship require any payment?</p>

                  <div className="grid grid-cols-3 gap-4">
                    {['yes', 'no', 'not-sure'].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            paymentRequired: option as 'yes' | 'no' | 'not-sure',
                          })
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && formData.paymentRequired) {
                            handleNextStep();
                          }
                        }}
                        className={`p-6 rounded-xl border-2 transition-all ${formData.paymentRequired === option
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-white/10 hover:border-white/20'
                          }`}
                      >
                        <span className="capitalize text-lg">
                          {option === 'not-sure' ? 'Not Sure' : option}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!canProceed()}
                      className="flex-1 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: LinkedIn */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Link2 className="h-6 w-6 text-violet-400" />
                    <h2 className="text-2xl">LinkedIn Verification</h2>
                  </div>

                  <p className="text-white/70 text-sm">
                    Enter the recruiter's LinkedIn profile URL for verification.
                  </p>

                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, 'linkedinUrl')}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                  />

                  <div className="flex items-center gap-4">
                    {(!formData.linkedinUrl || formData.linkedinUrl === 'Not Given') && (
                      <button
                        onClick={() => {
                          setFormData({ ...formData, linkedinUrl: 'Not Given' });
                        }}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                          formData.linkedinUrl === 'Not Given'
                            ? 'bg-violet-600/20 text-violet-300 border-violet-500/50'
                            : 'border-white/20 text-white hover:bg-white/5'
                        }`}
                      >
                        Not Given
                      </button>
                    )}

                    {formData.linkedinUrl && formData.linkedinUrl !== 'Not Given' && (
                      <a
                        href={formData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Open LinkedIn Profile
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {formData.linkedinUrl && formData.linkedinUrl !== 'Not Given' && (
                    <>

                      {/* Checklist */}
                      <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        {[
                          { key: 'oneYearOld', label: 'Is the profile at least 1 year old?' },
                          { key: 'connections', label: 'Does it have 500+ connections?' },
                          { key: 'companyMatch', label: 'Does the company name match the offer?' },
                          { key: 'recentActivity', label: 'Is there recent activity on the profile?' },
                          {
                            key: 'recommendations',
                            label: 'Are there recommendations from colleagues?',
                          },
                        ].map((check) => (
                          <label key={check.key} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                formData.linkedinChecks[
                                check.key as keyof typeof formData.linkedinChecks
                                ]
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  linkedinChecks: {
                                    ...formData.linkedinChecks,
                                    [check.key]: e.target.checked,
                                  },
                                })
                              }
                              className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-violet-600 checked:border-violet-600"
                            />
                            <span className="text-white/80 text-sm">{check.label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Observations */}
                      <div>
                        <label className="block text-white/90 mb-2 text-sm">
                          Share your observations (optional)
                        </label>
                        <textarea
                          value={formData.linkedinObservations}
                          onChange={(e) =>
                            setFormData({ ...formData, linkedinObservations: e.target.value })
                          }
                          placeholder="e.g., Profile seemed new, no activity..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Interview */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Video className="h-6 w-6 text-violet-400" />
                    <h2 className="text-2xl">Interview Process</h2>
                  </div>

                  <p className="text-white/70 text-sm">
                    Let us know if a formal professional interview occurred.
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    {['yes', 'no', 'not-sure'].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            interviewProcess: option as 'yes' | 'no' | 'not-sure',
                          })
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && formData.interviewProcess) {
                            handleAnalyze();
                          }
                        }}
                        className={`p-6 rounded-xl border-2 transition-all ${formData.interviewProcess === option
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-white/10 hover:border-white/20'
                          }`}
                      >
                        <span className="capitalize text-lg">
                          {option === 'not-sure' ? 'Not Sure' : option}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleAnalyze}
                      disabled={!canProceed()}
                      className="flex-1 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Analyze Now
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mismatch Modal */}
        {showMismatchModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-6 w-full max-w-md"
              style={{
                background: 'rgba(10, 15, 30, 0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-orange-400" />
                <h3 className="text-xl text-white">Company Name Mismatch</h3>
              </div>

              <p className="text-white/70 mb-6 text-sm">
                We detected a different company name in the advertisement. Which one should we use?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleMismatchChoice('user')}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 transition-colors"
                >
                  <div className="text-white mb-1">Use my entered name</div>
                  <div className="text-violet-400 text-sm">{formData.companyName}</div>
                </button>

                <button
                  onClick={() => handleMismatchChoice('detected')}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 transition-colors"
                >
                  <div className="text-white mb-1">Use detected name</div>
                  <div className="text-violet-400 text-sm">{detectedCompanyName}</div>
                </button>

                <button
                  onClick={() => handleMismatchChoice('unknown')}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 transition-colors"
                >
                  <div className="text-white">I don't know</div>
                </button>

                {showUrlInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-3 border-t border-white/10"
                  >
                    <div className="flex items-start gap-2 text-sm text-blue-300">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>💡 Providing website URL gives more detailed verification</span>
                    </div>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://company-website.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <button
                      onClick={handleUnknownSubmit}
                      className="w-full px-4 py-2 text-sm border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Don't Know
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-[#020818] flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
              />
              <h3 className="text-2xl text-white mb-4">Analyzing your internship opportunity...</h3>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-600 to-violet-400"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ width: '50%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Company Selection Modal */}
        {showCompanyModal && (
          <CompanySelectionModal
            companyName={formData.companyName}
            onSelect={handleCompanyVerificationComplete}
            onClose={() => setShowCompanyModal(false)}
          />
        )}
      </div>
    </div>
  );
};