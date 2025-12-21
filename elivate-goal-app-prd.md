# Product Requirements Document (PRD)
# Elivate Network Goal Setting App

**Version:** 1.0  
**Date:** December 2024  
**Author:** Product Team  

---

## 1. Executive Summary

### 1.1 Product Overview
Elivate Network Goal Setting App is a web-based tool that enables Elivate Network members to set, plan, and visualize their yearly and monthly goals across their dual business model: Network Marketing and Fiverr Freelancing. The app provides real-time calculations and projections as users input their targets, culminating in a professionally designed PDF download of their goal plan.

### 1.2 Core Value Proposition
- **Unified goal planning** for both income streams (network marketing + freelancing)
- **Real-time projections** that show members exactly what consistent effort produces
- **Beautiful PDF export** that members can print and use as a daily visual reminder
- **Member-only access** via ID validation, creating exclusivity and team identity

### 1.3 Key Constraints
- No backend data storage (stateless application)
- Fill-once-and-download model
- Member ID validation against local list
- Mobile-first responsive design
- Single-session experience (no accounts, no login persistence)

---

## 2. User Flow

### 2.1 High-Level Flow

```
[Landing Screen]
       ↓
[Member ID Entry] → [Validation] → ❌ Invalid: Error message, retry
       ↓ ✅ Valid
[Welcome Screen + Mode Selection]
       ↓
[Yearly Goals] or [Monthly Goals]
       ↓
[Goal Entry Wizard - Multiple Steps]
       ↓
[Review & Summary Screen]
       ↓
[Generate PDF]
       ↓
[Download PDF + Completion Screen]
```

### 2.2 Detailed User Journey

#### Step 1: Member ID Gate
- User lands on app
- Sees Elivate Network branding and single input field
- Enters their Member ID
- System validates against local array of valid IDs
- Invalid: Shows friendly error, allows retry
- Valid: Proceeds to welcome screen

#### Step 2: Welcome & Mode Selection
- Personalized welcome (can use Member ID or just "Welcome, Elivate Member")
- Two clear options presented:
  - **"Set My 2025 Yearly Goals"** - comprehensive annual planning
  - **"Set My Monthly Goals"** - focused 30-day planning
- Brief description under each option explaining what it covers

#### Step 3: Goal Entry Wizard
- Multi-step form with progress indicator
- One focused section per screen (reduces overwhelm)
- Real-time calculations appear as user enters numbers
- Each section has "Why" prompts for emotional anchoring
- Back/Next navigation with progress saved in session

#### Step 4: Review Screen
- Full summary of all entered goals
- All calculations displayed
- Option to edit any section
- "Generate My Goal Plan" CTA button

#### Step 5: PDF Generation & Download
- Loading state while PDF generates
- Preview option (optional)
- Download button
- Success message with motivational copy
- Option to start over or set goals for other timeframe

---

## 3. Feature Specifications

### 3.1 Member ID Validation

**Implementation:**
```javascript
const validMemberIDs = [
  "ELV001", "ELV002", "ELV003", // etc.
  // Array maintained and pushed to app
];

function validateMember(inputID) {
  return validMemberIDs.includes(inputID.toUpperCase().trim());
}
```

**UI Behavior:**
- Input field with placeholder: "Enter your Member ID"
- Submit button: "Access Goal Planner"
- Error state: Red border, message "Member ID not found. Please check and try again."
- Success: Smooth transition to welcome screen

**Member ID Format Recommendation:**
- Format: `ELV` + 3-4 digit number (e.g., ELV001, ELV0042)
- Case-insensitive validation
- Trim whitespace automatically

---

### 3.2 Yearly Goal Setter

#### Section A: Annual Vision
**Purpose:** Set the emotional foundation and big-picture identity

**Fields:**
| Field | Type | Placeholder/Prompt |
|-------|------|-------------------|
| Annual Vision | Textarea | "Describe who you will become by December 31st. What does your life look like? How do you feel? What have you achieved?" |
| Word of the Year | Text input | "One word that will guide your decisions this year" |
| Annual Income Goal (Total) | Number input | "₦0" or "$0" (detect locale or let user choose currency) |

