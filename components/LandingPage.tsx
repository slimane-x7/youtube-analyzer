import React from 'react';
import {
    Youtube,
    ArrowRight,
    Target,
    Zap,
    Lock,
    BrainCircuit,
    CheckCircle2,
    TrendingUp,
    Users,
    BarChart3,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
    onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
    const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, isLoading } = useAuth();
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [isSignUp, setIsSignUp] = React.useState(true);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [authLoading, setAuthLoading] = React.useState(false);
    const [authError, setAuthError] = React.useState<string | null>(null);

    const handleAction = () => {
        if (user) {
            onEnterDashboard();
        } else {
            setShowAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Cairo'] overflow-x-hidden selection:bg-red-600/30" dir="rtl">
            {/* Modal Overlay */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAuthModal(false)}></div>
                    <div className="relative glass p-10 md:p-12 rounded-[3rem] max-w-lg w-full glow-red animate-in zoom-in-95 duration-300 text-right border border-white/5">
                        <div className="flex justify-between items-center mb-10 flex-row-reverse">
                            <h2 className="text-4xl font-black">{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
                            <button onClick={() => setShowAuthModal(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <Zap size={24} />
                            </button>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setAuthError(null);
                            setAuthLoading(true);
                            try {
                                if (isSignUp) {
                                    await signUpWithEmail(email, password, name);
                                } else {
                                    await signInWithEmail(email, password);
                                }
                                setShowAuthModal(false);
                            } catch (err: any) {
                                setAuthError(err.message === 'Invalid login credentials' ? 'البيانات غير صحيحة' : err.message);
                            } finally {
                                setAuthLoading(false);
                            }
                        }} className="space-y-6">
                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-neutral-500 pr-2 uppercase tracking-widest">الاسم الكامل</label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="مثال: أحمد محمد"
                                        className="w-full bg-neutral-900/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-right font-bold"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-500 pr-2 uppercase tracking-widest">البريد الإلكتروني</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-neutral-900/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-right font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-500 pr-2 uppercase tracking-widest">كلمة المرور</label>
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-900/50 border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-right font-bold"
                                />
                            </div>

                            {authError && <p className="text-red-500 text-xs font-bold pr-2">{authError}</p>}

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-glow active:scale-95 disabled:opacity-50"
                            >
                                {authLoading ? <Loader2 className="animate-spin mx-auto" /> : (isSignUp ? 'بدء الرحلة الآن' : 'دخول الاستوديو')}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4 text-neutral-600">
                            <div className="h-px flex-1 bg-white/5"></div>
                            <span className="text-[10px] font-black uppercase">أو عبر</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>

                        <button
                            onClick={signInWithGoogle}
                            disabled={isLoading || authLoading}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            <Youtube className="text-red-600" size={20} />
                            المتابعة عبر Google
                        </button>

                        <p className="mt-8 text-sm font-bold text-neutral-500 text-center">
                            {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
                            <button onClick={() => setIsSignUp(!isSignUp)} className="text-red-500 mr-2 hover:underline">
                                {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                            </button>
                        </p>
                    </div>
                </div>
            )}
            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto z-50 relative">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-red-600 p-2 rounded-xl shadow-glow group-hover:scale-110 transition-transform"><Youtube size={24} className="text-white" /></div>
                    <span className="text-xl font-black tracking-tighter uppercase">TubeArchitect</span>
                </div>
                <button
                    onClick={handleAction}
                    className="glass px-8 py-2.5 rounded-xl font-black hover:bg-white/10 transition-all text-sm active:scale-95"
                >
                    {user ? 'دخول الاستوديو' : 'دخول المهندسين'}
                </button>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-48 px-4 text-center overflow-hidden">
                {/* Architectural Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-red-600/5 blur-[160px] rounded-full pointer-events-none animate-pulse"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Algorithm Intelligence 3.0</span>
                    </div>

                    <h1 className="text-8xl md:text-[12rem] font-black mb-12 leading-[0.8] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        قناتك.<br />
                        <span className="text-gradient-silver shimmer">محسنة هندسياً.</span>
                    </h1>

                    <p className="text-2xl md:text-4xl text-neutral-500 mb-16 max-w-4xl mx-auto leading-relaxed font-bold animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        نحن لا نصنع فيديوهات، نحن نهندس <span className="text-white italic">إمبراطوريات رقمية</span>.<br className="hidden md:block" />
                        حول قناتك من "محتوى" إلى <span className="text-red-600 underline decoration-red-600/20 underline-offset-8">آلة نمو</span> لا تتوقف.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <button
                            onClick={handleAction}
                            className="w-full sm:w-auto bg-red-600 text-white px-16 py-8 rounded-[2.5rem] font-black text-3xl hover:bg-red-700 transition-all shadow-glow flex items-center justify-center gap-6 group hover:scale-105 active:scale-95"
                        >
                            {user ? 'الذهاب للاستوديو' : 'دخول الاستوديو'} <ArrowRight className="group-hover:-translate-x-2 transition-transform" size={32} />
                        </button>
                    </div>
                </div>

                {/* Dashboard Studio Preview */}
                <div className="mt-32 relative max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur-2xl opacity-50"></div>
                    <div className="glass-heavy rounded-[3rem] p-4 relative border border-white/10 shadow-2xl animate-float">
                        <div className="bg-[#050505] rounded-[2.5rem] overflow-hidden aspect-video border border-white/5 relative">
                            {/* Terminal style header */}
                            <div className="h-10 bg-neutral-900/50 border-b border-white/5 flex items-center px-6 gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                                <span className="text-[10px] font-black text-neutral-600 mx-auto uppercase tracking-widest">Architect Studio // System.Analyze()</span>
                            </div>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale"></div>
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <BrainCircuit size={80} className="text-red-600 mx-auto mb-6 opacity-80" />
                                    <div className="space-y-2">
                                        <div className="h-1 w-48 bg-red-600/20 rounded-full mx-auto overflow-hidden">
                                            <div className="h-full bg-red-600 w-2/3 animate-shimmer"></div>
                                        </div>
                                        <p className="text-[10px] font-black text-red-600/40 uppercase tracking-widest">Processing Algorithm Data</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem / Agitation */}
            <section className="py-32 bg-neutral-950/50 border-y border-neutral-900 overflow-hidden relative">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-600/5 blur-[100px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-24 items-center">
                        <div className="animate-in slide-in-from-right duration-700">
                            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[1.1]">
                                هل تصنع المحتوى وتنتظر <span className="text-red-600">المعجزة</span>؟<br />
                                <span className="text-neutral-500 font-bold text-3xl">عذراً، الأمل ليس استراتيجية عمل.</span>
                            </h2>
                            <ul className="space-y-8">
                                {[
                                    { text: "تعب المونتاج يقابله 'صفر' مشاهدات حقيقية.", icon: Zap },
                                    { text: "خوارزمية يوتيوب تبدو عدواً بدلاً من شريك.", icon: BrainCircuit },
                                    { text: "تخبط في اختيار العناوين والصور المصغرة.", icon: Target },
                                    { text: "نشر مستمر بدون 'خارطة طريق' واضحة.", icon: BarChart3 }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-5 text-2xl font-bold text-neutral-300 group">
                                        <div className="bg-red-600/20 p-3 rounded-2xl text-red-500 group-hover:scale-110 transition-transform"><item.icon size={24} /></div>
                                        <span className="pt-1">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative group grayscale hover:grayscale-0 transition-all duration-700">
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-amber-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="card-premium p-10 rounded-[3rem] relative z-10">
                                <div className="space-y-8">
                                    <div className="h-6 w-3/4 bg-neutral-800 rounded-full animate-pulse"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="aspect-video bg-neutral-900 rounded-2xl border border-neutral-800"></div>
                                        <div className="aspect-video bg-neutral-900 rounded-2xl border border-neutral-800"></div>
                                    </div>
                                    <div className="h-24 bg-red-600/5 border border-red-600/20 rounded-2xl flex items-center justify-center">
                                        <span className="text-red-500 font-black text-xl">النمط العشوائي: فشل محقق</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution / How it Works */}
            <section className="py-40 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-28">
                        <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter">كيف تسيطر على <span className="text-red-600 italic">اللعبة</span>؟</h2>
                        <p className="text-2xl text-neutral-500 font-bold leading-relaxed">نظام "الهندسة العكسية" الذي يحول الفيديوهات إلى أصول رقمية تدر عليك الأرباح والمشاهدات.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                step: "01",
                                title: "التشريح الدقيق",
                                desc: "أقوم بتفكيك أداء فيديوهاتك وفيديوهات منافسيك لاستخراج 'البصمة الرابحة'.",
                                icon: Target
                            },
                            {
                                step: "02",
                                title: "بناء الخارطة",
                                desc: "أبني لك استراتيجية محتوى متكاملة تناسب شغفك وجدولك الزمني.",
                                icon: BrainCircuit
                            },
                            {
                                step: "03",
                                title: "السيطرة الكاملة",
                                desc: "أعطيك الأفكار والعناوين التي ستجعل خوارزمية يوتيوب تروج لك بنفسها.",
                                icon: TrendingUp
                            }
                        ].map((card, i) => (
                            <div key={i} className="card-premium p-12 rounded-[3.5rem] relative group hover:-translate-y-4">
                                <div className="text-9xl font-black text-white/5 absolute -top-10 -right-4 pointer-events-none select-none">{card.step}</div>
                                <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-glow transition-transform group-hover:rotate-12">
                                    <card.icon size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-6">{card.title}</h3>
                                <p className="text-neutral-400 text-lg leading-relaxed font-bold">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-24 bg-neutral-900 border-y border-neutral-800 text-center">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-black mb-12 flex items-center justify-center gap-3">
                        <Users className="text-emerald-500" />
                        صمم لصناع المحتوى الأذكياء
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Logos */}
                        <div className="text-2xl font-black text-white flex items-center justify-center gap-2"><Youtube /> CreatorClub</div>
                        <div className="text-2xl font-black text-white flex items-center justify-center gap-2"><BarChart3 /> VidData</div>
                        <div className="text-2xl font-black text-white flex items-center justify-center gap-2"><Zap /> ViralStorm</div>
                        <div className="text-2xl font-black text-white flex items-center justify-center gap-2"><Target /> NicheMaster</div>
                    </div>
                </div>
            </section>

            {/* The Offer */}
            <section className="py-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/5 pointer-events-none"></div>
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="glass p-16 md:p-24 rounded-[4rem] shadow-2xl relative border border-white/5 glow-red">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 px-8 py-2 rounded-full font-black text-sm uppercase tracking-tighter shadow-glow">Limited Access</div>
                        <h2 className="text-6xl md:text-8xl font-black mb-10 leading-tight">جاهز لـ <span className="italic">هندسة</span> مستقبلك؟</h2>
                        <p className="text-2xl text-neutral-400 mb-16 max-w-3xl mx-auto font-bold">
                            توقف عن كونه صانع محتوى عادياً. كن "مهندس خوارزميات". ابدأ التحليل الكامل لقناتك الآن مجاناً.
                        </p>

                        <button
                            onClick={handleAction}
                            className="w-full md:w-auto bg-white text-black px-16 py-7 rounded-3xl font-black text-3xl hover:bg-neutral-200 hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto active:scale-95"
                        >
                            <Youtube className="text-red-600" size={40} />
                            {user ? 'العودة لمشروعك' : 'ابدأ الهندسة الآن'}
                        </button>
                        <p className="mt-10 text-sm text-neutral-500 font-bold flex items-center justify-center gap-4">
                            <span><ShieldCheck size={16} className="inline ml-1 text-emerald-500" /> آمن 100%</span>
                            <span><CheckCircle2 size={16} className="inline ml-1 text-emerald-500" /> لا يتطلب باسوورد</span>
                            <span><Zap size={16} className="inline ml-1 text-emerald-500" /> نتائج فورية</span>
                        </p>
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center text-neutral-600 text-sm font-bold border-t border-neutral-900">
                <p>© 2026 TubeArchitect AI. All rights reserved.</p>
            </footer>
        </div>
    );
};
