require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require('pdf-parse');
const pdfParseFunc = pdfParse.default || pdfParse;
const fs = require('fs');
const path = require("path");
const Tesseract = require("tesseract.js");
// const pdfPoppler = require("pdf-poppler"); // Disabled as it crashes on Linux
const Groq = require("groq-sdk");
const axios = require("axios");
const whois = require("whois");

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/extract-company", upload.single("file"), async (req, res) => {
  try {
    let text = req.body.text || "";
    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        try {
          const dataBuffer = fs.readFileSync(req.file.path);
          const data = await pdfParseFunc(dataBuffer);
          text = data.text;
          if (!text.trim() || text.trim().length < 50) {
            text = await extractTextFromScannedPDF(req.file.path);
          }
        } catch (err) {
          text = await extractTextFromScannedPDF(req.file.path);
        }
      } else if (req.file.mimetype.startsWith("image/")) {
        const result = await Tesseract.recognize(req.file.path, "eng");
        text = result.data.text;
      } else {
        text = fs.readFileSync(req.file.path, "utf8");
      }
      fs.unlinkSync(req.file.path);
    }
    
    if (!text || text.trim().length === 0) {
      return res.json({ companyName: "" });
    }

    const groqResponse = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Extract ONLY the company name offering the job/internship from the text. If no specific company name is mentioned, reply exactly with 'NONE'. Reply with nothing else, no quotes, no extra words." },
        { role: "user", content: text.substring(0, 3000) }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 20
    });
    let companyName = groqResponse.choices[0]?.message?.content?.trim() || "NONE";
    companyName = companyName.replace(/["']/g, '');
    if (companyName.toUpperCase() === "NONE") companyName = "";

    res.json({ companyName });
  } catch (error) {
    console.error("Extract company error:", error.message);
    res.json({ companyName: "" });
  }
});

async function extractTextFromScannedPDF(filePath) {
  console.log("ocr for scanned PDFs disabled temporarily due to linux deployment constraints.");
  return "SCANNED_PDF_SUPPORT_CURRENTLY_LOCKED";
}

function analyzeScam(text) {
  let score = 0;
  let reasons = [];
  if (text.toLowerCase().includes("registration fee")) {
    score += 30; reasons.push("Asking for registration fee");
  }
  if (text.toLowerCase().includes("limited seats") || text.toLowerCase().includes("limited spots")) {
    score += 10; reasons.push("Urgency tactic used");
  }
  if (text.toLowerCase().includes("guaranteed")) {
    score += 20; reasons.push("Unrealistic guarantee");
  }
  if (text.toLowerCase().includes("no interview")) {
    score += 15; reasons.push("No interview process");
  }
  if (text.toLowerCase().includes("pay") || text.toLowerCase().includes("fees")) {
    score += 20; reasons.push("Payment mentioned");
  }
  if (text.toLowerCase().includes("whatsapp only")) {
    score += 15; reasons.push("WhatsApp only contact");
  }
  if (text.toLowerCase().includes("urgent") || text.toLowerCase().includes("limited time") || text.toLowerCase().includes("hurry")) {
    score += 10; reasons.push("Urgency pressure");
  }
  score = Math.min(score, 100);
  return {
    ruleScore: score,
    ruleLevel: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW",
    reasons
  };
}

// ✅ NEW - Email Domain Analysis
function analyzeEmail(email, companyName) {
  if (!email || email === "Not Given" || email === "") {
    return { score: 50, flag: "No email provided", domain: null };
  }

  const freeProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'rediffmail.com', 'ymail.com', 'live.com', 'aol.com'
  ];

  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) {
    return { score: 60, flag: "Invalid email format", domain: null };
  }

  // Free email domain
  if (freeProviders.includes(domain)) {
    return { score: 75, flag: "Free email domain used — suspicious", domain };
  }

  // Company name vs domain mismatch
  if (companyName && companyName !== "Unknown") {
    const companyLower = companyName.toLowerCase().replace(/\s+/g, '');
    const domainBase = domain.split('.')[0];
    if (!domainBase.includes(companyLower) && !companyLower.includes(domainBase)) {
      return { score: 60, flag: "Company name and email domain mismatch", domain };
    }
  }

  // Looks legitimate
  return { score: 20, flag: "Company domain email — looks legitimate", domain };
}