---

#### Section B: Network Marketing Goals
**Purpose:** Recruitment, team building, and rank advancement

**Fields:**
| Field | Type | Calculation Triggered |
|-------|------|----------------------|
| Current Team Size | Number | Used in projections |
| Target Team Size (Dec 31) | Number | Monthly recruitment calc |
| Current Rank | Dropdown/Text | - |
| Target Rank (Dec 31) | Dropdown/Text | - |
| Q1 Rank Target | Text | - |
| Q2 Rank Target | Text | - |
| Q3 Rank Target | Text | - |
| Q4 Rank Target | Text | - |
| Network Marketing Income Goal | Number | Monthly breakdown calc |
| Why (Network Marketing) | Textarea | "Why is building this team important to you? Go deep." |

**Real-Time Calculations:**

**Recruitment Calculator:**
```
New recruits needed = Target Team Size - Current Team Size
Monthly recruitment target = New recruits needed ÷ Months remaining in year

Display: "To grow from [current] to [target] team members, you need to recruit [X] people per month, which is approximately [Y] per week."
```

**Income Projection:**
```
Monthly target = Annual NM Income Goal ÷ 12
Weekly target = Monthly target ÷ 4

Display: "To hit ₦[annual], you need to earn ₦[monthly]/month or ₦[weekly]/week from network marketing."
```

---

#### Section C: Fiverr Freelancing Goals
**Purpose:** Skill development, client acquisition, and freelance income

**Fields:**
| Field | Type | Notes |
|-------|------|-------|
| Primary Skill to Sell | Text | "e.g., Video Editing, Copywriting, Graphic Design" |
| Secondary Skill | Text | Optional |
| Skill Learning Goal | Textarea | "What new skills will you learn this year to increase your value?" |
| Fiverr Income Goal (Annual) | Number | Triggers calculation |
| Target Number of Projects | Number | Triggers calculation |
| Average Project Value | Number | Auto-calculated or manual entry |
| Target Fiverr Level | Dropdown | New Seller / Level 1 / Level 2 / Top Rated |
| Number of 5-Star Reviews Goal | Number | - |
| Why (Freelancing) | Textarea | "Why is building your freelance business important?" |

**Real-Time Calculations:**

**Project Calculator:**
```
If user enters Income Goal + Number of Projects:
  Average needed per project = Income Goal ÷ Number of Projects
  Display: "To earn ₦[goal] from [X] projects, each project needs to average ₦[avg]"

If user enters Income Goal + Average Project Value:
  Projects needed = Income Goal ÷ Average Project Value
  Monthly projects = Projects needed ÷ 12
  Display: "At ₦[avg] per project, you need [total] projects this year — that's [monthly] projects per month or [weekly] per week."
```

**Review Velocity Calculator:**
```
Reviews per month = Reviews Goal ÷ 12
Display: "To get [goal] 5-star reviews, aim for [X] excellent deliveries per month."
```

---

#### Section D: Personal Development
**Purpose:** Growth mindset, learning commitment, skill building

**Fields:**
| Field | Type |
|-------|------|
| Personal Development Goal | Textarea |
| Book 1-12 | Text inputs (12 slots) |
| Courses/Training to Complete | Textarea |
| Events/Conferences to Attend | Textarea |
| Why (Personal Growth) | Textarea |

---

#### Section E: Daily Income-Producing Activities (IPAs)
**Purpose:** Define non-negotiable daily habits

**Fields:**
| Field | Type |
|-------|------|
| IPA 1-8 | Text inputs |
| Why (Daily Commitment) | Textarea |

**Guidance Copy:**
"These are the activities you commit to doing EVERY SINGLE DAY, regardless of how you feel. Consistency beats intensity."

**Suggested IPAs (shown as hints):**
- Reach out to X new prospects
- Follow up with X warm leads
- Post valuable content on social media
- Support/train a team member
- Send X Fiverr buyer requests
- Optimize/update a Fiverr gig
- Learn for 30 minutes
- Review your goals

