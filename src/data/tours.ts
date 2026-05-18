import shaniwar from "@/assets/tour-shaniwar.jpg";
import sinhagad from "@/assets/tour-sinhagad.jpg";
import shivneri from "@/assets/tour-shivneri.jpg";
import parvati from "@/assets/tour-parvati.jpg";
import kondane from "@/assets/tour-kondane.jpg";
import gondeshwar from "@/assets/tour-gondeshwar.jpg";
import heroFort from "@/assets/hero-fort.jpg";
import heroStory from "@/assets/hero-story.jpg";
import heroTemple from "@/assets/hero-temple.jpg";
import ayodhyaVaranasiPrayagraj from "@/assets/tour-ayodhya-varanasi-prayagraj.jpg";
import badamiCave from "@/assets/gallery/badami-cave.jpg";
import gondeshwarDetail from "@/assets/gallery/gondeshwar-detail.jpg";
import hampiPillars from "@/assets/gallery/hampi-pillars.jpg";
import pattadakalTemple from "@/assets/gallery/pattadakal-temple.jpg";
import {
  type GalleryImage,
  ayodhyaVaranasiPrayagrajGallery,
  gondeshwarGallery,
  hampiBadamiGallery,
  kondaneGallery,
  parvatiGallery,
  shaniwarGallery,
  shivneriGallery,
  sinhagadGallery,
} from "@/data/tourGalleries";

export type Tour = {
  slug: string;
  title: string;
  cardRibbonLabel?: string;
  tourDate?: string;
  tourDateLabel?: string;
  bookingUrl?: string;
  status?: "draft" | "published";
  category: string;
  location: string;
  duration: string;
  difficulty: string;
  bestFor: string;
  bestSeason: string;
  groupSize: string;
  price: string;
  image: string;
  gallery: GalleryImage[];
  short: string;
  overview: string;
  history: string;
  highlights: string[];
  itinerary: { time: string; title: string; desc: string }[];
  inclusions: string[];
  exclusions: string[];
  carry: string[];
  whoCanJoin: string;
  faqs: { q: string; a: string }[];
  notes?: string[];
};

