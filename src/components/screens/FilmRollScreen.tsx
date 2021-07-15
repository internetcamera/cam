import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  View,
  Alert
} from 'react-native';
import PhotoPreview from '../previews/PhotoPreview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import useRefreshing from '../../features/useRefreshing';
import EmptyPhotoList from '../empty/EmptyPhotoList';
import useFilmRoll from '../../features/useFilmRoll';
import useClaimableFilmMetadata from '../../features/useClaimableFilmMetadata';
import useWallet from '../../features/useWallet';
import { getClaimFilmTypedData } from '@internetcamera/sdk/dist/utils/forwarder';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import * as Haptics from 'expo-haptics';
import { FilmRollStackParamsList } from '../navigation/FilmRollStack';

const FilmRollScreen = () => {
  const { params } = useRoute<RouteProp<FilmRollStackParamsList, 'FilmRoll'>>();
  const { filmAddress } = params;
  const { data, refresh } = useFilmRoll(filmAddress);
  const account = useWallet(state => state.account);
  const navigation = useNavigation();
  const { refreshControl } = useRefreshing(refresh);
  const [isClaiming, setClaiming] = useState(false);
  const { data: claimableFilmMetadata } = useClaimableFilmMetadata(
    data,
    account
  );
  useEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({
      headerRight: () =>
        claimableFilmMetadata?.canClaim ? (
          <Pressable onPress={claimFilm}>
            <Text style={styles.claimButton}>
              Get {claimableFilmMetadata.amountClaimablePerUser}
            </Text>
          </Pressable>
        ) : null
    });
  }, [claimableFilmMetadata?.canClaim, filmAddress, account]);

  const claimFilm = async () => {
    if (!account) throw new Error('FilmRollScreen: account is required');
    if (isClaiming) return;
    setClaiming(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const jsonRpcProvider = getJsonRpcProvider();
      const typedData = await getClaimFilmTypedData(
        filmAddress,
        account,
        80001,
        jsonRpcProvider
      );
      const signTypedData = useWallet.getState().signTypedData;
      if (!signTypedData) throw new Error('Wallet not ready to sign!');
      const signature = await signTypedData(JSON.stringify(typedData));

      let response: { hash: string };
      do {
        response = await fetch('https://tx.internet.camera/api/forward', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            data: typedData,
            signature
          })
        })
          .then(res => res.json())
          .catch(err => console.log(err));
        if (!response) await new Promise(r => setTimeout(r, 500));
      } while (response == undefined);
      // console.log(response);

      setClaiming(false);
      useWallet.getState().addPendingTransaction(response.hash);
      navigation.navigate('Activity');
    } catch (err) {
      console.log(err);
      Alert.alert('Oh no!', err.body.error.message.split(':').pop());
      setClaiming(false);
    }
  };
  if (!data) return null;
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.container}
        data={data.photos.map(photo => ({
          ...photo,
          film: { ...data, photos: [] }
        }))}
        keyExtractor={item => item.id}
        renderItem={photo => <PhotoPreview photo={photo.item} />}
        initialNumToRender={3}
        refreshControl={refreshControl}
        ListEmptyComponent={<EmptyPhotoList />}
        showsVerticalScrollIndicator={data.photos.length > 0}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          height: data.photos.length > 0 ? 'auto' : '100%',
          paddingBottom: 100,
          paddingTop: 5
        }}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  claimButton: {
    backgroundColor: '#222',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    overflow: 'hidden',
    fontFamily: 'HelveticaNowMicroBold',
    textTransform: 'uppercase',
    fontSize: 13,
    color: '#ccc'
  }
});

export default FilmRollScreen;
