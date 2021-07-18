import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
  Dimensions
} from 'react-native';
import useWallet from '../../features/useWallet';
import AddressOrNamePreview from '../previews/AddressOrNamePreview';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useRefreshing from '../../features/useRefreshing';
import usePhotosInWallet from '../../features/usePhotosInWallet';
import * as Haptics from 'expo-haptics';
import CachedImage from '../CachedImage';
import useScrollToTop from '../../features/useScrollToTop';

const WalletScreen = () => {
  const account = useWallet(state => state.account);
  const navigation = useNavigation();
  const { data, refresh } = usePhotosInWallet(account || undefined);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Settings');
          }}
        >
          <Ionicons name="ios-settings-sharp" size={22} color="#ccc" />
        </Pressable>
      ),
      headerRight: () =>
        account ? (
          <Pressable
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              do {
                useWallet.getState().disconnect?.();
                await new Promise(resolve => setTimeout(resolve, 100));
              } while (useWallet.getState().account != null);
            }}
          >
            <MaterialCommunityIcons name="exit-to-app" size={24} color="#ccc" />
          </Pressable>
        ) : null
    });
  }, [account]);
  const isFocused = useIsFocused();
  useEffect(() => {
    useWallet.getState().refreshManager?.();
  }, [isFocused, account]);
  const { refreshControl } = useRefreshing(refresh);
  const ref = useRef<FlatList>(null);
  useScrollToTop(ref);
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
        paddingBottom: 80
      }}
      ListHeaderComponent={() => (
        <>
          {account && (
            <View style={styles.header}>
              <AddressOrNamePreview
                address={account}
                style={{ fontSize: 32, fontFamily: 'HelveticaNowBold' }}
              />
            </View>
          )}
          {!account && (
            <View style={styles.login}>
              <Text style={styles.loginMessage}>
                Choose a wallet to connect with.
              </Text>
              <Button
                text="Rainbow"
                onPress={() =>
                  useWallet
                    .getState()
                    .openApp?.(
                      'rainbow',
                      `wc?uri=${encodeURIComponent(
                        useWallet.getState().wcUri || ''
                      )}`
                    )
                }
              />
              <View style={{ height: 15 }} />
              <Button
                text="Metamask"
                onPress={() =>
                  useWallet
                    .getState()
                    .openApp?.(
                      'metamask',
                      `wc?uri=${encodeURIComponent(
                        useWallet.getState().wcUri || ''
                      )}`
                    )
                }
              />
            </View>
          )}
        </>
      )}
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

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20
  },
  login: {
    padding: 15
  },
  loginMessage: {
    color: 'white',
    fontFamily: 'HelveticaNowRegular',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20
  }
});

export default WalletScreen;
