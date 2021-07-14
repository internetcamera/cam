import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import useENSNameOrAddress from '../../features/useENSNameOrAddress';

const AddressOrNamePreview = ({
  address,
  style
}: {
  address: string;
  style?: StyleProp<TextStyle>;
}) => {
  const text = useENSNameOrAddress(address);
  return <Text style={[styles.text, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 14
  }
});

export default AddressOrNamePreview;
