import { GoogleGenAI, Type } from "@google/genai";
import type { CareerPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const persona = "You are JobCraft AI, an expert career development assistant. Your goal is to help users bridge the gap between their current skills and the requirements of their target job by generating a practical, hands-on project and a personalized learning plan. Analyze the user's resume and the job description to provide a detailed, actionable plan in JSON format according to the provided schema.";

export const generateCareerPlan = async (resume: string, jobDescription: string): Promise<CareerPlan> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      skillGapAnalysis: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A brief, encouraging summary of the skill gap analysis." },
          matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills from the resume that match the job description." },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key skills from the job description missing in the resume." },
        },
        required: ["summary", "matchingSkills", "missingSkills"],
      },
      projectBrief: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy, relevant title for a 1-week starter project." },
          description: { type: Type.STRING, description: "A paragraph describing the project, its goals, and the skills it will demonstrate." },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 5-7 step-by-step tasks to complete the project." },
          readmeContent: { type: Type.STRING, description: "A complete README.md file content for the project, formatted in Markdown." },
          repoStructure: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of files and folders for the repository structure, formatted like a directory tree (e.g., 'src/components/Button.tsx')." },
        },
        required: ["title", "description", "tasks", "readmeContent", "repoStructure"],
      },
      learningRoadmap: {
        type: Type.OBJECT,
        properties: {
          topics: {
            type: Type.ARRAY,
            description: "A list of learning topics based on the missing skills.",
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING, description: "The missing skill to learn." },
                resources: {
                  type: Type.ARRAY,
                  description: "A list of 2-3 curated resources to learn the skill.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Title of the resource." },
                      query: { type: Type.STRING, description: "A concise, effective search query to find a resource for this topic." },
                      type: { type: Type.STRING, enum: ['YouTube', 'Article', 'Course', 'Documentation'], description: "The type of the resource." },
                    },
                    required: ["title", "query", "type"],
                  }
                }
              },
              required: ["skill", "resources"],
            }
          }
        },
        required: ["topics"],
      }
    },
    required: ["skillGapAnalysis", "projectBrief", "learningRoadmap"],
  };

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a career plan. Here is the user's resume and the target job description.\n\nRESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`,
    config: {
      systemInstruction: persona,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText) as CareerPlan;
};