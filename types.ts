export interface SkillGapAnalysis {
  summary: string;
  matchingSkills: string[];
  missingSkills:string[];
}

export interface ProjectBrief {
  title: string;
  description: string;
  tasks: string[];
  readmeContent: string;
  repoStructure: string[];
}

export interface LearningResource {
  title: string;
  query: string;
  type: 'YouTube' | 'Article' | 'Course' | 'Documentation';
}

export interface LearningTopic {
  skill: string;
  resources: LearningResource[];
}

export interface CareerPlan {
  skillGapAnalysis: SkillGapAnalysis;
  projectBrief: ProjectBrief;
  learningRoadmap: {
    topics: LearningTopic[];
  };
}

export interface SavedPlan extends CareerPlan {
  id: string;
  title: string;
  createdAt: string;
  resume: string;
  jobDescription: string;
  completedResources?: Record<string, boolean>;
}

export interface InterviewQuestion {
  question: string;
  hint: string;
}

export interface InterviewPrep {
  technical: InterviewQuestion[];
  behavioral: InterviewQuestion[];
  situational: InterviewQuestion[];
}

export interface ResumeSuggestion {
  section: string;
  originalTextSnippet: string;
  suggestion: string;
}

export interface ResumeEnhancement {
  summary: string;
  suggestions: ResumeSuggestion[];
}