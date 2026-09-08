// Core company data sourced from Anand Techno-Fab LLP's official Company Profile (2025),
// plus additional real project engagements added in 2026 from primary source documents —
// purchase orders, service orders and work orders issued by Larsen & Toubro Limited,
// Adani-LCC JV / Adani Water Limited, LCC Projects Limited and SCC Infrastructure Pvt Ltd.
// Do not add figures, projects, clients or claims that are not backed by an actual
// company profile, contract, or PO/WO/SO document.

export const company = {
  legalName: "ANAND TECHNO-FAB LLP",
  displayName: "Anand Techno-Fab",
  tagline: "Infrastructure Development & Solutions",
  ownership: "LLP Company",
  founded: 2004,
  llpSince: 2018,
  partners: [
    {
      name: "Mr. Amit Singh Rajput",
      role: "Partner & CEO",
      photo: "/images/team/amit-singh-rajput.jpg",
    },
    { name: "Mr. Suneel Kumar Singh", role: "Partner & CFO" },
  ],
  registeredAddress:
    "E-520, Ganesh Glory 11, Jagatpur Road, S.G. Highway, Gota, Ahmedabad – 382470, Gujarat, India",
  cityState: "Ahmedabad, Gujarat, India",
  llpIdentityNo: "AAL-6905",
  gstNo: "24AANFA7556J1Z3",
  epfRegNo: "GJ/55446/ENF/918",
  udyamRegNo: "UDYAM-GJ-01-0059902",
  emails: ["info@anandtechnofab.com", "mail@anandtechnofab.com"],
  // The source profile lists slightly inconsistent digits across pages (page 2 vs. the
  // General Information table and the government Udyam certificate). The number confirmed
  // by both the General Information table and the Udyam Registration Certificate is used here.
  phones: ["9998106542", "9929864134"],
  whatsappNumber: "919998106542",
};

