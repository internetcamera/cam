import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Pressable } from 'react-native';
import { AppStackParamsList } from '../../../App';
import useENSNameOrAddress from '../../features/useENSNameOrAddress';
import usePhotosInWallet from '../../features/usePhotosInWallet';
import useRefreshing from '../../features/useRefreshing';
import * as Haptics from 'expo-haptics';
import CachedImage from '../CachedImage';

const ProfileScreen = () => {
  const { params } = useRoute<RouteProp<AppStackParamsList, 'Profile'>>();
  const navigation = useNavigation();
  const name = useENSNameOrAddress(params.walletAddress);
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);
  const { data, refresh } = usePhotosInWallet(params.walletAddress);
  const { refreshControl } = useRefreshing(refresh);
  const ref = useRef<FlatList>(null);
  return (
    <FlatList
      data={data}
      refreshControl={refreshControl}
      ref={ref}
      renderItem={({ item }) => (
        <WalletPressableImage
          source={{
            uri: item.image.replace(
              'ipfs://',
              'https://ipfs-cdn.internet.camera/ipfs/'
            )
          }}
          width={item.width}
          height={item.height}
          style={{
            width: Dimensions.get('window').width / 2 - 20,
            aspectRatio: 1,
            margin: 5,
            borderRadius: 5
          }}
          tokenId={item.id}
        />
      )}
      initialNumToRender={6}
      removeClippedSubviews={true}
      numColumns={2}
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 80
      }}
    />
  );
};

const WalletPressableImage = (props: any) => {
  const navigation = useNavigation();
  const onPressImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Photo', { tokenId: props.tokenId });
  };
  return (
    <Pressable
      onPress={onPressImage}
      style={state => (state.pressed ? { transform: [{ scale: 0.98 }] } : null)}
    >
      <CachedImage {...props} />
    </Pressable>
  );
};

export default ProfileScreen;
