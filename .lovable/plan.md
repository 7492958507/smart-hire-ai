

## Complete HireSense AI Backend Setup Plan

### Current State
- Lovable Cloud is enabled
- Secrets configured: RESEND_API_KEY, LOVABLE_API_KEY
- No database tables created yet
- No edge functions deployed yet

### What I'll Implement

---

### 1. Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | User profiles with role info | id, email, full_name, role (candidate/recruiter), avatar_url |
| `jobs` | Job postings by recruiters | id, title, company, description, required_skills, recruiter_id |
| `resumes` | Candidate resume storage | id, user_id, file_path, parsed_data (JSON), skills, experience |
| `applications` | Job applications | id, job_id, candidate_id, status (applied/shortlisted/interview/rejected), match_score |
| `email_notifications` | Email log | id, recipient_email, type, status, sent_at |

**Automatic triggers:**
- Create profile on user signup
- Update `updated_at` timestamps
- Enable RLS policies for security

---

### 2. Edge Functions

| Function | Purpose |
|----------|---------|
| `chat-assistant` | AI chatbot using Lovable AI (Gemini) for recruitment advice |
| `send-notification` | Email notifications via Resend for applications, shortlisting, interviews |
| `analyze-resume` | AI-powered resume parsing and skill extraction |
| `match-job` | Calculate match score between resume and job description |

---

### 3. Authentication System

- Email/password signup and login
- Auto-confirm email signups enabled
- Role selection (Candidate vs Recruiter) during signup
- Protected routes based on authentication status

---

### 4. AI Chatbot Component

**Features:**
- Floating chat button (bottom-right, glowing cyan)
- Expandable glass-morphism chat window
- Real-time streaming responses
- Recruitment-focused system prompt
- Help with: resume tips, job matching, interview prep, platform navigation

---

### 5. Email Notifications

**Trigger Points:**
- Candidate applies to job → Email to recruiter
- Candidate gets shortlisted → Email to candidate
- Interview scheduled → Email to candidate
- New application received → Email to recruiter

---

### 6. File Changes Summary

| File | Action |
|------|--------|
| Database migration | Create all tables with RLS |
| `supabase/functions/chat-assistant/index.ts` | AI chatbot endpoint |
| `supabase/functions/send-notification/index.ts` | Resend email sender |
| `supabase/functions/analyze-resume/index.ts` | Resume AI analysis |
| `supabase/config.toml` | Register edge functions |
| `src/components/ChatBot.tsx` | Floating chatbot UI |
| `src/pages/Auth.tsx` | Add actual auth logic |
| `src/pages/CandidateDashboard.tsx` | Connect to database |
| `src/pages/RecruiterDashboard.tsx` | Connect to database |
| `src/App.tsx` | Add ChatBot component globally |

---

### Implementation Order

1. Create database tables with RLS policies
2. Enable auto-confirm for email signups
3. Create edge functions (chat-assistant, send-notification, analyze-resume)
4. Build ChatBot component
5. Connect Auth page to real authentication
6. Update dashboards to use real data

