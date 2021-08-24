import { TransferEvent } from '@internetcamera/sdk/dist/types';
import dayjs from 'dayjs';
import { formatEther } from 'ethers/lib/utils';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { InternetCameraAddresses } from '@internetcamera/sdk';
import useWallet from '../../features/useWallet';
import AddressOrNamePreview from './AddressOrNamePreview';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import CachedImage from '../CachedImage';

const ActivityPreview = ({
  transferEvent
}: {
  transferEvent: TransferEvent;
}) => {
  const account = useWallet(state => state.account);
  const navigation = useNavigation();
  const fromName =
    transferEvent.from.address.toLowerCase() == account?.toLowerCase() ? (
      'You'
    ) : transferEvent.from.address.toLowerCase() ==
      InternetCameraAddresses[80001].camera.toLowerCase() ? (
      'Internet Camera'
    ) : transferEvent.from.address.toLowerCase() ==
      (
        transferEvent.film?.id ||
        transferEvent.photo?.film?.id ||
        ''
      ).toLowerCase() ? (
      `${transferEvent.film?.symbol || transferEvent.photo?.film.symbol}` || ''
    ) : (
      <AddressOrNamePreview
        address={transferEvent.from.address}
        style={{ fontFamily: 'HelveticaNowBold', fontSize: 14 }}
      />
    );
  const toName =
    transferEvent.to.address.toLowerCase() == account?.toLowerCase() ? (
      'You'
    ) : transferEvent.to.address.toLowerCase() ==
      InternetCameraAddresses[80001].camera.toLowerCase() ? (
      'Internet Camera'
    ) : transferEvent.to.address.toLowerCase() ==
      (
        transferEvent.film?.id ||
        transferEvent.photo?.film?.id ||
        ''
      ).toLowerCase() ? (
      `${transferEvent.film?.symbol || transferEvent.photo?.film.symbol}` || ''
    ) : (
      <AddressOrNamePreview
        address={transferEvent.to.address}
        style={{ fontFamily: 'HelveticaNowBold', fontSize: 14 }}
      />
    );
  return (
    <Pressable
      style={state => [styles.preview, state.pressed ? styles.pressed : null]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (transferEvent.type == 'PHOTO')
          navigation.navigate('Photo', { tokenId: transferEvent.photo?.id });
        else if (transferEvent.type == 'FILM')
          WebBrowser.openBrowserAsync(
            `https://mumbai.polygonscan.com/tx/${transferEvent.txHash}`,
            {
              controlsColor: '#FFFFFF',
              toolbarColor: '#000000'
            }
          );
        // navigation.navigate('FilmRollStack', {
        //   screen: 'FilmRoll',
        //   filmAddress: transferEvent.film?.id,
        //   title: `$${transferEvent.film?.symbol}`
        // });
      }}
    >
      <View>
        {transferEvent.type == 'PHOTO' &&
        transferEvent.to.address.toLowerCase() !=
          '0x0000000000000000000000000000000000000000' ? (
          <CachedImage
            source={{
              uri: (transferEvent.photo?.image as string).replace(
                'ipfs://',
                'https://ipfs-cdn.internet.camera/ipfs/'
              )
            }}
            width={transferEvent.photo?.width}
            height={transferEvent.photo?.height}
            style={{ aspectRatio: 1, width: 66 }}
          />
        ) : (
          <View
            style={{
              width: 66,
              aspectRatio: 1,
              backgroundColor: `hsl(${
                parseInt(transferEvent.film?.id.slice(-9) || '0', 16) % 360
              }, 100%, 20%)`,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {transferEvent.type == 'FILM' && (
              <Text
                style={[
                  {
                    fontFamily: 'JetBrainsMono',
                    fontSize: 12,
                    color: '#ccc'
                  }
                ]}
              >
                {parseFloat(
                  formatEther(transferEvent.amount || 0)
                ).toLocaleString()}{' '}
                FILM
              </Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.meta}>
        {transferEvent.to.address.toLowerCase() ==
        '0x0000000000000000000000000000000000000000' ? (
          <Text style={styles.text}>You deleted a photo.</Text>
        ) : transferEvent.from.address.toLowerCase() ==
          '0x0000000000000000000000000000000000000000' ? (
          <Text style={styles.text}>
            {toName}{' '}
            {transferEvent.type == 'PHOTO' ? (
              <>posted a photo to {transferEvent.photo?.film?.symbol}</>
            ) : (
              <>
                got{' '}
                {parseFloat(
                  formatEther(transferEvent.amount || 0)
                ).toLocaleString()}{' '}
                {transferEvent.film?.symbol} Film
              </>
            )}
            .
          </Text>
        ) : (
          <Text style={styles.text}>
            {fromName} sent {toName}{' '}
            {transferEvent.type == 'FILM' ? (
              <>
                {parseFloat(
                  formatEther(transferEvent.amount || 0)
                ).toLocaleString()}{' '}
                {transferEvent.film?.symbol} Film
              </>
            ) : (
              <>a photo from {transferEvent.photo?.film.symbol}</>
            )}
            .
          </Text>
        )}
        <Text style={styles.date}>
          {dayjs
            .unix(transferEvent.createdAt)
            .format('MMMM D, YYYY [at] h:mma')}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  preview: {
    borderBottomColor: '#222',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  pressed: { opacity: 0.7 },
  meta: {
    padding: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  gap: {
    width: 10
  },
  text: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 14,
    flexWrap: 'wrap',
    marginBottom: 3
  },
  date: {
    color: '#777',
    fontFamily: 'HelveticaNowMicroRegular',
    fontSize: 12
  }
});

export default ActivityPreview;

// onLongPress={() =>
//   WebBrowser.openBrowserAsync(
//     `https://mumbai.polygonscan.com/tx/${transferEvent.txHash}`,
//     {
//       dismissButtonStyle: 'close',
//       toolbarColor: '#000',
//       secondaryToolbarColor: '#000',
//       controlsColor: '#ffffff'
//     }
//   )
// }