---

#### Section F: Monthly Review Commitment
**Purpose:** Accountability checkpoint

**Fields:**
| Field | Type |
|-------|------|
| Preferred Review Day | Dropdown (1st, Last Sunday, etc.) |
| Accountability Partner | Text (optional) |
| Review Reminder | Checkbox ("I commit to reviewing my goals monthly") |

---

### 3.3 Monthly Goal Setter

**Simplified version focused on 30-day sprints**

#### Section A: Month Overview
| Field | Type |
|-------|------|
| Month | Dropdown (January - December) |
| Theme/Focus for this Month | Text |
| Top 3 Priorities | 3 text inputs |

#### Section B: Network Marketing (Monthly)
| Field | Type | Calculation |
|-------|------|-------------|
| Recruitment Target | Number | Weekly breakdown |
| Team Support Actions | Textarea | - |
| Rank Target | Text | - |
| NM Income Target | Number | Weekly breakdown |
| Why | Textarea | - |

#### Section C: Fiverr (Monthly)
| Field | Type | Calculation |
|-------|------|-------------|
| Number of Projects to Complete | Number | Weekly breakdown |
| Income Target | Number | Per-project average |
| Gig Improvements | Textarea | - |
| Buyer Requests Target | Number | Daily breakdown |
| Why | Textarea | - |

#### Section D: Personal Development (Monthly)
| Field | Type |
|-------|------|
| Book to Read | Text |
| Skill to Practice | Text |
| Course/Training | Text |
| Why | Textarea |

#### Section E: Daily IPAs (Monthly)
| Field | Type |
|-------|------|
| IPA 1-6 | Text inputs |

#### Section F: End of Month Vision
| Field | Type |
|-------|------|
| "By [Month] 31st, I will have..." | Textarea |

---

## 4. Design Specifications

### 4.1 Brand Identity

**Brand Name:** Elivate Network  
**Tagline:** "Rise Together. Win Together."  
**Tone:** Motivational, professional, empowering, action-oriented

---

### 4.2 Color Palette

**Primary Colors:**
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Elivate Green | `#2A7D5F` | Primary brand color, headers, CTAs |
| Elivate Green Dark | `#1E5C46` | Hover states, accents |
| Elivate Green Light | `#3D9B77` | Highlights, progress bars |

**Secondary Colors:**
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Gold Accent | `#D4A84B` | Premium feel, achievements, highlights |
| Gold Light | `#E8C876` | Subtle accents |

**Neutral Colors:**
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Background | `#F8F9FA` | Page background |
| Card White | `#FFFFFF` | Content cards |
| Cream | `#F5F2EB` | Input backgrounds, subtle sections |
| Text Primary | `#1A1A1A` | Main body text |
| Text Secondary | `#5A5A5A` | Labels, helper text |
| Text Muted | `#8A8A8A` | Placeholders |
| Border Light | `#E5E7EB` | Card borders, dividers |

**Semantic Colors:**
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Success | `#22C55E` | Validation success, completed states |
| Error | `#EF4444` | Validation errors |
| Warning | `#F59E0B` | Warnings, attention needed |

---

### 4.3 Typography

**Font Family:** Lexend  
**Google Fonts Import:** `https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap`

**Type Scale:**
| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 - Hero | 2.5rem (40px) | 700 | 1.2 | Main page titles |
| H2 - Section | 1.75rem (28px) | 600 | 1.3 | Section headers |
| H3 - Card Title | 1.25rem (20px) | 600 | 1.4 | Card headers |
| H4 - Subsection | 1.125rem (18px) | 600 | 1.4 | Subsection titles |
| Body | 1rem (16px) | 400 | 1.6 | Main content |
| Body Small | 0.875rem (14px) | 400 | 1.5 | Helper text, labels |
| Caption | 0.75rem (12px) | 500 | 1.4 | Captions, tags |
| Button | 1rem (16px) | 600 | 1 | Button text |