function combineScores(ruleScore, aiScore) {
  let final = (ruleScore * 0.6) + (aiScore * 0.4);
  if (ruleScore >= 70) final += 10;
  if (final > 100) final = 100;
  return Math.round(final);
}

function getFinalLevel(score) {
  if (score <= 20) return "LOW";
  if (score <= 40) return "MEDIUM";
  if (score <= 60) return "SUSPICIOUS";
  if (score <= 80) return "HIGH";
  return "VERY HIGH";
}

async function extractCompanyNameFromText(text) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Extract only the company name from this internship advertisement. Return ONLY the company name, nothing else. If not found, return "Unknown".
        
TEXT: "${text.slice(0, 1000)}"`
      }],
      temperature: 0.1
    });
    return response.choices[0].message.content.trim();
  } catch (e) {
    return "Unknown";
  }
}

async function analyzeWithGroq(text, ruleResult) {
  const prompt = `You are an expert scam detector for internship offers.

Analyze this internship offer text and the rule-based analysis provided.

OFFER TEXT:
"${text}"

RULE-BASED ANALYSIS:
- Rule Score: ${ruleResult.ruleScore}/100
- Rule Level: ${ruleResult.ruleLevel}
- Detected Flags: ${ruleResult.reasons.join(", ") || "None"}

Your job:
1. Verify the rule-based findings
2. Detect additional red flags rules may have missed
3. Analyze language quality (templated, manipulative, AI-generated)
4. Check each factor: advertisement, email, payment, company, language, interview process

Respond ONLY in this JSON format (no extra text, no markdown):
{
  "finalRiskScore": <number 0-100>,
  "finalRiskLevel": "<LOW/MEDIUM/HIGH/VERY HIGH>",
  "explanation": "<2-3 sentence summary>",
  "factorBreakdown": {
    "advertisement": { "score": <0-100>, "level": "<LOW/MEDIUM/HIGH>", "reason": "<explanation>" },
    "email": { "score": <0-100>, "level": "<LOW/MEDIUM/HIGH>", "reason": "<explanation>" },
    "payment": { "score": <0-100>, "level": "<LOW/MEDIUM/HIGH>", "reason": "<explanation>" },
    "company": { "score": <0-100>, "level": "<LOW/MEDIUM/HIGH>", "reason": "<explanation>" },
    "language": { "score": <0-100>, "level": "<LOW/MEDIUM/HIGH>", "reason": "<explanation>" },
    "interview": { "score": <0-100>, "level": "<LOW/MEDIUM/HIGH>", "reason": "<explanation>" }
  }
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });
  const content = response.choices[0].message.content;
  const clean = content.replace(/```json|```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (e) {
    parsed = {
      finalRiskScore: 50,
      finalRiskLevel: "MEDIUM",
      explanation: "AI parsing failed",
      factorBreakdown: {}
    };
  }
  return parsed;
}

async function searchCompany(companyName) {
  try {
    const response = await axios.post(
      "https://google.serper.dev/search",
      { q: `${companyName} company` },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    let results = response.data.organic || [];
    const avoidDomains = ['youtube.com', 'facebook.com', 'linkedin.com', 'instagram.com', 'twitter.com', 'spotify.com', 'wikipedia.org', 'glassdoor.com', 'ambitionbox.com', 'pinterest.com', 'crunchbase.com'];
    results = results.filter(r => !avoidDomains.some(d => r.link.toLowerCase().includes(d)));
    return results.slice(0, 5).map(r => ({
      title: r.title,
      url: r.link,
      description: r.snippet
    }));
  } catch (error) {
    console.log("Search Error:", error.message);
    return [];
  }
}

async function checkWebsiteLive(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    if (response.status < 500) {
      return { live: true, status: response.status };
    } else {
      return { live: false, status: response.status };
    }
  } catch (error) {
    return { live: false, status: null };
  }
}

