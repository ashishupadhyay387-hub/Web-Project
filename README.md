# MyResumeAI — AI-Powered ATS Resume Checker

A complete, production-style MERN-stack web app that lets users upload their resume (PDF / DOCX), paste a job description, and receive a detailed, AI-powered ATS-style report — including an overall score, matched/missing keywords, strengths, weaknesses, AI suggestions, per-section analysis, and an AI section-improvement tool. All analyses are saved per-user and can be revisited any time.

---

## ✨ Features

### Authentication
- Register / Login / Logout
- JWT-based authentication with secure token handling
- Password hashing via `bcryptjs`
- Protected routes on both frontend and backend
- Input validation for emails, weak passwords, duplicate accounts, and invalid credentials

### Resume Upload & Parsing
- Beautiful drag-and-drop upload component with progress indicator
- Supports **PDF** and **DOCX** (max 5 MB, configurable)
- Displays file name, type, and size with remove action
- Text extracted on backend (`pdf-parse`, `mammoth`) — files never sent to AI directly, and are deleted after parsing

### Job Description
- Large textarea with character counter and clear button
- Example JD one-click loader
- Minimum-length validation before analysis can run

### AI ATS Analysis (Groq API)
Groq is called **only from the backend** — the key is never exposed to the browser.

Each analysis returns (strict JSON, validated server-side):
- **Overall ATS Score** (0–100) with labeled tiers (Poor → Needs Improvement → Good → Excellent)
- **Category Scores** — keyword match, skills match, experience match, education match, project relevance, formatting
- **Matched & Missing keywords** with clear badges
- **Strengths & Weaknesses** cards
- **Actionable suggestions**
- **Per-section analysis** (Summary, Skills, Experience, Projects, Education)

The UI presents the score as an *AI-based ATS-style estimate*.

### AI Section Improver
Users select a section type, paste their current bullet/summary/paragraph, and get an AI-rewritten version using stronger action verbs and more ATS-friendly phrasing. The AI is strictly instructed **never to invent skills, metrics, or experience**.

### Dashboard & History
- Stats cards: **Total Analyses**, **Best ATS Score**, **Average Score**
- Recharts **progress-over-time line chart**
- Recent analyses preview
- Full Analysis History page with search, pagination, and per-row **View / Re-analyze / Delete**

### Landing Page
Modern SaaS-style landing with:
- Hero, feature grid, "How it works" 3-step section
- CTA banner, and an interactive FAQ accordion

### UI / UX
- Fully responsive (mobile / tablet / desktop)
- Consistent design system (rounded corners, cards, typography, gradients)
- Tailwind CSS + Lucide icons + Recharts
- Toast notifications for success/error/warning
- Loading skeletons, spinners, and AI step-by-step animation
- Empty states, error states, progress bars

---

## 🧱 Tech Stack

| Layer         | Technologies                                                                  |
|---------------|-------------------------------------------------------------------------------|
| **Frontend**  | React 18, Vite, React Router, Tailwind CSS, Axios, Recharts, Lucide React    |
| **Backend**   | Node.js, Express, JWT, bcryptjs, Multer, express-validator, Morgan          |
| **Parsing**   | `pdf-parse` (PDF), `mammoth` (DOCX)                                          |
| **AI**        | Groq API (`groq-sdk`) with `llama-3.1-70b-versatile` + JSON mode             |
| **Database**  | MongoDB (via Mongoose) — locally or Atlas                                   |

---

## 🏗️ Architecture

