# InternVeritas — Detailed Project Status & Work Log
**Tagline:** "The Truth About Your Internship"
**Student:** Sharwil | B.Tech IT | Nanded, Maharashtra
**Editor:** Antigravity (VS Code-like IDE)
**Stack:** Node.js + Express (Backend) | React + Vite + TypeScript (Frontend) | Supabase (DB)

---

## ✅ BACKEND — 100% COMPLETE & OPTIMIZED
**Location:** `intern-project/backend/`
**Run Command:** `nodemon index.js` → Port 5000 (auto-restart active)

### Core Features Developed
1. File Upload Processing — Parses PDF (text extraction), Scanned OCR via PDF-Poppler, Image parsing via Tesseract.js, and raw TXT.
2. Rule-Based Threat Detection — Weighted scoring logic:
   - Registration fee (+30 risk)
   - Guaranteed placement (+20 risk)
   - Pay/fees mentioned (+20 risk)
   - No formal interview (+15 risk)
   - WhatsApp only contact (+15 risk)
   - Limited time/seats urgency (+10 risk)
3. Groq AI Analysis Integration — Using latest model `llama-3.3-70b-versatile`. Analyzes exactly 5 critical factors (advertisement tone, email validity, payment urgency, company reputation, interview strictness).
4. Advanced Trust Score Formula — `(ruleScore * 0.6) + (aiScore * 0.4)`. Also applies a +10 penalty if RuleScore is above 70.
5. Multi-tier Threat Classification (`getFinalLevel`) — LOW(0-20), MEDIUM(21-40), SUSPICIOUS(41-60), HIGH(61-80), VERY HIGH(81-100).
6. Intelligent Company Name Extraction — Instructed Groq to autonomously read vague advertisements and isolate the proper company name out of raw text.
7. Automated Serper.dev API Search — Fetches top reliable web results to verify digital footprint.
8. Live Axios Validation — Pings URLs dynamically stringing `status < 500` to confirm live domains.
9. WHOIS Domain Age Integration — Runs completely in parallel with Axios to fetch the exact registration year of the domain.
10. Custom LinkedIn AI Observer — Separated Groq pipeline specifically assigned to rate user observations regarding recruiter LinkedIn profiles.
11. End-To-End Post Route (`/upload`) — Finalized, stress-tested, and actively receiving React payloads without crash data.

### 🐛 Backend Bugs Identified & Fixed
- FIXED: Serper fetching invalid celebrity/social profiles. Appended `" company"` keyword implicitly to search queries ensuring only official ".com/in" domains surface.
- FIXED: LLM hallucination where AI returned "NONE" for valid adverts. Upgraded from `specdec` model to `versatile` model.
- ADDED: Fallback extraction parsing to sanitize AI inputs containing unnecessary quote marks `""`.

### API Routes & Structure
| Route | Method | Purpose | Operational Status |
|-------|--------|---------|--------------------|
| `/` | GET | Health verification | Active |
| `/upload` | POST | Master endpoint handles heavy parsing | Active |
| `/search-company` | GET | Serper integration + Live Checks | Active |

### .env Configuration Active
```text
GROQ_API_KEY=************
SERPER_API_KEY=************

🔄 FRONTEND — FULLY INTEGRATED
Location: intern-project/frontend/ Run Command: npm run dev → Port 5173

Core Packages Configured
react-router-dom, framer-motion, lucide-react,
@tsparticles/react, @tsparticles/slim,
tailwindcss, axios, @supabase/supabase-js

Files Architecture Status
src/
  App.tsx                        ✅ Scroll restoration fully implemented
  routes.tsx                     ✅ Routing linked correctly
  main.tsx                       ✅
  context/
    AuthContext.tsx              ✅ Mock layer implemented
    AnalyzerContext.tsx          ⚠️ (Optional/Pending decision)
  pages/
    LandingPage.tsx              ✅ 5-factor textual alignment fixed (was 6)
    AnalyzerPage.tsx             ✅ Form data logic heavily refined 
    ResultsPage.tsx              ✅ Fully synced with `backendResult` JSON payloads
    HistoryPage.tsx              ✅ 
  components/
    Navbar.tsx                   ✅ Unused steps-UI removed for UX clarity
    ParticlesBackground.tsx      ✅ 
    AuthModal.tsx                ✅ 
    CompanySelectionModal.tsx    ✅ Modal overflow/rendering CSS bounds fixed
  lib/
    supabase.ts                  ✅ Deployed successfully 


🔧 Frontend Integrations & UI Bug Fixes
UI COPY EDIT: Changed all variations of "6 Factor Verification" globally to "5 Factor Verification" to match the actual backend.
UI CSS FIX: Massive URLs in the Company Select Modal broke the responsive flex-box. Fixed via Tailwind truncate overflow-hidden max-w-full.
LOGIC FIX (Critical Mismatch Bug): Selecting a conflicting company in the Mismatch modal skipped verification and jumped to step 2 previously. Rerouted the handleMismatchChoice() hook to securely pop open setShowCompanyModal(true) without skipping algorithm checks.
BLOB FALLBACK ADDED: Handled cases where user inputs RAW text directly into the AnalyzerPage.tsx. Created a new Blob converter to mimic file behavior for the backend endpoint.
FILE UPLOAD FIX: State resets correctly now e.target.value = "" preventing the "same-file upload block" issue.
SUPABASE CONNECTED: Configured Supabase publishable credentials. Bound handleFeedbackSubmit() button click to remotely insert data into standard feedback database without friction.
AI LINKEDIN INSIGHTS RENDERED: Added dynamic color-coded UI component boxes in ResultsPage.tsx to interpret Backend's linkedinAnalysis JSON nodes.

🔄 ENHANCED VERIFICATION FLOW (LIVE)
text
[Step 1] User inputs Manual Details OR Raw Internship Ad → Submit
        ↓
[Step 2] Node.js parallel-extracts data → Returns to React for Mismatch Check
        ↓
[Step 3] Conflict Handling UI triggers (Modal forces User selection vs AI detection)
        ↓
[Step 4] CompanySelectionModal triggers Serper (Filtered strictly for official web companies)
        ↓
[Step 5] Background Axios Live Check + WHOIS Domain Age extraction fires 
        ↓
[Step 6] Results Page calculates Trust Score array and displays visual AI breakdowns.

🎨 APP DESIGN & AESTHETICS SYSTEM
Background Core: Midnight Navy #020818
Primary Lighting/Accents: Violet #6d28d9, Soft Purple #8b5cf6
Active Transparency: Glassmorphism rgba(255,255,255,0.12) + backdrop-filter: blur(20px)
Font Stack: 'Inter' (Optimized for technical dashboards)
Interactive Elements: @tsparticles pushing and pulling on mouse collisions.

⏳ SCALABILITY & FUTURE ROADMAP (V2)
Proposed Upgrade	       System Goal	                                                  Target Priority
Database Duping	              Sørensen–Dice algorithms to track overlapping scams in the DB.	    Next Phase
Full Auth System	      Role-based Subabase authentication tying records individually.	    After Core
Headless Puppeteer Tests	Deep scan careers pages for scraping logic.	                 High Cost / Future
Corporate Legal Hook	      Live GST/MCA verification hooks into corporate registries.	      Eventual



Log Verified & Updated: March 29, 2026 | Total Lines Added/Refined: 155+