async function checkWhois(url) {
  return new Promise((resolve) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      whois.lookup(domain, (err, data) => {
        if (err || !data) {
          resolve({ domainAge: "Unknown" });
          return;
        }
        const patterns = [
          /Creation Date:\s*(.+)/i,
          /Created On:\s*(.+)/i,
          /created:\s*(.+)/i,
          /Domain Registration Date:\s*(.+)/i,
          /Registered on:\s*(.+)/i
        ];
        let creationDate = null;
        for (const pattern of patterns) {
          const match = data.match(pattern);
          if (match) {
            creationDate = match[1].trim();
            break;
          }
        }
        let domainAge = "Unknown";
        if (creationDate) {
          const created = new Date(creationDate);
          if (!isNaN(created)) {
            const years = Math.floor((new Date() - created) / (1000 * 60 * 60 * 24 * 365));
            domainAge = years + " years old";
          }
        }
        resolve({ domainAge });
      });
    } catch (e) {
      resolve({ domainAge: "Unknown" });
    }
  });
}

app.get("/search-company", async (req, res) => {
  try {
    const companyName = req.query.name;
    if (!companyName) {
      return res.status(400).json({ error: "Company name required" });
    }

    const results = await searchCompany(companyName);

    await Promise.all(results.map(async (company) => {
      const [liveCheck, whoisData] = await Promise.all([
        checkWebsiteLive(company.url),
        checkWhois(company.url)
      ]);
      company.isLive = liveCheck.live;
      company.statusCode = liveCheck.status;
      company.domainAge = whoisData.domainAge;
    }));

    res.json({ companies: results });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

async function analyzeLinkedIn(observations) {
  if (!observations || observations.trim() === "") return null;
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "system",
        content: "You are a fraud analyst. The user provided observations about a recruiter's LinkedIn profile. Analyze them and return JSON with two fields: 'score' (number 0-100, 100=highest risk) and 'flag' (1 concise sentence describing the risk/safety). Return ONLY JSON."
      }, {
        role: "user",
        content: observations
      }],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (e) {
    return null;
  }
}

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const email = req.body.email || "";
    const linkedinObservations = req.body.linkedinObservations || "";
    let extractedText = "";

    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParseFunc(dataBuffer);
      if (data.text.trim().length > 50) {
        extractedText = data.text;
      } else {
        extractedText = await extractTextFromScannedPDF(filePath);
      }
    } else if (mimeType.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    } else if (mimeType === "text/plain") {
      extractedText = fs.readFileSync(filePath, "utf-8");
    } else {
      return res.status(400).send("Unsupported file type");
    }

    fs.unlinkSync(filePath);

    const ruleResult = analyzeScam(extractedText);
    const aiResult = await analyzeWithGroq(extractedText, ruleResult);
    const companyName = await extractCompanyNameFromText(extractedText);

    // ✅ Additional Analysis
    const emailAnalysis = analyzeEmail(email, companyName);
    const linkedinAnalysis = await analyzeLinkedIn(linkedinObservations);

    const searchResults = await searchCompany(companyName);
    const finalScore = combineScores(ruleResult.ruleScore, aiResult.finalRiskScore);
    const finalLevel = getFinalLevel(finalScore);

    res.json({
      text: extractedText,
      companyName: companyName,
      finalRiskScore: finalScore,
      finalRiskLevel: finalLevel,
      explanation: aiResult.explanation,
      aiBreakdown: aiResult.factorBreakdown || {},
      ruleFlags: ruleResult.reasons,
      searchResults: searchResults,
      emailAnalysis: emailAnalysis,
      linkedinAnalysis: linkedinAnalysis
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).send("Error processing file");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});