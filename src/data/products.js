// Product images - Furniture
import furn1 from "@/assets/Furniture/1.png";
import furn2 from "@/assets/Furniture/2.png";
import furn3 from "@/assets/Furniture/3.png";
import furn4 from "@/assets/Furniture/4.png";
import furn5 from "@/assets/Furniture/5.png";
import furn6 from "@/assets/Furniture/6.png";
import furn7 from "@/assets/Furniture/7.png";
import furn8 from "@/assets/Furniture/8.png";
import furn9 from "@/assets/Furniture/9.png";

// Product images - Appliances
import app10 from "@/assets/Appliances/10.png";
import app11 from "@/assets/Appliances/11.png";
import app12 from "@/assets/Appliances/12.png";
import app13 from "@/assets/Appliances/13.png";
import app14 from "@/assets/Appliances/14.png";

// Product images - Bestsellers
import best1 from "@/assets/Bestsellers/1.png";
import best3 from "@/assets/Bestsellers/3.png";
import best5 from "@/assets/Bestsellers/5.png";
import best8 from "@/assets/Bestsellers/8.png";

// ─── Constants ────────────────────────────────────────────

export const DURATION_OPTIONS = [
  { key: "1_day", label: "1 Day", short: "1D" },
  { key: "3_days", label: "3 Days", short: "3D" },
  { key: "7_days", label: "7 Days", short: "7D" },
  { key: "15_days", label: "15 Days", short: "15D" },
  { key: "1_month", label: "1 Month", short: "1M" },
  { key: "3_months", label: "3 Months", short: "3M" },
  { key: "6_months", label: "6 Months", short: "6M" },
  { key: "9_months", label: "9 Months", short: "9M" },
  { key: "12_months", label: "12 Months", short: "12M" },
];

export const CATEGORIES = [
  "All",
  "Furniture",
  "Appliances",
  "Bestsellers",
  "Short-Term Rental",
  "Complete Home Setup",
];

export const SUBCATEGORIES = {
  Appliances: [
    "Washing Machines",
    "Refrigerators",
    "ACs",
    "TVs",
    "Microwaves",
    "RO",
  ],
};

export const BEST_FOR_OPTIONS = [
  "Daily use",
  "Families",
  "Bachelors",
  "Events",
  "Short stays",
  "Complete setups",
];

export const SORT_OPTIONS = [
  { key: "popular", label: "Popular" },
  { key: "price_low", label: "Price: Low → High" },
  { key: "price_high", label: "Price: High → Low" },
  { key: "rating", label: "Top Rated" },
  { key: "newest", label: "Newest" },
];

// ─── Product Data ─────────────────────────────────────────

