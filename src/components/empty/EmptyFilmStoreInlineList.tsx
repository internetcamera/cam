import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const EmptyFilmStoreInlineList = () => {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No film in your wallet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(15,15,15)',
    width: Dimensions.get('window').width - 30
  },
  emptyText: {
    paddingVertical: 30,
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#888'
  }
});

export default EmptyFilmStoreInlineList;
