import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

const EmptyActivityList = () => {
  return (
    <View style={styles.empty}>
      <Entypo name="new" size={48} color="#aaa" />
      <Text style={styles.emptyText}>Nothing Here Yet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    marginTop: 15,
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#aaa'
  }
});

export default EmptyActivityList;
