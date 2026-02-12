import React from 'react';
import { UserProfile } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface StepCommitmentProps {
    profile: UserProfile;
}

export const StepCommitment: React.FC<StepCommitmentProps> = ({ profile }) => {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                <CheckCircle2 className="text-green-500" size={40} />
            </div>

            <div>
                <h2 className="text-4xl font-black mb-4">You're ready, {profile.name}.</h2>
                <p className="text-xl text-neutral-400 leading-relaxed">
                    We have your profile. The AI is ready to architect your <span className="text-red-500 font-bold">{profile.primaryGoal}</span> strategy for the <span className="text-white font-bold">{profile.niche}</span> niche.
                </p>
            </div>

            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 text-left space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Level</span>
                    <span className="font-bold">{profile.experienceLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Time</span>
                    <span className="font-bold">{profile.timeCommitment}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Focus</span>
                    <span className="font-bold text-red-500">{profile.contentStyles?.join(', ')}</span>
                </div>
            </div>

            <p className="text-xs text-neutral-600 font-mono">By clicking Analyze, you agree to commit to the process.</p>
        </div>
    );
};
