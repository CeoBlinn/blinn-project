import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  List,
  Switch,
  Button,
  IconButton,
  MD3Colors,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSpendingStore } from '../stores/spending';
import { useAnalyticsStore } from '../stores/analytics';
import { useOnboardingStore } from '../stores/onboarding';
import { AnimatedView } from '../utils/animated';
import { useAnimation } from '../utils/animations/hooks';
import { fadeIn } from '../utils/animations/presets';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [isResetDialogVisible, setIsResetDialogVisible] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  const resetSpendingStore = useSpendingStore((state) => state.reset);
  const resetAnalyticsStore = useAnalyticsStore((state) => state.reset);
  const resetOnboarding = useOnboardingStore((state) => state.reset);

  const { style: fadeStyle } = useAnimation({
    type: 'fade',
    config: fadeIn,
  });

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleResetData = useCallback(() => {
    setIsResetDialogVisible(true);
  }, []);

  const handleConfirmReset = useCallback(async () => {
    // Reset all stores
    resetSpendingStore();
    resetAnalyticsStore();
    resetOnboarding();

    // Clear AsyncStorage
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'All data has been reset successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to reset data. Please try again.');
    }
  }, [resetSpendingStore, resetAnalyticsStore, resetOnboarding, navigation]);

  const handleRestartTutorial = useCallback(() => {
    resetOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  }, [resetOnboarding, navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton icon="arrow-left" size={24} onPress={handleBack} />
          <Text variant="headlineMedium">Settings</Text>
          <View style={{ width: 48 }} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedView style={fadeStyle}>
          <List.Section>
            <List.Subheader>App Preferences</List.Subheader>
            <List.Item
              title="Enable Notifications"
              description="Get updates about your spending and rewards"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={setIsNotificationsEnabled}
                />
              )}
            />
            <List.Item
              title="Dark Mode"
              description="Switch between light and dark theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
              )}
            />
            <List.Item
              title="Privacy Mode"
              description="Hide sensitive financial information"
              left={(props) => <List.Icon {...props} icon="eye-off" />}
              right={() => (
                <Switch
                  value={isPrivacyMode}
                  onValueChange={setIsPrivacyMode}
                />
              )}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Help & Support</List.Subheader>
            <List.Item
              title="Restart Tutorial"
              description="View the app introduction again"
              left={(props) => <List.Icon {...props} icon="restart" />}
              onPress={handleRestartTutorial}
            />
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={(props) => <List.Icon {...props} icon="shield" />}
              onPress={() => {}}
            />
            <List.Item
              title="Terms of Service"
              description="View terms and conditions"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => {}}
            />
            <List.Item
              title="Contact Support"
              description="Get help with any issues"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={() => {}}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Data Management</List.Subheader>
            <List.Item
              title="Export Data"
              description="Download your spending data"
              left={(props) => <List.Icon {...props} icon="export" />}
              onPress={() => {}}
            />
            <List.Item
              title="Reset All Data"
              description="Clear all app data and start fresh"
              left={(props) => <List.Icon {...props} icon="delete" color={MD3Colors.error50} />}
              onPress={handleResetData}
              titleStyle={{ color: MD3Colors.error50 }}
              descriptionStyle={{ color: MD3Colors.error50 }}
            />
          </List.Section>

          <View style={styles.version}>
            <Text variant="bodySmall" style={styles.versionText}>
              Version 1.0.0 (1)
            </Text>
          </View>
        </AnimatedView>
      </ScrollView>

      <Portal>
        <Dialog visible={isResetDialogVisible} onDismiss={() => setIsResetDialogVisible(false)}>
          <Dialog.Title>Reset All Data?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This will permanently delete all your spending data, categories, and preferences. This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsResetDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleConfirmReset}
              textColor={MD3Colors.error50}
            >
              Reset
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  content: {
    flex: 1,
  },
  version: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    color: MD3Colors.neutral60,
  },
}); 