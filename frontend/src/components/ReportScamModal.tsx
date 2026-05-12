import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, ShieldAlert, Upload, Send } from 'lucide-react';
import axios from 'axios';

interface ReportScamModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

export const ReportScamModal: React.FC<ReportScamModalProps> = ({ isOpen, onClose, companyName }) => {
  const [scamType, setScamType] = useState('payment');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('scamType', scamType);
    formData.append('description', description);
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    try {
      await axios.post('http://localhost:5000/report-scam', formData);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setDescription('');
        setScreenshot(null);
      }, 2000);
    } catch (error) {
      console.error('Error reporting scam:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-semibold">Report Scam</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Thank You</h3>
                  <p className="text-white/60">Your report has been submitted. You're helping others stay safe!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      disabled
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Scam Type</label>
                    <select
                      value={scamType}
                      onChange={(e) => setScamType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
                    >
                      <option value="payment" className="bg-[#0a0f1d]">Payment Requested (Registration/Deposit)</option>
                      <option value="fake_offer" className="bg-[#0a0f1d]">Fake Job Offer / Impersonation</option>
                      <option value="data_theft" className="bg-[#0a0f1d]">Data Theft (Aadhaar/PAN Harvesting)</option>
                      <option value="other" className="bg-[#0a0f1d]">Other Suspicious Activity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us what happened..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Proof / Screenshot (Optional)</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full px-4 py-4 bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center gap-3 group-hover:bg-white/10 transition-colors">
                        <Upload className="h-5 w-5 text-white/40" />
                        <span className="text-sm text-white/40">
                          {screenshot ? screenshot.name : 'Upload Screenshot'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Submit Report
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
