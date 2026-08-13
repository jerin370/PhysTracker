export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface UserProfile {
  name: string;
  heightCm: number;
  weightKg: number;
  age: number;
  experience: ExperienceLevel;
  startDate: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
}

export interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  sets: ExerciseSet[];
}

export interface DailyLog {
  date: string;
  caloriesHit: boolean;
  proteinHit: boolean;
  waterLiters: number;
  junkFood: boolean;
  workoutCompleted: boolean;
  exercises: ExerciseLog[];
}

export interface CheckIn {
  date: string;
  weightKg: number;
  waistCm: number;
  visualRating: number;
  strengthTrend: 'Up' | 'Same' | 'Down';
  notes: string;
}

export interface PhotoCheckpoint {
  day: number;
  date: string;
  notes: string;
}

export interface AppState {
  user: UserProfile | null;
  logs: Record<string, DailyLog>;
  checkIns: CheckIn[];
  checkpoints: PhotoCheckpoint[];
}

export interface Exercise {
  id: string;
  name: string;
  defaultSets: number;
  defaultReps: string;
  targetMuscle: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  focus: string;
  exercises: Exercise[];
}
