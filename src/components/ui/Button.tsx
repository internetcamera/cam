import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({
  text,
  onPress,
  gradient,
  style
}: {
  text: string;
  onPress: (
    event?: GestureResponderEvent
  ) => void | undefined | null | Promise<void | undefined | null>;
  gradient?: string[];
  style?: StyleProp<ViewStyle>;
}) => {
  const _onPress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(event);
  };
  return (
    <Pressable
      style={state => [
        styles.container,
        style,
        state.pressed ? styles.pressed : null
      ]}
      onPress={_onPress}
    >
      {gradient && <LinearGradient colors={gradient} style={styles.gradient} />}
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(20,20,20)',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    position: 'relative',
    overflow: 'hidden'
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'HelveticaNowRegular',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  }
});

export default Button;
