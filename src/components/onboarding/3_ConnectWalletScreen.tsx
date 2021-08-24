import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import useWallet from '../../features/useWallet';
import Button from '../ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from '@react-navigation/native';

const ConnectWalletScreen = () => {
  const account = useWallet(state => state.account);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isOpening, setIsOpening] = useState(false);
  useEffect(() => {
    const onAppStateChange = () => {
      if (!isOpening && AppState.currentState === 'active') {
        useWallet.getState().refreshManager?.();
      }
    };
    AppState.addEventListener('change', onAppStateChange);
    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, []);
  useEffect(() => {
    setIsOpening(false);
    if (account) navigation.navigate('DecentralizedApps');
    useWallet.getState().refreshManager?.();
  }, [account, isFocused]);
  return (
    <View style={styles.container}>
      <Text style={styles.loginMessage}>Choose a wallet to connect with.</Text>
      <Button
        text="Rainbow"
        onPress={() => {
          setIsOpening(true);
          useWallet
            .getState()
            .openApp?.(
              'rainbow',
              `wc?uri=${encodeURIComponent(useWallet.getState().wcUri || '')}`
            );
        }}
        style={[styles.buttonStyle, styles.buttonRainbow]}
        textStyle={styles.buttonTextStyle}
      />
      <Button
        text="Metamask for iPhone"
        onPress={() => {
          setIsOpening(true);
          useWallet
            .getState()
            .openApp?.(
              'metamask',
              `wc?uri=${encodeURIComponent(useWallet.getState().wcUri || '')}`
            );
        }}
        style={[styles.buttonStyle, styles.buttonMetaMask]}
        textStyle={styles.buttonTextStyle}
      />
      <Button
        text="MetaMask for Chrome or Firefox"
        onPress={() => {
          WebBrowser.openBrowserAsync(
            'https://www.notion.so/How-to-import-your-MetaMask-wallet-into-Rainbow-cebf98f4bc164cbaac245d7342a5c7db',
            {
              toolbarColor: '#000000',
              controlsColor: '#ffffff'
            }
          );
        }}
        style={[styles.buttonStyle, styles.buttonMetaMaskInstall]}
        textStyle={styles.buttonTextStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingBottom: 30
  },
  loginMessage: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    textAlign: 'center',
    fontSize: 24
  },
  buttonStyle: {
    padding: 15,
    marginTop: 15,
    backgroundColor: 'hsl(260, 100%, 50%)',
    width: '100%'
  },
  buttonTextStyle: {
    fontSize: 18,
    fontFamily: 'HelveticaNowBold'
  },
  buttonRainbow: {
    backgroundColor: 'hsl(220, 76%, 31%)'
  },
  buttonMetaMask: {
    backgroundColor: 'hsl(28, 91%, 54%)'
  },
  buttonMetaMaskInstall: {
    borderColor: 'hsl(0, 0%, 30%)',
    borderWidth: 1,
    backgroundColor: 'transparent'
  }
});

export default ConnectWalletScreen;
