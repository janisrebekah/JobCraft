import React, { useState } from 'react';
import type { CareerPlan } from '../types';
import { TargetIcon, CheckCircleIcon, XCircleIcon, GitHubIcon, FileCodeIcon, SearchIcon, YoutubeIcon, CopyIcon } from './Icons';

interface ResultsDisplayProps {
  plan: CareerPlan;
}

type Tab = 'gap' | 'project' | 'roadmap';

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<Tab>('gap');
  const { skillGapAnalysis, projectBrief, learningRoadmap } = plan;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(projectBrief.readmeContent).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const renderSkillGap = () => (
    <div className="space-y-6 animate-fade-in">
        <p className="text-slate-300 text-center bg-slate-900/50 p-4 rounded-lg">{skillGapAnalysis.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-bold text-lg text-green-400 mb-3">Matching Skills</h4>
                <ul className="space-y-2">{skillGapAnalysis.matchingSkills.map((s, i) => <li key={i} className="flex items-start text-sm bg-slate-900/50 p-2 rounded-md"><CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" /> {s}</li>)}</ul>
            </div>
            <div>
                <h4 className="font-bold text-lg text-red-400 mb-3">Missing Skills</h4>
                <ul className="space-y-2">{skillGapAnalysis.missingSkills.map((s, i) => <li key={i} className="flex items-start text-sm bg-slate-900/50 p-2 rounded-md"><XCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" /> {s}</li>)}</ul>
            </div>
      </div>
    </div>
  );

  const renderProjectBrief = () => (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h3 className="font-bold text-xl text-cyan-300">{projectBrief.title}</h3>
            <p className="text-slate-300 mt-1 text-sm">{projectBrief.description}</p>
        </div>
        <div>
            <h4 className="font-bold text-lg text-purple-300 mb-2">Project Tasks</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
                {projectBrief.tasks.map((task, i) => <li key={i} className="bg-slate-900/50 p-2 rounded-md">{task}</li>)}
            </ol>
        </div>
         <div>
            <h4 className="font-bold text-lg text-purple-300 mb-2">Suggested Repo Structure</h4>
            <pre className="bg-slate-900/50 p-4 rounded-lg text-xs text-slate-300 font-mono whitespace-pre-wrap"><code>{projectBrief.repoStructure.join('\n')}</code></pre>
        </div>
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-purple-300">README.md</h4>
                <button onClick={handleCopy} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors">
                    <CopyIcon className="w-3 h-3" />
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg prose prose-sm prose-invert max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: projectBrief.readmeContent.replace(/\n/g, '<br />') }} />
        </div>
    </div>
  );
  
  const renderLearningRoadmap = () => (
     <div className="space-y-4 animate-fade-in">
        {learningRoadmap.topics.map((topic, i) => (
            <details key={i} className="bg-slate-900/50 rounded-lg overflow-hidden" open>
                <summary className="font-semibold text-purple-300 p-4 cursor-pointer hover:bg-slate-900 transition-colors">
                    {topic.skill}
                </summary>
                <div className="p-4 border-t border-slate-700">
                    <ul className="space-y-3">
                        {topic.resources.map((res, j) => {
                            const searchUrl = res.type === 'YouTube'
                              ? `https://www.youtube.com/results?search_query=${encodeURIComponent(res.query)}`
                              : `https://www.google.com/search?q=${encodeURIComponent(res.query)}`;
                            
                            return (
                                <li key={j}>
                                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-cyan-300 hover:text-cyan-200 transition-colors group">
                                        {res.type === 'YouTube' 
                                            ? <YoutubeIcon className="w-5 h-5 text-red-500 flex-shrink-0" /> 
                                            : <SearchIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                                        <span className="flex-grow group-hover:underline">{res.title}</span>
                                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{res.type}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </details>
        ))}
    </div>
  );

  const tabs: { id: Tab, label: string; icon: React.ReactNode }[] = [
    { id: 'gap', label: 'Skill Gap', icon: <TargetIcon className="w-5 h-5" /> },
    { id: 'project', label: 'Starter Project', icon: <GitHubIcon className="w-5 h-5" /> },
    { id: 'roadmap', label: 'Learning Roadmap', icon: <FileCodeIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg animate-fade-in min-h-[400px]">
      <div className="flex border-b border-slate-700 mb-6">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2
                    ${activeTab === tab.id
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
            >
                {tab.icon}
                {tab.label}
            </button>
        ))}
      </div>
      <div>
        {activeTab === 'gap' && renderSkillGap()}
        {activeTab === 'project' && renderProjectBrief()}
        {activeTab === 'roadmap' && renderLearningRoadmap()}
      </div>
    </div>
  );
};

export default ResultsDisplay;