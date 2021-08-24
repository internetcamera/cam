import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActionSheetIOS
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AppStackParamsList } from '../../../App';
import usePhoto from '../../features/usePhoto';
import Button from '../ui/Button';
import * as Haptics from 'expo-haptics';
import * as MailComposer from 'expo-mail-composer';
import * as MediaLibrary from 'expo-media-library';
import * as WebBrowser from 'expo-web-browser';
import { InternetCameraAddresses } from '@internetcamera/sdk';
import dayjs from 'dayjs';
import AddressOrNamePreview from '../previews/AddressOrNamePreview';
import CachedImage from '../CachedImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import useWallet from '../../features/useWallet';
import { getBurnPhotoTypedData } from '@internetcamera/sdk/dist/utils/forwarder';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import { formatEther } from 'ethers/lib/utils';

const PhotoScreen = () => {
  const route = useRoute<RouteProp<AppStackParamsList, 'Photo'>>();
  const navigation = useNavigation();
  const { data: photo } = usePhoto(route.params.tokenId);
  const { account } = useWallet();
  const [_openedWallet, setOpenedWallet] = useState(false);
  const [_signature, setSignature] = useState<string>();
  const onSharePress = async () => {
    if (!photo) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        url: `https://cam.internet.camera/film/${photo.film.id}/${photo.filmIndex}`
      },
      () => null,
      () => null
    );
  };
  useEffect(() => {
    if (!photo) return;
    navigation.setOptions({
      title: `$${photo.film.symbol}   № ${
        parseInt(`${photo.filmIndex}`) + 1
      } of ${parseInt(formatEther(photo.film.totalSupply))}`,
      headerTitleStyle: {
        color: `hsl(${
          parseInt(photo.film.id.slice(-9) || '0', 16) % 360
        }, 100%, 70%)`
      },
      headerRight: () => (
        <Pressable onPress={onSharePress}>
          <MaterialCommunityIcons name="share" size={24} color="white" />
        </Pressable>
      )
    });
  }, [photo]);
  const onMenuClick = () => {
    if (!photo) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Cancel',
          'Share',
          'Save to iOS Photos',
          !account || account.toLowerCase() != photo.owner.address.toLowerCase()
            ? 'Report'
            : 'Delete'
        ],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 3,
        tintColor: '#fff',
        title: `${photo.film.symbol} – № ${parseInt(`${photo.filmIndex}`) + 1}`
      },
      async buttonIndex => {
        if (buttonIndex === 1) {
          ActionSheetIOS.showShareActionSheetWithOptions(
            {
              url: `https://internet.camera/explorer/film/${photo.film.id}`
            },
            () => null,
            () => null
          );
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
              photo.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
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
          if (
            !account ||
            account.toLowerCase() != photo.owner.address.toLowerCase()
          ) {
            MailComposer.composeAsync({
              recipients: ['reports@internet.camera'],
              subject: `Reporting Photo [${photo.id}]`,
              body: `Reporting Photo [${
                photo.id
              }]\n\nSent using Cam on ${dayjs().format('MMMM D, YYYY h:mmaZZ')}`
            });
          } else {
            const jsonRpcProvider = getJsonRpcProvider();
            const typedData = await getBurnPhotoTypedData(
              photo.id,
              account,
              80001,
              jsonRpcProvider
            );
            const signTypedData = useWallet.getState().signTypedData;
            if (!signTypedData) throw new Error('Wallet not ready to sign!');
            setTimeout(() => {
              setOpenedWallet(true);
            }, 500);
            const signature = await signTypedData(JSON.stringify(typedData));
            setSignature(signature);
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
            useWallet.getState().addPendingTransaction(response.hash);
            navigation.navigate('Activity');
          }
        }
      }
    );
  };

  if (!photo) return null;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        onLongPress={onMenuClick}
        style={state => [state.pressed ? styles.pressed : null]}
      >
        <CachedImage
          style={{ aspectRatio: photo.width / photo.height }}
          source={{
            uri: photo.image.replace(
              'ipfs://',
              'https://ipfs-cdn.internet.camera/ipfs/'
            )
          }}
        />
      </Pressable>
      <View style={styles.meta}>
        <Text style={styles.creator}>
          Posted by{' '}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Profile', {
                walletAddress: photo.creator.address
              });
            }}
            style={{ marginBottom: -3 }}
          >
            <AddressOrNamePreview
              address={photo.creator.address}
              style={[
                styles.creator,
                {
                  fontFamily: 'HelveticaNowBold',
                  fontSize: 16
                }
              ]}
            />
          </Pressable>{' '}
          on {dayjs.unix(photo.createdAt).format('MMMM D, YYYY [at] h:mma')}
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          text="Share this photo  ↗"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            ActionSheetIOS.showShareActionSheetWithOptions(
              {
                url: `https://cam.internet.camera/film/${photo.film.id}/${photo.filmIndex}`
              },
              () => null,
              () => null
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
          text="View in Internet Camera Explorer  ↗"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              `https://internet.camera/explorer/film/${photo.film.id}/${photo.filmIndex}?tokenId=${photo.id}`,
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
          text="View in Block Explorer  ↗"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              `https://mumbai.polygonscan.com/token/${InternetCameraAddresses[80001].camera}?a=${photo.id}`,
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
        <View style={{ height: 10 }} />
        <Button
          text="View in OpenSea  ↗"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              `https://testnets.opensea.io/assets/mumbai/${InternetCameraAddresses[80001].camera}/${photo.id}`,
              { controlsColor: '#FFFFFF', toolbarColor: '#000000' }
            );
          }}
          style={{
            justifyContent: 'flex-start',
            padding: 15,
            backgroundColor: 'hsl(220, 70%, 55%)'
          }}
          textStyle={{ fontFamily: 'HelveticaNowBold' }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80
  },
  meta: {
    padding: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginBottom: 15
  },
  name: {
    fontFamily: 'HelveticaNowBold',
    color: '#fff',
    fontSize: 24,
    marginBottom: 5
  },
  description: {
    color: '#ccc',
    fontFamily: 'HelveticaNowRegular',
    fontSize: 16,
    marginBottom: 10
  },
  pressed: {
    opacity: 0.8
  },
  creator: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'HelveticaNowRegular'
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
    paddingHorizontal: 15,
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  }
});

export default PhotoScreen;
