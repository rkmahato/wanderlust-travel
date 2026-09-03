import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);
export { ToastProvider } from './ToastContext.jsx';

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        // Safe fallback if used outside provider
        return {
            show: () => {},
            success: () => {},
            bookmark: () => {},
            copy: () => {},
            info: () => {},
            location: () => {},
            dismiss: () => {}
        };
    }
    return ctx;
}
