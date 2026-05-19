export const SITE = {
  name: "Benzene Plus Academy",
  shortName: "Benzene Plus",
  tagline: "Pass JAMB & WAEC With Confidence",
  phone: "+234 803 000 0000",
  whatsapp: "2348030000000",
  email: "hello@benzeneplusacademy.ng",
  address: "12 Scholars Avenue, Ibadan, Oyo State, Nigeria",
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/top-scorers", label: "Top Scorers" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export const STATS = [
  { value: 4200, suffix: "+", label: "Students trained" },
  { value: 96, suffix: "%", label: "Success rate" },
  { value: 312, suffix: "+", label: "Top scorers" },
  { value: 14, suffix: "yrs", label: "Of excellence" },
];

export const PROGRAMS = [
  {
    code: "JAMB",
    title: "JAMB Preparation",
    blurb: "Intensive UTME drills, weekly mock CBT, and subject mastery.",
    subjects: [
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Government",
      "Literature",
    ],
    schedule: "Mon – Sat · 8am – 4pm",
    duration: "3 – 6 months",
  },
  {
    code: "WAEC",
    title: "WAEC Preparation",
    blurb: "Full SSCE coverage with past-question clinics and practicals.",
    subjects: ["All Science", "Commercial", "Arts subjects"],
    schedule: "Mon – Fri · 3pm – 6pm",
    duration: "Per term",
  },
  {
    code: "NECO",
    title: "NECO Preparation",
    blurb: "Targeted revision and exam strategy for NECO candidates.",
    subjects: ["Core + Electives"],
    schedule: "Weekends",
    duration: "10 weeks",
  },
  {
    code: "POST-UTME",
    title: "Post-UTME Coaching",
    blurb: "University-specific drills and aptitude question banks.",
    subjects: ["Use of English", "Reasoning", "Subject combinations"],
    schedule: "Holiday intensive",
    duration: "4 – 6 weeks",
  },
  {
    code: "CBT",
    title: "CBT Training",
    blurb: "Hands-on computer-based test practice in our digital lab.",
    subjects: ["Mock CBT", "Speed drills"],
    schedule: "Daily slots",
    duration: "Flexible",
  },
];

export const SCORERS = [
  { name: "Aisha Bello", exam: "JAMB", score: 342, year: 2025 },
  { name: "Chinedu Okeke", exam: "JAMB", score: 336, year: 2025 },
  { name: "Fatima Yusuf", exam: "WAEC", score: 9, year: 2024, note: "9 A1s" },
  { name: "Tunde Adebayo", exam: "JAMB", score: 329, year: 2025 },
  { name: "Grace Olamide", exam: "Post-UTME", score: 92, year: 2024 },
  { name: "Ibrahim Musa", exam: "JAMB", score: 318, year: 2024 },
  { name: "Blessing Eze", exam: "NECO", score: 8, year: 2024, note: "8 A1s" },
  { name: "David Okon", exam: "JAMB", score: 311, year: 2025 },
  { name: "Zainab Lawal", exam: "WAEC", score: 8, year: 2025, note: "8 A1s" },
  { name: "Samuel Adeyemi", exam: "JAMB", score: 305, year: 2025 },
  { name: "Halima Sani", exam: "Post-UTME", score: 89, year: 2025 },
  { name: "Emmanuel Nwosu", exam: "JAMB", score: 301, year: 2024 },
];

export const TESTIMONIALS = [
  {
    quote:
      "Benzene Plus turned my daughter's grades around. She scored 329 in JAMB — we are forever grateful.",
    author: "Mrs. Adeola O.",
    role: "Parent · Ibadan",
  },
  {
    quote:
      "The tutors here actually care. The CBT practice felt exactly like the real exam day.",
    author: "Chinedu O.",
    role: "JAMB 2025 · 336",
  },
  {
    quote:
      "From struggling in Maths to 9 A1s in WAEC. The structure here works.",
    author: "Fatima Y.",
    role: "WAEC 2024",
  },
];

export const POSTS = [
  {
    slug: "jamb-2026-registration-dates",
    title: "JAMB 2026 Registration: Dates, Fees & Centres",
    excerpt:
      "Everything candidates and parents need to know about the upcoming UTME cycle.",
    date: "2026-05-02",
    category: "Announcement",
    body: "JAMB has released the official timetable for the 2026 UTME. Registration opens on the 6th of June and closes on the 18th of July. Candidates are advised to register early at accredited CBT centres. Our academy will be conducting free registration assistance every Saturday from 9am.\n\nKey dates:\n- Registration opens: June 6\n- Registration closes: July 18\n- Mock exam: August 2\n- Main UTME: August 16 – 30",
  },
  {
    slug: "five-study-habits-for-waec",
    title: "5 Study Habits Every WAEC Candidate Needs",
    excerpt: "Small daily habits that compound into A1s by exam day.",
    date: "2026-04-21",
    category: "Study Tips",
    body: "Consistency beats cramming. In this post we walk through five compounding habits — from the 25-minute focus loop, to the past-question audit, to weekly self-mocks — that have helped over 300 of our students cross the A1 threshold.",
  },
  {
    slug: "cbt-tips-from-our-top-scorer",
    title: "CBT Tips From Our 342-Scoring JAMB Champion",
    excerpt:
      "Aisha Bello shares the routine that earned her one of Nigeria's highest UTME scores.",
    date: "2026-03-15",
    category: "Student Story",
    body: "Aisha walks through her 12-week prep plan, how she handled exam anxiety, and the three subjects she focused on most. A must-read for any 2026 candidate.",
  },
  {
    slug: "post-utme-screening-changes",
    title: "Post-UTME Screening: What's Changed This Year",
    excerpt:
      "Several Nigerian universities have updated their screening format. Here's the breakdown.",
    date: "2026-02-28",
    category: "News",
    body: "UI, OAU, UNILAG and ABU have each adjusted their Post-UTME format. We break down what's different and how to prepare.",
  },
];
