import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, RotateCcw, Copy, Check, Lightbulb, Compass, Utensils, CloudSun, Camera, ShieldAlert, Footprints } from 'lucide-react';
import { useChat } from '@/hooks/useGemini';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { cn } from '@/utils/motion';

/**
 * Markdown bubble renderer that formats:
 * - **bolding** into <strong>
 * - *italic* into <em>
 * - `code` into <code>
 * - Bullet points (- / * / •) into <ul><li>
 * - Numbered lists (1. / 2.) into <ol><li>
 * - Headers (### / ## / #) into styled headings
 * - Insider Tip lines into distinct highlighted callout cards
 */
function renderInlineMarkdown(text) {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIdx) {
            parts.push(text.substring(lastIdx, match.index));
        }
        const token = match[0];
        if (token.startsWith('**') && token.endsWith('**')) {
            parts.push(
                <strong key={`b-${match.index}`} className="font-bold text-white tracking-wide">
                    {token.slice(2, -2)}
                </strong>
            );
        } else if (token.startsWith('*') && token.endsWith('*')) {
            parts.push(
                <em key={`i-${match.index}`} className="italic text-neutral-300">
                    {token.slice(1, -1)}
                </em>
            );
        } else if (token.startsWith('`') && token.endsWith('`')) {
            parts.push(
                <code key={`c-${match.index}`} className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10 font-mono text-xs text-[#FF6B6B]">
                    {token.slice(1, -1)}
                </code>
            );
        }
        lastIdx = regex.lastIndex;
    }
    if (lastIdx < text.length) {
        parts.push(text.substring(lastIdx));
    }
    return parts;
}

function FormattedChatMessage({ content }) {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let currentList = null; // { type: 'ul' | 'ol', items: [] }

    function flushList() {
        if (!currentList) return;
        if (currentList.type === 'ul') {
            elements.push(
                <ul key={`ul-${elements.length}`} className="my-2 space-y-2 pl-0.5">
                    {currentList.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-neutral-200 text-sm leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] mt-2 flex-shrink-0 shadow-sm shadow-[#FF6B6B]/40" />
                            <span className="flex-1">{renderInlineMarkdown(item)}</span>
                        </li>
                    ))}
                </ul>
            );
        } else {
            elements.push(
                <ol key={`ol-${elements.length}`} className="my-2 space-y-2 pl-0.5">
                    {currentList.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-neutral-200 text-sm leading-relaxed">
                            <span className="text-xs font-bold text-[#FF6B6B] w-4 flex-shrink-0 mt-0.5">{idx + 1}.</span>
                            <span className="flex-1">{renderInlineMarkdown(item)}</span>
                        </li>
                    ))}
                </ol>
            );
        }
        currentList = null;
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
            flushList();
            continue;
        }

        // Headers
        if (line.startsWith('### ')) {
            flushList();
            elements.push(
                <h4 key={`h4-${elements.length}`} className="font-bold text-sm text-purple-200 mt-3 mb-1.5 tracking-wide flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#FF6B6B] flex-shrink-0" />
                    <span>{renderInlineMarkdown(line.slice(4))}</span>
                </h4>
            );
            continue;
        }
        if (line.startsWith('## ') || line.startsWith('# ')) {
            flushList();
            const headingText = line.replace(/^#+\s*/, '');
            elements.push(
                <h3 key={`h3-${elements.length}`} className="font-bold text-base text-white mt-3.5 mb-1.5 tracking-wide">
                    {renderInlineMarkdown(headingText)}
                </h3>
            );
            continue;
        }

        // Insider Tip Callout
        const isTip = line.toLowerCase().startsWith('**insider tip**:') ||
                      line.toLowerCase().startsWith('insider tip:') ||
                      line.toLowerCase().startsWith('tip:') ||
                      line.toLowerCase().startsWith('> tip:') ||
                      line.toLowerCase().startsWith('> **insider tip**:');
        if (isTip) {
            flushList();
            const tipContent = line
                .replace(/^(?:>\s*)?(?:\*\*)?insider tip(?:\*\*)?:?\s*/i, '')
                .replace(/^(?:>\s*)?tip:?\s*/i, '');
            elements.push(
                <div 
                    key={`tip-${elements.length}`} 
                    className="flex items-start gap-3 p-3.5 my-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-100 shadow-lg shadow-purple-950/50"
                >
                    <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-300">
                        <Lightbulb size={13} />
                    </div>
                    <div className="flex-1 leading-relaxed">
                        <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block mb-0.5">
                            Insider Tip
                        </span>
                        <div className="text-neutral-200">
                            {renderInlineMarkdown(tipContent)}
                        </div>
                    </div>
                </div>
            );
            continue;
        }

        // Bullet list item
        const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
        if (bulletMatch) {
            if (currentList && currentList.type !== 'ul') flushList();
            if (!currentList) currentList = { type: 'ul', items: [] };
            currentList.items.push(bulletMatch[1]);
            continue;
        }

        // Numbered list item
        const numberMatch = line.match(/^\d+[.)]\s+(.*)$/);
        if (numberMatch) {
            if (currentList && currentList.type !== 'ol') flushList();
            if (!currentList) currentList = { type: 'ol', items: [] };
            currentList.items.push(numberMatch[1]);
            continue;
        }

        // Regular Paragraph
        flushList();
        elements.push(
            <p key={`p-${elements.length}`} className="text-sm leading-relaxed text-neutral-200 my-1.5">
                {renderInlineMarkdown(line)}
            </p>
        );
    }
    flushList();

    return <div className="space-y-1">{elements}</div>;
}

