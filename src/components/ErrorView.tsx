import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const ErrorView = ({ error }: { error: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        There was an error getting data from The Graph.{'\n'}
        Please try again in a little bit.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 15,
    backgroundColor: 'red',
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 16
  }
});

export default ErrorView;
