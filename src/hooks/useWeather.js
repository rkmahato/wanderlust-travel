import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeather, fetchWeatherByCity } from '@/services/weather';

export function useWeather(source) {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(() => (source ? 'loading' : 'idle'));
    const [error, setError] = useState(null);
    const retryCountRef = useRef(0);

    const [prevSource, setPrevSource] = useState(source);
    if (source !== prevSource) {
        setPrevSource(source);
        setStatus(source ? 'loading' : 'idle');
        setError(null);
        if (!source) {
            setData(null);
        }
    }

    useEffect(() => {
        if (!source) {
            return;
        }

        let cancelled = false;

        retryCountRef.current = 0;

        const execute = async () => {
            const startTime = Date.now();
            try {
                let result;
                if (source.type === 'coords') {
                    result = await fetchWeather(source.lat, source.lon, source.cityName || source.name, source.country);
                } else {
                    result = await fetchWeatherByCity(source.city);
                }
                const elapsed = Date.now() - startTime;
                if (elapsed < 400) {
                    await new Promise((r) => setTimeout(r, 400 - elapsed));
                }
                if (!cancelled) {
                    setData(result);
                    setStatus('success');
                }
            } catch (err) {
                if (!cancelled) {
                    const message = err instanceof Error ? err.message : 'Failed to load live weather';
                    setError(message);
                    setStatus('error');
                }
            }
        };

        void execute();

        return () => {
            cancelled = true;
        };
    }, [source]);

    const retry = useCallback(async () => {
        if (!source) return;
        retryCountRef.current += 1;
        setStatus('loading');
        setError(null);
        try {
            let result;
            if (source.type === 'coords') {
                result = await fetchWeather(source.lat, source.lon, source.cityName || source.name, source.country);
            } else {
                result = await fetchWeatherByCity(source.city);
            }
            setData(result);
            setStatus('success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load live weather';
            setError(message);
            setStatus('error');
        }
    }, [source]);

    return { data, status, error, retry };
}
