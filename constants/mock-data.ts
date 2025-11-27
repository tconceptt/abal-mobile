/**
 * Mock data for ABAL app UI development
 * Replace with real API data when backend is ready
 */

// ============ TYPES ============

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  memberSince: string;
}

export interface Membership {
  id: string;
  status: 'active' | 'expired' | 'pending';
  type: string;
  expiresAt: string;
}

export interface Activity {
  id: string;
  type: 'gym_checkin' | 'workout' | 'class' | 'milestone';
  title: string;
  timestamp: string;
  icon: 'checkmark.circle.fill' | 'dumbbell.fill' | 'figure.walk' | 'heart.fill';
}

export interface ProgressMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  data: number[];
}

export interface FeedPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  type: 'workout' | 'milestone' | 'checkin' | 'class' | 'achievement';
  content: string;
  timestamp: string;
  image?: string;
  stats?: {
    duration?: string;
    calories?: number;
    exercises?: number;
  };
  likes: number;
  comments: number;
  hasLiked: boolean;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy.fill' | 'star.fill' | 'flame.fill' | 'heart.fill' | 'dumbbell.fill';
  unlockedAt?: string;
  locked: boolean;
  progress?: number;
  target?: number;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  duration: string;
  calories: number;
  exercises: number;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  package: string;
  status: 'completed' | 'pending' | 'failed';
  paymentCode?: string;
}

// ============ MOCK DATA ============

// Mock user data
export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=68',
  memberSince: 'January 2023',
};

// Mock membership data
export const mockMembership: Membership = {
  id: 'mem_001',
  status: 'active',
  type: 'Premium',
  expiresAt: 'Jun 11, 2023',
};

// Mock recent activities
export const mockActivities: Activity[] = [
  {
    id: 'act_001',
    type: 'gym_checkin',
    title: 'Gym Check-in',
    timestamp: 'Today, 10:00 AM',
    icon: 'checkmark.circle.fill',
  },
  {
    id: 'act_002',
    type: 'workout',
    title: 'Gym Check-in',
    timestamp: 'Today, 10:00 AM',
    icon: 'dumbbell.fill',
  },
  {
    id: 'act_003',
    type: 'class',
    title: 'Yoga Session',
    timestamp: 'Yesterday, 6:30 PM',
    icon: 'figure.walk',
  },
  {
    id: 'act_004',
    type: 'milestone',
    title: '10 Workouts Completed',
    timestamp: 'Nov 24, 2023',
    icon: 'heart.fill',
  },
];

// Mock progress metrics
export const mockProgressMetrics: ProgressMetric[] = [
  {
    id: 'prog_001',
    title: 'Weight',
    value: 165,
    unit: 'lbs',
    trend: 'down',
    color: '#6366F1',
    data: [170, 169, 168, 167, 166, 165],
  },
  {
    id: 'prog_002',
    title: 'Progress',
    value: 78,
    unit: '%',
    trend: 'up',
    color: '#B8E936',
    data: [45, 52, 58, 65, 72, 78],
  },
  {
    id: 'prog_003',
    title: 'Workouts',
    value: 24,
    unit: 'this month',
    trend: 'up',
    color: '#EF4444',
    data: [12, 15, 18, 20, 22, 24],
  },
  {
    id: 'prog_004',
    title: 'Calories',
    value: 2450,
    unit: 'avg/day',
    trend: 'stable',
    color: '#F59E0B',
    data: [2400, 2500, 2350, 2550, 2400, 2450],
  },
];

