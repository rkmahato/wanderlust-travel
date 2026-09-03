import { getMissingKeys } from '@/config';
import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
/**
 * Development-only banner that appears when API keys are missing.
 * Automatically hidden in production builds.
 */
export function DevKeysBanner() {
    const [dismissed, setDismissed] = useState(false);
    const missing = getMissingKeys();
    // Never show in production, never show if all keys present, never show if dismissed
    if (import.meta.env.PROD || missing.length === 0 || dismissed)
        return null;
    return (<div role="alert" className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true"/>
          <div className="text-sm text-amber-800">
            <span className="font-semibold">Missing API keys: </span>
            <code className="font-mono bg-amber-100 px-1 rounded text-xs">
              {missing.join(', ')}
            </code>
            <span className="ml-2">
              — Copy{' '}
              <code className="font-mono bg-amber-100 px-1 rounded text-xs">.env.example</code>
              {' '}to{' '}
              <code className="font-mono bg-amber-100 px-1 rounded text-xs">.env</code>
              {' '}and add your keys. Images, weather and AI features will show error states until then.
            </span>
          </div>
        </div>
        <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss API key warning" className="text-amber-600 hover:text-amber-800 flex-shrink-0 transition-colors">
          <X size={16} aria-hidden="true"/>
        </button>
      </div>
    </div>);
}
