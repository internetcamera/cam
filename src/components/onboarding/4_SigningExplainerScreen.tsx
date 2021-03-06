import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../ui/Button';

const SigningExplainerScreen = () => {
  const navigation = useNavigation();
  useEffect(
    () => navigation.setOptions({ gestureEnabled: false }),
    [navigation]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 50,
          padding: 15
        }}
      >
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.message}>
          Some actions in the app, like publishing a photo, require you to
          confirm the action in your wallet. It looks like this:
        </Text>
        <View style={{ height: 30 }} />
        <View style={styles.videoBackdrop}>
          <Image
            source={require('../../../assets/gifs/onboarding__signing.gif')}
            style={styles.video}
            resizeMode="contain"
          />
        </View>
        <View style={{ height: 30 }} />
        <Text style={styles.message}>
          This step ensures your photos are posted in a secure, decentralized
          way. When you post, your photo is truly yours. You can keep it
          forever, give it to a loved one, or sell it.{'\n'}
          {'\n'}There's no platform lock-in, so your photos can be easily used
          in other apps and websites, including NFT markets like OpenSea.
        </Text>
        <View style={{ height: 15 }} />
        <Button
          text="Get started"
          onPress={() => {
            navigation.navigate('FilmIntro');
          }}
          style={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  title: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 32,
    marginBottom: 20
  },
  videoBackdrop: {
    backgroundColor: 'hsl(260,100%, 50%)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  video: {
    height: 300
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
    backgroundColor: 'blue'
  },
  buttonMetaMask: {
    backgroundColor: 'orange'
  }
});

export default SigningExplainerScreen;
