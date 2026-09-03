/**
 * Application-wide configuration — all API endpoints and magic strings
 * live here, not scattered across service files.
 */
export const config = {
    openWeather: {
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        key: (import.meta.env.VITE_OPENWEATHER_KEY ?? '').trim(),
        iconBaseUrl: 'https://openweathermap.org/img/wn',
        timeout: 8000,
    },
    unsplash: {
        baseUrl: 'https://api.unsplash.com',
        key: (import.meta.env.VITE_UNSPLASH_KEY ?? '').trim(),
        timeout: 8000,
        cacheSize: 50,
    },
    gemini: {
        key: (import.meta.env.VITE_GEMINI_KEY ?? '').trim(),
        model: 'gemini-3.6-flash',
        timeout: 45000,
    },
};
export const CONTINENTS = [
    'All',
    'Africa',
    'Asia',
    'Europe',
    'North America',
    'Oceania',
    'South America',
];
export const ALL_TAGS = [
    'beaches',
    'culture',
    'food',
    'history',
    'mountains',
    'nature',
    'nightlife',
    'temples',
    'wildlife',
    'winter',
];
/** Returns which API keys are missing — used for dev warning banner */
export function getMissingKeys() {
    const missing = [];
    if (!config.gemini.key)
        missing.push('VITE_GEMINI_KEY');
    return missing;
}
