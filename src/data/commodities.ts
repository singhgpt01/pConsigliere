export interface CommoditySpec {
  label: string;
  val: string;
}

export type CommodityCategoryType = 'energy' | 'industrial' | 'agriculture';

export interface CommodityItem {
  id: string;
  category: CommodityCategoryType;
  categoryLabel: string;
  name: string;
  tagline: string;
  overview: string;
  featured?: boolean;
  specs: CommoditySpec[];
  availabilityNote: string;
}

export interface DivisionItem {
  id: string;
  name: string;
  label: string;
  description: string;
  primaryAction: string;
  anchor?: string;
  isPending?: boolean;
}

export interface ApproachStep {
  number: string;
  title: string;
  description: string;
}

export interface PillarItem {
  title: string;
  description: string;
}

export interface BrandInfo {
  name: string;
  legalName: string;
  domain: string;
  positioning: string;
  supportingStatement: string;
  role: string;
  contactEmail: string;
  deskEmail: string;
}

export const brandData: BrandInfo = {
  name: "CONSIGLIERE HOLDINGS",
  legalName: "Consigliere Holdings Ltd.",
  domain: "https://consigliereholdings.com",
  positioning: "Facilitating Global Commodity Trade.",
  supportingStatement: "Connecting Markets. Facilitating Opportunity.",
  role: "Commercial Facilitator & Intermediary",
  contactEmail: "enquiries@consigliereholdings.com",
  deskEmail: "commercial@consigliereholdings.com"
};

export const divisionsData: DivisionItem[] = [
  {
    id: "commodities",
    name: "CONSIGLIERE COMMODITIES",
    label: "Operating Division",
    description: "Facilitating commercial opportunities and counterparty engagement across selected energy, industrial, and agricultural commodity markets worldwide.",
    primaryAction: "Explore Commodities",
    anchor: "#commodities"
  },
  {
    id: "technologies",
    name: "CONSIGLIERE TECHNOLOGIES",
    label: "Under Formal Formation",
    description: "A dedicated division within the Consigliere Holdings umbrella. Further information will be published as its commercial activities and operational framework are formally established.",
    primaryAction: "Division Overview",
    isPending: true
  }
];

