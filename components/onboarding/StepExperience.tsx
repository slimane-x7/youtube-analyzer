import React from 'react';
import { UserProfile } from '../../types';
import { Rocket, Trophy, Crown } from 'lucide-react';

interface StepExperienceProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const LEVELS = [
    { id: 'Beginner', label: 'Explorer', desc: 'Just starting or have < 10 videos.', icon: Rocket },
    { id: 'Intermediate', label: 'Builder', desc: 'Some traction but inconsistent growth.', icon: Trophy },
    { id: 'Advanced', label: 'Authority', desc: 'Solid audience, looking to scale.', icon: Crown },
];

export const StepExperience: React.FC<StepExperienceProps> = ({ profile, setProfile }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div>
                <h2 className="text-3xl font-black mb-2">Where are you on the journey?</h2>
                <p className="text-neutral-400">This helps us calibrate the advice complexity.</p>
            </div>

            <div className="space-y-4">
                {LEVELS.map(({ id, label, desc, icon: Icon }) => {
                    const isSelected = profile.experienceLevel === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setProfile(prev => ({ ...prev, experienceLevel: id as any }))}
                            className={`w-full flex items-center gap-6 p-6 rounded-3xl border transition-all relative overflow-hidden group ${isSelected
                                    ? 'bg-gradient-to-r from-red-600 to-red-800 border-red-600 text-white shadow-2xl scale-[1.02]'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'
                                }`}
                        >
                            <div className={`p-4 rounded-2xl shrink-0 transition-colors ${isSelected ? 'bg-white/20' : 'bg-neutral-800 group-hover:bg-neutral-700'
                                }`}>
                                <Icon size={32} />
                            </div>
                            <div className="text-left">
                                <h3 className={`text-xl font-black mb-1 ${isSelected ? 'text-white' : 'text-neutral-200'}`}>{label}</h3>
                                <p className={`text-sm font-medium ${isSelected ? 'text-red-100' : 'text-neutral-500'}`}>{desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
