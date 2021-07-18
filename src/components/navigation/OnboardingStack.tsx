import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import WelcomeScreen from '../onboarding/1_WelcomeScreen';
import WalletExplainerScreen from '../onboarding/2_WalletExplainerScreen';
import WalletSetupScreen from '../onboarding/2A1_WalletSetupScreen';
import WalletLearnMoreScreen from '../onboarding/2A2_WalletLearnMoreScreen';
import ConnectWalletScreen from '../onboarding/3_ConnectWalletScreen';
import SigningExplainerScreen from '../onboarding/4_SigningExplainerScreen';
import useWallet from '../../features/useWallet';
import FilmIntroScreen from '../onboarding/5_FilmIntroScreen';
const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
  const account = useWallet(state => state.account);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!account ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen
            name="WalletExplainer"
            component={WalletExplainerScreen}
          />
          <Stack.Screen name="WalletSetup" component={WalletSetupScreen} />
          <Stack.Screen
            name="WalletLearnMore"
            component={WalletLearnMoreScreen}
          />
          <Stack.Screen name="ConnectWallet" component={ConnectWalletScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SigningExplainer"
            component={SigningExplainerScreen}
          />
          <Stack.Screen name="FilmIntro" component={FilmIntroScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default OnboardingStack;