export const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Capabilities", to: "/capabilities" },
  { label: "Quality & Safety", to: "/quality-safety" },
  { label: "Certifications", to: "/certifications" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export const timeline = [
  {
    year: "2004",
    title: "Anand Construction",
    body: "Journey begins in the infrastructure sector, providing services in water pipeline projects and structural fabrication.",
  },
  {
    year: "2018",
    title: "Anand Techno-Fab LLP",
    body: "The venture is incorporated as Anand Techno-Fab LLP to continue the journey in infrastructure development & solutions.",
  },
  {
    year: "Present",
    title: "Infrastructure Development & Solutions",
    body: "Active across irrigation, structural fabrication & erection, earthwork and mining — delivering timely completion with efficient management & quality.",
  },
];

export const specializations = [
  {
    number: "01",
    title: "Oil, Gas & Water Pipeline",
    subtitle: "Laying & Distribution Networks",
    body: "Excavation, laying and jointing of large-diameter MS oil, gas and water pipelines, and twin-line distribution networks, for irrigation and water supply schemes.",
    image: "/images/gallery/kalisindh-trench.jpg",
  },
  {
    number: "02",
    title: "Structural Fabrication",
    subtitle: "& Erection",
    body: "MS pipe fabrication, jointing and structural erection work executed to ISO 9001:2015 quality standards across concurrent project sites.",
    image: "/images/gallery/sauni-pipe-3.jpg",
  },
  {
    number: "03",
    title: "Earthwork",
    subtitle: "In Hard / Soil Strata",
    body: "Excavation across hard rock and soil strata, including sand bedding, backfilling and disposal for pipeline and civil foundation work.",
    image: "/images/gallery/sauni-earthwork.jpg",
  },
  {
    number: "04",
    title: "Mining",
    subtitle: "Drilling • Blasting • Sizing • Transportation",
    body: "Mining operations including drilling, blasting, sizing and transportation of material, executed with a dedicated heavy-equipment fleet.",
    image: "/images/gallery/mining-jafrabad-2.jpg",
  },
  {
    number: "05",
    title: "Quarry Plant",
    subtitle: "Operations",
    body: "Quarry plant operation supporting aggregate supply and material processing for infrastructure and construction projects.",
    image: "/images/gallery/mining-jafrabad-1.jpg",
  },
];

export const methodology = [
  { number: "01", title: "Project Study & Mobilization", body: "Project study and mobilization carried out in a highly professional manner." },
  { number: "02", title: "Practical & Cost-Effective Solutions", body: "Solutions engineered to be practical and cost-effective for the site condition." },
  { number: "03", title: "Quality & Safety Training", body: "Periodical quality and safety training conducted for site staff." },
  { number: "04", title: "Close Monitoring", body: "Close monitoring maintained on each and every site activity." },
  { number: "05", title: "Daily Progress Review", body: "Discussion on next-day program and achievement, every day." },
  { number: "06", title: "Bottleneck Identification", body: "Group discussion to identify and resolve bottleneck issues." },
  { number: "07", title: "Corrective Action", body: "Corrective measures applied to ensure timely completion of the project." },
];

export const hsePolicy = {
  motto:
    "Achieving Safe & Healthy Working Environment Through Effective Implementation of Occupational Health & Safety and Environment Management System by Ensuring",
  points: [
    "Prevention of Health & Injuries",
    "Prevention of Environment Pollution",
    "Compliance with Applicable Legal & Other Requirements",
    "Motivating & Training all Concerned Employees",
    "Communication to all Employees and Sub-Ordinates",
    "Availability of the Policy to the Public and Other Interested Parties",
    "Continual Improvement",
  ],
};

export const qualityPolicy = {
  motto:
    "Achieving Customer Delight & Sustainable Growth Through Effective Implementation of Quality Management System by Ensuring",
  points: [
    "Leadership Development",
    "Professional Working Environment",
    "Employee Involvement",
    "Continual Improvement",
    "Timely Execution",
    "Cost Optimization in all Activities",
    "Quality Commitment",
  ],
};

export const commitment =
  "Anand Techno-Fab LLP is fully committed to excellence. We undertake assignments on a full responsibility basis and professional services with talented and self-motivated individuals capable of contributing to the project right from the first day with dedication.";

export const team = [
  { count: 15, label: "Civil / Mechanical Engineers & Technical Supervisors" },
  { count: 18, label: "Non-Technical Supervisors" },
  { count: 8, label: "Skilled Excavator Operators" },
  { count: 2, label: "Skilled Crane Operators" },
  { count: 145, label: "Skilled Workers (Contractual)" },
];

export const equipment = [
  { name: "Excavator – EX-200 / EX-210", qty: 15, make: "All", condition: "New" },
  { name: "Rock Breaker", qty: 6, make: "Atlas Copco", condition: "New" },
  { name: "Wagon Drill & FMT Crawler", qty: 8, make: "Atlas Copco", condition: "New" },
  { name: "Dumper", qty: 14, make: "TATA / BHK", condition: "New" },
  { name: "Hydra – 14T", qty: 2, make: "ACE", condition: "New" },
  { name: "Welding Machine (400 Amp)", qty: 60, make: "Relon", condition: "New" },
  { name: "D.G. Set", qty: 6, make: "Kirloskar", condition: "Good" },
  { name: "Compressor – 8 Kg", qty: 1, make: "IR", condition: "Good" },
  { name: "Sand Blasting Set", qty: 2, make: "—", condition: "Good" },
  { name: "Grinding Machine", qty: 32, make: "BOSCH", condition: "New" },
  { name: "Buffing Machine", qty: 6, make: "BOSCH", condition: "New" },
  { name: "Hydrotesting Pump (150 Kg/cm²)", qty: 5, make: "Pumps & Co", condition: "New" },
  { name: "Dewatering Pump (10 HP)", qty: 9, make: "Kirloskar", condition: "Good" },
  { name: "Water Filling Pump (5 HP)", qty: 3, make: "Lubi", condition: "Good" },
  { name: "Hydro Testing Pump (Manual)", qty: 2, make: "Ambica", condition: "New" },
  { name: "Tractor with Trolly & Tanker", qty: 3, make: "—", condition: "Good" },
  { name: "Bolero Camper", qty: 6, make: "—", condition: "Good" },
];

export const equipmentHighlights = [
  { count: 15, label: "Excavators" },
  { count: 60, label: "Welding Machines" },
  { count: 32, label: "Grinding Machines" },
  { count: 14, label: "Dumpers" },
  { count: 8, label: "Drilling Units" },
  { count: 9, label: "Dewatering Pumps" },
];

export const concurrentCommitments = [
  {
    diameter: "2900 MM",
    title: "MS Pipeline & Civil Works — Shakkar Pench Micro Lift Irrigation Project",
    location: "Chhindwara, Madhya Pradesh",
    detail:
      "Laying of 2900 mm diameter MS rising main pipeline over a length of 12.755 km, together with associated civil works — excavation, backfilling and concrete works — for the Hard Dam under the Shakkar Pench Micro Lift Irrigation Project, as sub-contractor to M/s Adani-LCC JV (Adani Water Limited).",
    workOrderValue: "₹ 12.14 Cr",
    workDone: "In Progress",
  },
  {
    diameter: "2600 MM",
    title: "MS Syphon Pipeline — IR014, Mahi Bajaj Sagar",
    location: "Banswara, Rajasthan",
    detail:
      "Excavation, laying & jointing of 2600 mm diameter, 16 mm thickness MS Syphon Pipeline for IR014 — Mahi Bajaj Sagar, Banswara, as sub-contractor to M/s SCC Infrastructure Pvt Ltd.",
    workOrderValue: "₹ 12 Cr",
    workDone: "₹ 1 Cr",
  },
  {
    diameter: "3100 MM",
    title: "MS Water Twin Pipeline — ISP Kalisindh Ph-I, MLIS",
    location: "Dewas, Madhya Pradesh",
    detail:
      "Excavation, laying & jointing of 3100 mm diameter MS Water Twin Pipeline for ISP Kalisindh Ph-I, MLIS Water Pipeline Project, Dewas, MP, as sub-contractor to M/s Larsen & Toubro Limited, Construction Division.",
    workOrderValue: "₹ 22 Cr",
    workDone: "₹ 19 Cr",
  },
];

export type ProjectCategory = "Water Pipeline" | "Irrigation" | "Structural" | "Earthwork";

export interface Project {
  id: string;
  year: string;
  title: string;
  location: string;
  client: string;
  workDoneCr: number;
  categories: ProjectCategory[];
  note?: string;
}

export const projects: Project[] = [
  {
    id: "adani-shakkar-pench",
    year: "2025–26",
    title: "MS Pipeline & Civil Works, Shakkar Pench Micro Lift Irrigation Project",
    location: "Chhindwara, Madhya Pradesh",
    client: "Adani-LCC JV",
    workDoneCr: 12.14,
    categories: ["Water Pipeline", "Irrigation"],
  },
  {
    id: "lt-ril-nagothane",
    year: "2025–26",
    title: "UG Piping Field Welding, RIL Nagothane Vinyl Project",
    location: "Nagothane, Maharashtra",
    client: "L&T",
    workDoneCr: 1.95,
    categories: ["Structural"],
  },
  {
    id: "lcc-sondwa-lip",
    year: "2025–26",
    title: "MS Pipe Laying, Sondwa Lift Irrigation Project (NVDA)",
    location: "Alirajpur, Madhya Pradesh",
    client: "LCC Projects",
    workDoneCr: 1.55,
    categories: ["Water Pipeline", "Irrigation"],
  },
  {
    id: "scc-mahi-bajaj-sagar-structures",
    year: "2025–26",
    title: "RCC Structural Work, Mahi Bajaj Sagar Project (IR014)",
    location: "Banswara, Rajasthan",
    client: "SCC Infrastructure",
    workDoneCr: 4.83,
    categories: ["Structural"],
  },
  {
    id: "scc-mahi-bajaj-sagar-earthwork",
    year: "2025–26",
    title: "Earthwork Excavation, Mahi Bajaj Sagar Project (IR014)",
    location: "Banswara, Rajasthan",
    client: "SCC Infrastructure",
    workDoneCr: 5.55,
    categories: ["Earthwork"],
  },
  {
    id: "northern-link",
    year: "2024–25",
    title: "EPC Work for Northern Link Pipeline Project",
    location: "Kachchh, Gujarat",
    client: "L&T",
    workDoneCr: 6.0,
    categories: ["Water Pipeline"],
  },
  {
    id: "parvati-2-3",
    year: "2023–24",
    title: "Water Pipeline, Parvati 2–3 Project",
    location: "Madhya Pradesh",
    client: "L&T",
    workDoneCr: 4.54,
    categories: ["Water Pipeline"],
  },
  {
    id: "isp-kalisindh",
    year: "2022–23",
    title: "ISP-Kalisindh Ph-I, MLIS Water Pipeline Project",
    location: "Dewas, Madhya Pradesh",
    client: "L&T",
    workDoneCr: 19,
    categories: ["Water Pipeline", "Irrigation"],
  },
  {
    id: "jhabua-kalpataru",
    year: "2021–22",
    title: "Jhabua Irrigation Project",
    location: "Jhabua, Madhya Pradesh",
    client: "Kalpataru",
    workDoneCr: 5,
    categories: ["Irrigation"],
  },
  {
    id: "jhabua-jmc",
    year: "2020–21",
    title: "JMC Project, Jhabua Irrigation Project",
    location: "Jhabua, Madhya Pradesh",
    client: "JMC",
    workDoneCr: 12,
    categories: ["Irrigation"],
  },
  {
    id: "kshipra",
    year: "2019–20",
    title: "Water Pipeline, Kshipra Project",
    location: "Dewas, Madhya Pradesh",
    client: "L&T",
    workDoneCr: 3.5,
    categories: ["Water Pipeline"],
  },
  {
    id: "mlis-rajgarh",
    year: "2017–18",
    title: "MLIS Water Pipeline",
    location: "Rajgarh, Madhya Pradesh",
    client: "L&T",
    workDoneCr: 9.8,
    categories: ["Water Pipeline"],
  },
  {
    id: "sauni-l3p3",
    year: "2014–16",
    title: "SAUNI Yojana L3 P3",
    location: "Gujarat",
    client: "L&T",
    workDoneCr: 13.26,
    categories: ["Water Pipeline", "Earthwork"],
  },
  {
    id: "dahej-nand-intake",
    year: "2013–14",
    title: "Dahej Water Supply, Nand Intake",
    location: "Gujarat",
    client: "L&T",
    workDoneCr: 5.4,
    categories: ["Water Pipeline"],
  },
  {
    id: "cetp-narol",
    year: "2013",
    title: "Common Effluent Treatment Plant, Narol",
    location: "Ahmedabad, Gujarat",
    client: "L&T",
    workDoneCr: 1.5,
    categories: ["Structural"],
  },
  {
    id: "db-power",
    year: "2011–12",
    title: "DB Power Project — Structural Work",
    location: "India",
    client: "L&T",
    workDoneCr: 2.59,
    categories: ["Structural"],
  },
  {
    id: "nc-27-dhandhuka",
    year: "2011–12",
    title: "NC-27, Dhandhuka, GWIL",
    location: "Gujarat",
    client: "ESSAR",
    workDoneCr: 2.8,
    categories: ["Structural"],
  },
  {
    id: "nc-24-rajula",
    year: "2009–10",
    title: "NC-24, Rajula, GWIL",
    location: "Gujarat",
    client: "L&T",
    workDoneCr: 2.52,
    categories: ["Structural"],
  },
  {
    id: "jaiselmer-phed",
    year: "2009–10",
    title: "Jaiselmer Water Supply Project, PHED",
    location: "Rajasthan",
    client: "L&T",
    workDoneCr: 2.0,
    categories: ["Water Pipeline"],
  },
  {
    id: "bisalpur-ruidp",
    year: "2007–09",
    title: "Bisalpur Water Supply Project, RUIDP",
    location: "Rajasthan",
    client: "L&T",
    workDoneCr: 2.8,
    categories: ["Water Pipeline"],
  },
];

export const projectFilters: ("All" | ProjectCategory)[] = [
  "All",
  "Water Pipeline",
  "Irrigation",
  "Structural",
  "Earthwork",
];

export const financials = [
  { year: "FY 2021–22", lakh: 1003.28 },
  { year: "FY 2022–23", lakh: 645.21 },
  { year: "FY 2023–24", lakh: 722.85 },
  { year: "FY 2024–25", lakh: 794.54 },
];

export const certifications = [
  {
    id: "iso-18001",
    standard: "ISO 18001:2007",
    name: "Occupational Health & Safety Management System",
    pillar: "Safety",
    certNo: "EU-02-D-3420",
    scope: "All types of MS pipe laying and jointing work, structural fabrication & erection work, civil work.",
    image: "/images/certs/iso-18001.jpg",
    initialRegistration: "13-11-2025",
    recertification: "12-11-2028",
  },
  {
    id: "iso-9001",
    standard: "ISO 9001:2015",
    name: "Quality Management System",
    pillar: "Quality",
    certNo: "EU-02-D-3418",
    scope: "All types of MS pipe laying and jointing work, structural fabrication & erection work, civil work.",
    image: "/images/certs/iso-9001.jpg",
    initialRegistration: "13-11-2025",
    recertification: "12-11-2028",
  },
  {
    id: "iso-14001",
    standard: "ISO 14001:2015",
    name: "Environmental Management System",
    pillar: "Environment",
    certNo: "EU-02-D-3419",
    scope: "All types of MS pipe laying and jointing work, structural fabrication & erection work, civil work.",
    image: "/images/certs/iso-14001.jpg",
    initialRegistration: "13-11-2025",
    recertification: "12-11-2028",
  },
];

export const statutoryRegistrations = [
  {
    id: "llp",
    title: "LLP Registration",
    detail: "Certificate of Registration on Conversion of Anand Construction Co to Anand Techno-Fab LLP. LLP Identification Number AAL-6905. Registered by the Registrar of Companies, Ahmedabad, 12 January 2018.",
    image: "/images/certs/llp-registration.jpg",
  },
  {
    id: "gst",
    title: "GST Registration",
    detail: "Registration Number 24AANFA7556J1Z3, Regular registration under the Gujarat Goods and Services Tax Act, 2017.",
    image: "/images/certs/gst-registration.jpg",
  },
  {
    id: "udyam",
    title: "Udyam Registration",
    detail: "UDYAM-GJ-01-0059902 — M/S Anand Techno-Fab LLP, registered enterprise under the Ministry of MSME.",
    image: "/images/certs/udyam-registration.jpg",
  },
];

export const awards = [
  {
    id: "safety-award-essar",
    title: "Safety Award",
    issuer: "HSE Department, Essar Projects (I) Ltd.",
    period: "March 2012 – 2013",
    detail: "Presented to M/s Anand Construction (GWIL NC-27 Project) for exceptional work done for the company.",
    image: "/images/certs/safety-award-essar.jpg",
  },
  {
    id: "safest-subcontractor",
    title: "Safest Sub Contractor",
    issuer: "Larsen & Toubro Limited, ECC Division – MMH & W (OC)",
    period: "Safety Month, January 2010",
    detail: "M/s Anand Construction Company recognized as the Safest Sub Contractor during Safety Month, January 2010, at BWSP & BJWSP Jaipur.",
    image: "/images/certs/safest-subcontractor-lt.jpg",
  },
  {
    id: "appreciation-mjip",
    title: "Certificate of Appreciation",
    issuer: "JMC Projects (India) Ltd.",
    period: "1 – 30 November 2020",
    detail: "Awarded to M/s Anand Techno-Fab LLP for outstanding progress by extreme effort in critical condition in MS pipe laying work at MJIP.",
    image: "/images/certs/appreciation-mjip.jpg",
  },
];

export const completionCertificate = {
  title: "Project Completion Certificate — SAUNI Yojana L3P3",
  issuer: "L&T Construction, Water & Effluent Treatment",
  detail:
    "Certifies that M/s Anand Construction Co., Patan, was awarded the work of laying a 3000 mm dia MS Twin Line, including earthwork excavation in all types of soils, for the SAUNI Yojana L3P3 project.",
  workOrderValue: "₹ 13,77,41,607",
  executedValue: "₹ 13,26,73,620",
  contractPeriod: "21 July 2014 – 20 July 2016",
  dateIssued: "30/11/2016",
  image: "/images/certs/completion-certificate-sauni.jpg",
};

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  location: string;
  category: "Water Pipeline" | "Earthwork" | "Mining" | "Safety & People";
}

