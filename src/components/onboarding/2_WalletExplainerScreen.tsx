import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../ui/Button';
import Spacer from '../ui/Spacer';

const WalletExplainerScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={{ flex: 1 }}
      >
        <Spacer />
        <Text style={styles.message}>
          <Text style={styles.bold}>
            The wallet is your key to the world of Web3.
          </Text>
          {'\n'}
          {'\n'}A wallet lets you generate accounts easily and securely, without
          needing to ever register with any service or company. With a wallet,
          you can:
          {'\n'}
          {'\n'}• Login to applications and bring your profile info
          automatically.
          {'\n'}
          {'\n'}• Own virtual assets in a verifiable way, enabling you to buy,
          sell, and license digital media.
          {'\n'}
          {'\n'}• Manage and trade cryptocurrency.
          {'\n'}
          {'\n'}• Create and manage multiple accounts to better organize your
          digital life.
        </Text>
        <Spacer />
        <Button
          text="Set up a wallet"
          onPress={() => navigation.navigate('WalletSetup')}
          style={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
        />
        {/* <Button
          text="Learn a little more first"
          onPress={() => navigation.navigate('WalletLearnMore')}
          style={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    padding: 15
  },
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
    lineHeight: 30
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

export default WalletExplainerScreen;
