import React from 'react';
import { ArrowRight, ArrowLeft, BrainCircuit } from 'lucide-react';

interface OnboardingLayoutProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    isFirstStep?: boolean;
    isLastStep?: boolean;
    children: React.ReactNode;
    canProceed: boolean;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    currentStep,
    totalSteps,
    onNext,
    onBack,
    isFirstStep,
    isLastStep,
    children,
    canProceed
}) => {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-red-600/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>

            <div className="w-full max-w-2xl z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2 text-neutral-500">
                        <BrainCircuit size={20} className="text-red-600" />
                        <span className="font-bold text-xs uppercase tracking-widest">TubeArchitect AI</span>
                    </div>
                    <div className="bg-neutral-900 rounded-full px-4 py-1 border border-neutral-800">
                        <span className="text-xs font-mono text-neutral-400">STEP {currentStep + 1}/{totalSteps}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-neutral-900 rounded-full mb-12 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Content */}
                <div className="min-h-[400px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between pt-8 border-t border-neutral-900">
                    <button
                        onClick={onBack}
                        disabled={isFirstStep}
                        className={`flex items-center gap-2 text-neutral-500 hover:text-white transition-all font-bold ${isFirstStep ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <button
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`flex items-center gap-3 bg-white text-black px-8 py-3 rounded-xl font-black text-lg transition-all items-center shadow-lg shadow-white/5 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                    >
                        {isLastStep ? 'Analyze Channel' : 'Continue'} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
