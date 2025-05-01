import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme';
import { HomeScreen } from './screens/HomeScreen';
import { SpendingInputScreen } from './screens/SpendingInputScreen';
import { OptimizationResultsScreen } from './screens/OptimizationResultsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  SpendingInput: undefined;
  OptimizationResults: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SpendingInput" component={SpendingInputScreen} />
            <Stack.Screen name="OptimizationResults" component={OptimizationResultsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 