import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_LISTINGS, SECTORS_LIST, METRO_ROUTES, CITY_NEWS, CITY_JOBS } from './src/data/initialData';
import { Listing, CityNewsItem, Review } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent data directory
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'islamabad_data.json');

interface StoredData {
  listings: Listing[];
  news: CityNewsItem[];
  submissions: any[];
  reviews: Review[];
}

function loadData(): StoredData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        listings: parsed.listings?.length ? parsed.listings : INITIAL_LISTINGS,
        news: parsed.news?.length ? parsed.news : CITY_NEWS,
        submissions: parsed.submissions || [],
        reviews: parsed.reviews || [
          {
            id: 'rev-1',
            listingId: 'tour-faisal-mosque',
            userName: 'Taimoor Khan',
            rating: 5,
            comment: 'Spectacular architectural masterpiece with tranquil Margalla hills view. Very well organized and clean.',
            date: '2026-10-20'
          },
          {
            id: 'rev-2',
            listingId: 'gov-nadra-mega',
            userName: 'Ayesha Siddiqui',
            rating: 5,
            comment: 'The 24/7 Blue Area center is super efficient. Got my Smart CNIC renewal done within 25 minutes after midnight without crowds.',
            date: '2026-10-15'
          },
          {
            id: 'rev-3',
            listingId: 'rest-savour',
            userName: 'Hamza Farooq',
            rating: 5,
            comment: 'Crispy shami kababs and fragrant pulao! Unmatched flavor and unbeatable value in Islamabad.',
            date: '2026-10-22'
          }
        ]
      };
    }
  } catch (err) {
    console.error('Error reading storage, initializing defaults:', err);
  }

  const initial: StoredData = {
    listings: INITIAL_LISTINGS,
    news: CITY_NEWS,
    submissions: [],
    reviews: [
      {
        id: 'rev-1',
        listingId: 'tour-faisal-mosque',
        userName: 'Taimoor Khan',
        rating: 5,
        comment: 'Spectacular architectural masterpiece with tranquil Margalla hills view. Very well organized and clean.',
        date: '2026-10-20'
      },
      {
        id: 'rev-2',
        listingId: 'gov-nadra-mega',
        userName: 'Ayesha Siddiqui',
        rating: 5,
        comment: 'The 24/7 Blue Area center is super efficient. Got my Smart CNIC renewal done within 25 minutes after midnight without crowds.',
        date: '2026-10-15'
      }
    ]
  };
  saveData(initial);
  return initial;
}

