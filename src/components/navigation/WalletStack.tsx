import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import WalletScreen from '../screens/WalletScreen';
const WalletStackNavigation = createNativeStackNavigator();

const WalletStack = () => {
  return (
    <WalletStackNavigation.Navigator>
      <WalletStackNavigation.Screen
        name="Wallet"
        component={WalletScreen}
        initialParams={{ feed: 'all' }}
        options={{
          title: 'Wallet',
          headerTitleStyle: {
            fontFamily: 'HelveticaNowBold'
          },
          headerStyle: {
            backgroundColor: 'rgb(5,5,5)'
          }
        }}
      />
    </WalletStackNavigation.Navigator>
  );
};

export default WalletStack;
