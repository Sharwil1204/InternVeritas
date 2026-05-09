import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Footer } from '../components/Footer';

export const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Shield className="h-6 w-6 text-violet-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          
          <div className="space-y-8 text-white/80 leading-relaxed" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>Welcome to InternVeritas. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you use our website and services.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p>When you use our Scam Detection Platform, we collect the information you explicitly provide to us, which includes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Uploaded documents (PDFs, images) for analysis.</li>
                <li>Text inputs such as company names, emails, and advertisement content.</li>
                <li>Usage data related to your interactions with the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>The primary purpose of collecting your data is to provide our core service: identifying potential internship scams. Specifically, we use your information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Process and analyze uploaded documents using AI models.</li>
                <li>Extract text and assess the risk of fraud or scams.</li>
                <li>Improve the accuracy of our detection algorithms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h2>
              <p>To provide advanced AI analysis, we utilize third-party APIs (such as Groq and Llama models). By using our platform, you acknowledge that text extracted from your uploaded documents may be sent to these third-party providers for processing. We ensure these providers have strong security measures, but we are not responsible for their independent privacy practices.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention and Security</h2>
              <p>We do not permanently store your uploaded files. Documents are processed in-memory or temporarily stored solely for the duration of the analysis, after which they are deleted. While we implement security measures to protect your data, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at support@internveritas.com or via our official channels.</p>
            </section>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};
