import { useState, useCallback, useRef } from 'react';
import { chatWithDestination, generateItinerary, parseItineraryJSON } from '@/services/gemini';
export function useChat(destinationName, country) {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const historyRef = useRef([]);
    const sendMessage = useCallback(async (text) => {
        if (!text.trim())
            return;
        const userMsg = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);
        historyRef.current = [...historyRef.current, userMsg];
        setStatus('loading');
        setError(null);
        try {
            const reply = await chatWithDestination(destinationName, country, historyRef.current.slice(0, -1), // history without current message
            text);
            const modelMsg = { role: 'model', content: reply };
            setMessages((prev) => [...prev, modelMsg]);
            historyRef.current = [...historyRef.current, modelMsg];
            setStatus('success');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
            setStatus('error');
            // Remove the user message if we failed so they can retry
            setMessages((prev) => prev.slice(0, -1));
            historyRef.current = historyRef.current.slice(0, -1);
        }
    }, [destinationName, country]);
    const clearChat = useCallback(() => {
        setMessages([]);
        historyRef.current = [];
        setStatus('idle');
        setError(null);
    }, []);
    return { messages, status, error, sendMessage, clearChat };
}
export function useItinerary(destinationName, country) {
    const [days, setDays] = useState([]);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const generate = useCallback(async (numDays, preferences = [], pacing = 'Balanced', travelStyle = 'Boutique Explorer') => {
        setStatus('loading');
        setError(null);
        setDays([]);
        const startTime = Date.now();
        try {
            const result = await generateItinerary(destinationName, country, numDays, preferences, pacing, travelStyle);
            // Minimum display time for the skeleton to feel intentional
            const elapsed = Date.now() - startTime;
            if (elapsed < 800) {
                await new Promise((r) => setTimeout(r, 800 - elapsed));
            }
            setDays(result);
            setStatus('success');
        }
        catch (err) {
            let message = 'Couldn\'t generate itinerary';
            if (err instanceof Error) {
                if (err.message.includes('Malformed') || err.message.includes('not an array')) {
                    message = 'The response format was unexpected. Please try again.';
                }
                else if (err.message.includes('timed out')) {
                    message = 'Request timed out. Please try again.';
                }
                else {
                    message = err.message;
                }
            }
            setError(message);
            setStatus('error');
        }
    }, [destinationName, country]);
    return { days, status, error, generate };
}
// Re-export parseItineraryJSON for testing purposes
export { parseItineraryJSON };
