import React, { useState, useCallback, useEffect } from 'react';
import type { CareerPlan, SavedPlan } from './types';
import Header from './components/Header';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import Sidebar from './components/Sidebar';
import { RocketIcon, SpinnerIcon, FileTextIcon, BriefcaseIcon, CheckCircleIcon, LogoIcon } from './components/Icons';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [activeCompletedResources, setActiveCompletedResources] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const storedPlans = localStorage.getItem('jobcraft-ai-plans');
      if (storedPlans) {
        setSavedPlans(JSON.parse(storedPlans));
      }
    } catch (error) {
      console.error("Failed to load plans from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('jobcraft-ai-plans', JSON.stringify(savedPlans));
    } catch (error) {
      console.error("Failed to save plans to localStorage", error);
    }
  }, [savedPlans]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleGeneratePlan = useCallback(async () => {
    if (!resumeText || !jobDescription) return;

    setIsLoading(true);
    setError(null);
    setPlan(null);
    setActivePlanId(null);
    setActiveCompletedResources({});

    try {
      const result = await geminiService.generateCareerPlan(resumeText, jobDescription);
      setPlan(result);
    } catch (e: any) {
      setError(`An error occurred: ${e.message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescription]);

  const handleNewPlan = () => {
    setPlan(null);
    setActivePlanId(null);
    setActiveCompletedResources({});
    setResumeText('');
    setJobDescription('');
    setFileName('');
    setError(null);
  };

  const handleSavePlan = () => {
    if (!plan) return;

    const newSavedPlan: SavedPlan = {
      ...plan,
      id: Date.now().toString(),
      title: plan.projectBrief.title || 'Untitled Plan',
      createdAt: new Date().toISOString(),
      completedResources: activeCompletedResources,
    };

    setSavedPlans(prev => [newSavedPlan, ...prev]);
    setActivePlanId(newSavedPlan.id);
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
    if (activePlanId === id) {
      handleNewPlan();
    }
  };

  const handleLoadPlan = (id: string) => {
    const planToLoad = savedPlans.find(p => p.id === id);
    if (planToLoad) {
      setPlan(planToLoad);
      setActivePlanId(id);
      setActiveCompletedResources(planToLoad.completedResources || {});
      setResumeText('');
      setJobDescription('');
      setFileName('');
      setError(null);
    }
  };

  const handleUpdateCompletedResources = (newCompleted: Record<string, boolean>) => {
    setActiveCompletedResources(newCompleted);
    if (activePlanId) {
      setSavedPlans(prev => prev.map(p =>
        p.id === activePlanId
          ? { ...p, completedResources: newCompleted }
          : p
      ));
    }
  }

  const hasInputs = resumeText.trim().length > 0 && jobDescription.trim().length > 0;
  const isPlanSaved = activePlanId !== null && savedPlans.some(p => p.id === activePlanId);

  return (
    <div className="h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <Sidebar
          plans={savedPlans}
          activePlanId={activePlanId}
          onLoadPlan={handleLoadPlan}
          onDeletePlan={handleDeletePlan}
          onNewPlan={handleNewPlan}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 max-w-7xl mx-auto">
            {/* Input Column */}
            <div className="flex flex-col gap-6">
              <div className={`bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg`}>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
                  <FileTextIcon className="w-6 h-6 mr-3" />
                  Your Resume
                </h2>
                <p className="text-slate-400 mb-4 text-sm">
                  Paste your resume below or upload a .txt file.
                </p>
                <textarea
                  className="w-full h-40 bg-slate-900 border border-slate-600 rounded-md p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="Paste your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  aria-label="Resume text area"
                />
                {fileName && (
                  <div className="mt-2 text-sm text-slate-400 flex items-center animate-fade-in">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-400" />
                    <span>File loaded: <strong>{fileName}</strong></span>
                  </div>
                )}
                <div className="mt-4">
                  <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".txt,.md"
                      onChange={handleFileChange}
                  />
                  <label htmlFor="resume-upload" className="w-full sm:w-auto text-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                      Upload Resume File
                  </label>
                </div>

                <div className="mt-6 border-t border-slate-700 pt-6">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
                      <BriefcaseIcon className="w-6 h-6 mr-3" />
                      Target Job Description
                  </h2>
                  <p className="text-slate-400 mb-4 text-sm">
                    Paste the full job description for the role you're targeting.
                  </p>
                  <textarea
                    className="w-full h-40 bg-slate-900 border border-slate-600 rounded-md p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    aria-label="Job description text area"
                  />
                </div>
                
                <button
                  onClick={handleGeneratePlan}
                  disabled={!hasInputs || isLoading}
                  className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <SpinnerIcon className="w-5 h-5 animate-spin" />
                      <span>Generating Your Plan...</span>
                    </>
                  ) : (
                    <>
                      <RocketIcon className="w-5 h-5" />
                      <span>Generate Project & Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Column */}
            <div className="mt-8 lg:mt-0">
              {isLoading && <Loader />}
              {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}
              {!isLoading && !plan && !error && (
                <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 h-full flex flex-col items-center justify-center text-center">
                    <LogoIcon className="w-16 h-16 text-slate-600 mb-4"/>
                    <h3 className="text-xl font-bold text-slate-300">Your AI Career Co-Pilot</h3>
                    <p className="text-slate-400 mt-2 max-w-sm">
                      Provide your resume and a job description to generate a personalized project and learning roadmap to land your next role.
                    </p>
                </div>
              )}
              {plan && <ResultsDisplay
                plan={plan}
                onSave={handleSavePlan}
                isSaved={isPlanSaved}
                completedResources={activeCompletedResources}
                onUpdateCompletedResources={handleUpdateCompletedResources}
              />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;