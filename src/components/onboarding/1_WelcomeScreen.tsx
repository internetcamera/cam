import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useWallet from '../../features/useWallet';
import Button from '../ui/Button';
import * as Haptics from 'expo-haptics';

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
      <Text style={styles.title}>CAM</Text>
      <Text style={styles.subtitle}>TestFlight Release</Text>

      <Text style={styles.message}>
        Welcome to the first Web 3 camera, powered by the open Internet Camera
        protocol.
      </Text>
      <View style={{ height: 30 }} />
      <Text style={styles.message}>
        Have you used a Web 3 app before? One that uses an Ethereum wallet?
      </Text>

      <Button
        text="No, this is my first one"
        onPress={openExplainer}
        style={styles.buttonStyle}
        textStyle={styles.buttonTextStyle}
      />

      <Button
        text="Yes, I have a wallet already"
        onPress={openWalletConnector}
        style={styles.buttonStyle}
        textStyle={styles.buttonTextStyle}
      />
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
    fontSize: 24
  },
  buttonStyle: {
    padding: 15,
    marginTop: 20,
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
