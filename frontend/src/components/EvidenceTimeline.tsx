import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  Mail, 
  Globe, 
  Calendar, 
  MessageSquare, 
  Timer, 
  Search, 
  Phone
} from 'lucide-react';

export interface EvidenceItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'safe';
}

interface EvidenceTimelineProps {
  items: EvidenceItem[];
}

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({ items }) => {
  const getSeverityStyles = (severity: 'critical' | 'warning' | 'info' | 'safe') => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          text: 'text-red-400',
          badge: 'bg-red-500 text-white',
          dot: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/20',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          badge: 'bg-orange-500 text-white',
          dot: 'bg-orange-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          badge: 'bg-blue-500 text-white',
          dot: 'bg-blue-500'
        };
      case 'safe':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          text: 'text-green-400',
          badge: 'bg-green-500 text-white',
          dot: 'bg-green-500'
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          text: 'text-gray-400',
          badge: 'bg-gray-500 text-white',
          dot: 'bg-gray-500'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-8 rounded-2xl border border-white/20 mb-8"
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="h-6 w-6 text-violet-400" />
        <h2 className="text-2xl font-semibold">Evidence Timeline</h2>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />

        <div className="space-y-8">
          {items.map((item, idx) => {
            const styles = getSeverityStyles(item.severity);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="relative pl-14"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-[18px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-[#020818] z-10 ${styles.dot}`} />
                
                {/* Number Badge */}
                <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-bold">
                  {idx + 1}
                </div>

                <div className={`p-5 rounded-xl border ${styles.bg} ${styles.border}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/10 ${styles.text}`}>
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-medium text-white">{item.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-center ${styles.badge}`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export const buildEvidenceTimeline = (formData: any, backendResult: any): EvidenceItem[] => {
  const items: EvidenceItem[] = [];
  let id = 1;

  // 1. PAYMENT DETECTION
  const paymentKeywords = ["fee", "deposit", "refundable", "onboarding amount", "verification payment", "registration"];
  const adText = (formData?.advertisement || "").toLowerCase();
  const foundPaymentKeyword = paymentKeywords.find(kw => adText.includes(kw));
  
  if (foundPaymentKeyword || formData?.paymentRequired === 'yes') {
    items.push({
      id: id++,
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Payment Request Detected",
      description: foundPaymentKeyword 
        ? `Found suspicious phrase: "${foundPaymentKeyword}" in advertisement.` 
        : "Candidate is required to pay a fee for this internship.",
      severity: 'critical'
    });
  }

  // 2. EMAIL DOMAIN
  const email = formData?.email;
  if (email && email !== 'Not Given') {
    const isGeneric = /@gmail|@yahoo|@hotmail|@outlook/i.test(email);
    if (isGeneric) {
      const domain = email.split('@')[1];
      items.push({
        id: id++,
        icon: <Mail className="h-5 w-5" />,
        title: "Free Email Domain Used",
        description: `The recruiter is using a personal/free email address (${domain}) instead of a corporate one.`,
        severity: 'warning'
      });
    } else {
      items.push({
        id: id++,
        icon: <Mail className="h-5 w-5" />,
        title: "Official Company Email",
        description: "Communication is being handled via an official corporate domain.",
        severity: 'safe'
      });
    }
  } else {
    items.push({
      id: id++,
      icon: <Mail className="h-5 w-5" />,
      title: "No Email Provided",
      description: "No professional contact email was provided for analysis.",
      severity: 'info'
    });
  }

  // 3. DOMAIN AGE
  if (formData?.companyVerification?.domainAge) {
    const ageStr = formData.companyVerification.domainAge;
    const yearsMatch = ageStr.match(/(\d+)\s*years?/i);
    const daysMatch = ageStr.match(/(\d+)\s*days?/i);
    
    let ageInYears = 0;
    if (yearsMatch) ageInYears = parseInt(yearsMatch[1]);
    
    if (daysMatch && !yearsMatch) {
        items.push({
          id: id++,
          icon: <Calendar className="h-5 w-5" />,
          title: "Very New Domain",
          description: `Company website domain is extremely new — ${ageStr}. Scammers often create fresh domains.`,
          severity: 'critical'
        });
    } else if (ageInYears < 1) {
      items.push({
        id: id++,
        icon: <Calendar className="h-5 w-5" />,
        title: "Very New Domain",
        description: `Company website domain is less than a year old (${ageStr}). This is a common pattern in scams.`,
        severity: 'critical'
      });
    } else if (ageInYears <= 2) {
      items.push({
        id: id++,
        icon: <Calendar className="h-5 w-5" />,
        title: "Relatively New Domain",
        description: `The company domain is relatively young (${ageStr}). Proceed with standard caution.`,
        severity: 'warning'
      });
    } else {
      items.push({
        id: id++,
        icon: <Calendar className="h-5 w-5" />,
        title: "Established Domain",
        description: `The company has an established online presence (${ageStr}).`,
        severity: 'safe'
      });
    }
  }

  // 4. INTERVIEW PROCESS
  const interviewText = (formData?.interviewProcess === 'no' || adText.includes("no interview") || adText.includes("direct joining") || adText.includes("instant selection"));
  if (interviewText) {
    items.push({
      id: id++,
      icon: <MessageSquare className="h-5 w-5" />,
      title: "No Formal Interview",
      description: "No formal interview process detected. Genuine companies usually have multiple screening rounds.",
      severity: 'warning'
    });
  } else if (formData?.interviewProcess === 'yes') {
    items.push({
      id: id++,
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Formal Interview Process",
      description: "A formal interview process is mentioned, which is a positive indicator.",
      severity: 'safe'
    });
  }

  // 5. URGENCY LANGUAGE
  const urgencyKeywords = ["urgent", "immediate", "limited seats", "hurry", "final slot", "complete within"];
  const foundUrgency = urgencyKeywords.find(kw => adText.includes(kw));
  if (foundUrgency) {
    items.push({
      id: id++,
      icon: <Timer className="h-5 w-5" />,
      title: "Urgency Pressure Detected",
      description: `Detected pressure tactics with keywords like "${foundUrgency}". Scammers use urgency to prevent careful checking.`,
      severity: 'warning'
    });
  }

  // 6. COMPANY WEBSITE
  if (formData?.companyVerification?.websiteLive !== undefined) {
    const isLive = formData.companyVerification.websiteLive;
    items.push({
      id: id++,
      icon: <Globe className="h-5 w-5" />,
      title: isLive ? "Company Website Live" : "Website Inaccessible",
      description: isLive 
        ? "The official company website is active and reachable." 
        : "The company website is currently down or not reachable, which is a major red flag.",
      severity: isLive ? 'safe' : 'critical'
    });
  }

  // 7. REDDIT/SCAM REPORTS
  if (backendResult?.searchResults) {
    const suspiciousResults = backendResult.searchResults.filter((res: any) => 
      /scam|fraud|fake|illegitimate|warning/i.test(res.title + res.snippet)
    );
    
    if (suspiciousResults.length > 0) {
      items.push({
        id: id++,
        icon: <Search className="h-5 w-5" />,
        title: "Potential Scam Reports",
        description: `Found ${suspiciousResults.length} suspicious mentions in web search results linking this company to scams or fraud.`,
        severity: 'critical'
      });
    }
  }

  // 8. CONTACT METHOD
  const contactKeywords = ["whatsapp only", "whatsapp me", "telegram", "dm for details"];
  const foundContact = contactKeywords.find(kw => adText.includes(kw));
  if (foundContact) {
    items.push({
      id: id++,
      icon: <Phone className="h-5 w-5" />,
      title: "Non-Professional Contact",
      description: `Recruiter uses ${foundContact} for communication. Professional companies rarely use only instant messaging for hiring.`,
      severity: 'warning'
    });
  }

  return items;
};
