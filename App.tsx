
import React, { useState } from 'react';
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

const MOCK_CHANNELS: MockChannelStats[] = [
  { 
    name: 'تكنولوجيا المستقبل (عينة)', 
    subscribers: 24500, 
    totalViews: 1200000, 
    videoCount: 142, 
    growthRate: '+15%',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    channelUrl: 'https://youtube.com/@samplechannel',
    recentViewsTrend: [40, 55, 45, 70, 65, 80, 75]
  }
];

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'onboarding' | 'connect' | 'advanced-connect' | 'analyzing' | 'dashboard'>('welcome');
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'ideas' | 'production' | 'settings'>('overview');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    contentType: '',
    targetAudience: '',
    language: 'Arabic',
    region: '',
    goals: [],
    postingFrequency: '',
    videoLength: '',
    experienceLevel: '',
    resources: [],
    challenges: [],
    ideaPreference: ''
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

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-base mb-1 ${
        activeTab === id 
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
        {/* Sidebar - Compact */}
        <aside className="w-[260px] bg-neutral-950 border-l border-neutral-900 flex flex-col p-6 fixed right-0 top-0 h-full z-20">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-glow"><BrainCircuit size={24} /></div>
            <span className="text-xl font-black tracking-tight uppercase">TubeArchitect</span>
          </div>

          <nav className="flex-1">
            <SidebarItem id="overview" icon={LayoutDashboard} label="الرئيسية" />
            <SidebarItem id="strategy" icon={Target} label="الاستراتيجية" />
            <SidebarItem id="ideas" icon={Lightbulb} label="أفكار المحتوى" />
            <SidebarItem id="production" icon={Calendar} label="جدول الإنتاج" />
            <div className="my-6 border-t border-neutral-900"></div>
            <SidebarItem id="settings" icon={Settings} label="الإعدادات" />
          </nav>

          <div className="mt-auto">
            <div className="bg-neutral-900 p-4 rounded-2xl mb-4 border border-neutral-800">
               <div className="flex items-center gap-2 mb-3">
                  <Languages size={16} className="text-red-500" />
                  <span className="font-bold text-xs text-neutral-400 uppercase">اللغة</span>
               </div>
               <select className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded-lg font-bold text-sm outline-none">
                  <option>العربية</option>
                  <option>English</option>
               </select>
            </div>
            <button onClick={() => setStep('welcome')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 font-bold hover:bg-red-950/30 hover:text-red-500 transition-all text-sm">
              <LogOut size={18} />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </aside>

        {/* Content Area - Scaled Down */}
        <main className="flex-1 pr-[260px] pb-12">
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
               <div className="h-10 w-10 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-red-500 cursor-pointer transition-all">
                  <Bell size={20} />
               </div>
            </div>
          </header>

          <div className="p-8 max-w-6xl mx-auto space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Compact Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                {/* Identity Card - More Sleek */}
                <div className="bg-neutral-900 rounded-[2.5rem] border border-neutral-800 p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-emerald-600 to-amber-600"></div>
                  <div className="shrink-0 relative">
                    <img src={selectedChannel.avatarUrl} className="w-32 h-32 rounded-3xl border-2 border-neutral-800 shadow-2xl group-hover:scale-105 transition-transform" alt="" />
                    <div className="absolute -bottom-3 -right-3 bg-red-600 text-white p-2 rounded-xl shadow-lg"><Youtube size={16} /></div>
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="text-3xl font-black mb-3">{selectedChannel.name}</h3>
                    <p className="text-lg text-neutral-400 font-bold mb-6">قناتك في مسار <span className="text-emerald-500">تصاعدي {selectedChannel.growthRate}</span> بناءً على الخوارزميات الحالية.</p>
                    <a href={selectedChannel.channelUrl} target="_blank" className="inline-flex items-center gap-2 text-red-500 font-black text-sm bg-red-500/10 px-5 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      معاينة القناة <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

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
                  
                  <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-800">
                     <h3 className="text-xl font-black mb-8 text-right">تحليل الـ SEO الذكي</h3>
                     <div className="flex flex-wrap gap-2 justify-end mb-8">
                        {analysis.seoTips.tagSuggestions.map(tag => (
                          <span key={tag} className="bg-red-600/10 text-red-500 px-4 py-2 rounded-lg text-sm font-black border border-red-500/20">#{tag}</span>
                        ))}
                     </div>
                     <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-800 text-right">
                        <p className="text-red-500 font-black text-sm mb-2 italic">نصيحة التفاعل:</p>
                        <p className="text-neutral-400 font-bold text-sm">"{analysis.seoTips.commentStrategy}"</p>
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
                    <div className="pt-4 border-t border-neutral-800 text-right">
                       <p className="text-[10px] font-black text-neutral-400 mb-1 uppercase">Reasoning</p>
                       <p className="text-xs text-neutral-500 italic leading-relaxed">{idea.reasoning}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Production Tab - REFINED & COMPACT */}
            {activeTab === 'production' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                <div className="lg:col-span-8">
                   <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-800">
                      <h3 className="text-xl font-black mb-8 text-right flex items-center gap-2 justify-end">جدول الأسبوع <Calendar size={20} className="text-red-600" /></h3>
                      <div className="space-y-3">
                         {analysis.productionSchedule.map((day, i) => (
                           <div key={i} className="flex items-center gap-6 bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex-row-reverse hover:bg-neutral-900 transition-all group">
                             <div className="w-12 text-center shrink-0">
                               <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter">{day.day}</p>
                             </div>
                             <div className="h-8 w-px bg-neutral-800"></div>
                             <div className="text-right flex-1">
                               <p className="text-sm font-black text-neutral-300 group-hover:text-white transition-colors">{day.activity}</p>
                             </div>
                             <Clock size={16} className="text-neutral-700 group-hover:text-red-500 transition-colors" />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-4">
                   <div className="bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-800 text-right">
                      <h3 className="text-lg font-black mb-6 flex items-center gap-2 justify-end">مهام فنية <ListChecks size={18} className="text-amber-500" /></h3>
                      <div className="space-y-3">
                         {analysis.actionItems.map((item, i) => (
                           <div key={i} className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-amber-900 transition-all">
                             <p className="text-sm font-black text-neutral-300 mb-2">{item.task}</p>
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.priority === 'High' ? 'bg-red-950 text-red-500' : 'bg-neutral-800 text-neutral-400'}`}>
                               {item.priority}
                             </span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
               <div className="max-w-2xl mx-auto bg-neutral-900 p-12 rounded-[3rem] border border-neutral-800 text-right animate-in fade-in duration-500">
                  <h3 className="text-2xl font-black mb-10 flex items-center gap-3 justify-end">الإعدادات <User size={24} className="text-neutral-500" /></h3>
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-neutral-500 block pr-2">اسم المستخدم</label>
                        <input type="text" value={selectedChannel.name} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-bold outline-none focus:border-red-600 transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-neutral-500 block pr-2">البريد الإلكتروني</label>
                        <input type="email" placeholder="example@studio.ai" className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-bold outline-none focus:border-red-600 transition-all" />
                     </div>
                     <button className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-lg hover:bg-red-700 transition-all shadow-xl">حفظ التغييرات</button>
                  </div>
               </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-[#050505] text-white overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 blur-[120px] rounded-full"></div>
      <div className="bg-red-600 p-10 rounded-[3rem] mb-10 shadow-glow relative z-10 animate-bounce">
        <Youtube size={80} className="text-white" />
      </div>
      <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter relative z-10">TUBE <span className="text-red-600">ARCHITECT</span></h1>
      <p className="text-xl md:text-2xl text-neutral-500 mb-12 max-w-2xl font-bold leading-relaxed relative z-10">محرك الذكاء الاصطناعي الأقوى لتفكيك خوارزميات يوتيوب وبناء قنوات المليون مشترك.</p>
      <button 
        onClick={() => setStep('onboarding')}
        className="flex items-center gap-4 bg-white text-black px-12 py-5 rounded-2xl font-black text-2xl hover:bg-red-600 hover:text-white transition-all shadow-2xl relative z-10 group"
      >
        بدء الهندسة العكسية <ArrowRight size={28} className="group-hover:translate-x-[-8px] transition-transform" />
      </button>
    </div>
  );

  const renderOnboarding = () => {
    const questions = [
      { title: "ما هو مجالك؟", key: 'contentType', options: ['تعليمي', 'ترفيهي', 'تقني', 'ألعاب', 'أخرى'] },
      { title: "ما هو هدفك؟", key: 'goals', multiple: true, options: ['مشتركين', 'مشاهدات', 'أرباح', 'براند'] },
      { title: "أكبر تحدي؟", key: 'challenges', multiple: true, options: ['نقص المشاهدات', 'توقف النمو', 'ضيق الوقت', 'الأفكار'] },
    ];
    const currentQ = questions[onboardingStep];
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 min-h-screen flex items-center">
        <div className="bg-neutral-950 p-12 rounded-[3rem] shadow-2xl border border-neutral-900 text-right w-full">
          <div className="h-1.5 w-full bg-neutral-900 rounded-full mb-10 overflow-hidden">
            <div className="h-full bg-red-600 transition-all duration-700" style={{ width: `${((onboardingStep + 1) / questions.length) * 100}%` }}></div>
          </div>
          <h2 className="text-4xl font-black mb-10">{currentQ.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map(opt => {
              const isSelected = currentQ.multiple 
                ? (profile[currentQ.key as keyof UserProfile] as string[]).includes(opt)
                : profile[currentQ.key as keyof UserProfile] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (currentQ.multiple) {
                      const currentArr = (profile[currentQ.key as keyof UserProfile] as string[]);
                      const nextArr = currentArr.includes(opt) ? currentArr.filter(a => a !== opt) : [...currentArr, opt];
                      setProfile(prev => ({ ...prev, [currentQ.key]: nextArr }));
                    } else {
                      setProfile(prev => ({ ...prev, [currentQ.key]: opt }));
                    }
                  }}
                  className={`p-6 rounded-2xl border-2 text-right font-bold text-xl transition-all ${
                    isSelected ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-neutral-900 text-neutral-500 hover:border-neutral-700'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <div className="mt-16 flex justify-between items-center flex-row-reverse">
             <button onClick={() => onboardingStep < questions.length - 1 ? setOnboardingStep(prev => prev + 1) : setStep('connect')} className="bg-white text-black px-10 py-4 rounded-xl font-black text-xl hover:bg-red-600 hover:text-white transition-all">استمرار</button>
            <button onClick={() => setOnboardingStep(prev => Math.max(0, prev - 1))} disabled={onboardingStep === 0} className="text-neutral-600 font-bold hover:text-white transition-all">رجوع</button>
          </div>
        </div>
      </div>
    );
  };

  const renderConnect = () => (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center min-h-screen flex flex-col items-center justify-center">
      <div className="mb-10 bg-red-600 p-8 rounded-[2.5rem] text-white shadow-glow">
        <LinkIcon size={64} />
      </div>
      <h2 className="text-5xl font-black mb-6">ربط البيانات</h2>
      <p className="text-xl text-neutral-500 mb-16 font-bold">نحتاج لربط القناة للحصول على الإحصائيات الحقيقية.</p>
      
      <div className="w-full space-y-6">
        <button onClick={() => setStep('advanced-connect')} className="w-full bg-neutral-950 border-2 border-red-600 p-8 rounded-[2rem] text-white hover:bg-red-600 transition-all group flex flex-col items-center gap-4">
           <Settings size={32} className="group-hover:rotate-90 transition-transform duration-500" />
           <span className="text-2xl font-black">استخدام YouTube API</span>
        </button>

        <div className="flex items-center gap-6 opacity-20 py-6">
          <div className="h-px bg-white flex-1"></div>
          <span className="text-sm font-bold uppercase tracking-widest">OR</span>
          <div className="h-px bg-white flex-1"></div>
        </div>

        {MOCK_CHANNELS.map(ch => (
          <button key={ch.name} onClick={() => handleConnectChannel(ch)} className="w-full bg-neutral-900 p-6 rounded-2xl flex items-center justify-between flex-row-reverse border border-neutral-800 hover:border-neutral-600 transition-all">
            <div className="flex items-center gap-4 flex-row-reverse">
              <img src={ch.avatarUrl} className="w-14 h-14 rounded-xl border border-neutral-800" alt="" />
              <div className="text-right">
                <p className="font-black text-lg">{ch.name}</p>
                <p className="text-red-500 text-xs font-bold">{ch.subscribers.toLocaleString()} مشترك</p>
              </div>
            </div>
            <ChevronRight className="text-neutral-700" size={24} />
          </button>
        ))}
      </div>
    </div>
  );

  const renderAdvancedConnect = () => (
    <div className="max-w-2xl mx-auto p-12 mt-24 bg-neutral-950 rounded-[3rem] border border-neutral-900 text-right shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      <h2 className="text-4xl font-black mb-4">هوية الـ API</h2>
      <p className="text-lg text-neutral-500 font-bold mb-10">أدخل البيانات لتشغيل محرك التحليل.</p>
      
      {error && (
        <div className="mb-8 p-6 bg-red-950/30 border border-red-900 rounded-2xl flex items-center gap-4 flex-row-reverse text-red-500">
          <AlertCircle size={24} className="shrink-0" />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); fetchRealYouTubeData(customChannel.channelId, customChannel.apiKey); }} className="space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-black text-neutral-400 block pr-2 uppercase">Channel ID</label>
          <input required type="text" value={customChannel.channelId} onChange={e => setCustomChannel({...customChannel, channelId: e.target.value})} className="w-full p-5 bg-neutral-900 border border-neutral-800 rounded-2xl outline-none focus:border-red-600 text-right font-bold text-lg transition-all" placeholder="UC..." />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-neutral-400 block pr-2 uppercase">API Key</label>
          <input required type="password" value={customChannel.apiKey} onChange={e => setCustomChannel({...customChannel, apiKey: e.target.value})} className="w-full p-5 bg-neutral-900 border border-neutral-800 rounded-2xl outline-none focus:border-red-600 text-right font-mono text-lg transition-all" placeholder="AIza..." />
        </div>
        
        <div className="bg-neutral-900 p-6 rounded-2xl flex items-start gap-4 flex-row-reverse border border-neutral-800">
          <ShieldCheck className="text-emerald-500 shrink-0 mt-1" size={24} />
          <p className="text-xs text-neutral-400 leading-relaxed font-bold">بياناتك محمية ومشفرة، نستخدمها فقط لجلب الإحصائيات العامة للقناة.</p>
        </div>

        <button type="submit" disabled={isLoadingStats} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
          {isLoadingStats ? <Loader2 size={32} className="animate-spin" /> : "تحليل القناة الآن"}
        </button>
      </form>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#050505]">
      <div className="relative mb-16">
         <div className="absolute inset-0 bg-red-600/20 blur-[60px] rounded-full animate-pulse"></div>
         <div className="bg-neutral-950 p-16 rounded-[4rem] border border-neutral-800 relative z-10">
            <BrainCircuit size={100} className="text-red-600 animate-spin-slow" />
         </div>
      </div>
      <h2 className="text-5xl font-black mb-6">هندسة الخوارزميات</h2>
      <p className="text-xl text-neutral-500 mb-12 font-bold">يتم الآن دمج بيانات قناتك مع Gemini 3 Pro لإنتاج أفضل استراتيجية.</p>
      <div className="w-full max-w-md h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-red-600 animate-progress-loading w-full origin-left"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <main>
        {step === 'welcome' && renderWelcome()}
        {step === 'onboarding' && renderOnboarding()}
        {step === 'connect' && renderConnect()}
        {step === 'advanced-connect' && renderAdvancedConnect()}
        {step === 'analyzing' && renderAnalyzing()}
        {step === 'dashboard' && renderDashboard()}
      </main>
      <style>{`
        @keyframes progress-loading {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress-loading {
          animation: progress-loading 6s ease-in-out forwards;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shadow-glow {
          box-shadow: 0 0 30px rgba(255, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};
export default App;
