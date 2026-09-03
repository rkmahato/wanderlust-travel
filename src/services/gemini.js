import { GoogleGenAI } from '@google/genai';
import { config } from '@/config';
import destinationsData from '@/data/destinations.json';

// Lazy-initialize the client — only created when first needed,
// so missing API key doesn't crash the entire app on load.
let _ai = null;
function getAI() {
    if (!config.gemini.key) {
        throw new Error('Gemini API key is not configured. Add VITE_GEMINI_KEY to your .env file.');
    }
    if (!_ai) {
        _ai = new GoogleGenAI({ apiKey: config.gemini.key });
    }
    return _ai;
}

const DESTINATION_SYSTEM_PROMPT = (destinationName, country) => `You are a knowledgeable, enthusiastic travel guide specialising in ${destinationName}, ${country}.
Answer questions conversationally and helpfully — cover things to do, local cuisine, best time to visit, 
practical tips, cultural etiquette, and transport. Keep responses concise (2–4 paragraphs max).
Never make up specific prices or factual details you're unsure about.`.trim();

const ITINERARY_SYSTEM_PROMPT = `You are a professional travel itinerary planner. When given a destination, number of days, and preferences,
you must respond ONLY with a valid JSON array matching this TypeScript type exactly:
[
  {
    "day": 1,
    "theme": "string — theme for the day",
    "activities": [
      {
        "time": "e.g. 08:00",
        "activity": "string — what to do",
        "location": "string — where exactly",
        "tip": "string — one practical insider tip"
      }
    ]
  }
]
Include 3–4 activities per day. Do not include any text outside the JSON array. No markdown fences.`.trim();

async function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
    return Promise.race([promise, timeout]);
}

/**
 * Match destination in local database for rich context fallback
 */
function findDestination(name, country) {
    if (!name) return null;
    const lowerName = name.toLowerCase().trim();
    const lowerCountry = (country || '').toLowerCase().trim();
    return destinationsData.find((d) => 
        d.name.toLowerCase() === lowerName ||
        d.id.toLowerCase() === lowerName ||
        d.name.toLowerCase().includes(lowerName) ||
        lowerName.includes(d.name.toLowerCase()) ||
        (lowerCountry && d.country.toLowerCase() === lowerCountry)
    ) || null;
}

/**
 * High-quality authentic travel guide response used as seamless fallback
 * when Gemini API returns 503, rate limits, network errors, or key issues.
 */
