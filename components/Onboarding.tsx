import React, { useState } from 'react';
import { UserProfile, ExperienceLevel } from '../types';
import { Button } from './UI';
import { ArrowRight, Activity, Ruler, Weight, Calendar } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    age: '',
    experience: ExperienceLevel.BEGINNER,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateMacros = () => {
    // Mifflin-St Jeor Equation for Men
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);
    
    // BMR
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    
    // TDEE (Assume moderate activity for workout plan)
    const tdee = bmr * 1.55;
    
    // Goal: Lean Bulk (+250 kcal)
    const targetCalories = Math.round(tdee + 250);
    
    // Macros
    const protein = Math.round(weight * 2.2); // ~2.2g per kg (high protein)
    const fats = Math.round(weight * 0.9); // ~0.9g per kg
    const carbs = Math.round((targetCalories - (protein * 4 + fats * 9)) / 4);

    return { targetCalories, targetProtein: protein, targetCarbs: carbs, targetFats: fats };
  };

  const handleSubmit = () => {
    const macros = calculateMacros();
    const profile: UserProfile = {
      name: formData.name,
      heightCm: parseFloat(formData.height),
      weightKg: parseFloat(formData.weight),
      age: parseInt(formData.age),
      experience: formData.experience,
      startDate: new Date().toISOString(),
      ...macros
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-background max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">
          Project <span className="text-primary">Physique</span>
        </h1>
        <p className="text-slate-400">Build your anime aesthetic in 90 days.</p>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-slate-800 shadow-2xl">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Identity</h2>
            <div>
              <label className="block text-xs uppercase text-slate-500 mb-1">Character Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-primary focus:outline-none"
                placeholder="Enter name..."
              />
            </div>
             <div>
              <label className="block text-xs uppercase text-slate-500 mb-1">Training Level</label>
              <select 
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-primary focus:outline-none"
              >
                <option value={ExperienceLevel.BEGINNER}>Beginner (0-1 yrs)</option>
                <option value={ExperienceLevel.INTERMEDIATE}>Intermediate (1-3 yrs)</option>
                <option value={ExperienceLevel.ADVANCED}>Advanced (3+ yrs)</option>
              </select>
            </div>
            <Button className="w-full mt-4" onClick={() => setStep(2)} disabled={!formData.name}>Next <ArrowRight size={16}/></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-slate-500 mb-1 flex items-center gap-1"><Ruler size={12}/> Height (cm)</label>
                <input 
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-mono focus:border-primary focus:outline-none"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-slate-500 mb-1 flex items-center gap-1"><Weight size={12}/> Weight (kg)</label>
                <input 
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-mono focus:border-primary focus:outline-none"
                  placeholder="70"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs uppercase text-slate-500 mb-1 flex items-center gap-1"><Calendar size={12}/> Age</label>
                <input 
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-mono focus:border-primary focus:outline-none"
                  placeholder="25"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={!formData.height || !formData.weight || !formData.age}
              >
                Start Mission
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