**Mobile Adjustments:**
- H1: 2rem (32px)
- H2: 1.5rem (24px)
- Increase line height by 0.1 for body text on mobile

---

### 4.4 Spacing System

**Base Unit:** 4px

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing, inline elements |
| sm | 8px | Between related elements |
| md | 16px | Standard padding, gaps |
| lg | 24px | Section padding |
| xl | 32px | Between sections |
| 2xl | 48px | Major section breaks |
| 3xl | 64px | Page sections |

**Component Spacing:**
- Card padding: 24px (desktop), 16px (mobile)
- Input padding: 12px 16px
- Button padding: 14px 24px
- Form field gap: 16px
- Section gap: 32px

---

### 4.5 Component Design

#### Buttons

**Primary Button:**
```css
.btn-primary {
  background: #2A7D5F;
  color: #FFFFFF;
  font-weight: 600;
  padding: 14px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #1E5C46;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(42, 125, 95, 0.25);
}
```

**Secondary Button:**
```css
.btn-secondary {
  background: transparent;
  color: #2A7D5F;
  border: 2px solid #2A7D5F;
  padding: 12px 22px;
  border-radius: 8px;
}
.btn-secondary:hover {
  background: rgba(42, 125, 95, 0.08);
}
```

**Ghost Button (Back navigation):**
```css
.btn-ghost {
  background: transparent;
  color: #5A5A5A;
  padding: 12px 16px;
}
.btn-ghost:hover {
  color: #1A1A1A;
  background: rgba(0,0,0,0.04);
}
```

#### Input Fields

```css
.input-field {
  width: 100%;
  background: #F8F9FA;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 1rem;
  font-family: 'Lexend', sans-serif;
  color: #1A1A1A;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.input-field:focus {
  outline: none;
  border-color: #2A7D5F;
  box-shadow: 0 0 0 3px rgba(42, 125, 95, 0.12);
}
.input-field::placeholder {
  color: #8A8A8A;
}
```

**Textarea:**
- Min height: 100px
- Resize: vertical only
- Same styling as input fields

**Number Input with Currency:**
- Currency symbol prefix inside input
- Thousand separator formatting on blur

#### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #E5E7EB;
}
.card-elevated {
  box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.04);
}
```

#### Progress Indicator

**Step Progress Bar:**
- Horizontal dots/steps on mobile
- Current step highlighted with Elivate Green
- Completed steps with checkmark
- Upcoming steps in gray

```
[ ✓ ]---[ ✓ ]---[ ● ]---[ ○ ]---[ ○ ]
 Step 1   Step 2   Step 3  Step 4  Step 5
