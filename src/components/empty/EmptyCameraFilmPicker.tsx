import BottomSheet, { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EmptyCameraFilmPicker = () => {
  const ref = useRef<BottomSheet>(null);
  const [visible, setVisible] = useState(false);
  const onPress = () => {
    setVisible(true);
    ref.current?.snapTo(1);
  };
  return (
    <View style={styles.empty}>
      <Pressable onPress={onPress}>
        <Text style={styles.emptyText}>You don't have any film</Text>
      </Pressable>
      <Portal>
        <BottomSheet
          ref={ref}
          index={0}
          snapPoints={['0%', '100%']}
          backgroundComponent={({ style }: BottomSheetBackgroundProps) => (
            <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.9)' }]} />
          )}
        >
          <View style={[styles.bottomSheet, { opacity: visible ? 1 : 0 }]}>
            <View style={styles.modal}>
              <MaterialCommunityIcons name="film" size={40} color="#ccc" />
              <Text style={styles.modalText}>
                You need film to take photos in CAM.{'\n'}
                {'\n'}Film is a new digital currency format that can be spent to
                post a photo.
              </Text>
            </View>
          </View>
        </BottomSheet>
      </Portal>
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
