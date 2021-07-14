import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CameraScreen from '../screens/CameraScreen';
import ActivityStack from './ActivityStack';
import HomeStack from './HomeStack';
import FilmStoreStack from './FilmStoreStack';
import WalletStack from './WalletStack';

export type AppTabsParamList = {
  Home: undefined;
  FilmStore: undefined;
  Camera: undefined;
  Activity: undefined;
  Wallet: undefined;
};
const Tabs = createBottomTabNavigator<AppTabsParamList>();

const AppTabs = () => {
  return (
    <Tabs.Navigator
      lazy={false}
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: 'rgb(5,5,5)'
        },
        activeTintColor: '#fff',
        inactiveTintColor: '#555'
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="FilmStore"
        component={FilmStoreStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="film" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="camera" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="Activity"
        component={ActivityStack}
        options={{
          tabBarBadgeStyle: {
            fontSize: 11,
            fontFamily: 'HelveticaNowMicroBold',
            paddingTop: 2,
            backgroundColor: 'hsl(250, 100%, 50%)'
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="camera-iris"
              color={color}
              size={size}
            />
          )
        }}
      />
      <Tabs.Screen
        name="Wallet"
        component={WalletStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="wallet" color={color} size={size} />
          )
        }}
      />
    </Tabs.Navigator>
  );
};

export default AppTabs;