```

#### Calculation Display Card

```css
.calc-card {
  background: linear-gradient(135deg, #2A7D5F 0%, #1E5C46 100%);
  border-radius: 12px;
  padding: 20px;
  color: #FFFFFF;
}
.calc-card .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.8);
  margin-bottom: 4px;
}
.calc-card .value {
  font-size: 1.5rem;
  font-weight: 700;
}
.calc-card .subtext {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.7);
  margin-top: 8px;
}
```

#### Why Block (Emotional Anchor)

```css
.why-block {
  background: #FEF9E7;
  border-left: 4px solid #D4A84B;
  border-radius: 0 8px 8px 0;
  padding: 16px 20px;
  margin-top: 16px;
}
.why-block .label {
  color: #B8860B;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 4px;
}
.why-block .prompt {
  color: #8B7355;
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 12px;
}
```

---

### 4.6 Layout & Responsive Design

**Breakpoints:**
| Name | Width | Notes |
|------|-------|-------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px - 1024px | Adjusted spacing |
| Desktop | > 1024px | Max-width container |

**Container:**
- Max-width: 640px (focused, single-column experience)
- Padding: 16px (mobile), 24px (desktop)
- Centered horizontally

**Mobile-First Approach:**
- All styles written mobile-first
- Progressive enhancement for larger screens
- Touch-friendly tap targets (minimum 44px)
- Thumb-zone optimization for bottom navigation

---

### 4.7 Animations & Micro-interactions

**Page Transitions:**
- Fade + slight slide (200ms ease-out)
- Progress bar smooth fill animation

**Input Interactions:**
- Focus: border color transition (150ms)
- Calculation cards: Fade in when values calculated (300ms)

**Button Interactions:**
- Hover: slight lift + shadow (150ms)
- Active: scale down slightly (50ms)
- Loading: spinner animation

**Calculation Updates:**
- Number count-up animation when values change
- Subtle pulse on calculation card when updated

**Avoid:**
- Excessive animations that slow down form completion
- Jarring transitions
- Animations that can't be disabled (accessibility)

---

## 5. PDF Design Specifications

### 5.1 PDF Overview

**Output:** Two versions generated
1. **Full Goal Plan** (Multi-page detailed document)
2. **Goal Card** (Single-page wall poster format)

**Technology:** Client-side PDF generation (jsPDF + html2canvas or react-pdf)

---

### 5.2 Full Goal Plan PDF

**Page Size:** A4 (210mm × 297mm)  
**Orientation:** Portrait  
**Margins:** 20mm all sides

**Structure:**

**Page 1: Cover**
- Elivate Network logo/brand
- "2025 Goal Plan" (or selected month for monthly)
- Member ID
- Motivational quote
- Date generated

**Page 2: Vision & Overview**
- Annual Vision statement (full text)
- Word of the Year (large, centered)
- Total Income Goal with breakdown:
  - Network Marketing: ₦X
  - Fiverr Freelancing: ₦Y
  - Combined: ₦Z

**Page 3: Network Marketing Goals**
- Current → Target (visual progression)
- Recruitment targets with calculations
- Rank advancement timeline
- Why statement

**Page 4: Fiverr Freelancing Goals**
- Skills section
- Project & income targets with calculations
- Fiverr level goal
- Why statement

**Page 5: Personal Development**
- Growth goals
- Book list (formatted nicely, numbered)
- Courses & events

**Page 6: Daily IPAs**
- Clean list of all IPAs
- "Do these EVERY DAY" emphasis
- Why statement

**Page 7: Commitment Page**
- Commitment statement
- Signature line
- Date line

**Design Elements:**
- Consistent header with Elivate branding on each page
- Page numbers
- Green accent colors for section headers
- Gold highlights for key numbers/calculations
- Clean, readable typography
- Adequate white space

---

### 5.3 Goal Card PDF (Wall Poster)

**Page Size:** A4  
**Orientation:** Portrait  
**Concept:** Visually striking single page they WANT to print and display

**Layout:**
```
┌─────────────────────────────────────┐
│         ELIVATE NETWORK             │
│        ═══════════════════          │
│           MY 2025 VISION            │
│                                     │
│    "[Annual vision summary...]"     │
│                                     │
│  ┌─────────────┬─────────────┐     │
│  │   NETWORK   │   FIVERR    │     │
│  │  MARKETING  │ FREELANCING │     │
│  ├─────────────┼─────────────┤     │
│  │ Team: X→Y   │ Projects: X │     │
│  │ Rank: X→Y   │ Income: ₦X  │     │
│  │ Income: ₦X  │ Level: X    │     │
│  └─────────────┴─────────────┘     │
│                                     │
│          MY DAILY IPAs              │
│   • IPA 1        • IPA 4           │
│   • IPA 2        • IPA 5           │
│   • IPA 3        • IPA 6           │
│                                     │
│        ══════════════════          │
│         "Word of the Year"          │
│       ═══════════════════          │
│                                     │
│  Commitment signature line          │
│                                     │
│       RISE TOGETHER. WIN TOGETHER.  │
└─────────────────────────────────────┘
```

**Design Approach:**
- Bold, poster-style typography
- High contrast for readability from distance
- Key metrics prominently displayed
- Minimal text, maximum impact
- Print-ready quality (300 DPI equivalent)

---

## 6. Content & Copy

### 6.1 UI Copy

**Member ID Screen:**
- Headline: "Welcome to Elivate"
- Subheadline: "Enter your Member ID to access the Goal Planner"
- Button: "Access Goal Planner"
- Error: "Hmm, we couldn't find that Member ID. Double-check and try again."

**Mode Selection:**
- Headline: "What would you like to plan?"
- Option 1 Title: "Set My 2025 Yearly Goals"
- Option 1 Description: "Comprehensive planning for your network marketing and freelancing business"
- Option 2 Title: "Set My Monthly Goals"
- Option 2 Description: "Focused 30-day sprint planning"

**Section Intros (Yearly):**

*Vision:*
> "Before we set specific targets, let's get clear on the bigger picture. Who are you becoming this year?"

*Network Marketing:*
> "Your network is your net worth. Let's set some ambitious targets for team growth and rank advancement."

*Fiverr Freelancing:*
> "Skills pay the bills. Let's plan how you'll build your freelance income stream on Fiverr."

*Personal Development:*
> "Leaders are readers. What will you learn this year to level up?"

*Daily IPAs:*
> "Success is built daily, not in a day. These are your non-negotiable income-producing activities."

**Calculation Display Copy:**

*Recruitment:*
> "To grow from **[X]** to **[Y]** team members, you need to recruit **[Z] people per month** — that's roughly **[W] per week**."

*Fiverr Income:*
> "To earn **₦[X]** from **[Y] projects**, each project needs to average **₦[Z]**. That's **[W] projects per month**."

**Why Prompts:**
- "What would achieving this mean for your family?"
- "Who are you proving wrong?"
- "What life are you building?"
- "What pain are you leaving behind?"
- "Who is counting on you?"

**Completion Screen:**
- Headline: "Your Goal Plan is Ready! 🎯"
- Subheadline: "You've taken the first step. Now execute relentlessly."
- Primary CTA: "Download My Goal Plan"
- Secondary CTA: "Download Goal Card (Wall Poster)"
- Motivational close: "Remember: A goal without a plan is just a wish. You now have both. Let's go."

---

### 6.2 PDF Copy

**Cover Quote Options:**
- "The only limit to our realization of tomorrow is our doubts of today." — Franklin D. Roosevelt
- "Success is not owned. It's rented. And rent is due every day."
- "Your network is your net worth."
- "Dreams don't work unless you do."

**Commitment Statement (PDF):**
> "I commit to showing up for myself and my business every single day. I will do the work when I don't feel like it. I will become the person worthy of these goals. I will rise, and I will help others rise with me. This is my year."

---

## 7. Technical Specifications

### 7.1 Technology Stack (Recommended)

**Frontend:**
- React 18+ (or Next.js for easier deployment)
- TypeScript
- Tailwind CSS (utility-first, easy responsive)
- React Hook Form (form handling)
- Zustand or React Context (session state management)

**PDF Generation:**
- @react-pdf/renderer (for complex layouts)
- OR jsPDF + html2canvas (simpler setup)

**Deployment:**
- Vercel (recommended for Next.js)
- OR Netlify
- OR any static hosting

### 7.2 State Management

**Session State (not persisted):**
```typescript
interface GoalState {
  memberId: string;
  mode: 'yearly' | 'monthly';
  currentStep: number;
  
