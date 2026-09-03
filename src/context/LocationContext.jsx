import { useState, useCallback } from 'react';
import { LocationContext } from './LocationContext.js';

export function LocationProvider({ children }) {

    const [city, setCity] = useState(() => {
        try {
            return localStorage.getItem('voyager_origin_city') || 'London, United Kingdom';
        } catch {
            return 'London, United Kingdom';
        }
    });

    const [coords, setCoords] = useState(() => {
        try {
            const saved = localStorage.getItem('voyager_origin_coords');
            return saved ? JSON.parse(saved) : { lat: 51.5074, lon: -0.1278 };
        } catch {
            return { lat: 51.5074, lon: -0.1278 };
        }
    });

    const [status, setStatus] = useState('idle'); // 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'

    const isDefault = !(() => {
        try {
            return !!localStorage.getItem('voyager_origin_city');
        } catch {
            return false;
        }
    })();

    const handleSetCity = useCallback((newCity) => {
        setCity(newCity);
        try {
            if (newCity) {
                localStorage.setItem('voyager_origin_city', newCity);
            } else {
                localStorage.removeItem('voyager_origin_city');
            }
        } catch {}
    }, []);

    const handleSetCoords = useCallback((newCoords, newStatus) => {
        setCoords(newCoords);
        if (newStatus) setStatus(newStatus);
        try {
            if (newCoords) {
                localStorage.setItem('voyager_origin_coords', JSON.stringify(newCoords));
            }
        } catch {}
    }, []);

    const setUserLocation = useCallback((arg1, arg2) => {
        let newCity = '';
        let newCoords = null;
        if (typeof arg1 === 'object' && arg1 !== null) {
            newCity = arg1.city || arg1.name || arg1.userCity || '';
            newCoords = arg1.coords || arg1.userCoords || (arg1.lat != null && arg1.lon != null ? { lat: Number(arg1.lat), lon: Number(arg1.lon) } : null);
        } else {
            newCity = arg1 || '';
            newCoords = arg2 || null;
        }

        if (!newCoords && newCity) {
            const match = GATEWAY_CITIES.find(c => 
                c.name.toLowerCase() === newCity.toLowerCase() ||
                newCity.toLowerCase().includes(c.name.toLowerCase())
            );
            if (match) {
                newCoords = { lat: match.lat, lon: match.lon };
                if (!newCity.includes(match.country)) {
                    newCity = `${match.name}, ${match.country}`;
                }
            }
        }

        if (newCity) handleSetCity(newCity);
        if (newCoords) handleSetCoords(newCoords, 'custom');
        setStatus('custom');
    }, [handleSetCity, handleSetCoords]);


    const detectLocation = useCallback(async () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            setStatus('unsupported');
            return;
        }

        setStatus('requesting');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const newCoords = { lat: latitude, lon: longitude };
                handleSetCoords(newCoords, 'granted');

                try {
                    // High-accuracy free client reverse geocoder
                    const res = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        const detectedCity = data.city || data.locality || data.principalSubdivision || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
                        const country = data.countryName ? `, ${data.countryName}` : '';
                        handleSetCity(`${detectedCity}${country}`);
                        return;
                    }
                } catch {
                    // Fallback to coordinates format
                }
                handleSetCity(`${latitude.toFixed(1)}°N, ${longitude.toFixed(1)}°E`);
            },
            (error) => {
                console.warn('Geolocation request failed or denied:', error.message);
                setStatus('denied');
            },
            { timeout: 8000, maximumAge: 300000 }
        );
    }, [handleSetCity, handleSetCoords]);

    const calculateDistanceTo = useCallback((destLat, destLon) => {
        if (!coords || destLat == null || destLon == null) return null;
        const R = 6371; // km
        const dLat = (destLat - coords.lat) * (Math.PI / 180);
        const dLon = (destLon - coords.lon) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(coords.lat * (Math.PI / 180)) * Math.cos(destLat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = Math.round(R * c);
        const distanceMiles = Math.round(distanceKm * 0.621371);

        const totalHours = (distanceKm / 800) + (distanceKm > 80 ? 0.67 : 0.25);
        const flightHours = Math.floor(totalHours);
        const flightMins = Math.round((totalHours - flightHours) * 60);

        let flightTimeFormatted = '';
        if (flightHours > 0 && flightMins > 0) {
            flightTimeFormatted = `~${flightHours}h ${flightMins}m direct flight`;
        } else if (flightHours > 0) {
            flightTimeFormatted = `~${flightHours}h direct flight`;
        } else if (flightMins > 0) {
            flightTimeFormatted = `~${flightMins}m flight`;
        } else {
            flightTimeFormatted = 'Local transit / immediate vicinity';
        }

        return {
            km: distanceKm,
            miles: distanceMiles,
            distanceKm,
            distanceMiles,
            formattedKm: `${distanceKm.toLocaleString()} km`,
            formattedMiles: `${distanceMiles.toLocaleString()} mi`,
            flightHours,
            flightMinutes: flightMins,
            flightTimeFormatted,
            originCity: city
        };
    }, [coords, city]);


    return (
        <LocationContext.Provider value={{
            city,
            userCity: city,
            coords,
            userCoords: coords,
            status,
            isDefault,
            setCity: handleSetCity,
            setCoords: handleSetCoords,
            setUserLocation,
            detectLocation,
            requestGeoLocation: detectLocation,
            calculateDistanceTo
        }}>
            {children}
        </LocationContext.Provider>
    );
}