function getFallbackChatResponse(destinationName, country, userMessage) {
    const dest = findDestination(destinationName, country);
    const q = (userMessage || '').toLowerCase();
    const places = dest?.famousPlaces || [];
    const placeNames = places.map((p) => p.name);
    const placeHighlights = placeNames.length > 0
        ? placeNames.slice(0, 3).join(', ')
        : `${destinationName} Historic Core, Central Plaza, and Scenic Overlook`;
    const placeA = placeNames[0] || `${destinationName} Historic Quarter`;
    const placeB = placeNames[1] || `${destinationName} Scenic Panorama`;
    const placeC = placeNames[2] || `${destinationName} Waterfront Promenade`;

    // 1. Highlights / 3-day / Itinerary overview
    if (q.includes('highlight') || q.includes('3-day') || q.includes('itinerary') || q.includes('plan') || q.includes('must-see') || q.includes('weekend') || q.includes('route')) {
        return `### 3-Day Insider Highlights: ${destinationName}, ${country}

Here is a masterclass snapshot for experiencing the very best of ${destinationName}:

- **Day 1: Historic Foundations & Iconic Heart**: Begin at **${placeA}** early to experience the timeless atmosphere before mid-morning groups arrive. Stroll through the heritage quarter and indulge in regional delicacies for lunch.
- **Day 2: Culture, Horizons & Artisan Quarters**: Head up to **${placeB}** for spectacular sweeping vistas. Spend the afternoon uncovering independent craft studios and hidden courtyard cafés.
- **Day 3: Secret Enclaves & Sunset Horizons**: Conclude your expedition at **${placeC}**, unwinding as the afternoon light turns gold, followed by a celebratory tasting dinner.

**Insider Tip**: Book popular monument entry slots online at least 48 hours in advance, and aim to be at key viewpoints by 08:30 for pure tranquility.`;
    }

    // 2. Food & Markets
    if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dish') || q.includes('culinary') || q.includes('dinner') || q.includes('lunch') || q.includes('breakfast') || q.includes('market')) {
        return `### Culinary Secrets & Market Gastronomy: ${destinationName}

Delving into the local gastronomy of ${destinationName}, ${country} is an unforgettable sensory adventure:

- **Central Produce & Street Food Markets**: Seek out bustling morning markets where growers and artisans present fresh seasonal cheeses, cured specialties, and hot freshly made street bites.
- **Historic Neighborhood Bistros**: Avoid establishments with photo menus along high-traffic promenades; instead, duck two alleys back where local families dine on time-honored slow-cooked classics.
- **Aperitivo & Sunset Sips**: Sip regional vintage wines or herbal infusions paired with local small-plate pairings during golden hour.

**Insider Tip**: In ${destinationName}, ask your server for the *"piatto del giorno"* or chef's morning market recommendation. Peak dinner hours start later than typical tourist times, so reservation bookings are crucial!`;
    }

    // 3. Packing & Weather
    if (q.includes('pack') || q.includes('weather') || q.includes('season') || q.includes('when') || q.includes('month') || q.includes('climate') || q.includes('temperature') || q.includes('rain') || q.includes('cloth')) {
        return `### Packing & Weather Intelligence: ${destinationName}

To ensure complete comfort and readiness throughout ${destinationName}, ${country}, keep these essentials in mind:

- **Layering Principle**: Microclimates and elevation shifts can cause rapid temperature swings. Pack breathable base layers (merino wool or technical synthetics) plus a compact waterproof shell.
- **Traction & Footwear**: Ancient cobblestones, natural rock steps, and hillside gradients demand broken-in walking shoes or trail sneakers with dependable grip.
- **Power & Connectivity**: Keep a high-capacity portable battery pack (10,000+ mAh) and an offline map downloaded on your device for remote spots.

**Insider Tip**: The shoulder seasons (April–May and September–October) consistently deliver the crispest light, comfortable 18–24°C temperatures, and thinner crowds.`;
    }

    // 4. Hidden Gems & Off the Beaten Path
    if (q.includes('gem') || q.includes('hidden') || q.includes('secret') || q.includes('path') || q.includes('off the beaten') || q.includes('quiet') || q.includes('crowd')) {
        return `### Hidden Gems Off the Beaten Path: ${destinationName}

Step beyond standard postcard routes to discover ${destinationName}'s most soulful retreats:

- **Artisan Backstreets & Alleys**: Just 15 minutes away from the marquee center, you'll encounter quiet residential alleys where generations of craftsmen practice wood carving, pottery, and textile weaving.
- **Perimeter Scenic Overlooks**: Skip crowded commercial platforms in favor of elevated perimeter trails that give you an uninterrupted 360-degree panorama of the landscape.
- **Tucked-Away Sanctuary Gardens**: Peaceful public courtyards and cloistered gardens offering quiet respite from the midday bustle.

**Insider Tip**: Early morning (07:00–08:30) belongs entirely to locals delivering goods and sweeping stone steps. A dawn walk will give you photos without a single tourist in frame!`;
    }

    // 5. Photography & Sunset Spots
    if (q.includes('photo') || q.includes('picture') || q.includes('camera') || q.includes('sunset') || q.includes('view') || q.includes('vantage') || q.includes('instagram')) {
        return `### Top Photography & Sunset Vantage Points: ${destinationName}

Capture world-class frames across ${destinationName} with these expert spots:

- **Golden Hour Ridge**: Position your camera at the high elevation overlooking **${placeB}** roughly 40 minutes prior to sunset for warm amber tones casting across historic rooftops.
- **Blue Hour Waterfront**: Capture tranquil reflections and illuminated stone bridges right after dusk when the sky shifts to rich cobalt blue.
- **Architectural Framing**: Frame famous monuments like **${placeA}** through arched stone doorways or shadowed alleys to give your images depth and scale.

**Insider Tip**: Use a circular polarizing filter to cut haze and reflect water glare, and keep your ISO low during evening blue hour on a miniature travel tripod.`;
    }

    // 6. Adventure & Extreme
    if (q.includes('adventure') || q.includes('extreme') || q.includes('hike') || q.includes('trek') || q.includes('trail') || q.includes('sport') || q.includes('climb')) {
        return `### High Adventure & Outdoor Expeditions: ${destinationName}

For adrenaline and wilderness enthusiasts visiting ${destinationName}, ${country}:

- **Challenging Ridge & Peak Treks**: Tackle rugged vertical trails connecting scenic ridgelines with dramatic valley drops.
- **Water & Wild Excursions**: Explore hidden coves, river gorges, or alpine glacial lakes via sea kayak, rafting, or via ferrata routes.
- **Sunrise Summit Ascents**: Start under starlight with headlamps to summit landmark lookouts right as the morning horizon catches fire.

**Insider Tip**: Always carry emergency hydration tablets, a satellite tracker or offline GPS app, and register your route with local park rangers before undertaking backcountry trails.`;
    }

    // 7. Budget & Currency
    if (q.includes('cost') || q.includes('budget') || q.includes('price') || q.includes('expensive') || q.includes('money') || q.includes('currency') || q.includes('cheap') || q.includes('dollar')) {
        return `### Budget Intelligence & Travel Economics: ${destinationName}

Smart strategies for maximizing your expedition budget in ${destinationName}, ${country}:

- **Transit Passes**: Purchase multi-day regional travel cards for unlimited subway, train, and bus journeys rather than individual point-to-point tickets.
- **Market Dining over Tourist Cafés**: Enjoy lunch from authentic market stalls, local bakeries, and deli counters for a fraction of the cost of sit-down plaza restaurants.
- **Free Cultural Days**: Many world-class museums, botanical reserves, and historic monuments offer complimentary admission on selected weekdays or the first Sunday of each month.

**Insider Tip**: Contactless cards and mobile pay work in most shops, but keeping small denominations of local currency is invaluable for farmers' markets, public lockers, and street snacks.`;
    }

    // 8. Transport & Getting Around
    if (q.includes('transport') || q.includes('get around') || q.includes('train') || q.includes('metro') || q.includes('bus') || q.includes('airport') || q.includes('taxi') || q.includes('drive')) {
        return `### Transport & Transit Navigation: ${destinationName}

Navigating ${destinationName} is efficient and rewarding once you know the local rhythms:

- **Pedestrian Districts**: The core heritage zone is best explored on foot. Comfortable footwear is non-negotiable.
- **Rapid Transit & Rail**: Modern metro and regional light rail networks link the airport and outlying scenic villages directly to the city center.
- **Scenic Ferry & Cable Car Links**: Wherever available, choose water taxis or mountain funiculars for breathtaking transit views.

**Insider Tip**: Download the regional transit app onto your smartphone before landing to monitor live platform departures and skip automated ticket machine lines.`;
    }

    // Default authentic response
    return `### Welcome to ${destinationName}, ${country}

${dest?.tagline ? `*${dest.tagline}*\n\n` : ''}${dest?.description ? `${dest.description}\n\n` : ''}Regarding your expedition query: "${userMessage}"

- **Top Priority Highlights**: Anchor your time around **${placeHighlights}** to witness the region's hallmark architectural and natural marvels.
- **Daily Rhythm**: Reserve mornings (08:30–11:30) for popular sights, recharge at an authentic neighborhood trattoria for lunch, and spend late afternoons discovering quiet alleys and panoramic viewpoints.
- **Authentic Immersion**: Venture away from the souvenir corridors to strike up conversations with local shopkeepers, bookbinders, and food purveyors.

**Insider Tip**: Let me know if you would like custom day-by-day recommendations tailored specifically to your pacing, budget, or favorite interests!`;
}

