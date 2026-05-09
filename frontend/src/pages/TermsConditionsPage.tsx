import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { FileSearch } from 'lucide-react';
import { Footer } from '../components/Footer';

export const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <FileSearch className="h-6 w-6 text-violet-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
          </div>
          
          
          <div className="space-y-6 text-white/70 text-sm leading-relaxed" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using InternVeritas ("the Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, you must immediately discontinue use of the Platform. These Terms constitute a legally binding agreement between you ("User") and InternVeritas ("we," "our," or "us").</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">2. Description of Service</h2>
              <p>InternVeritas is an AI-powered platform designed to help users identify potential internship scams. Our services include, but are not limited to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Automated analysis of internship advertisements and communications.</li>
                <li>AI-driven risk scoring using rule-based and machine learning models.</li>
                <li>Company domain verification and age analysis.</li>
                <li>SSL certificate validation of company websites.</li>
                <li>Email domain analysis for identifying suspicious communications.</li>
                <li>Generation of detailed risk assessment reports.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">3. Eligibility</h2>
              <p>You must be at least 13 years of age to use this Platform. By using InternVeritas, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">4. User Responsibilities</h2>
              <p className="mb-2">As a user of the Platform, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate and truthful information when using our services.</li>
                <li>Not upload content that is illegal, defamatory, obscene, or infringes on third-party rights.</li>
                <li>Not attempt to reverse-engineer, decompile, or disassemble any part of the Platform.</li>
                <li>Not use automated scripts, bots, or scraping tools to access the Platform.</li>
                <li>Not intentionally submit false or misleading data to manipulate analysis results.</li>
                <li>Comply with all applicable local, state, national, and international laws and regulations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">5. Disclaimer of Warranties</h2>
              <p>The Platform is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not warrant that:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>The Platform will be uninterrupted, timely, secure, or error-free.</li>
                <li>The analysis results will be 100% accurate or complete.</li>
                <li>Any defects in the Platform will be corrected.</li>
                <li>The Platform is free of viruses or other harmful components.</li>
              </ul>
              <p className="mt-2">Our AI and rule-based models are tools to assist decision-making and should not be solely relied upon as the final judgment on the legitimacy of any internship opportunity.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">6. Limitation of Liability</h2>
              <p>To the fullest extent permitted by applicable law, InternVeritas and its developers, contributors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Your use of or inability to use the Platform.</li>
                <li>Any decisions made based on analysis reports generated by the Platform.</li>
                <li>Unauthorized access to or alteration of your transmissions or data.</li>
                <li>Any third-party conduct on the Platform.</li>
                <li>Any other matter relating to the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">7. Intellectual Property</h2>
              <p>The Platform, including its original content, features, functionality, design, source code, and branding, is and shall remain the exclusive property of InternVeritas. Our trademarks, logos, and trade dress may not be used in connection with any product or service without our prior written consent. Users retain ownership of the content they upload for analysis.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">8. User-Generated Content</h2>
              <p>By submitting feedback, comments, or any other content through the Platform, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, and display such content for the purpose of improving our services. You represent that you have the right to submit such content and that it does not violate any third-party rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">9. Third-Party Links and Services</h2>
              <p>The Platform may contain links to third-party websites or services that are not owned or controlled by InternVeritas. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by the use of such third-party services.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">10. Indemnification</h2>
              <p>You agree to defend, indemnify, and hold harmless InternVeritas, its developers, and affiliates from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Platform, your violation of these Terms, or your violation of any third-party rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">11. Termination</h2>
              <p>We reserve the right to terminate or suspend your access to the Platform immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms. Upon termination, your right to use the Platform will immediately cease.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">12. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in India.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">13. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time at our sole discretion. We will provide notice of any significant changes by updating the "Last updated" date at the top of this page. Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms. It is your responsibility to review these Terms periodically.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">14. Severability</h2>
              <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">15. Contact Information</h2>
              <p>For any questions or concerns regarding these Terms and Conditions, please contact us at:</p>
              <p className="mt-1">Email: <span className="text-violet-400">internveritas.official@gmail.com</span></p>
            </section>

          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};