```
resume-ats-checker/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── components/        # Reusable UI (spinners, charts, improver, etc.)
│       ├── pages/             # Landing, Login, Register, Dashboard, Analyzer, Report, History
│       ├── layouts/           # PublicLayout (marketing) + AppLayout (sidebar)
│       ├── services/          # Axios wrappers: api, authService, resumeService, analysisService
│       ├── context/           # AuthContext + ToastContext
│       └── utils/             # helpers (score colors, date formats, validation)
├── server/                    # Express backend
│   ├── config/                # MongoDB connection
│   ├── controllers/           # authController, resumeController, analysisController
│   ├── models/                # User, Analysis (Mongoose schemas)
│   ├── routes/                # authRoutes, resumeRoutes, analysisRoutes
│   ├── middleware/            # auth (JWT) + global error handler
│   ├── services/              # parserService (PDF/DOCX) + groqService (AI calls)
│   ├── utils/                 # asyncHandler, errorResponse, helpers
│   ├── uploads/               # Temp upload folder (files deleted after parsing)
│   └── server.js
├── .gitignore
├── README.md
└── package.json               # Root convenience scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**
- **MongoDB** running locally (default `mongodb://localhost:27017/resume-ats-checker`) — or a MongoDB Atlas connection string
- A **Groq API key** (create one at https://console.groq.com)

### 1. Install dependencies

From the project root you can install everything at once:

```bash
npm run install-all
```

Or individually:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Copy `server/.env.example` → `server/.env` and fill in your values:

```bash
cp server/.env.example server/.env
```

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-ats-checker
JWT_SECRET=replace_me_with_a_long_random_string
GROQ_API_KEY=gsk_your_groq_api_key_here
MAX_FILE_SIZE=5242880
```

> If your frontend runs on a host other than `http://localhost:5173`, also add `CLIENT_URL=...`

### 3. Run the application (full stack)

From the **project root**:

```bash
npm run dev
```

This uses `concurrently` to launch:
- Backend on **http://localhost:5000**
- Frontend on **http://localhost:5173** (proxies `/api` to the backend)

Or individually:
```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

### 4. Verify

- API health check: **http://localhost:5000/api/health**
- App UI: **http://localhost:5173**

1. Register a new account from the landing page.
2. Go to Analyze Resume, drop in a PDF or DOCX resume.
3. Paste any job description (or click **Use Example JD**).
4. Click **Run ATS Analysis** and wait 10–30 seconds for the Groq-powered report.

---

## 🔌 API Documentation

All endpoints (except `POST /api/auth/*`) require the header:
`Authorization: Bearer <jwt_token>`

Responses follow the shape:
```json
{ "success": true, "data": {...} }
```
Errors:
```json
{ "success": false, "error": "Human-readable message" }
```

### Auth

| Method | Endpoint            | Body                                        | Result                  |
|--------|---------------------|---------------------------------------------|-------------------------|
| POST   | `/api/auth/register` | `{ name, email, password }`                 | Token + user profile    |
| POST   | `/api/auth/login`    | `{ email, password }`                       | Token + user profile    |
| GET    | `/api/auth/me`       | —                                           | Current user            |

### Resumes / AI

| Method | Endpoint                      | Body / FormData                                                               | Result                           |
|--------|-------------------------------|-------------------------------------------------------------------------------|----------------------------------|
| POST   | `/api/resumes/upload`         | `multipart/form-data` with field `resume` (PDF/DOCX, ≤5MB)                    | Extracted text + file info       |
| POST   | `/api/resumes/analyze`        | `{ resumeText, jobDescription, fileName }`                                    | Full saved `Analysis` document   |
| POST   | `/api/resumes/improve-section`| `{ sectionType, currentText, resumeContext?, jobDescription? }`               | `{ improvedText }`               |

### Analyses

| Method | Endpoint               | Params              | Result                               |
|--------|------------------------|---------------------|--------------------------------------|
| GET    | `/api/analyses`        | `?page=&limit=`     | Paginated list + aggregate stats    |
| GET    | `/api/analyses/history`| —                   | `[{ date, score }]` for charts       |
| GET    | `/api/analyses/:id`    | Mongo ObjectId      | Single full report                  |
| DELETE | `/api/analyses/:id`    | Mongo ObjectId      | Confirmation message                |

A user can only ever see / modify **their own** analyses — enforced in every controller via `req.user._id`.

---

## 🛡️ Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT auth middleware on all user-specific endpoints
- JWT stored in `localStorage`; auto-logout on 401
- Multer validates both MIME type and extension; enforces size limits
- Input validation via `express-validator` on auth endpoints
- Groq API key read **only from server env** — never shipped to frontend
- Global error handler strips stack traces and returns sanitized messages
- CORS scoped to the configured `CLIENT_URL`
- Analysis documents indexed by `userId` and filtered by owner on every query

---

## 🧠 Important AI Rules (Built-in Prompts)

The Groq system prompts instruct the model to:
- Compare the resume only against the provided job description
- **Never invent** qualifications, metrics, projects, or technologies that do not already appear in the input
- Clearly separate "missing keywords you should add if true" from "mandatory keywords"
- Return strictly valid JSON matching the exact schema required by the frontend
- Present the score as an AI-based ATS-style estimate, never a hiring guarantee

The server additionally:
- Cleans markdown / code-block wrapping from the AI text
- Parses and validates the shape of every AI response before returning it
- Defaults any missing numeric scores to `0` and missing arrays to `[]`

---

## 🧪 Testing / Debugging Tips

- Backend uses `morgan` in dev mode to log every request
- Use the "Use Example JD" button on the Analyzer page for a realistic JD
- If parsing fails for a particular PDF, it's likely a scanned image (not text-based)
- If Groq API is slow, check network tab and look for the `X-RateLimit-*` headers
- Uploaded files are stored only long enough to extract text, then deleted by `cleanupFile()` (in a `finally` block)

---

## 🖼️ Screenshots (placeholders)

| Screen         | Description                                        |
|----------------|----------------------------------------------------|
| Landing Page   | Hero + features + how-it-works + pricing CTA + FAQ |
| Login / Reg    | Form validation + password strength meter          |
| Dashboard      | Stat cards + line chart + recent analyses          |
| Analyze Resume | Drag-drop upload + JD textarea + step loader       |
| ATS Report     | Circular score + categories + keywords + tabs      |
| Section Improver | Side-by-side rewrite + copy action               |
| History        | Table + search + pagination + row actions          |

---

## 🚧 Future Improvements

- [ ] OCR fallback for scanned-image PDFs
- [ ] Save extracted resume text alongside each analysis for re-runs
- [ ] Bulk-JD compare (upload resume, compare to many JDs)
- [ ] Export report to PDF
- [ ] Role-based keyword libraries
- [ ] Multi-factor auth + password reset flow
- [ ] Docker Compose one-command deploy
- [ ] Unit & integration test suites (Vitest + Supertest)

---

## 📝 License

MIT — feel free to use this as a template or starter!

---

**Made with ❤️ using MERN + Groq AI.**
