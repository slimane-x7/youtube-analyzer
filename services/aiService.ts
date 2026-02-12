
import { UserProfile, ChannelAnalysis } from "../types";

export const analyzeChannelAndGenerateIdeas = async (profile: UserProfile, stats: any): Promise<ChannelAnalysis> => {
  const apiKey = profile.geminiApiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;

  // Check for API Key
  if (!apiKey) {
    console.warn("⚠️ API Key is missing. Returning MOCK data for demonstration.");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

    return {
      strengths: [
        "هوية بصرية قوية ومتناسقة (Thumbnails & Branding)",
        "جودة إنتاج عالية (4K) وصوت نقي",
        "تفاعل جيد في الساعات الأولى من النشر"
      ],
      weaknesses: [
        "عناوين الفيديوهات تحتاج إلى إثارة أكثر (Clickbait خفيف)",
        "نقص في استخدام الـ Shorts لجلب ترافيك جديد",
        "إهمال الرد على التعليقات وتقليل التفاعل المجتمعي"
      ],
      successfulConcept: {
        description: `استراتيجية "المراجع الصريح": التركيز على مراجعات تقنية دقيقة وصادقة مع تجارب تحمل (Durability Tests) للأجهزة. الجمهور يثق في رأيك، لذا عزز هذا الجانب بقصص واقعية.`,
        keyElements: [
          "اختبارات التحمل القاسية",
          "مقارنة الأسعار المحلية",
          "نصائح الشراء الذكي",
          "البث المباشر للإجابة على الأسئلة"
        ]
      },
      videoIdeas: Array.from({ length: 4 }).map((_, i) => ({
        title: `أفضل 5 هواتف للألعاب في 2024 - هل تستحق الشراء؟ (الجزء ${i + 1})`,
        description: "مراجعة شاملة تركز على الأداء، الحرارة، والبطارية مع تجربة ألعاب ثقيلة مثل PUBG و Genshin Impact.",
        reasoning: "الهواتف الموجهة للألعاب ترند حالياً، والجمهور يبحث عن الأداء مقابل السعر.",
        impact: {
          views: "50K - 100K",
          engagement: "عالي جداً",
          subscribers: "+500"
        }
      })),
      actionItems: [
        { task: "تصميم قالب جديد للصور المصغرة يركز على المشاعر", priority: "High" },
        { task: "إنشاء جدول نشر ثابت (يومين في الأسبوع)", priority: "High" },
        { task: "البدء في سلسلة Shorts من كواليس التصوير", priority: "Medium" },
        { task: "تحديث وصف القناة والكلمات المفتاحية", priority: "Low" }
      ],
      productionSchedule: [
        { day: "السبت", activity: "كتابة السيناريو والبحث" },
        { day: "الأحد", activity: "تصوير الفيديو الرئيسي" },
        { day: "الاثنين", activity: "مونتاج مبدئي" },
        { day: "الثلاثاء", activity: "نشر الفيديو + الرد على التعليقات" },
        { day: "الأربعاء", activity: "تصوير 3 فيديوهات Shorts" },
        { day: "الخميس", activity: "بث مباشر (Q&A)" },
        { day: "الجمعة", activity: "راحة / تحليل النتائج" }
      ],
      seoTips: {
        tagSuggestions: ["مراجعات تقنية", "أفضل هواتف 2024", "ببجي موبايل", "تكنولوجيا", "اندرويد", "ايفون"],
        commentStrategy: "اطرح سؤالاً في نهاية الفيديو: 'ما هو هاتفك الحالي؟' وقم بالرد على أول 50 تعليق باستفاضة."
      }
    };
  }

  const systemInstruction = `أنت خبير نمو قنوات يوتيوب (YouTube Growth Architect). 
  مهمتك هي إجراء تحليل عميق وشامل لبيانات القناة الحقيقية الموفرة.
  يجب أن تكون إجابتك بصيغة JSON دقيقة جداً وباللغة العربية.
  البيانات التي تعمل عليها هي حقيقية للقناة: "${stats.name}" والتي تملك ${stats.subscribers} مشترك و ${stats.videoCount} فيديو.
  يجب أن تكون الأفكار "Video Ideas" مبتكرة، غير تقليدية، ومبنية على تحليل سيكولوجية الجمهور في مجال ${profile.niche}.
  تجنب النصوص العامة، كن دقيقاً في نصائح السيو والجدول الزمني.`;

  const prompt = `
    قم بإجراء "تشريح استراتيجي" لقناة يوتيوب التالية بناءً على بياناتها:
    - الاسم: ${stats.name}
    - عدد المشتركين: ${stats.subscribers}
    - إجمالي المشاهدات: ${stats.totalViews}
    - عدد الفيديوهات المنشورة: ${stats.videoCount}
    
    معلومات المستخدم:
    - لغة المحتوى: ${profile.language}
    - النيش (المجال): ${profile.niche}
    - التخصص الدقيق: ${profile.passionBio}
    - أسلوب المحتوى المفضل: ${profile.contentStyles.join(', ')}
    - المستوى الحالي: ${profile.experienceLevel}
    - الهدف الرئيسي: ${profile.primaryGoal}
    - الوقت المتاح: ${profile.timeCommitment}
    - تحديات الإنتاج: ${profile.productionConstraints.join(', ')}

    المطلوب في ملف الـ JSON:
    1. نقاط القوة (Strengths) والضعف (Weaknesses) بناءً على أرقام القناة.
    2. مفهوم النجاح (Successful Concept): وصف لاستراتيجية المحتوى.
    3. 10 أفكار فيديوهات (Video Ideas): كل فكرة يجب أن تحتوي على (العنوان، الوصف، سبب النجاح، والتأثير المتوقع).
    4. إجراءات فورية (Action Items): مهام تقنية وبرمجية.
    5. جدول إنتاج (Production Schedule): جدول أسبوعي دقيق.
    6. سيو (SEO): كلمات مفتاحية ذهبية واستراتيجية للتعامل مع التعليقات.
  `;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\n\n${prompt}` }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "AI API call failed");
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("AI returned empty response");

    return JSON.parse(text.trim()) as ChannelAnalysis;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};
