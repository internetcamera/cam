import React from 'react';
import { View, StyleSheet } from 'react-native';
import CameraView from '../camera/CameraView';

const CameraScreen = () => {
  return (
    <View style={styles.container}>
      <CameraView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CameraScreen;
