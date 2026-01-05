
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  Dumbbell, Utensils, Calendar as CalendarIcon, TrendingUp, Camera, 
  Droplets, Flame, Skull, ChevronRight, ChevronLeft, BarChart3, X, CheckCircle2,
  Check,
  ChevronUp,
  ChevronDown,
  Save,
  Circle,
  Ruler,
  Weight
} from 'lucide-react-native';
import { loadState, saveState } from './services/storageService';
import { WORKOUT_SPLIT, getDayNumber, getWorkoutForDay, formatDate, MOTIVATIONAL_QUOTES } from './constants';
import { AppState, DailyLog, UserProfile, CheckIn, PhotoCheckpoint, ExerciseLog, ExperienceLevel, ExerciseSet } from './types';

const { width } = Dimensions.get('window');

// --- THEME ---
const COLORS = {
  background: '#0a0a0a',
  surface: '#121212',
  surfaceHighlight: '#1E1E1E',
  primary: '#06b6d4',
  accent: '#f43f5e',
  text: '#e5e5e5',
  textDim: '#64748b',
  border: '#1e293b',
  success: '#22c55e',
};

// --- COMPONENTS ---

const Card = ({ children, title, icon: Icon, style }: any) => (
  <View style={[styles.card, style]}>
    {title && (
      <View style={styles.cardHeader}>
        {Icon && <Icon size={18} color={COLORS.primary} />}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    )}
    {children}
  </View>
);

