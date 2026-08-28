import { img } from "./images";

export type CategoryId =
  | "center-tables"
  | "tv-stands"
  | "mirrors"
  | "bed-frames"
  | "dressers";

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  stock: number;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
  badge?: string;
};

export const categories: { id: CategoryId; label: string; image: string }[] = [
  { id: "center-tables", label: "Center Tables", image: img.marbleTable },
  { id: "tv-stands", label: "TV Stands & Units", image: img.tvStand },
  { id: "mirrors", label: "Mirrors", image: img.mirror },
  { id: "bed-frames", label: "Bed Frames", image: img.bed },
  { id: "dressers", label: "Dressers", image: img.dresser },
];

export const categoryLabel = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.label ?? id;

const spec = (a: string, b: string) => ({ label: a, value: b });

export const products: Product[] = [
  {
    id: "ct-01",
    name: "Marble-Top Center Table",
    category: "center-tables",
    price: 2800,
    stock: 4,
    image: img.marbleTable,
    description:
      "Honed marble top on a slim powder-coated steel frame. Built to anchor a living room without crowding it.",
    specs: [spec("Top", "Honed marble"), spec("Base", "Powder-coated steel"), spec("Size", "110 x 60 x 42 cm")],
    badge: "New",
  },
  {
    id: "ct-02",
    name: "Fluted Wood & Glass Table",
    category: "center-tables",
    price: 2400,
    stock: 6,
    image: img.glassTable,
    description:
      "Tempered glass over a fluted walnut body with an open lower shelf for books and remotes.",
    specs: [spec("Top", "10mm tempered glass"), spec("Body", "Fluted walnut"), spec("Size", "120 x 65 x 40 cm")],
    badge: "New",
  },
  {
    id: "ct-03",
    name: "Nesting Center Table Set (2pc)",
    category: "center-tables",
    price: 1600,
    stock: 6,
    image: img.marbleTable,
    description: "Two-piece nesting set that tucks away or spreads out for guests.",
    specs: [spec("Pieces", "2"), spec("Finish", "Matte lacquer"), spec("Size", "90 x 50 cm / 60 x 40 cm")],
  },
  {
    id: "ct-04",
    name: "Multi-Tier Storage Coffee Table",
    category: "center-tables",
    price: 2200,
    stock: 3,
    image: img.glassTable,
    description: "Two storage tiers and a lift-friendly top edge for everyday living rooms.",
    specs: [spec("Storage", "2 tiers"), spec("Finish", "Walnut veneer"), spec("Size", "120 x 60 x 45 cm")],
  },
  {
    id: "tv-01",
    name: "Fluted Floating TV Console",
    category: "tv-stands",
    price: 4200,
    stock: 2,
    image: img.tvStand,
    description:
      "Wall-hung fluted console with soft-close drawers and full cable management. Mounting included.",
    specs: [spec("Mount", "Wall-hung"), spec("Drawers", "4 soft-close"), spec("Length", "220 cm")],
    badge: "New",
  },
  {
    id: "tv-02",
    name: "LED Backlit Media Wall",
    category: "tv-stands",
    price: 6800,
    stock: 1,
    image: img.hero,
    description:
      "Full media wall with stone-look cladding, floating shelves and warm LED backlighting.",
    specs: [spec("Lighting", "Warm LED strip"), spec("Shelves", "3 floating"), spec("Build", "Custom to wall")],
    badge: "Custom Build",
  },
  {
    id: "tv-03",
    name: "Glossy Low TV Rack",
    category: "tv-stands",
    price: 3100,
    stock: 5,
    image: img.tvStand,
    description: "High-gloss low rack with a hidden compartment for decoders and consoles.",
    specs: [spec("Finish", "High gloss"), spec("Length", "180 cm"), spec("Cable", "Rear routing")],
  },
  {
    id: "tv-04",
    name: "Acoustic Panel Entertainment Wall",
    category: "tv-stands",
    price: 7400,
    stock: 1,
    image: img.hero,
    description: "Slatted acoustic panelling with an integrated console and concealed wiring.",
    specs: [spec("Panels", "Acoustic slat"), spec("Console", "Integrated"), spec("Build", "Custom to wall")],
  },
  {
    id: "mr-01",
    name: "Round LED Backlit Mirror",
    category: "mirrors",
    price: 1650,
    stock: 3,
    image: img.mirror,
    description: "Frameless round mirror with warm LED edge lighting.",
    specs: [spec("Frame", "Frameless, LED edge light"), spec("Shape", "Round"), spec("Diameter", "90 cm")],
    badge: "New",
  },
  {
    id: "mr-02",
    name: "LED Backlit Vanity Mirror",
    category: "mirrors",
    price: 1200,
    stock: 7,
    image: img.vanityMirror,
    description: "Touch-sensor vanity mirror with three light temperatures and a demister pad.",
    specs: [spec("Control", "Touch sensor"), spec("Light", "3 temperatures"), spec("Size", "80 x 60 cm")],
  },
  {
    id: "mr-03",
    name: "Full-Length Arch Mirror",
    category: "mirrors",
    price: 1400,
    stock: 4,
    image: img.mirror,
    description: "Slim-frame arch mirror, floor standing or wall mounted.",
    specs: [spec("Shape", "Arch"), spec("Frame", "Slim metal"), spec("Size", "180 x 70 cm")],
  },
  {
    id: "mr-04",
    name: "Organic Shape LED Mirror",
    category: "mirrors",
    price: 1550,
    stock: 2,
    image: img.vanityMirror,
    description: "Asymmetric pebble silhouette with a soft halo glow.",
    specs: [spec("Shape", "Asymmetric"), spec("Light", "Halo LED"), spec("Size", "110 x 70 cm")],
  },
  {
    id: "bf-01",
    name: "Minimal White Platform Bed",
    category: "bed-frames",
    price: 5200,
    stock: 2,
    image: img.bed,
    description:
      "Platform bed with an extended headboard and matching floating bedside tables.",
    specs: [spec("Size", "King, 6 x 6.5 ft"), spec("Finish", "Matte white"), spec("Extras", "Floating nightstands")],
    badge: "New",
  },
  {
    id: "bf-02",
    name: "High-Back Upholstered Bed",
    category: "bed-frames",
    price: 6400,
    stock: 2,
    image: img.upholsteredBed,
    description: "Tall tufted headboard in your choice of fabric, with under-glow lighting.",
    specs: [spec("Size", "King"), spec("Fabric", "Client specified"), spec("Lighting", "Under-glow LED")],
  },
  {
    id: "bf-03",
    name: "Floating Bed Frame with Under-Glow",
    category: "bed-frames",
    price: 5800,
    stock: 3,
    image: img.upholsteredBed,
    description: "Cantilevered frame that reads as floating, with warm perimeter lighting.",
    specs: [spec("Size", "Queen or King"), spec("Lighting", "Perimeter LED"), spec("Base", "Concealed steel")],
  },
  {
    id: "bf-04",
    name: "Storage Bed with Drawer Units",
    category: "bed-frames",
    price: 6100,
    stock: 2,
    image: img.bed,
    description: "Four full-extension drawers built into the base for compact bedrooms.",
    specs: [spec("Drawers", "4 full-extension"), spec("Size", "King"), spec("Finish", "Matte")],
  },
  {
    id: "dr-01",
    name: "Six-Drawer Modern Dresser",
    category: "dressers",
    price: 3400,
    stock: 4,
    image: img.dresser,
    description: "Handleless six-drawer dresser with a routed grip channel.",
    specs: [spec("Drawers", "6"), spec("Finish", "Matte white"), spec("Size", "140 x 45 x 80 cm")],
    badge: "New",
  },
  {
    id: "dr-02",
    name: "Vanity Desk with Mirror",
    category: "dressers",
    price: 2900,
    stock: 3,
    image: img.vanityMirror,
    description: "Vanity desk paired with a lit mirror and a soft-close drawer bank.",
    specs: [spec("Drawers", "3"), spec("Mirror", "LED lit"), spec("Size", "120 x 45 cm")],
  },
  {
    id: "dr-03",
    name: "Chest of Drawers (4pc)",
    category: "dressers",
    price: 2300,
    stock: 5,
    image: img.dresser,
    description: "Compact four-drawer chest for tight bedroom corners.",
    specs: [spec("Drawers", "4"), spec("Finish", "Oak veneer"), spec("Size", "80 x 45 x 100 cm")],
  },
  {
    id: "dr-04",
    name: "Entryway Console Table",
    category: "dressers",
    price: 1900,
    stock: 6,
    image: img.glassTable,
    description: "Slim entryway console with a shelf for baskets and keys.",
    specs: [spec("Shelf", "1 open"), spec("Finish", "Walnut"), spec("Size", "120 x 35 x 80 cm")],
  },
];

export const cedis = (n: number) => `GH\u20B5${n.toLocaleString()}`;

export const BUSINESS = {
  name: "Stelike Exclusives",
  phone: "+233 53 199 3984",
  whatsapp: "233531993984",
  instagram: ["@stelikexclusives", "@stelike_exclusives"],
  facebook: "Stelike Exclusives",
  city: "Accra, Ghana",
  coords: { lat: 5.6205, lng: -0.2295 },
  areas: "Accra, Achimota, East Legon, Kumasi, Takoradi",
};