  // Yearly goals
  yearlyGoals: {
    vision: {
      statement: string;
      wordOfYear: string;
      totalIncomeGoal: number;
    };
    networkMarketing: {
      currentTeamSize: number;
      targetTeamSize: number;
      currentRank: string;
      targetRank: string;
      quarterlyRanks: string[];
      incomeGoal: number;
      why: string;
    };
    fiverr: {
      primarySkill: string;
      secondarySkill: string;
      learningGoals: string;
      incomeGoal: number;
      projectTarget: number;
      avgProjectValue: number;
      targetLevel: string;
      reviewsGoal: number;
      why: string;
    };
    personalDev: {
      goals: string;
      books: string[];
      courses: string;
      events: string;
      why: string;
    };
    ipas: {
      activities: string[];
      why: string;
    };
    commitment: {
      reviewDay: string;
      partner: string;
      agreed: boolean;
    };
  };
  
  // Monthly goals (similar structure, simplified)
  monthlyGoals: { ... };
  
  // Calculated values
  calculations: {
    recruitmentPerMonth: number;
    recruitmentPerWeek: number;
    nmIncomePerMonth: number;
    fiverrProjectsPerMonth: number;
    fiverrAvgNeeded: number;
    // etc.
  };
}
```

### 7.3 Calculation Logic

```typescript
// Recruitment calculations
function calculateRecruitment(current: number, target: number, monthsRemaining: number = 12) {
  const needed = target - current;
  const perMonth = needed / monthsRemaining;
  const perWeek = perMonth / 4;
  return { needed, perMonth: Math.ceil(perMonth), perWeek: Math.ceil(perWeek * 10) / 10 };
}

