import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
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
import * as WebBrowser from 'expo-web-browser';
import { InternetCameraAddresses } from '@internetcamera/sdk';
import dayjs from 'dayjs';
import AddressOrNamePreview from '../previews/AddressOrNamePreview';
import CachedImage from '../CachedImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PhotoScreen = () => {
  const route = useRoute<RouteProp<AppStackParamsList, 'Photo'>>();
  const navigation = useNavigation();
  const { data: photo } = usePhoto(route.params.tokenId);

  const onSharePress = async () => {
    if (!photo) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        url: `https://website-internet-camera.vercel.app/explorer/film/${photo.film.filmAddress}/${photo.filmIndex}?tokenId=${photo.id}`
      },
      () => null,
      () => null
    );
  };

  useEffect(() => {
    if (!photo) return;
    navigation.setOptions({
      title: `${photo.film.symbol} – № ${parseInt(`${photo.filmIndex}`) + 1}`,
      headerRight: () => (
        <Pressable onPress={onSharePress}>
          <MaterialCommunityIcons name="share" size={24} color="white" />
        </Pressable>
      )
    });
  }, [photo]);
  if (!photo) return null;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CachedImage
        style={{ aspectRatio: photo.width / photo.height }}
        source={{
          uri: photo.image.replace(
            'ipfs://',
            'https://ipfs-cdn.internet.camera/ipfs/'
          )
        }}
      />
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
          text="Open in Internet Camera Explorer ↗"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              `https://website-internet-camera.vercel.app/explorer/film/${photo.film.filmAddress}/${photo.filmIndex}?tokenId=${photo.id}`,
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
          text="Open on PolygonScan ↗"
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
          text="Open on OpenSea ↗"
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

      <View style={styles.code}>
        {Object.keys(photo)
          .sort((a, b) => (a == 'id' ? -1 : a.localeCompare(b)))
          .map((key, i) => (
            <View
              style={[
                styles.codeLine,
                i == Object.keys(photo).length - 1
                  ? { marginBottom: 0, borderBottomWidth: 0 }
                  : null
              ]}
              key={key}
            >
              <Text style={styles.codeKey}>{key}</Text>
              <Text style={styles.codeValue}>
                {key == 'createdAt'
                  ? dayjs
                      .unix(photo.createdAt)
                      .format('MMMM D, YYYY [at] h:mma')
                  : JSON.stringify((photo as any)[key], null, 2)}
              </Text>
            </View>
          ))}
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
