import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import FeedScreen from '../screens/FeedScreen';
const Stack = createNativeStackNavigator();

export type HomeTabsParamList = {
  Home: { title: string; feed: string };
  PhotosPosted: { title: string; feed: string };
  PhotosOwned: { title: string; feed: string };
};

const Tabs = createMaterialTopTabNavigator<HomeTabsParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: 'Cam',
        headerTitleStyle: {
          fontFamily: 'HelveticaNowBold'
        },
        headerStyle: {
          backgroundColor: 'rgb(5,5,5)'
        }
      }}
    >
      <Stack.Screen name="Home" component={HomeTabs} />
    </Stack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: false,
        showIcon: false,
        tabStyle: { height: 1, padding: 0, margin: 0 },
        indicatorStyle: {
          backgroundColor: '#fff',
          height: 1
        }
      }}
    >
      <Tabs.Screen
        name="Home"
        component={FeedScreen}
        initialParams={{
          title: 'Home',
          feed: 'home'
        }}
      />
      <Tabs.Screen
        name="PhotosPosted"
        component={FeedScreen}
        initialParams={{
          title: 'Photos Posted',
          feed: 'photos-posted'
        }}
      />
      <Tabs.Screen
        name="PhotosOwned"
        component={FeedScreen}
        initialParams={{
          title: 'Photos Owned',
          feed: 'photos-owned'
        }}
      />
    </Tabs.Navigator>
  );
};

export default HomeStack;
