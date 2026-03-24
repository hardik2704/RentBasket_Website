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
import best5 from "@/assets/Bestsellers/5.png";

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

// Duration savings badge mapping
export const DURATION_BADGES = {
  "1_day": null,
  "3_days": null,
  "7_days": null,
  "15_days": null,
  "1_month": null,
  "3_months": "Save More",
  "6_months": "Most Popular",
  "9_months": "Long-Term Pick",
  "12_months": "Best Value",
};

// Default FAQ for all products
export const DEFAULT_FAQ = [
  {
    q: "Is installation included?",
    a: "Yes! Free professional installation is included with every rental. Our team will deliver, set up, and test the product at your location.",
  },
  {
    q: "Is maintenance free?",
    a: "Absolutely. All maintenance and repairs during the rental period are covered at no extra cost. Just raise a request and we'll handle it.",
  },
  {
    q: "Can I rent for just 1 day?",
    a: "Yes, we offer rentals starting from just 1 day. Perfect for events, short stays, or trial periods.",
  },
  {
    q: "Is the deposit refundable?",
    a: "Yes, the security deposit is fully refundable at the end of your rental period, subject to normal wear and tear assessment.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes! You can upgrade to a different product or plan anytime during your rental. We'll adjust the pricing accordingly.",
  },
  {
    q: "Is relocation available?",
    a: "Yes, if you're moving within our serviceable areas (Gurgaon & Noida), we'll relocate your rented items for free.",
  },
];

// ─── Product Data ─────────────────────────────────────────

