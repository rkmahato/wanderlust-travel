import { createContext, useContext } from 'react';

export const LocationContext = createContext(null);
export { LocationProvider } from './LocationContext.jsx';

export const GATEWAY_CITIES = [
    { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, code: "LHR", flag: "🇬🇧" },
    { name: "New York", country: "United States", lat: 40.7128, lon: -74.0060, code: "JFK", flag: "🇺🇸" },
    { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, code: "HND", flag: "🇯🇵" },
    { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, code: "CDG", flag: "🇫🇷" },
    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, code: "SYD", flag: "🇦🇺" },
    { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708, code: "DXB", flag: "🇦🇪" },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, code: "SIN", flag: "🇸🇬" },
    { name: "San Francisco", country: "United States", lat: 37.7749, lon: -122.4194, code: "SFO", flag: "🇺🇸" },
    { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777, code: "BOM", flag: "🇮🇳" },
    { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, code: "BER", flag: "🇩🇪" },
    { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, code: "YYZ", flag: "🇨🇦" },
    { name: "Zurich", country: "Switzerland", lat: 47.3769, lon: 8.5417, code: "ZRH", flag: "🇨🇭" },
    { name: "Cape Town", country: "South Africa", lat: -33.9249, lon: 18.4241, code: "CPT", flag: "🇿🇦" },
    { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729, code: "GIG", flag: "🇧🇷" },
    { name: "Hong Kong", country: "Hong Kong SAR", lat: 22.3193, lon: 114.1694, code: "HKG", flag: "🇭🇰" }
];

export function useLocationContext() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
}

export const useLocation = useLocationContext;
export const useUserLocation = useLocationContext;

/**
 * Great-Circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

/**
 * Great-Circle distance & flight duration calculation (~800 km/h cruising + 40m taxi/takeoff)
 */
export function calculateGreatCircleDistance(lat1, lon1, lat2, lon2) {
    const km = calculateDistanceKm(lat1, lon1, lat2, lon2);
    if (km == null) return null;
    const miles = Math.round(km * 0.621371);
    const totalHours = (km / 800) + (km > 80 ? 0.67 : 0.25);
    const flightHours = Math.floor(totalHours);
    const flightMinutes = Math.round((totalHours - flightHours) * 60);

    let flightTimeFormatted = '';
    if (flightHours > 0 && flightMinutes > 0) {
        flightTimeFormatted = `~${flightHours}h ${flightMinutes}m direct flight`;
    } else if (flightHours > 0) {
        flightTimeFormatted = `~${flightHours}h direct flight`;
    } else if (flightMinutes > 0) {
        flightTimeFormatted = `~${flightMinutes}m flight`;
    } else {
        flightTimeFormatted = 'Local flight / ground transit';
    }

    return {
        km,
        miles,
        distanceKm: km,
        distanceMiles: miles,
        formattedKm: `${km.toLocaleString()} km`,
        formattedMiles: `${miles.toLocaleString()} mi`,
        flightHours,
        flightMinutes,
        flightTimeFormatted
    };
}