export const commoditiesData: CommodityItem[] = [
  // --- ENERGY ---
  {
    id: "en590",
    category: "energy",
    categoryLabel: "Energy",
    name: "EN590 10 PPM Ultra-Low-Sulphur Diesel",
    tagline: "Refined Automotive Gasoil (Euro 5/6 Standard)",
    overview: "Facilitating supply relationships for high-specification automotive gasoil meeting European EN 590 standards with maximum 10 mg/kg sulfur content.",
    featured: true,
    specs: [
      { label: "Standard", val: "EN 590 / Euro 5 & Euro 6" },
      { label: "Sulphur Content", val: "Max 10 PPM (mg/kg)" },
      { label: "Cetane Number", val: "Min 51.0" },
      { label: "Terms Handled", val: "CIF / FOB (Subject to mandate)" }
    ],
    availabilityNote: "Subject to verified refinery allocation and counterparty due diligence."
  },
  {
    id: "jet-a1",
    category: "energy",
    categoryLabel: "Energy",
    name: "Jet A-1 Aviation Fuel",
    tagline: "Aviation Turbine Fuel (ASTM D1655 / Def Stan 91-091)",
    overview: "Commercial coordination for commercial and cargo aviation kerosene fuel grades, connecting certified producers with international procurement entities.",
    specs: [
      { label: "Specification", val: "ASTM D1655 / AFQRJOS Check List" },
      { label: "Flash Point", val: "Min 38°C" },
      { label: "Freeze Point", val: "Max -47°C" },
      { label: "Inspection", val: "Independent surveyor (SGS/Saybolt)" }
    ],
    availabilityNote: "Facilitated on an off-take and spot basis for qualified aviation entities."
  },
  {
    id: "crude-oil",
    category: "energy",
    categoryLabel: "Energy",
    name: "Crude Oil",
    tagline: "Light Sweet & Medium Sour Grades",
    overview: "Facilitating commercial engagement between sovereign producers, national oil companies, and qualified international refiners for light sweet and medium sour crude streams.",
    specs: [
      { label: "Origin Base", val: "Non-sanctioned international basins" },
      { label: "Delivery", val: "CIF ASWP / FOB Terminal" },
      { label: "Allocation", val: "Direct legal mandate verification" },
      { label: "Documentation", val: "Standard bilateral SPA execution" }
    ],
    availabilityNote: "Subject to strict government sanctions screening and counterparty qualification."
  },
  {
    id: "refined-petroleum",
    category: "energy",
    categoryLabel: "Energy",
    name: "Other Refined Petroleum Products",
    tagline: "Naphtha, Fuel Oil & Bitumen Grades",
    overview: "Intermediation for downstream petroleum derivatives including Virgin Naphtha, High/Low Sulfur Fuel Oil, and Road Bitumen Grades (60/70, 80/100).",
    specs: [
      { label: "Products", val: "Fuel Oil, Bitumen 60/70, Naphtha" },
      { label: "Packaging", val: "Bulk vessel / Drum / Container" },
      { label: "Terms", val: "FOB / CIF by mutual agreement" }
    ],
    availabilityNote: "Facilitation undertaken subject to confirmed producer mandate."
  },

  // --- INDUSTRIAL COMMODITIES ---
  {
    id: "sulphur",
    category: "industrial",
    categoryLabel: "Industrial Commodities",
    name: "Sulphur (Granular / Formed)",
    tagline: "Industrial & Chemical Grade (99.5%+ Purity)",
    overview: "Connecting chemical manufacturing, fertilizer producers, and industrial processors with international bulk granular and pastille sulphur supply lines.",
    featured: true,
    specs: [
      { label: "Purity", val: "99.5% - 99.8% Minimum" },
      { label: "Form", val: "Granular / Flakes / Pastilles" },
      { label: "Application", val: "Sulfuric acid, fertilizer manufacturing" },
      { label: "Shipment", val: "Bulk carrier parcels (Handysize/Supramax)" }
    ],
    availabilityNote: "Commercial facilitation across established bulk logistics channels."
  },
  {
    id: "urea-fertilizers",
    category: "industrial",
    categoryLabel: "Industrial Commodities",
    name: "Urea & Selected Fertilizers",
    tagline: "Granular / Prilled Agricultural & Technical Grade",
    overview: "Facilitating cross-border commercial contracts for technical and agricultural nitrogen fertilizers, principally Granular Urea N46% and compound formulations.",
    specs: [
      { label: "Nitrogen Content", val: "46.0% Minimum" },
      { label: "Biuret", val: "1.0% Maximum" },
      { label: "Form", val: "Granular / Prilled bulk & big bags" }
    ],
    availabilityNote: "Supply engagement arranged with verified manufacturing sources."
  },
  {
    id: "base-oils",
    category: "industrial",
    categoryLabel: "Industrial Commodities",
    name: "Base Oils",
    tagline: "Group I, Group II & Group III Lubricant Feedstocks",
    overview: "Commercial intermediation connecting lubricant blenders and industrial compounders with virgin base oil fractions.",
    specs: [
      { label: "Groups Handled", val: "Group I (SN 150/500), Group II, Group III" },
      { label: "Transport", val: "Flexitanks, ISO tanks, bulk parcel" }
    ],
    availabilityNote: "Arranged against formal specifications and commercial requirement."
  },
  {
    id: "metals",
    category: "industrial",
    categoryLabel: "Industrial Commodities",
    name: "Ferrous & Non-Ferrous Metals",
    tagline: "Copper Cathodes, Aluminium Ingot & Industrial Minerals",
    overview: "Facilitating bilateral trade relationships for industrial refined metals, scrap feedstocks, and strategic mineral ores, subject to verified mandate.",
    specs: [
      { label: "Materials", val: "Copper Grade A (99.99%), Aluminium, Zinc" },
      { label: "Assay", val: "Standard international surveyor assay (Alex Stewart / SGS)" }
    ],
    availabilityNote: "Exclusively facilitated under transparent seller mandate representation."
  },

  // --- AGRICULTURAL COMMODITIES ---
  {
    id: "sugar",
    category: "agriculture",
    categoryLabel: "Agricultural Commodities",
    name: "Sugar (ICUMSA 45 & Raw Cane)",
    tagline: "Refined White Cane Sugar & VHP Raw",
    overview: "Intermediation for bulk cane sugar shipments, linking institutional food processors, state procurement agencies, and global distributors with established producing mills.",
    featured: true,
    specs: [
      { label: "Grades", val: "ICUMSA 45 (Refined White), Raw Cane 600-1200" },
      { label: "Polarization", val: "99.80% Min (ICUMSA 45)" },
      { label: "Packaging", val: "50 KG poly-lined bags / Bulk breakbulk" },
      { label: "Origin Base", val: "Brazil, Thailand, and verified origins" }
    ],
    availabilityNote: "Facilitated through verified mill mandates and export corridors."
  },
  {
    id: "edible-oils",
    category: "agriculture",
    categoryLabel: "Agricultural Commodities",
    name: "Edible Oils",
    tagline: "Crude & Refined Vegetable Oils",
    overview: "Commercial facilitation across vegetable oil supply chains, including RBD Palm Olein, Refined Sunflower Oil, and Soybean Oil for consumer bottling and food manufacture.",
    specs: [
      { label: "Varieties", val: "RBD Palm Olein, Sunflower Oil, Soybean Oil" },
      { label: "Delivery", val: "Flexitank, Bulk Vessel, Jerry Cans" }
    ],
    availabilityNote: "Engagement structured against confirmed commercial purchase intent."
  },
  {
    id: "rice-grains",
    category: "agriculture",
    categoryLabel: "Agricultural Commodities",
    name: "Rice & Selected Agricultural Products",
    tagline: "Milled Rice, Milling Wheat & Yellow Corn",
    overview: "Connecting international grain importers, food security entities, and distributors with agricultural origins across South America and South Asia.",
    specs: [
      { label: "Categories", val: "Non-Basmati Rice, Basmati, Yellow Maize (Corn)" },
      { label: "Standard", val: "Fit for human consumption, phytosanitary cert" }
    ],
    availabilityNote: "Facilitated subject to seasonal harvest availability and export quotas."
  }
];

