import { useState, useEffect, useCallback } from 'react';

export function useGeolocation() {
    const [coords, setCoords] = useState(null);
    const [status, setStatus] = useState(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            return 'unsupported';
        }
        return 'requesting';
    });

    const request = useCallback(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setStatus('unsupported');
            return;
        }
        setStatus('requesting');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setStatus('granted');
            },
            () => {
                setStatus('denied');
            },
            { timeout: 10000, maximumAge: 300000 }
        );
    }, []);

    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            return;
        }
        let cancelled = false;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (cancelled) return;
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setStatus('granted');
            },
            () => {
                if (cancelled) return;
                setStatus('denied');
            },
            { timeout: 10000, maximumAge: 300000 }
        );

        return () => {
            cancelled = true;
        };
    }, []);

    return { coords, status, request };
}

