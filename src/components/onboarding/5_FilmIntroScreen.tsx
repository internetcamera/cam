import { getClaimFilmTypedData } from '@internetcamera/sdk/dist/utils/forwarder';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import useOnboardingState from '../../features/useOnboardingState';
import useWallet from '../../features/useWallet';
import Button from '../ui/Button';

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
        <Text style={styles.title}>CAM uses FILM.</Text>
        <Text style={styles.message}>
          Every photo posted using CAM requires using 1 FILM for processing and
          storage.
          {'\n'}
          {'\n'}
          FILM is a type of virtual token that can be created by anyone for a
          small, upfront per-photo fee. Just set a title, the amount of FILM
          available in that roll, some optional customization settings, and it's
          live. The creator can then keep, use, or distribute their film however
          they'd like.
          {'\n'}
          {'\n'}
          That includes keeping a personal roll, sharing one with a group of
          friends, distributing one for use at an event, selling them for a flat
          fee, selling them on an open exchange, and more.
          {'\n'}
          {'\n'}
          FILM comes with a number of customization options, and soon creators
          of photo filters (postprocessing and AR) will be able to incorporate
          their filters into rolls of film, allowing them to make money for that
          work for the first time.
          {'\n'}
          No real money is needed while testing.
        </Text>
        <View style={{ height: 15 }} />
        <Button
          text={`Get 1 HELLO FILM`}
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
