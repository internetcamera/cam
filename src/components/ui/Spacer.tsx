import React from 'react';
import { View } from 'react-native';

const Spacer = () => {
  return <View style={{ flex: 1 }} />;
};

export default React.memo(Spacer);
