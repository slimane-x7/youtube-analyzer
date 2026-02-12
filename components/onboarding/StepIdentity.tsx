import React from 'react';
import { UserProfile } from '../../types';

interface StepIdentityProps {
    profile: UserProfile;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const StepIdentity: React.FC<StepIdentityProps> = ({ profile, setProfile }) => {
    return (
        <div className="space-y-12 text-center animate-in fade-in zoom-in-95 duration-1000">
            <div className="space-y-4">
                <h2 className="text-7xl font-black tracking-tight text-white mb-2">أهلاً بك في رحاب الإبداع.</h2>
                <p className="text-3xl text-neutral-500 font-bold max-w-2xl mx-auto leading-relaxed">
                    يسعدنا انضمامك لأسرة <span className="text-red-600">TubeArchitect</span>. <br />
                    بماذا تود أن يناديك النظام خلال رحلة هندسة قناتك؟
                </p>
            </div>

            <div className="relative max-w-2xl mx-auto group">
                <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full bg-transparent border-b-4 border-neutral-900 text-center text-7xl font-black py-10 outline-none focus:border-red-600 transition-all placeholder:text-neutral-800 text-white"
                    autoFocus
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700"></div>
            </div>

            <p className="text-neutral-600 text-sm font-bold animate-pulse">اضغط "متابعة" للانتقال للخطوة التالية</p>
        </div>
    );
};