// Income breakdown
function calculateIncomeBreakdown(annual: number) {
  return {
    monthly: annual / 12,
    weekly: annual / 52,
    daily: annual / 365
  };
}

// Fiverr project calculations
function calculateFiverrTargets(incomeGoal: number, projectCount?: number, avgValue?: number) {
  if (projectCount && incomeGoal) {
    return {
      avgNeeded: incomeGoal / projectCount,
      perMonth: projectCount / 12,
      perWeek: projectCount / 52
    };
  }
  if (avgValue && incomeGoal) {
    const projectsNeeded = Math.ceil(incomeGoal / avgValue);
    return {
      projectsNeeded,
      perMonth: projectsNeeded / 12,
      perWeek: projectsNeeded / 52
    };
  }
  return null;
}
```

### 7.4 Member ID Implementation

```typescript
// member-ids.ts - This file is updated and pushed with new members
export const VALID_MEMBER_IDS: string[] = [
  'ELV001',
  'ELV002',
  'ELV003',
  // Add more as needed
];

// validation.ts
import { VALID_MEMBER_IDS } from './member-ids';

export function validateMemberId(input: string): boolean {
  const normalized = input.toUpperCase().trim();
  return VALID_MEMBER_IDS.includes(normalized);
}
```

**Updating Member IDs:**
- Edit `member-ids.ts` file
- Push to repository
- Automatic deployment picks up changes

---

## 8. Accessibility Requirements

- All form inputs have associated labels
- Color contrast meets WCAG AA standards
- Keyboard navigation fully supported
- Focus states clearly visible
- Error messages announced to screen readers
- Touch targets minimum 44px × 44px
- Reduced motion support via `prefers-reduced-motion`

---

## 9. Future Considerations (Out of Scope v1)

- User accounts with saved goal history
- Progress tracking against goals
- Team leader dashboard to see member goal completion
- Push notification reminders
- Goal sharing to social media
- Integration with Fiverr/team CRM APIs

---

## 10. Success Metrics

**Launch Success:**
- 80%+ of members who start complete the full goal entry
- 90%+ download at least one PDF
- Positive qualitative feedback on design and usefulness

**Tracking (Anonymous):**
- Completion rate per step (identify drop-off points)
- PDF download rate
- Time to complete
- Device breakdown (mobile vs desktop)

---

## Appendix A: Wireframe Reference

*Low-fidelity wireframes should be created showing:*
1. Member ID entry screen
2. Mode selection screen
3. Example goal entry screen (with calculation display)
4. Review screen
5. Download/completion screen
6. PDF layouts (both versions)

---

## Appendix B: Member ID Format Options

| Format | Example | Pros | Cons |
|--------|---------|------|------|
| ELV + Number | ELV042 | Simple, scalable | Generic |
| Name-based | JOHN-2025-001 | Personal | Longer to type |
| Random alphanumeric | X7K9M2 | Secure | Hard to remember |

**Recommendation:** `ELV` + 3-4 digit number for simplicity.

---

*End of PRD*
