import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const EmptyCameraFilmPicker = () => {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>You don't have any film</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 30
  },
  emptyText: {
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#aaa',
    paddingVertical: 5
  },
  bottomSheet: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    marginHorizontal: 40,
    width: Dimensions.get('window').width - 40,
    height: 400,
    backgroundColor: '#111',
    borderRadius: 50,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 15
  },
  modalText: {
    color: '#ccc',
    marginTop: 20,
    fontFamily: 'HelveticaNowRegular',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 36
  }
});

export default EmptyCameraFilmPicker;
