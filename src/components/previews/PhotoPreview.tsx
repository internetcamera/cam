import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActionSheetIOS
} from 'react-native';
import { InternetCameraTypes } from '@internetcamera/sdk';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import AddressOrNamePreview from './AddressOrNamePreview';
import { formatEther } from 'ethers/lib/utils';
import { Entypo } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as MailComposer from 'expo-mail-composer';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import CachedImage from '../CachedImage';
import useWallet from '../../features/useWallet';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import { getBurnPhotoTypedData } from '@internetcamera/sdk/dist/utils/forwarder';

const PhotoPreview = ({
  photo,
  hideHeader,
  hideFooter
}: {
  photo: InternetCameraTypes.Photo;
  hideHeader?: boolean;
  hideFooter?: boolean;
}) => {
  const navigation = useNavigation();
  const { account } = useWallet();
  const [_openedWallet, setOpenedWallet] = useState(false);
  const [_signature, setSignature] = useState<string>();
  const onMenuClick = () => {
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
              url: `https://cam.internet.camera/film/${photo.film.id}/${photo.filmIndex}`
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
  return (
    <View style={styles.container}>
      {!hideHeader && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('FilmRollStack', {
              screen: 'FilmRoll',
              title: `${photo.film.symbol}`,
              filmAddress: photo.film.id
            });
          }}
          style={state => [
            styles.header,
            state.pressed ? styles.pressed : null
          ]}
        >
          <Text
            style={[
              styles.filmName,
              {
                color: `hsl(${
                  parseInt(photo.film.id.slice(-9) || '0', 16) % 360
                }, 100%, 70%)`
              }
            ]}
          >
            ${photo.film.symbol}
          </Text>
          <Text style={styles.filmNumber}>
            № {parseInt(`${photo.filmIndex}`) + 1} of{' '}
            {parseInt(formatEther(photo.film.totalSupply)).toLocaleString()}{' '}
          </Text>
        </Pressable>
      )}
      {photo.owner.address.toLowerCase() !=
      '0x0000000000000000000000000000000000000000' ? (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Photo', {
              tokenId: photo.id
            });
          }}
          onLongPress={onMenuClick}
          style={state => [state.pressed ? styles.pressed : null]}
        >
          <CachedImage
            source={{
              uri: photo.image.replace(
                'ipfs://',
                'https://ipfs-cdn.internet.camera/ipfs/'
              )
            }}
            width={photo.width}
            height={photo.height}
            style={{ aspectRatio: photo.width / photo.height }}
          />
        </Pressable>
      ) : (
        <View
          style={[styles.noPhoto, { aspectRatio: photo.width / photo.height }]}
        />
      )}
      {!hideFooter && (
        <View style={styles.meta}>
          <Text style={styles.date}>
            Posted by{' '}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Profile', {
                  walletAddress: photo.creator.address
                });
              }}
              style={styles.profilePressable}
            >
              <AddressOrNamePreview
                address={photo.creator.address}
                style={[
                  styles.date,
                  { color: 'white', fontFamily: 'HelveticaNowBold' }
                ]}
              />
            </Pressable>{' '}
            on {dayjs.unix(photo.createdAt).format('MMMM D [at] h:mma')}
          </Text>
          <Pressable onPress={onMenuClick} style={styles.menu}>
            <Entypo name="dots-three-horizontal" size={18} color="#ccc" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pressed: {
    opacity: 0.8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 10
  },
  noPhoto: { width: '100%', backgroundColor: '#111' },
  filmName: {
    fontFamily: 'HelveticaNowMicroBold',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 14
  },
  filmNumber: {
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    color: '#fff'
  },
  meta: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 60,
    borderBottomColor: '#222',
    borderBottomWidth: 1
  },
  date: {
    fontFamily: 'HelveticaNowRegular',
    color: '#777',
    fontSize: 14,
    flexDirection: 'row'
  },
  profilePressable: { marginTop: -2 },
  menu: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginVertical: -10,
    marginRight: -15
  }
});

export default React.memo(PhotoPreview, (a, b) => a.photo.id == b.photo.id);
