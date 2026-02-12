import React from 'react';
import { UserProfile } from '../../types';
import { Flame } from 'lucide-react';

interface StepPassionProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const NICHES = [
    "Tech & Coding", "Gaming", "Lifestyle & Vlog",
    "Education & How-to", "Business & Finance", "Entertainment & Comedy",
    "Health & Fitness", "Other"
];

export const StepPassion: React.FC<StepPassionProps> = ({ profile, setProfile }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Flame className="text-red-600 animate-pulse" size={32} />
                </div>
                <h2 className="text-3xl font-black">What lights you up?</h2>
                <p className="text-neutral-400">What could you talk about for 30 minutes straight with zero prep?</p>
            </div>

            <div className="space-y-4">
                <textarea
                    value={profile.passionBio}
                    onChange={(e) => setProfile(prev => ({ ...prev, passionBio: e.target.value }))}
                    placeholder="I'm obsessed with vintage cameras and the stories behind them..."
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-lg font-medium outline-none focus:border-red-600 transition-all min-h-[150px] resize-none"
                    autoFocus
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    {NICHES.map(niche => (
                        <button
                            key={niche}
                            onClick={() => setProfile(prev => ({ ...prev, niche }))}
                            className={`p-3 rounded-xl border text-sm font-bold transition-all ${profile.niche === niche
                                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700'
                                }`}
                        >
                            {niche}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
