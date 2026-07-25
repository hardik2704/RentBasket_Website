export const SERVED_CITIES = ["Gurgaon", "Noida", "Delhi"];

// Pincode prefix → city mapping for served areas
const PINCODE_MAP = {
  // Gurgaon
  "122001": "Gurgaon", "122002": "Gurgaon", "122003": "Gurgaon",
  "122004": "Gurgaon", "122005": "Gurgaon", "122006": "Gurgaon",
  "122007": "Gurgaon", "122008": "Gurgaon", "122009": "Gurgaon",
  "122010": "Gurgaon", "122011": "Gurgaon", "122015": "Gurgaon",
  "122016": "Gurgaon", "122017": "Gurgaon", "122018": "Gurgaon",
  "122022": "Gurgaon", "122051": "Gurgaon", "122052": "Gurgaon",
  "122098": "Gurgaon", "122102": "Gurgaon",
  // Noida
  "201301": "Noida", "201302": "Noida", "201303": "Noida",
  "201304": "Noida", "201305": "Noida", "201306": "Noida",
  "201307": "Noida", "201308": "Noida", "201309": "Noida",
  "201310": "Noida", "201311": "Noida", "201312": "Noida",
  "201313": "Noida", "201314": "Noida", "201315": "Noida",
  "201316": "Noida", "201317": "Noida", "201318": "Noida",
  "201019": "Noida",
  // Delhi
  "110001": "Delhi", "110002": "Delhi", "110003": "Delhi",
  "110004": "Delhi", "110005": "Delhi", "110006": "Delhi",
  "110007": "Delhi", "110008": "Delhi", "110009": "Delhi",
  "110010": "Delhi", "110011": "Delhi", "110012": "Delhi",
  "110013": "Delhi", "110014": "Delhi", "110015": "Delhi",
  "110016": "Delhi", "110017": "Delhi", "110018": "Delhi",
  "110019": "Delhi", "110020": "Delhi", "110021": "Delhi",
  "110022": "Delhi", "110023": "Delhi", "110024": "Delhi",
  "110025": "Delhi", "110026": "Delhi", "110027": "Delhi",
  "110028": "Delhi", "110029": "Delhi", "110030": "Delhi",
  "110031": "Delhi", "110032": "Delhi", "110033": "Delhi",
  "110034": "Delhi", "110035": "Delhi", "110036": "Delhi",
  "110037": "Delhi", "110038": "Delhi", "110039": "Delhi",
  "110040": "Delhi", "110041": "Delhi", "110042": "Delhi",
  "110043": "Delhi", "110044": "Delhi", "110045": "Delhi",
  "110046": "Delhi", "110047": "Delhi", "110048": "Delhi",
  "110049": "Delhi", "110051": "Delhi", "110052": "Delhi",
  "110053": "Delhi", "110054": "Delhi", "110055": "Delhi",
  "110056": "Delhi", "110057": "Delhi", "110058": "Delhi",
  "110059": "Delhi", "110060": "Delhi", "110061": "Delhi",
  "110062": "Delhi", "110063": "Delhi", "110064": "Delhi",
  "110065": "Delhi", "110066": "Delhi", "110067": "Delhi",
  "110068": "Delhi", "110069": "Delhi", "110070": "Delhi",
  "110071": "Delhi", "110072": "Delhi", "110073": "Delhi",
  "110074": "Delhi", "110075": "Delhi", "110076": "Delhi",
  "110077": "Delhi", "110078": "Delhi", "110081": "Delhi",
  "110082": "Delhi", "110083": "Delhi", "110084": "Delhi",
  "110085": "Delhi", "110086": "Delhi", "110087": "Delhi",
  "110088": "Delhi", "110089": "Delhi", "110090": "Delhi",
  "110091": "Delhi", "110092": "Delhi", "110093": "Delhi",
  "110094": "Delhi", "110095": "Delhi", "110096": "Delhi",
};

const STATE_MAP = {
  "Gurgaon": "Haryana",
  "Noida": "Uttar Pradesh",
  "Delhi": "Delhi",
};

/**
 * Look up city and state from a 6-digit pincode.
 * Returns { city, state } if found, null otherwise.
 */
export function lookupPincode(pincode) {
  const city = PINCODE_MAP[pincode];
  if (!city) return null;
  return { city, state: STATE_MAP[city] };
}
