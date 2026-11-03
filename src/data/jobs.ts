// Open positions shown in the Careers section. Add, edit or remove entries here.
// `salary` and `experience` are optional: leave them out and they simply aren't shown.
export type Job = {
  title: string;
  location: string;
  region: "India" | "Abroad";
  type: string;
  experience?: string;
  salary?: string;
};

export const jobs: Job[] = [
  { title: "Assistant Asset Manager", location: "Mangalore", region: "India", type: "Full-time", salary: "₹20,000 – ₹30,000" },
  { title: "Accountant", location: "India", region: "India", type: "Full-time" },
  { title: "Assistant Store Manager", location: "India", region: "India", type: "Full-time" },
  { title: "Civil Engineer", location: "India", region: "India", type: "Full-time" },
  { title: "Caregiver", location: "Israel", region: "Abroad", type: "Full-time" },
  { title: "Registered Nurse", location: "Abroad", region: "Abroad", type: "Full-time" },
];

// Choices in the "Didn't find your role?" form
export const experienceOptions = ["Fresher", "1 – 2 years", "3 – 5 years", "6 – 10 years", "10+ years"];
export const locationOptions = ["Remote", "Bangalore", "Mangalore", "Abroad", "Other"];