const products = [
  // ── Appliances: Washing Machines ──
  {
    id: "wm-top-load-01",
    category: "Appliances",
    subcategory: "Washing Machines",
    name: "Fully Automatic Top Load Washing Machine",
    subtitle: "Reliable daily laundry support for working professionals, couples, and families.",
    image: app10,
    images: [app10],
    short_description: "7 kg capacity, energy efficient. Perfect for families.",
    tags: ["Bestseller", "Family pick"],
    rating: 4.8,
    review_count: 142,
    pricing_by_duration: {
      "1_day": 499, "3_days": 1199, "7_days": 2299, "15_days": 3999,
      "1_month": 1499, "3_months": 1299, "6_months": 1099, "9_months": 999, "12_months": 899,
    },
    deposit: 2000,
    stock_status: "in_stock",
    best_for: ["Daily use", "Families"],
    specifications: {
      "Machine Type": "Fully Automatic",
      "Loading Type": "Top Load",
      "Capacity": "7 kg",
      "Dimensions": "54 × 54 × 91 cm",
      "Power": "340W, 220-240V",
      "Spin Speed": "740 RPM",
      "Color": "Grey / White",
    },
    features: [
      { icon: "Zap", label: "Fully Automatic" },
      { icon: "ArrowUp", label: "Top Load" },
      { icon: "Leaf", label: "Energy Efficient" },
      { icon: "Minimize2", label: "Compact Footprint" },
      { icon: "Users", label: "Family Friendly" },
      { icon: "Wrench", label: "Easy to Maintain" },
    ],
    whats_included: [
      "Washing Machine (7 kg Top Load)",
      "Inlet & outlet pipe setup",
      "Professional installation",
      "Basic usage guidance",
      "Free maintenance during rental",
    ],
    rental_terms: "Rental pricing depends on your selected duration. Minimum lock-in applies based on chosen plan. Early termination may apply for plans under 3 months. Deposit is fully refundable at the end of the rental period.",
    care_support: "All maintenance and repairs are included during your rental at no extra cost. Simply raise a service request through WhatsApp or app and our team will resolve it within 24–48 hours.",
    related_product_ids: ["wm-compact-02", "wm-family-03", "fridge-single-01", "combo-bachelor-01"],
  },
  {
    id: "wm-compact-02",
    category: "Appliances",
    subcategory: "Washing Machines",
    name: "Compact Washing Machine for Short Stay",
    subtitle: "Lightweight and efficient. Ideal for bachelors, PG stays, and short-term rentals.",
    image: app11,
    images: [app11],
    short_description: "5 kg semi-auto. Ideal for bachelors and short-term stays.",
    tags: ["Event-ready", "Flexible plans"],
    rating: 4.5,
    review_count: 87,
    pricing_by_duration: {
      "1_day": 349, "3_days": 899, "7_days": 1499, "15_days": 2199,
      "1_month": 999, "3_months": 849, "6_months": 749, "9_months": 699, "12_months": 649,
    },
    deposit: 1500,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Short stays"],
    specifications: {
      "Machine Type": "Semi-Automatic",
      "Loading Type": "Top Load",
      "Capacity": "5 kg",
      "Dimensions": "46 × 46 × 82 cm",
      "Power": "280W, 220-240V",
      "Spin Speed": "650 RPM",
      "Color": "White",
    },
    features: [
      { icon: "Zap", label: "Semi-Automatic" },
      { icon: "ArrowUp", label: "Top Load" },
      { icon: "Leaf", label: "Energy Efficient" },
      { icon: "Minimize2", label: "Compact Size" },
      { icon: "Clock", label: "Short-Term Ready" },
      { icon: "Wrench", label: "Easy to Maintain" },
    ],
    whats_included: [
      "Washing Machine (5 kg Semi-Auto)",
      "Inlet & outlet pipe setup",
      "Professional installation",
      "Basic usage guidance",
      "Free maintenance during rental",
    ],
    rental_terms: "Rental pricing depends on your selected duration. Ideal for short stays and events. Flexible lock-in options available.",
    care_support: "All maintenance included. Raise a request via WhatsApp and we'll resolve within 24–48 hours.",
    related_product_ids: ["wm-top-load-01", "wm-family-03", "fridge-single-01", "sofa-3seat-01"],
  },
  {
    id: "wm-family-03",
    category: "Appliances",
    subcategory: "Washing Machines",
    name: "Family Size Washing Machine",
    subtitle: "Premium front load with in-built heater. Built for large families and heavy loads.",
    image: app12,
    images: [app12],
    short_description: "8.5 kg front load with in-built heater. Premium wash.",
    tags: ["Family pick", "New arrival"],
    rating: 4.9,
    review_count: 63,
    pricing_by_duration: {
      "1_day": 699, "3_days": 1799, "7_days": 2799, "15_days": 3999,
      "1_month": 1799, "3_months": 1499, "6_months": 1299, "9_months": 1199, "12_months": 1099,
    },
    deposit: 3000,
    stock_status: "in_stock",
    best_for: ["Families", "Daily use"],
    specifications: {
      "Machine Type": "Fully Automatic",
      "Loading Type": "Front Load",
      "Capacity": "8.5 kg",
      "Dimensions": "60 × 58 × 85 cm",
      "Power": "450W, 220-240V",
      "Spin Speed": "1200 RPM",
      "Color": "Silver",
      "Special": "In-built Heater",
    },
    features: [
      { icon: "Zap", label: "Fully Automatic" },
      { icon: "ArrowDown", label: "Front Load" },
      { icon: "Thermometer", label: "In-built Heater" },
      { icon: "Users", label: "Family Friendly" },
      { icon: "Leaf", label: "Energy Efficient" },
      { icon: "Wrench", label: "Easy to Maintain" },
    ],
    whats_included: [
      "Washing Machine (8.5 kg Front Load)",
      "Inlet & outlet pipe setup",
      "Professional installation",
      "Basic usage guidance",
      "Free maintenance during rental",
    ],
    rental_terms: "Rental pricing based on selected duration. Premium deposit applicable. Flexible plans from 1 day to 12 months.",
    care_support: "All maintenance and repairs included at no extra cost during your rental period.",
    related_product_ids: ["wm-top-load-01", "wm-compact-02", "fridge-double-02", "combo-bachelor-01"],
  },

  // ── Appliances: Refrigerators ──
  {
    id: "fridge-single-01",
    category: "Appliances",
    subcategory: "Refrigerators",
    name: "Single Door Refrigerator",
    subtitle: "Compact cooling for small kitchens. Energy star rated for efficient daily use.",
    image: app13,
    images: [app13],
    short_description: "190L capacity. Energy star rated, perfect for compact kitchens.",
    tags: ["Bestseller"],
    rating: 4.7,
    review_count: 198,
    pricing_by_duration: {
      "1_day": 399, "3_days": 999, "7_days": 1699, "15_days": 2499,
      "1_month": 999, "3_months": 849, "6_months": 749, "9_months": 699, "12_months": 649,
    },
    deposit: 2000,
    stock_status: "in_stock",
    best_for: ["Bachelors", "Daily use"],
    specifications: {
      "Type": "Single Door", "Capacity": "190 Litres", "Dimensions": "52 × 55 × 125 cm",
      "Power": "90W, 220-240V", "Star Rating": "4 Star", "Color": "Silver",
    },
    features: [
      { icon: "Snowflake", label: "Quick Cool" },
      { icon: "Leaf", label: "Energy Efficient" },
      { icon: "Minimize2", label: "Compact" },
      { icon: "Lock", label: "Stabilizer Free" },
      { icon: "Wrench", label: "Easy Maintenance" },
      { icon: "Zap", label: "Low Power" },
    ],
    whats_included: ["Single Door Refrigerator (190L)", "Power cord & plug", "Shelves & trays", "Installation", "Free maintenance"],
    rental_terms: "Flexible rental from 1 day to 12 months. Deposit refundable.",
    care_support: "All maintenance included. 24–48 hour response time.",
    related_product_ids: ["fridge-double-02", "wm-top-load-01", "combo-bachelor-01", "sofa-3seat-01"],
  },
  {
    id: "fridge-double-02",
    category: "Appliances",
    subcategory: "Refrigerators",
    name: "Double Door Refrigerator",
    subtitle: "Spacious frost-free storage for family groceries and meal prep.",
    image: app14,
    images: [app14],
    short_description: "260L frost-free. Spacious for family groceries and meal prep.",
    tags: ["Family pick"],
    rating: 4.6,
    review_count: 114,
    pricing_by_duration: {
      "1_day": 599, "3_days": 1499, "7_days": 2499, "15_days": 3499,
      "1_month": 1499, "3_months": 1249, "6_months": 1099, "9_months": 999, "12_months": 899,
    },
    deposit: 2500,
    stock_status: "in_stock",
    best_for: ["Families", "Daily use"],
    specifications: {
      "Type": "Double Door", "Capacity": "260 Litres", "Dimensions": "55 × 62 × 165 cm",
      "Power": "120W, 220-240V", "Star Rating": "3 Star", "Defrost": "Frost Free", "Color": "Steel Grey",
    },
    features: [
      { icon: "Snowflake", label: "Frost Free" },
      { icon: "Users", label: "Family Size" },
      { icon: "Leaf", label: "Energy Efficient" },
      { icon: "Layers", label: "Multi-Compartment" },
      { icon: "Wrench", label: "Easy Maintenance" },
      { icon: "Lock", label: "Stabilizer Free" },
    ],
    whats_included: ["Double Door Refrigerator (260L)", "Power cord & plug", "Shelves & trays", "Installation", "Free maintenance"],
    rental_terms: "Flexible rental plans. Deposit fully refundable.",
    care_support: "All maintenance and repairs covered at no extra cost.",
    related_product_ids: ["fridge-single-01", "wm-family-03", "combo-bachelor-01", "dining-set-01"],
  },

  // ── Furniture ──
  {
    id: "sofa-3seat-01",
    category: "Furniture", subcategory: null,
    name: "3-Seater Fabric Sofa",
    subtitle: "Premium upholstery, sturdy wooden frame. The living room essential.",
    image: furn3, images: [furn3],
    short_description: "Premium upholstery, sturdy wooden frame. Living room essential.",
    tags: ["Bestseller", "Family pick"], rating: 4.8, review_count: 231,
    pricing_by_duration: {
      "1_day": 799, "3_days": 1999, "7_days": 3499, "15_days": 4999,
      "1_month": 1999, "3_months": 1699, "6_months": 1499, "9_months": 1349, "12_months": 1199,
    },
    deposit: 3000, stock_status: "in_stock", best_for: ["Families", "Daily use"],
    specifications: { "Seating": "3-Seater", "Material": "Fabric Upholstery", "Frame": "Solid Wood", "Dimensions": "190 × 80 × 85 cm", "Color": "Grey / Blue" },
    features: [
      { icon: "Sofa", label: "Premium Comfort" }, { icon: "Users", label: "3-Seater" },
      { icon: "Shield", label: "Sturdy Frame" }, { icon: "Palette", label: "Premium Fabric" },
      { icon: "Minimize2", label: "Space Efficient" }, { icon: "Wrench", label: "Easy Maintenance" },
    ],
    whats_included: ["3-Seater Fabric Sofa", "Cushions", "Delivery & placement", "Free maintenance"],
    rental_terms: "Flexible rental from 1 day to 12 months.", care_support: "All maintenance included.",
    related_product_ids: ["sofa-2seat-01", "bed-double-01", "chair-modern-01", "combo-bachelor-01"],
  },
  {
    id: "bed-double-01",
    category: "Furniture", subcategory: null,
    name: "Double Bed with Mattress",
    subtitle: "Queen-size engineered wood bed with 6-inch foam mattress. Sleep comfortably.",
    image: furn9, images: [furn9],
    short_description: "Queen-size engineered wood bed with 6-inch foam mattress.",
    tags: ["Bestseller", "Complete setups"], rating: 4.9, review_count: 312,
    pricing_by_duration: {
      "1_day": 899, "3_days": 2299, "7_days": 3999, "15_days": 5499,
      "1_month": 2499, "3_months": 2099, "6_months": 1799, "9_months": 1599, "12_months": 1399,
    },
    deposit: 3500, stock_status: "in_stock", best_for: ["Families", "Daily use", "Complete setups"],
    specifications: { "Size": "Queen (60 × 78 in)", "Material": "Engineered Wood", "Mattress": "6-inch Foam", "Dimensions": "200 × 160 × 45 cm", "Weight Capacity": "250 kg" },
    features: [
      { icon: "Bed", label: "Queen Size" }, { icon: "Layers", label: "With Mattress" },
      { icon: "Shield", label: "Strong Frame" }, { icon: "Users", label: "Couples / Family" },
      { icon: "Minimize2", label: "Under-bed Storage" }, { icon: "Wrench", label: "Easy Maintenance" },
    ],
    whats_included: ["Double Bed Frame", "6-inch Foam Mattress", "Assembly & installation", "Free maintenance"],
    rental_terms: "Flexible plans. Deposit refundable.", care_support: "Maintenance included. 24–48 hour response.",
    related_product_ids: ["wardrobe-01", "study-table-01", "sofa-3seat-01", "combo-bachelor-01"],
  },
  {
    id: "chair-modern-01",
    category: "Furniture", subcategory: null,
    name: "Modern Accent Chair",
    subtitle: "Sleek velvet upholstery with gold-tipped legs. A statement piece for any room.",
    image: furn1, images: [furn1],
    short_description: "Sleek design with velvet upholstery. Statement piece.",
    tags: ["New arrival"], rating: 4.6, review_count: 56,
    pricing_by_duration: {
      "1_day": 399, "3_days": 999, "7_days": 1599, "15_days": 2199,
      "1_month": 899, "3_months": 749, "6_months": 649, "9_months": 599, "12_months": 549,
    },
    deposit: 1500, stock_status: "in_stock", best_for: ["Bachelors", "Events"],
    specifications: { "Material": "Velvet", "Frame": "Metal with Gold Tips", "Dimensions": "65 × 60 × 85 cm", "Color": "Charcoal" },
    features: [
      { icon: "Gem", label: "Premium Velvet" }, { icon: "Palette", label: "Statement Design" },
      { icon: "Minimize2", label: "Compact" }, { icon: "Wrench", label: "Easy Care" },
      { icon: "Shield", label: "Sturdy" }, { icon: "Star", label: "Modern Look" },
    ],
    whats_included: ["Accent Chair", "Delivery & placement", "Free maintenance"],
    rental_terms: "Flexible rental. Minimum 1 day.", care_support: "Full maintenance support included.",
    related_product_ids: ["sofa-3seat-01", "sofa-2seat-01", "study-table-01", "bookshelf-01"],
  },
  {
    id: "study-table-01",
    category: "Furniture", subcategory: null,
    name: "Engineered Wood Study Table",
    subtitle: "Spacious surface with drawer storage. Work from home ready.",
    image: furn7, images: [furn7],
    short_description: "Spacious surface with drawer storage. WFH ready.",
    tags: ["Flexible plans"], rating: 4.5, review_count: 89,
    pricing_by_duration: {
      "1_day": 299, "3_days": 749, "7_days": 1199, "15_days": 1699,
      "1_month": 699, "3_months": 599, "6_months": 499, "9_months": 449, "12_months": 399,
    },
    deposit: 1000, stock_status: "in_stock", best_for: ["Bachelors", "Daily use"],
    specifications: { "Material": "Engineered Wood", "Dimensions": "100 × 50 × 75 cm", "Storage": "1 Drawer", "Color": "Walnut" },
    features: [
      { icon: "Monitor", label: "WFH Ready" }, { icon: "Layers", label: "With Drawer" },
      { icon: "Minimize2", label: "Compact" }, { icon: "Shield", label: "Sturdy Top" },
      { icon: "Wrench", label: "Easy Care" }, { icon: "Palette", label: "Clean Design" },
    ],
    whats_included: ["Study Table", "Delivery & assembly", "Free maintenance"],
    rental_terms: "Rent from 1 day to 12 months.", care_support: "Maintenance included.",
    related_product_ids: ["office-chair-01", "bookshelf-01", "bed-double-01", "combo-bachelor-01"],
  },
  {
    id: "wardrobe-01",
    category: "Furniture", subcategory: null,
    name: "2-Door Wardrobe",
    subtitle: "Ample storage with mirror. Fits all room sizes.",
    image: furn8, images: [furn8],
    short_description: "Ample storage with mirror. Fits all room sizes.",
    tags: ["Family pick"], rating: 4.7, review_count: 145,
    pricing_by_duration: {
      "1_day": 499, "3_days": 1199, "7_days": 1999, "15_days": 2799,
      "1_month": 1199, "3_months": 999, "6_months": 849, "9_months": 799, "12_months": 749,
    },
    deposit: 2000, stock_status: "in_stock", best_for: ["Families", "Complete setups"],
    specifications: { "Doors": "2-Door", "Material": "Engineered Wood", "Dimensions": "90 × 50 × 180 cm", "Mirror": "Yes", "Color": "Brown" },
    features: [
      { icon: "DoorOpen", label: "2-Door" }, { icon: "Layers", label: "Multi-Shelf" },
      { icon: "Mirror", label: "With Mirror" }, { icon: "Users", label: "Family Size" },
      { icon: "Shield", label: "Sturdy Build" }, { icon: "Wrench", label: "Easy Care" },
    ],
    whats_included: ["2-Door Wardrobe", "Mirror attachment", "Assembly", "Free maintenance"],
    rental_terms: "Flexible plans. Deposit refundable.", care_support: "Full maintenance support included.",
    related_product_ids: ["bed-double-01", "study-table-01", "combo-bachelor-01", "bookshelf-01"],
  },
  {
    id: "bookshelf-01",
    category: "Furniture", subcategory: null,
    name: "Open Bookshelf",
    subtitle: "5-tier open design. Display books, décor and essentials.",
    image: furn6, images: [furn6],
    short_description: "5-tier open design. Display books, décor and essentials.",
    tags: [], rating: 4.4, review_count: 42,
    pricing_by_duration: {
      "1_day": 249, "3_days": 649, "7_days": 999, "15_days": 1399,
      "1_month": 599, "3_months": 499, "6_months": 449, "9_months": 399, "12_months": 349,
    },
    deposit: 1000, stock_status: "in_stock", best_for: ["Bachelors", "Daily use"],
    specifications: { "Shelves": "5-Tier Open", "Material": "Engineered Wood", "Dimensions": "60 × 30 × 150 cm", "Color": "Walnut" },
    features: [
      { icon: "BookOpen", label: "5-Tier" }, { icon: "Minimize2", label: "Compact" },
      { icon: "Palette", label: "Modern Look" }, { icon: "Shield", label: "Sturdy" },
      { icon: "Wrench", label: "Easy Care" }, { icon: "Layers", label: "Open Design" },
    ],
    whats_included: ["Open Bookshelf", "Assembly", "Free maintenance"],
    rental_terms: "Rent from 1 day to 12 months.", care_support: "Maintenance included.",
    related_product_ids: ["study-table-01", "wardrobe-01", "chair-modern-01", "office-chair-01"],
  },
  {
    id: "dining-set-01",
    category: "Furniture", subcategory: null,
    name: "4-Seater Dining Table Set",
    subtitle: "Solid wood table with 4 cushioned chairs. Family dinners made easy.",
    image: furn4, images: [furn4],
    short_description: "Solid wood table with 4 cushioned chairs. Family dinners made easy.",
    tags: ["Family pick", "Bestseller"], rating: 4.8, review_count: 167,
    pricing_by_duration: {
      "1_day": 699, "3_days": 1799, "7_days": 2999, "15_days": 4299,
      "1_month": 1799, "3_months": 1499, "6_months": 1299, "9_months": 1149, "12_months": 999,
    },
    deposit: 2500, stock_status: "in_stock", best_for: ["Families", "Daily use"],
    specifications: { "Seating": "4-Seater", "Table Material": "Solid Wood", "Chair Material": "Wood + Cushion", "Table Size": "120 × 75 × 76 cm" },
    features: [
      { icon: "UtensilsCrossed", label: "Dining Set" }, { icon: "Users", label: "4-Seater" },
      { icon: "Shield", label: "Solid Wood" }, { icon: "Palette", label: "Cushioned Chairs" },
      { icon: "Minimize2", label: "Space Efficient" }, { icon: "Wrench", label: "Easy Care" },
    ],
    whats_included: ["Dining Table", "4 Cushioned Chairs", "Assembly", "Free maintenance"],
    rental_terms: "Flexible duration plans available.", care_support: "Full maintenance support.",
    related_product_ids: ["sofa-3seat-01", "bed-double-01", "wardrobe-01", "combo-bachelor-01"],
  },
  {
    id: "combo-bachelor-01",
    category: "Furniture", subcategory: null,
    name: "Bachelor Essentials Combo",
    subtitle: "Bed + mattress + wardrobe + study table. Everything you need in one package.",
    image: best5, images: [best5],
    short_description: "Bed + mattress + wardrobe + study table. Everything you need.",
    tags: ["Bestseller", "Complete setups"], rating: 4.9, review_count: 278,
    pricing_by_duration: {
      "1_day": 1499, "3_days": 3999, "7_days": 6999, "15_days": 9999,
      "1_month": 4499, "3_months": 3799, "6_months": 3299, "9_months": 2999, "12_months": 2699,
    },
    deposit: 5000, stock_status: "in_stock", best_for: ["Bachelors", "Complete setups"],
    specifications: { "Package": "4-piece Combo", "Includes": "Bed, Mattress, Wardrobe, Study Table", "Ideal For": "1BHK / Studio" },
    features: [
      { icon: "Package", label: "Complete Combo" }, { icon: "Bed", label: "Bed + Mattress" },
      { icon: "DoorOpen", label: "Wardrobe" }, { icon: "Monitor", label: "Study Table" },
      { icon: "Tag", label: "Best Value" }, { icon: "Wrench", label: "Full Support" },
    ],
    whats_included: ["Double Bed", "Foam Mattress", "2-Door Wardrobe", "Study Table", "Assembly for all items", "Free maintenance"],
    rental_terms: "Combo pricing offers best value. All items rented as a package.", care_support: "Full maintenance for all combo items.",
    related_product_ids: ["bed-double-01", "wardrobe-01", "study-table-01", "office-chair-01"],
  },
  {
    id: "office-chair-01",
    category: "Furniture", subcategory: null,
    name: "Ergonomic Office Chair",
    subtitle: "Adjustable height with lumbar support. The work-from-home essential.",
    image: furn5, images: [furn5],
    short_description: "Adjustable height, lumbar support. Work from home essential.",
    tags: ["Flexible plans"], rating: 4.6, review_count: 93,
    pricing_by_duration: {
      "1_day": 299, "3_days": 749, "7_days": 1199, "15_days": 1699,
      "1_month": 749, "3_months": 649, "6_months": 549, "9_months": 499, "12_months": 449,
    },
    deposit: 1000, stock_status: "in_stock", best_for: ["Bachelors", "Daily use"],
    specifications: { "Type": "Ergonomic", "Material": "Mesh + Foam", "Adjustable Height": "Yes", "Lumbar Support": "Yes", "Wheels": "5 Castor" },
    features: [
      { icon: "Monitor", label: "WFH Ready" }, { icon: "ArrowUpDown", label: "Adjustable" },
      { icon: "Shield", label: "Lumbar Support" }, { icon: "RotateCw", label: "360° Swivel" },
      { icon: "Wrench", label: "Easy Care" }, { icon: "Minimize2", label: "Compact" },
    ],
    whats_included: ["Ergonomic Chair", "Assembly", "Free maintenance"],
    rental_terms: "Rent from 1 day to 12 months.", care_support: "Maintenance included.",
    related_product_ids: ["study-table-01", "bookshelf-01", "combo-bachelor-01", "chair-modern-01"],
  },
  {
    id: "sofa-2seat-01",
    category: "Furniture", subcategory: null,
    name: "Compact 2-Seater Sofa",
    subtitle: "Space-saving design with premium fabric. Great for small rooms and studios.",
    image: furn2, images: [furn2],
    short_description: "Space-saving design with premium fabric. Great for small rooms.",
    tags: ["Event-ready"], rating: 4.5, review_count: 76,
    pricing_by_duration: {
      "1_day": 599, "3_days": 1499, "7_days": 2499, "15_days": 3499,
      "1_month": 1499, "3_months": 1249, "6_months": 1099, "9_months": 999, "12_months": 899,
    },
    deposit: 2000, stock_status: "in_stock", best_for: ["Bachelors", "Events", "Short stays"],
    specifications: { "Seating": "2-Seater", "Material": "Premium Fabric", "Frame": "Wood", "Dimensions": "140 × 75 × 80 cm" },
    features: [
      { icon: "Sofa", label: "Compact" }, { icon: "Palette", label: "Premium Fabric" },
      { icon: "Shield", label: "Sturdy Frame" }, { icon: "Minimize2", label: "Space Saving" },
      { icon: "Clock", label: "Event Ready" }, { icon: "Wrench", label: "Easy Care" },
    ],
    whats_included: ["2-Seater Sofa", "Cushions", "Delivery & placement", "Free maintenance"],
    rental_terms: "Flexible rental plans available.", care_support: "Full maintenance support.",
    related_product_ids: ["sofa-3seat-01", "chair-modern-01", "bed-double-01", "combo-bachelor-01"],
  },
];

// ─── Helpers ──────────────────────────────────────────────

export const getProductById = (id) => products.find((p) => p.id === id);

export const getRelatedProducts = (productId) => {
  const product = getProductById(productId);
  if (!product) return [];
  return product.related_product_ids
    .map((rid) => getProductById(rid))
    .filter(Boolean);
};

export default products;
