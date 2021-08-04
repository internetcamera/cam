import { getClaimFilmTypedData } from '@internetcamera/sdk/dist/utils/forwarder';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import useOnboardingState from '../../features/useOnboardingState';
import useWallet from '../../features/useWallet';
import Button from '../ui/Button';
import Spacer from '../ui/Spacer';

const FilmIntroScreen = () => {
  const account = useWallet(state => state.account);
  const isFocused = useIsFocused();
  useEffect(() => {
    useWallet.getState().refreshManager?.();
  }, [isFocused, account]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 50,
          padding: 15
        }}
      >
        <Text style={styles.title}>To publish a Photo, you need Film.</Text>
        <Text style={styles.message}>
          Film is new, open token standard for creating photo collections.
          {'\n'}
          {'\n'}
          Every photo posted with CAM requires using one Film token. Film covers
          all costs of processing and long-term storage on a decentralized
          network.
          {'\n'}
          {'\n'}
          Claim your first Film token to get started. It's on the house.
        </Text>
        <Spacer />
        <Button
          text={`Get 1 HELLO Film`}
          onPress={async () => {
            if (!account) throw new Error('Not logged in!');
            try {
              const jsonRpcProvider = getJsonRpcProvider();
              const typedData = await getClaimFilmTypedData(
                '0xD9F0685B3617B3617f38F8573C46Eb0d2a1922d7',
                account,
                80001,
                jsonRpcProvider
              );
              const signTypedData = useWallet.getState().signTypedData;
              if (!signTypedData) throw new Error('Wallet not ready to sign!');
              const signature = await signTypedData(JSON.stringify(typedData));
              let response: { hash: string };
              do {
                response = await fetch(
                  'https://tx.internet.camera/api/forward',
                  {
                    method: 'POST',
                    headers: {
                      'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                      data: typedData,
                      signature
                    })
                  }
                )
                  .then(res => res.json())
                  .catch(err => console.log(err));
                if (!response) await new Promise(r => setTimeout(r, 500));
              } while (response == undefined);
              useWallet.getState().addPendingTransaction(response.hash);
              useOnboardingState.getState().completeOnboarding();
            } catch (err) {
              console.log(err);
              useOnboardingState.getState().completeOnboarding();
            }
          }}
          style={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
        />
        <Button
          text={`Skip for now`}
          onPress={() => useOnboardingState.getState().completeOnboarding()}
          style={[styles.buttonStyle, { backgroundColor: '#222' }]}
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
    borderRadius: 10
  },
  video: {
    width: '100%',
    aspectRatio: 1
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

export default FilmIntroScreen;
