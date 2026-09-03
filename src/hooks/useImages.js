import { useState, useEffect } from 'react';
import { fetchDestinationImage, fetchPlaceImage } from '@/services/images';

function createFallbackImage(url, query) {
    if (!url) return null;
    return {
        url,
        alt: query,
        credit: 'Travel Photography',
        creditUrl: 'https://unsplash.com',
    };
}

export function useDestinationImage(query, fallbackUrl) {
    const [image, setImage] = useState(() => createFallbackImage(fallbackUrl, query));
    const [status, setStatus] = useState(fallbackUrl ? 'success' : 'loading');

    useEffect(() => {
        if (!query) return;

        let cancelled = false;

        fetchDestinationImage(query)
            .then((result) => {
                if (!cancelled) {
                    if (fallbackUrl && result.url.startsWith('data:image/svg')) {
                        setImage(createFallbackImage(fallbackUrl, query));
                    } else {
                        setImage(result);
                    }
                    setStatus('success');
                }
            })
            .catch(() => {
                if (!cancelled) {
                    if (fallbackUrl) {
                        setImage(createFallbackImage(fallbackUrl, query));
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                }
            });

        return () => {
            cancelled = true;
        };
    }, [query, fallbackUrl]);

    return { image, status };
}

export function usePlaceImage(query, fallbackUrl) {
    const [image, setImage] = useState(() => createFallbackImage(fallbackUrl, query));
    const [status, setStatus] = useState(fallbackUrl ? 'success' : 'loading');

    useEffect(() => {
        if (!query || fallbackUrl) return;

        let cancelled = false;

        fetchPlaceImage(query)
            .then((result) => {
                if (!cancelled) {
                    setImage(result);
                    setStatus('success');
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus('error');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [query, fallbackUrl]);

    return { image, status };
}