export const approachStepsData: ApproachStep[] = [
  {
    number: "01",
    title: "Understand the Requirement",
    description: "Thoroughly define product specifications, required quantities, target destination port, preferred delivery incoterms (CIF/FOB), and overarching commercial objectives."
  },
  {
    number: "02",
    title: "Align Relevant Counterparties",
    description: "Facilitate direct engagement between qualified market participants. Clarify commercial roles, mandate representation, legal responsibilities, and procedural expectations from the outset."
  },
  {
    number: "03",
    title: "Coordinate Commercial & Operational Information",
    description: "Support the exchange of verified documentation, technical assays, and logistical requirements, subject to due diligence and each party’s respective legal responsibilities."
  },
  {
    number: "04",
    title: "Facilitate Communication Through Agreed Transaction Milestones",
    description: "Provide continuous communication, tracking, and alignment between counterparties through agreed milestones from initial contract lodgment to formal execution."
  }
];

export const pillarsData: PillarItem[] = [
  {
    title: "Counterparty-Conscious Engagement",
    description: "We place rigorous emphasis on counterparty qualification, sanctions screening, and professional communication to ensure alignment before commercial resources are committed."
  },
  {
    title: "Clear Commercial Coordination",
    description: "Every engagement is grounded in unambiguous definition of transaction terms, roles, and delivery responsibilities, minimizing friction across complex cross-border trades."
  },
  {
    title: "Cross-Market Connectivity",
    description: "Bridging diverse international jurisdictions, languages, and commercial practices across the Americas, Europe, Middle East, and Asia-Pacific trading hubs."
  },
  {
    title: "Discretion & Professionalism",
    description: "Commercially sensitive information, proprietary specifications, and business relationships are handled with absolute confidentiality and institutional diligence."
  }
];
