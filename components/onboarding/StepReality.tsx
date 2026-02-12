import React from 'react';
import { UserProfile } from '../../types';
import { Clock, Battery, AlertTriangle, Key } from 'lucide-react';

interface StepRealityProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const StepReality: React.FC<StepRealityProps> = ({ profile, setProfile }) => {
    const TIMES = ["< 5 Hours (Side Hustle)", "10-20 Hours (Part-Time)", "40+ Hours (Full-Time)"];
    const CONSTRAINTS = ["Ideas / Scripting", "Filming / Camera", "Editing Speed", "Thumbnails / Design", "None (I have a team)"];

    const toggleConstraint = (c: string) => {
        setProfile(prev => {
            const current = prev.productionConstraints || [];
            return current.includes(c) ? { ...prev, productionConstraints: current.filter(x => x !== c) } : { ...prev, productionConstraints: [...current, c] };
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div>
                <h2 className="text-3xl font-black mb-2">Reality Check.</h2>
                <p className="text-neutral-400">We'll build a strategy that fits YOUR life.</p>
            </div>

            <div className="space-y-8">
                {/* Time */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest block">Time Availability</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {TIMES.map(t => (
                            <button
                                key={t}
                                onClick={() => setProfile(prev => ({ ...prev, timeCommitment: t }))}
                                className={`p-4 rounded-xl border text-sm font-bold transition-all ${profile.timeCommitment === t
                                    ? 'bg-neutral-100 text-black border-white'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Constraints */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest block flex items-center justify-center gap-2">
                        <AlertTriangle size={14} /> Production Bottlenecks
                    </label>
                    <div className="flex flex-wrap justify-center gap-3">
                        {CONSTRAINTS.map(c => {
                            const isSelected = (profile.productionConstraints || []).includes(c);
                            return (
                                <button
                                    key={c}
                                    onClick={() => toggleConstraint(c)}
                                    className={`px-5 py-3 rounded-full border text-sm font-bold transition-all ${isSelected
                                        ? 'bg-red-900/40 border-red-600 text-red-500'
                                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                                        }`}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* API Key */}
                <div className="space-y-4 pt-6 mt-6 border-t border-neutral-800/50">
                    <label className="text-sm font-bold text-amber-500 uppercase tracking-widest block flex items-center justify-center gap-2">
                        <Key size={14} /> مفتاح Gemini الخاص بك
                    </label>
                    <div className="relative max-w-md mx-auto group">
                        <input
                            type="password"
                            placeholder="AlzaSy..."
                            value={profile.geminiApiKey || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 pr-12 text-sm font-mono outline-none focus:border-amber-600 transition-all text-left"
                        />
                        <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                    </div>
                    <p className="text-[10px] text-neutral-600 font-bold">
                        إذا لم تضع مفتاحك، سيتم استخدام مفتاح النظام (للعينة فقط).
                    </p>
                </div>
            </div>
        </div>
    );
};
