import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Shield,
  Mail,
  DollarSign,
  Building2,
  MessageSquare,
  Video,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  FileSearch,
  Brain,
  Zap,
} from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { AuthModal } from '../components/AuthModal';
import { ParticlesBackground } from '../components/ParticlesBackground';

const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = texts[currentTextIndex];

        if (!isDeleting) {
          if (currentText !== fullText) {
            setCurrentText(fullText.substring(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText === '') {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          } else {
            setCurrentText(currentText.substring(0, currentText.length - 1));
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts]);

  return <span className="text-violet-400">{currentText}</span>;
};

const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end]);

  return (
    <div ref={ref}>
      {count}
      {suffix}
    </div>
  );
};

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileSearch,
      title: 'Advertisement Analysis',
      description: 'AI analyzes job postings for red flags and suspicious patterns',
    },
    {
      icon: Mail,
      title: 'Email Verification',
      description: 'Validates official company email domains and authenticity',
    },
    {
      icon: DollarSign,
      title: 'Payment Detection',
      description: 'Flags requests for money or financial information',
    },
    {
      icon: Building2,
      title: 'Company Verification',
      description: 'Cross-references company information with online presence',
    },
    {
      icon: MessageSquare,
      title: 'Language Analysis',
      description: 'Detects unprofessional or manipulative communication patterns',
    },
    {
      icon: Video,
      title: 'Interview Process Check',
      description: 'Evaluates legitimacy of interview procedures and requests',
    },
  ];

  const steps = [
    { number: 1, title: 'Upload Advertisement + Company Name' },
    { number: 2, title: 'Verify Email' },
    { number: 3, title: 'Payment Check' },
    { number: 4, title: 'LinkedIn Verification' },
    { number: 5, title: 'Interview Check' },
  ];

  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10">
        <Navbar />
        <AuthModal />

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent leading-tight">
                The Truth About Your Internship
              </h1>
              <div className="text-xl md:text-2xl mb-8 text-white/80 h-8">
                <TypewriterText
                  texts={[
                    'Detect scams before you apply',
                    'Protect your career journey',
                    'Stay safe with AI analysis',
                  ]}
                />
              </div>
              <button
                onClick={() => navigate('/analyze')}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-violet-600/30 text-base inline-flex items-center gap-2"
              >
                Analyze Now
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  { icon: Brain, text: 'AI-Assisted Analysis' },
                  { icon: CheckCircle2, text: '6 Factor Verification' },
                  { icon: Zap, text: 'Real-time Results' },
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + idx * 0.2 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <badge.icon className="h-4 w-4 text-violet-400" />
                    <span className="text-sm text-white/80">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                className="p-8 rounded-2xl border border-white/20 relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />
                
                <div className="relative">
                  <h3 className="text-lg mb-4 text-white/90">Sample Risk Analysis</h3>
                  
                  {/* Circular Meter */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-40 h-40">
                      <svg className="transform -rotate-90 w-40 h-40">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="#f97316"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(78 / 100) * 440} 440`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-4xl text-white">78%</span>
                        <span className="text-xs text-orange-400 mt-1">High Risk</span>
                      </div>
                    </div>
                  </div>

                  {/* Factor Bars */}
                  <div className="space-y-3">
                    {[
                      { label: 'Advertisement', value: 65 },
                      { label: 'Email', value: 85 },
                      { label: 'Company', value: 90 },
                    ].map((factor, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/70">{factor.label}</span>
                          <span className="text-white/90">{factor.value}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.value}%` }}
                            transition={{ delay: 1.5 + idx * 0.2, duration: 0.8 }}
                            className={`h-full rounded-full ${
                              factor.value >= 80
                                ? 'bg-red-500'
                                : factor.value >= 60
                                  ? 'bg-orange-500'
                                  : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <FadeInSection>
          <section id="features" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="text-violet-400 text-sm mb-2 tracking-wide">CORE FEATURES</div>
                <h2 className="text-4xl md:text-5xl">How We Protect You</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-6 rounded-2xl border border-white/25 group cursor-pointer transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-violet-600/20 group-hover:bg-violet-600/30 transition-colors">
                      <feature.icon className="h-6 w-6 text-violet-400 group-hover:text-violet-300 transition-colors" />
                    </div>
                    <h3 className="text-lg mb-2 text-white group-hover:text-violet-200 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 group-hover:text-white/80 transition-colors text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* How It Works Section */}
        <FadeInSection>
          <section id="how-it-works" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="text-violet-400 text-sm mb-2 tracking-wide">TRANSPARENT PROCESS</div>
                <h2 className="text-4xl md:text-5xl">How It Works</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 }}
                      whileHover={{ scale: 1.05 }}
                      className="p-6 rounded-2xl border border-white/20 group cursor-pointer transition-all min-w-[200px]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center mb-3 group-hover:ring-4 group-hover:ring-violet-600/30 transition-all">
                        <span className="text-white">{step.number}</span>
                      </div>
                      <p className="text-sm text-white/80 group-hover:text-white transition-colors">
                        {step.title}
                      </p>
                    </motion.div>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="h-6 w-6 text-violet-400 mx-2 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* About Section */}
        <FadeInSection>
          <section id="about" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="text-violet-400 text-sm mb-2 tracking-wide">OUR MISSION</div>
                <h2 className="text-4xl md:text-5xl">
                  Protecting the Next Generation of Talent
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4 text-white/70 text-base leading-relaxed">
                  <p>
                    InternVeritas was created to protect students and young professionals from the
                    growing threat of internship scams. Using AI-assisted analysis combined with
                    rule-based detection, we evaluate internship offers across multiple factors to
                    give you a clear picture of potential risks — so you can pursue genuine
                    opportunities with confidence.
                  </p>
                  <p>
                    Internship scams can lead to financial loss, identity theft, and wasted time.
                    Our platform analyzes 6 key factors including advertisement language, email
                    domain, payment requests, company presence, language quality, and interview
                    process — helping you make informed decisions before applying.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { number: 6, suffix: '', label: 'Factor Analysis', desc: 'Comprehensive multi-point evaluation' },
                    { number: 1, suffix: '', label: 'AI-Assisted', desc: 'Intelligent pattern recognition' },
                    { number: 100, suffix: '%', label: 'Real-time Detection', desc: 'Instant risk assessment' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl border border-white/20 transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <div className="text-4xl text-violet-400 mb-2">
                        <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                      </div>
                      <div className="text-lg text-white mb-1">{stat.label}</div>
                      <div className="text-sm text-white/60">{stat.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* Footer */}
        <footer className="py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-violet-500" />
                <span className="text-white/70 text-sm">
                  © 2026 InternVeritas. Protecting your career journey.
                </span>
              </div>
              <div className="text-white/50 text-sm">
                Not meant for collecting PII or securing sensitive data
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
