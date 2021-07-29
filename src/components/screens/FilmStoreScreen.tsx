import React, { useRef } from 'react';
import { useQuery } from '@internetcamera/sdk/dist/react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import FilmPreview from '../previews/FilmPreview';
import { gql } from 'graphql-request';
import { useScrollToTop } from '@react-navigation/native';
import useWallet from '../../features/useWallet';
import Button from '../ui/Button';
import EmptyFilmStoreInlineList from '../empty/EmptyFilmStoreInlineList';
import useRefreshing from '../../features/useRefreshing';
import useFilmInWallet from '../../features/useFilmInWallet';
// import BottomSheet from '@gorhom/bottom-sheet';

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

  const claimableSymbols = ['OUTSIDE', 'WINDOW'];

  const refresh = () => {
    filmInWalletRefresh();
    filmClaimableRefresh();
  };
  const { refreshControl } = useRefreshing(refresh);
  // const explainerRef = useRef<BottomSheet>(null);

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
            data={claimable.films.filter((film: any) =>
              claimableSymbols.includes(film.symbol)
            )}
            renderItem={data => <FilmPreview film={data.item} />}
            horizontal
            indicatorStyle="white"
            contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<EmptyFilmStoreInlineList />}
          />
        </View>
      )}
      {/* 
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <Button
            text="Learn more about Film"
            onPress={() => {
              Haptics.impactAsync();
              explainerRef.current?.expand();
            }}
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
          />
          <Portal>
            <BottomSheet
              ref={explainerRef}
              snapPoints={['0%', '100%']}
              backgroundComponent={({ style }: BottomSheetBackgroundProps) => (
                <View
                  style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.9)' }]}
                />
              )}
            >
              <FilmExplainerSheet />
            </BottomSheet>
          </Portal>
        </View>
      </View> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create a New Film Roll</Text>
        <View style={styles.sectionContent}>
          <Button
            text="Personal Film"
            onPress={() => alert('Available soon.')}
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
          />
          <View style={{ height: 10 }} />
          <Button
            text="Group Film"
            onPress={() => alert('Available soon.')}
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
          />
          <View style={{ height: 10 }} />
          <Button
            text="Event Film"
            onPress={() => alert('Available soon.')}
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
          />
          <View style={{ height: 10 }} />
          <Button
            text="Public Film"
            onPress={() => alert('Available soon.')}
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
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
  sectionContent: {
    paddingHorizontal: 15
  },
  list: {},
  buttonStyle: {
    padding: 15,
    width: '100%'
  },
  buttonTextStyle: {
    fontSize: 18
  }
});

export default FilmStoreScreen;
