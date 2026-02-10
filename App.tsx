
import React, { useState, useEffect } from 'react';
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
  FileText,
  Languages,
  LogOut,
  User,
  MoreVertical,
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

      if (data.error) throw new Error(data.error.message || "خطأ في مفتاح API");
      if (!data.items || data.items.length === 0) throw new Error("لم يتم العثور على القناة.");

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
      setError("حدث خطأ في التحليل");
      setStep('connect');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all font-black text-xl mb-2 ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-[-8px]' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={24} />
      <span>{label}</span>
    </button>
  );

  const renderDashboard = () => {
    if (!analysis || !selectedChannel) return null;
    return (
      <div className="flex min-h-screen bg-[#F8FAFF]" dir="rtl">
        {/* Sidebar Fixed */}
        <aside className="w-[320px] bg-white border-l border-slate-100 flex flex-col p-8 fixed right-0 top-0 h-full z-20 shadow-2xl">
          <div className="flex items-center gap-4 mb-16 px-2">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg"><BrainCircuit size={32} /></div>
            <span className="text-3xl font-black tracking-tighter">TubeArchitect</span>
          </div>

          <nav className="flex-1">
            <SidebarItem id="overview" icon={LayoutDashboard} label="نظرة شاملة" />
            <SidebarItem id="strategy" icon={Target} label="الخطة الاستراتيجية" />
            <SidebarItem id="ideas" icon={Lightbulb} label="أفكار المحتوى" />
            <SidebarItem id="production" icon={Calendar} label="جدول الإنتاج" />
            <div className="my-8 border-t border-slate-50"></div>
            <SidebarItem id="settings" icon={Settings} label="الإعدادات" />
          </nav>

          <div className="mt-auto">
            <div className="bg-slate-50 p-6 rounded-3xl mb-6 border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <Languages size={20} className="text-blue-600" />
                  <span className="font-black text-slate-700">تغيير اللغة</span>
               </div>
               <select className="w-full bg-white border border-slate-200 p-3 rounded-xl font-bold outline-none">
                  <option>العربية (Arabic)</option>
                  <option>English</option>
               </select>
            </div>
            <button onClick={() => setStep('welcome')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-all">
              <LogOut size={24} />
              <span>خروج</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 pr-[320px] pb-24">
          {/* Top Bar Navigation */}
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 p-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-8">
               <div className="text-right">
                  <h2 className="text-2xl font-black text-slate-900">مرحباً، {selectedChannel.name} 👋</h2>
                  <p className="text-slate-400 font-bold">إليك تحليل قناتك المولد بـ AI اليوم</p>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <button onClick={async () => {
                 setIsExporting(true);
                 const blob = await exportStrategyToDocx(analysis, selectedChannel);
                 const url = URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = `استراتيجية_${selectedChannel.name}.docx`;
                 a.click();
                 setIsExporting(false);
               }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl">
                 {isExporting ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
                 تصدير التقرير
               </button>
               <div className="h-14 w-14 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-all">
                  <Bell size={28} />
               </div>
            </div>
          </header>

          <div className="p-12 max-w-7xl mx-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'المشتركين', value: selectedChannel.subscribers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'إجمالي الفيديوهات', value: selectedChannel.videoCount, icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'إجمالي المشاهدات', value: selectedChannel.totalViews.toLocaleString(), icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all">
                      <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <stat.icon size={32} />
                      </div>
                      <p className="text-slate-400 font-black text-xl mb-2">{stat.label}</p>
                      <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                {/* Main Identity Card */}
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-16 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                  <div className="relative z-10 shrink-0">
                    <div className="p-4 bg-white rounded-[3.5rem] shadow-3xl border-2 border-slate-50">
                      <img src={selectedChannel.avatarUrl} className="w-48 h-48 rounded-[3rem] object-cover" alt="" />
                    </div>
                  </div>
                  <div className="text-right flex-1 z-10">
                    <h3 className="text-5xl font-black text-slate-900 mb-6">{selectedChannel.name}</h3>
                    <p className="text-2xl text-slate-500 font-bold mb-10 leading-relaxed">
                      هذه القناة لديها إمكانيات نمو بنسبة <span className="text-blue-600">{selectedChannel.growthRate}</span> بناءً على نشاطك الأخير.
                    </p>
                    <div className="flex gap-4">
                       <a href={selectedChannel.channelUrl} target="_blank" className="flex items-center gap-3 text-blue-600 font-black text-xl bg-blue-50 px-8 py-4 rounded-2xl hover:bg-blue-100 transition-all">
                          زيارة القناة <ExternalLink size={24} />
                       </a>
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="bg-green-50/50 border-2 border-green-100 p-12 rounded-[4rem] shadow-sm">
                      <h4 className="text-3xl font-black text-green-700 mb-8 flex items-center gap-4 justify-end">نقاط القوة الحالية <TrendingUp size={32} /></h4>
                      <div className="space-y-6">
                        {analysis.strengths.map((s, i) => (
                          <div key={i} className="bg-white p-6 rounded-3xl flex items-center gap-4 flex-row-reverse text-slate-700 font-bold text-xl shadow-sm border border-green-100/50">
                            <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                            {s}
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="bg-red-50/50 border-2 border-red-100 p-12 rounded-[4rem] shadow-sm">
                      <h4 className="text-3xl font-black text-red-700 mb-8 flex items-center gap-4 justify-end">فرص التحسين (الثغرات) <Zap size={32} /></h4>
                      <div className="space-y-6">
                        {analysis.weaknesses.map((w, i) => (
                          <div key={i} className="bg-white p-6 rounded-3xl flex items-center gap-4 flex-row-reverse text-slate-700 font-bold text-xl shadow-sm border border-red-100/50">
                            <AlertCircle size={24} className="text-red-500 shrink-0" />
                            {w}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* Strategy Tab */}
            {activeTab === 'strategy' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-slate-900 text-white p-20 rounded-[5rem] shadow-3xl relative overflow-hidden">
                     <div className="relative z-10">
                        <h3 className="text-5xl font-black mb-10 flex items-center gap-4 justify-end">الرؤية الاستراتيجية <Target size={56} className="text-blue-400" /></h3>
                        <p className="text-3xl text-slate-300 leading-relaxed font-bold mb-14">{analysis.successfulConcept.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           {analysis.successfulConcept.keyElements.map((el, idx) => (
                             <div key={idx} className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 flex items-center gap-5 flex-row-reverse backdrop-blur-md">
                               <div className="bg-blue-600 p-3 rounded-2xl"><CheckCircle2 size={28} /></div>
                               <span className="text-2xl font-black">{el}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <Youtube size={600} className="absolute -bottom-40 -left-60 opacity-5" />
                  </div>

                  <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl">
                     <h3 className="text-4xl font-black text-slate-900 mb-12 flex items-center gap-4 justify-end">السيو المتقدم وكلمات التريند <Search size={40} className="text-blue-600" /></h3>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                           <p className="text-2xl font-black text-slate-500 pr-4">الكلمات الدلالية الذهبية:</p>
                           <div className="flex flex-wrap gap-4 justify-end">
                              {analysis.seoTips.tagSuggestions.map(tag => (
                                <span key={tag} className="bg-blue-600/10 text-blue-600 px-8 py-4 rounded-2xl text-xl font-black border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all">#{tag}</span>
                              ))}
                           </div>
                        </div>
                        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 text-right">
                           <p className="text-2xl font-black text-blue-600 mb-6">استراتيجية الرد على الجمهور:</p>
                           <p className="text-xl text-slate-700 font-bold leading-relaxed italic">"{analysis.seoTips.commentStrategy}"</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Ideas Tab */}
            {activeTab === 'ideas' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4 flex-row-reverse">
                   <h3 className="text-5xl font-black text-slate-900">مخزن الأفكار المبتكرة</h3>
                   <div className="bg-yellow-100 p-5 rounded-3xl text-yellow-600"><Lightbulb size={40} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {analysis.videoIdeas.map((idea, i) => (
                    <div key={i} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl hover:shadow-3xl hover:border-blue-200 transition-all group">
                      <div className="flex justify-between items-start mb-10 flex-row-reverse">
                         <span className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-lg shadow-lg">فكرة {i + 1}</span>
                         <div className="text-green-600 font-black text-lg bg-green-50 px-4 py-2 rounded-xl border border-green-100">توقع: {idea.impact?.views || "---"}</div>
                      </div>
                      <h4 className="text-3xl font-black mb-6 text-slate-900 text-right group-hover:text-blue-600 transition-colors">{idea.title}</h4>
                      <p className="text-slate-500 text-xl font-bold leading-relaxed mb-10 text-right">{idea.description}</p>
                      <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 text-right">
                         <p className="font-black text-blue-600 text-lg mb-2">لماذا هذه الفكرة؟</p>
                         <p className="text-slate-600 font-bold leading-relaxed italic">{idea.reasoning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Tab */}
            {activeTab === 'production' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="lg:col-span-8 space-y-12">
                   <div className="bg-white p-14 rounded-[5rem] border border-slate-100 shadow-2xl">
                      <h3 className="text-4xl font-black mb-12 flex items-center gap-4 justify-end">الجدول الأسبوعي المقترح <Calendar className="text-blue-600" size={40} /></h3>
                      <div className="grid grid-cols-1 gap-8">
                         {analysis.productionSchedule.map((day, i) => (
                           <div key={i} className="flex items-center gap-10 bg-slate-50 p-10 rounded-[3rem] flex-row-reverse border-r-[16px] border-blue-600 hover:bg-blue-50 transition-all group">
                             <div className="bg-white p-6 rounded-3xl text-blue-600 shadow-xl group-hover:scale-110 transition-transform">
                               <Clock size={40} />
                             </div>
                             <div className="text-right">
                               <p className="text-xl font-black text-slate-400 mb-2 uppercase tracking-widest">{day.day}</p>
                               <p className="text-3xl font-black text-slate-800 leading-tight">{day.activity}</p>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-4 space-y-12">
                   <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl text-right">
                      <h3 className="text-3xl font-black mb-10 flex items-center gap-4 justify-end">مهام فنية عاجلة <ListChecks className="text-orange-500" size={32} /></h3>
                      <div className="space-y-8">
                         {analysis.actionItems.map((item, i) => (
                           <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-blue-500 transition-all shadow-sm">
                             <p className="text-2xl font-black text-slate-800 mb-4">{item.task}</p>
                             <span className={`px-6 py-2 rounded-xl text-lg font-black ${item.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                               أولوية: {item.priority}
                             </span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* Settings Tab Placeholder */}
            {activeTab === 'settings' && (
               <div className="max-w-4xl mx-auto bg-white p-20 rounded-[5rem] shadow-2xl border border-slate-100 text-right animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-5xl font-black text-slate-900 mb-12 flex items-center gap-4 justify-end">إعدادات الحساب <User size={48} className="text-slate-400" /></h3>
                  <div className="space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="text-2xl font-black text-slate-700 block pr-4">اسم القناة الافتراضي</label>
                           <input type="text" value={selectedChannel.name} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-xl outline-none focus:border-blue-600" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-2xl font-black text-slate-700 block pr-4">المنطقة الزمنية</label>
                           <select className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-xl outline-none focus:border-blue-600">
                              <option>Riyadh (GMT+3)</option>
                              <option>Cairo (GMT+2)</option>
                           </select>
                        </div>
                     </div>
                     <div className="pt-10 border-t border-slate-100">
                        <button className="bg-blue-600 text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all active:scale-95">حفظ التعديلات</button>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center max-w-5xl mx-auto px-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[4rem] mb-12 shadow-[0_40px_100px_rgba(37,99,235,0.4)]">
        <Youtube size={120} className="text-white" />
      </div>
      <h1 className="text-8xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
        قناتك تحت المجهر بـ <span className="text-blue-600">AI</span>
      </h1>
      <p className="text-3xl text-slate-500 mb-16 max-w-4xl leading-relaxed font-medium">
        صمم استراتيجيات نمو مبنية على بيانات حقيقية من يوتيوب باستخدام Gemini 3 Pro.
      </p>
      <button 
        onClick={() => setStep('onboarding')}
        className="flex items-center gap-6 bg-blue-600 hover:bg-blue-700 text-white px-16 py-8 rounded-[3rem] font-black text-3xl transition-all shadow-3xl active:scale-95 group"
      >
        ابدأ هندسة قناتك الآن <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );

  const renderOnboarding = () => {
    const questions = [
      { title: "ما هو مجال محتواك الأساسي؟", key: 'contentType', options: ['تعليمي', 'ترفيهي', 'فلوقات', 'تقني', 'ألعاب', 'طبخ', 'أخرى'] },
      { title: "من هو جمهورك المستهدف؟", key: 'targetAudience', options: ['المراهقون', 'الشباب', 'البالغون', 'المحترفون', 'الجميع'] },
      { title: "ما هو هدفك الأساسي؟", key: 'goals', multiple: true, options: ['بناء جمهور متفاعل', 'زيادة المشتركين', 'تحقيق الربح المادي', 'بناء علامة تجارية شخصية'] },
      { title: "ما هو أكبر تحدي يواجهك؟", key: 'challenges', multiple: true, options: ['نقص المشاهدات', 'توقف نمو المشتركين', 'ضيق الوقت', 'صعوبة إيجاد أفكار'] },
    ];
    const currentQ = questions[onboardingStep];
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white p-16 rounded-[5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border border-slate-100 text-right">
          <div className="h-4 w-full bg-slate-100 rounded-full mb-12 overflow-hidden shadow-inner">
            <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${((onboardingStep + 1) / questions.length) * 100}%` }}></div>
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-12 leading-tight">{currentQ.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`p-10 rounded-[3rem] border-4 text-right font-black text-2xl transition-all flex justify-between items-center flex-row-reverse ${
                    isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xl shadow-blue-100' : 'border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {opt}
                  {isSelected && <CheckCircle2 size={40} className="text-blue-600" />}
                </button>
              );
            })}
          </div>
          <div className="mt-24 flex justify-between items-center">
             <button onClick={() => onboardingStep < questions.length - 1 ? setOnboardingStep(prev => prev + 1) : setStep('connect')} className="flex items-center gap-4 bg-slate-900 text-white px-16 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95"> استمرار <ChevronRight size={32} /> </button>
            <button onClick={() => setOnboardingStep(prev => Math.max(0, prev - 1))} disabled={onboardingStep === 0} className="px-12 py-6 text-slate-400 font-bold hover:text-slate-600 text-xl"> رجوع </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConnect = () => (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="mb-16 inline-flex bg-blue-600 p-16 rounded-[5rem] text-white shadow-[0_40px_100px_rgba(37,99,235,0.4)]">
        <LinkIcon size={120} />
      </div>
      <h2 className="text-7xl font-black text-slate-900 mb-10 tracking-tighter">دمج الهوية الرقمية</h2>
      <p className="text-3xl text-slate-500 mb-20 max-w-4xl mx-auto leading-relaxed font-medium">
        لنقوم بتحليل بياناتك الفعلية وصناعة استراتيجية نمو حقيقية 100%.
      </p>
      
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="bg-white border-[10px] border-blue-600 p-20 rounded-[6rem] shadow-[0_80px_180px_-40px_rgba(37,99,235,0.4)] transform hover:scale-[1.02] transition-all relative overflow-hidden">
           <div className="bg-blue-600 text-white w-32 h-32 rounded-[3.5rem] mx-auto flex items-center justify-center mb-12 shadow-3xl">
              <Settings size={64} />
           </div>
           <h3 className="text-5xl font-black text-slate-900 mb-8">لوحة الربط بالـ API</h3>
           <p className="text-2xl text-slate-500 mb-14 font-bold">هذه الخطوة تضمن جلب أرقامك الحقيقية من يوتيوب</p>
           <button 
             onClick={() => setStep('advanced-connect')}
             className="w-full bg-slate-900 text-white py-10 rounded-[3.5rem] font-black text-4xl hover:bg-blue-700 transition-all flex items-center justify-center gap-8 shadow-3xl active:scale-95"
           >
             إدخال الـ Channel ID والـ API <ChevronRight size={48} />
           </button>
        </div>

        <div className="flex items-center gap-12 opacity-30 py-10">
          <div className="h-2 bg-slate-300 flex-1 rounded-full"></div>
          <span className="font-black text-3xl text-slate-400">أو جرب مع قناة عينة</span>
          <div className="h-2 bg-slate-300 flex-1 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {MOCK_CHANNELS.map(ch => (
            <button key={ch.name} onClick={() => handleConnectChannel(ch)} className="bg-white p-12 rounded-[4rem] flex items-center justify-between flex-row-reverse border-4 border-slate-100 hover:border-blue-400 transition-all shadow-xl group">
              <div className="flex items-center gap-10 flex-row-reverse">
                <img src={ch.avatarUrl} className="w-24 h-24 rounded-[2rem] shadow-2xl group-hover:rotate-6 transition-transform" alt="" />
                <div className="text-right">
                  <p className="font-black text-3xl text-slate-900">{ch.name}</p>
                  <p className="text-blue-600 font-black text-xl">{ch.subscribers.toLocaleString()} مشترك</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300" size={48} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdvancedConnect = () => (
    <div className="max-w-5xl mx-auto p-24 mt-12 bg-white rounded-[7rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.2)] border-t-[20px] border-blue-600 text-right relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mt-32 opacity-30"></div>
      <div className="flex flex-col items-center mb-20 relative z-10">
         <div className="bg-blue-50 p-12 rounded-full text-blue-600 mb-10 shadow-inner">
            <Key size={80} />
         </div>
         <h2 className="text-7xl font-black text-slate-900">هوية الـ API</h2>
         <p className="text-3xl text-slate-400 font-bold mt-6 italic">اربط قناتك لترى إحصائياتك الحية الآن</p>
      </div>
      
      {error && (
        <div className="mb-14 p-10 bg-red-50 border-4 border-red-200 rounded-[3rem] flex items-center gap-8 flex-row-reverse text-red-600 shadow-xl">
          <AlertCircle size={48} className="shrink-0" />
          <p className="font-black text-3xl leading-snug">{error}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); fetchRealYouTubeData(customChannel.channelId, customChannel.apiKey); }} className="space-y-16 relative z-10">
        <div className="space-y-6">
          <label className="text-3xl font-black text-slate-700 block pr-6 uppercase tracking-wider">YouTube Channel ID</label>
          <input 
            required 
            type="text" 
            value={customChannel.channelId} 
            onChange={e => setCustomChannel({...customChannel, channelId: e.target.value})} 
            className="w-full p-10 bg-slate-50 border-4 border-slate-200 rounded-[3.5rem] outline-none focus:border-blue-600 text-right font-black text-3xl transition-all placeholder:text-slate-300 focus:bg-white shadow-inner" 
            placeholder="أدخل معرف القناة هنا" 
          />
        </div>
        <div className="space-y-6">
          <label className="text-3xl font-black text-slate-700 block pr-6 uppercase tracking-wider">YouTube Data API Key</label>
          <input 
            required 
            type="password" 
            value={customChannel.apiKey} 
            onChange={e => setCustomChannel({...customChannel, apiKey: e.target.value})} 
            className="w-full p-10 bg-slate-50 border-4 border-slate-200 rounded-[3.5rem] outline-none focus:border-blue-600 text-right font-mono text-3xl transition-all focus:bg-white shadow-inner" 
            placeholder="AIzaSy..." 
          />
        </div>
        
        <div className="bg-slate-900 p-14 rounded-[4rem] flex items-start gap-12 flex-row-reverse shadow-3xl">
          <ShieldCheck className="text-blue-400 shrink-0 mt-2" size={64} />
          <p className="text-2xl text-slate-300 leading-relaxed font-black">
            بمجرد النقر، سيتم جلب صورة قناتك وعدد فيديوهاتك الحقيقي لدمجها في الخطة الاستراتيجية.
          </p>
        </div>

        <div className="pt-10 space-y-10">
          <button 
            type="submit" 
            disabled={isLoadingStats}
            className="w-full bg-blue-600 text-white py-12 rounded-[4rem] font-black text-4xl shadow-3xl hover:bg-blue-700 transition-all flex items-center justify-center gap-8 active:scale-95 disabled:opacity-50"
          >
            {isLoadingStats ? <Loader2 size={64} className="animate-spin" /> : "تحليل القناة وبناء الـ Dashboard"}
          </button>
          <button type="button" onClick={() => setStep('connect')} className="w-full py-8 text-slate-400 font-bold text-3xl hover:text-slate-600">رجوع</button>
        </div>
      </form>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center max-w-5xl mx-auto px-4">
      <div className="bg-blue-600 p-24 rounded-[6rem] mb-20 shadow-[0_80px_200px_-30px_rgba(37,99,235,0.6)] animate-pulse relative">
        <BrainCircuit size={180} className="text-white" />
        <div className="absolute -top-10 -right-10 bg-yellow-400 p-8 rounded-[3rem] shadow-3xl animate-bounce"><Zap size={64} className="text-slate-900" /></div>
      </div>
      <h2 className="text-8xl font-black text-slate-900 mb-10 tracking-tighter leading-tight">جاري هندسة قناتك</h2>
      <p className="text-3xl text-slate-500 mb-16 leading-relaxed font-bold">
        نقوم بدمج إحصائياتك الحقيقية مع محرك Gemini 3 Pro لإنتاج استراتيجيات نمو دقيقة 100%.
      </p>
      <div className="w-full h-10 bg-slate-100 rounded-full overflow-hidden border-[12px] border-white shadow-3xl max-w-4xl relative">
        <div className="h-full bg-blue-600 animate-progress-loading w-full origin-left"></div>
      </div>
      <p className="mt-14 text-blue-600 font-black text-4xl animate-pulse italic">يتم الآن توليد أفكار المحتوى...</p>
    </div>
  );

  return (
    <div className="min-h-screen selection:bg-blue-100">
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
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress-loading {
          animation: progress-loading 7s ease-in-out forwards;
        }
        .shadow-3xl {
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};
export default App;
