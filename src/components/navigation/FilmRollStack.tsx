import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FilmRollScreen from '../screens/FilmRollScreen';
import FilmRollInfoScreen from '../screens/FilmRollInfoScreen';
import FilmRollActivityScreen from '../screens/FilmRollActivityScreen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppStackParamsList } from '../../../App';
const Tabs = createMaterialTopTabNavigator();

export type FilmRollStackParamsList = {
  FilmRoll: { filmAddress: string };
  FilmRollInfo: { filmAddress: string };
  FilmRollActivity: { filmAddress: string };
};

const FilmRollStack = () => {
  const route = useRoute<RouteProp<AppStackParamsList, 'FilmRollStack'>>();
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showIcon: false,
        style: {
          backgroundColor: 'rgb(5,5,5)',
          borderBottomColor: 'rgb(25,25,25)',
          borderBottomWidth: 1,
          padding: 0
        },
        labelStyle: {
          fontFamily: 'HelveticaNowMicroBold',
          fontSize: 12
        },
        activeTintColor: '#fff',
        pressOpacity: 1,
        inactiveTintColor: '#555',
        indicatorStyle: { backgroundColor: '#fff', height: 1, padding: 0 }
      }}
    >
      <Tabs.Screen
        name="FilmRoll"
        component={FilmRollScreen}
        options={{
          title: 'Roll'
        }}
        initialParams={{ filmAddress: route.params.filmAddress }}
      />
      <Tabs.Screen
        name="FilmRollInfo"
        component={FilmRollInfoScreen}
        options={{
          title: 'Info'
        }}
        initialParams={{ filmAddress: route.params.filmAddress }}
      />
      <Tabs.Screen
        name="FilmRollActivity"
        component={FilmRollActivityScreen}
        options={{
          title: 'Activity'
        }}
        initialParams={{ filmAddress: route.params.filmAddress }}
      />
    </Tabs.Navigator>
  );
};

export default FilmRollStack;
