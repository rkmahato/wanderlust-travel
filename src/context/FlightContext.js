import { createContext, useContext } from 'react';

export const FlightContext = createContext(null);

export function useFlight() {
    return useContext(FlightContext);
}
