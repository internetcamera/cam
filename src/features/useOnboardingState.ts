import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { version } from '../../package.json';

const latestOnboardingRelease = '0.0.9';

export type OnboardingState = {
  initialOnboardingCompleted: boolean;
  lastVersionOnboarded?: string;
  needsOnboarding: () => boolean;
  completeOnboarding: () => void;
};

export const useOnboardingState = create<OnboardingState>(
  persist(
    (set, get) => ({
      initialOnboardingCompleted: false,
      needsOnboarding: () => {
        return (
          (!get().initialOnboardingCompleted ||
            get().lastVersionOnboarded == undefined ||
            `${get().lastVersionOnboarded}` < version) &&
          (!get().lastVersionOnboarded ||
            `${get().lastVersionOnboarded}` < latestOnboardingRelease)
        );
      }, // TODO: Needs a better semver compare
      completeOnboarding: () => {
        set({
          initialOnboardingCompleted: true,
          lastVersionOnboarded: version
        });
      }
    }),
    {
      name: 'onboarding-internet-camera',
      getStorage: () => AsyncStorage
    }
  )
);

export default useOnboardingState;
