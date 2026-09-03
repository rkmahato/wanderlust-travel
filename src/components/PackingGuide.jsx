import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, RotateCcw, AlertCircle, Backpack } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

// Gear database tailored to expedition environments
function getCuratedGearList(destination) {
    const tags = destination?.tags || [];
    const text = `${destination?.name} ${destination?.country} ${destination?.description}`.toLowerCase();

    const isAlpine = tags.includes('mountains') || tags.includes('hiking') || tags.includes('winter') || tags.includes('nature') || text.includes('alps') || text.includes('mountain') || text.includes('fjords') || text.includes('himalaya');
    const isCoastal = tags.includes('beaches') || tags.includes('islands') || tags.includes('coastal') || text.includes('beach') || text.includes('reef') || text.includes('island') || text.includes('ocean');
    const isCultural = tags.includes('culture') || tags.includes('temples') || tags.includes('history') || tags.includes('art') || text.includes('temple') || text.includes('ancient') || text.includes('palace');
    const isDesert = tags.includes('desert') || text.includes('sahara') || text.includes('wadi') || text.includes('sand');

    const gear = [];

    // Technical Outerwear
    if (isAlpine) {
        gear.push({
            id: 'goretex-shell',
            name: '3-Layer Gore-Tex Pro Hardshell',
            category: 'technical',
            essential: true,
            note: 'Windproof, 28,000mm hydrostatic head for sudden alpine squalls.'
        });
        gear.push({
            id: 'merino-base',
            name: '260g Merino Wool Thermal Base Layer',
            category: 'technical',
            essential: true,
            note: 'Naturally anti-microbial thermal regulation for cold ascents.'
        });
    } else if (isCoastal) {
        gear.push({
            id: 'uv-rashguard',
            name: 'UPF 50+ Hydrophobic Rashguard & Quick-Drys',
            category: 'technical',
            essential: true,
            note: 'Salt-resistant, rapid evaporation fabric for coastal tides.'
        });
        gear.push({
            id: 'breathable-linen',
            name: 'Airflow Linen / Tropical Weave Shirts',
            category: 'technical',
            essential: false,
            note: 'High breathability against tropical midday heat.'
        });
    } else if (isCultural) {
        gear.push({
            id: 'modest-attire',
            name: 'Modest Cultural Layer (Covered Shoulders/Knees)',
            category: 'technical',
            essential: true,
            note: 'Required protocol for historic temples, basilicas & shrines.'
        });
        gear.push({
            id: 'breathable-outer',
            name: 'Lightweight Weather-Resistant Windbreaker',
            category: 'technical',
            essential: false,
            note: 'Packable jacket for sudden urban drizzle and evening chills.'
        });
    } else {
        gear.push({
            id: 'breathable-outer',
            name: 'Lightweight Weather-Resistant Windbreaker',
            category: 'technical',
            essential: false,
            note: 'Packable jacket for variable conditions.'
        });
    }

    // Hardware & Field Gear
    if (isAlpine) {
        gear.push({
            id: 'trekking-poles',
            name: 'Carbon-Fiber Collapsible Trekking Poles',
            category: 'hardware',
            essential: true,
            note: 'Reduces knee impact by up to 25% on steep descending scree.'
        });
        gear.push({
            id: 'thermal-flask',
            name: 'Vacuum-Insulated 1L Mountain Flask',
            category: 'hardware',
            essential: false,
            note: 'Keeps water hot for 18h or freezing cold in alpine sun.'
        });
    } else if (isCoastal) {
        gear.push({
            id: 'dry-bag',
            name: '20L Submersible Waterproof Dry Bag',
            category: 'hardware',
            essential: true,
            note: 'Roll-top IPX8 protection for boat transfers and lagoon wading.'
        });
        gear.push({
            id: 'reef-booties',
            name: 'Reinforced Grip Reef / Water Shoes',
            category: 'hardware',
            essential: false,
            note: 'Guards against sharp coral heads, volcanic rock and sea urchins.'
        });
    } else {
        gear.push({
            id: 'comfort-footwear',
            name: 'Ergonomic Vibram-Sole Walking Shoes',
            category: 'hardware',
            essential: true,
            note: 'Engineered cushion for 18,000+ daily steps on cobblestones.'
        });
        gear.push({
            id: 'antitheft-pack',
            name: 'Compact Anti-Theft Crossbody / Daypack',
            category: 'hardware',
            essential: false,
            note: 'Lockable YKK zippers and slash-resistant fabric for crowded markets.'
        });
    }

    // Health & Protection
    if (isCoastal || isDesert) {
        gear.push({
            id: 'reef-sunscreen',
            name: 'Mineral SPF 50+ Reef-Safe Sunscreen',
            category: 'health',
            essential: true,
            note: 'Zero oxybenzone; compliant with marine reserve conservation laws.'
        });
        gear.push({
            id: 'electrolytes',
            name: 'High-Concentration Electrolyte Hydration Salts',
            category: 'health',
            essential: true,
            note: 'Prevents heat fatigue and dehydration under equatorial UV.'
        });
    } else if (isAlpine) {
        gear.push({
            id: 'altitude-firstaid',
            name: 'Alpine First-Aid & Blister Hydrocolloid Kit',
            category: 'health',
            essential: true,
            note: 'Immediate second-skin relief for high-mileage mountain trails.'
        });
        gear.push({
            id: 'glacier-eyewear',
            name: 'Category 4 Polarized Glacier Goggles / Glasses',
            category: 'health',
            essential: true,
            note: 'Blocks high-altitude albedo UV reflection off snow and glaciers.'
        });
    } else {
        gear.push({
            id: 'compact-medkit',
            name: 'Travel Wellness & Hydration Essentials',
            category: 'health',
            essential: true,
            note: 'Electrolytes, motion relief, and emergency bandaging.'
        });
        gear.push({
            id: 'uv-compact-umbrella',
            name: 'Wind-Tested Titanium UV Compact Umbrella',
            category: 'health',
            essential: false,
            note: 'Dual-purpose protection from torrential downpours and blazing sun.'
        });
    }

    // Optics & Electronics
    gear.push({
        id: 'power-bank',
        name: '20,000mAh PD 65W Fast-Charging Power Bank',
        category: 'electronics',
        essential: true,
        note: 'High-capacity backup for camera batteries, GPS, and offline maps.'
    });
    gear.push({
        id: 'optics-lens',
        name: 'Wide-Angle Lens / High-Res Mirrorless Camera',
        category: 'electronics',
        essential: false,
        note: 'Essential for capturing sweeping architectural scales and vistas.'
    });
    gear.push({
        id: 'universal-adapter',
        name: 'GaN Universal Travel Adapter (All Plug Types)',
        category: 'electronics',
        essential: true,
        note: 'Universal pin configuration supporting 150+ countries.'
    });

    return gear;
}

