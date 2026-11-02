// ── Properties are now stored in Firebase Firestore ──────────
// Use src/firebase/propertyService.js for all property operations
// This file only contains static UI data (categories, locations, etc.)

// All property data is now loaded from Firebase — this is intentionally empty
export const properties = [];

export const categories = [
  {
    id: "houses-sale",
    label: "Houses for Sale",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    count: 0,
    filter: { category: "sale", type: "Houses for Sale" },
  },
  {
    id: "land-plots",
    label: "Land & Plots",
    icon: "MapPin",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    count: 0,
    filter: { category: "sale", type: "Land & Plots" },
  },
  {
    id: "buildings-sale",
    label: "Buildings for Sale",
    icon: "Building2",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    count: 0,
    filter: { category: "sale", type: "Buildings for Sale" },
  },
  {
    id: "shops-commercial",
    label: "Shops & Commercial",
    icon: "Store",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    count: 0,
    filter: { category: "sale", type: "Shops & Commercial" },
  },
];

export const locations = [
  "Kozhikode", "Calicut", "Kochi", "Thrissur", "Malappuram",
  "Kannur", "Palakkad", "Wayanad", "Thiruvananthapuram", "Alappuzha",
  "Kollam", "Kottayam", "Ernakulam", "Kasaragod", "Idukki",
  "Pathanamthitta", "Varkala", "Manjeri", "Perinthalmanna", "Tirur",
];

export const stats = [
  { label: "Properties Listed", value: "0", icon: "Building2" },
  { label: "Happy Clients",     value: "0", icon: "Users"     },
  { label: "Cities Covered",    value: "20+", icon: "MapPin"  },
  { label: "Years of Trust",    value: "1+",  icon: "Award"   },
];

export const testimonials = [
  {
    id: 1,
    name: "Anjali Sharma",
    role: "Home Buyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    text: "Plotora made finding my dream home so easy! The verified listings gave me confidence and the agent was extremely helpful throughout the process.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mohammed Rashid",
    role: "Property Investor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    text: "I've used multiple platforms but Plotora stands out for its genuine listings and quick response. Sold my property within 2 weeks!",
    rating: 5,
  },
  {
    id: 3,
    name: "Sunita Menon",
    role: "Tenant",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    text: "Found a perfect rental home through Plotora. The platform is very user-friendly and the support team is always available.",
    rating: 5,
  },
];

export const agents = [
  {
    id: 1,
    name: "Ravi Kumar",
    role: "Senior Property Consultant",
    phone: "+91 98765 43210",
    email: "ravi@plotora.com",
    listings: 0,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    specialization: "Luxury Villas & Commercial",
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Residential Specialist",
    phone: "+91 98765 11111",
    email: "priya@plotora.com",
    listings: 0,
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    specialization: "Homes & Apartments",
  },
  {
    id: 3,
    name: "Arun Menon",
    role: "Commercial Property Expert",
    phone: "+91 98765 22222",
    email: "arun@plotora.com",
    listings: 0,
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    specialization: "Offices & Buildings",
  },
  {
    id: 4,
    name: "Meera Krishnan",
    role: "Rental Specialist",
    phone: "+91 98765 44444",
    email: "meera@plotora.com",
    listings: 0,
    experience: "5 years",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    specialization: "Rental Properties",
  },
];
