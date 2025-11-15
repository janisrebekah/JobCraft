import React from 'react';
import type { SavedPlan } from '../types';
import { PlusIcon, TrashIcon, FileTextIcon } from './Icons';

interface SidebarProps {
  plans: SavedPlan[];
  activePlanId: string | null;
  onLoadPlan: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onNewPlan: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ plans, activePlanId, onLoadPlan, onDeletePlan, onNewPlan }) => {
  return (
    <aside className="bg-slate-800/50 lg:border-r border-b lg:border-b-0 border-slate-700 p-4 flex flex-col gap-4 lg:w-64 flex-shrink-0">
      <button
        onClick={onNewPlan}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
      >
        <PlusIcon className="w-5 h-5" />
        New Plan
      </button>
      <h2 className="text-lg font-semibold text-slate-300 mt-2">Saved Plans</h2>
      <div className="overflow-y-auto flex-grow">
        {plans.length === 0 ? (
          <p className="text-sm text-slate-400 text-center p-4">You have no saved plans yet.</p>
        ) : (
          <ul className="space-y-2">
            {plans.map(plan => (
              <li key={plan.id} className="group">
                <div
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    activePlanId === plan.id ? 'bg-slate-700' : 'hover:bg-slate-700/50'
                  }`}
                  onClick={() => onLoadPlan(plan.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileTextIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-200 truncate">{plan.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlan(plan.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-opacity ml-2 p-1 flex-shrink-0"
                    aria-label={`Delete plan ${plan.title}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
