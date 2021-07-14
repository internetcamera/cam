import { useQuery } from '@internetcamera/sdk/dist/react';
import React, { useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import FilmPreview from '../previews/FilmPreview';
import { gql } from 'graphql-request';
import { useScrollToTop } from '@react-navigation/native';
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
            data={claimable.films}
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
        <Text style={styles.sectionTitle}>Create a New Film Roll</Text>
        <View style={styles.sectionContent}>
          <Button
            text="Personal Film"
            onPress={() => alert('Available soon.')}
          />
          <View style={{ height: 10 }} />
          <Button text="Group Film" onPress={() => alert('Available soon.')} />
          <View style={{ height: 10 }} />
          <Button text="Event Film" onPress={() => alert('Available soon.')} />
          <View style={{ height: 10 }} />
          <Button text="Public Film" onPress={() => alert('Available soon.')} />
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
  sectionContent: { paddingHorizontal: 15 },
  list: {}
});

export default FilmStoreScreen;
