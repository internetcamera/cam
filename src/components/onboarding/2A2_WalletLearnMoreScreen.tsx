import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../ui/Button';

const WalletLearnMoreScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 40,
          paddingBottom: 50,
          padding: 15
        }}
      >
        <Text style={styles.message}>
          <Text style={styles.bold}>
            Wallets are a little bit like password generator apps.
          </Text>
          {'\n'}
          {'\n'}A wallet starts by generating a list of 24 random words for you
          - called a "secret phrase" or "seed phrase". These words are stored
          securely by the app to keep your account safe.
          {'\n'}
          {'\n'}It then uses your secret phrase to generate accounts for you,
          mathematically deciding a private key (a password) and an address (a
          username).
          {'\n'}
          {'\n'}Essentially, seed phrases can be used to create passwords, which
          can be used to create usernames, but going the other way isn't
          possible.
          {'\n'}
          {'\n'}There are as many possible secret phrases as their are atoms in
          the known universe, so wallets can generate seed phrases safely
          without needing to check with a central service if it's already been
          used.
          {'\n'}
          {'\n'}Once you have an account, wallets can be used to log in to Web 3
          apps. For "on-chain" actions – anything that gets stored permanently
          on a blockchain – these apps can request digital signatures from a
          wallet app to confirm it's you.
          {'\n'}
          {'\n'}Because these actions are secured and verifiable, app developers
          can build new types of apps that place a higher value on digital
          assets.
        </Text>
        <View style={{ height: 15 }} />
        <Button
          text="Set up a wallet"
          onPress={() => navigation.navigate('WalletSetup')}
          style={styles.buttonStyle}
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
  }
});

export default WalletLearnMoreScreen;