export function PackingGuide({ destination }) {
    const toast = useToast();
    const gearList = useMemo(() => getCuratedGearList(destination), [destination]);

    const storageKey = `voyager_gear_${destination?.id || 'global'}`;

    // Checked item IDs
    const [packedIds, setPackedIds] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [activeTab, setActiveTab] = useState('all');

    // Save to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(packedIds));
        } catch {}
    }, [packedIds, storageKey]);

    const totalCount = gearList.length;
    const packedCount = gearList.filter((g) => packedIds.includes(g.id)).length;
    const progressPercent = Math.round((packedCount / totalCount) * 100);

    function toggleItem(id, name) {
        setPackedIds((prev) => {
            const isPacked = prev.includes(id);
            const next = isPacked ? prev.filter((item) => item !== id) : [...prev, id];

            if (!isPacked) {
                if (next.length === totalCount) {
                    toast.success('Expedition Ready (100%)', `All gear for ${destination?.name} is stowed!`);
                } else {
                    toast.info('Gear Stowed', `${name} added to expedition pack`);
                }
            }
            return next;
        });
    }

    function packAll() {
        const allIds = gearList.map((g) => g.id);
        setPackedIds(allIds);
        toast.success('Expedition Ready', `All items checked for ${destination?.name}!`);
    }

    function resetPack() {
        setPackedIds([]);
        toast.info('Pack Reset', 'Checklist cleared for re-packing.');
    }

    const filteredGear = useMemo(() => {
        if (activeTab === 'all') return gearList;
        return gearList.filter((g) => g.category === activeTab);
    }, [gearList, activeTab]);

    return (
        <section
            id="packing-guide"
            className="w-full bg-[#120e29]/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-[#FF6B6B]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B6B] to-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                        <Backpack size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B6B]">
                                Expedition Readiness
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-neutral-300 border border-white/10">
                                {destination?.name} Field Kit
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                            Gear & Packing Essentials
                        </h3>
                    </div>
                </div>

                {/* Progress & Quick Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                            Readiness: <span className="text-white font-mono">{progressPercent}%</span>
                        </div>
                        <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden mt-1.5 border border-white/5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.35 }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={packAll}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all active:scale-95 flex items-center gap-1"
                        >
                            <ShieldCheck size={13} className="text-emerald-400" />
                            <span>Pack All</span>
                        </button>
                        <button
                            type="button"
                            onClick={resetPack}
                            className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
                            title="Reset checklist"
                            aria-label="Reset checklist"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-white/10 text-xs font-bold no-scrollbar">
                {[
                    { id: 'all', label: `All Gear (${gearList.length})` },
                    { id: 'technical', label: 'Apparel & Outerwear' },
                    { id: 'hardware', label: 'Field Hardware' },
                    { id: 'health', label: 'Bioprotection' },
                    { id: 'electronics', label: 'Optics & Power' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3.5 py-1.5 rounded-full whitespace-nowrap uppercase tracking-wider transition-all ${
                            activeTab === tab.id
                                ? 'bg-white text-black shadow-md'
                                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Interactive Gear Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-6">
                <AnimatePresence mode="popLayout">
                    {filteredGear.map((item) => {
                        const isPacked = packedIds.includes(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                onClick={() => toggleItem(item.id, item.name)}
                                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                                    isPacked
                                        ? 'bg-emerald-950/25 border-emerald-500/30'
                                        : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                                }`}
                            >
                                {/* Checkbox Circle */}
                                <div
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${
                                        isPacked
                                            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-400 text-black shadow-md shadow-emerald-500/30'
                                            : 'border-white/20 bg-white/5 group-hover:border-[#FF6B6B]/60'
                                    }`}
                                >
                                    {isPacked && <Check size={14} className="stroke-[3]" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4
                                            className={`text-sm font-bold tracking-tight transition-colors ${
                                                isPacked ? 'text-white line-through opacity-75' : 'text-neutral-100 group-hover:text-white'
                                            }`}
                                        >
                                            {item.name}
                                        </h4>
                                        {item.essential && (
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30">
                                                Essential
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                                        {item.note}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Field Advisory Note */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-2.5 text-xs text-neutral-400">
                <AlertCircle size={15} className="text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    <strong className="text-neutral-200">Field Advisory:</strong> Requirements dynamically calibrated to {destination?.name} ({destination?.continent}) geographic terrain and microclimate. Pack weights should not exceed 12kg for light agility.
                </p>
            </div>
        </section>
    );
}
