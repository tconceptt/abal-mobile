import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Storage key for app-logged workouts
const APP_WORKOUTS_KEY = '@abal/app_workouts';

// Workout types
export type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'mixed' | 'other';
export type WorkoutSource = 'app' | 'healthkit';

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  date: Date;
  duration: number; // in minutes
  calories: number;
  source: WorkoutSource;
  activityType?: string; // HealthKit activity type name
}

interface WorkoutsState {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
}

// Map HealthKit workout activity types to our categories
function mapHealthKitActivityToType(activityType: string): WorkoutType {
  const cardioActivities = [
    'running', 'cycling', 'swimming', 'walking', 'hiking', 'elliptical',
    'rowing', 'stairClimbing', 'jumpRope', 'dance', 'aerobics', 'kickboxing'
  ];
  const strengthActivities = [
    'traditionalStrengthTraining', 'functionalStrengthTraining', 
    'coreTraining', 'crossTraining'
  ];
  const flexibilityActivities = [
    'yoga', 'pilates', 'flexibility', 'stretching', 'mindAndBody'
  ];
  
  const lowerType = activityType.toLowerCase();
  
  if (cardioActivities.some(a => lowerType.includes(a.toLowerCase()))) return 'cardio';
  if (strengthActivities.some(a => lowerType.includes(a.toLowerCase()))) return 'strength';
  if (flexibilityActivities.some(a => lowerType.includes(a.toLowerCase()))) return 'flexibility';
  
  return 'other';
}

// Format workout name from HealthKit activity type
function formatWorkoutName(activityType: string): string {
  // Convert camelCase or snake_case to Title Case
  return activityType
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/HKWorkoutActivityType/gi, '')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Load app-logged workouts from AsyncStorage
 */
async function loadAppWorkouts(): Promise<Workout[]> {
  try {
    const stored = await AsyncStorage.getItem(APP_WORKOUTS_KEY);
    if (stored) {
      const workouts = JSON.parse(stored);
      return workouts.map((w: any) => ({
        ...w,
        date: new Date(w.date),
      }));
    }
  } catch (error) {
    console.error('Error loading app workouts:', error);
  }
  return [];
}

/**
 * Save an app-logged workout
 */
