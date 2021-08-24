import React from 'react';
import FilmStoreScreen from '../screens/FilmStoreScreen';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import FilmCreateScreen from '../screens/FilmCreateScreen';

export type FilmStoreParamsList = {
  Film: undefined;
  FilmCreate: { model: 'personal' | 'claimable' };
};

const StackNavigation = createNativeStackNavigator<FilmStoreParamsList>();

const FilmStoreStack = () => {
  return (
    <StackNavigation.Navigator>
      <StackNavigation.Screen
        name="Film"
        component={FilmStoreScreen}
        options={{
          title: 'Film',
          headerTitleStyle: {
            fontFamily: 'HelveticaNowBold'
          },
          headerStyle: {
            backgroundColor: 'rgb(5,5,5)'
          }
        }}
      />
      <StackNavigation.Screen
        name="FilmCreate"
        component={FilmCreateScreen}
        options={{
          title: 'Create Film',
          headerTitleStyle: {
            fontFamily: 'HelveticaNowBold'
          },
          headerStyle: {
            backgroundColor: 'rgb(5,5,5)'
          },
          headerBackTitleVisible: false
        }}
      />
    </StackNavigation.Navigator>
  );
};

export default FilmStoreStack;
