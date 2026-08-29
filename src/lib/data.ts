import { img, mirrorProducts, bedProducts, tvProducts, tableProducts } from "./images";

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
  { id: "center-tables", label: "Center Tables", image: img.centerTablesCategory },
  { id: "tv-stands", label: "TV Stands & Units", image: img.tvStandsCategory },
  { id: "mirrors", label: "Mirrors", image: img.mirrorsCategory },
  { id: "bed-frames", label: "Bed Frames", image: img.bedFramesCategory },
  { id: "dressers", label: "Dressers", image: img.dressersCategory },
];

export const categoryLabel = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.label ?? id;

// Interleaves products across categories (one per category per round) so
// unfiltered views show a mix instead of being grouped by category order.
export function interleaveByCategory(items: Product[]): Product[] {
  const byCat = new Map<CategoryId, Product[]>();
  for (const p of items) {
    const bucket = byCat.get(p.category);
    if (bucket) bucket.push(p);
    else byCat.set(p.category, [p]);
  }
  const buckets = categories
    .map((c) => byCat.get(c.id))
    .filter((b): b is Product[] => !!b);
  // Include any category not in the categories list (e.g. custom products)
  for (const [id, bucket] of byCat) {
    if (!categories.some((c) => c.id === id)) buckets.push(bucket);
  }
  const result: Product[] = [];
  let i = 0;
  while (result.length < items.length) {
    for (const bucket of buckets) {
      if (i < bucket.length) result.push(bucket[i]!);
    }
    i++;
  }
  return result;
}

const spec = (a: string, b: string) => ({ label: a, value: b });