export const tours: Tour[] = [
  {
    slug: "shaniwar-wada-heritage-walk",
    title: "Shaniwar Wada Heritage Walk",
    category: "Heritage Walk",
    location: "Pune",
    duration: "2 – 3 Hours",
    difficulty: "Easy",
    bestFor: "Families, students, history lovers",
    bestSeason: "October – March",
    groupSize: "6 – 20 people",
    price: "₹ — / person",
    image: shaniwar,
    gallery: [
      { src: shaniwar, alt: "Carved stone architecture inside Shaniwar Wada" },
      ...shaniwarGallery,
    ],
    short: "Step inside the Peshwa-era heart of Pune through stories, legends and stone.",
    overview:
      "A guided storytelling walk that unfolds the rise of the Peshwas, the daily rhythm of 18th-century Pune, and the architectural choices that shaped Shaniwar Wada. We walk slowly, look closely, and listen to history breathe.",
    history:
      "Built in 1732 by Bajirao I, Shaniwar Wada was once the seat of Maratha power. Its seven-storeyed wooden palaces, fountains and audience halls saw alliances, intrigues and the famous cry that still echoes — 'Kaka mala vachva'.",
    highlights: [
      "Expert storyteller guide",
      "Walk through Delhi Darwaza & Mastani Darwaza",
      "Decoding Peshwa architecture",
      "Hidden lanes of old Pune",
      "Photo stops & cultural anecdotes",
    ],
    itinerary: [],
    inclusions: ["Heritage guide", "Entry tickets", "Bottled water", "Story handout"],
    exclusions: ["Travel to meeting point", "Personal expenses", "Food & beverages"],
    carry: ["Comfortable walking shoes", "Cap & sunglasses", "Water bottle", "Curiosity"],
    whoCanJoin: "Suitable for ages 8+. Friendly for families and senior citizens.",
    faqs: [
      {
        q: "Is this walk suitable for children?",
        a: "Yes — we keep storytelling engaging for ages 8 and above.",
      },
      {
        q: "Will there be a lot of walking?",
        a: "Around 1.5 – 2 km at an easy pace, with frequent stops.",
      },
    ],
  },
  {
    slug: "sinhagad-fort-heritage-trail",
    title: "Sinhagad Fort Heritage Trail",
    category: "Fort Tour",
    location: "Pune",
    duration: "Half Day",
    difficulty: "Moderate",
    bestFor: "Trek lovers, families, history enthusiasts",
    bestSeason: "June – February",
    groupSize: "8 – 25 people",
    price: "₹ — / person",
    image: sinhagad,
    gallery: [
      { src: sinhagad, alt: "Sinhagad Fort overlooking the Sahyadri hills" },
      ...sinhagadGallery,
    ],
    short: "Walk the ramparts where Tanaji Malusare wrote his name into legend.",
    overview:
      "From the Pune Darwaza to Kalyan Darwaza, this trail blends a gentle climb with deep storytelling around the 1670 Battle of Sinhagad and Maratha military genius.",
    history:
      "Originally Kondhana, this fort guarded a vital route into the Deccan. Tanaji's night assault gave Shivaji Maharaj a victory remembered in the line — 'Gad ala pan Sinha gela'.",
    highlights: [
      "Tanaji Malusare memorial",
      "Pune & Kalyan Darwaza walk",
      "Sahyadri viewpoints",
      "Local kanda bhaji & taak experience",
      "Battle storytelling on-site",
    ],
    itinerary: [
      {
        time: "Morning",
        title: "Drive & Ascent",
        desc: "Drive from Pune; light climb to the fort.",
      },
      { time: "Mid-day", title: "Fort Walk", desc: "Walk the ramparts with on-site storytelling." },
      { time: "Afternoon", title: "Local Lunch", desc: "Traditional pithla bhakri at the fort." },
    ],
    inclusions: ["Transport from Pune", "Heritage guide", "Light snacks", "First-aid"],
    exclusions: ["Lunch", "Personal expenses"],
    carry: ["Trekking shoes", "Rain jacket (monsoon)", "Water (1 L)", "Light backpack"],
    whoCanJoin: "Anyone reasonably fit, ages 10+.",
    faqs: [
      { q: "How tough is the climb?", a: "Moderate — about 45 minutes of steady walking." },
      { q: "Is monsoon a good time?", a: "Yes, but expect mist, slippery rocks and wet shoes." },
    ],
  },
  {
    slug: "shivneri-fort-tour",
    title: "Shivneri Fort Tour",
    category: "Fort Tour",
    location: "Junnar",
    duration: "Full Day",
    difficulty: "Moderate",
    bestFor: "History lovers, students, families",
    bestSeason: "October – February",
    groupSize: "8 – 25 people",
    price: "₹ — / person",
    image: shivneri,
    gallery: [{ src: shivneri, alt: "Stone path and fort walls at Shivneri" }, ...shivneriGallery],
    short: "Walk through the birthplace of Chhatrapati Shivaji Maharaj.",
    overview:
      "A full-day journey to Shivneri — the fort where a young Shivaji absorbed the lessons of Jijabai. We explore the seven gates, water cisterns and the very rooms that shaped Maratha history.",
    history:
      "A hill fort dating back to the 1st century, Shivneri rose to historical importance in 1630 when Chhatrapati Shivaji Maharaj was born here. Its design is a textbook of Deccan fortification.",
    highlights: [
      "Seven darwazas walk",
      "Shivai Devi temple",
      "Birthplace chamber",
      "Storytelling on Jijabai's parenting",
      "Junnar caves viewpoint",
    ],
    itinerary: [
      { time: "07:00", title: "Depart Pune", desc: "Comfortable drive to Junnar." },
      { time: "10:30", title: "Fort Climb", desc: "Walk through all seven gates with stories." },
      { time: "13:30", title: "Local Lunch", desc: "Traditional Junnar thali." },
      { time: "16:00", title: "Return", desc: "Drive back to Pune." },
    ],
    inclusions: ["AC transport", "Guide", "Breakfast & lunch", "Entry fees"],
    exclusions: ["Personal expenses", "Tips"],
    carry: ["Walking shoes", "Cap", "Water", "ID proof"],
    whoCanJoin: "Ages 10+. Reasonable fitness needed.",
    faqs: [
      { q: "Is food included?", a: "Yes, breakfast and a traditional thali lunch are included." },
    ],
  },
  {
    slug: "parvati-hill-heritage-walk",
    title: "Parvati Hill Heritage Walk",
    category: "Heritage Walk",
    location: "Pune",
    duration: "2 Hours",
    difficulty: "Easy to Moderate",
    bestFor: "Families, senior citizens, students",
    bestSeason: "Year-round",
    groupSize: "6 – 20 people",
    price: "₹ — / person",
    image: parvati,
    gallery: [{ src: parvati, alt: "Parvati Hill temple complex at sunrise" }, ...parvatiGallery],
    short: "A sunrise climb into Pune's spiritual and Peshwa-era memory.",
    overview:
      "An easy heritage climb to Parvati's temple complex — one of Pune's oldest. We unpack the Peshwa connection, the Devdeveshwar shrine and the panoramic story the city tells from above.",
    history:
      "Built between 1749 and 1758 by Nanasaheb Peshwa, Parvati hill houses the Devdeveshwar, Vishnu, Vitthal and Kartikeya shrines and the Peshwa museum.",
    highlights: [
      "Sunrise city panorama",
      "Devdeveshwar shrine stories",
      "Peshwa museum visit",
      "Heritage architecture talk",
      "Easy climb of 103 steps",
    ],
    itinerary: [],
    inclusions: ["Guide", "Story handout"],
    exclusions: ["Travel", "Refreshments"],
    carry: ["Walking shoes", "Water", "Light jacket"],
    whoCanJoin: "All ages. Senior-citizen friendly with breaks.",
    faqs: [
      {
        q: "Is it safe early morning?",
        a: "Yes, the route is well-lit and busy with regular walkers.",
      },
    ],
  },
  {
    slug: "kondane-caves-exploration",
    title: "Kondane Caves Exploration",
    category: "Ancient Caves Tour",
    location: "Karjat",
    duration: "Full Day",
    difficulty: "Moderate",
    bestFor: "Adventure and heritage lovers",
    bestSeason: "July – February",
    groupSize: "8 – 20 people",
    price: "₹ — / person",
    image: kondane,
    gallery: [
      { src: kondane, alt: "Trail and rock-cut facade at Kondane Caves" },
      ...kondaneGallery,
    ],
    short: "Step into 2nd-century BCE Buddhist rock-cut wonders.",
    overview:
      "A full-day exploration of the Kondane caves — a beautifully carved chaitya and viharas tucked in the Sahyadris. We blend a short trek, ancient trade-route history and rock-cut architecture.",
    history:
      "Carved around the 2nd century BCE, Kondane sat on an ancient trade route linking the Konkan to the Deccan. Its chaitya hall is among the earliest examples of Buddhist rock architecture in India.",
    highlights: [
      "Chaitya hall walk-through",
      "Vihara cells exploration",
      "Trade-route storytelling",
      "Waterfall viewpoint (monsoon)",
      "Local village interaction",
    ],
    itinerary: [
      { time: "06:30", title: "Depart", desc: "Drive from Pune / Mumbai." },
      { time: "10:00", title: "Trek", desc: "1.5 hr trek to caves." },
      { time: "12:30", title: "Caves tour", desc: "On-site storytelling and exploration." },
      { time: "15:00", title: "Return", desc: "Drive back." },
    ],
    inclusions: ["Transport", "Guide", "Breakfast", "First-aid"],
    exclusions: ["Lunch", "Personal expenses"],
    carry: ["Trekking shoes", "Water (2 L)", "Snacks", "Rain gear (monsoon)"],
    whoCanJoin: "Ages 12+. Should be comfortable with light trekking.",
    faqs: [{ q: "Is the trek difficult?", a: "Moderate. ~3 km one way with some rocky patches." }],
  },
  {
    slug: "gondeshwar-temple-architecture-tour",
    title: "Gondeshwar Temple Architecture Tour",
    category: "Temple & Architecture",
    location: "Sinnar",
    duration: "Full Day",
    difficulty: "Easy",
    bestFor: "Architecture lovers, photographers, families",
    bestSeason: "October – March",
    groupSize: "8 – 25 people",
    price: "₹ — / person",
    image: gondeshwar,
    gallery: [
      { src: gondeshwar, alt: "Gondeshwar Temple stone spire against a blue sky" },
      ...gondeshwarGallery,
    ],
    short: "A masterpiece of Hemadpanthi architecture, decoded stone by stone.",
    overview:
      "A guided study of the 12th-century Gondeshwar temple complex — five shrines arranged in panchayatana style, with sculpture, geometry and mythology decoded by an expert.",
    history:
      "Built in the 11–12th century by the Yadava rulers, Gondeshwar is among the finest surviving Hemadpanthi temples — assembled in stone without mortar.",
    highlights: [
      "Panchayatana layout walk",
      "Sculptural iconography",
      "Yadava-era history",
      "Photography session",
      "Local Sinnar lunch",
    ],
    itinerary: [
      { time: "07:00", title: "Depart", desc: "Drive from Pune to Sinnar." },
      { time: "11:00", title: "Temple study", desc: "Detailed guided tour." },
      { time: "14:00", title: "Lunch", desc: "Traditional regional thali." },
      { time: "17:00", title: "Return", desc: "Drive back." },
    ],
    inclusions: ["Transport", "Expert guide", "Breakfast & lunch"],
    exclusions: ["Personal expenses", "Tips"],
    carry: ["Comfortable shoes", "Camera", "Water", "Cap"],
    whoCanJoin: "All ages. No fitness barrier.",
    faqs: [{ q: "Can we photograph inside?", a: "Yes — Gondeshwar is photographer-friendly." }],
  },
  {
    slug: "hampi-badami-heritage-trip",
    title: "Hampi Badami Heritage Trip",
    tourDate: "2026-08-10",
    tourDateLabel: "10-16 August",
    category: "Multiple Day Tour",
    location: "Badami, Pattadakal, Aihole, Ilkal and Hampi",
    duration: "10-16 August 2026",
    difficulty: "4-5 km walking/day",
    bestFor: "",
    bestSeason: "",
    groupSize: "",
    price: "Rs. 34,000",
    image: heroTemple,
    gallery: [
      { src: heroTemple, alt: "Sunlit pillars and carvings inside a temple mandapa" },
      ...hampiBadamiGallery,
    ],
    short:
      "Badami, Pattadakal, Aihole and Hampi heritage tour with hotel stay, meals, local transport and sightseeing.",
    overview:
      "Catch a train from Mumbai or Pune towards Gadag, reach Badami by about 9 AM, and continue through Badami, Pattadakal, Aihole, Ilkal and Hampi before returning from Hospete on 16 August 2026.",
    history: "",
    highlights: [
      "Badami Museum, Bhootnath Temple and Banashankari Temple",
      "Pattadakal and Badami Caves",
      "Aihole heritage sites and Ilkal saree shopping stop",
      "Vijay Vitthala Temple, Hemakuta Hill and Virupaksha Temple",
      "Hampi Museum, Lotus Mahal, Elephant Stable and Queen's Bath",
      "Malyavant Raghunath Temple sunset",
      "Royal Enclosure, Hazara Rama Temple and Krishna Temple area",
      "Achyutaraya Temple, Kodandarama Temple and Yantroddharaka Maruti Temple",
      "Coracle ride in Hampi if rain permits",
    ],
    itinerary: [
      {
        time: "Day 0 - 10 August 2026",
        title: "Train to Badami",
        desc: "Catch a train from Mumbai or Pune towards Gadag and reach Badami by about 9 AM the next morning. Train mentioned in the itinerary: 11139 - Hosapete SF Express.",
      },
      {
        time: "Day 1 - 11 August 2026",
        title: "Badami",
        desc: "After breakfast check in to the hotel and after lunch proceed towards Badami Caves. Visit Badami Museum, Bhootnath Temple and spend the evening at Banashankari Temple. Meals: breakfast, lunch, evening tea/coffee and dinner.",
      },
      {
        time: "Day 2 - 12 August 2026",
        title: "Pattadakal and Badami Caves",
        desc: "After breakfast head towards Pattadakal, explore Pattadakal till lunch, return to Badami and after lunch visit Badami Caves. Meals: breakfast, lunch and dinner.",
      },
      {
        time: "Day 3 - 13 August 2026",
        title: "Aihole and Hampi",
        desc: "Head towards Aihole early in the morning, have breakfast there, visit heritage places in Aihole and then continue towards Hampi. En route stop at Ilkal for saree shopping. Stay at Hampi. Meals: breakfast, lunch and dinner.",
      },
      {
        time: "Day 4 - 14 August 2026",
        title: "Religious Hampi Trail",
        desc: "Start at 6:00 AM with Vijay Vitthala Temple, then after breakfast explore Hemakuta Hill and Virupaksha Temple. After lunch at KSTDC visit Hampi Museum, Lotus Mahal, Elephant Stable and Queen's Bath, then watch sunset from Malyavant Raghunath Temple. Meals: breakfast, lunch, dinner and tea/coffee.",
      },
      {
        time: "Day 5 - 15 August 2026",
        title: "Royal Enclosure and Riverside Temples",
        desc: "Visit the Royal Enclosure area and Hazara Rama Temple before breakfast. After breakfast explore Krishna Temple and the surrounding area, return for lunch, then spend the evening at Achyutaraya Temple, Kodandarama Temple and Yantroddharaka Maruti Temple. Coracle ride if available. Meals: breakfast, lunch, dinner and tea/coffee.",
      },
      {
        time: "Day 6 - 16 August 2026",
        title: "Departure from Hospete",
        desc: "After breakfast depart to Hospete to catch the 1 PM train to your respective locations. Meals: breakfast and lunch. Dinner in the train is up to the participants.",
      },
    ],
    inclusions: [
      "Local transportation by private bus/car for all days depending on the number of participants",
      "Comfortable AC hotel rooms on double sharing basis",
      "Breakfast, lunch, dinner and evening tea as per set menu",
      "Entrance fees to all sightseeing locations",
      "Heritage expertise",
      "Coracle ride in Hampi if rain permits",
    ],
    exclusions: [
      "To and fro train cost to Hampi/Badami, around Rs. 2,500 depending on the coach booked",
      "Personal food orders apart from the set menu",
      "Mineral water bottles, porter charges, personal shopping and food bought elsewhere",
      "Expenses due to illness, accident or hospitalization",
      "Anything not included in the inclusions list",
    ],
    carry: [
      "Clothes for 5 days",
      "Hat/caps/goggles",
      "Camera (optional)",
      "Personal medicines",
      "ID cards: Aadhar/PAN/Driving License",
      "Dry snacks",
      "A small carry bag/sack during day travel",
      "Umbrella or raincoat",
    ],
    whoCanJoin:
      "Participants should be comfortable with at least 4-5 km walking during the day. If you have any health problem or medical condition, let us know in advance and be prepared to adjust with the group.",
    faqs: [],
    notes: [
      "30% advance needs to be paid while booking.",
      "In case of medical condition or any special request, let us know in writing before you enroll for the tour.",
      "The organizers are history experts and are there to facilitate the trip, so participants are expected to behave respectfully with them.",
    ],
  },
  {
    slug: "ayodhya-varanasi-prayagraj-tour",
    title: "Varanasi-Sarnath-Ayodhya Heritage Tour",
    tourDate: "2026-07-08",
    tourDateLabel: "8-12 July",
    category: "Multiple Day Tour",
    location: "Varanasi, Sarnath, Ayodhya and Lucknow",
    duration: "5 Days / 4 Nights",
    difficulty: "4-5 km walking/day",
    bestFor: "Families, spiritual travellers and heritage seekers",
    bestSeason: "",
    groupSize: "",
    price: "Rs. 32,000",
    image: ayodhyaVaranasiPrayagraj,
    gallery: [
      { src: ayodhyaVaranasiPrayagraj, alt: "Shri Ram Janmabhoomi Mandir in Ayodhya" },
      ...ayodhyaVaranasiPrayagrajGallery.slice(0, 2),
    ],
    short:
      "Five days of Ganga Aarti, Kashi darshan, Sarnath, Ram Lala in Ayodhya, and a final Lucknow city day.",
    overview:
      "Planned for 8-12 July 2026, this guided heritage journey begins in Varanasi, continues through Sarnath, gives Ayodhya a full darshan-focused day, and closes with Lucknow sightseeing before departure. The pace is designed for travellers who want temple visits, city history and comfortable group coordination together.",
    history:
      "Varanasi is one of the world's oldest living cities, Sarnath marks the site of the Buddha's first sermon, Ayodhya is revered as the birthplace of Shri Ram and one of Hinduism's seven sacred cities, and Lucknow carries the layered courtly heritage of Awadh. Together, the route offers a compact but meaningful North India pilgrimage and culture circuit.",
    highlights: [
      "Evening Ganga Aarti and ghat walk in Varanasi",
      "Early darshan at Kashi Vishweshwar and Kal Bhairavnath",
      "Guided visit to the Sarnath archaeological site",
      "Ram Lala darshan in Ayodhya with Hanuman Garhi, Kanak Bhavan and Dashrath Mahal",
      "Lucknow monuments and Chikankari shopping time",
      "AC stay, meals, Sugam Darshan and Varanasi boat ride included",
    ],
    itinerary: [
      {
        time: "Day 1",
        title: "Arrival in Varanasi and Ganga Aarti",
        desc: "Fly from Mumbai or Pune to Varanasi, reach by about 1 PM, check in after arrival, and head to the Ganga ghat in the evening for Aarti and an introduction to the history of the city. Lunch and evening tea are included.",
      },
      {
        time: "Day 2",
        title: "Kashi Vishweshwar Darshan and Old Varanasi",
        desc: "Begin early with darshan at Kashi Vishweshwar, return for breakfast, and then continue with local sightseeing. The day includes Kal Bhairavnath Temple, time on the old ghats, and shopping in Varanasi. Breakfast, lunch, evening tea or coffee, and dinner are included.",
      },
      {
        time: "Day 3",
        title: "Sarnath Visit and Transfer to Ayodhya",
        desc: "After breakfast, check out and visit the Sarnath archaeological site. Following lunch, travel onward to Ayodhya, reach by evening, and check in for the night. Breakfast, lunch, evening tea or coffee, and dinner are included.",
      },
      {
        time: "Day 4",
        title: "Ayodhya Darshan and Transfer to Lucknow",
        desc: "Start early with Ram Lala darshan, return for breakfast, and then visit Hanuman Garhi, Kanak Bhavan and Dashrath Mahal. After lunch, check out and continue to Lucknow, arriving by evening for check-in and leisure time. Breakfast, lunch, evening tea or coffee, and dinner are included.",
      },
      {
        time: "Day 5",
        title: "Lucknow Sightseeing and Departure",
        desc: "Spend the day exploring key Lucknow monuments and shopping for Chikankari clothing before departing at night with the tour's closing meal service. Breakfast, lunch and evening tea or coffee are included.",
      },
    ],
    inclusions: [
      "Local transportation by private bus, car or rickshaw depending on group size",
      "Comfortable AC three-star hotel rooms on double-sharing basis",
      "Breakfast, lunch, dinner and evening tea on a set menu",
      "Entrance fees to all listed sightseeing locations",
      "Heritage expertise throughout the tour",
      "Sugam Darshan charges in Varanasi",
      "Boat ride charges in Varanasi",
    ],
    exclusions: [
      "Flights or train tickets from Pune or Mumbai to Varanasi and the return journey home",
      "Optional Pune to Navi Mumbai airport transfers, if arranged separately",
      "Personal food orders outside the set menu",
      "Mineral water, porter charges, personal shopping and snacks bought separately",
      "Expenses due to illness, accident or hospitalization",
      "Ayodhya temple wheelchair charges, about Rs. 150 per wheelchair",
      "Anything not specifically listed in the inclusions",
    ],
    carry: [
      "Clothes for 5 days",
      "Comfortable walking footwear",
      "Hat, cap or sunglasses",
      "Personal medicines",
      "Government ID proof",
      "Dry snacks",
      "Small day bag",
      "Camera (optional)",
    ],
    whoCanJoin:
      "Suitable for families, devotees and mixed-age groups who can comfortably manage 4-5 km of walking during the day. Please share any health condition or mobility support requirement in advance so the group plan can be managed smoothly.",
    faqs: [
      {
        q: "Are flights included in the tour cost?",
        a: "No. The Rs. 32,000 cost covers the land package only; flights or train tickets to Varanasi and the onward return are excluded.",
      },
      {
        q: "How much walking should I expect during the trip?",
        a: "Please expect around 4-5 km of walking over the course of the day across temple areas, ghats and city lanes.",
      },
      {
        q: "Is there any group discount or advance payment requirement?",
        a: "Yes. A 5% group discount applies when 4 or more people join, and booking requires a 30% advance payment.",
      },
    ],
    notes: [
      "Departure covered in the itinerary: 8-12 July 2026.",
      "A 5% group discount applies when 4 or more people join the tour.",
      "Booking requires a 30% advance payment.",
      "Sightseeing is planned to reduce afternoon heat, with more movement in the morning and evening.",
      "Temple timings, darshan flow and local security arrangements may change the exact sequence.",
      "If you need medical or mobility support, please share it in writing before booking.",
    ],
  },
];

