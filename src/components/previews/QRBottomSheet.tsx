import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';

const QRBottomSheet = ({ data }: { data: string }) => {
  return (
    <Portal>
      <BottomSheet
        snapPoints={[0, 300]}
        index={1}
        backgroundComponent={({ style }: BottomSheetBackgroundProps) => (
          <View style={[style, { backgroundColor: 'hsl(250, 100%, 50%)' }]} />
        )}
      >
        <View style={{ flex: 1, height: 300, padding: 20 }}>
          <Text style={styles.text}>{data}</Text>
        </View>
      </BottomSheet>
    </Portal>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 16
  }
});

export default QRBottomSheet;
