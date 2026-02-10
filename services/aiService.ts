
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ChannelAnalysis } from "../types";

export const analyzeChannelAndGenerateIdeas = async (profile: UserProfile, stats: any): Promise<ChannelAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `أنت خبير نمو قنوات يوتيوب (YouTube Growth Architect). 
  مهمتك هي إجراء تحليل عميق وشامل لبيانات القناة الحقيقية الموفرة.
  يجب أن تكون إجابتك بصيغة JSON دقيقة جداً وباللغة العربية.
  البيانات التي تعمل عليها هي حقيقية للقناة: "${stats.name}" والتي تملك ${stats.subscribers} مشترك و ${stats.videoCount} فيديو.
  يجب أن تكون الأفكار "Video Ideas" مبتكرة، غير تقليدية، ومبنية على تحليل سيكولوجية الجمهور في مجال ${profile.contentType}.
  تجنب النصوص العامة، كن دقيقاً في نصائح السيو والجدول الزمني.`;

  const prompt = `
    قم بإجراء "تشريح استراتيجي" لقناة يوتيوب التالية بناءً على بياناتها:
    - الاسم: ${stats.name}
    - عدد المشتركين: ${stats.subscribers}
    - إجمالي المشاهدات: ${stats.totalViews}
    - عدد الفيديوهات المنشورة: ${stats.videoCount}
    
    معلومات المستخدم:
    - لغة المحتوى: ${profile.language}
    - الجمهور المستهدف: ${profile.targetAudience}
    - الأهداف المطلوبة: ${profile.goals.join(', ')}
    - التحديات الحالية: ${profile.challenges.join(', ')}
    - الموارد المتاحة: ${profile.resources.join(', ')}

    المطلوب في ملف الـ JSON:
    1. نقاط القوة (Strengths) والضعف (Weaknesses) بناءً على أرقام القناة.
    2. مفهوم النجاح (Successful Concept): وصف لاستراتيجية المحتوى.
    3. 10 أفكار فيديوهات (Video Ideas): كل فكرة يجب أن تحتوي على (العنوان، الوصف، سبب النجاح، والتأثير المتوقع).
    4. إجراءات فورية (Action Items): مهام تقنية وبرمجية.
    5. جدول إنتاج (Production Schedule): جدول أسبوعي دقيق.
    6. سيو (SEO): كلمات مفتاحية ذهبية واستراتيجية للتعامل مع التعليقات.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 8000, 
        thinkingConfig: { thinkingBudget: 4000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            successfulConcept: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                keyElements: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["description", "keyElements"]
            },
            videoIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  impact: {
                    type: Type.OBJECT,
                    properties: {
                      views: { type: Type.STRING },
                      engagement: { type: Type.STRING },
                      subscribers: { type: Type.STRING }
                    },
                    required: ["views", "engagement", "subscribers"]
                  }
                },
                required: ["title", "description", "reasoning", "impact"]
              }
            },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["task", "priority"]
              }
            },
            productionSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  activity: { type: Type.STRING }
                },
                required: ["day", "activity"]
              }
            },
            seoTips: {
              type: Type.OBJECT,
              properties: {
                tagSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                commentStrategy: { type: Type.STRING }
              },
              required: ["tagSuggestions", "commentStrategy"]
            }
          },
          required: ["strengths", "weaknesses", "successfulConcept", "videoIdeas", "actionItems", "productionSchedule", "seoTips"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty response");
    
    return JSON.parse(text.trim()) as ChannelAnalysis;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};
