import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { FileSearch } from 'lucide-react';
import { Footer } from '../components/Footer';

export const TermsConditionsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <FileSearch className="h-6 w-6 text-violet-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
          </div>
          
          <div className="space-y-8 text-white/80 leading-relaxed" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p>By accessing or using InternVeritas, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our services.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>InternVeritas is a platform designed to help users identify potential internship scams. We use AI algorithms and rule-based systems to analyze job advertisements, company details, and communications. Our service is provided for informational purposes only and should not replace professional judgment.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <p>You are solely responsible for the information and documents you upload to the platform. You agree not to upload any content that is illegal, infringes on third-party rights, or contains sensitive personally identifiable information (PII) beyond what is necessary for the analysis.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
              <p>While we strive to provide accurate analyses, our AI and rule-based models are not foolproof. We cannot guarantee 100% accuracy in detecting scams. InternVeritas shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, the platform or any decisions made based on our analysis reports.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p>The platform, including its original content, features, functionality, and design, is and will remain the exclusive property of InternVeritas. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes. Your continued use of the platform after such modifications constitutes your acceptance of the new Terms.</p>
            </section>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};
