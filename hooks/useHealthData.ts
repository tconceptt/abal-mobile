import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Storage keys
const HEALTH_DATA_KEY = '@abal/health_data';

// Types for health data
export interface DailyHealthRecord {
  date: string; // YYYY-MM-DD format
  steps: number;
  calories: number;
}

export interface HealthData {
  steps: {
    today: number;
    weeklyData: number[];
    lastUpdated: Date | null;
  };
  calories: {
    today: number;
    weeklyData: number[];
    lastUpdated: Date | null;
  };
}

export interface HealthDataState {
  data: HealthData;
  isLoading: boolean;
  error: string | null;
  isAuthorized: boolean;
  isAvailable: boolean;
}

// Default state
const DEFAULT_HEALTH_DATA: HealthData = {
  steps: {
    today: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    lastUpdated: null,
  },
  calories: {
    today: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    lastUpdated: null,
  },
};

// Helper to get today's date as YYYY-MM-DD
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper to get date string for N days ago
const getDateStringDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Helper to get start of today
const getStartOfToday = (): Date => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

// Helper to get end of today
const getEndOfToday = (): Date => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Load stored health history from AsyncStorage
 */
async function loadStoredHistory(): Promise<Record<string, DailyHealthRecord>> {
  try {
    const stored = await AsyncStorage.getItem(HEALTH_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading health history:', error);
  }
  return {};
}

/**
 * Save health record to AsyncStorage
 */
async function saveHealthRecord(record: DailyHealthRecord): Promise<void> {
  try {
    const history = await loadStoredHistory();
    history[record.date] = record;
    
    // Keep only last 30 days of data to prevent storage bloat
    const thirtyDaysAgo = getDateStringDaysAgo(30);
    const filteredHistory: Record<string, DailyHealthRecord> = {};
    for (const [date, data] of Object.entries(history)) {
      if (date >= thirtyDaysAgo) {
        filteredHistory[date] = data;
      }
    }
    
    await AsyncStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error saving health record:', error);
  }
}

/**
 * Build weekly data from stored history
 */
function buildWeeklyData(history: Record<string, DailyHealthRecord>): { steps: number[]; calories: number[] } {
  const stepsData: number[] = [];
  const caloriesData: number[] = [];
  
  // Get last 7 days (oldest first for chart display)
  for (let i = 6; i >= 0; i--) {
    const dateString = getDateStringDaysAgo(i);
    const record = history[dateString];
    stepsData.push(record?.steps || 0);
    caloriesData.push(record?.calories || 0);
  }
  
  return { steps: stepsData, calories: caloriesData };
}

/**
 * iOS HealthKit implementation - SIMPLIFIED
 * Only fetches TODAY's data, stores history locally
 */
const useIOSHealthKit = () => {
  const [state, setState] = useState<HealthDataState>({
    data: DEFAULT_HEALTH_DATA,
    isLoading: true,
    error: null,
    isAuthorized: false,
    isAvailable: false,
  });

  // Load stored history on mount
  useEffect(() => {
    loadStoredHistory().then((history) => {
      const { steps, calories } = buildWeeklyData(history);
      const today = getTodayDateString();
      const todayRecord = history[today];
      
      setState((prev) => ({
        ...prev,
        data: {
          steps: {
            today: todayRecord?.steps || 0,
            weeklyData: steps,
            lastUpdated: null,
          },
          calories: {
            today: todayRecord?.calories || 0,
            weeklyData: calories,
            lastUpdated: null,
          },
        },
      }));
    });
  }, []);

  const initializeHealthKit = useCallback(async () => {
    if (Platform.OS !== 'ios') {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAvailable: false,
        error: 'HealthKit is only available on iOS',
      }));
      return;
    }

    try {
      const HealthKit = await import('@kingstinct/react-native-healthkit');
      
      const isAvailable = await HealthKit.isHealthDataAvailable();
      
      if (!isAvailable) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAvailable: false,
          error: 'HealthKit is not available on this device',
        }));
        return;
      }

      setState((prev) => ({ ...prev, isAvailable: true }));

      // Request authorization
      await HealthKit.requestAuthorization({
        toRead: [
          'HKQuantityTypeIdentifierStepCount',
          'HKQuantityTypeIdentifierActiveEnergyBurned',
        ],
      });

      setState((prev) => ({
        ...prev,
        isAuthorized: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error('HealthKit initialization error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAvailable: false,
        error: error instanceof Error ? error.message : 'HealthKit initialization failed',
      }));
    }
  }, []);

  const fetchTodayData = useCallback(async () => {
    try {
      const HealthKit = await import('@kingstinct/react-native-healthkit');
      const startDate = getStartOfToday();
      const endDate = getEndOfToday();

      // Fetch TODAY's steps only - single fast call
      const stepsResult = await HealthKit.queryStatisticsForQuantity(
        'HKQuantityTypeIdentifierStepCount',
        ['cumulativeSum'],
        { filter: { startDate, endDate } }
      );
      const todaySteps = Math.round(stepsResult.sumQuantity?.quantity || 0);

      // Fetch TODAY's calories only - single fast call
      const caloriesResult = await HealthKit.queryStatisticsForQuantity(
        'HKQuantityTypeIdentifierActiveEnergyBurned',
        ['cumulativeSum'],
        { filter: { startDate, endDate } }
      );
      const todayCalories = Math.round(caloriesResult.sumQuantity?.quantity || 0);

      return { steps: todaySteps, calories: todayCalories };
    } catch (error) {
      console.error('Error fetching today data:', error);
      return { steps: 0, calories: 0 };
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (!state.isAuthorized) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch only TODAY's data (fast!)
      const { steps: todaySteps, calories: todayCalories } = await fetchTodayData();

      // Save to local storage
      const today = getTodayDateString();
      await saveHealthRecord({
        date: today,
        steps: todaySteps,
        calories: todayCalories,
      });

      // Load full history to build weekly chart
      const history = await loadStoredHistory();
      const weeklyData = buildWeeklyData(history);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        data: {
          steps: {
            today: todaySteps,
            weeklyData: weeklyData.steps,
            lastUpdated: new Date(),
          },
          calories: {
            today: todayCalories,
            weeklyData: weeklyData.calories,
            lastUpdated: new Date(),
          },
        },
      }));
    } catch (error) {
      console.error('Error refreshing health data:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch health data',
      }));
    }
  }, [state.isAuthorized, fetchTodayData]);

  // Initialize on mount
  useEffect(() => {
    initializeHealthKit();
  }, [initializeHealthKit]);

  // Fetch data when authorized
  useEffect(() => {
    if (state.isAuthorized) {
      refreshData();
    }
  }, [state.isAuthorized, refreshData]);

  return {
    ...state,
    refreshData,
    requestPermission: initializeHealthKit,
  };
};

