
export interface UserProfile {
  name: string;
  // Step 2: Passion & Niche
  passionBio: string;
  niche: string;
  // Step 3: Content Style
  contentStyles: string[];
  // Step 4: Experience
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  // Step 5: Goals
  primaryGoal: 'Monetization' | 'Audience Growth' | 'Personal Brand' | 'Community';
  // Step 6: Reality Check
  timeCommitment: string;
  productionConstraints: string[];
  geminiApiKey: string;
  // Legacy fields kept for compatibility or removal later
  language: string;
  region: string;
}

export interface VideoIdea {
  title: string;
  description: string;
  reasoning: string;
  impact: {
    views: string;
    engagement: string;
    subscribers: string;
  };
  // Made optional as the current AI service prompt doesn't strictly provide these
  videoType?: string;
  suggestedLength?: number;
  relatedTheme?: string;
  productionTips?: string[];
  thumbnailSuggestion?: string;
}

export interface ActionItem {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  category?: 'SEO' | 'Engagement' | 'Production' | 'Strategy';
}

export interface WeeklySchedule {
  day: string;
  activity: string;
  type?: 'Production' | 'Post' | 'Strategy';
}

export interface ChannelAnalysis {
  strengths: string[];
  weaknesses: string[];
  successfulConcept: {
    description: string;
    keyElements: string[];
  };
  strategicRecommendations?: {
    increase: Array<{ type: string; reason: string }>;
    decrease: Array<{ type: string; reason: string }>;
    posting: { frequency: string; times: string[]; length: string };
  };
  growthPlan?: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  videoIdeas: VideoIdea[];
  actionItems: ActionItem[];
  productionSchedule: WeeklySchedule[];
  seoTips: {
    descriptionTemplate?: string;
    tagSuggestions: string[];
    commentStrategy: string;
  };
}

export interface MockChannelStats {
  name: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  growthRate: string;
  avatarUrl?: string;
  channelUrl?: string;
  recentViewsTrend: number[];
}

export enum DocElementType {
  HEADING1 = 'HEADING1',
  HEADING2 = 'HEADING2',
  PARAGRAPH = 'PARAGRAPH',
  LIST_BULLET = 'LIST_BULLET',
  LIST_NUMBER = 'LIST_NUMBER',
  TABLE = 'TABLE',
  PAGE_BREAK = 'PAGE_BREAK',
}

export interface DocElement {
  id: string;
  type: DocElementType;
  content?: string;
  items?: string[];
  rows?: Array<{ cells: string[] }>;
}

export interface DocumentData {
  title: string;
  author: string;
  elements: DocElement[];
}
