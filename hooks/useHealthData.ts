import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Types for health data
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

// Default state with placeholder data
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

// Helper to get start of day
const getStartOfDay = (date: Date = new Date()): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// Helper to get end of day
const getEndOfDay = (date: Date = new Date()): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

// Helper to get date N days ago
const getDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * iOS HealthKit implementation
 */
const useIOSHealthKit = () => {
  const [state, setState] = useState<HealthDataState>({
    data: DEFAULT_HEALTH_DATA,
    isLoading: true,
    error: null,
    isAuthorized: false,
    isAvailable: false,
  });

  // Dynamic import to avoid issues on Android
  const getAppleHealthKit = useCallback(async () => {
    try {
      const AppleHealthKit = require('react-native-health').default;
      return AppleHealthKit;
    } catch (error) {
      console.log('HealthKit not available:', error);
      return null;
    }
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
      const AppleHealthKit = await getAppleHealthKit();
      if (!AppleHealthKit) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAvailable: false,
          error: 'HealthKit module not found',
        }));
        return;
      }

      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          ],
          write: [],
        },
      };

      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
          console.log('HealthKit init error:', error);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAvailable: true,
            isAuthorized: false,
            error: 'Failed to initialize HealthKit. Please grant permissions in Settings.',
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          isAvailable: true,
          isAuthorized: true,
        }));
      });
    } catch (error) {
      console.error('HealthKit initialization error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAvailable: false,
        error: 'HealthKit initialization failed',
      }));
    }
  }, [getAppleHealthKit]);

  const fetchSteps = useCallback(async (): Promise<{ today: number; weeklyData: number[] }> => {
    return new Promise(async (resolve) => {
      try {
        const AppleHealthKit = await getAppleHealthKit();
        if (!AppleHealthKit) {
          resolve({ today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] });
          return;
        }

        const weeklyData: number[] = [];
        let todaySteps = 0;

        // Fetch steps for each day of the past week
        const fetchDaySteps = (dayIndex: number): Promise<number> => {
          return new Promise((resolveDay) => {
            const date = getDaysAgo(6 - dayIndex); // Start from 6 days ago to today
            const options = {
              date: date.toISOString(),
              includeManuallyAdded: true,
            };

            AppleHealthKit.getStepCount(options, (err: string, results: { value: number }) => {
              if (err) {
                console.log(`Error fetching steps for day ${dayIndex}:`, err);
                resolveDay(0);
                return;
              }
              resolveDay(results?.value || 0);
            });
          });
        };

        // Fetch all 7 days
        for (let i = 0; i < 7; i++) {
          const steps = await fetchDaySteps(i);
          weeklyData.push(Math.round(steps));
        }

        todaySteps = weeklyData[6]; // Today is the last item

        resolve({ today: todaySteps, weeklyData });
      } catch (error) {
        console.error('Error fetching steps:', error);
        resolve({ today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] });
      }
    });
  }, [getAppleHealthKit]);

  const fetchCalories = useCallback(async (): Promise<{ today: number; weeklyData: number[] }> => {
    return new Promise(async (resolve) => {
      try {
        const AppleHealthKit = await getAppleHealthKit();
        if (!AppleHealthKit) {
          resolve({ today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] });
          return;
        }

        const weeklyData: number[] = [];
        let todayCalories = 0;

        // Fetch calories for each day of the past week
        const fetchDayCalories = (dayIndex: number): Promise<number> => {
          return new Promise((resolveDay) => {
            const date = getDaysAgo(6 - dayIndex);
            const startDate = getStartOfDay(date);
            const endDate = getEndOfDay(date);
            
            const options = {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            };

            // Get active energy burned
            AppleHealthKit.getActiveEnergyBurned(
              options,
              (err: string, results: Array<{ value: number }>) => {
                if (err) {
                  console.log(`Error fetching active calories for day ${dayIndex}:`, err);
                  resolveDay(0);
                  return;
                }

                // Sum all active energy values for the day
                const totalActive = results?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
                resolveDay(Math.round(totalActive));
              }
            );
          });
        };

        // Fetch all 7 days
        for (let i = 0; i < 7; i++) {
          const calories = await fetchDayCalories(i);
          weeklyData.push(calories);
        }

        todayCalories = weeklyData[6]; // Today is the last item

        resolve({ today: todayCalories, weeklyData });
      } catch (error) {
        console.error('Error fetching calories:', error);
        resolve({ today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] });
      }
    });
  }, [getAppleHealthKit]);

  const refreshData = useCallback(async () => {
    if (!state.isAuthorized) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [stepsResult, caloriesResult] = await Promise.all([
        fetchSteps(),
        fetchCalories(),
      ]);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        data: {
          steps: {
            ...stepsResult,
            lastUpdated: new Date(),
          },
          calories: {
            ...caloriesResult,
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
  }, [state.isAuthorized, fetchSteps, fetchCalories]);

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
 * Android Health Connect implementation
 */
const useAndroidHealthConnect = () => {
  const [state, setState] = useState<HealthDataState>({
    data: DEFAULT_HEALTH_DATA,
    isLoading: true,
    error: null,
    isAuthorized: false,
    isAvailable: false,
  });

  const getHealthConnect = useCallback(async () => {
    try {
      const { initialize, requestPermission, readRecords, getSdkStatus, SdkAvailabilityStatus } = 
        require('react-native-health-connect');
      return { initialize, requestPermission, readRecords, getSdkStatus, SdkAvailabilityStatus };
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

      // Check SDK availability
      const status = await HealthConnect.getSdkStatus();
      if (status !== HealthConnect.SdkAvailabilityStatus.SDK_AVAILABLE) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAvailable: false,
          error: 'Health Connect is not available on this device. Please install it from the Play Store.',
        }));
        return;
      }

      // Initialize Health Connect
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

      setState((prev) => ({
        ...prev,
        isAvailable: true,
      }));

      // Request permissions
      const permissions = await HealthConnect.requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'TotalCaloriesBurned' },
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
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

  const fetchSteps = useCallback(async (): Promise<{ today: number; weeklyData: number[] }> => {
    try {
      const HealthConnect = await getHealthConnect();
      if (!HealthConnect) {
        return { today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] };
      }

      const weeklyData: number[] = [];

      // Fetch steps for each day of the past week
      for (let i = 6; i >= 0; i--) {
        const date = getDaysAgo(i);
        const startTime = getStartOfDay(date).toISOString();
        const endTime = getEndOfDay(date).toISOString();

        try {
          const result = await HealthConnect.readRecords('Steps', {
            timeRangeFilter: {
              operator: 'between',
              startTime,
              endTime,
            },
          });

          const daySteps = result.records.reduce(
            (sum: number, record: { count: number }) => sum + (record.count || 0),
            0
          );
          weeklyData.push(Math.round(daySteps));
        } catch (err) {
          console.log(`Error fetching steps for day ${i}:`, err);
          weeklyData.push(0);
        }
      }

      return { today: weeklyData[6], weeklyData };
    } catch (error) {
      console.error('Error fetching steps:', error);
      return { today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] };
    }
  }, [getHealthConnect]);

  const fetchCalories = useCallback(async (): Promise<{ today: number; weeklyData: number[] }> => {
    try {
      const HealthConnect = await getHealthConnect();
      if (!HealthConnect) {
        return { today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] };
      }

      const weeklyData: number[] = [];

      // Fetch calories for each day of the past week
      for (let i = 6; i >= 0; i--) {
        const date = getDaysAgo(i);
        const startTime = getStartOfDay(date).toISOString();
        const endTime = getEndOfDay(date).toISOString();

        try {
          const result = await HealthConnect.readRecords('TotalCaloriesBurned', {
            timeRangeFilter: {
              operator: 'between',
              startTime,
              endTime,
            },
          });

          const dayCalories = result.records.reduce(
            (sum: number, record: { energy: { inKilocalories: number } }) => 
              sum + (record.energy?.inKilocalories || 0),
            0
          );
          weeklyData.push(Math.round(dayCalories));
        } catch (err) {
          console.log(`Error fetching calories for day ${i}:`, err);
          weeklyData.push(0);
        }
      }

      return { today: weeklyData[6], weeklyData };
    } catch (error) {
      console.error('Error fetching calories:', error);
      return { today: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] };
    }
  }, [getHealthConnect]);

  const refreshData = useCallback(async () => {
    if (!state.isAuthorized) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [stepsResult, caloriesResult] = await Promise.all([
        fetchSteps(),
        fetchCalories(),
      ]);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        data: {
          steps: {
            ...stepsResult,
            lastUpdated: new Date(),
          },
          calories: {
            ...caloriesResult,
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
  }, [state.isAuthorized, fetchSteps, fetchCalories]);

  // Initialize on mount
  useEffect(() => {
    initializeHealthConnect();
  }, [initializeHealthConnect]);

  // Fetch data when authorized
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
 * Web/fallback implementation (returns mock data)
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
 * Automatically uses HealthKit on iOS and Health Connect on Android
 */
export function useHealthData() {
  // Determine which hook to use based on platform
  // Note: All hooks must be called unconditionally due to React's rules of hooks
  const iosHealth = useIOSHealthKit();
  const androidHealth = useAndroidHealthConnect();
  const webFallback = useWebFallback();

  // Return the appropriate platform's data
  if (Platform.OS === 'ios') {
    return iosHealth;
  } else if (Platform.OS === 'android') {
    return androidHealth;
  }

  // Fallback for web or other platforms
  return webFallback;
}

export default useHealthData;