/**
 * Android Health Connect implementation - SIMPLIFIED
 */
const useAndroidHealthConnect = () => {
  const [state, setState] = useState<HealthDataState>({
    data: DEFAULT_HEALTH_DATA,
    isLoading: true,
    error: null,
    isAuthorized: false,
    isAvailable: false,
  });

  // Load stored history on mount
  useEffect(() => {
    loadStoredHistory().then((history) => {
      const { steps, calories } = buildWeeklyData(history);
      const today = getTodayDateString();
      const todayRecord = history[today];
      
      setState((prev) => ({
        ...prev,
        data: {
          steps: {
            today: todayRecord?.steps || 0,
            weeklyData: steps,
            lastUpdated: null,
          },
          calories: {
            today: todayRecord?.calories || 0,
            weeklyData: calories,
            lastUpdated: null,
          },
        },
      }));
    });
  }, []);

  const getHealthConnect = useCallback(async () => {
    try {
      const { initialize, requestPermission, aggregateRecord, getSdkStatus, SdkAvailabilityStatus } = 
        require('react-native-health-connect');
      return { initialize, requestPermission, aggregateRecord, getSdkStatus, SdkAvailabilityStatus };
    } catch (error) {
      console.log('Health Connect not available:', error);
      return null;
    }
  }, []);

  const initializeHealthConnect = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAvailable: false,
        error: 'Health Connect is only available on Android',
      }));
      return;
    }

    try {
      const HealthConnect = await getHealthConnect();
      if (!HealthConnect) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAvailable: false,
          error: 'Health Connect module not found',
        }));
        return;
      }

      const status = await HealthConnect.getSdkStatus();
      if (status !== HealthConnect.SdkAvailabilityStatus.SDK_AVAILABLE) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAvailable: false,
          error: 'Health Connect is not available. Please install it from the Play Store.',
        }));
        return;
      }

      const initialized = await HealthConnect.initialize();
      if (!initialized) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAvailable: true,
          isAuthorized: false,
          error: 'Failed to initialize Health Connect',
        }));
        return;
      }

      setState((prev) => ({ ...prev, isAvailable: true }));

      const permissions = await HealthConnect.requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'TotalCaloriesBurned' },
      ]);

      const hasPermissions = permissions.length > 0;

      setState((prev) => ({
        ...prev,
        isAuthorized: hasPermissions,
        isLoading: false,
        error: hasPermissions ? null : 'Health Connect permissions not granted',
      }));
    } catch (error) {
      console.error('Health Connect initialization error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAvailable: false,
        error: 'Health Connect initialization failed',
      }));
    }
  }, [getHealthConnect]);

  const fetchTodayData = useCallback(async () => {
    try {
      const HealthConnect = await getHealthConnect();
      if (!HealthConnect) {
        return { steps: 0, calories: 0 };
      }

      const startOfDay = getStartOfToday().toISOString();
      const endOfDay = getEndOfToday().toISOString();

      // Aggregate TODAY's steps
      const stepsResult = await HealthConnect.aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay,
          endTime: endOfDay,
        },
      });
      const todaySteps = stepsResult.COUNT_TOTAL || 0;

      // Aggregate TODAY's calories
      const caloriesResult = await HealthConnect.aggregateRecord({
        recordType: 'TotalCaloriesBurned',
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay,
          endTime: endOfDay,
        },
      });
      const todayCalories = Math.round(caloriesResult.ENERGY_TOTAL?.inKilocalories || 0);

      return { steps: todaySteps, calories: todayCalories };
    } catch (error) {
      console.error('Error fetching today data:', error);
      return { steps: 0, calories: 0 };
    }
  }, [getHealthConnect]);

  const refreshData = useCallback(async () => {
    if (!state.isAuthorized) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { steps: todaySteps, calories: todayCalories } = await fetchTodayData();

      // Save to local storage
      const today = getTodayDateString();
      await saveHealthRecord({
        date: today,
        steps: todaySteps,
        calories: todayCalories,
      });

      // Load full history
      const history = await loadStoredHistory();
      const weeklyData = buildWeeklyData(history);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        data: {
          steps: {
            today: todaySteps,
            weeklyData: weeklyData.steps,
            lastUpdated: new Date(),
          },
          calories: {
            today: todayCalories,
            weeklyData: weeklyData.calories,
            lastUpdated: new Date(),
          },
        },
      }));
    } catch (error) {
      console.error('Error refreshing health data:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch health data',
      }));
    }
  }, [state.isAuthorized, fetchTodayData]);

  useEffect(() => {
    initializeHealthConnect();
  }, [initializeHealthConnect]);

  useEffect(() => {
    if (state.isAuthorized) {
      refreshData();
    }
  }, [state.isAuthorized, refreshData]);

  return {
    ...state,
    refreshData,
    requestPermission: initializeHealthConnect,
  };
};

/**
 * Web/fallback implementation
 */
const useWebFallback = () => {
  const [state] = useState<HealthDataState>({
    data: DEFAULT_HEALTH_DATA,
    isLoading: false,
    error: 'Health data is not available on this platform',
    isAuthorized: false,
    isAvailable: false,
  });

  return {
    ...state,
    refreshData: async () => {},
    requestPermission: async () => {},
  };
};

/**
 * Cross-platform health data hook
 */
export function useHealthData() {
  const iosHealth = useIOSHealthKit();
  const androidHealth = useAndroidHealthConnect();
  const webFallback = useWebFallback();

  if (Platform.OS === 'ios') {
    return iosHealth;
  } else if (Platform.OS === 'android') {
    return androidHealth;
  }

  return webFallback;
}

export default useHealthData;
