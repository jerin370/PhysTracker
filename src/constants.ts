import { Exercise, WorkoutRoutine } from './types';

const EXERCISES: Record<string, Exercise> = {
  benchPress: { id: 'benchPress', name: 'Barbell Bench Press', defaultSets: 3, defaultReps: '6-8', targetMuscle: 'Chest' },
  inclineDbPress: { id: 'inclineDbPress', name: 'Incline DB Press', defaultSets: 3, defaultReps: '8-10', targetMuscle: 'Upper Chest' },
  ohp: { id: 'ohp', name: 'Overhead Press', defaultSets: 3, defaultReps: '6-8', targetMuscle: 'Shoulders' },
  lateralRaise: { id: 'lateralRaise', name: 'DB Lateral Raise', defaultSets: 4, defaultReps: '12-15', targetMuscle: 'Side Delts' },
  tricepPushdown: { id: 'tricepPushdown', name: 'Cable Tricep Pushdown', defaultSets: 3, defaultReps: '10-12', targetMuscle: 'Triceps' },

  pullUp: { id: 'pullUp', name: 'Weighted Pull-Ups', defaultSets: 3, defaultReps: '6-8', targetMuscle: 'Lats' },
  barbellRow: { id: 'barbellRow', name: 'Barbell Row', defaultSets: 3, defaultReps: '8-10', targetMuscle: 'Back Thickness' },
  facePull: { id: 'facePull', name: 'Face Pulls', defaultSets: 4, defaultReps: '12-15', targetMuscle: 'Rear Delts' },
  bicepCurl: { id: 'bicepCurl', name: 'Barbell Curl', defaultSets: 3, defaultReps: '8-10', targetMuscle: 'Biceps' },
  hammerCurl: { id: 'hammerCurl', name: 'Hammer Curl', defaultSets: 3, defaultReps: '10-12', targetMuscle: 'Biceps' },

  squat: { id: 'squat', name: 'Back Squat', defaultSets: 3, defaultReps: '5-8', targetMuscle: 'Quads' },
  rdl: { id: 'rdl', name: 'Romanian Deadlift', defaultSets: 3, defaultReps: '8-10', targetMuscle: 'Hamstrings' },
  legExt: { id: 'legExt', name: 'Leg Extension', defaultSets: 3, defaultReps: '12-15', targetMuscle: 'Quads' },
  calfRaise: { id: 'calfRaise', name: 'Standing Calf Raise', defaultSets: 4, defaultReps: '10-15', targetMuscle: 'Calves' },
  hangingLegRaise: { id: 'hangingLegRaise', name: 'Hanging Leg Raise', defaultSets: 3, defaultReps: '10-15', targetMuscle: 'Abs' },

  arnoldPress: { id: 'arnoldPress', name: 'Arnold Press', defaultSets: 3, defaultReps: '8-10', targetMuscle: 'Shoulders' },
  cableLateral: { id: 'cableLateral', name: 'Cable Lateral Raise', defaultSets: 4, defaultReps: '12-15', targetMuscle: 'Side Delts' },
  skullCrusher: { id: 'skullCrusher', name: 'Skull Crushers', defaultSets: 3, defaultReps: '8-10', targetMuscle: 'Triceps' },
  preacherCurl: { id: 'preacherCurl', name: 'Preacher Curl', defaultSets: 3, defaultReps: '10-12', targetMuscle: 'Biceps' },

  inclineBarbell: { id: 'inclineBarbell', name: 'Incline Barbell Press', defaultSets: 3, defaultReps: '6-8', targetMuscle: 'Upper Chest' },
  latPulldown: { id: 'latPulldown', name: 'Lat Pulldown (Wide)', defaultSets: 3, defaultReps: '10-12', targetMuscle: 'Back Width' },
  chestFly: { id: 'chestFly', name: 'Pec Deck Fly', defaultSets: 3, defaultReps: '12-15', targetMuscle: 'Chest' },
  pullover: { id: 'pullover', name: 'DB Pullover', defaultSets: 3, defaultReps: '10-12', targetMuscle: 'Serratus/Lats' },

  hiit: { id: 'hiit', name: 'HIIT Sprints', defaultSets: 10, defaultReps: '30s on/30s off', targetMuscle: 'Cardio' },
  plank: { id: 'plank', name: 'Weighted Plank', defaultSets: 3, defaultReps: '60s', targetMuscle: 'Core' },
  crunch: { id: 'crunch', name: 'Cable Crunch', defaultSets: 3, defaultReps: '12-15', targetMuscle: 'Abs' },
};

export const WORKOUT_SPLIT: WorkoutRoutine[] = [
  { id: 'push', name: 'Push (Chest + Delts)', focus: 'Push Power', exercises: [EXERCISES.benchPress, EXERCISES.ohp, EXERCISES.inclineDbPress, EXERCISES.lateralRaise, EXERCISES.tricepPushdown] },
  { id: 'pull', name: 'Pull (Back + Biceps)', focus: 'Pull Power', exercises: [EXERCISES.pullUp, EXERCISES.barbellRow, EXERCISES.facePull, EXERCISES.bicepCurl, EXERCISES.hammerCurl] },
  { id: 'legs', name: 'Legs + Abs', focus: 'Leg Power', exercises: [EXERCISES.squat, EXERCISES.rdl, EXERCISES.legExt, EXERCISES.calfRaise, EXERCISES.hangingLegRaise] },
  { id: 'shoulders_arms', name: 'Shoulders + Arms', focus: 'Aesthetic Focus', exercises: [EXERCISES.arnoldPress, EXERCISES.cableLateral, EXERCISES.skullCrusher, EXERCISES.preacherCurl, EXERCISES.lateralRaise] },
  { id: 'upper_chest_back', name: 'Upper Chest + Back Width', focus: 'V-Taper', exercises: [EXERCISES.inclineBarbell, EXERCISES.latPulldown, EXERCISES.chestFly, EXERCISES.pullover, EXERCISES.facePull] },
  { id: 'conditioning', name: 'Conditioning + Abs', focus: 'Fat Loss', exercises: [EXERCISES.hiit, EXERCISES.hangingLegRaise, EXERCISES.crunch, EXERCISES.plank] },
  { id: 'rest', name: 'Active Rest', focus: 'Recovery', exercises: [] },
];

export const MOTIVATIONAL_QUOTES = [
  'Discipline is doing what you hate to do, but doing it like you love it.',
  'Your body is a reflection of your lifestyle.',
  'Pain is temporary. Glory is forever.',
  "Don't stop when you're tired. Stop when you're done.",
  "The only bad workout is the one that didn't happen.",
  'Sweat is just fat crying.',
  'Make yourself proud.',
  'Focus. Lift. Repeat.',
  'Be stronger than your excuses.',
  'Earn your rest.',
];

export const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const getDayNumber = (startDateStr: string): number => {
  const start = new Date(startDateStr).getTime();
  const now = new Date().getTime();
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

export const getWorkoutForDay = (dayNumber: number): WorkoutRoutine => {
  const index = (dayNumber - 1) % 7;
  return WORKOUT_SPLIT[index];
};
