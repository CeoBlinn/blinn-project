import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SpendingInputScreen } from '../screens/SpendingInputScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OptimizationResultsScreen } from '../screens/OptimizationResultsScreen';
import { useOnboardingStore } from '../stores/onboarding';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  SpendingInput: undefined;
  OptimizationResults: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const hasCompletedOnboarding = useOnboardingStore(
    (state) => state.hasCompletedOnboarding
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName={hasCompletedOnboarding ? 'Home' : 'Onboarding'}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SpendingInput" component={SpendingInputScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="OptimizationResults" component={OptimizationResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 