export function ChatWidget({ destinationName = "Anywhere", country = "World", className }) {
    const isGlobal = destinationName === "Global" || destinationName === "Anywhere";
    const titleContext = isGlobal ? "World Travel" : destinationName;
    const { messages, status, error, sendMessage, clearChat } = useChat(titleContext, country);
    const [inputValue, setInputValue] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll inside chat thread only
    useEffect(() => {
        if (messages.length > 0 && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, status]);

    async function handleSubmit(e) {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text || status === 'loading') return;
        setInputValue('');
        await sendMessage(text);
    }

    async function handleCopyMessage(content, index) {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 2000);
        } catch {
            // Fallback for browsers with restricted clipboard
            const textarea = document.createElement('textarea');
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 2000);
        }
    }

    const smartPromptChips = isGlobal
        ? [
            { icon: Compass, text: '3-day insider highlights for top destinations' },
            { icon: Utensils, text: 'Best regional food & markets' },
            { icon: CloudSun, text: 'Packing & weather tips' },
            { icon: Footprints, text: 'Hidden gems off the beaten path' },
            { icon: Camera, text: 'Top 3 photography spots' },
            { icon: ShieldAlert, text: 'Extreme adventure trips under $2,000' },
        ]
        : [
            { icon: Compass, text: `3-day insider highlights in ${destinationName}` },
            { icon: Utensils, text: `Best regional food & markets` },
            { icon: CloudSun, text: `Packing & weather tips` },
            { icon: Footprints, text: `Hidden gems off the beaten path` },
            { icon: Camera, text: `Top 3 photography spots` },
            { icon: ShieldAlert, text: `Budget breakdown & day trips` },
        ];

    return (
        <div 
            className={cn(
                'flex flex-col h-full w-full rounded-3xl border border-white/10 bg-[#0f0c24]/90 backdrop-blur-2xl shadow-2xl shadow-purple-950/50 overflow-hidden', 
                className
            )}
            aria-label={`Travel assistant for ${destinationName}`}
        >
            {/* Header with Clear Chat action */}
            <div className="px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF6B6B] mb-1">
                        <Sparkles size={14} />
                        <span>AI Expedition Concierge</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                        {isGlobal ? "Ask Our Travel Specialist" : `Explore ${destinationName}`}
                    </h2>
                    <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
                        {isGlobal ? "Real-time answers for any destination worldwide" : `Curated intelligence for ${destinationName}, ${country}`}
                    </p>
                </div>

                {/* Reset / Clear Chat Button */}
                <button
                    type="button"
                    onClick={clearChat}
                    disabled={messages.length === 0 || status === 'loading'}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex-shrink-0 shadow-sm"
                    title="Clear conversation and restart fresh"
                    aria-label="Clear chat conversation"
                >
                    <RotateCcw size={13} className="text-[#FF6B6B]" />
                    <span className="hidden sm:inline">Clear Chat</span>
                </button>
            </div>

            {/* Messages Thread */}
            <div 
                ref={messagesContainerRef} 
                role="log" 
                aria-label="Chat conversation" 
                aria-live="polite" 
                className="flex-1 overflow-y-auto p-5 md:p-7 space-y-5 min-h-[340px] max-h-[460px] no-scrollbar"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-6 text-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B6B]/20 to-[#7c3aed]/20 border border-white/10 flex items-center justify-center text-[#FF6B6B] shadow-inner">
                            <Sparkles size={24} />
                        </div>
                        <div className="max-w-sm">
                            <p className="text-base font-semibold text-white mb-1">
                                How can I help plan your trip?
                            </p>
                            <p className="text-xs text-neutral-400">
                                Ask about itineraries, secret spots, packing tips, or local cuisine. Click a prompt below to begin:
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full pt-1 text-left">
                            {smartPromptChips.map((chip, idx) => {
                                const Icon = chip.icon;
                                return (
                                    <button 
                                        key={idx} 
                                        type="button" 
                                        onClick={() => void sendMessage(chip.text)} 
                                        className="group text-xs p-3 rounded-2xl border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:border-[#FF6B6B]/60 hover:bg-white/10 transition-all duration-200 flex items-center gap-2.5 shadow-sm"
                                    >
                                        <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B6B] group-hover:scale-110 transition-transform flex-shrink-0">
                                            <Icon size={14} />
                                        </div>
                                        <span className="font-medium text-[12px] line-clamp-1">{chip.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 8 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.2 }} 
                            className={cn('flex gap-3 max-w-[90%] md:max-w-[85%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto')}
                        >
                            {/* Avatar */}
                            <div 
                                className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1 shadow-md', 
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] text-white' 
                                        : 'bg-purple-600/30 border border-purple-400/30 text-purple-300'
                                )} 
                                aria-hidden="true"
                            >
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            {/* Bubble */}
                            <div 
                                className={cn(
                                    'group relative px-5 py-4 text-sm leading-relaxed rounded-2xl', 
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed] text-white rounded-tr-sm shadow-lg shadow-purple-950/40 font-medium'
                                        : 'bg-white/10 text-neutral-100 border border-white/10 rounded-tl-sm backdrop-blur-md shadow-xl'
                                )}
                            >
                                {msg.role === 'user' ? (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <div>
                                        <FormattedChatMessage content={msg.content} />
                                        
                                        {/* Copy to clipboard button with temporary checkmark animation */}
                                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                                            <span className="text-[10px] uppercase tracking-wider text-purple-300/80 font-bold flex items-center gap-1">
                                                <Sparkles size={11} className="text-[#FF6B6B]" /> AI Concierge Verified
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyMessage(msg.content, i)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-all text-[11px] font-semibold select-none"
                                                aria-label="Copy message to clipboard"
                                                title="Copy answer to clipboard"
                                            >
                                                {copiedIndex === i ? (
                                                    <>
                                                        <Check size={13} className="text-emerald-400 animate-in zoom-in-75 duration-200" />
                                                        <span className="text-emerald-400">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={13} className="text-neutral-400 group-hover:text-white transition-colors" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Loading typing indicator */}
                {status === 'loading' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%] mr-auto items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/30 flex items-center justify-center flex-shrink-0 text-purple-300">
                            <Bot size={14} />
                        </div>
                        <div className="px-5 py-3.5 rounded-2xl rounded-tl-sm bg-white/10 border border-white/10 flex items-center gap-3">
                            <span className="text-xs text-neutral-400 font-medium">Concierge is writing…</span>
                            <div className="flex gap-1.5 items-center h-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div 
                                        key={i} 
                                        className="w-2 h-2 rounded-full bg-[#FF6B6B]" 
                                        animate={{ y: [0, -5, 0] }} 
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} 
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error state */}
                {status === 'error' && error && (
                    <div className="max-w-[90%] mr-auto">
                        <ErrorCard message={error} compact onRetry={undefined} />
                    </div>
                )}
            </div>

            {/* Prompt Chips Bar when messages are present */}
            {messages.length > 0 && (
                <div className="px-5 py-2.5 border-t border-white/5 bg-white/[0.01] flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 whitespace-nowrap pl-1">
                        Try:
                    </span>
                    {smartPromptChips.slice(0, 4).map((chip, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => void sendMessage(chip.text)}
                            disabled={status === 'loading'}
                            className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:border-[#FF6B6B]/40 hover:bg-white/10 transition-all duration-150 disabled:opacity-40"
                        >
                            {chip.text}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t border-white/10 bg-white/[0.02]">
                <div className="relative flex items-center">
                    <input 
                        ref={inputRef} 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder={isGlobal ? "Ask about any country, city, secret spot, or route…" : `Ask anything about ${destinationName}…`} 
                        aria-label="Chat message" 
                        disabled={status === 'loading'} 
                        className="w-full h-13 pl-5 pr-14 rounded-full bg-black/40 border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/40 transition-all font-medium shadow-inner"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || status === 'loading'} 
                        className="absolute right-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed] text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-md"
                        aria-label="Send message"
                    >
                        <Send size={15} />
                    </button>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2 px-3 text-center">
                    Powered by Google Gemini · Natural language expedition intelligence
                </p>
            </form>
        </div>
    );
}
