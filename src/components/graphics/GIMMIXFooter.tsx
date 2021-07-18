import React from 'react';
import { View } from 'react-native';
import GIMMIX from './GIMMIX';
import GIMMIXSymbol from './GIMMIXSymbol';

const GIMMIXFooter = () => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GIMMIXSymbol />
      <GIMMIX />
    </View>
  );
};

export default GIMMIXFooter;
