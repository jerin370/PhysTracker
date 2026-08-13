import { useEffect, useState } from 'react';
import { Dumbbell, Utensils, Calendar as CalendarIcon, TrendingUp, Camera, Flame, ChevronRight, ChevronLeft, ChartBar as BarChart3, X, CircleCheck as CheckCircle2, Check, ChevronUp, ChevronDown, Save, Circle, Ruler, Weight } from 'lucide-react';
import { loadState, saveState } from './services/storageService';
import {
  WORKOUT_SPLIT, getDayNumber, getWorkoutForDay, formatDate, MOTIVATIONAL_QUOTES,
} from './constants';
import type {
  AppState, DailyLog, UserProfile, ExerciseLog, ExerciseSet,
} from './types';
import { ExperienceLevel } from './types';

type View = 'dashboard' | 'progression' | 'checkin' | 'photos' | 'workout';

const Card = ({ title, icon: Icon, children, style }: {
  title?: string; icon?: any; children: React.ReactNode; style?: React.CSSProperties;
}) => (
  <div className="glass card" style={style}>
    {title && (
      <div className="card-header">
        {Icon && <Icon size={18} color="var(--primary)" />}
        <span className="card-title">{title}</span>
      </div>
    )}
    {children}
  </div>
);

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percent = Math.min(100, (value / max) * 100);
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${percent}%` }} />
    </div>
  );
};

const OnboardingView = ({ onComplete }: { onComplete: (p: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', height: '', weight: '', age: '', experience: ExperienceLevel.BEGINNER,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => formData.name.trim().length >= 2;
  const validateStep2 = () => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    const a = parseInt(formData.age);
    return h >= 100 && h <= 250 && w >= 30 && w <= 300 && a >= 13 && a <= 100;
  };

  const calculateMacros = () => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const a = parseInt(formData.age);
    const bmr = 10 * w + 6.25 * h - 5 * a + 5;
    const tdee = bmr * 1.55;
    const targetCalories = Math.round(tdee + 250);
    const protein = Math.round(w * 2.2);
    const fats = Math.round(w * 0.9);
    const carbs = Math.round((targetCalories - (protein * 4 + fats * 9)) / 4);
    return { targetCalories, targetProtein: protein, targetCarbs: carbs, targetFats: fats };
  };

  const handleSubmit = () => {
    if (!validateStep2()) {
      setErrors({
        height: formData.height && parseFloat(formData.height) < 100 ? 'Enter 100-250 cm' : '',
        weight: formData.weight && parseFloat(formData.weight) < 30 ? 'Enter 30-300 kg' : '',
        age: formData.age && parseInt(formData.age) < 13 ? 'Must be 13+' : '',
      });
      return;
    }
    const macros = calculateMacros();
    onComplete({
      name: formData.name.trim(),
      heightCm: parseFloat(formData.height),
      weightKg: parseFloat(formData.weight),
      age: parseInt(formData.age),
      experience: formData.experience,
      startDate: new Date().toISOString(),
      ...macros,
    });
  };

  return (
    <div className="view fade-in" style={{ paddingTop: '8vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, fontStyle: 'italic', letterSpacing: -1 }}>
          PROJECT <span style={{ color: 'var(--primary)' }}>PHYSIQUE</span>
        </h1>
        <p style={{ color: 'var(--text-dim)', letterSpacing: 4, fontSize: 12, marginTop: 6 }}>
          90 DAYS TO AESTHETIC
        </p>
      </div>

      <div className="glass card" style={{ padding: 26 }}>
        {step === 1 ? (
          <div className="gap-12" style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="label" htmlFor="ob-name">CHARACTER NAME</label>
            <input
              id="ob-name"
              className="input"
              placeholder="Saitama"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              aria-invalid={!!errors.name}
            />
            {errors.name && <span style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4 }}>{errors.name}</span>}
            <div>
              <label className="label">TRAINING LEVEL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFormData({ ...formData, experience: lvl })}
                    style={{
                      flex: 1, padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
                      background: formData.experience === lvl ? 'var(--primary)' : 'rgba(0,0,0,0.4)',
                      border: `1px solid ${formData.experience === lvl ? 'var(--primary)' : 'var(--stroke)'}`,
                      color: formData.experience === lvl ? '#03111a' : 'var(--text-dim)',
                      fontSize: 12, fontWeight: 800, fontFamily: 'var(--font)',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!validateStep1()}>
              NEXT <ChevronRight size={20} color="#03111a" />
            </button>
          </div>
        ) : (
          <div className="gap-12" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="flex-1">
                <label className="label" htmlFor="ob-height">HEIGHT (CM)</label>
                <input
                  id="ob-height"
                  className="input"
                  type="number"
                  inputMode="numeric"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  aria-invalid={!!errors.height}
                />
                {errors.height && <span style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4 }}>{errors.height}</span>}
              </div>
              <div className="flex-1">
                <label className="label" htmlFor="ob-weight">WEIGHT (KG)</label>
                <input
                  id="ob-weight"
                  className="input"
                  type="number"
                  inputMode="numeric"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  aria-invalid={!!errors.weight}
                />
                {errors.weight && <span style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4 }}>{errors.weight}</span>}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ob-age">AGE</label>
              <input
                id="ob-age"
                className="input"
                type="number"
                inputMode="numeric"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                aria-invalid={!!errors.age}
              />
              {errors.age && <span style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4 }}>{errors.age}</span>}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>
                BACK
              </button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={!validateStep2()}>
                START MISSION
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardView = ({ state, dayNum, onStartWorkout, onUpdateDiet }: any) => {
  const [viewDay, setViewDay] = useState(dayNum);
  const workout = getWorkoutForDay(viewDay);
  const todayStr = formatDate(new Date());
  const todayLog: DailyLog = state.logs[todayStr] || {
    date: todayStr, caloriesHit: false, proteinHit: false, waterLiters: 0,
    junkFood: false, workoutCompleted: false, exercises: [],
  };
  const quote = MOTIVATIONAL_QUOTES[dayNum % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="view fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => viewDay > 1 && setViewDay(viewDay - 1)}
            disabled={viewDay <= 1}
            aria-label="Previous day"
            style={{ background: 'none', border: 'none', cursor: viewDay > 1 ? 'pointer' : 'default', opacity: viewDay > 1 ? 1 : 0.3, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft color="var(--primary)" size={28} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900 }}>
              DAY {viewDay} <span style={{ color: 'var(--text-dim)', fontSize: 16 }}>/ 90</span>
            </div>
            <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>
              {viewDay === dayNum ? "TODAY'S MISSION" : 'VIEWING PLAN'}
            </div>
          </div>
          <button
            onClick={() => viewDay < 90 && setViewDay(viewDay + 1)}
            disabled={viewDay >= 90}
            aria-label="Next day"
            style={{ background: 'none', border: 'none', cursor: viewDay < 90 ? 'pointer' : 'default', opacity: viewDay < 90 ? 1 : 0.3, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight color="var(--primary)" size={28} />
          </button>
        </div>
        <div className="glass-soft" style={{ padding: '6px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Flame color="#f97316" size={16} />
          <span style={{ fontWeight: 800 }}>
            {Object.values(state.logs).filter((l: any) => l.workoutCompleted).length}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="label" style={{ margin: 0 }}>PROTOCOL PROGRESS</span>
          <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 800 }}>
            {Math.round((dayNum / 90) * 100)}%
          </span>
        </div>
        <ProgressBar value={dayNum} max={90} />
      </div>

      <Card title="WORKOUT MISSION" icon={Dumbbell}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{workout.name}</div>
        <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 800, marginBottom: 16 }}>{workout.focus}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {workout.exercises.slice(0, 3).map((e: any) => (
            <div key={e.id} style={{ color: 'var(--text-dim)', fontSize: 14 }}>• {e.name}</div>
          ))}
          {workout.exercises.length > 3 && (
            <div style={{ color: 'var(--primary)', fontSize: 13 }}>+ {workout.exercises.length - 3} more</div>
          )}
          {workout.exercises.length === 0 && (
            <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>Rest and recover today. Light walk, mobility, hydration.</div>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => onStartWorkout(viewDay)}
          disabled={todayLog.workoutCompleted && viewDay === dayNum}
        >
          {todayLog.workoutCompleted && viewDay === dayNum ? 'COMPLETED' : 'START SESSION'}
          {todayLog.workoutCompleted && viewDay === dayNum
            ? <CheckCircle2 color="#03111a" size={20} />
            : <Dumbbell color="#03111a" size={20} />}
        </button>
      </Card>

      <Card title="NUTRITION" icon={Utensils}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onUpdateDiet('caloriesHit', !todayLog.caloriesHit)}
            aria-label="Toggle calorie target hit"
            aria-pressed={todayLog.caloriesHit}
            style={{
              flex: 1, padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
              background: todayLog.caloriesHit ? 'rgba(34,197,94,0.16)' : 'rgba(0,0,0,0.35)',
              border: `1px solid ${todayLog.caloriesHit ? 'var(--success)' : 'var(--stroke)'}`,
              minHeight: 44,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: todayLog.caloriesHit ? 'var(--success)' : 'var(--text-dim)' }}>CALORIES</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{state.user.targetCalories}</div>
          </button>
          <button
            onClick={() => onUpdateDiet('proteinHit', !todayLog.proteinHit)}
            aria-label="Toggle protein target hit"
            aria-pressed={todayLog.proteinHit}
            style={{
              flex: 1, padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
              background: todayLog.proteinHit ? 'rgba(34,197,94,0.16)' : 'rgba(0,0,0,0.35)',
              border: `1px solid ${todayLog.proteinHit ? 'var(--success)' : 'var(--stroke)'}`,
              minHeight: 44,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: todayLog.proteinHit ? 'var(--success)' : 'var(--text-dim)' }}>PROTEIN</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{state.user.targetProtein}G</div>
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="label" style={{ margin: 0 }}>WATER INTAKE</span>
            <span className="label" style={{ margin: 0 }}>{todayLog.waterLiters || 0} / 4L</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {[1, 2, 3, 4].map((v) => (
              <button
                key={v}
                onClick={() => onUpdateDiet('waterLiters', v)}
                aria-label={`Set water intake to ${v} liters`}
                aria-pressed={(todayLog.waterLiters || 0) >= v}
                style={{
                  flex: 1, height: 44, borderRadius: 8, cursor: 'pointer', border: 'none',
                  background: (todayLog.waterLiters || 0) >= v ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                  transition: 'background .2s',
                }}
              />
            ))}
          </div>
        </div>
      </Card>

      <div className="glass-soft" style={{ padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          "{quote}"
        </div>
      </div>
    </div>
  );
};

const ProgressionView = ({ state, dayNum }: any) => {
  const logs = Object.values(state.logs || {}) as any[];
  const completedWorkouts = logs.filter((l) => l.workoutCompleted).length;
  const avgWaterLiters = logs.length > 0
    ? (logs.reduce((acc: number, l: any) => acc + (l.waterLiters || 0), 0) / logs.length).toFixed(1)
    : '0';
  const nutritionCompliance = logs.length > 0
    ? Math.round((logs.filter((l: any) => l.caloriesHit && l.proteinHit).length / logs.length) * 100)
    : 0;

  const StatRow = ({ label, value }: { label: string; value: any }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--stroke)' }}>
      <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{label}</span>
      <span style={{ color: 'var(--primary)', fontSize: 16, fontWeight: 700 }}>{value}</span>
    </div>
  );

  return (
    <div className="view fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>PROGRESS TRACKING</h2>

      <Card title="MILESTONES" icon={TrendingUp}>
        <StatRow label="Total Workouts" value={completedWorkouts} />
        <StatRow label="Current Day" value={`${dayNum} / 90`} />
        <StatRow label="Completion Rate" value={`${Math.round((dayNum / 90) * 100)}%`} />
      </Card>

      <Card title="NUTRITION STATS" icon={Utensils}>
        <StatRow label="Diet Compliance" value={`${nutritionCompliance}%`} />
        <StatRow label="Avg Water Intake" value={`${avgWaterLiters}L`} />
      </Card>
    </div>
  );
};

const CheckInView = ({ state }: any) => {
  const StatRow = ({ label, value }: { label: string; value: any }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--stroke)' }}>
      <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{label}</span>
      <span style={{ color: 'var(--primary)', fontSize: 16, fontWeight: 700 }}>{value}</span>
    </div>
  );

  return (
    <div className="view fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>BODY STATS</h2>

      <Card title="CURRENT MEASUREMENTS" icon={Ruler}>
        <StatRow label="Height" value={`${state.user.heightCm} cm`} />
        <StatRow label="Weight" value={`${state.user.weightKg} kg`} />
        <StatRow label="Age" value={state.user.age} />
        <StatRow label="Level" value={state.user.experience} />
      </Card>

      <Card title="DAILY TARGETS" icon={Flame}>
        <StatRow label="Target Calories" value={state.user.targetCalories} />
        <StatRow label="Protein Goal" value={`${state.user.targetProtein}g`} />
        <StatRow label="Carbs Goal" value={`${state.user.targetCarbs}g`} />
        <StatRow label="Fats Goal" value={`${state.user.targetFats}g`} />
      </Card>
    </div>
  );
};

const PhotosView = () => (
  <div className="view fade-in">
    <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>BODY PROGRESS</h2>

    <Card title="PHOTO CHECKPOINTS" icon={Camera}>
      <div style={{ color: 'var(--text)', fontSize: 16, textAlign: 'center', margin: '20px 0' }}>
        No photos taken yet
      </div>
      <div style={{ color: 'var(--text-dim)', fontSize: 12, textAlign: 'center' }}>
        Take progress photos every 2 weeks to track your transformation
      </div>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => alert('Photo capture requires camera access. This feature will be available in a future update.')}>
        <Camera color="#03111a" size={20} /> TAKE PHOTO
      </button>
    </Card>
  </div>
);

const WorkoutView = ({ workout, todayLog, onSave }: any) => {
  const [logs, setLogs] = useState<ExerciseLog[]>(() => {
    if (todayLog?.exercises?.length) return todayLog.exercises;
    return workout.exercises.map((ex: any) => ({
      id: ex.id,
      sets: Array(ex.defaultSets).fill(0).map(() => ({ reps: 0, weight: 0, completed: false })),
    }));
  });
  const [expanded, setExpanded] = useState<string | null>(workout.exercises[0]?.id);

  const updateSet = (exId: string, idx: number, field: keyof ExerciseSet, val: any) => {
    setLogs((prev) => prev.map((log) => {
      if (log.id !== exId) return log;
      const nextSets = [...log.sets];
      nextSets[idx] = { ...nextSets[idx], [field]: val };
      return { ...log, sets: nextSets };
    }));
  };

  const handleFinish = () => {
    const total = logs.reduce((acc, l) => acc + l.sets.length, 0);
    const completed = logs.reduce((acc, l) => acc + l.sets.filter((s) => s.completed).length, 0);
    onSave(logs, total > 0 && completed / total >= 0.5);
  };

  return (
    <div className="view fade-in" style={{ paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900 }}>{workout.name}</h2>
        <button onClick={() => onSave(logs, false)} aria-label="Close workout without saving" style={{ background: 'none', border: 'none', cursor: 'pointer', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X color="var(--text)" />
        </button>
      </div>

      {workout.exercises.length === 0 ? (
        <Card title="REST DAY" icon={Flame}>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>
            Active recovery today. Go for a walk, stretch, hydrate, and prep your meals for tomorrow's session.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleFinish}>
            <Save color="#03111a" size={20} /> MARK COMPLETE
          </button>
        </Card>
      ) : (
        workout.exercises.map((ex: any, idx: number) => {
          const log = logs.find((l) => l.id === ex.id);
          const isExp = expanded === ex.id;
          const isDone = log?.sets.every((s) => s.completed);

          return (
            <div
              key={ex.id}
              className="glass card"
              style={{ borderColor: isDone ? 'rgba(34,197,94,0.4)' : 'var(--stroke)', padding: 0, overflow: 'hidden' }}
            >
              <button
                onClick={() => setExpanded(isExp ? null : ex.id)}
                style={{
                  width: '100%', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? 'var(--success)' : 'var(--stroke)', fontSize: 12, fontWeight: 700,
                    color: isDone ? '#03111a' : 'var(--text-dim)',
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: isDone ? 'var(--success)' : 'var(--text)' }}>
                      {ex.name}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>{ex.defaultSets} × {ex.defaultReps}</div>
                  </div>
                </div>
                {isExp ? <ChevronUp color="var(--text-dim)" /> : <ChevronDown color="var(--text-dim)" />}
              </button>

              {isExp && log && (
                <div style={{ padding: 16, background: 'rgba(0,0,0,0.25)', borderTop: '1px solid var(--stroke)' }}>
                  {log.sets.map((set, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ color: 'var(--text-dim)', width: 20, fontWeight: 700 }}>{sIdx + 1}</span>
                      <input
                        className="input"
                        type="number"
                        placeholder="kg"
                        value={set.weight ? String(set.weight) : ''}
                        onChange={(e) => updateSet(ex.id, sIdx, 'weight', parseFloat(e.target.value) || 0)}
                        style={{ flex: 1, textAlign: 'center', height: 42 }}
                      />
                      <input
                        className="input"
                        type="number"
                        placeholder="reps"
                        value={set.reps ? String(set.reps) : ''}
                        onChange={(e) => updateSet(ex.id, sIdx, 'reps', parseInt(e.target.value) || 0)}
                        style={{ flex: 1, textAlign: 'center', height: 42 }}
                      />
                      <button
                        onClick={() => updateSet(ex.id, sIdx, 'completed', !set.completed)}
                        aria-label={`Mark set ${sIdx + 1} as ${set.completed ? 'incomplete' : 'complete'}`}
                        aria-pressed={set.completed}
                        style={{
                          width: 44, height: 44, borderRadius: 8, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', border: 'none',
                          background: set.completed ? 'var(--success)' : 'var(--surface-2)',
                        }}
                      >
                        {set.completed ? <Check color="#03111a" size={16} /> : <Circle color="var(--text-dim)" size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {workout.exercises.length > 0 && (
        <button className="btn btn-primary" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 56px)', maxWidth: 424 }} onClick={handleFinish}>
          <Save color="#03111a" size={20} /> FINISH SESSION
        </button>
      )}
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  if (loading || !state) {
    return (
      <div className="app" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-dim)', fontWeight: 700 }}>Loading...</div>
      </div>
    );
  }

  const dayNum = state.user ? getDayNumber(state.user.startDate) : 1;
  const todayStr = formatDate(new Date());

  const handleOnboarding = (profile: UserProfile) => {
    setState({ ...state, user: profile });
  };

  const handleUpdateDiet = (field: string, val: any) => {
    const todayLog: DailyLog = state.logs[todayStr] || {
      date: todayStr, caloriesHit: false, proteinHit: false, waterLiters: 0,
      junkFood: false, workoutCompleted: false, exercises: [],
    };
    const nextLogs = { ...state.logs, [todayStr]: { ...todayLog, [field]: val } };
    setState({ ...state, logs: nextLogs });
  };

  const handleWorkoutSave = (exercises: ExerciseLog[], completed: boolean) => {
    const todayLog: DailyLog = state.logs[todayStr] || {
      date: todayStr, caloriesHit: false, proteinHit: false, waterLiters: 0,
      junkFood: false, workoutCompleted: false, exercises: [],
    };
    const nextLogs = { ...state.logs, [todayStr]: { ...todayLog, exercises, workoutCompleted: completed } };
    setState({ ...state, logs: nextLogs });
    setView('dashboard');
  };

  if (!state.user) return <OnboardingView onComplete={handleOnboarding} />;

  const navItems: { key: View; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'TODAY', icon: CalendarIcon },
    { key: 'progression', label: 'PROGRESS', icon: TrendingUp },
    { key: 'checkin', label: 'STATS', icon: BarChart3 },
    { key: 'photos', label: 'BODY', icon: Camera },
  ];

  return (
    <div className="app">
      {view === 'dashboard' && (
        <DashboardView
          state={state}
          dayNum={dayNum}
          onStartWorkout={(d: number) => { setActiveDay(d); setView('workout'); }}
          onUpdateDiet={handleUpdateDiet}
        />
      )}
      {view === 'progression' && <ProgressionView state={state} dayNum={dayNum} />}
      {view === 'checkin' && <CheckInView state={state} dayNum={dayNum} />}
      {view === 'photos' && <PhotosView />}
      {view === 'workout' && (
        <WorkoutView
          workout={getWorkoutForDay(activeDay)}
          todayLog={state.logs[todayStr]}
          onSave={handleWorkoutSave}
        />
      )}

      {view !== 'workout' && (
        <nav className="glass nav">
          {navItems.slice(0, 2).map((n) => (
            <button
              key={n.key}
              className={`nav-item ${view === n.key ? 'active' : ''}`}
              onClick={() => setView(n.key)}
              aria-label={n.label}
              aria-current={view === n.key ? 'page' : undefined}
            >
              <n.icon size={22} />
              <span className="nav-text">{n.label}</span>
            </button>
          ))}
          <button
            className="nav-fab"
            onClick={() => { setActiveDay(dayNum); setView('workout'); }}
            aria-label="Start today's workout"
          >
            <Dumbbell color="#03111a" size={28} />
          </button>
          {navItems.slice(2).map((n) => (
            <button
              key={n.key}
              className={`nav-item ${view === n.key ? 'active' : ''}`}
              onClick={() => setView(n.key)}
              aria-label={n.label}
              aria-current={view === n.key ? 'page' : undefined}
            >
              <n.icon size={22} />
              <span className="nav-text">{n.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}


export default App