const ProgressBar = ({ value, max }: { value: number, max: number }) => {
  const percent = Math.min(100, (value / max) * 100);
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${percent}%` }]} />
    </View>
  );
};

// --- VIEWS ---

const OnboardingView = ({ onComplete }: { onComplete: (p: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    age: '',
    experience: ExperienceLevel.BEGINNER,
  });

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
    const macros = calculateMacros();
    onComplete({
      name: formData.name,
      heightCm: parseFloat(formData.height),
      weightKg: parseFloat(formData.weight),
      age: parseInt(formData.age),
      experience: formData.experience,
      startDate: new Date().toISOString(),
      ...macros
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.onboardingHero}>
        <Text style={styles.heroTitle}>PROJECT <Text style={{ color: COLORS.primary }}>PHYSIQUE</Text></Text>
        <Text style={styles.heroSub}>90 DAYS TO AESTHETIC</Text>
      </View>

      <View style={styles.onboardingCard}>
        {step === 1 ? (
          <View style={{ gap: 15 }}>
            <Text style={styles.label}>CHARACTER NAME</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Saitama" 
              placeholderTextColor={COLORS.textDim}
              value={formData.name}
              onChangeText={t => setFormData({...formData, name: t})}
            />
            <Text style={styles.label}>TRAINING LEVEL</Text>
            <View style={styles.pickerContainer}>
              {[ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED].map(lvl => (
                <TouchableOpacity 
                  key={lvl} 
                  onPress={() => setFormData({...formData, experience: lvl})}
                  style={[styles.pickerItem, formData.experience === lvl && styles.pickerItemActive]}
                >
                  <Text style={[styles.pickerText, formData.experience === lvl && { color: '#000' }]}>{lvl}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
              <Text style={styles.primaryButtonText}>NEXT</Text>
              <ChevronRight color="#000" size={20} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 15 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>HEIGHT (CM)</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric" 
                  value={formData.height}
                  onChangeText={t => setFormData({...formData, height: t})}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>WEIGHT (KG)</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric"
                  value={formData.weight}
                  onChangeText={t => setFormData({...formData, weight: t})}
                />
              </View>
            </View>
            <Text style={styles.label}>AGE</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              value={formData.age}
              onChangeText={t => setFormData({...formData, age: t})}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}>
                <Text style={styles.secondaryButtonText}>BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { flex: 2 }]} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>START MISSION</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const DashboardView = ({ state, dayNum, onStartWorkout, onUpdateDiet }: any) => {
  const [viewDay, setViewDay] = useState(dayNum);
  const workout = getWorkoutForDay(viewDay);
  const todayStr = formatDate(new Date());
  const todayLog = state.logs[todayStr] || {};

  return (
    <ScrollView style={styles.viewContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.dayPicker}>
          <TouchableOpacity onPress={() => viewDay > 1 && setViewDay(viewDay - 1)}>
            <ChevronLeft color={COLORS.primary} size={28} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.dayTitle}>DAY {viewDay} <Text style={styles.dayLimit}>/ 90</Text></Text>
            <Text style={styles.daySubtitle}>{viewDay === dayNum ? "TODAY'S MISSION" : "VIEWING PLAN"}</Text>
          </View>
          <TouchableOpacity onPress={() => viewDay < 90 && setViewDay(viewDay + 1)}>
            <ChevronRight color={COLORS.primary} size={28} />
          </TouchableOpacity>
        </View>
        <View style={styles.streakBox}>
          <Flame color="#f97316" size={16} />
          <Text style={styles.streakText}>{Object.values(state.logs).filter((l: any) => l.workoutCompleted).length}</Text>
        </View>
      </View>

      <View style={styles.progressSummary}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>PROTOCOL PROGRESS</Text>
          <Text style={styles.progressValue}>{Math.round((dayNum / 90) * 100)}%</Text>
        </View>
        <ProgressBar value={dayNum} max={90} />
      </View>

      <Card title="WORKOUT MISSION" icon={Dumbbell}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutFocus}>{workout.focus}</Text>
        <View style={styles.exercisePreview}>
          {workout.exercises.slice(0, 3).map((e: any) => (
            <Text key={e.id} style={styles.previewText}>• {e.name}</Text>
          ))}
          {workout.exercises.length > 3 && <Text style={styles.previewMore}>+ {workout.exercises.length - 3} more</Text>}
        </View>
        <TouchableOpacity 
          style={[styles.primaryButton, todayLog.workoutCompleted && viewDay === dayNum && styles.buttonDisabled]} 
          onPress={() => onStartWorkout(viewDay)}
          disabled={todayLog.workoutCompleted && viewDay === dayNum}
        >
          <Text style={styles.primaryButtonText}>{todayLog.workoutCompleted && viewDay === dayNum ? 'COMPLETED' : 'START SESSION'}</Text>
          {todayLog.workoutCompleted && viewDay === dayNum ? <CheckCircle2 color="#000" size={20} /> : <Dumbbell color="#000" size={20} />}
        </TouchableOpacity>
      </Card>

      <Card title="NUTRITION" icon={Utensils}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity 
            onPress={() => onUpdateDiet('caloriesHit', !todayLog.caloriesHit)}
            style={[styles.dietBox, todayLog.caloriesHit && styles.dietBoxActive]}
          >
            <Text style={[styles.dietLabel, todayLog.caloriesHit && { color: '#000' }]}>CALORIES</Text>
            <Text style={[styles.dietValue, todayLog.caloriesHit && { color: '#000' }]}>{state.user.targetCalories}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onUpdateDiet('proteinHit', !todayLog.proteinHit)}
            style={[styles.dietBox, todayLog.proteinHit && styles.dietBoxActive]}
          >
            <Text style={[styles.dietLabel, todayLog.proteinHit && { color: '#000' }]}>PROTEIN</Text>
            <Text style={[styles.dietValue, todayLog.proteinHit && { color: '#000' }]}>{state.user.targetProtein}G</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 15 }}>
          <View style={styles.dietSubRow}>
            <Text style={styles.label}>WATER INTAKE</Text>
            <Text style={styles.label}>{todayLog.waterLiters || 0} / 4L</Text>
          </View>
          <View style={styles.waterGrid}>
            {[1, 2, 3, 4].map(v => (
              <TouchableOpacity 
                key={v}
                onPress={() => onUpdateDiet('waterLiters', v)}
                style={[styles.waterStep, (todayLog.waterLiters || 0) >= v && styles.waterStepActive]}
              />
            ))}
          </View>
        </View>
      </Card>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const WorkoutView = ({ workout, todayLog, onSave }: any) => {
  const [logs, setLogs] = useState<ExerciseLog[]>(() => {
    if (todayLog?.exercises?.length) return todayLog.exercises;
    return workout.exercises.map((ex: any) => ({
      id: ex.id,
      sets: Array(ex.defaultSets).fill(0).map(() => ({ reps: 0, weight: 0, completed: false }))
    }));
  });

  const [expanded, setExpanded] = useState<string | null>(workout.exercises[0]?.id);

  const updateSet = (exId: string, idx: number, field: string, val: any) => {
    setLogs(prev => prev.map(log => {
      if (log.id !== exId) return log;
      const nextSets = [...log.sets];
      nextSets[idx] = { ...nextSets[idx], [field]: val };
      return { ...log, sets: nextSets };
    }));
  };

  const handleFinish = () => {
    const total = logs.reduce((acc, l) => acc + l.sets.length, 0);
    const completed = logs.reduce((acc, l) => acc + l.sets.filter(s => s.completed).length, 0);
    onSave(logs, total > 0 && (completed / total) >= 0.5);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutHeaderTitle}>{workout.name}</Text>
        <TouchableOpacity onPress={() => onSave(logs, false)}><X color={COLORS.text} /></TouchableOpacity>
      </View>
      <ScrollView style={{ padding: 15 }}>
        {workout.exercises.map((ex: any, idx: number) => {
          const log = logs.find(l => l.id === ex.id);
          const isExp = expanded === ex.id;
          const isDone = log?.sets.every(s => s.completed);

          return (
            <View key={ex.id} style={[styles.exCard, isDone && { borderColor: COLORS.success + '44' }]}>
              <TouchableOpacity style={styles.exHeader} onPress={() => setExpanded(isExp ? null : ex.id)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.exBadge, isDone && { backgroundColor: COLORS.success }]}>
                    <Text style={[styles.exBadgeText, isDone && { color: '#000' }]}>{idx + 1}</Text>
                  </View>
                  <View>
                    <Text style={[styles.exName, isDone && { color: COLORS.success }]}>{ex.name}</Text>
                    <Text style={styles.exSub}>{ex.defaultSets} × {ex.defaultReps}</Text>
                  </View>
                </View>
                {isExp ? <ChevronUp color={COLORS.textDim} /> : <ChevronDown color={COLORS.textDim} />}
              </TouchableOpacity>

              {isExp && (
                <View style={styles.exBody}>
                  {log?.sets.map((set, sIdx) => (
                    <View key={sIdx} style={styles.setRow}>
                      <Text style={styles.setNum}>{sIdx + 1}</Text>
                      <TextInput 
                        style={styles.setInput} 
                        keyboardType="numeric" 
                        placeholder="kg" 
                        placeholderTextColor="#444"
                        value={set.weight ? String(set.weight) : ''}
                        onChangeText={v => updateSet(ex.id, sIdx, 'weight', parseFloat(v) || 0)}
                      />
                      <TextInput 
                        style={styles.setInput} 
                        keyboardType="numeric" 
                        placeholder="reps" 
                        placeholderTextColor="#444"
                        value={set.reps ? String(set.reps) : ''}
                        onChangeText={v => updateSet(ex.id, sIdx, 'reps', parseInt(v) || 0)}
                      />
                      <TouchableOpacity 
                        onPress={() => updateSet(ex.id, sIdx, 'completed', !set.completed)}
                        style={[styles.setCheck, set.completed && styles.setCheckActive]}
                      >
                        {set.completed ? <Check color="#000" size={16} /> : <Circle color={COLORS.textDim} size={16} />}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={styles.workoutFooter}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
          <Save color="#000" size={20} />
          <Text style={styles.primaryButtonText}>FINISH SESSION</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- MAIN APP ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState | null>(null);
  const [view, setView] = useState('dashboard');
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    loadState().then(s => {
      setState(s);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  if (loading || !state) return null;

  const dayNum = state.user ? getDayNumber(state.user.startDate) : 1;
  const todayStr = formatDate(new Date());

  const handleOnboarding = (profile: UserProfile) => {
    setState({ ...state, user: profile });
  };

  const handleUpdateDiet = (field: string, val: any) => {
    const todayLog = state.logs[todayStr] || { 
      date: todayStr, caloriesHit: false, proteinHit: false, waterLiters: 0, 
      junkFood: false, workoutCompleted: false, exercises: [] 
    };
    const nextLogs = { ...state.logs, [todayStr]: { ...todayLog, [field]: val } };
    setState({ ...state, logs: nextLogs });
  };

  const handleWorkoutSave = (exercises: ExerciseLog[], completed: boolean) => {
    const todayLog = state.logs[todayStr] || { 
      date: todayStr, caloriesHit: false, proteinHit: false, waterLiters: 0, 
      junkFood: false, workoutCompleted: false, exercises: [] 
    };
    const nextLogs = { ...state.logs, [todayStr]: { ...todayLog, exercises, workoutCompleted: completed } };
    setState({ ...state, logs: nextLogs });
    setView('dashboard');
  };

  if (!state.user) return <OnboardingView onComplete={handleOnboarding} />;

  return (
    <View style={styles.appContainer}>
      <StatusBar style="light" />
      
      {view === 'dashboard' && (
        <DashboardView 
          state={state} 
          dayNum={dayNum} 
          onStartWorkout={(d: number) => { setActiveDay(d); setView('workout'); }}
          onUpdateDiet={handleUpdateDiet}
        />
      )}

      {view === 'workout' && (
        <WorkoutView 
          workout={getWorkoutForDay(activeDay)} 
          todayLog={state.logs[todayStr]} 
          onSave={handleWorkoutSave} 
        />
      )}

      {view !== 'workout' && (
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => setView('dashboard')}>
            <CalendarIcon color={view === 'dashboard' ? COLORS.primary : COLORS.textDim} />
            <Text style={[styles.navText, view === 'dashboard' && { color: COLORS.primary }]}>TODAY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setView('progression')}>
            <TrendingUp color={view === 'progression' ? COLORS.primary : COLORS.textDim} />
            <Text style={[styles.navText, view === 'progression' && { color: COLORS.primary }]}>PROGRESS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.fab} 
            onPress={() => { setActiveDay(dayNum); setView('workout'); }}
          >
            <Dumbbell color="#000" size={32} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setView('checkin')}>
            <BarChart3 color={view === 'checkin' ? COLORS.primary : COLORS.textDim} />
            <Text style={[styles.navText, view === 'checkin' && { color: COLORS.primary }]}>STATS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setView('photos')}>
            <Camera color={view === 'photos' ? COLORS.primary : COLORS.textDim} />
            <Text style={[styles.navText, view === 'photos' && { color: COLORS.primary }]}>BODY</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  viewContent: { flex: 1, padding: 20 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, marginTop: Platform.OS === 'ios' ? 40 : 20 },
  dayPicker: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  dayTitle: { color: '#fff', fontSize: 28, fontWeight: '900' },
  dayLimit: { color: COLORS.textDim, fontSize: 16 },
  daySubtitle: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  streakBox: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: COLORS.border },
  streakText: { color: '#fff', fontWeight: 'bold' },

  // Cards & Progress
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  cardTitle: { color: COLORS.text, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  progressSummary: { marginBottom: 25 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold' },
  progressValue: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  progressContainer: { height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: COLORS.primary },

  // Buttons
  primaryButton: { backgroundColor: COLORS.primary, height: 50, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryButtonText: { color: '#000', fontWeight: '900', letterSpacing: 1 },
  secondaryButton: { backgroundColor: COLORS.surface, height: 50, borderRadius: 8, flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  secondaryButtonText: { color: COLORS.text, fontWeight: 'bold' },
  buttonDisabled: { opacity: 0.5 },

  // Onboarding
  onboardingHero: { padding: 40, alignItems: 'center', marginTop: 50 },
  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '900', fontStyle: 'italic' },
  heroSub: { color: COLORS.textDim, letterSpacing: 4, fontSize: 12, marginTop: 5 },
  onboardingCard: { backgroundColor: COLORS.surface, margin: 20, padding: 25, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: '#000', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, color: '#fff', fontWeight: 'bold' },
  pickerContainer: { flexDirection: 'row', gap: 8 },
  pickerItem: { flex: 1, padding: 10, backgroundColor: '#000', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  pickerItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pickerText: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold' },

  // Dashboard Specific
  workoutName: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  workoutFocus: { color: COLORS.primary, fontSize: 12, fontWeight: '800', marginBottom: 15 },
  exercisePreview: { marginBottom: 20, gap: 4 },
  previewText: { color: COLORS.textDim, fontSize: 14 },
  previewMore: { color: COLORS.primary, fontSize: 12 },
  dietBox: { flex: 1, backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  dietBoxActive: { backgroundColor: COLORS.success + '22', borderColor: COLORS.success },
  dietLabel: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold' },
  dietValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  dietSubRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  waterGrid: { flexDirection: 'row', gap: 8, marginTop: 8 },
  waterStep: { flex: 1, height: 35, backgroundColor: COLORS.surfaceHighlight, borderRadius: 4 },
  waterStepActive: { backgroundColor: '#3b82f6' },

  // Workout Module
  workoutHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: 'center', marginTop: Platform.OS === 'ios' ? 40 : 0 },
  workoutHeaderTitle: { color: '#fff', fontWeight: '900', fontSize: 16 },
  exCard: { backgroundColor: COLORS.surface, marginBottom: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  exHeader: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  exBadgeText: { color: COLORS.textDim, fontSize: 12, fontWeight: 'bold' },
  exName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  exSub: { color: COLORS.textDim, fontSize: 12 },
  exBody: { padding: 15, backgroundColor: '#000', borderTopWidth: 1, borderTopColor: COLORS.border },
  setRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  setNum: { color: COLORS.textDim, width: 20, fontWeight: 'bold' },
  setInput: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 5, padding: 8, color: '#fff', textAlign: 'center' },
  setCheck: { width: 40, height: 40, borderRadius: 5, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  setCheckActive: { backgroundColor: COLORS.success },
  workoutFooter: { padding: 15, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },

  // Navigation
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 },
  navItem: { alignItems: 'center', gap: 4 },
  navText: { color: COLORS.textDim, fontSize: 8, fontWeight: 'bold' },
  fab: { backgroundColor: COLORS.primary, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', top: -25, borderWidth: 5, borderColor: COLORS.background },
});
