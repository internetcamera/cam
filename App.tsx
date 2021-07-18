import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import WalletManager from './src/components/wallet/WalletManager';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import AppTabs from './src/components/navigation/AppTabs';
import ProfileScreen from './src/components/screens/ProfileScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';
import { PortalProvider } from '@gorhom/portal';
import FilmRollStack from './src/components/navigation/FilmRollStack';
import PhotoScreen from './src/components/screens/PhotoScreen';
import * as Sentry from 'sentry-expo';
import OnboardingStack from './src/components/navigation/OnboardingStack';
import useWallet from './src/features/useWallet';
import useOnboardingState from './src/features/useOnboardingState';

Sentry.init({
  dsn: 'https://81db96318a6848189f13f6474b0e6d60@o919702.ingest.sentry.io/5864063',
  enableAutoSessionTracking: true
});

export type AppStackParamsList = {
  Home: undefined;
  FilmRollStack: { title: string; filmAddress: string };
  Profile: { walletAddress: string };
  Photo: { tokenId: string };
  Settings: undefined;
};
const Stack = createNativeStackNavigator<AppStackParamsList>();

export default function App() {
  const linking = { prefixes: ['https://cam.internet.camera'] };
  const [loaded] = useFonts({
    HelveticaNowRegular: {
      uri: require('./assets/fonts/HelveticaNowText-Regular.otf')
    },
    HelveticaNowBold: {
      uri: require('./assets/fonts/HelveticaNowText-Bold.otf')
    },
    HelveticaNowMicroRegular: {
      uri: require('./assets/fonts/HelveticaNowMicro-Regular.otf')
    },
    HelveticaNowMicroBold: {
      uri: require('./assets/fonts/HelveticaNowMicro-Bold.otf')
    },
    JetBrainsMono: { uri: require('./assets/fonts/JetBrainsMono-Regular.ttf') }
  });
  const account = useWallet(state => state.account);
  const needsOnboarding = useOnboardingState(state => state.needsOnboarding());
  if (!loaded) return null;
  return (
    <PortalProvider>
      <StatusBar style="light" />
      <WalletManager />
      <NavigationContainer
        linking={linking}
        theme={{
          ...DarkTheme,
          colors: { ...DarkTheme.colors, primary: '#fff' }
        }}
      >
        {!account || needsOnboarding ? (
          <OnboardingStack />
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={AppTabs}
              options={{ headerTintColor: 'white', headerShown: false }}
            />
            <Stack.Screen
              name="FilmRollStack"
              component={FilmRollStack}
              options={({ route }) => ({
                title: route.params?.title || 'CAM',
                headerTintColor: 'white',
                headerBackTitleVisible: false,
                headerTitleStyle: {
                  fontFamily: 'HelveticaNowBold'
                },
                headerStyle: {
                  backgroundColor: 'rgb(5,5,5)'
                }
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerTintColor: 'white',
                headerBackTitleVisible: false,
                title: '',
                headerTitleStyle: {
                  fontFamily: 'HelveticaNowBold'
                },
                headerStyle: {
                  backgroundColor: 'rgb(5,5,5)'
                }
              }}
            />
            <Stack.Screen
              name="Photo"
              component={PhotoScreen}
              options={{
                headerTintColor: 'white',
                headerBackTitleVisible: false,
                title: '',
                headerTitleStyle: {
                  fontFamily: 'HelveticaNowBold'
                },
                headerStyle: {
                  backgroundColor: 'rgb(5,5,5)'
                }
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: 'Settings',
                headerTintColor: 'white',
                headerBackTitleVisible: false,
                headerTitleStyle: {
                  fontFamily: 'HelveticaNowBold'
                },
                headerStyle: {
                  backgroundColor: 'rgb(5,5,5)'
                }
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PortalProvider>
  );
}
