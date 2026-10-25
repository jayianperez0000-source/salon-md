import { ServiceItem, PromotionDeal, GalleryItem } from '../types';

export const BUSINESS_INFO = {
  name: "Salon MD",
  tagline: "Your Everyday Beauty & Wellness Destination",
  yearsInBusiness: 5,
  location: {
    building: "Circle C Mall",
    floor: "2nd Floor (Beside Central Escalator)",
    street: "Congressional Avenue, Project 8",
    city: "Quezon City, Metro Manila",
    postalCode: "1106",
    landmark: "Near Circle C Supermarket Atrium & Fashion Wing",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.0384752697843!2d121.03681427590483!3d14.653775175782784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b71946001fc9%3A0x6b4f706fae9a7e6b!2sCircle%20C%20Mall!5e0!3m2!1sen!2sph!4v1710000000000!5m2!1sen!2sph",
    directionsUrl: "https://maps.google.com/?q=Circle+C+Mall+Congressional+Avenue+Quezon+City"
  },
  operatingHours: {
    weekdays: "10:00 AM - 8:00 PM",
    weekends: "10:00 AM - 8:00 PM",
    notes: "Open daily including public holidays according to mall schedule. Walk-ins always welcome!"
  },
  contact: {
    phone: "(02) 8920-5542",
    mobile: "+63 917 584 7219",
    viber: "+63 917 584 7219",
    facebook: "https://facebook.com/SalonMDCircleC",
    facebookHandle: "@SalonMDCircleC",
    email: "inquiries.salonmd@gmail.com"
  },
  paymentMethods: ["Cash", "GCash", "Maya", "Bank Transfer (BDO / BPI)"]
};

export const PROPOSAL_META = {
  title: "Website / Application Proposal",
  course: "LFSA411A034 / BSIT",
  institution: "BSIT Capstone & Systems Development",
  submissionDate: "September 28, 2026",
  instructor: "Carlos Jessneir D. Javier",
  students: [
    { name: "Perez, Jay-Ian", role: "Lead Systems Architect & Frontend Engineer" },
    { name: "Garcia, Danica", role: "UI/UX Researcher & Content Strategist" },
    { name: "Lanugan, Lizyl", role: "Business Requirements & Quality Assurance" }
  ],
  objective: "To resolve Salon MD's inactive social media challenge by delivering a high-speed, categorized showcase catalog with monthly promotions, location guidance, and an interactive pamper package estimator for Circle C Mall shoppers and local residents."
};

export const SERVICE_CATEGORIES = [
  { id: 'all', name: 'All Services', icon: 'Sparkles', count: 24 },
  { id: 'hair', name: 'Hair & Treatments', icon: 'Scissors', count: 6 },
  { id: 'nails', name: 'Nails & Foot Spa', icon: 'HandHeart', count: 5 },
  { id: 'lashes-brows', name: 'Lashes & Eyebrows', icon: 'Eye', count: 5 },
  { id: 'waxing', name: 'Waxing (Men & Women)', icon: 'Flame', count: 4 },
  { id: 'massage', name: 'Body Massage & Spa', icon: 'HeartHandshake', count: 3 },
  { id: 'makeup', name: 'Hair & Makeup (HMUA)', icon: 'Palette', count: 3 },
  { id: 'home-service', name: 'Home Service Packages', icon: 'Home', count: 3 }
];

