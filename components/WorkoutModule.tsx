import React, { useState, useEffect } from 'react';
import { ExerciseLog, ExerciseSet, WorkoutRoutine, DailyLog } from '../types';
import { Button } from './UI';
import { CheckCircle, Circle, Save, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  workout: WorkoutRoutine;
  todayLog?: DailyLog;
  onSave: (exerciseLogs: ExerciseLog[], completed: boolean) => void;
}

export const WorkoutModule: React.FC<Props> = ({ workout, todayLog, onSave }) => {
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);

  // Initialize logs
  useEffect(() => {
    if (todayLog && todayLog.exercises.length > 0) {
      setLogs(todayLog.exercises);
    } else {
      const initialLogs: ExerciseLog[] = workout.exercises.map(ex => ({
        id: ex.id,
        sets: Array(ex.defaultSets).fill({ reps: 0, weight: 0, completed: false })
      }));
      setLogs(initialLogs);
      if (initialLogs.length > 0) setExpandedEx(initialLogs[0].id);
    }
  }, [workout, todayLog]);

  const updateSet = (exId: string, setIndex: number, field: keyof ExerciseSet, value: any) => {
    setLogs(prev => prev.map(log => {
      if (log.id !== exId) return log;
      const newSets = [...log.sets];
      newSets[setIndex] = { ...newSets[setIndex], [field]: value };
      return { ...log, sets: newSets };
    }));
  };

  const toggleSetComplete = (exId: string, setIndex: number) => {
    setLogs(prev => prev.map(log => {
      if (log.id !== exId) return log;
      const newSets = [...log.sets];
      const isComplete = !newSets[setIndex].completed;
      newSets[setIndex] = { ...newSets[setIndex], completed: isComplete };
      return { ...log, sets: newSets };
    }));
  };

  const handleFinish = () => {
    // Check if at least 80% of sets are done to count as "Completed"
    const totalSets = logs.reduce((acc, log) => acc + log.sets.length, 0);
    const completedSets = logs.reduce((acc, log) => acc + log.sets.filter(s => s.completed).length, 0);
    const isWorkoutComplete = totalSets > 0 && (completedSets / totalSets) >= 0.5;
    
    onSave(logs, isWorkoutComplete);
  };

  if (!workout.exercises.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <h3 className="text-xl font-bold text-white mb-2">Rest Day</h3>
        <p className="text-slate-400">Recover. Sleep. Grow.</p>
        <Button onClick={() => onSave([], true)} className="mt-6">Mark Rest Complete</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-black italic text-white">{workout.name}</h2>
          <span className="text-xs uppercase bg-primary/20 text-primary px-2 py-1 rounded">{workout.focus}</span>
        </div>
      </div>

      {workout.exercises.map((ex, exIndex) => {
        const log = logs.find(l => l.id === ex.id);
        if (!log) return null;
        
        const isExpanded = expandedEx === ex.id;
        const completedCount = log.sets.filter(s => s.completed).length;
        const isFullyComplete = completedCount === log.sets.length;

        return (
          <div key={ex.id} className={`bg-surface border ${isFullyComplete ? 'border-green-900' : 'border-slate-800'} rounded-lg overflow-hidden transition-all`}>
            <div 
              className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-800"
              onClick={() => setExpandedEx(isExpanded ? null : ex.id)}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isFullyComplete ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                   {exIndex + 1}
                 </div>
                 <div>
                   <h3 className={`font-bold ${isFullyComplete ? 'text-green-400' : 'text-slate-200'}`}>{ex.name}</h3>
                   <p className="text-xs text-slate-500">{ex.defaultSets} sets × {ex.defaultReps}</p>
                 </div>
              </div>
              {isExpanded ? <ChevronUp size={20} className="text-slate-500"/> : <ChevronDown size={20} className="text-slate-500"/>}
            </div>

            {isExpanded && (
              <div className="p-4 bg-black/20 border-t border-slate-800 space-y-3">
                <div className="grid grid-cols-10 gap-2 text-xs uppercase text-slate-500 text-center mb-2 font-bold">
                  <div className="col-span-1">Set</div>
                  <div className="col-span-3">kg</div>
                  <div className="col-span-3">Reps</div>
                  <div className="col-span-3">Done</div>
                </div>
                {log.sets.map((set, i) => (
                  <div key={i} className="grid grid-cols-10 gap-2 items-center">
                    <div className="col-span-1 text-center font-mono text-slate-400">{i + 1}</div>
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        value={set.weight || ''} 
                        onChange={(e) => updateSet(ex.id, i, 'weight', parseFloat(e.target.value))}
                        placeholder="0"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-center text-white font-mono focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="col-span-3">
                       <input 
                        type="number" 
                        value={set.reps || ''} 
                        onChange={(e) => updateSet(ex.id, i, 'reps', parseFloat(e.target.value))}
                        placeholder="0"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-center text-white font-mono focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="col-span-3 flex justify-center">
                      <button 
                        onClick={() => toggleSetComplete(ex.id, i)}
                        className={`w-full p-2 rounded flex items-center justify-center transition-colors ${set.completed ? 'bg-green-500/20 text-green-500' : 'bg-slate-800 text-slate-500'}`}
                      >
                        {set.completed ? <CheckCircle size={20}/> : <Circle size={20}/>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-slate-800 z-10">
        <Button onClick={handleFinish} className="w-full h-14 text-lg uppercase tracking-widest neon-border">
          <Save size={20} /> Finish Workout
        </Button>
      </div>
    </div>
  );
};
