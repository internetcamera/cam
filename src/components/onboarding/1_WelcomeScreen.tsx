import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useWallet from '../../features/useWallet';
import Button from '../ui/Button';
import * as Haptics from 'expo-haptics';
import Spacer from '../ui/Spacer';

const Welcome = () => {
  const navigation = useNavigation();
  const openWalletConnector = () => {
    Haptics.impactAsync();
    navigation.navigate('ConnectWallet');
  };
  const openExplainer = () => {
    Haptics.impactAsync();
    navigation.navigate('WalletExplainer');
  };
  useEffect(() => {
    if (useWallet.getState().account) {
      useWallet.getState().disconnect?.();
    }
  }, []);
  return (
    <View style={styles.container}>
      <Spacer />
      <Text style={styles.title}>CAM</Text>
      <Text style={styles.subtitle}>TestFlight Release</Text>
      <Spacer />
      <Text style={styles.message}>Do you have an Ethereum wallet?</Text>
      <View style={{ height: 10 }} />
      <Button
        text="Yes, I have a wallet"
        onPress={openWalletConnector}
        style={styles.buttonStyle}
        textStyle={styles.buttonTextStyle}
      />
      <Button
        text="No, I don't - or don't know what that means"
        onPress={openExplainer}
        style={styles.buttonStyle}
        textStyle={styles.buttonTextStyle}
      />
      <Spacer />
      <Spacer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    paddingBottom: 80
  },
  title: {
    color: 'white',
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 36,
    marginBottom: -5
  },
  subtitle: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 20,
    marginBottom: 40
  },
  message: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 10
  },
  buttonStyle: {
    padding: 15,
    marginTop: 10,
    backgroundColor: 'hsl(260, 100%, 50%)',
    width: '100%'
  },
  buttonTextStyle: {
    fontSize: 18,
    fontFamily: 'HelveticaNowBold'
  },
  buttonRainbow: {
    backgroundColor: 'blue'
  },
  buttonMetaMask: {
    backgroundColor: 'orange'
  }
});

export default Welcome;
