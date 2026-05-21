

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);

export const EXAM_TYPES = ["JAMB", "WAEC", "NECO", "Post-UTME", "Other"];

export const JAMB_SUBJECTS = [
  "Accounting",
  "Agricultural Science",
  "Biology",
  "Chemistry",
  "Christian Religious Studies",
  "Civic Education",
  "Commerce",
  "Computer Science",
  "Economics",
  "English Language",
  "Further Mathematics",
  "Geography",
  "Government",
  "History",
  "Home Economics",
  "Islamic Religious Studies",
  "Literature in English",
  "Mathematics",
  "Physical & Health Education",
  "Physics",
  "Technical Drawing",
];

export const WAEC_NECO_SUBJECTS = [
  "Accounting",
  "Agricultural Science",
  "Animal Husbandry",
  "Biology",
  "Chemistry",
  "Christian Religious Studies",
  "Civic Education",
  "Commerce",
  "Computer Science",
  "Data Processing",
  "Economics",
  "English Language",
  "Fine Art",
  "Fisheries",
  "Food and Nutrition",
  "French",
  "Further Mathematics",
  "Geography",
  "Government",
  "Hausa",
  "Health Science",
  "History",
  "Home Economics",
  "Igbo",
  "Islamic Religious Studies",
  "Literature in English",
  "Mathematics",
  "Physical & Health Education",
  "Physics",
  "Technical Drawing",
  "Visual Art",
  "Yoruba",
];

export const WAEC_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

export const SORT_OPTIONS = [
  { value: "score-desc", label: "Score (High to Low)" },
  { value: "score-asc", label: "Score (Low to High)" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "exam-asc", label: "Exam (A–Z)" },
  { value: "exam-desc", label: "Exam (Z–A)" },
];