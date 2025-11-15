
export interface SkillGapAnalysis {
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
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
  url: string;
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
