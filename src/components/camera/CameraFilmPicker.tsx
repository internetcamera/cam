import { formatEther } from 'ethers/lib/utils';
import React, { useEffect } from 'react';
import { Text, StyleSheet, FlatList, Pressable } from 'react-native';
import useFilmInWallet from '../../features/useFilmInWallet';
import * as Haptics from 'expo-haptics';
import { useIsFocused } from '@react-navigation/native';
import useWallet from '../../features/useWallet';
import EmptyCameraFilmPicker from '../empty/EmptyCameraFilmPicker';

const CameraFilmPicker = ({
  selectedFilmAddress,
  setSelectedFilmAddress
}: {
  selectedFilmAddress?: string;
  setSelectedFilmAddress: (address?: string) => void;
}) => {
  const account = useWallet(state => state.account);
  const { data: filmInWallet, refresh } = useFilmInWallet(
    account || '0x0000000000000000000000000000000000000000'
  );
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      refresh();
    }
  }, [isFocused]);
  useEffect(() => {
    if (!selectedFilmAddress && filmInWallet?.length > 0) {
      setSelectedFilmAddress(filmInWallet[0].film.id);
    }
    if (filmInWallet?.length === 0 && selectedFilmAddress != undefined) {
      setSelectedFilmAddress(undefined);
    }
  }, [filmInWallet?.length]);
  return (
    <FlatList
      style={styles.filmPicker}
      data={filmInWallet}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={data => (
        <Pressable
          onPress={() => {
            Haptics.impactAsync();
            setSelectedFilmAddress(data.item.film.id);
          }}
          style={[
            styles.filmPreview,
            {
              borderColor: `hsl(${
                parseInt(data.item.film.filmAddress.slice(-9) || '0', 16) % 360
              }, 100%, 70%)`
            },
            selectedFilmAddress === data.item.film.id
              ? styles.selectedFilmPreview
              : {}
          ]}
        >
          <Text
            style={[
              styles.filmSymbol,
              {
                color: `hsl(${
                  parseInt(data.item.film.filmAddress.slice(-9) || '0', 16) %
                  360
                }, 100%, 70%)`
              }
            ]}
          >
            ${data.item.film.symbol}
          </Text>
          <Text style={styles.amount}>
            № {parseInt(data.item.film.used) + 1} – You have{' '}
            {parseInt(formatEther(data.item.amount)).toLocaleString()} film
          </Text>
        </Pressable>
      )}
      contentContainerStyle={{
        paddingLeft: 15,
        paddingRight: 5
      }}
      ListEmptyComponent={<EmptyCameraFilmPicker />}
    />
  );
};

const styles = StyleSheet.create({
  filmPicker: {
    flexGrow: 0,
    flexDirection: 'row',
    paddingVertical: 15,
    backgroundColor: 'hsl(0, 0%, 5%)',
    borderTopColor: 'rgb(25,25,25)',
    borderTopWidth: 1
  },
  filmPreview: {
    padding: 10,
    backgroundColor: `black`,
    borderRadius: 5,
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 1,
    opacity: 0.25
  },
  selectedFilmPreview: {
    borderWidth: 1,
    opacity: 1
  },
  filmSymbol: {
    color: 'white',
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    marginBottom: 2
  },
  amount: {
    color: '#aaa',
    fontFamily: 'HelveticaNowMicroRegular',
    fontSize: 11
  }
});

export default CameraFilmPicker;
