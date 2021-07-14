import React from 'react';
import FilmStoreScreen from '../screens/FilmStoreScreen';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
const StackNavigation = createNativeStackNavigator();

const FilmStoreStack = () => {
  return (
    <StackNavigation.Navigator>
      <StackNavigation.Screen
        name="Film"
        component={FilmStoreScreen}
        initialParams={{ feed: 'home' }}
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
    </StackNavigation.Navigator>
  );
};

export default FilmStoreStack;
