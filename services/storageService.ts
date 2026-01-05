
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STORAGE_KEY = 'anime_physique_tracker_v1';

const INITIAL_STATE: AppState = {
  user: null,
  logs: {},
  checkIns: [],
  checkpoints: [],
};

export const loadState = async (): Promise<AppState> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_STATE;
  } catch (e) {
    console.error("Failed to load state", e);
    return INITIAL_STATE;
  }
};

export const saveState = async (state: AppState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const clearState = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