export const SERVICES_DATA: ServiceItem[] = [
  // --- HAIR SERVICES ---
  {
    id: 'hair-cut-wash',
    name: 'Precision Haircut, Wash & Blowdry',
    category: 'hair',
    categoryName: 'Hair & Treatments',
    price: 250,
    priceRange: '₱250 - ₱350',
    durationMinutes: 40,
    description: 'Expert haircut tailored to your face shape, followed by refreshing hair wash, soothing scalp massage, and salon blowdry styling.',
    inclusions: ['Style consultation', 'Clarifying shampoo wash', 'Scalp massage', 'Precision cut', 'Professional blowout styling'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'hair-rebonding',
    name: 'Permanent Hair Rebonding',
    category: 'hair',
    categoryName: 'Hair & Treatments',
    price: 1499,
    priceRange: 'Starts at ₱1,499 (Varies by hair length)',
    durationMinutes: 180,
    description: 'Sleek, frizz-free, pin-straight hair with glossy shine. Formulated with gentle Japanese conditioning agents to protect hair integrity.',
    inclusions: ['Pre-treatment hair assessment', 'Straightening application', 'Heat activation & ceramic iron pressing', 'Neutralizer & shine serum lock-in'],
    gender: 'unisex',
    isPopular: true,
    isPromo: true,
    promoBadge: 'Best Seller'
  },
  {
    id: 'hair-botox',
    name: 'Hair Botox Deep Repair',
    category: 'hair',
    categoryName: 'Hair & Treatments',
    price: 1200,
    priceRange: '₱1,200 - ₱1,800',
    durationMinutes: 90,
    description: 'Non-chemical deep conditioning treatment that fills in damaged hair fibers, eliminates severe frizz, and restores intense bounce and luster.',
    inclusions: ['Amino acid & collagen infusion', 'Anti-frizz moisture sealing', 'Thermal blowout lock'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'hair-color-full',
    name: 'Full Hair Coloring / Root Touch-Up',
    category: 'hair',
    categoryName: 'Hair & Treatments',
    price: 850,
    priceRange: '₱850 (Roots) · ₱1,200 - ₱2,200 (Full)',
    durationMinutes: 120,
    description: 'Vibrant, long-lasting shades from warm natural browns to rich burgundy and trendy mocha ash. Gentle on scalp with high pigment fidelity.',
    inclusions: ['Color swatch matching', 'Scalp barrier protector', 'Color application', 'Post-color lock treatment & blowdry'],
    gender: 'unisex'
  },
  {
    id: 'hair-spa',
    name: 'Intensive Hair Spa Treatment',
    category: 'hair',
    categoryName: 'Hair & Treatments',
    price: 450,
    priceRange: '₱450 - ₱650',
    durationMinutes: 50,
    description: 'Relaxing restorative treatment with heated steam therapy, essential oils, and deep moisture mask for dry, over-processed, or brittle hair.',
    inclusions: ['Scalp detox scrub', 'Keratin moisture mask', 'Hot towel steam wrap', 'Shoulder & neck pressure massage'],
    gender: 'unisex'
  },
  {
    id: 'balayage-highlights',
    name: 'Balayage & Dimensional Highlights',
    category: 'hair',
    categoryName: 'Hair & Treatments',
    price: 1800,
    priceRange: '₱1,800 - ₱2,800',
    durationMinutes: 210,
    description: 'Custom hand-painted multidimensional blonde or caramel gradient highlights with seamless grow-out transition and gloss toner.',
    inclusions: ['Foil or freehand technique', 'Bond protecting additive', 'Gloss toner', 'Blowout styling'],
    gender: 'female'
  },

  // --- NAIL CARE & FOOT SPA ---
  {
    id: 'classic-mani-pedi',
    name: 'Classic Manicure & Pedicure Duo',
    category: 'nails',
    categoryName: 'Nails & Foot Spa',
    price: 350,
    priceRange: '₱350 duo (₱160 Mani / ₱200 Pedi)',
    durationMinutes: 60,
    description: 'Complete nail grooming including cut, shaping, cuticle care, light lotion massage, and your choice of premium regular polish or natural buff.',
    inclusions: ['Nail trimming & shaping', 'Gentle cuticle cleanup', 'Light hand & foot massage', 'Base, 2 color coats & topcoat'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'foot-spa-scrub',
    name: 'Luxury Foot Spa with Sea Salt Scrub',
    category: 'nails',
    categoryName: 'Nails & Foot Spa',
    price: 400,
    priceRange: '₱400 (Or ₱550 with Pedicure)',
    durationMinutes: 50,
    description: 'Warm soothing foot soak, dead skin callus removal, exfoliating sea salt peppermint scrub, and revitalizing foot & calf reflexology massage.',
    inclusions: ['Epsom salt herbal soak', 'Callus smoothing with pumice', 'Dead skin exfoliation scrub', 'Hydrating cooling mask & calf massage'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'gel-nail-polish',
    name: 'Gel Nail Polish (Hands or Feet)',
    category: 'nails',
    categoryName: 'Nails & Foot Spa',
    price: 450,
    priceRange: '₱450 (Hands) · ₱500 (Feet)',
    durationMinutes: 45,
    description: 'Chip-resistant, ultra-glossy LED cured gel polish lasting 3 to 4 weeks without peeling or dulling. Huge variety of trendy nude, pastel & bold shades.',
    inclusions: ['Dry manicure/pedicure prep', 'Dehydrator & bonding primer', 'LED cured gel coats', 'Cuticle oil nourishment'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'nail-extension-art',
    name: 'Soft Gel Extensions & Custom Nail Art',
    category: 'nails',
    categoryName: 'Nails & Foot Spa',
    price: 950,
    priceRange: '₱950 - ₱1,400',
    durationMinutes: 90,
    description: 'Full-cover lightweight soft gel nail extensions with customized hand-painted designs, chrome powder, French tips, or 3D gem accents.',
    inclusions: ['Full soft gel tip application', 'Length & shape customization', 'Gel art on accent nails', 'High-shine top sealer'],
    gender: 'unisex'
  },
  {
    id: 'paraffin-treatment',
    name: 'Thermal Paraffin Wax Treatment (Hands & Feet)',
    category: 'nails',
    categoryName: 'Nails & Foot Spa',
    price: 350,
    priceRange: '₱350 hands · ₱400 feet',
    durationMinutes: 30,
    description: 'Warm, medical-grade peach paraffin dip that locks in deep hydration, relieves joint stiffness, and softens severely dry cracked skin.',
    inclusions: ['Collagen lotion application', 'Warm paraffin dipping', 'Insulated thermal mitt wrap', 'Finishing smoothing massage'],
    gender: 'unisex'
  },

  // --- EYELASHES & EYEBROWS ---
  {
    id: 'eyelash-extensions-classic',
    name: 'Classic & Volume Eyelash Extensions',
    category: 'lashes-brows',
    categoryName: 'Lashes & Eyebrows',
    price: 650,
    priceRange: '₱650 (Natural Classic) · ₱850 (Hybrid/Volume)',
    durationMinutes: 90,
    description: 'Feather-light faux mink lash extensions applied individually for an effortlessly glamorous, mascara-free look that lasts 3–5 weeks.',
    inclusions: ['Eye contour cleansing', 'Collagel under-eye pads', 'Individual lash isolation & bonding', 'Free lash spoolie brush'],
    gender: 'female',
    isPopular: true
  },
  {
    id: 'lash-lift-tint',
    name: 'Keratin Lash Lift & Deep Tint',
    category: 'lashes-brows',
    categoryName: 'Lashes & Eyebrows',
    price: 550,
    priceRange: '₱550',
    durationMinutes: 50,
    description: 'Perm-free silicone rod curl that dramatically lifts your natural eyelashes upward, paired with a rich black keratin tint for eyes that pop.',
    inclusions: ['Gentle lash lifting solution', 'Keratin setting cream', 'Semi-permanent black gloss tint', 'Conditioning oil seal'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'eyebrow-threading',
    name: 'Eyebrow Threading & Precision Shaping',
    category: 'lashes-brows',
    categoryName: 'Lashes & Eyebrows',
    price: 120,
    priceRange: '₱120 (Brows) · ₱220 (Brows + Upper Lip)',
    durationMinutes: 20,
    description: 'Traditional anti-bacterial cotton thread technique for hyper-clean, sharp eyebrow arches without chemical irritation or skin sagging.',
    inclusions: ['Brow bone arch mapping', 'Clean thread hair removal', 'Soothing aloe vera gel application'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'microblading-brows',
    name: '6D Microblading & Brow Feathering',
    category: 'lashes-brows',
    categoryName: 'Lashes & Eyebrows',
    price: 3200,
    priceRange: '₱3,200 (Includes 1 free touch-up within 45 days)',
    durationMinutes: 120,
    description: 'Semi-permanent manual hair-stroke simulation that creates realistic, fuller brows customized to your natural hair growth direction.',
    inclusions: ['Golden ratio brow mapping', 'Medical grade topical numbing', 'Organic plant-based pigments', 'Aftercare healing balm kit'],
    gender: 'unisex'
  },
  {
    id: 'eyebrow-tattoo-shading',
    name: 'Ombré Powder Eyebrow Tattoo',
    category: 'lashes-brows',
    categoryName: 'Lashes & Eyebrows',
    price: 2800,
    priceRange: '₱2,800',
    durationMinutes: 120,
    description: 'Soft mist powdery pixel technique providing a soft makeup filled-in look that is waterproof, sweatproof, and lasts up to 2 years.',
    inclusions: ['Facial symmetry consultation', 'Double numbing protocol', 'Nano-needle gradient shading', 'Aftercare instructions'],
    gender: 'unisex'
  },

  // --- WAXING SERVICES (FOR BOTH MALE & FEMALE) ---
  {
    id: 'waxing-underarm',
    name: 'Underarm Waxing (Warm Honey Wax)',
    category: 'waxing',
    categoryName: 'Waxing (Men & Women)',
    price: 200,
    priceRange: '₱200 (Female) · ₱250 (Male)',
    durationMinutes: 20,
    description: 'Quick, hygienic hair removal that pulls hair from the root, promoting finer regrowth and reducing underarm shadow and ingrowns.',
    inclusions: ['Cleansing prep & powder', 'Hypoallergenic warm honey wax', 'Post-wax soothing tea tree lotion'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'waxing-brazilian',
    name: 'Brazilian / Bikini Waxing',
    category: 'waxing',
    categoryName: 'Waxing (Men & Women)',
    price: 599,
    priceRange: '₱350 (Bikini Line) · ₱599 (Full Brazilian)',
    durationMinutes: 45,
    description: 'Private, sanitary, and gentle waxing by experienced aesthetic specialists using premium sensitive strip-less hard wax.',
    inclusions: ['Sanitary single-use protocol', 'Pre-wax calming oil', 'Gentle hard wax application', 'Cooling hydro-cortisone finish'],
    gender: 'female'
  },
  {
    id: 'waxing-legs',
    name: 'Full Legs & Half Legs Waxing',
    category: 'waxing',
    categoryName: 'Waxing (Men & Women)',
    price: 450,
    priceRange: '₱300 (Half Legs) · ₱500 (Full Legs)',
    durationMinutes: 40,
    description: 'Silky smooth legs for weeks. Suitable for both men and women with sensitive or coarse hair.',
    inclusions: ['Skin antiseptic prep', 'Roller or strip wax application', 'Moisturizing post-epilation emulsion'],
    gender: 'unisex'
  },
  {
    id: 'waxing-facial-upperlip',
    name: 'Facial Waxing (Upper Lip, Chin, Full Face)',
    category: 'waxing',
    categoryName: 'Waxing (Men & Women)',
    price: 150,
    priceRange: '₱150 (Upper Lip) · ₱350 (Full Face)',
    durationMinutes: 20,
    description: 'Removes fine peach fuzz and unwanted facial hair to make your skin ultra smooth and allow makeup to apply flawlessly.',
    inclusions: ['Delicate facial wax formula', 'Calming cucumber toner', 'Redness reduction serum'],
    gender: 'unisex'
  },

  // --- MASSAGE & BODY WELLNESS ---
  {
    id: 'massage-swedish-full',
    name: 'Full Body Swedish Relaxation Massage',
    category: 'massage',
    categoryName: 'Body Massage & Spa',
    price: 450,
    priceRange: '₱450 (60 Mins) · ₱650 (90 Mins)',
    durationMinutes: 60,
    description: 'Long gliding strokes, kneading, and gentle friction using fragrant lavender or eucalyptus aromatherapy oil to melt away daily stress.',
    inclusions: ['Foot sanitation wash', 'Choice of scented aromatherapy oil', 'Full back, neck, arm & leg massage', 'Hot herbal tea after service'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'massage-combination',
    name: 'Signature Combination Massage (Swedish + Shiatsu)',
    category: 'massage',
    categoryName: 'Body Massage & Spa',
    price: 500,
    priceRange: '₱500 (60 Mins) · ₱750 (90 Mins)',
    durationMinutes: 60,
    description: 'Our most requested treatment: combines deep acupressure Shiatsu trigger-point work with comforting Swedish oil glides.',
    inclusions: ['Targeted knot & tension release', 'Dry pressure point stretching', 'Warm oil soothing finish'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'body-scrub-glow',
    name: 'Aromatherapy Body Scrub & Polish',
    category: 'massage',
    categoryName: 'Body Massage & Spa',
    price: 750,
    priceRange: '₱750 (60 Mins)',
    durationMinutes: 60,
    description: 'Exfoliating full-body scrub made from organic brown sugar and milk proteins to slough away dead skin cells and reveal radiant skin.',
    inclusions: ['Gentle full-body exfoliation', 'Shower rinse off', 'Deep hydrating body lotion massage'],
    gender: 'unisex'
  },

  // --- HAIR & MAKEUP (HMUA) ---
  {
    id: 'hmua-event-glam',
    name: 'Event Hair & Traditional Makeup (Weddings / Debuts / Prom)',
    category: 'makeup',
    categoryName: 'Hair & Makeup (HMUA)',
    price: 999,
    priceRange: '₱999 - ₱1,500',
    durationMinutes: 75,
    description: 'Camera-ready full glam makeup with false lashes and high-end long-wearing cosmetics, paired with an elegant updo or Hollywood waves.',
    inclusions: ['Skin prep & primer', 'High-definition full coverage makeup', 'Premium false eyelashes', 'Formal hairstyling / curls / updo'],
    gender: 'female',
    isPopular: true
  },
  {
    id: 'hmua-casual-day',
    name: 'Casual Day Glam / Photoshoot Styling',
    category: 'makeup',
    categoryName: 'Hair & Makeup (HMUA)',
    price: 650,
    priceRange: '₱650',
    durationMinutes: 45,
    description: 'Fresh, radiant everyday makeup look with light glowy foundation, soft neutral eyeshadow, and casual bouncy hair blowout or curls.',
    inclusions: ['Dewy skin prep', 'Natural lash enhancement', 'Soft glam makeup', 'Casual blowdry & curls'],
    gender: 'female'
  },
  {
    id: 'hmua-airbrush',
    name: 'Airbrush High-Definition Makeup Package',
    category: 'makeup',
    categoryName: 'Hair & Makeup (HMUA)',
    price: 2200,
    priceRange: '₱2,200',
    durationMinutes: 90,
    description: 'Ultra-lightweight, transfer-proof, 16-hour sweat-resistant airbrush foundation finish ideal for Philippine tropical heat and brides.',
    inclusions: ['TEMPTU airbrush foundation', 'Contour & highlight', 'Waterproof eye makeup', 'Intricate bridal/debut hairstyle'],
    gender: 'female'
  },

  // --- HOME SERVICE OPTIONS ---
  {
    id: 'home-rebond-color',
    name: 'Home Service: Rebonding + Hair Treatment Combo',
    category: 'home-service',
    categoryName: 'Home Service Packages',
    price: 1899,
    priceRange: 'Starts at ₱1,899 (Transpo fee applies based on distance)',
    durationMinutes: 200,
    description: 'Full salon rebonding equipment brought right to your living room in Quezon City! Relax at home while our senior stylist pampers your hair.',
    inclusions: ['Senior stylist & assistant', 'Full portable hair rebond setup', 'Complementary hair spa treatment', 'Aftercare guidance'],
    gender: 'unisex',
    isPopular: true
  },
  {
    id: 'home-pamper-duo',
    name: 'Home Service: Family Mani-Pedi & Foot Spa Party',
    category: 'home-service',
    categoryName: 'Home Service Packages',
    price: 1400,
    priceRange: '₱1,400 (For 2 persons) · +₱600 per additional person',
    durationMinutes: 120,
    description: 'Perfect for mothers and daughters, sisters, or bridal parties who want to relax together without leaving the house.',
    inclusions: ['2x Complete Mani-Pedi', '2x Exfoliating Foot Spa with Scrub', 'Sterilized equipment', 'Choice of gel or regular polishes'],
    gender: 'unisex'
  },
  {
    id: 'home-bridal-entourage',
    name: 'Home Service: Event Hair & Makeup Entourage',
    category: 'home-service',
    categoryName: 'Home Service Packages',
    price: 3500,
    priceRange: 'Starts at ₱3,500 (3 pax bundle)',
    durationMinutes: 180,
    description: 'Mobile beauty team on-location at your residence, hotel, or venue in QC and Metro Manila for weddings, graduations, and family portraits.',
    inclusions: ['3 pax Hair & Makeup', 'Ring light setup', 'False lashes for all', 'Touch-up kit provided'],
    gender: 'female'
  }
];

export const MONTHLY_PROMOTIONS: PromotionDeal[] = [
  {
    id: 'promo-rebond-glow',
    title: 'The Great Silk Rebond + Free Hair Spa',
    subtitle: 'Our 5th Anniversary Signature Offer',
    tag: 'Save ₱600',
    originalPrice: 2099,
    promoPrice: 1499,
    savings: 600,
    validity: 'Valid throughout the current month',
    includedServices: [
      'Permanent Silk Rebonding (Any Hair Length)',
      'Intensive Keratin Hair Spa Treatment',
      'Wash, Cut & Blowdry Styling'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    description: 'Get silky-smooth, effortlessly straight hair with an included deep keratin spa treatment to maintain maximum shine and bounce.'
  },
  {
    id: 'promo-mom-me',
    title: 'Mom & Me Pamper Duo (2 Persons)',
    subtitle: 'Accessible Family Beauty Special',
    tag: 'Popular Bundle',
    originalPrice: 1100,
    promoPrice: 799,
    savings: 301,
    validity: 'Monday to Thursday Exclusive',
    includedServices: [
      '2x Classic Manicure',
      '2x Classic Pedicure with Scrub',
      '2x Calming Hand & Foot Lotion Massage'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    description: 'Spend quality bonding time at Salon MD. Treat yourself and your mom, daughter, or best friend to relaxing nail care at an unbeatable mall price.'
  },
  {
    id: 'promo-lash-brow',
    title: 'Lash Lift & Brow Arch Glow Duo',
    subtitle: 'Wake Up Ready Package',
    tag: 'Only ₱650',
    originalPrice: 870,
    promoPrice: 650,
    savings: 220,
    validity: 'All Days',
    includedServices: [
      'Keratin Lash Lift with Black Tint',
      'Precision Eyebrow Threading & Shaping',
      'Aloe Vera Calming Finish'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Define your natural beauty without makeup. Lifted lashes that last up to 6 weeks paired with clean, crisp eyebrow arches.'
  },
  {
    id: 'promo-total-relax',
    title: 'Total Body & Foot Stress Melt',
    subtitle: 'Mid-Week Wellness Escape',
    tag: 'Save ₱250',
    originalPrice: 950,
    promoPrice: 699,
    savings: 251,
    validity: 'Open Daily 10 AM - 8 PM',
    includedServices: [
      '60-Min Swedish or Shiatsu Body Massage',
      'Exfoliating Foot Spa with Peppermint Scrub',
      'Complimentary Hot Herbal Tea'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Unwind after shopping or a busy work week at Circle C Mall. Enjoy quiet private massage cubicles with expert registered masseuses.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Glossy Silk Rebonding Result',
    category: 'hair',
    categoryLabel: 'Hair Transformations',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    description: 'From unmanageable wavy frizz to pin-straight glass hair with Japanese botanical rebonding solution.',
    serviceTags: ['Hair Rebonding', 'Hair Botox', 'Circle C 2nd Floor']
  },
  {
    id: 'gal-2',
    title: 'Warm Chestnut Balayage & Layers',
    category: 'hair',
    categoryLabel: 'Hair Transformations',
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    description: 'Soft dimensional face-framing balayage highlights finished with our signature blowout waves.',
    serviceTags: ['Full Color', 'Balayage', 'Blowdry']
  },
  {
    id: 'gal-3',
    title: 'Pastel French Gel Nail Art & Chrome',
    category: 'nails',
    categoryLabel: 'Nail Care & Art',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    description: 'High-shine LED cured gel nails with subtle chrome glazed-donut shimmer and hand-painted French borders.',
    serviceTags: ['Gel Nails', 'Nail Art', 'Manicure']
  },
  {
    id: 'gal-4',
    title: 'Refreshing Foot Spa & Pedi Setup',
    category: 'nails',
    categoryLabel: 'Nail Care & Art',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    description: 'Clean, sanitized whirlpool basin with dead sea salt crystals and fresh mint scrub.',
    serviceTags: ['Foot Spa', 'Pedicure', 'Relaxation']
  },
  {
    id: 'gal-5',
    title: 'Hybrid Feather Lash Extensions',
    category: 'lashes-brows',
    categoryLabel: 'Lashes & Eyebrows',
    imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
    description: 'Natural fluffy hybrid lash set with gentle cat-eye elongation tailored for Asian eye shapes.',
    serviceTags: ['Eyelash Extensions', 'Lash Lift', 'No Mascara']
  },
  {
    id: 'gal-6',
    title: 'Ombré Powder Brows Transformation',
    category: 'lashes-brows',
    categoryLabel: 'Lashes & Eyebrows',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    description: 'Perfect natural eyebrow symmetry with soft powdered gradient shading. Waterproof and smudge-free.',
    serviceTags: ['Microblading', 'Eyebrow Threading', 'Tattoo Shading']
  },
  {
    id: 'gal-7',
    title: 'Tranquil Massage & Wellness Room',
    category: 'ambience',
    categoryLabel: 'Salon Ambience',
    imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
    description: 'Private, dimly-lit massage room equipped with fresh linens, gentle instrumental music, and calming aroma.',
    serviceTags: ['Swedish Massage', 'Shiatsu', 'Body Scrub']
  },
  {
    id: 'gal-8',
    title: 'Welcoming Salon MD Styling Stations',
    category: 'ambience',
    categoryLabel: 'Salon Ambience',
    imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious, well-lit stations on the 2nd Floor of Circle C Mall with modern mirrors and sanitized tools.',
    serviceTags: ['Circle C Mall 2nd Floor', '5 Years of Service', 'Quezon City']
  }
];

export const FREQUENT_QUESTIONS = [
  {
    q: "Do I need to book an appointment or do you accept walk-ins?",
    a: "We warmly welcome walk-in customers anytime during mall hours (10:00 AM to 8:00 PM daily)! However, for longer procedures like Hair Rebonding, Hair Botox, Microblading, or Weekend Home Services, you can message our mobile or Viber numbers in advance so our senior staff can prepare your chair."
  },
  {
    q: "Where exactly are you located inside Circle C Mall?",
    a: "We are located on the 2nd Floor of Circle C Mall, Congressional Avenue, Project 8, Quezon City. When you take the central escalator up to the 2nd floor, look toward the fashion and wellness wing right beside the central atrium railing."
  },
  {
    q: "What payment methods do you accept at Salon MD?",
    a: "We accept Cash, GCash, Maya, and direct online bank transfers (BDO and BPI). Digital QR codes are prominently displayed at the cashier counter."
  },
  {
    q: "How does your Home Service work?",
    a: "For clients who prefer being serviced at home (e.g., busy mothers, families, or event attendees), our team brings professional tools directly to your residence within Quezon City and nearby Metro Manila areas. Just message us your location and desired services for scheduling and transpo details."
  },
  {
    q: "Are waxing and massage services available for both men and women?",
    a: "Yes! Salon MD provides haircuts, hair color, facial threading, full body massage, and waxing services (including chest, back, legs, and underarms) for both male and female clients in comfortable, private partitions."
  }
];

export const STYLISTS_DATA = [
  {
    id: 'any',
    name: 'Any Available Specialist',
    role: 'Salon MD Pro Team',
    specialty: 'Assigned upon arrival for shortest wait time',
    rating: 4.9,
    available: true
  },
  {
    id: 'stylist-gina',
    name: 'Ate Gina Santos',
    role: 'Senior Hair & Rebonding Master',
    specialty: 'Japanese Rebonding, Hair Botox, Balayage (9+ yrs exp)',
    rating: 5.0,
    available: true
  },
  {
    id: 'stylist-may',
    name: 'Ate May Flor',
    role: 'Senior Nail & Foot Spa Technician',
    specialty: 'Russian Manicure, Custom Gel Art, Paraffin Therapy',
    rating: 4.9,
    available: true
  },
  {
    id: 'stylist-joy',
    name: 'Ate Joy Dela Cruz',
    role: 'Lash & Brow Aesthetician',
    specialty: 'Volume Eyelashes, Keratin Lash Lift, 6D Microblading',
    rating: 5.0,
    available: true
  },
  {
    id: 'stylist-mark',
    name: 'Kuya Mark Bautista',
    role: 'Men’s Grooming & Body Massage Specialist',
    specialty: 'Precision Fade, Deep Tissue Shiatsu & Full Body Swedish',
    rating: 4.8,
    available: true
  }
];

export const TIME_SLOTS = [
  { time: '10:00 AM', status: 'available' },
  { time: '11:15 AM', status: 'available' },
  { time: '12:30 PM', status: 'available' },
  { time: '01:45 PM', status: 'available' },
  { time: '03:00 PM', status: 'available' },
  { time: '04:15 PM', status: 'available' },
  { time: '05:30 PM', status: 'available' },
  { time: '06:45 PM', status: 'available' }
];

export const PAYMENT_CONFIG = {
  downpaymentPercent: 0.25, // 25% down payment deposit to secure slot
  prepayFullDiscountPercent: 0.05, // 5% discount if paid in full online
  autoCancelTimeoutMinutes: 15, // 15-minute slot hold for unpaid/unverified reference numbers
  autoCancelEnabled: true, // Automatically cancel unpaid reference numbers when time expires
  gcash: {
    merchantName: 'SALON MD CIRCLE C MALL',
    accountNumber: '0917 584 7219',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=09175847219',
    qrNote: 'Scan with GCash app to send reservation fee'
  },
  maya: {
    merchantName: 'SALON MD BEAUTY HUB',
    accountNumber: '0917 584 7219',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=09175847219',
    qrNote: 'Scan using Maya / QR Ph compliant banking apps'
  },
  bank: {
    bdo: {
      accountName: 'Salon MD Beauty Services Inc.',
      accountNumber: '0034-8901-2294'
    },
    bpi: {
      accountName: 'Salon MD Beauty Services Inc.',
      accountNumber: '4491-0392-81'
    }
  }
};

