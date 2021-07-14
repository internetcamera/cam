import React, { useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import * as FileSystem from 'expo-file-system';

const CachedImage = ({
  source,
  style,
  width,
  height,
  ...props
}: {
  source: { uri?: string };
  style?: StyleProp<ImageStyle>;
  width?: number;
  height?: number;
}) => {
  const [imgURI, setImgURI] = useState<string>();
  useEffect(() => {
    if (!source.uri) {
      setImgURI(undefined);
      return;
    }
    const filesystemURI = getImageFilesystemKey(source.uri);
    loadImage(filesystemURI, source.uri);
  }, [source.uri]);

  const getImageFilesystemKey = (remoteURI: string) => {
    const hashed = remoteURI.split('/').pop();
    return `${FileSystem.cacheDirectory}${hashed}`;
  };

  const loadImage = async (filesystemURI: string, remoteURI: string) => {
    try {
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists) {
        setImgURI(filesystemURI);
        return;
      }
      const imageObject = await FileSystem.downloadAsync(
        remoteURI,
        filesystemURI
      );
      setImgURI(imageObject.uri);
    } catch (err) {
      console.log('Image loading error:', err);
      setImgURI(remoteURI);
    }
  };
  return (
    <Image
      width={width}
      height={height}
      style={style}
      {...props}
      source={{ uri: imgURI || source.uri }}
    />
  );
};

export default React.memo(
  CachedImage,
  (prevProps, newProps) => prevProps.source.uri == newProps.source.uri
);
