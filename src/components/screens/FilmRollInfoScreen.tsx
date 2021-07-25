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
import dayjs from 'dayjs';

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
        <Text style={styles.symbol}>
          {film.used} of{' '}
          {parseInt(formatEther(film.totalSupply)).toLocaleString()} photos
          taken • Held in{' '}
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
          wallets
        </Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non
          mauris sit amet augue varius vulputate vitae vitae neque. Quisque
          ornare sodales magna, in tincidunt tortor. Integer pretium vel lectus
          ac pellentesque.
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

      <View style={styles.code}>
        {Object.keys(film)
          .filter(key => !['wallets', 'photos'].includes(key))
          .sort((a, b) => (a == 'id' ? -1 : a.localeCompare(b)))
          .map((key, i) => (
            <View
              style={[
                styles.codeLine,
                i ==
                Object.keys(film).filter(
                  key => !['wallets', 'photos'].includes(key)
                ).length -
                  1
                  ? { marginBottom: 0, borderBottomWidth: 0 }
                  : null
              ]}
              key={key}
            >
              <Text style={styles.codeKey}>{key}</Text>
              <Text style={styles.codeValue}>
                {key == 'totalSupply'
                  ? parseInt(formatEther(film.totalSupply))
                  : key == 'createdAt'
                  ? dayjs.unix(film.createdAt).format('MMMM D, YYYY [at] h:mma')
                  : JSON.stringify((film as any)[key], null, 2)}
              </Text>
            </View>
          ))}
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