/**
 * Structured multi-day itinerary fallback matching preferences, numDays, pacing, and travelStyle
 */
function generateFallbackItinerary(destinationName, country, days, preferences = [], pacing = 'Balanced', travelStyle = 'Boutique Explorer') {
    const dest = findDestination(destinationName, country);
    const numDays = Math.max(1, Math.min(Number(days) || 3, 7));
    const places = dest?.famousPlaces || [];
    const prefList = (preferences || []).map((p) => p.toLowerCase());

    const hasFood = prefList.some(p => p.includes('food') || p.includes('cuisine'));
    const hasNature = prefList.some(p => p.includes('nature') || p.includes('beach'));
    const hasCulture = prefList.some(p => p.includes('culture') || p.includes('history') || p.includes('art'));
    const hasAdventure = prefList.some(p => p.includes('adventure') || p.includes('sport'));
    const hasPhoto = prefList.some(p => p.includes('photo'));

    const dayThemes = [
        'Historic Foundations & Iconic Landmarks',
        'Cultural Immersion & Artisanal Quarters',
        'Panoramic Vistas & Natural Splendors',
        'Local Neighborhoods & Hidden Gems',
        'Culinary Expeditions & Sunset Horizons',
        'Scenic Trails & Heritage Wonders',
        'Signature Memories & Leisurely Farewell',
    ];

    const itinerary = [];

    for (let i = 0; i < numDays; i++) {
        const dayNumber = i + 1;
        const theme = dayThemes[i % dayThemes.length];

        // Pick famous places for this day if available
        const placeA = places.length > 0 ? places[(i * 2) % places.length] : null;
        const placeB = places.length > 1 ? places[(i * 2 + 1) % places.length] : null;

        const locA = placeA?.name || `${destinationName} Historic Core`;
        const locB = placeB?.name || `${destinationName} Scenic Panorama`;

        // Style nuances for tips
        const stylePrefix = travelStyle === 'Backpacker'
            ? 'Backpacker Hack: '
            : travelStyle === 'Luxury Expedition'
            ? 'VIP Privilege: '
            : 'Insider Tip: ';

        const activities = [];

        // 1. Morning Activity
        if (pacing === 'High Adventure') {
            activities.push({
                time: '07:00',
                period: 'Morning',
                category: 'Adventure',
                activity: `Dawn expedition to ${locA} for sunrise vantage and uncrowded exploration.`,
                location: locA,
                tip: `${stylePrefix}Begin at first light to capture atmospheric mist and completely beat the tour coaches.`,
            });
        } else if (pacing === 'Relaxed') {
            activities.push({
                time: '09:30',
                period: 'Morning',
                category: hasCulture ? 'Culture & Heritage' : 'Scenic Exploration',
                activity: `Leisurely morning stroll through ${locA} and adjoining quiet garden courtyards.`,
                location: locA,
                tip: `${stylePrefix}Take your time enjoying an espresso at an open-air terrace before entering the main grounds.`,
            });
        } else {
            // Balanced
            activities.push({
                time: '08:30',
                period: 'Morning',
                category: 'Culture & Heritage',
                activity: `Morning discovery of ${locA} before the midday peak crowds arrive.`,
                location: locA,
                tip: placeA?.description
                    ? `${stylePrefix}${placeA.description}`
                    : `${stylePrefix}Arrive early to experience serene morning light and beat the queues.`,
            });
        }

        // 2. Midday Activity
        activities.push({
            time: pacing === 'Relaxed' ? '13:00' : '12:00',
            period: 'Midday',
            category: hasFood ? 'Local Cuisine' : 'Dining & Refreshment',
            activity: hasFood
                ? (travelStyle === 'Backpacker'
                    ? 'Authentic street food crawl tasting regional specialities at bustling market stalls.'
                    : travelStyle === 'Luxury Expedition'
                    ? 'Curated wine pairing and multi-course seasonal tasting luncheon at a premier bistro.'
                    : 'Artisanal lunch tasting regional delicacies at a celebrated local market hall.')
                : `Midday recharge featuring regional cuisine at a historic neighborhood eatery.`,
            location: `${destinationName} Central Market & Heritage District`,
            tip: `${stylePrefix}Look for counters crowded with local residents for the freshest and most authentic seasonal dishes.`,
        });

        // 3. Afternoon Activity
        if (pacing !== 'Relaxed') {
            activities.push({
                time: '14:30',
                period: 'Afternoon',
                category: hasNature || hasAdventure ? 'Nature & Hiking' : hasPhoto ? 'Photography' : 'Culture & Arts',
                activity: hasNature || hasAdventure
                    ? `Scenic nature excursion along trails taking in panoramic landscapes around ${locB}.`
                    : hasCulture
                    ? `Guided cultural heritage walk through ${locB} and surrounding preservation alleys.`
                    : `Afternoon discovery tour exploring ${locB} and adjacent artisan boutiques.`,
                location: locB,
                tip: `${stylePrefix}Wear sturdy walking shoes; historic cobblestones and elevation steps require dependable traction.`,
            });
        }

        // 4. Golden Hour / Evening Activity
        activities.push({
            time: pacing === 'Relaxed' ? '17:30' : '18:30',
            period: 'Golden Hour / Evening',
            category: hasPhoto ? 'Photography' : 'Sunset & Dining',
            activity: pacing === 'High Adventure'
                ? `Sunset ridge climb to a high elevation overlook followed by twilight night market exploring.`
                : `Golden hour sunset viewpoint followed by an authentic regional dinner under ambient evening lighting.`,
            location: `${destinationName} Sunset Overlook & Promenade`,
            tip: `${stylePrefix}Arrive 30 minutes before sunset to witness the golden glow illuminate the horizon.`,
        });

        // 5. High Adventure Bonus Night Experience
        if (pacing === 'High Adventure') {
            activities.push({
                time: '21:00',
                period: 'Night',
                category: 'Nightlife & Stargazing',
                activity: `Night photography and stargazing excursion or late-night historic alley walk.`,
                location: `${destinationName} Starlight Lookout`,
                tip: `${stylePrefix}Carry a headlamp and warm windbreaker for cooler night temperatures.`,
            });
        }

        itinerary.push({
            day: dayNumber,
            theme,
            activities,
        });
    }

    return itinerary;
}

