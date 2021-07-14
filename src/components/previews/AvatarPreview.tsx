import React from 'react';
import { View, StyleSheet } from 'react-native';

const AvatarPreview = ({
  address,
  size = 35
}: {
  address: string;
  size?: number;
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `#${address.slice(2, 8)}`,
          width: size - 1,
          height: size - 1,
          borderWidth: 1,
          borderColor: `#${
            address != '0x0000000000000000000000000000000000000000'
              ? address.slice(2, 8)
              : '333'
          }`
        }
      ]}
    ></View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50
  }
});

export default AvatarPreview;