function saveData(data: StoredData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

let db = loadData();

// --- REST API ENDPOINTS ---

// 1. Listings
app.get('/api/listings', (req, res) => {
  const { category, sector, query, isPublic } = req.query;
  let results = [...db.listings];

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter(item => item.category === category);
  }

  if (sector && typeof sector === 'string' && sector !== 'all') {
    results = results.filter(item => item.sector.toLowerCase().includes(sector.toLowerCase()));
  }

  if (isPublic !== undefined && isPublic !== '') {
    const pubVal = isPublic === 'true';
    results = results.filter(item => item.isPublic === pubVal);
  }

  if (query && typeof query === 'string' && query.trim() !== '') {
    const q = query.toLowerCase();
    results = results.filter(item => 
      item.name.toLowerCase().includes(q) ||
      (item.urduName && item.urduName.includes(q)) ||
      item.description.toLowerCase().includes(q) ||
      item.subcategory.toLowerCase().includes(q) ||
      item.sector.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.facilities?.some(f => f.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/listings/:id', (req, res) => {
  const item = db.listings.find(l => l.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, data: item });
});

app.post('/api/listings', (req, res) => {
  const newListing: Listing = {
    ...req.body,
    id: req.body.id || `custom-${Date.now()}`,
    lastVerified: new Date().toISOString().split('T')[0],
    isVerified: true
  };
  db.listings.unshift(newListing);
  saveData(db);
  res.status(201).json({ success: true, data: newListing });
});

app.put('/api/listings/:id', (req, res) => {
  const index = db.listings.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  db.listings[index] = {
    ...db.listings[index],
    ...req.body,
    lastVerified: new Date().toISOString().split('T')[0]
  };
  saveData(db);
  res.json({ success: true, data: db.listings[index] });
});

app.delete('/api/listings/:id', (req, res) => {
  const initialLen = db.listings.length;
  db.listings = db.listings.filter(l => l.id !== req.params.id);
  if (db.listings.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  saveData(db);
  res.json({ success: true, message: 'Listing deleted successfully' });
});

// 2. Sectors
app.get('/api/sectors', (req, res) => {
  res.json({ success: true, data: SECTORS_LIST });
});

// 3. Metro Bus & Transit
app.get('/api/metro', (req, res) => {
  res.json({ success: true, data: METRO_ROUTES });
});

// 4. News & Updates
app.get('/api/news', (req, res) => {
  res.json({ success: true, data: db.news });
});

app.post('/api/news', (req, res) => {
  const newItem: CityNewsItem = {
    id: `news-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.news.unshift(newItem);
  saveData(db);
  res.status(201).json({ success: true, data: newItem });
});

// 5. Jobs & Opportunities
app.get('/api/jobs', (req, res) => {
  res.json({ success: true, data: CITY_JOBS });
});

// 6. User Submissions & Moderation
app.get('/api/submissions', (req, res) => {
  res.json({ success: true, data: db.submissions });
});

app.post('/api/submissions', (req, res) => {
  const submission = {
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    ...req.body
  };
  db.submissions.unshift(submission);
  saveData(db);
  res.status(201).json({ 
    success: true, 
    message: 'Listing submitted for review. It will appear once verified by the Islamabad City Guide team.',
    data: submission 
  });
});

app.post('/api/submissions/:id/approve', (req, res) => {
  const sub = db.submissions.find(s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }
  sub.status = 'approved';
  const newListing: Listing = {
    id: `listing-${Date.now()}`,
    name: sub.name,
    urduName: sub.urduName || '',
    category: sub.category || 'services',
    subcategory: sub.subcategory || 'General Service',
    description: sub.description || '',
    address: sub.address || '',
    sector: sub.sector || 'F-7',
    coordinates: sub.coordinates || { lat: 33.72, lng: 73.06 },
    phone: sub.phone || '',
    website: sub.website || '',
    openingHours: sub.openingHours || 'Mon-Sat: 09:00 AM - 06:00 PM',
    priceRange: sub.priceRange || '$$',
    rating: 5.0,
    reviewCount: 1,
    featuredImage: sub.featuredImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80',
    facilities: sub.facilities || ['Wheelchair Access', 'Parking'],
    sourceUrl: sub.website || 'https://islamabad.gov.pk',
    lastVerified: new Date().toISOString().split('T')[0],
    isVerified: true
  };
  db.listings.unshift(newListing);
  saveData(db);
  res.json({ success: true, data: newListing });
});

app.post('/api/submissions/:id/reject', (req, res) => {
  const sub = db.submissions.find(s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }
  sub.status = 'rejected';
  saveData(db);
  res.json({ success: true, message: 'Submission rejected' });
});

// 7. Reviews
app.get('/api/reviews/:listingId', (req, res) => {
  const filtered = db.reviews.filter(r => r.listingId === req.params.listingId);
  res.json({ success: true, data: filtered });
});

app.post('/api/reviews', (req, res) => {
  const { listingId, userName, rating, comment } = req.body;
  if (!listingId || !userName || !rating) {
    return res.status(400).json({ success: false, message: 'Missing review fields' });
  }
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    listingId,
    userName,
    rating: Number(rating),
    comment: comment || '',
    date: new Date().toISOString().split('T')[0]
  };
  db.reviews.unshift(newReview);

  // Update listing rating
  const targetListing = db.listings.find(l => l.id === listingId);
  if (targetListing) {
    const allListingReviews = db.reviews.filter(r => r.listingId === listingId);
    const avg = allListingReviews.reduce((acc, curr) => acc + curr.rating, 0) / allListingReviews.length;
    targetListing.rating = Math.round(avg * 10) / 10;
    targetListing.reviewCount = allListingReviews.length;
  }

  saveData(db);
  res.status(201).json({ success: true, data: newReview });
});

// 8. Stats Endpoint
app.get('/api/stats', (req, res) => {
  const categoriesCount = db.listings.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalListings: db.listings.length,
      totalSectors: SECTORS_LIST.length,
      categoriesCount,
      totalNews: db.news.length,
      totalJobs: CITY_JOBS.length,
      pendingSubmissions: db.submissions.filter(s => s.status === 'pending').length
    }
  });
});

// 9. Ask Islamabad AI Assistant Endpoint
app.post('/api/assistant', async (req, res) => {
  const { query, chatHistory } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Build grounded context from database
  const compactDirectoryContext = db.listings.slice(0, 25).map(l => 
    `• [${l.name}] (${l.category} - ${l.subcategory}, Sector ${l.sector})
     Address: ${l.address} | Phone: ${l.phone} ${l.emergencyPhone ? `(Emergency: ${l.emergencyPhone})` : ''}
     Hours: ${l.openingHours} | Web: ${l.website || 'N/A'}
     Facilities: ${l.facilities.join(', ')}`
  ).join('\n');

  const metroSummary = METRO_ROUTES.map(r => 
    `• ${r.name}: From ${r.startPoint} to ${r.endPoint}. Fare: ${r.fare}. Timing: ${r.operatingHours}. Complete stations (${r.stations.length}): ${r.stations.map((s, idx) => `${idx + 1}. ${s.name}${s.interchange ? ' [Interchange]' : ''}`).join(', ')}`
  ).join('\n');

  const emergencyContacts = `
  Emergency Helplines in Islamabad:
  • Police Emergency: 15
  • Medical & Fire Rescue: 1122
  • CDA Helpline: 1819
  • Islamabad Traffic Police Helpline: 1915
  • NADRA Mega Center Helpline: +92 51 111 786 100
  • Electricity Emergency (IESCO): 118
  • Sui Northern Gas Emergency: 1199
  • Railway Inquiry: 117
  • Airport Flight Inquiry: 114
  `;

  const systemInstruction = `
You are the official "Ask Islamabad" AI City Guide Assistant for Islamabad, the beautiful capital city of Pakistan.
Your role is to assist citizens, tourists, students, job seekers, and visitors with 100% verified, accurate, courteous, and highly practical local information about Islamabad.

You have access to the verified Islamabad City Guide Database:
=== VERIFIED LOCAL DIRECTORY ===
${compactDirectoryContext}

=== METRO TRANSIT DATA ===
${metroSummary}

=== EMERGENCY DIRECTORY ===
${emergencyContacts}

Guidelines for your answers:
1. Be warm, welcoming, polite, and well-structured using markdown bullets, bold headings, and clear action steps.
2. If the user asks about government procedures (e.g. NADRA CNIC renewal, DGIP passport, driving license, CDA building permits), give step-by-step guidance including which office to visit (e.g., NADRA Mega Center Blue Area is open 24/7), required documents, and official contacts.
3. If they ask about education (universities), highlight top public and private choices like NUST (H-12), QAU, FAST (H-9), COMSATS, etc.
4. If they ask about transport or how to reach somewhere, explain the Islamabad Metro Bus (Red Line, Orange Line to Airport, Green & Blue lines) and local taxi/ride-hailing options.
5. If the user greets in Urdu or asks in Urdu/Roman Urdu, respond respectfully with Urdu greetings ("اسلام علیکم! اسلام آباد سٹی گائیڈ میں خوش آمدید").
6. Always refer to verified local sources.
`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `User question: "${query}"\nProvide a comprehensive, accurate response based on Islamabad, Pakistan.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          seed: 42
        }
      });

      const reply = response.text || 'I apologize, but I could not formulate an answer at this moment. Please check our directory listings.';
      return res.json({ success: true, answer: reply, grounded: true });
    } catch (aiError: any) {
      console.error('Gemini API Error, falling back to local search engine:', aiError);
    }
  }

  // Graceful rule-based & keyword fallback if API key is not yet set or throttled
  const qLower = query.toLowerCase();
  let fallbackAnswer = '';

  if (qLower.includes('passport')) {
    fallbackAnswer = `### How to get a Passport in Islamabad:
1. **Office Location**: Directorate General of Immigration & Passports (DGIP), Mauve Area, Sector G-8/1, Islamabad.
2. **Timing**: Monday - Friday: 08:30 AM to 03:00 PM.
3. **Requirements**: 
   - Original Computerized National Identity Card (CNIC) or Smart Card.
   - Bank deposit fee voucher (available at the National Bank branch inside DGIP or paid via Asaan Passport App).
   - Previous passport (if renewal).
4. **Fast Track**: Executive counters are available inside the G-8/1 office for urgent processing.
5. **Contact**: +92 51 9107044 | Website: [dgip.gov.pk](https://dgip.gov.pk)`;
  } else if (qLower.includes('cnic') || qLower.includes('nadra') || qLower.includes('id card')) {
    fallbackAnswer = `### NADRA Identity Services in Islamabad:
• **24/7 Mega Center**: Fazl-e-Haq Road, Blue Area, Sector G-7/2 (Open 24 Hours, 7 Days a week).
• **Services**: Smart CNIC, Child Registration Certificate (CRC/B-Form), Family Registration Certificate (FRC), and NICOP.
• **Helpline**: +92 51 111 786 100 | Website: [nadra.gov.pk](https://www.nadra.gov.pk)`;
  } else if (qLower.includes('hospital') || qLower.includes('doctor') || qLower.includes('medical') || qLower.includes('emergency')) {
    fallbackAnswer = `### Top Hospitals & Emergency Care in Islamabad:
• **PIMS (Public - Sector G-8/3)**: Primary government tertiary hospital with 24/7 trauma & burn center. Phone: +92 51 9261170 | Emergency: +92 51 9260490.
• **Shifa International (Private - Sector H-8/4)**: JCI-accredited pioneer in organ transplants and oncology. Phone: +92 51 8464646 | Emergency: +92 51 8463000.
• **Maroof International (Private - Sector F-10/3)**: Full multi-specialty care and cardiac ICU. Phone: +92 51 2222920.
• **Rescue 1122**: Free ambulance & emergency paramedic dispatch dial **1122**.`;
  } else if (qLower.includes('airport') || qLower.includes('flight') || qLower.includes('metro to airport')) {
    fallbackAnswer = `### Reaching Islamabad International Airport (IIAP):
• **Metro Bus Orange Line**: Runs from Faiz Ahmad Faiz Station (H-8/I-8 junction) along Srinagar Highway straight into the Airport terminal arrival level. Operating 06:00 AM - 10:30 PM (Fare: PKR 50).
• **Highway Access**: Accessible via M-1/M-2 Motorway link and Srinagar Highway (~25-35 minutes drive from Blue Area / F-8).
• **Airport Flight Inquiry**: Dial 114 | Official Website: [islamabadairport.com.pk](https://islamabadairport.com.pk)`;
  } else if (qLower.includes('university') || qLower.includes('college') || qLower.includes('study') || qLower.includes('computer science')) {
    fallbackAnswer = `### Top Universities in Islamabad:
• **NUST (Sector H-12)**: Pakistan's top STEM institution for Computer Science, AI, Engineering & Business.
• **Quaid-i-Azam University (QAU - Margalla foothills)**: Pakistan's #1 public research university in natural and social sciences.
• **FAST NUCES (Sector H-9/4)**: The most renowned university for Software Engineering and Computer Science.
• **COMSATS (Park Road, Chak Shahzad)**: Excellent engineering, computing, and architectural faculties.
• **Bahria University (Sector E-8)** & **Air University (Sector E-9)**: Established programs in computing and business.`;
  } else {
    fallbackAnswer = `Welcome to the **Islamabad City Guide**! I am here to help you navigate our capital.
You can explore over 150 verified institutions in our directory, including:
- **Government Ministries & NADRA 24/7 Mega Center** (Blue Area)
- **Top Universities** (NUST H-12, QAU, FAST H-9, COMSATS)
- **Hospitals** (PIMS G-8, Shifa H-8, Maroof F-10)
- **Metro Bus Transit** (Red Line to Secretariat, Orange Line to Airport)
- **Tourist Landmarks** (Faisal Mosque, Pakistan Monument, Daman-e-Koh, Trail 3 & 5)
- **Emergency Numbers**: Police (15), Rescue (1122), CDA (1819).

Feel free to ask specific questions about any sector, institution, or route!`;
  }

  res.json({ success: true, answer: fallbackAnswer, grounded: false });
});

// Configure Vite integration for dev server or static files in production
async function startServer() {
  app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Islamabad City Guide server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