// Mock social feed posts
export const mockFeedPosts: FeedPost[] = [
  {
    id: 'feed_001',
    user: {
      id: 'user_002',
      name: 'Sarah M.',
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
    },
    type: 'workout',
    content: 'Just crushed my morning leg day! Feeling stronger every week 💪',
    timestamp: '15 min ago',
    stats: {
      duration: '45 min',
      calories: 320,
      exercises: 6,
    },
    likes: 24,
    comments: 5,
    hasLiked: false,
  },
  {
    id: 'feed_002',
    user: {
      id: 'user_003',
      name: 'Michael T.',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    type: 'milestone',
    content: 'Hit my goal weight! Down 15 lbs in 3 months. Consistency is key!',
    timestamp: '1 hour ago',
    likes: 89,
    comments: 23,
    hasLiked: true,
  },
  {
    id: 'feed_003',
    user: {
      id: 'user_004',
      name: 'Emma K.',
      avatarUrl: 'https://i.pravatar.cc/150?img=32',
    },
    type: 'checkin',
    content: 'Early bird gets the gains! 6 AM workout done ✅',
    timestamp: '2 hours ago',
    likes: 12,
    comments: 2,
    hasLiked: false,
  },
  {
    id: 'feed_004',
    user: {
      id: 'user_005',
      name: 'David L.',
      avatarUrl: 'https://i.pravatar.cc/150?img=53',
    },
    type: 'class',
    content: 'First spin class in months and I survived! Great energy from the instructor 🚴',
    timestamp: '3 hours ago',
    stats: {
      duration: '50 min',
      calories: 450,
    },
    likes: 31,
    comments: 8,
    hasLiked: false,
  },
  {
    id: 'feed_005',
    user: {
      id: 'user_006',
      name: 'Lisa R.',
      avatarUrl: 'https://i.pravatar.cc/150?img=44',
    },
    type: 'achievement',
    content: 'Earned the "30-Day Streak" badge! No days off 🔥',
    timestamp: '5 hours ago',
    likes: 156,
    comments: 42,
    hasLiked: true,
  },
  {
    id: 'feed_006',
    user: {
      id: 'user_007',
      name: 'James W.',
      avatarUrl: 'https://i.pravatar.cc/150?img=60',
    },
    type: 'workout',
    content: 'New PR on deadlift! 315 lbs 🏋️',
    timestamp: 'Yesterday',
    stats: {
      duration: '60 min',
      calories: 380,
      exercises: 5,
    },
    likes: 67,
    comments: 15,
    hasLiked: false,
  },
];

// Mock subscription packages
export const mockPackages: SubscriptionPackage[] = [
  {
    id: 'pkg_basic',
    name: 'Basic',
    description: 'Perfect for getting started',
    price: 500,
    currency: 'ETB',
    duration: '1 month',
    features: [
      'Gym access during off-peak hours',
      'Basic equipment usage',
      'Locker room access',
    ],
  },
  {
    id: 'pkg_premium',
    name: 'Premium',
    description: 'Most popular choice',
    price: 1200,
    currency: 'ETB',
    duration: '1 month',
    features: [
      'Unlimited gym access',
      'All equipment & machines',
      'Group fitness classes',
      'Personal trainer consultation',
      'Locker room & showers',
    ],
    popular: true,
  },
  {
    id: 'pkg_vip',
    name: 'VIP',
    description: 'Ultimate fitness experience',
    price: 2500,
    currency: 'ETB',
    duration: '1 month',
    features: [
      'All Premium features',
      '4 personal training sessions',
      'Nutrition planning',
      'Priority class booking',
      'Guest passes (2/month)',
      'Spa & sauna access',
    ],
  },
];

// Mock achievements
export const mockAchievements: Achievement[] = [
  {
    id: 'ach_001',
    title: 'First Steps',
    description: 'Complete your first workout',
    icon: 'star.fill',
    unlockedAt: 'Jan 15, 2023',
    locked: false,
  },
  {
    id: 'ach_002',
    title: 'Week Warrior',
    description: 'Work out 7 days in a row',
    icon: 'flame.fill',
    unlockedAt: 'Feb 22, 2023',
    locked: false,
  },
  {
    id: 'ach_003',
    title: 'Centurion',
    description: 'Complete 100 workouts',
    icon: 'trophy.fill',
    locked: true,
    progress: 78,
    target: 100,
  },
  {
    id: 'ach_004',
    title: 'Early Bird',
    description: 'Check in before 7 AM 10 times',
    icon: 'star.fill',
    unlockedAt: 'Mar 10, 2023',
    locked: false,
  },
  {
    id: 'ach_005',
    title: 'Class Act',
    description: 'Attend 20 group classes',
    icon: 'heart.fill',
    locked: true,
    progress: 12,
    target: 20,
  },
  {
    id: 'ach_006',
    title: 'Iron Will',
    description: 'Lift 10,000 lbs total',
    icon: 'dumbbell.fill',
    locked: true,
    progress: 7500,
    target: 10000,
  },
];

// Mock workout history
export const mockWorkoutHistory: WorkoutSession[] = [
  {
    id: 'wkt_001',
    name: 'Upper Body Strength',
    date: 'Today, 10:00 AM',
    duration: '52 min',
    calories: 340,
    exercises: 8,
    type: 'strength',
  },
  {
    id: 'wkt_002',
    name: 'HIIT Cardio',
    date: 'Yesterday, 6:30 PM',
    duration: '30 min',
    calories: 420,
    exercises: 12,
    type: 'cardio',
  },
  {
    id: 'wkt_003',
    name: 'Leg Day',
    date: 'Nov 25, 2023',
    duration: '45 min',
    calories: 380,
    exercises: 6,
    type: 'strength',
  },
  {
    id: 'wkt_004',
    name: 'Yoga Flow',
    date: 'Nov 24, 2023',
    duration: '60 min',
    calories: 180,
    exercises: 15,
    type: 'flexibility',
  },
  {
    id: 'wkt_005',
    name: 'Full Body Circuit',
    date: 'Nov 23, 2023',
    duration: '40 min',
    calories: 350,
    exercises: 10,
    type: 'mixed',
  },
];

// Mock payment history
export const mockPaymentHistory: PaymentRecord[] = [
  {
    id: 'pay_001',
    date: 'Nov 1, 2023',
    amount: 1200,
    currency: 'ETB',
    package: 'Premium',
    status: 'completed',
    paymentCode: '847291635',
  },
  {
    id: 'pay_002',
    date: 'Oct 1, 2023',
    amount: 1200,
    currency: 'ETB',
    package: 'Premium',
    status: 'completed',
    paymentCode: '562830194',
  },
  {
    id: 'pay_003',
    date: 'Sep 1, 2023',
    amount: 500,
    currency: 'ETB',
    package: 'Basic',
    status: 'completed',
    paymentCode: '193847562',
  },
];

// Mock stats summary
export const mockStatsSummary = {
  totalWorkouts: 78,
  currentStreak: 12,
  longestStreak: 21,
  totalHours: 64,
  totalCalories: 28400,
  averageWorkoutDuration: 49, // minutes
  thisWeekWorkouts: 5,
  thisMonthWorkouts: 18,
};

// ============ DUMMY FUNCTIONS ============

export const dummyFunctions = {
  onRenewSubscription: () => {
    console.log('Renew subscription pressed');
  },
  onNotificationPress: () => {
    console.log('Notification bell pressed');
  },
  onProfilePress: () => {
    console.log('Profile avatar pressed');
  },
  onActivityPress: (activityId: string) => {
    console.log('Activity pressed:', activityId);
  },
  onProgressCardPress: (metricId: string) => {
    console.log('Progress card pressed:', metricId);
  },
  onViewAllActivities: () => {
    console.log('View all activities pressed');
  },
  onViewAllProgress: () => {
    console.log('View all progress pressed');
  },
  onFeedPostLike: (postId: string) => {
    console.log('Feed post liked:', postId);
  },
  onFeedPostComment: (postId: string) => {
    console.log('Feed post comment:', postId);
  },
  onPackageSelect: (packageId: string) => {
    console.log('Package selected:', packageId);
  },
  onApplyDiscount: (code: string) => {
    console.log('Discount code applied:', code);
    // Simulate a discount
    return code.toUpperCase() === 'ABAL20' ? 20 : 0;
  },
  generatePaymentCode: (): string => {
    // Generate a random 9-digit code
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  },
};
