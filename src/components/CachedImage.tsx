import React from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import { Image } from 'react-native-expo-image-cache';

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
  return <Image uri={source.uri} style={style} {...props} />;
};

export default CachedImage;