export async function saveAppWorkout(workout: Omit<Workout, 'id' | 'source'>): Promise<void> {
  try {
    const existing = await loadAppWorkouts();
    const newWorkout: Workout = {
      ...workout,
      id: `app_${Date.now()}`,
      source: 'app',
    };
    const updated = [newWorkout, ...existing];
    await AsyncStorage.setItem(APP_WORKOUTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving app workout:', error);
  }
}

// Map HealthKit workout activity type enum to string name
const WorkoutActivityTypeNames: Record<number, string> = {
  1: 'American Football',
  2: 'Archery',
  3: 'Australian Football',
  4: 'Badminton',
  5: 'Baseball',
  6: 'Basketball',
  7: 'Bowling',
  8: 'Boxing',
  9: 'Climbing',
  10: 'Cricket',
  11: 'Cross Training',
  12: 'Curling',
  13: 'Cycling',
  14: 'Dance',
  16: 'Elliptical',
  17: 'Equestrian Sports',
  18: 'Fencing',
  19: 'Fishing',
  20: 'Functional Strength Training',
  21: 'Golf',
  22: 'Gymnastics',
  23: 'Handball',
  24: 'Hiking',
  25: 'Hockey',
  26: 'Hunting',
  27: 'Lacrosse',
  28: 'Martial Arts',
  29: 'Mind And Body',
  30: 'Mixed Metabolic Cardio Training',
  31: 'Paddle Sports',
  32: 'Play',
  33: 'Preparation And Recovery',
  34: 'Racquetball',
  35: 'Rowing',
  36: 'Rugby',
  37: 'Running',
  38: 'Sailing',
  39: 'Skating Sports',
  40: 'Snow Sports',
  41: 'Soccer',
  42: 'Softball',
  43: 'Squash',
  44: 'Stair Climbing',
  45: 'Surfing Sports',
  46: 'Swimming',
  47: 'Table Tennis',
  48: 'Tennis',
  49: 'Track And Field',
  50: 'Traditional Strength Training',
  51: 'Volleyball',
  52: 'Walking',
  53: 'Water Fitness',
  54: 'Water Polo',
  55: 'Water Sports',
  56: 'Wrestling',
  57: 'Yoga',
  58: 'Barre',
  59: 'Core Training',
  60: 'Cross Country Skiing',
  61: 'Downhill Skiing',
  62: 'Flexibility',
  63: 'High Intensity Interval Training',
  64: 'Jump Rope',
  65: 'Kickboxing',
  66: 'Pilates',
  67: 'Snowboarding',
  68: 'Stairs',
  69: 'Step Training',
  70: 'Wheelchair Walk Pace',
  71: 'Wheelchair Run Pace',
  72: 'Tai Chi',
  73: 'Mixed Cardio',
  74: 'Hand Cycling',
  75: 'Disc Sports',
  76: 'Fitness Gaming',
  77: 'Cardio Dance',
  78: 'Social Dance',
  79: 'Pickleball',
  80: 'Cooldown',
  3000: 'Other',
};

function getWorkoutActivityTypeName(activityType: number): string {
  return WorkoutActivityTypeNames[activityType] || `Workout ${activityType}`;
}

/**
 * Fetch workouts from HealthKit (iOS only)
 */
async function fetchHealthKitWorkouts(): Promise<Workout[]> {
  if (Platform.OS !== 'ios') {
    return [];
  }

  try {
    const HealthKit = await import('@kingstinct/react-native-healthkit');
    
    // Check if available
    const isAvailable = await HealthKit.isHealthDataAvailable();
    if (!isAvailable) {
      console.log('[useWorkouts] HealthKit not available');
      return [];
    }

    // Request authorization for workouts
    await HealthKit.requestAuthorization({
      toRead: ['HKWorkoutTypeIdentifier'],
    });

    // Query recent workouts (last 30 days, limit 50)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log('[useWorkouts] Querying HealthKit workouts from:', thirtyDaysAgo.toISOString());

    const workoutSamples = await HealthKit.queryWorkoutSamples({
      filter: {
        startDate: thirtyDaysAgo,
      },
      limit: 50,
      ascending: false, // Most recent first
    });

    console.log('[useWorkouts] HealthKit returned workouts:', workoutSamples?.length || 0);

    // Map HealthKit workouts to our format
    const workouts: Workout[] = await Promise.all(
      (workoutSamples || []).map(async (sample: any) => {
        // workoutActivityType is a number (enum)
        const activityTypeNum = sample.workoutActivityType || 3000; // Default to 'Other'
        const activityTypeName = getWorkoutActivityTypeName(activityTypeNum);
        
        // duration is a Quantity object { unit: string, quantity: number }
        // The quantity is in seconds if unit is 's' or minutes if 'min'
        let durationMinutes = 0;
        if (sample.duration) {
          const durationValue = sample.duration.quantity || 0;
          const durationUnit = sample.duration.unit || 's';
          if (durationUnit === 's' || durationUnit === 'sec') {
            durationMinutes = Math.round(durationValue / 60);
          } else if (durationUnit === 'min') {
            durationMinutes = Math.round(durationValue);
          } else {
            // Assume seconds
            durationMinutes = Math.round(durationValue / 60);
          }
        }

        // Try to get calories burned using getStatistic
        let calories = 0;
        try {
          if (sample.getStatistic) {
            const energyStats = await sample.getStatistic('HKQuantityTypeIdentifierActiveEnergyBurned', 'kcal');
            if (energyStats?.sumQuantity?.quantity) {
              calories = Math.round(energyStats.sumQuantity.quantity);
            }
          }
        } catch (e) {
          // Ignore errors getting stats
          console.log('[useWorkouts] Could not get energy stats for workout:', e);
        }

        return {
          id: `hk_${sample.uuid || Date.now()}_${Math.random()}`,
          name: activityTypeName,
          type: mapHealthKitActivityToType(activityTypeName),
          date: new Date(sample.startDate),
          duration: durationMinutes,
          calories,
          source: 'healthkit' as WorkoutSource,
          activityType: activityTypeName,
        };
      })
    );

    console.log('[useWorkouts] Mapped workouts:', workouts.length);
    return workouts;
  } catch (error) {
    console.error('[useWorkouts] Error fetching HealthKit workouts:', error);
    return [];
  }
}

/**
 * Custom hook for managing workouts from both app and HealthKit
 */
export function useWorkouts() {
  const [state, setState] = useState<WorkoutsState>({
    workouts: [],
    isLoading: true,
    error: null,
  });

  const refreshWorkouts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch from both sources in parallel
      const [appWorkouts, healthKitWorkouts] = await Promise.all([
        loadAppWorkouts(),
        fetchHealthKitWorkouts(),
      ]);

      // Combine and sort by date (most recent first)
      const allWorkouts = [...appWorkouts, ...healthKitWorkouts].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      setState({
        workouts: allWorkouts,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error refreshing workouts:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load workouts',
      }));
    }
  }, []);

  // Load workouts on mount
  useEffect(() => {
    refreshWorkouts();
  }, [refreshWorkouts]);

  // Filter workouts by type
  const getFilteredWorkouts = useCallback(
    (filter: 'all' | 'cardio' | 'strength') => {
      if (filter === 'all') return state.workouts;
      return state.workouts.filter(w => w.type === filter);
    },
    [state.workouts]
  );

  return {
    ...state,
    refreshWorkouts,
    getFilteredWorkouts,
  };
}

export default useWorkouts;