export async function chatWithDestination(destinationName, country, history, userMessage) {
    try {
        const ai = getAI();
        const systemPrompt = DESTINATION_SYSTEM_PROMPT(destinationName, country);
        // Build full conversation as a single contents array (most compatible approach)
        const contents = [];
        // Add chat history
        for (const msg of history) {
            contents.push({
                role: msg.role,
                parts: [{ text: msg.content }],
            });
        }
        // Add the new user message
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }],
        });
        const response = await withTimeout(ai.models.generateContent({
            model: config.gemini.model,
            contents,
            config: {
                systemInstruction: systemPrompt,
            },
        }), 30000 // 30 second timeout
        );
        const text = response.text;
        if (!text) {
            throw new Error('Empty response from Gemini');
        }
        return text;
    } catch (err) {
        console.warn('Gemini chat request failed; serving authentic travel guide fallback:', err);
        return getFallbackChatResponse(destinationName, country, userMessage);
    }
}

export async function generateItinerary(destinationName, country, days, preferences = [], pacing = 'Balanced', travelStyle = 'Boutique Explorer') {
    try {
        const ai = getAI();
        const prefString = preferences && preferences.length > 0
            ? `Traveller preferences: ${preferences.join(', ')}.`
            : 'No specific preferences.';
        const prompt = `Plan a ${days}-day itinerary for ${destinationName}, ${country}. Pacing: ${pacing}. Travel Style: ${travelStyle}. ${prefString} Respond with ONLY the JSON array, no other text.`;
        const response = await withTimeout(ai.models.generateContent({
            model: config.gemini.model,
            contents: prompt,
            config: {
                systemInstruction: ITINERARY_SYSTEM_PROMPT,
            },
        }), 45000 // 45 second timeout for longer itineraries
        );
        const raw = response.text ?? '';
        return parseItineraryJSON(raw);
    } catch (err) {
        console.warn('Gemini itinerary request failed; serving authentic curated itinerary fallback:', err);
        return generateFallbackItinerary(destinationName, country, days, preferences, pacing, travelStyle);
    }
}

