import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { LandingPage } from './components/LandingPage';
import {
  Youtube,
  Target,
  Users,
  Video,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Settings,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Zap,
  ExternalLink,
  Search,
  Clock,
  ListChecks,
  AlertCircle,
  Link as LinkIcon,
  Calendar,
  Key,
  BarChart3,
  TrendingUp,
  Download,
  Info,
  Lightbulb,
  LayoutDashboard,
  Languages,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { UserProfile, ChannelAnalysis, MockChannelStats } from './types';
import { analyzeChannelAndGenerateIdeas } from './services/aiService';
import { exportStrategyToDocx } from './services/docxService';
import { OnboardingLayout } from './components/onboarding/OnboardingLayout';
import { StepIdentity } from './components/onboarding/StepIdentity';
import { StepPassion } from './components/onboarding/StepPassion';
import { StepStyle } from './components/onboarding/StepStyle';
import { StepExperience } from './components/onboarding/StepExperience';
import { StepGoals } from './components/onboarding/StepGoals';
import { StepReality } from './components/onboarding/StepReality';
import { StepCommitment } from './components/onboarding/StepCommitment';

const MOCK_CHANNELS: MockChannelStats[] = [];

const AppContent: React.FC = () => {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<'welcome' | 'onboarding' | 'connect' | 'advanced-connect' | 'analyzing' | 'dashboard'>('welcome');
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'ideas' | 'production' | 'settings'>('overview');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 0. Handle Missing Configuration (Vercel Env Vars)
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center" dir="rtl">
        <div className="bg-red-600/10 border border-red-600/20 p-12 rounded-[3rem] max-w-2xl glow-red">
          <AlertCircle size={80} className="text-red-600 mx-auto mb-8" />
          <h1 className="text-4xl font-black mb-6">تنبيه: الكريدنشلز مفقودة!</h1>
          <p className="text-xl text-neutral-400 font-bold leading-relaxed mb-8">
            يبدو أنك قمت برفع الموقع على Vercel ولكنك لم تقم بإضافة "متغيرات البيئة" (Environment Variables) الخاصة بـ Supabase.
            <br /><br />
            بدون هذه المتغيرات، لا يمكن للموقع الاتصال بقاعدة البيانات وسيفشل في العمل.
          </p>
          <div className="space-y-4 text-right bg-black/40 p-6 rounded-2xl border border-white/5">
            <p className="font-bold text-red-500 underline uppercase tracking-widest text-xs mb-4">المتغيرات المطلوبة:</p>
            <code className="block text-sm text-neutral-500">VITE_SUPABASE_URL</code>
            <code className="block text-sm text-neutral-500">VITE_SUPABASE_ANON_KEY</code>
          </div>
          <p className="mt-10 text-sm text-neutral-600">قم بإضافتها في لوحة تحكم Vercel ثم أعد البناء (Redeploy).</p>
        </div>
      </div>
    );
  }

  // Force Welcome on Mount to ensure Landing Page is always the entry
  React.useEffect(() => {
    setStep('welcome');
  }, []);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.user_metadata?.full_name || '',
    passionBio: '',
    niche: '',
    contentStyles: [],
    experienceLevel: 'Beginner',
    primaryGoal: 'Audience Growth',
    timeCommitment: '',
    productionConstraints: [],
    language: 'Arabic',
    region: 'Global',
    // Legacy
    contentType: '', targetAudience: '', goals: [], postingFrequency: '', videoLength: '', resources: [], challenges: '', ideaPreference: ''
  });

  const [customChannel, setCustomChannel] = useState({
    name: '',
    channelId: '',
    apiKey: '',
    region: 'Global'
  });

  const [selectedChannel, setSelectedChannel] = useState<MockChannelStats | null>(null);
  const [analysis, setAnalysis] = useState<ChannelAnalysis | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load Profile from Supabase on Login
  React.useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          name: data.full_name || user?.user_metadata?.full_name || profile.name,
          passionBio: data.passion_bio || '',
          niche: data.niche || '',
          contentStyles: data.content_styles || [],
          experienceLevel: data.experience_level || 'Beginner',
          primaryGoal: data.primary_goal || 'Audience Growth',
          timeCommitment: data.time_commitment || '',
          productionConstraints: data.production_constraints || [],
          geminiApiKey: data.gemini_api_key || '',
          language: 'Arabic',
          region: 'Global',
          contentType: '', targetAudience: '', goals: [], postingFrequency: '', videoLength: '', resources: [], challenges: '', ideaPreference: ''
        });
      }
    };

    loadProfile();
  }, [user]);

  // Handle Loading Overlay for Auth State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Youtube size={24} className="text-red-600" />
          </div>
        </div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500 animate-pulse">TubeArchitect</p>
      </div>
    );
  }

  // CRITICAL: Force Landing Page if step is 'welcome'
  if (step === 'welcome') {
    return <LandingPage onEnterDashboard={() => {
      if (profile.niche && profile.passionBio) setStep('connect');
      else setStep('onboarding');
    }} />;
  }

  // If NOT authenticated and not on welcome, we should probably go back to welcome
  if (!user) {
    setStep('welcome');
    return null;
  }

  const fetchRealYouTubeData = async (channelId: string, apiKey: string) => {
    setIsLoadingStats(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      if (!data.items?.length) throw new Error("قناة غير موجودة");

      const channel = data.items[0];
      const stats: MockChannelStats = {
        name: channel.snippet.title,
        subscribers: parseInt(channel.statistics.subscriberCount) || 0,
        totalViews: parseInt(channel.statistics.viewCount) || 0,
        videoCount: parseInt(channel.statistics.videoCount) || 0,
        growthRate: 'بيانات حية',
        avatarUrl: channel.snippet.thumbnails.high.url,
        channelUrl: `https://youtube.com/channel/${channelId}`,
        recentViewsTrend: [30, 45, 40, 60, 55, 70, 65]
      };

      setSelectedChannel(stats);
      setStep('analyzing');
      const result = await analyzeChannelAndGenerateIdeas(profile, stats);
      setAnalysis(result);
      setStep('dashboard');
    } catch (err: any) {
      setError(err.message);
      setStep('advanced-connect');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleConnectChannel = async (channel: MockChannelStats) => {
    setSelectedChannel(channel);
    setStep('analyzing');
    try {
      const result = await analyzeChannelAndGenerateIdeas(profile, channel);
      setAnalysis(result);
      setStep('dashboard');
    } catch (e) {
      setError("خطأ في التحليل");
      setStep('connect');
    }
  };

  const handleOnboardingNext = async () => {
    if (onboardingStep < 6) {
      setOnboardingStep(prev => prev + 1);
    } else {
      // SAVE TO CRM
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: profile.name,
            passion_bio: profile.passionBio,
            niche: profile.niche,
            content_styles: profile.contentStyles,
            experience_level: profile.experienceLevel,
            primary_goal: profile.primaryGoal,
            time_commitment: profile.timeCommitment,
            production_constraints: profile.productionConstraints,
            gemini_api_key: profile.geminiApiKey,
            updated_at: new Date().toISOString()
          });
        if (error) {
          console.error("CRM Save Error:", error);
          setError("خطأ في حفظ البيانات في CRM");
        }
      }
      setStep('connect');
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(prev => prev - 1);
    } else {
      // Can't go back further than step 0 to welcome in this flow easily without logging out
      // Maybe just stay at step 0
    }
  };

  // Components

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-base mb-1 ${activeTab === id
        ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
        : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200'
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const renderDashboard = () => {
    if (!analysis || !selectedChannel) return null;
    return (
      <div className="flex min-h-screen bg-[#050505] text-neutral-200" dir="rtl">
        {/* Sidebar - Premium Glass */}
        <aside className="w-[280px] glass border-l border-white/5 flex flex-col p-8 fixed right-0 top-0 h-full z-20 shadow-2xl">
          <div className="flex items-center gap-4 mb-12 px-2 hover:scale-105 transition-transform cursor-pointer">
            <div className="bg-red-600 p-2.5 rounded-2xl text-white shadow-glow"><BrainCircuit size={28} /></div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Architect</span>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem id="overview" icon={LayoutDashboard} label="لوحة التحكم" />
            <SidebarItem id="strategy" icon={Target} label="الاستراتيجية" />
            <SidebarItem id="ideas" icon={Lightbulb} label="أفكار المحتوى" />
            <SidebarItem id="production" icon={Calendar} label="الجدول الزمني" />
            <div className="my-8 border-t border-white/5 opacity-50"></div>
            <SidebarItem id="settings" icon={Settings} label="الإعدادات الشخصية" />
          </nav>

          <div className="mt-auto">
            <div className="glass p-5 rounded-3xl mb-6 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-black text-white">{user.email?.[0].toUpperCase()}</div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-0.5">Premium Account</p>
                  <p className="text-xs font-bold text-neutral-300 truncate w-32">{user.email}</p>
                </div>
              </div>
            </div>
            <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-neutral-500 font-bold hover:bg-red-600/10 hover:text-red-500 transition-all text-sm active:scale-95">
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 pr-[260px] pb-12">
          {/* ... Header and Content Implementation (Same as before) ... */}
          {/* For brevity, reusing the existing dashboard structure but ensuring it uses `selectedChannel` and `analysis` state correctly */}
          <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-right">
                <h2 className="text-xl font-black">أهلاً، {selectedChannel.name}</h2>
                <p className="text-neutral-500 text-sm font-bold">تحليل ذكاء اصطناعي فائق</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={async () => {
                setIsExporting(true);
                const blob = await exportStrategyToDocx(analysis, selectedChannel);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `TubeArchitect_${selectedChannel.name}.docx`;
                a.click();
                setIsExporting(false);
              }} className="bg-white text-black px-5 py-2 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-xl">
                {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                تصدير PDF
              </button>
            </div>
          </header>

          <div className="p-8 max-w-6xl mx-auto space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Compact Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stats Cards */}
                  {[
                    { label: 'المشتركين', value: selectedChannel.subscribers.toLocaleString(), icon: Users, color: 'text-red-500', bg: 'bg-red-500/10' },
                    { label: 'فيديوهات', value: selectedChannel.videoCount, icon: Video, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'المشاهدات', value: selectedChannel.totalViews.toLocaleString(), icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 flex items-center gap-6 group hover:border-neutral-700 transition-all">
                      <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-500 font-bold text-xs uppercase mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black">{stat.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-neutral-900 rounded-[2.5rem] border border-neutral-800 p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-emerald-600 to-amber-600"></div>
                  <div className="shrink-0 relative">
                    <img src={selectedChannel.avatarUrl} className="w-32 h-32 rounded-3xl border-2 border-neutral-800 shadow-2xl group-hover:scale-105 transition-transform" alt="" />
                    <div className="absolute -bottom-3 -right-3 bg-red-600 text-white p-2 rounded-xl shadow-lg"><Youtube size={16} /></div>
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="text-3xl font-black mb-3">{selectedChannel.name}</h3>
                    <p className="text-lg text-neutral-400 font-bold mb-6">قناتك في مسار <span className="text-emerald-500">تصاعدي {selectedChannel.growthRate}</span> بناءً على الخوارزميات الحالية.</p>
                  </div>
                </div>
                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem]">
                    <h4 className="text-lg font-black text-emerald-500 mb-6 flex items-center gap-2 justify-end">عوامل القوة <TrendingUp size={20} /></h4>
                    <div className="space-y-3">
                      {analysis.strengths.map((s, i) => (
                        <div key={i} className="bg-neutral-950 p-4 rounded-2xl flex items-center gap-3 flex-row-reverse text-neutral-300 font-bold text-sm border border-neutral-800">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2.5rem]">
                    <h4 className="text-lg font-black text-red-500 mb-6 flex items-center gap-2 justify-end">نقاط الضعف <Zap size={20} /></h4>
                    <div className="space-y-3">
                      {analysis.weaknesses.map((w, i) => (
                        <div key={i} className="bg-neutral-950 p-4 rounded-2xl flex items-center gap-3 flex-row-reverse text-neutral-300 font-bold text-sm border border-neutral-800">
                          <AlertCircle size={16} className="text-red-500 shrink-0" /> {w}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* More Tab Content Implementations (Strategy, Ideas, Production, Settings) would go here similarly to previous App.tsx */}
            {activeTab === 'strategy' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-neutral-900 p-12 rounded-[3rem] border border-neutral-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[80px]"></div>
                  <h3 className="text-3xl font-black mb-8 flex items-center gap-3 justify-end text-white">الخلاصة الاستراتيجية <Target size={32} className="text-red-600" /></h3>
                  <p className="text-xl text-neutral-400 leading-relaxed font-bold mb-10 text-right">{analysis.successfulConcept.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysis.successfulConcept.keyElements.map((el, idx) => (
                      <div key={idx} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex items-center gap-3 flex-row-reverse">
                        <CheckCircle2 size={18} className="text-red-600" />
                        <span className="text-lg font-black">{el}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ideas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500">
                {analysis.videoIdeas.map((idea, i) => (
                  <div key={i} className="bg-neutral-900 p-8 rounded-[2rem] border border-neutral-800 hover:border-red-600 transition-all group">
                    <div className="flex justify-between items-center mb-6 flex-row-reverse">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-3 py-1 rounded-md">IDEA {i + 1}</span>
                      <span className="text-xs font-black text-emerald-500">+{idea.impact?.views} مشاهدة</span>
                    </div>
                    <h4 className="text-xl font-black mb-3 text-right group-hover:text-red-500 transition-colors">{idea.title}</h4>
                    <p className="text-neutral-500 text-sm font-bold mb-6 text-right leading-relaxed">{idea.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  const renderOnboarding = () => {
    const steps = [
      <StepIdentity profile={profile} setProfile={setProfile} />,
      <StepPassion profile={profile} setProfile={setProfile} />,
      <StepStyle profile={profile} setProfile={setProfile} />,
      <StepExperience profile={profile} setProfile={setProfile} />,
      <StepGoals profile={profile} setProfile={setProfile} />,
      <StepReality profile={profile} setProfile={setProfile} />,
      <StepCommitment profile={profile} />
    ];

    const canProceed = () => {
      switch (onboardingStep) {
        case 0: return profile.name.length > 0;
        case 1: return profile.passionBio.length > 10 && profile.niche.length > 0;
        case 2: return profile.contentStyles.length > 0;
        case 3: return true;
        case 4: return true;
        case 5: return profile.timeCommitment.length > 0;
        case 6: return true;
        default: return false;
      }
    };

    return (
      <OnboardingLayout
        currentStep={onboardingStep}
        totalSteps={7}
        onNext={handleOnboardingNext}
        onBack={handleOnboardingBack}
        isFirstStep={onboardingStep === 0}
        isLastStep={onboardingStep === 6}
        canProceed={canProceed()}
      >
        {steps[onboardingStep]}
      </OnboardingLayout>
    );
  };

  const renderConnect = () => (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center min-h-screen flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-14 relative group">
        <div className="absolute inset-0 bg-red-600/30 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity rounded-full"></div>
        <div className="bg-red-600 p-10 rounded-[3rem] text-white shadow-glow relative z-10 group-hover:scale-110 transition-transform">
          <Youtube size={80} strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="text-6xl font-black mb-8 leading-tight tracking-tighter">اربط محرك الـ <span className="text-red-600 italic underline decoration-red-600/30">Intelligence</span></h2>
      <p className="text-2xl text-neutral-500 font-bold mb-16 max-w-2xl leading-relaxed">
        لكي نقوم بالتحليل، نحتاج للاتصال ببيانات يوتيوب الرسمية. اختر الطريقة التي تفضلها للبدء.
      </p>

      <div className="w-full grid md:grid-cols-1 gap-8 max-w-2xl">
        <button
          onClick={() => setStep('advanced-connect')}
          className="card-premium p-10 rounded-[3rem] text-white hover:scale-[1.02] transition-all group flex flex-col items-center gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
          <div className="bg-neutral-900 p-5 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
            <Settings size={40} />
          </div>
          <div className="text-center">
            <span className="text-3xl font-black block mb-2">YouTube API Connect</span>
            <span className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Recommended for Real Data</span>
          </div>
        </button>

        {MOCK_CHANNELS.length > 0 && (
          <div className="space-y-4">
            {MOCK_CHANNELS.map(ch => (
              <button key={ch.name} onClick={() => handleConnectChannel(ch)} className="w-full bg-neutral-900/50 p-6 rounded-[2rem] flex items-center justify-between flex-row-reverse border border-white/5 hover:border-red-600/30 transition-all group">
                {/* ... */}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAdvancedConnect = () => (
    <div className="max-w-2xl mx-auto p-12 mt-24 bg-neutral-950 rounded-[3rem] border border-neutral-900 text-right shadow-2xl relative">
      {/* Same Advanced Connect Render ... */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      <h2 className="text-4xl font-black mb-4">هوية الـ API</h2>
      <p className="text-neutral-500 mb-8 font-bold text-sm">أدخل بيانات مفتاح Google Cloud الخاص بك لتمكين التحليل العميق.</p>

      <form onSubmit={(e) => { e.preventDefault(); fetchRealYouTubeData(customChannel.channelId, customChannel.apiKey); }} className="space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-black text-neutral-400 block pr-2 uppercase">ID القناة (Channel ID)</label>
          <input required type="text" value={customChannel.channelId} onChange={e => setCustomChannel({ ...customChannel, channelId: e.target.value })} placeholder="مثال: UCxxxxxxxxxxxx" className="w-full p-5 bg-neutral-900 border border-neutral-800 rounded-2xl outline-none focus:border-red-600 text-right font-bold text-lg transition-all" />
          <p className="text-[10px] text-neutral-600 font-bold pr-2">يمكنك العثور عليه في إعدادات يوتيوب المتقدمة</p>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-neutral-400 block pr-2 uppercase">مفتاح الـ API (Key)</label>
          <input required type="password" value={customChannel.apiKey} onChange={e => setCustomChannel({ ...customChannel, apiKey: e.target.value })} placeholder="أدخل مفتاح Google API" className="w-full p-5 bg-neutral-900 border border-neutral-800 rounded-2xl outline-none focus:border-red-600 text-right font-mono text-lg transition-all" />
        </div>

        {error && (
          <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 font-bold text-sm flex-row-reverse">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={isLoadingStats} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
          {isLoadingStats ? <Loader2 size={32} className="animate-spin" /> : "تحليل القناة الآن"}
        </button>
      </form>

      <button onClick={() => setStep('connect')} className="mt-8 text-neutral-500 hover:text-white transition-colors text-sm font-bold block mx-auto underline decoration-white/5">العودة للخيارات</button>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#050505]">
      <div className="relative mb-16">
        <BrainCircuit size={100} className="text-red-600 animate-spin-slow" />
      </div>
      <h2 className="text-5xl font-black mb-6">هندسة الخوارزميات</h2>
    </div>
  );

  // Initial view for Logged In User should be Onboarding or Dashboard
  // For now, let's default to Onboarding Flow if they just signed up / signed in
  // In a real app, we'd check if profile exists to skip onboarding
  // For MVP, we go: Onboarding -> Connect -> Dashboard

  return (
    <div className="min-h-screen">
      <main>
        {/* We map the 'step' state to the renders */}
        {/* We no longer call setStep during render */}

        {step === 'onboarding' && renderOnboarding()}
        {step === 'connect' && renderConnect()}
        {step === 'advanced-connect' && renderAdvancedConnect()}
        {step === 'analyzing' && renderAnalyzing()}
        {step === 'dashboard' && renderDashboard()}

        {/* If for some reason we are in an unknown step, fall back to onboarding if logged in */}
        {step !== 'welcome' && step !== 'onboarding' && step !== 'connect' && step !== 'advanced-connect' && step !== 'analyzing' && step !== 'dashboard' && user && renderOnboarding()}
      </main>
      <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-spin-slow { animation: spin 8s linear infinite; }
            .shadow-glow { box-shadow: 0 0 30px rgba(255, 0, 0, 0.4); }
          `}</style>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
