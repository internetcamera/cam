import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ActionSheetIOS,
  Share
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useWallet from '../../features/useWallet';
import AddressOrNamePreview from '../previews/AddressOrNamePreview';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useRefreshing from '../../features/useRefreshing';
import usePhotosInWallet from '../../features/usePhotosInWallet';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
//@ts-ignore
import MasonryList from 'react-native-masonry-list';
import * as FileSystem from 'expo-file-system';

const WalletScreen = () => {
  const account = useWallet(state => state.account);
  const navigation = useNavigation();
  const { data, refresh } = usePhotosInWallet(account || undefined);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        account ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Settings');
            }}
          >
            <Ionicons name="ios-settings-sharp" size={22} color="#ccc" />
          </Pressable>
        ) : null,
      headerRight: () =>
        account ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              useWallet.getState().disconnect?.();
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

  const onLongPressImage = (index: number) => {
    if (!data) throw new Error('data is not defined');
    const photo = data[index];
    console.log(data, index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Share', 'Save to iOS Photos', 'Delete'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 3,
        tintColor: '#fff',
        title: `${photo.film.symbol} – № ${parseInt(`${photo.filmIndex}`) + 1}`
      },
      async buttonIndex => {
        if (buttonIndex === 1) {
          console.log(buttonIndex);
          Share.share({
            url: `https://website-internet-camera.vercel.app/explorer/film/${photo.film.id}`
          });
        } else if (buttonIndex === 2) {
          const permission = await MediaLibrary.requestPermissionsAsync();
          if (permission.granted) {
            const dirInfo = await FileSystem.getInfoAsync(
              FileSystem.cacheDirectory + 'photo/'
            );
            if (!dirInfo.exists) {
              console.log("Directory doesn't exist, creating...");
              await FileSystem.makeDirectoryAsync(
                FileSystem.cacheDirectory + 'photo/',
                {
                  intermediates: true
                }
              );
            }
            await FileSystem.downloadAsync(
              photo.image.replace(
                'ipfs://',
                'https://ipfs-cdn.internet.camera/ipfs/'
              ),
              FileSystem.cacheDirectory +
                'photo/' +
                photo.image.replace('ipfs://', '') +
                '.jpg'
            );

            await MediaLibrary.saveToLibraryAsync(
              FileSystem.cacheDirectory +
                'photo/' +
                photo.image.replace('ipfs://', '') +
                '.jpg'
            );
            alert('Saved!');
          } else {
            alert("You don't have permission.");
          }
        } else if (buttonIndex == 3) {
          alert('Available in the next release');
        }
      }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={account ? refreshControl : undefined}
    >
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
            gradient={['#4462FE', '#2344F1']}
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
            gradient={['#F39200', '#B36013']}
          />
        </View>
      )}
      {data && (
        <MasonryList
          images={data.map(item => ({
            uri: item.image.replace(
              'ipfs://',
              'https://ipfs-cdn.internet.camera/ipfs/'
            ),
            dimensions: {
              width: item.width,
              height: item.height
            }
          }))}
          backgroundColor="#000"
          onPressImage={(item: object, number: number) => {
            navigation.navigate('Photo', { tokenId: data[number].id });
          }}
          onLongPressImage={(item: object, number: number) =>
            onLongPressImage(number)
          }
          listContainerStyle={{ paddingBottom: 80, paddingTop: 20 }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30
  },
  header: {
    alignItems: 'center',
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
