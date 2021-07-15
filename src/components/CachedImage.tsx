import React from 'react';

import { Image, ImageStyle, StyleProp } from 'react-native';
// import { Image } from 'react-native-expo-image-cache';

const CachedImage = ({
  source,
  width,
  height,
  style,
  ...props
}: {
  source: { uri: string };
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}) => {
  return (
    <Image
      source={source}
      style={[{ backgroundColor: '#111' }, style]}
      {...props}
    />
  );
};

export default CachedImage;