export const getTour = (slug: string) => tours.find((t) => t.slug === slug);

export const upcomingTours = [
  { slug: "shaniwar-wada-heritage-walk", date: "May 11, 2026", seats: 8 },
  { slug: "sinhagad-fort-heritage-trail", date: "May 17, 2026", seats: 12 },
  { slug: "shivneri-fort-tour", date: "May 24, 2026", seats: 14 },
  { slug: "parvati-hill-heritage-walk", date: "June 1, 2026", seats: 10 },
  { slug: "kondane-caves-exploration", date: "June 14, 2026", seats: 9 },
  { slug: "gondeshwar-temple-architecture-tour", date: "June 28, 2026", seats: 16 },
];

export const blogPosts = [
  {
    slug: "legacy-of-historic-forts",
    title: "The Legacy of Historic Forts",
    date: "April 12, 2026",
    category: "Forts",
    excerpt:
      "From Sahyadri ridges to coastal sea-forts — why these stones still speak to us today.",
    image: sinhagad,
  },
  {
    slug: "why-heritage-walks-matter",
    title: "Why Heritage Walks Are Important",
    date: "April 02, 2026",
    category: "Heritage Walks",
    excerpt: "Walking slowly through history changes how we see our cities. Here's why.",
    image: shaniwar,
  },
  {
    slug: "hidden-temples-around-pune",
    title: "Hidden Temples Around Pune",
    date: "March 22, 2026",
    category: "Temples",
    excerpt: "Five lesser-known temples around Pune that tell big stories.",
    image: gondeshwar,
  },
  {
    slug: "storytelling-makes-travel-memorable",
    title: "How Storytelling Makes Travel Memorable",
    date: "March 10, 2026",
    category: "Culture",
    excerpt: "Memory clings to story. Here's how we design tours people remember for years.",
    image: parvati,
  },
  {
    slug: "student-heritage-tours",
    title: "Student Heritage Tours That Make History Stick",
    date: "Feb 28, 2026",
    category: "Education",
    excerpt: "How a well-designed heritage trip can change a student's relationship with history.",
    image: shivneri,
  },
  {
    slug: "hampi-lotus-mahal",
    title: "The lotus Mahal in Hampi - a fine example of Indo-Saracenic architecture",
    date: "Oct 12, 2020",
    category: "Wonders of India",
    excerpt:
      "A sourced note on Hampi's Lotus Mahal and the blend of arches, ornament, and courtly design that makes it so memorable.",
    content:
      "Set inside Hampi's Zenana Enclosure, the Lotus Mahal is remembered for its unusual plan, open pavilion feel, and the graceful meeting of Hindu and Islamic design vocabulary.\n\nThe original article pays close attention to its stucco work, recessed basement, windows, arches, and even the staircase that seems to have been added after the main design was conceived.\n\nTogether, those details make the monument more than a pretty ruin - it becomes a lesson in how Vijayanagara architecture absorbed and reshaped multiple traditions.",
    image: hampiPillars,
    sourceName: "School of Indian History",
    sourceUrl: "https://schoolofindianhistory.com/index.php/2020/10/12/hampi-lotus-mahal/",
  },
  {
    slug: "thousand-pillars-temple-gem-of-kaktiya-archietecture",
    title: "Thousand pillars temple - Gem of Kaktiya Archietecture",
    date: "Sep 17, 2020",
    category: "Wonders of India",
    excerpt:
      "A sourced introduction to the Thousand Pillar Temple near Warangal and the overlooked brilliance of Kakatiya architecture.",
    content:
      "This article places the Thousand Pillar Temple in the larger story of the Kakatiya dynasty and their artistic world in present-day Telangana.\n\nIts focus is not only on the monument's beauty, but on the craft discipline behind it: richly worked pillars, sculptural detail, and a temple plan that shows how confidently regional courts shaped the history of Indian architecture.\n\nRead as a summary, it works as an invitation to look beyond the best-known monuments and pay attention to the dynasties whose architecture still rewards slow observation.",
    image: pattadakalTemple,
    sourceName: "School of Indian History",
    sourceUrl:
      "https://schoolofindianhistory.com/index.php/2020/09/17/thousand-pillars-temple-gem-of-kaktiya-archietecture/",
  },
  {
    slug: "taj-mahal-a-brief-history-of-the-wonder-built-in-the-17th-century",
    title: "Taj Mahal - A brief history of the wonder built in the 17th century",
    date: "Sep 13, 2020",
    category: "Wonders of India",
    excerpt:
      "A sourced history note on the Taj Mahal as a funerary monument shaped by memory, empire, and extraordinary craft.",
    content:
      "The original piece revisits the Taj Mahal through the story of Shah Jahan and Mumtaz Mahal, grounding the monument in grief, court life, and the Mughal riverfront world of Agra.\n\nRather than treating the Taj only as an icon, it emphasizes why the building continues to matter: proportion, setting, symmetry, and the way architecture can transform personal loss into imperial memory.\n\nIt is a useful reminder that even the most familiar monument becomes richer when we return to the history behind its marble surface.",
    image: heroStory,
    sourceName: "School of Indian History",
    sourceUrl:
      "https://schoolofindianhistory.com/index.php/2020/09/13/taj-mahal-a-brief-history-of-the-wonder-built-in-the-17th-century/",
  },
  {
    slug: "the-mahayogisvara-at-elephanta-a-tale-in-the-stone",
    title: "The Mahayogisvara at Elephanta - A tale in the stone",
    date: "Sep 11, 2020",
    category: "Wonders of India",
    excerpt:
      "A sourced reading of Shiva's yogic form at Elephanta and the sculptural power of the great cave.",
    content:
      "This article turns to the main cave at Elephanta and focuses on Mahayogisvara, Shiva in a meditative and deeply composed form.\n\nThe source describes the sculpture's location, posture, ornaments, and symbolic force, showing how one carved image can hold together devotion, mythology, and artistic balance.\n\nFor readers interested in sacred art, it offers a clear way into the larger visual program of Elephanta without losing sight of the quiet intensity of the figure itself.",
    image: badamiCave,
    sourceName: "School of Indian History",
    sourceUrl:
      "https://schoolofindianhistory.com/index.php/2020/09/11/the-mahayogisvara-at-elephanta-a-tale-in-the-stone/",
  },
  {
    slug: "the-fort-where-mughals-were-fooled",
    title: "The fort where Mughals were fooled!!",
    date: "Sep 08, 2020",
    category: "Wonders of India",
    excerpt:
      "A sourced retelling of Bahadurgad and the famous episode where Mughal confidence met sharper local strategy.",
    content:
      "Set around Bahadurgad on the Bhima, this historical note combines the fort's setting with the political drama of the Deccan in the seventeenth century.\n\nIts central thread is the remembered episode in which Shivaji outmaneuvered Bahadur Khan - a story valued not just for its suspense, but for what it says about planning, timing, and the psychology of warfare.\n\nAs a short read, it shows how even a lesser-known fort can hold a striking story of tactical intelligence.",
    image: heroFort,
    sourceName: "School of Indian History",
    sourceUrl: "https://schoolofindianhistory.com/index.php/2020/09/08/the-fort-where-mughals-were-fooled/",
  },
  {
    slug: "hero-stones-memories-of-a-worrier",
    title: "Hero stones - Memories of a worrier",
    date: "Sep 07, 2020",
    category: "Wonders of India",
    excerpt:
      "A sourced introduction to hero stones as memorial markers that preserve sacrifice, memory, and local history in stone.",
    content:
      "This entry introduces hero stones as memorial slabs raised to remember acts of bravery and death in conflict, cattle raids, and local defence.\n\nThe article treats them as small but powerful historical documents, where iconography, inscriptions, and layered carving can preserve memory long after written records fade.\n\nIt also makes a preservation argument: these stones survive in everyday landscapes, and they deserve to be noticed as part of India's historical archive, not dismissed as minor fragments.",
    image: gondeshwarDetail,
    sourceName: "School of Indian History",
    sourceUrl: "https://schoolofindianhistory.com/index.php/2020/09/07/hero-stones-memories-of-a-worrier/",
  },
];
