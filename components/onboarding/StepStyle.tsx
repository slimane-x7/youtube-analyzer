import React from 'react';
import { UserProfile } from '../../types';
import { Video, Mic, Film, Camera, Gamepad2, Smartphone, Layers } from 'lucide-react';

interface StepStyleProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const STYLES = [
    { id: "Education", label: "Education / Tutorials", icon: Video },
    { id: "Commentary", label: "Commentary / Analysis", icon: Mic },
    { id: "Documentary", label: "Storytelling / Docu", icon: Film },
    { id: "Vlogs", label: "Vlogs / Reality", icon: Camera },
    { id: "Gaming", label: "Gaming / Let's Play", icon: Gamepad2 },
    { id: "Shorts", label: "Shorts-Only", icon: Smartphone },
    { id: "Hybrid", label: "Hybrid / Mixed", icon: Layers },
];

export const StepStyle: React.FC<StepStyleProps> = ({ profile, setProfile }) => {
    const toggleStyle = (styleId: string) => {
        setProfile(prev => {
            const current = prev.contentStyles || [];
            if (current.includes(styleId)) {
                return { ...prev, contentStyles: current.filter(s => s !== styleId) };
            }
            return { ...prev, contentStyles: [...current, styleId] };
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div>
                <h2 className="text-3xl font-black mb-2">How do you deliver value?</h2>
                <p className="text-neutral-400">Select all formats that match your vibe.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {STYLES.map(({ id, label, icon: Icon }) => {
                    const isSelected = (profile.contentStyles || []).includes(id);
                    return (
                        <button
                            key={id}
                            onClick={() => toggleStyle(id)}
                            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group ${isSelected
                                    ? 'bg-red-600 border-red-600 text-white shadow-lg'
                                    : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:border-neutral-700'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-white/20' : 'bg-neutral-800 group-hover:bg-neutral-700'
                                }`}>
                                <Icon size={20} />
                            </div>
                            <span className="font-bold text-lg">{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
