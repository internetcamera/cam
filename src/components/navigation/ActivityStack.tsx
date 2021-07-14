import React, { useEffect } from 'react';
import PersonalActivityScreen from '../screens/PersonalActivityScreen';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import useWallet from '../../features/useWallet';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import { useNavigation } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

const ActivityStack = () => {
  const account = useWallet(state => state.account);
  const navigation = useNavigation();
  const pendingTx = useWallet(state => state.pendingTransactions);

  useEffect(() => {
    navigation.setOptions({ tabBarBadge: pendingTx.length || null });
    for (const txHash of pendingTx) {
      getJsonRpcProvider()
        .getTransaction(txHash)
        .then(async tx => {
          try {
            await tx.wait(2);
            useWallet.getState().removePendingTransaction(txHash);
          } catch (err) {
            console.log(err);
            useWallet.getState().removePendingTransaction(txHash);
          }
        });
    }
  }, [pendingTx]);

  return (
    <Stack.Navigator
      screenOptions={{
        title: 'Activity',
        headerTitleStyle: {
          fontFamily: 'HelveticaNowBold'
        },
        headerStyle: {
          backgroundColor: 'rgb(5,5,5)'
        }
      }}
    >
      <Stack.Screen
        name="PersonalActivity"
        component={PersonalActivityScreen}
        initialParams={{ address: account }}
      />
    </Stack.Navigator>
  );
};

export default ActivityStack;
