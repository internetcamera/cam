import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Linking, View, AppState } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../ui/Button';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Spacer from '../ui/Spacer';
import { useWallet } from '../../features/useWallet';

const WalletSetupScreen = () => {
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
    useWallet.getState().refreshManager?.();
  }, [account, isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 50,
          justifyContent: 'center',
          padding: 15
        }}
      >
        <Text style={styles.message}>
          <Text style={styles.bold}>
            Setting up a wallet takes less than a minute.
          </Text>
          {'\n'}
          {'\n'}
          Cam works with wallet apps that are trusted by millions of users.
          Install Rainbow or Metamask on iOS and create a wallet.
          {'\n'}
        </Text>

        <Button
          text="Open Rainbow in App Store"
          onPress={() => {
            Linking.openURL(
              'https://apps.apple.com/us/app/rainbow-ethereum-wallet/id1457119021'
            );
          }}
          style={[styles.buttonStyle, styles.buttonRainbow]}
          textStyle={styles.buttonTextStyle}
        />
        <Button
          text="Open MetaMask in App Store"
          onPress={() => {
            Linking.openURL(
              'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202'
            );
          }}
          style={[styles.buttonStyle, styles.buttonMetaMask]}
          textStyle={styles.buttonTextStyle}
        />
        <View style={{ height: 20 }} />
        <Text style={styles.message}>
          Note: You don't need to spend any money to use Cam! Your wallet is
          only used for logging in.
        </Text>
        <Spacer />
        <Button
          text="Tap here after you've set up your wallet"
          onPress={() => {
            navigation.navigate('ConnectWallet');
          }}
          style={[styles.buttonStyle]}
          textStyle={styles.buttonTextStyle}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 32,
    marginBottom: 20
  },
  message: {
    color: 'white',
    fontFamily: 'HelveticaNowRegular',
    fontSize: 22,
    lineHeight: 28
  },
  buttonStyle: {
    padding: 15,
    marginTop: 15,
    backgroundColor: 'hsl(260, 100%, 50%)',
    width: '100%'
  },
  bold: {
    fontFamily: 'HelveticaNowBold',
    lineHeight: 44,
    fontSize: 32
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
  }
});

export default WalletSetupScreen;