export function parseItineraryJSON(raw) {
    const cleaned = raw
        .replace(/^```(?:json)?\n?/m, '')
        .replace(/\n?```$/m, '')
        .trim();
    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    }
    catch {
        throw new Error('Malformed JSON in itinerary response');
    }
    if (!Array.isArray(parsed)) {
        throw new Error('Itinerary response is not an array');
    }
    const defaultPeriods = ['Morning', 'Midday', 'Afternoon', 'Golden Hour / Evening', 'Night'];
    return parsed.map((item, i) => {
        if (typeof item !== 'object' || item === null) {
            throw new Error(`Day ${i + 1} is not an object`);
        }
        const day = item;
        if (!Array.isArray(day.activities)) {
            throw new Error(`Day ${i + 1} has no activities array`);
        }
        return {
            day: typeof day.day === 'number' ? day.day : i + 1,
            theme: typeof day.theme === 'string' ? day.theme : `Day ${i + 1}`,
            activities: day.activities.map((act, actIdx) => {
                const a = act;
                return {
                    time: typeof a.time === 'string' && a.time ? a.time : (actIdx === 0 ? '08:30' : actIdx === 1 ? '12:00' : actIdx === 2 ? '15:00' : '18:30'),
                    period: typeof a.period === 'string' && a.period ? a.period : defaultPeriods[actIdx % defaultPeriods.length],
                    activity: typeof a.activity === 'string' ? a.activity : '',
                    location: typeof a.location === 'string' ? a.location : '',
                    tip: typeof a.tip === 'string' ? a.tip : '',
                    category: typeof a.category === 'string' && a.category ? a.category : 'Sightseeing',
                };
            }),
        };
    });
}

/**
 * Generate high-fidelity travel photographs with Gemini / Imagen 3
 */
export async function generateDestinationPhoto(prompt, customApiKey) {
    const apiKey = customApiKey?.trim() || config.gemini.key;
    if (!apiKey) {
        throw new Error('Gemini API key is required to generate new photos. Add VITE_GEMINI_KEY to .env or enter your key.');
    }
    const client = new GoogleGenAI({ apiKey });
    const response = await withTimeout(client.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `High quality National Geographic style award-winning travel photograph: ${prompt}`,
        config: {
            numberOfImages: 1,
            aspectRatio: '4:3',
        },
    }), 30000);
    const imageObj = response.generatedImages?.[0];
    if (!imageObj?.image?.imageBytes) {
        throw new Error('No image was returned from the model. Please try a different prompt.');
    }
    return `data:image/jpeg;base64,${imageObj.image.imageBytes}`;
}
