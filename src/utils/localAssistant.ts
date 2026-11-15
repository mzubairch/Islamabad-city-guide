import {
  Listing,
  SectorInfo,
  MetroRoute,
  CityNewsItem,
  CityJobItem,
} from '../types';

interface AssistantContext {
  listings: Listing[];
  sectors: SectorInfo[];
  metroRoutes: MetroRoute[];
  news: CityNewsItem[];
  jobs: CityJobItem[];
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for',
  'of', 'and', 'or', 'how', 'can', 'i', 'get', 'where', 'what', 'which', 'best',
  'from', 'near', 'me', 'about', 'tell', 'please', 'islamabad', 'pakistan', 'do',
  'does', 'there', 'any', 'find', 'located', 'location', 'timing', 'timings',
  'hours', 'contact', 'number', 'phone', 'reach', 'go', 'with', 'good', 'top',
]);

function extractTokens(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

function formatListing(l: Listing): string {
  const parts = [
    `• **${l.name}** (${l.subcategory} • Sector ${l.sector})`,
    `  Address: ${l.address}`,
    `  Hours: ${l.openingHours} | Phone: ${l.phone}${l.emergencyPhone ? ` (Emergency: ${l.emergencyPhone})` : ''}`,
  ];
  if (l.website) {
    parts.push(`  Website: ${l.website}`);
  }
  return parts.join('\n');
}

export function generateLocalAssistantAnswer(
  rawQuery: string,
  context: AssistantContext
): string {
  const query = rawQuery.trim();
  const qLower = query.toLowerCase();
  const tokens = extractTokens(query);

  const greetingPrefix =
    qLower.includes('salam') ||
    qLower.includes('assalam') ||
    qLower.includes('hello') ||
    qLower.includes('hi ') ||
    qLower === 'hi'
      ? 'اسلام علیکم! Welcome to Islamabad City Guide.\n\n'
      : '';

  // 1. Passport & Immigration (DGIP)
  if (qLower.includes('passport') || qLower.includes('dgip')) {
    return `${greetingPrefix}### How to Get a Passport in Islamabad (DGIP)
1. **Main Office:** Directorate General of Immigration & Passports (DGIP), Mauve Area, Sector G-8/1, Islamabad.
2. **Timings:** Monday – Friday, 08:30 AM to 03:00 PM (Executive / Fast-Track counters also available).
3. **Required Documents:**
   • Original valid CNIC / Smart Card (plus photocopy).
   • Fee payment challan via **Asaan Passport** app, JazzCash/Easypaisa, or the National Bank branch inside DGIP.
   • Previous passport (for renewal) or B-Form / parent CNICs (for minors).
4. **Contact & Official Portal:** +92 51 9107044 | https://dgip.gov.pk`;
  }

  // 2. NADRA / CNIC / FRC
  if (
    qLower.includes('nadra') ||
    qLower.includes('cnic') ||
    qLower.includes('id card') ||
    qLower.includes('frc') ||
    qLower.includes('nicop')
  ) {
    return `${greetingPrefix}### NADRA Identity Services in Islamabad
• **NADRA Mega Center Blue Area (Open 24/7):**
  Address: Fazl-e-Haq Road, Blue Area, Sector G-7/2, Islamabad
  Services: Smart CNIC issuance/renewal, Family Registration Certificate (FRC), Child Registration Certificate (CRC / B-Form), NICOP, and senior citizen priority counters.
• **Tip:** Visiting late evening or after midnight at the Blue Area Mega Center usually has the shortest queue times.
• **Helpline:** +92 51 111 786 100 | Website: https://www.nadra.gov.pk`;
  }

  // 3. Emergency Numbers
  if (
    qLower.includes('emergency') ||
    qLower.includes('helpline') ||
    qLower.includes('police') ||
    qLower.includes('ambulance') ||
    qLower.includes('rescue') ||
    qLower.includes('fire')
  ) {
    return `${greetingPrefix}### Verified Islamabad 24/7 Emergency Helplines
• **Islamabad Capital Police Emergency:** **15**
• **Rescue 1122 (Ambulance & Fire):** **1122**
• **CDA Civic Complaint & Disaster Helpline:** **1819**
• **Islamabad Traffic Police (ITP) Helpline:** **1915**
• **PIMS Hospital Emergency (G-8/3):** +92 51 9260490
• **Shifa International Emergency (H-8/4):** +92 51 8463000
• **IESCO Electricity Faults:** **118** | **Sui Gas (SNGPL):** **1199**
• **Railway Inquiry:** **117** | **Islamabad Airport Inquiry:** **114**`;
  }

  // 4. Hiking Trails / Margalla Hills / Monal / Daman-e-Koh
  if (
    qLower.includes('trail') ||
    qLower.includes('hik') ||
    qLower.includes('margalla') ||
    qLower.includes('daman') ||
    qLower.includes('monal') ||
    qLower.includes('pir sohawa')
  ) {
    return `${greetingPrefix}### Margalla Hills Hiking Trails & Viewpoints
• **Trail 5 (Best for Families & Beginners):** Starts near Margalla Road (Sector F-5/F-6). Features shaded forest paths, natural freshwater streams, and gentle gradients.
• **Trail 3 (Most Popular Scenic Climb):** Starts opposite Sector F-6/3 on Margalla Road; a brisk ~45–60 min climb to the Daman-e-Koh ridge viewpoint.
• **Trail 4 & Trail 6:** Trail 6 begins right behind **Faisal Mosque** (Sector E-7), offering peaceful woodland trails.
• **Daman-e-Koh & Pir Sohawa:** Accessible by car via Margalla Road / Pir Sohawa Road (~20–35 minutes from F-6/F-7) for panoramic views of the capital.
• **Safety Tip:** Carry water, wear grip shoes, hike before sunset, and avoid feeding monkeys.`;
  }

  // 5. Airport & Metro Bus Transit (including station search)
  const matchedMetroStations: { route: MetroRoute; station: string; index: number }[] = [];
  context.metroRoutes.forEach((route) => {
    route.stations.forEach((st, idx) => {
      const stLower = st.name.toLowerCase();
      if (
        tokens.some((t) => t.length >= 3 && stLower.includes(t)) ||
        qLower.includes(stLower)
      ) {
        matchedMetroStations.push({ route, station: st.name, index: idx + 1 });
      }
    });
  });

  if (
    qLower.includes('metro') ||
    qLower.includes('bus') ||
    qLower.includes('airport') ||
    qLower.includes('iiap') ||
    qLower.includes('blue area') && qLower.includes('reach') ||
    matchedMetroStations.length > 0 && (qLower.includes('station') || qLower.includes('route') || qLower.includes('reach') || qLower.includes('line'))
  ) {
    let reply = `${greetingPrefix}### Islamabad Metro Bus & Airport Transit Guide\n`;

    if (qLower.includes('airport') || qLower.includes('blue area') || qLower.includes('iiap')) {
      reply += `**How to Travel Between Islamabad Airport & Blue Area:**
1. Board the **Metro Orange Line** directly at **Islamabad International Airport (IIAP)** (Lower Arrival Concourse — PKR 50 fare, 06:00 AM – 10:30 PM).
2. Ride to **Faiz Ahmed Faiz Station** (H-8/I-8 Interchange).
3. Transfer to the **Metro Red Line** heading toward Pak Secretariat and get off at **Stock Exchange / Blue Area**, **7th Avenue**, or **PIMS** (PKR 30).
• *By Car / Ride-Hailing:* ~25–30 minutes via Srinagar Highway (Careem, InDrive, Yango, or official airport pre-paid taxis).\n\n`;
    }

    if (matchedMetroStations.length > 0) {
      reply += `**Matching Metro Stations:**\n`;
      matchedMetroStations.slice(0, 8).forEach((m) => {
        reply += `• **${m.station}** — ${m.route.name.split('(')[0].trim()} (Stop #${m.index} of ${m.route.stations.length})\n`;
      });
      reply += '\n';
    }

    reply += `**All 4 Islamabad–Rawalpindi Metro Corridors:**\n`;
    context.metroRoutes.forEach((r) => {
      reply += `• **${r.name}** (${r.stations.length} Stations, ${r.operatingHours}, ${r.fare})\n`;
    });

    return reply.trim();
  }

  // 6. Sector-specific query (e.g., F-6, F-7, G-8, H-12, Blue Area)
  const matchedSector = context.sectors.find(
    (s) =>
      qLower.includes(s.code.toLowerCase()) ||
      qLower.includes(s.markazName.toLowerCase())
  );

  // 7. Category intent detection
  const categoryKeywords: Record<string, string[]> = {
    education: ['university', 'universities', 'college', 'school', 'study', 'computer science', 'engineering', 'admission', 'nust', 'qau', 'fast', 'comsats', 'numl', 'bahria', 'iiui'],
    healthcare: ['hospital', 'hospitals', 'doctor', 'clinic', 'medical', 'health', 'pims', 'shifa', 'maroof', 'lab', 'diagnostic'],
    government: ['government', 'ministry', 'parliament', 'supreme court', 'cda', 'police', 'embassy', 'fbr', 'cda', 'secp'],
    restaurants: ['restaurant', 'restaurants', 'food', 'eat', 'dining', 'cafe', 'coffee', 'biryani', 'pulao', 'savour', 'dinner', 'lunch', 'breakfast'],
    shopping: ['mall', 'malls', 'shopping', 'market', 'markaz', 'centaurus', 'giga', 'safa', 'bazaar', 'grocery', 'clothes'],
    hotels: ['hotel', 'hotels', 'stay', 'guest house', 'serena', 'marriott', 'ramada', 'accommodation', 'room'],
    tourism: ['tourist', 'tourism', 'visit', 'sightseeing', 'landmark', 'monument', 'mosque', 'faisal', 'museum', 'lok virsa'],
    parks: ['park', 'parks', 'lake', 'garden', 'picnic', 'rawal', 'f-9'],
  };

  let detectedCategory: string | null = null;
  for (const [cat, kws] of Object.entries(categoryKeywords)) {
    if (kws.some((k) => qLower.includes(k))) {
      detectedCategory = cat;
      break;
    }
  }

  // Score all listings against tokens + detected category + sector
  const scoredListings = context.listings
    .map((l) => {
      let score = 0;
      const haystack = [
        l.name,
        l.urduName || '',
        l.subcategory,
        l.sector,
        l.address,
        l.description,
        ...(l.facilities || []),
        ...(l.services || []),
      ]
        .join(' ')
        .toLowerCase();

      if (detectedCategory && l.category === detectedCategory) {
        score += 4;
      }
      if (matchedSector && l.sector.toLowerCase().includes(matchedSector.code.toLowerCase())) {
        score += 5;
      }
      for (const token of tokens) {
        if (l.name.toLowerCase().includes(token)) score += 6;
        else if (l.subcategory.toLowerCase().includes(token)) score += 4;
        else if (haystack.includes(token)) score += 2;
      }
      if (l.isFeatured && score > 0) score += 1;
      return { listing: l, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // 8. News & Jobs queries
  if (qLower.includes('job') || qLower.includes('career') || qLower.includes('vacancy') || qLower.includes('hiring')) {
    const jobLines = context.jobs
      .slice(0, 5)
      .map(
        (j) =>
          `• **${j.title}** — ${j.organization} (Sector ${j.sector})\n  Deadline: ${j.deadline} | Apply: ${j.applyUrl}`
      )
      .join('\n');
    return `${greetingPrefix}### Current Featured Vacancies in Islamabad\n${jobLines}\n\nOpen the **Jobs** tab in the top navigation bar to filter by Federal Govt, Higher Education, IT & Tech, and Healthcare.`;
  }

  if (qLower.includes('news') || qLower.includes('traffic') || qLower.includes('alert') || qLower.includes('update')) {
    const newsLines = context.news
      .slice(0, 4)
      .map((n) => `• **[${n.category}] ${n.title}** (${n.date})\n  ${n.summary}`)
      .join('\n\n');
    return `${greetingPrefix}### Latest Islamabad City Updates\n${newsLines}`;
  }

  // 9. Build sector + listing answer if matched
  if (matchedSector || scoredListings.length > 0) {
    let reply = greetingPrefix;

    if (matchedSector) {
      reply += `### ${matchedSector.name} (${matchedSector.zone})\n${matchedSector.description}\n**Central Markaz:** ${matchedSector.markazName}\n**Highlights:** ${matchedSector.highlights.join(', ')}\n\n`;
    }

    if (scoredListings.length > 0) {
      const topResults = scoredListings.slice(0, 5).map((s) => formatListing(s.listing));
      reply += `### Verified Directory Matches (${scoredListings.length} found)\n${topResults.join('\n\n')}`;
    } else if (matchedSector) {
      const sectorPlaces = context.listings
        .filter((l) => l.sector.toLowerCase().includes(matchedSector.code.toLowerCase()))
        .slice(0, 4)
        .map(formatListing);
      if (sectorPlaces.length > 0) {
        reply += `### Key Places in ${matchedSector.code}\n${sectorPlaces.join('\n\n')}`;
      }
    }

    return reply.trim();
  }

  // 10. Helpful general overview fallback
  return `${greetingPrefix}Here is what I can help you look up across **${context.listings.length} verified Islamabad listings** and **${context.metroRoutes.length} Metro Bus lines**:

• **Government & Citizen Services:** NADRA 24/7 Mega Center (Blue Area), Passports (DGIP G-8/1), CDA One-Window (G-7/4), Supreme Court, Parliament House.
• **Top Universities:** NUST (H-12), Quaid-i-Azam University, FAST-NUCES (H-9), COMSATS, Bahria, Air University.
• **Hospitals & 24/7 Care:** PIMS (G-8/3), Shifa International (H-8/4), Polyclinic (G-6), Maroof International (F-10).
• **Transit & Airport:** Metro Red, Orange (to Airport), Green & Blue Lines (60 stations total).
• **Emergency Helplines:** Police **15** | Rescue **1122** | CDA **1819** | Traffic **1915**.

Try asking a specific question such as *"Where is NADRA Mega Center?"*, *"Metro stations to Airport"*, *"Best universities for Computer Science"*, or *"Places in Sector F-7"*.`;
}