const products = [
  // ── Appliances: Washing Machines ──
  {
    id: "wm-top-load-01",
    category: "Appliances",
    subcategory: "Washing Machines",
    name: "Fully Automatic Top Load Washing Machine",
    image: app10,
    short_description:
      "7 kg capacity, energy efficient. Perfect for families.",
    tags: ["Bestseller", "Family pick"],
    rating: 4.8,
    pricing_by_duration: {
      "1_day": 499,
      "3_days": 1299,
      "7_days": 1999,
      "15_days": 2999,
      "1_month": 1299,
      "3_months": 1099,
      "6_months": 999,
      "9_months": 949,
      "12_months": 899,
    },
    deposit: 2000,
    stock_status: "in_stock",
    best_for: ["Daily use", "Families"],
  },
  {
    id: "wm-compact-02",
    category: "Appliances",
    subcategory: "Washing Machines",
    name: "Compact Washing Machine for Short Stay",
    image: app11,
    short_description:
      "5 kg semi-auto. Ideal for bachelors and short-term stays.",
    tags: ["Event-ready", "Flexible plans"],
    rating: 4.5,
    pricing_by_duration: {
      "1_day": 349,
      "3_days": 899,
      "7_days": 1499,
      "15_days": 2199,
      "1_month": 999,
      "3_months": 849,
      "6_months": 749,
      "9_months": 699,
      "12_months": 649,
    },
    deposit: 1500,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Short stays"],
  },
  {
    id: "wm-family-03",
    category: "Appliances",
    subcategory: "Washing Machines",
    name: "Family Size Washing Machine",
    image: app12,
    short_description: "8.5 kg front load with in-built heater. Premium wash.",
    tags: ["Family pick", "New arrival"],
    rating: 4.9,
    pricing_by_duration: {
      "1_day": 699,
      "3_days": 1799,
      "7_days": 2799,
      "15_days": 3999,
      "1_month": 1799,
      "3_months": 1499,
      "6_months": 1299,
      "9_months": 1199,
      "12_months": 1099,
    },
    deposit: 3000,
    stock_status: "in_stock",
    best_for: ["Families", "Daily use"],
  },

  // ── Appliances: Refrigerators ──
  {
    id: "fridge-single-01",
    category: "Appliances",
    subcategory: "Refrigerators",
    name: "Single Door Refrigerator",
    image: app13,
    short_description:
      "190L capacity. Energy star rated, perfect for compact kitchens.",
    tags: ["Bestseller"],
    rating: 4.7,
    pricing_by_duration: {
      "1_day": 399,
      "3_days": 999,
      "7_days": 1699,
      "15_days": 2499,
      "1_month": 999,
      "3_months": 849,
      "6_months": 749,
      "9_months": 699,
      "12_months": 649,
    },
    deposit: 2000,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Daily use"],
  },
  {
    id: "fridge-double-02",
    category: "Appliances",
    subcategory: "Refrigerators",
    name: "Double Door Refrigerator",
    image: app14,
    short_description:
      "260L frost-free. Spacious for family groceries and meal prep.",
    tags: ["Family pick"],
    rating: 4.6,
    pricing_by_duration: {
      "1_day": 599,
      "3_days": 1499,
      "7_days": 2499,
      "15_days": 3499,
      "1_month": 1499,
      "3_months": 1249,
      "6_months": 1099,
      "9_months": 999,
      "12_months": 899,
    },
    deposit: 2500,
    stock_status: "in_stock",
    best_for: ["Families", "Daily use"],
  },

  // ── Furniture ──
  {
    id: "sofa-3seat-01",
    category: "Furniture",
    subcategory: null,
    name: "3-Seater Fabric Sofa",
    image: furn3,
    short_description:
      "Premium upholstery, sturdy wooden frame. Living room essential.",
    tags: ["Bestseller", "Family pick"],
    rating: 4.8,
    pricing_by_duration: {
      "1_day": 799,
      "3_days": 1999,
      "7_days": 3499,
      "15_days": 4999,
      "1_month": 1999,
      "3_months": 1699,
      "6_months": 1499,
      "9_months": 1349,
      "12_months": 1199,
    },
    deposit: 3000,
    stock_status: "in_stock",
    best_for: ["Families", "Daily use"],
  },
  {
    id: "bed-double-01",
    category: "Furniture",
    subcategory: null,
    name: "Double Bed with Mattress",
    image: furn9,
    short_description:
      "Queen-size engineered wood bed with 6-inch foam mattress.",
    tags: ["Bestseller", "Complete setups"],
    rating: 4.9,
    pricing_by_duration: {
      "1_day": 899,
      "3_days": 2299,
      "7_days": 3999,
      "15_days": 5499,
      "1_month": 2499,
      "3_months": 2099,
      "6_months": 1799,
      "9_months": 1599,
      "12_months": 1399,
    },
    deposit: 3500,
    stock_status: "in_stock",
    best_for: ["Families", "Daily use", "Complete setups"],
  },
  {
    id: "chair-modern-01",
    category: "Furniture",
    subcategory: null,
    name: "Modern Accent Chair",
    image: furn1,
    short_description: "Sleek design with velvet upholstery. Statement piece.",
    tags: ["New arrival"],
    rating: 4.6,
    pricing_by_duration: {
      "1_day": 399,
      "3_days": 999,
      "7_days": 1599,
      "15_days": 2199,
      "1_month": 899,
      "3_months": 749,
      "6_months": 649,
      "9_months": 599,
      "12_months": 549,
    },
    deposit: 1500,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Events"],
  },
  {
    id: "study-table-01",
    category: "Furniture",
    subcategory: null,
    name: "Engineered Wood Study Table",
    image: furn7,
    short_description:
      "Spacious surface with drawer storage. WFH ready.",
    tags: ["Flexible plans"],
    rating: 4.5,
    pricing_by_duration: {
      "1_day": 299,
      "3_days": 749,
      "7_days": 1199,
      "15_days": 1699,
      "1_month": 699,
      "3_months": 599,
      "6_months": 499,
      "9_months": 449,
      "12_months": 399,
    },
    deposit: 1000,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Daily use"],
  },
  {
    id: "wardrobe-01",
    category: "Furniture",
    subcategory: null,
    name: "2-Door Wardrobe",
    image: furn8,
    short_description:
      "Ample storage with mirror. Fits all room sizes.",
    tags: ["Family pick"],
    rating: 4.7,
    pricing_by_duration: {
      "1_day": 499,
      "3_days": 1199,
      "7_days": 1999,
      "15_days": 2799,
      "1_month": 1199,
      "3_months": 999,
      "6_months": 849,
      "9_months": 799,
      "12_months": 749,
    },
    deposit: 2000,
    stock_status: "in_stock",
    best_for: ["Families", "Complete setups"],
  },
  {
    id: "bookshelf-01",
    category: "Furniture",
    subcategory: null,
    name: "Open Bookshelf",
    image: furn6,
    short_description:
      "5-tier open design. Display books, décor and essentials.",
    tags: [],
    rating: 4.4,
    pricing_by_duration: {
      "1_day": 249,
      "3_days": 649,
      "7_days": 999,
      "15_days": 1399,
      "1_month": 599,
      "3_months": 499,
      "6_months": 449,
      "9_months": 399,
      "12_months": 349,
    },
    deposit: 1000,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Daily use"],
  },
  {
    id: "dining-set-01",
    category: "Furniture",
    subcategory: null,
    name: "4-Seater Dining Table Set",
    image: furn4,
    short_description:
      "Solid wood table with 4 cushioned chairs. Family dinners made easy.",
    tags: ["Family pick", "Bestseller"],
    rating: 4.8,
    pricing_by_duration: {
      "1_day": 699,
      "3_days": 1799,
      "7_days": 2999,
      "15_days": 4299,
      "1_month": 1799,
      "3_months": 1499,
      "6_months": 1299,
      "9_months": 1149,
      "12_months": 999,
    },
    deposit: 2500,
    stock_status: "in_stock",
    best_for: ["Families", "Daily use"],
  },

  // ── Bestsellers (also in their own category) ──
  {
    id: "combo-bachelor-01",
    category: "Furniture",
    subcategory: null,
    name: "Bachelor Essentials Combo",
    image: best5,
    short_description:
      "Bed + mattress + wardrobe + study table. Everything you need.",
    tags: ["Bestseller", "Complete setups"],
    rating: 4.9,
    pricing_by_duration: {
      "1_day": 1499,
      "3_days": 3999,
      "7_days": 6999,
      "15_days": 9999,
      "1_month": 4499,
      "3_months": 3799,
      "6_months": 3299,
      "9_months": 2999,
      "12_months": 2699,
    },
    deposit: 5000,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Complete setups"],
  },
  {
    id: "office-chair-01",
    category: "Furniture",
    subcategory: null,
    name: "Ergonomic Office Chair",
    image: furn5,
    short_description:
      "Adjustable height, lumbar support. Work from home essential.",
    tags: ["Flexible plans"],
    rating: 4.6,
    pricing_by_duration: {
      "1_day": 299,
      "3_days": 749,
      "7_days": 1199,
      "15_days": 1699,
      "1_month": 749,
      "3_months": 649,
      "6_months": 549,
      "9_months": 499,
      "12_months": 449,
    },
    deposit: 1000,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Daily use"],
  },
  {
    id: "sofa-2seat-01",
    category: "Furniture",
    subcategory: null,
    name: "Compact 2-Seater Sofa",
    image: furn2,
    short_description:
      "Space-saving design with premium fabric. Great for small rooms.",
    tags: ["Event-ready"],
    rating: 4.5,
    pricing_by_duration: {
      "1_day": 599,
      "3_days": 1499,
      "7_days": 2499,
      "15_days": 3499,
      "1_month": 1499,
      "3_months": 1249,
      "6_months": 1099,
      "9_months": 999,
      "12_months": 899,
    },
    deposit: 2000,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Events", "Short stays"],
  },
];

export default products;
