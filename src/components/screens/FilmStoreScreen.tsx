import React, { useRef } from 'react';
import { useQuery } from '@internetcamera/sdk/dist/react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  Linking
} from 'react-native';
import FilmPreview from '../previews/FilmPreview';
import { gql } from 'graphql-request';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import useWallet from '../../features/useWallet';
import Button from '../ui/Button';
import EmptyFilmStoreInlineList from '../empty/EmptyFilmStoreInlineList';
import useRefreshing from '../../features/useRefreshing';
import useFilmInWallet from '../../features/useFilmInWallet';

const FilmStoreScreen = () => {
  const account = useWallet(state => state.account);
  const { data: filmInWallet, refresh: filmInWalletRefresh } = useFilmInWallet(
    account || '0x0000000000000000000000000000000000000000'
  );
  const ref = useRef<ScrollView>(null);
  useScrollToTop(ref);
  const navigation = useNavigation();
  const { data: claimable, refresh: filmClaimableRefresh } = useQuery(gql`
    {
      films(where: { factoryModel: "claimable" }) {
        id
        name
        symbol
        used
        totalSupply
        filmAddress
        factoryModel
      }
    }
  `);

  const claimableSymbols = ['🍄', 'LISTENING2', '1111', 'LDOS21', 'HELLO'];

  const refresh = () => {
    filmInWalletRefresh();
    filmClaimableRefresh();
  };
  const { refreshControl } = useRefreshing(refresh);

  return (
    <ScrollView
      style={styles.container}
      ref={ref}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {account && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Your Wallet</Text>
          <FlatList
            data={filmInWallet}
            renderItem={data => (
              <FilmPreview film={data.item.film} amount={data.item.amount} />
            )}
            horizontal
            indicatorStyle="white"
            contentContainerStyle={{
              paddingLeft: 15,
              paddingRight: 5
            }}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<EmptyFilmStoreInlineList />}
          />
        </View>
      )}

      {claimable?.films && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grab Some Public Film</Text>
          <FlatList
            data={[
              ...claimable.films.filter((film: any) =>
                claimableSymbols.includes(film.symbol)
              )
            ].sort(() => 0.5 - Math.random())}
            renderItem={data => <FilmPreview film={data.item} />}
            horizontal
            indicatorStyle="white"
            contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<EmptyFilmStoreInlineList />}
          />
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create New Film Roll</Text>
        <View style={styles.sectionContent}>
          <Button
            text="Create Personal Film"
            onPress={() =>
              navigation.navigate('FilmCreate', { model: 'personal' })
            }
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
          />

          <Button
            text="Create Claimable Film"
            onPress={() =>
              navigation.navigate('FilmCreate', { model: 'claimable' })
            }
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
          />
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.text}>
            Note: You'll need $FILMFACTORY tokens to create Film while Cam is in
            beta. You can get these tokens for free in the Internet Camera
            Discord.
          </Text>
          <Button
            style={styles.buttonStyle}
            text="Get $FILMFACTORY in Discord   ↗"
            onPress={() => {
              Linking.openURL('https://discord.gg/M3J59ywNf8');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    marginTop: 15
  },
  sectionTitle: {
    padding: 15,
    paddingVertical: 10,
    fontFamily: 'HelveticaNowBold',
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase'
  },
  text: {
    paddingVertical: 10,
    fontFamily: 'HelveticaNowRegular',
    color: '#ccc',
    fontSize: 16
  },
  sectionContent: {
    paddingHorizontal: 15
  },
  list: {},
  buttonStyle: {
    padding: 15,
    width: '100%',
    marginBottom: 10
  },
  buttonTextStyle: {
    fontSize: 18
  }
});

export default FilmStoreScreen;
