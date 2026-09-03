import { useMemo, useState, useCallback } from 'react';
import destinationsData from '@/data/destinations.json';
import { getAssetUrl } from '@/utils/assets';

const destinations = destinationsData.map((d) => ({
    ...d,
    imageUrl: getAssetUrl(d.imageUrl),
    heroImageUrl: getAssetUrl(d.heroImageUrl),
    places: (d.places || []).map((p) => ({
        ...p,
        imageUrl: getAssetUrl(p.imageUrl)
    }))
}));
const DEFAULT_FILTERS = {
    search: '',
    continent: 'All',
    tags: [],
};
export function useDestinations() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const results = useMemo(() => {
        const searchLower = filters.search.toLowerCase().trim();
        return destinations.filter((d) => {
            const matchesSearch = !searchLower ||
                d.name.toLowerCase().includes(searchLower) ||
                d.country.toLowerCase().includes(searchLower) ||
                d.tagline.toLowerCase().includes(searchLower) ||
                d.tags.some((t) => t.toLowerCase().includes(searchLower));
            const matchesContinent = filters.continent === 'All' || d.continent === filters.continent;
            const matchesTags = filters.tags.length === 0 ||
                filters.tags.every((tag) => d.tags.includes(tag));
            return matchesSearch && matchesContinent && matchesTags;
        });
    }, [filters]);
    const setSearch = useCallback((search) => {
        setFilters((f) => ({ ...f, search }));
    }, []);
    const setContinent = useCallback((continent) => {
        setFilters((f) => ({ ...f, continent }));
    }, []);
    const toggleTag = useCallback((tag) => {
        setFilters((f) => ({
            ...f,
            tags: f.tags.includes(tag)
                ? f.tags.filter((t) => t !== tag)
                : [...f.tags, tag],
        }));
    }, []);
    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);
    return {
        results,
        allDestinations: destinations,
        isEmpty: results.length === 0,
        filters,
        setSearch,
        setContinent,
        toggleTag,
        resetFilters,
    };
}
export function getDestinationById(id) {
    return destinations.find((d) => d.id === id);
}
