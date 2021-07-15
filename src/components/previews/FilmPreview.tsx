import { InternetCameraTypes } from '@internetcamera/sdk';
import { useNavigation } from '@react-navigation/native';
import { BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import useClaimableFilmMetadata from '../../features/useClaimableFilmMetadata';
import useWallet from '../../features/useWallet';
import FilmProgressIcon from './FilmProgressIcon';

const FilmPreview = ({
  film,
  amount
}: {
  film: InternetCameraTypes.Film;
  amount?: BigNumberish;
}) => {
  const navigation = useNavigation();
  const account = useWallet(state => state.account);
  const { data: claimableFilmMetadata } = useClaimableFilmMetadata(
    film,
    account
  );
  const disabled = !amount && !claimableFilmMetadata?.canClaim;
  return (
    <Pressable
      style={state => [styles.container, state.pressed ? styles.pressed : null]}
      onPress={() => {
        Haptics.impactAsync();
        navigation.navigate('FilmRollStack', {
          screen: 'FilmRoll',
          filmAddress: film.filmAddress,
          title: `${film.symbol}`
        });
      }}
    >
      <View>
        <Text style={styles.name}>{film.name}</Text>
        <Text style={styles.symbol}>{film.symbol}</Text>

        {amount ? (
          <Text style={styles.message}>
            You have {parseInt(formatEther(amount)).toLocaleString()}.
          </Text>
        ) : claimableFilmMetadata?.canClaim ? (
          <Text style={styles.message}>
            You can get{' '}
            {claimableFilmMetadata.amountClaimablePerUser.toLocaleString()}.
          </Text>
        ) : disabled ? (
          <Text style={styles.message}></Text>
        ) : null}
      </View>

      <View style={styles.usedRow}>
        <View style={styles.progressIcon}>
          <FilmProgressIcon film={film} />
        </View>
        <Text style={styles.used}>
          {film.used} of{' '}
          {parseInt(formatEther(film.totalSupply)).toLocaleString()} photos
          taken
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginRight: 10,
    borderRadius: 5,
    width: 240,
    height: 150,
    justifyContent: 'space-between',
    backgroundColor: 'rgb(25,25,25)'
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  message: {
    color: 'white',
    fontFamily: 'HelveticaNowRegular',
    fontSize: 18
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  name: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 24,
    marginBottom: 5
  },
  symbol: {
    color: 'white',
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    marginBottom: 10
  },
  used: {
    color: 'white',
    fontFamily: 'HelveticaNowMicroRegular',
    fontSize: 12
  },
  usedRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressIcon: {
    marginRight: 8
  }
});

export default FilmPreview;
