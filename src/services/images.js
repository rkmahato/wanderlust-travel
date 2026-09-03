import { config } from '@/config';
import destinationsData from '@/data/destinations.json';
import { getAssetUrl } from '@/utils/assets';

// Branded placeholder SVG as data URI — shown as last resort
const PLACEHOLDER_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23E8E4DE'/%3E%3Ccircle cx='400' cy='260' r='60' fill='%23B5AFA7'/%3E%3Cpath d='M340 320 L400 220 L460 320Z' fill='%23C9A96E' opacity='0.6'/%3E%3Ctext x='400' y='380' text-anchor='middle' font-family='Georgia,serif' font-size='18' fill='%236B6560'%3EImage unavailable%3C/text%3E%3Ctext x='400' y='405' text-anchor='middle' font-family='Georgia,serif' font-size='14' fill='%23B5AFA7'%3EWanderlust%3C/text%3E%3C/svg%3E";

/**
 * Curated destination photography library.
 * Zero-latency local images stored in /public/destinations/.
 */
export const CURATED_DESTINATIONS = {
    kyoto: {
        url: '/destinations/kyoto.jpg',
        alt: 'Kyoto pagodas reflecting in serene pond surrounded by blooming cherry blossoms',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    santorini: {
        url: '/destinations/santorini.jpg',
        alt: 'Oia Santorini whitewashed villas with blue domes overlooking Aegean sunset',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    'machu-picchu': {
        url: '/destinations/machu-picchu.jpg',
        alt: 'Machu Picchu ancient Inca citadel in misty Andes mountain peaks',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    'amalfi-coast': {
        url: '/destinations/amalfi-coast.jpg',
        alt: 'Pastel cliffside villas of Positano tumbling into turquoise Mediterranean sea',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    bali: {
        url: '/destinations/bali.jpg',
        alt: 'Lush green Tegallalang terraced rice paddies in Ubud Bali at sunrise',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    'swiss-alps': {
        url: '/destinations/swiss-alps.jpg',
        alt: 'Matterhorn peak in Zermatt Switzerland reflecting in mirror alpine lake',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    tokyo: {
        url: '/destinations/tokyo.jpg',
        alt: 'Tokyo Japan glowing neon streetscape at dusk with Tokyo Tower',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    iceland: {
        url: '/destinations/iceland.jpg',
        alt: 'Aurora Borealis dancing over Skógafoss waterfall in snowy Iceland',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    'safari-serengeti': {
        url: '/destinations/safari-serengeti.jpg',
        alt: 'Lions resting on golden Serengeti savannah under acacia tree at sunset',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    serengeti: {
        url: '/destinations/safari-serengeti.jpg',
        alt: 'Lions resting on golden Serengeti savannah under acacia tree at sunset',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    patagonia: {
        url: '/destinations/patagonia.jpg',
        alt: 'Torres del Paine granite pillars and glacial lake in Chilean Patagonia',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    petra: {
        url: '/destinations/petra.jpg',
        alt: 'Al-Khazneh Treasury carved into rose sandstone cliffs of Petra Jordan',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    maldives: {
        url: '/destinations/maldives.jpg',
        alt: 'Luxury overwater bungalows on crystal turquoise lagoon in Maldives',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    rajasthan: {
        url: '/destinations/rajasthan.jpg',
        alt: 'Amer Fort palace in Jaipur Rajasthan reflecting in Maota Lake',
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    },
    marrakech: {
        url: '/destinations/marrakech.jpg',
        alt: 'Marrakech Morocco vibrant architecture and courtyards',
        credit: 'Zakaria Bilad',
        creditUrl: 'https://unsplash.com',
    },
    'new-zealand-south': {
        url: '/destinations/new-zealand-south.jpg',
        alt: 'Milford Sound fjord in South Island New Zealand',
        credit: 'Casey Horner',
        creditUrl: 'https://unsplash.com',
    },
    'new-zealand': {
        url: '/destinations/new-zealand-south.jpg',
        alt: 'Milford Sound fjord in South Island New Zealand',
        credit: 'Casey Horner',
        creditUrl: 'https://unsplash.com',
    },
    'cape-town': {
        url: '/destinations/cape-town.jpg',
        alt: 'Table Mountain and city view of Cape Town South Africa',
        credit: 'Katelyn Greer',
        creditUrl: 'https://unsplash.com',
    },
    lisbon: {
        url: '/destinations/lisbon.jpg',
        alt: 'Historic yellow tram on cobblestone streets of Lisbon Portugal',
        credit: 'Aayush Gupta',
        creditUrl: 'https://unsplash.com',
    },
    'norway-fjords': {
        url: '/destinations/norway-fjords.jpg',
        alt: 'Dramatic fjord and waterfalls in western Norway',
        credit: 'Jarand K. Løkeland',
        creditUrl: 'https://unsplash.com',
    },
    norway: {
        url: '/destinations/norway-fjords.jpg',
        alt: 'Dramatic fjord and waterfalls in western Norway',
        credit: 'Jarand K. Løkeland',
        creditUrl: 'https://unsplash.com',
    },
    'rio-de-janeiro': {
        url: '/destinations/rio-de-janeiro.jpg',
        alt: 'Panoramic aerial view of Rio de Janeiro mountains and ocean',
        credit: 'Agustin Diaz',
        creditUrl: 'https://unsplash.com',
    },
    havana: {
        url: '/destinations/havana.jpg',
        alt: 'Classic colourful American vintage cars in Old Havana Cuba',
        credit: 'Spencer Davis',
        creditUrl: 'https://unsplash.com',
    },
};

function normalize(str) {
    return str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

/**
 * Fast lookup table for all 81 famous places from destinations.json
 */
const placesLookup = new Map();

destinationsData.forEach((dest) => {
    dest.famousPlaces.forEach((place) => {
        if (place.imageUrl) {
            const res = {
                url: place.imageUrl,
                alt: place.name,
                credit: 'Travel Photography',
                creditUrl: 'https://unsplash.com',
            };
            placesLookup.set(normalize(place.id), res);
            placesLookup.set(normalize(place.name), res);
            placesLookup.set(normalize(place.imageQuery), res);
        }
    });
});

/**
 * Specifically finds a curated landmark photo for a place query
 */
export function findPlaceCuratedFallback(query) {
    const qNorm = normalize(query);

    // 1. Direct match with famous places lookup
    for (const [key, val] of placesLookup.entries()) {
        if (key && (qNorm.includes(key) || key.includes(qNorm))) {
            return { ...val, url: getAssetUrl(val.url) };
        }
    }
    return null;
}

export function findCuratedFallback(query) {
    const qNorm = normalize(query);

    // 1. Check famous places first
    const placeMatch = findPlaceCuratedFallback(query);
    if (placeMatch) return placeMatch;

    // 2. Direct match with destination slugs or names
    for (const [key, val] of Object.entries(CURATED_DESTINATIONS)) {
        const kNorm = normalize(key);
        if (kNorm && (qNorm.includes(kNorm) || kNorm.includes(qNorm))) {
            return { ...val, url: getAssetUrl(val.url) };
        }
    }

    // 3. Fallback: match by destination ID or name
    for (const dest of destinationsData) {
        const idNorm = normalize(dest.id);
        const nameNorm = normalize(dest.name);
        if ((idNorm && qNorm.includes(idNorm)) || (nameNorm && qNorm.includes(nameNorm))) {
            if (dest.imageUrl) {
                return {
                    url: getAssetUrl(dest.imageUrl),
                    alt: dest.name,
                    credit: 'Travel Photography',
                    creditUrl: 'https://unsplash.com',
                };
            }
        }
    }
    return null;
}

const imageCache = new Map();
const MAX_CACHE = 50;

function setCached(key, value) {
    if (imageCache.size >= MAX_CACHE) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey !== undefined)
            imageCache.delete(firstKey);
    }
    imageCache.set(key, value);
}

async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.unsplash.timeout);
    try {
        return await fetch(url, { signal: controller.signal });
    }
    finally {
        clearTimeout(timer);
    }
}

async function queryUnsplash(query, orientation = 'landscape') {
    const cacheKey = `${query}:${orientation}`;
    const cached = imageCache.get(cacheKey);
    if (cached)
        return cached;

    if (!config.unsplash.key) {
        const fallback = findCuratedFallback(query);
        if (fallback) {
            setCached(cacheKey, fallback);
            return fallback;
        }
        throw new Error('Unsplash API key not configured');
    }

    const url = `${config.unsplash.baseUrl}/search/photos?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=5&order_by=relevant&client_id=${config.unsplash.key}`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
        throw new Error(`Images API error: ${response.status}`);
    }

    const data = (await response.json());
    if (!data.results || data.results.length === 0) {
        throw new Error('No images found');
    }

    const photo = data.results[Math.floor(Math.random() * data.results.length)];
    const result = {
        url: photo.urls.regular,
        alt: photo.alt_description ?? query,
        credit: photo.user.name,
        creditUrl: `${photo.user.links.html}?utm_source=wanderlust&utm_medium=referral`,
    };

    setCached(cacheKey, result);
    return result;
}

export async function fetchDestinationImage(query, orientation = 'landscape') {
    try {
        return await queryUnsplash(query, orientation);
    }
    catch {
        const fallback = findCuratedFallback(query);
        if (fallback)
            return fallback;
        return {
            url: PLACEHOLDER_DATA_URI,
            alt: query,
            credit: '',
            creditUrl: '',
        };
    }
}

export async function fetchPlaceImage(query) {
    // Check dedicated landmark photo first
    const landmarkPhoto = findPlaceCuratedFallback(query);
    if (landmarkPhoto) return landmarkPhoto;

    try {
        return await queryUnsplash(query, 'squarish');
    }
    catch {
        const fallback = findCuratedFallback(query);
        if (fallback)
            return fallback;
        return {
            url: PLACEHOLDER_DATA_URI,
            alt: query,
            credit: '',
            creditUrl: '',
        };
    }
}
