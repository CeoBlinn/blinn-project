import React, { useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Text, Button, MD3Colors } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useOnboardingStore } from '../../stores/onboarding';
import { AnimatedView } from '../../utils/animated';
import { useAnimation } from '../../utils/animations/hooks';
import { fadeIn, slideInRight } from '../../utils/animations/presets';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Blinn',
    description: 'Optimize your credit card rewards and maximize your benefits with our smart spending tracker.',
    image: 'cards', // We'll add these later
  },
  {
    id: 'categories',
    title: 'Track Your Spending',
    description: 'Easily categorize and track your spending patterns across different categories.',
    image: 'categories',
  },
  {
    id: 'insights',
    title: 'Smart Insights',
    description: 'Get personalized spending insights and recommendations based on your habits.',
    image: 'insights',
  },
  {
    id: 'optimize',
    title: 'Optimize Rewards',
    description: 'Let us help you choose the best cards for your spending pattern and maximize your rewards.',
    image: 'optimize',
  },
];

type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { currentStep, setCurrentStep, setHasCompletedOnboarding } = useOnboardingStore();

  const { style: fadeStyle } = useAnimation({
    type: 'fade',
    config: fadeIn,
  });

  const { style: slideStyle } = useAnimation({
    type: 'slide',
    config: slideInRight,
  });

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newStep = Math.round(offsetX / width);
      if (newStep !== currentStep) {
        setCurrentStep(newStep);
      }
    },
    [currentStep, setCurrentStep]
  );

  const handleNext = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({
        x: nextStep * width,
        animated: true,
      });
    } else {
      setHasCompletedOnboarding(true);
      navigation.replace('Home');
    }
  }, [currentStep, setCurrentStep, setHasCompletedOnboarding, navigation]);

  const handleSkip = useCallback(() => {
    setHasCompletedOnboarding(true);
    navigation.replace('Home');
  }, [setHasCompletedOnboarding, navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {ONBOARDING_STEPS.map((step, index) => (
          <View key={step.id} style={[styles.slide, { width }]}>
            <AnimatedView style={[styles.content, fadeStyle]}>
              <View style={styles.imageContainer}>
                {/* We'll add illustrations here later */}
              </View>
              <Text variant="headlineMedium" style={styles.title}>
                {step.title}
              </Text>
              <Text variant="bodyLarge" style={styles.description}>
                {step.description}
              </Text>
            </AnimatedView>
          </View>
        ))}
      </ScrollView>

      <AnimatedView style={[styles.footer, { paddingBottom: insets.bottom + 16 }, slideStyle]}>
        <View style={styles.pagination}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentStep && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          {currentStep < ONBOARDING_STEPS.length - 1 ? (
            <>
              <Button onPress={handleSkip} mode="text">
                Skip
              </Button>
              <Button onPress={handleNext} mode="contained">
                Next
              </Button>
            </>
          ) : (
            <Button onPress={handleNext} mode="contained" style={styles.getStarted}>
              Get Started
            </Button>
          )}
        </View>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 32,
    backgroundColor: MD3Colors.primary95,
    borderRadius: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: MD3Colors.primary40,
  },
  description: {
    textAlign: 'center',
    color: MD3Colors.neutral60,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MD3Colors.primary20,
    opacity: 0.2,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    opacity: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  getStarted: {
    flex: 1,
  },
}); 