export const products: Product[] = [
  {
    id: "ct-01",
    name: "Walnut Block Coffee Table",
    category: "center-tables",
    price: 2600,
    stock: 4,
    image: tableProducts[0]!,
    description: "Solid walnut block-form coffee table on a plinth base. Clean lines, no hardware in sight.",
    specs: [spec("Body", "Solid walnut veneer"), spec("Base", "Recessed plinth"), spec("Size", "120 x 65 x 35 cm")],
    badge: "New",
  },
  {
    id: "ct-02",
    name: "High-Gloss LED Coffee Table",
    category: "center-tables",
    price: 2900,
    stock: 3,
    image: tableProducts[1]!,
    description: "Two-tone high-gloss coffee table with a colour-change LED base glow.",
    specs: [spec("Finish", "High gloss two-tone"), spec("Lighting", "RGB LED base"), spec("Size", "110 x 60 x 38 cm")],
    badge: "New",
  },
  {
    id: "ct-03",
    name: "Lift-Top Storage Table with Glass Insert",
    category: "center-tables",
    price: 3800,
    stock: 2,
    image: tableProducts[2]!,
    description: "Walnut lift-top table with a black glass insert and dual pull-out storage drawers.",
    specs: [spec("Top", "Lift-top, black glass"), spec("Storage", "2 pull-out drawers"), spec("Size", "130 x 70 x 40 cm")],
  },
  {
    id: "ct-04",
    name: "Oak Lift-Top Storage Table",
    category: "center-tables",
    price: 3600,
    stock: 3,
    image: tableProducts[3]!,
    description: "Light oak lift-top table with a sectioned tray insert and two full-width storage drawers.",
    specs: [spec("Top", "Lift-top, sectioned tray"), spec("Storage", "2 full-width drawers"), spec("Size", "130 x 70 x 40 cm")],
  },
  {
    id: "ct-05",
    name: "Gold-Trim Glass Center Table",
    category: "center-tables",
    price: 3100,
    stock: 3,
    image: tableProducts[4]!,
    description: "Square black glass top edged in a brushed gold-tone frame, built to sit low and wide.",
    specs: [spec("Top", "Black glass"), spec("Frame", "Brushed gold-tone"), spec("Size", "90 x 90 x 35 cm")],
    badge: "New",
  },
  {
    id: "ct-06",
    name: "Walnut Glass-Top Block Table",
    category: "center-tables",
    price: 2700,
    stock: 4,
    image: tableProducts[5]!,
    description: "Walnut block base topped with black tempered glass for a warm-meets-sleek living room piece.",
    specs: [spec("Top", "Tempered glass"), spec("Body", "Solid walnut"), spec("Size", "120 x 65 x 35 cm")],
  },
  {
    id: "ct-07",
    name: "Matte Black LED Storage Table",
    category: "center-tables",
    price: 3000,
    stock: 3,
    image: tableProducts[6]!,
    description: "Matte black coffee table with twin storage drawers and a colour-change LED base glow.",
    specs: [spec("Finish", "Matte black"), spec("Storage", "2 drawers"), spec("Lighting", "RGB LED base")],
  },
  {
    id: "ct-08",
    name: "Gloss White LED Coffee Table",
    category: "center-tables",
    price: 2850,
    stock: 4,
    image: tableProducts[7]!,
    description: "Glossy white coffee table with concealed drawer storage and a soft blue LED base glow.",
    specs: [spec("Finish", "High gloss white"), spec("Storage", "2 concealed drawers"), spec("Lighting", "LED base")],
  },
  {
    id: "ct-09",
    name: "Oak Storage Table, Sectioned Tray Top",
    category: "center-tables",
    price: 3500,
    stock: 2,
    image: tableProducts[8]!,
    description: "Light oak table with a lift-off sectioned tray top and generous under-storage on both sides.",
    specs: [spec("Top", "Lift-off sectioned tray"), spec("Storage", "Dual side drawers"), spec("Size", "130 x 70 x 40 cm")],
  },
  {
    id: "ct-10",
    name: "Two-Tone Walnut & White Table",
    category: "center-tables",
    price: 2500,
    stock: 5,
    image: tableProducts[9]!,
    description: "Walnut and white two-tone table with an open shelf cut into the base for books and trays.",
    specs: [spec("Finish", "Walnut & white two-tone"), spec("Shelf", "1 open"), spec("Size", "110 x 55 x 38 cm")],
  },
  {
    id: "tv-02",
    name: "Floating Console with Fire Feature",
    category: "tv-stands",
    price: 6800,
    stock: 1,
    image: tvProducts[1]!,
    description: "Floating grey console under warm LED backlighting, built over a linear fire feature.",
    specs: [spec("Lighting", "Warm LED edge"), spec("Feature", "Linear fire insert"), spec("Build", "Custom to wall")],
    badge: "New",
  },
  {
    id: "tv-03",
    name: "Wood-Top Floating TV Console",
    category: "tv-stands",
    price: 3400,
    stock: 4,
    image: tvProducts[2]!,
    description: "Minimal white console with a warm wood top surface, wall-hung with concealed cable routing.",
    specs: [spec("Mount", "Wall-hung"), spec("Top", "Warm wood veneer"), spec("Length", "220 cm")],
  },
  {
    id: "tv-04",
    name: "Warm LED Lounge Media Console",
    category: "tv-stands",
    price: 4600,
    stock: 3,
    image: tvProducts[3]!,
    description: "Low black console styled for a warm-toned lounge, with soft ambient wall lighting.",
    specs: [spec("Finish", "Matte black"), spec("Lighting", "Ambient wall wash"), spec("Length", "200 cm")],
  },
  {
    id: "tv-05",
    name: "Glossy Black Console with Soundbar Shelf",
    category: "tv-stands",
    price: 3900,
    stock: 5,
    image: tvProducts[4]!,
    description: "High-gloss black console with an integrated soundbar shelf and a linear fire feature below.",
    specs: [spec("Finish", "High gloss black"), spec("Feature", "Linear fire insert"), spec("Length", "220 cm")],
    badge: "New",
  },
  {
    id: "tv-06",
    name: "Stone-Panel Media Wall with Shelf Niche",
    category: "tv-stands",
    price: 7400,
    stock: 1,
    image: tvProducts[5]!,
    description: "Stone-look cladded media wall with a lit shelf niche and an integrated colour-change fire feature.",
    specs: [spec("Cladding", "Stone-look panel"), spec("Feature", "Colour-change fire insert"), spec("Build", "Custom to wall")],
    badge: "Custom Build",
  },
  {
    id: "tv-07",
    name: "Floating White Console with Fire Feature",
    category: "tv-stands",
    price: 5200,
    stock: 2,
    image: tvProducts[6]!,
    description: "Clean floating white console set beneath the TV, with a linear fire feature at the base.",
    specs: [spec("Finish", "Matte white"), spec("Feature", "Linear fire insert"), spec("Length", "200 cm")],
  },
  {
    id: "tv-08",
    name: "Full-Height Ribbed Panel Media Wall",
    category: "tv-stands",
    price: 6600,
    stock: 1,
    image: tvProducts[7]!,
    description: "Floor-to-ceiling ribbed panel wall with a wood-top drawer console for full room impact.",
    specs: [spec("Panels", "Full-height ribbed"), spec("Console", "Wood-top, soft-close drawers"), spec("Build", "Custom to wall")],
  },
  {
    id: "tv-09",
    name: "Textured Stone Wall Unit with Shelving",
    category: "tv-stands",
    price: 7000,
    stock: 1,
    image: tvProducts[8]!,
    description: "Textured stone-tile feature wall with tiered display shelving and a colour-change fire insert.",
    specs: [spec("Cladding", "Textured stone tile"), spec("Shelving", "Tiered display"), spec("Feature", "Colour-change fire insert")],
    badge: "Custom Build",
  },
  {
    id: "tv-10",
    name: "Media Console in Styled Living Room",
    category: "tv-stands",
    price: 3600,
    stock: 4,
    image: tvProducts[9]!,
    description: "Compact floating console styled in a full living room set, paired with round accent tables.",
    specs: [spec("Finish", "White"), spec("Length", "180 cm"), spec("Cable", "Rear routing")],
  },
  {
    id: "mr-01",
    name: "Round Arch LED Mirror",
    category: "mirrors",
    price: 1650,
    stock: 3,
    image: mirrorProducts[0]!,
    description: "Oversized round mirror with a warm LED halo, set into a marble hallway wall.",
    specs: [spec("Frame", "Frameless, LED edge light"), spec("Shape", "Round"), spec("Diameter", "100 cm")],
    badge: "New",
  },
  {
    id: "mr-02",
    name: "Slatted Wood Console Mirror",
    category: "mirrors",
    price: 1350,
    stock: 5,
    image: mirrorProducts[1]!,
    description: "Full-length mirror set within a fluted wood panel wall, paired with a floating console.",
    specs: [spec("Frame", "Slim metal"), spec("Shape", "Rectangular"), spec("Size", "180 x 70 cm")],
  },
  {
    id: "mr-03",
    name: "LED Backlit Vanity Mirror",
    category: "mirrors",
    price: 1200,
    stock: 7,
    image: mirrorProducts[2]!,
    description: "Wall-mounted vanity mirror with a warm LED backlight strip and floating shelf below.",
    specs: [spec("Control", "Always-on LED"), spec("Light", "Warm backlight"), spec("Size", "80 x 120 cm")],
  },
  {
    id: "mr-04",
    name: "Organic Shape LED Mirror",
    category: "mirrors",
    price: 1550,
    stock: 2,
    image: mirrorProducts[3]!,
    description: "Asymmetric pebble-shaped mirror with a soft LED halo, mounted above a floating console.",
    specs: [spec("Shape", "Asymmetric"), spec("Light", "Halo LED"), spec("Size", "110 x 70 cm")],
    badge: "New",
  },
  {
    id: "mr-05",
    name: "Round Black-Frame Console Mirror",
    category: "mirrors",
    price: 1300,
    stock: 6,
    image: mirrorProducts[4]!,
    description: "Classic round mirror in a slim black frame, paired with a floating white console.",
    specs: [spec("Frame", "Slim black metal"), spec("Shape", "Round"), spec("Diameter", "80 cm")],
  },
  {
    id: "mr-06",
    name: "Gold-Lit Rounded Console Mirror",
    category: "mirrors",
    price: 1450,
    stock: 4,
    image: mirrorProducts[5]!,
    description: "Rounded-corner mirror with warm gold-toned edge lighting over a wood-and-white console.",
    specs: [spec("Frame", "Rounded, LED edge light"), spec("Shape", "Rectangular"), spec("Size", "90 x 130 cm")],
  },
  {
    id: "mr-07",
    name: "Tall Shelf-Side Wall Mirror",
    category: "mirrors",
    price: 1250,
    stock: 5,
    image: mirrorProducts[6]!,
    description: "Slim tall mirror in a black frame, mounted beside floating display shelves and a stone-top console.",
    specs: [spec("Frame", "Slim black metal"), spec("Shape", "Rectangular"), spec("Size", "60 x 160 cm")],
  },
  {
    id: "mr-08",
    name: "Round Mirror on Slatted Wall",
    category: "mirrors",
    price: 1500,
    stock: 3,
    image: mirrorProducts[7]!,
    description: "Large round mirror set into a dark slatted feature wall above a glossy black console.",
    specs: [spec("Frame", "Frameless"), spec("Shape", "Round"), spec("Diameter", "100 cm")],
  },
  {
    id: "mr-09",
    name: "Wall-Lit Round Console Mirror",
    category: "mirrors",
    price: 1400,
    stock: 4,
    image: mirrorProducts[8]!,
    description: "Round mirror with an integrated wall light, set above a slim wood console and pampas vase styling.",
    specs: [spec("Frame", "Slim metal"), spec("Shape", "Round"), spec("Diameter", "85 cm")],
  },
  {
    id: "mr-10",
    name: "Arched Backlit Console Mirror",
    category: "mirrors",
    price: 1600,
    stock: 3,
    image: mirrorProducts[9]!,
    description: "Tall arched mirror with warm perimeter backlighting over a floating stone-top console.",
    specs: [spec("Frame", "Backlit arch"), spec("Shape", "Arched"), spec("Size", "80 x 180 cm")],
    badge: "New",
  },
  {
    id: "bf-01",
    name: "Two-Tone Platform Bed with Pendant Lights",
    category: "bed-frames",
    price: 5200,
    stock: 2,
    image: bedProducts[0]!,
    description: "White and walnut platform bed with a matching side dresser and pendant lighting either side.",
    specs: [spec("Size", "King"), spec("Finish", "White & walnut"), spec("Extras", "Matching side dresser")],
    badge: "New",
  },
  {
    id: "bf-02",
    name: "Dark Panel Bed with Built-In Nightstands",
    category: "bed-frames",
    price: 6400,
    stock: 2,
    image: bedProducts[1]!,
    description: "Wide panelled headboard in walnut and charcoal with integrated bedside units.",
    specs: [spec("Size", "King"), spec("Finish", "Walnut & charcoal"), spec("Nightstands", "Built-in")],
  },
  {
    id: "bf-03",
    name: "Minimal White Platform Bed",
    category: "bed-frames",
    price: 5000,
    stock: 3,
    image: bedProducts[2]!,
    description: "Clean white platform bed with floating side tables, styled for a bright bedroom.",
    specs: [spec("Size", "Queen"), spec("Finish", "Matte white"), spec("Extras", "Floating nightstands")],
  },
  {
    id: "bf-04",
    name: "Floating Wood Bed with Under-Glow",
    category: "bed-frames",
    price: 5800,
    stock: 3,
    image: bedProducts[3]!,
    description: "Cantilevered walnut frame that reads as floating, with warm perimeter under-glow lighting.",
    specs: [spec("Size", "King"), spec("Lighting", "Perimeter LED"), spec("Base", "Concealed steel")],
  },
  {
    id: "bf-05",
    name: "White Platform Bed with Dresser Set",
    category: "bed-frames",
    price: 5500,
    stock: 2,
    image: bedProducts[4]!,
    description: "Bright white platform bed paired with a matching walnut dresser and pendant lights.",
    specs: [spec("Size", "King"), spec("Finish", "White & walnut"), spec("Set", "Includes matching dresser")],
    badge: "New",
  },
  {
    id: "bf-06",
    name: "Low-Profile Storage Bed Base",
    category: "bed-frames",
    price: 4600,
    stock: 4,
    image: bedProducts[5]!,
    description: "Grey wood-tone low platform base with matching open-shelf bedside units.",
    specs: [spec("Size", "King"), spec("Finish", "Grey wood-tone"), spec("Nightstands", "Open-shelf, included")],
  },
  {
    id: "bf-07",
    name: "Wood Slab Platform Bed",
    category: "bed-frames",
    price: 6100,
    stock: 2,
    image: bedProducts[6]!,
    description: "Solid wood platform bed with a full-width slab headboard against a dark feature wall.",
    specs: [spec("Size", "King"), spec("Headboard", "Full-width solid wood"), spec("Base", "Platform")],
  },
  {
    id: "bf-08",
    name: "Panel Headboard Bed with Art Nook",
    category: "bed-frames",
    price: 5900,
    stock: 2,
    image: bedProducts[7]!,
    description: "Two-tone panelled headboard bed styled with framed wall art and a black accent throw.",
    specs: [spec("Size", "King"), spec("Finish", "Walnut & white"), spec("Headboard", "Panelled")],
  },
  {
    id: "bf-09",
    name: "Low Platform Bed, Statement Wall Décor",
    category: "bed-frames",
    price: 4800,
    stock: 3,
    image: bedProducts[8]!,
    description: "Grey low-profile platform bed with a backlit headboard nook, styled for a statement bedroom.",
    specs: [spec("Size", "Queen"), spec("Finish", "Grey matte"), spec("Lighting", "Backlit headboard nook")],
  },
  {
    id: "bf-10",
    name: "Slatted Wood Headboard Bed",
    category: "bed-frames",
    price: 6600,
    stock: 1,
    image: bedProducts[9]!,
    description: "Floor-to-ceiling slatted wood headboard wall with pendant reading lights either side.",
    specs: [spec("Size", "King"), spec("Headboard", "Full-height slatted wood"), spec("Lighting", "Pendant, both sides")],
    badge: "Custom Build",
  },
  {
    id: "tv-11",
    name: "Floating Console with Fireplace & Lift-Top Table",
    category: "tv-stands",
    price: 5600,
    stock: 2,
    image: tvProducts[10]!,
    description: "Floating wood console over a linear fire feature, paired with a matching lift-top storage table.",
    specs: [spec("Feature", "Linear fire insert"), spec("Set", "Includes matching lift-top table"), spec("Length", "200 cm")],
    badge: "New",
  },
  {
    id: "tv-12",
    name: "White Panel Media Wall with Fireplace",
    category: "tv-stands",
    price: 6200,
    stock: 1,
    image: tvProducts[11]!,
    description: "Backlit white panel media wall over a floating console and a linear fire feature, set against marble flooring.",
    specs: [spec("Panel", "Backlit white"), spec("Feature", "Linear fire insert"), spec("Build", "Custom to wall")],
    badge: "Custom Build",
  },
  {
    id: "tv-13",
    name: "Walnut Floating Console, Everyday Living Room",
    category: "tv-stands",
    price: 3300,
    stock: 4,
    image: tvProducts[12]!,
    description: "Walnut floating console shown in daily use, paired with a matching glass-top coffee table.",
    specs: [spec("Finish", "Walnut veneer"), spec("Length", "180 cm"), spec("Cable", "Rear routing")],
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
  {
    id: "tv-01",
    name: "Fluted Wood Media Wall with Display Shelf",
    category: "tv-stands",
    price: 6200,
    stock: 1,
    image: tvProducts[0]!,
    description: "Full media wall pairing a fluted-slat feature with a lit display shelf and floating cabinet base.",
    specs: [spec("Shelving", "Open lit display"), spec("Panels", "Fluted wood"), spec("Build", "Custom to wall")],
    badge: "Custom Build",
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
  pickupAddress: "Achimota, Accra",
};

