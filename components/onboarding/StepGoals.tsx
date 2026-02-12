import React from 'react';
import { UserProfile } from '../../types';
import { DollarSign, Users, Award, Heart } from 'lucide-react';

interface StepGoalsProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const GOALS = [
    { id: 'Monetization', label: 'Monetization', desc: 'I need this to generate income.', icon: DollarSign },
    { id: 'Audience Growth', label: 'Audience Growth', desc: 'I want 100k subscribers.', icon: Users },
    { id: 'Personal Brand', label: 'Personal Brand', desc: 'Known as an expert.', icon: Award },
    { id: 'Community', label: 'Community', desc: 'Build a loyal tribe.', icon: Heart },
];

export const StepGoals: React.FC<StepGoalsProps> = ({ profile, setProfile }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div>
                <h2 className="text-3xl font-black mb-2">What is your North Star?</h2>
                <p className="text-neutral-400">Pick the ONE thing that matters most right now.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GOALS.map(({ id, label, desc, icon: Icon }) => {
                    const isSelected = profile.primaryGoal === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setProfile(prev => ({ ...prev, primaryGoal: id as any }))}
                            className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-4 group h-[200px] ${isSelected
                                    ? 'bg-red-600 border-red-600 text-white shadow-xl translate-y-[-4px]'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors ${isSelected ? 'bg-white text-red-600' : 'bg-neutral-800 group-hover:bg-neutral-700'
                                }`}>
                                <Icon size={28} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-black mb-1">{label}</h3>
                                <p className={`text-xs font-medium max-w-[150px] mx-auto ${isSelected ? 'text-red-100' : 'text-neutral-500'}`}>{desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
