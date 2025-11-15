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
  completedResources?: Record<string, boolean>;
}