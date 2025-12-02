import { Stack } from 'expo-router';
import React from 'react';

import { AbalColors } from '@/constants/theme';

export default function SubscriptionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: AbalColors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="packages" />
      <Stack.Screen name="checkout" />
      <Stack.Screen
        name="payment"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="history" />
    </Stack>
  );
}