export const galleryItems: GalleryItem[] = [
  {
    id: "kalisindh-aerial",
    image: "/images/gallery/kalisindh-aerial.jpg",
    caption: "Kalisindh Phase-I, MLIS",
    location: "L&T ECC Division, Sonkach, Dewas, MP",
    category: "Water Pipeline",
  },
  {
    id: "kalisindh-trench",
    image: "/images/gallery/kalisindh-trench.jpg",
    caption: "Kalisindh Phase-I, MLIS — Pipeline Lowering",
    location: "L&T ECC Division, Sonkach, Dewas, MP",
    category: "Water Pipeline",
  },
  {
    id: "sauni-earthwork",
    image: "/images/gallery/sauni-earthwork.jpg",
    caption: "Earthwork Excavation, SAUNI Yojana L3P3",
    location: "L&T ECC Division, Gujarat",
    category: "Earthwork",
  },
  {
    id: "mining-jafrabad-1",
    image: "/images/gallery/mining-jafrabad-1.jpg",
    caption: "Mining Work — Drilling, Blasting, Sizing & Transportation",
    location: "Jafrabad, Amreli",
    category: "Mining",
  },
  {
    id: "mining-jafrabad-2",
    image: "/images/gallery/mining-jafrabad-2.jpg",
    caption: "Mining Operations — Heavy Equipment",
    location: "Jafrabad, Amreli",
    category: "Mining",
  },
  {
    id: "mining-jafrabad-3",
    image: "/images/gallery/mining-jafrabad-3.jpg",
    caption: "Mining Operations — Material Handling",
    location: "Jafrabad, Amreli",
    category: "Mining",
  },
  {
    id: "sauni-pipe-1",
    image: "/images/gallery/sauni-pipe-1.jpg",
    caption: "SAUNI Yojana L3P3 — Pipeline Infrastructure",
    location: "L&T ECC Division, Gujarat",
    category: "Water Pipeline",
  },
  {
    id: "sauni-pipe-2",
    image: "/images/gallery/sauni-pipe-2.jpg",
    caption: "SAUNI Yojana L3P3 — Pipeline Laying",
    location: "L&T ECC Division, Gujarat",
    category: "Water Pipeline",
  },
  {
    id: "sauni-pipe-3",
    image: "/images/gallery/sauni-pipe-3.jpg",
    caption: "SAUNI Yojana L3P3 — Twin Pipeline Jointing",
    location: "L&T ECC Division, Gujarat",
    category: "Water Pipeline",
  },
  {
    id: "isp-workforce",
    image: "/images/gallery/isp-kalisindh-workforce.jpg",
    caption: "ISP-Kalisindh Ph-I, MLIS — Site Workforce",
    location: "L&T ECC Division, Dewas, MP",
    category: "Safety & People",
  },
  {
    id: "isp-reinforcement",
    image: "/images/gallery/isp-kalisindh-reinforcement.jpg",
    caption: "ISP-Kalisindh Ph-I, MLIS — Reinforcement Work",
    location: "L&T ECC Division, Dewas, MP",
    category: "Water Pipeline",
  },
  {
    id: "isp-earthwork",
    image: "/images/gallery/isp-kalisindh-earthwork.jpg",
    caption: "ISP-Kalisindh Ph-I, MLIS — Earthwork",
    location: "L&T ECC Division, Dewas, MP",
    category: "Earthwork",
  },
  {
    id: "kalisindh-irrigation-1",
    image: "/images/gallery/kalisindh-irrigation-1.jpg",
    caption: "Kalisindh Phase-1 Irrigation Trunk",
    location: "L&T, Madhya Pradesh",
    category: "Water Pipeline",
  },
  {
    id: "kalisindh-irrigation-2",
    image: "/images/gallery/kalisindh-irrigation-2.jpg",
    caption: "Kalisindh Phase-1 Irrigation Trunk — Civil Works",
    location: "L&T, Madhya Pradesh",
    category: "Water Pipeline",
  },
  {
    id: "kalisindh-irrigation-3",
    image: "/images/gallery/kalisindh-irrigation-3.jpg",
    caption: "Kalisindh Phase-1 Irrigation Trunk — Pipeline Section",
    location: "L&T, Madhya Pradesh",
    category: "Water Pipeline",
  },
  {
    id: "pipeline-twin-line",
    image: "/images/gallery/pipeline-twin-line.jpg",
    caption: "Twin Pipeline Section",
    location: "Kalisindh Phase 1, MLIS Project",
    category: "Water Pipeline",
  },
  {
    id: "pipeline-trench",
    image: "/images/gallery/pipeline-trench.jpg",
    caption: "Pipeline Trench Works",
    location: "Kalisindh Phase 1, MLIS Project",
    category: "Water Pipeline",
  },
  {
    id: "health-camp",
    image: "/images/gallery/health-checkup-camp.jpg",
    caption: "Health Checkup Camp for Site Workforce",
    location: "Kalisindh Phase 1, MLIS Project",
    category: "Safety & People",
  },
  {
    id: "safety-training",
    image: "/images/gallery/safety-training.jpg",
    caption: "Field Safety Training Session",
    location: "Project Site",
    category: "Safety & People",
  },
  {
    id: "team-recognition",
    image: "/images/gallery/team-recognition.jpg",
    caption: "Team Recognition — Certificate of Appreciation, MJIP",
    location: "Site Office",
    category: "Safety & People",
  },
];

export const financialNote =
  "Figures as declared in the company's financial track record. This section can be withdrawn from public view on request.";
