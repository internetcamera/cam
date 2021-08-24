import { InternetCameraAddresses } from '@internetcamera/sdk';
import { RouteProp, useRoute } from '@react-navigation/native';
import { formatEther } from 'ethers/lib/utils';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useFilmRoll from '../../features/useFilmRoll';
import useRefreshing from '../../features/useRefreshing';
import { FilmRollStackParamsList } from '../navigation/FilmRollStack';
import FilmProgressIcon from '../previews/FilmProgressIcon';
import Button from '../ui/Button';
import * as WebBrowser from 'expo-web-browser';

const FilmRollInfoScreen = () => {
  const { params } =
    useRoute<RouteProp<FilmRollStackParamsList, 'FilmRollInfo'>>();
  const { filmAddress } = params;
  const { data: film, refresh } = useFilmRoll(filmAddress);
  const { refreshControl } = useRefreshing(refresh);
  if (!film) return null;
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={refreshControl}
    >
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{film.name}</Text>
          <FilmProgressIcon film={film} />
        </View>
        <Text
          style={[
            styles.symbol,
            {
              color: `hsl(${
                parseInt(film.filmAddress.slice(-9) || '0', 16) % 360
              }, 100%, 70%)`
            }
          ]}
        >
          ${film.symbol}
        </Text>
        <Text style={styles.symbol}>
          {film.used} of{' '}
          {parseInt(formatEther(film.totalSupply)).toLocaleString()} photos
          taken •{' '}
          {
            film.wallets.filter(
              ({ wallet }) =>
                wallet.id.toLowerCase() !=
                  InternetCameraAddresses[80001].camera &&
                wallet.id.toLowerCase() != filmAddress.toLowerCase() &&
                wallet.id.toLowerCase() !=
                  '0x0000000000000000000000000000000000000000'
            ).length
          }{' '}
          members
        </Text>
        <Text style={styles.description}>
          {
            //@ts-ignore
            film.description
          }
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          text="Open in Internet Camera Explorer ↗"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              `https://internet.camera/explorer/film/${filmAddress}`,
              { controlsColor: '#FFFFFF', toolbarColor: '#000000' }
            );
          }}
          style={{
            justifyContent: 'flex-start',
            padding: 15,
            backgroundColor: 'hsl(240, 70%, 40%)'
          }}
          textStyle={{ fontFamily: 'HelveticaNowBold' }}
        />
        <View style={{ height: 10 }} />
        <Button
          text="Open on PolygonScan  ↗"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              `https://mumbai.polygonscan.com/token/${filmAddress}`,
              { controlsColor: '#FFFFFF', toolbarColor: '#000000' }
            );
          }}
          style={{
            justifyContent: 'flex-start',
            padding: 15,
            backgroundColor: 'hsl(260, 100%, 50%)'
          }}
          textStyle={{ fontFamily: 'HelveticaNowBold' }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 50 },
  header: {
    padding: 15,
    position: 'relative'
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'HelveticaNowBold'
  },
  symbol: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'HelveticaNowRegular',
    marginBottom: 10
  },
  description: {
    color: '#fff',
    fontFamily: 'HelveticaNowRegular',
    fontSize: 16
  },
  code: {
    marginHorizontal: 15,
    backgroundColor: '#111',
    borderRadius: 10,
    marginBottom: 15
  },
  codeLine: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: '#222',
    borderBottomWidth: 1
  },
  codeKey: {
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    color: 'white',
    marginBottom: 5
  },
  codeValue: {
    fontFamily: 'JetBrainsMono',
    fontSize: 12,
    color: '#ccc'
  },
  buttons: {
    marginHorizontal: 15,
    marginBottom: 15
  }
});

export default FilmRollInfoScreen;
