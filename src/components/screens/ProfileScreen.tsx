import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppStackParamsList } from '../../../App';
import useENSNameOrAddress from '../../features/useENSNameOrAddress';

const ProfileScreen = () => {
  const { params } = useRoute<RouteProp<AppStackParamsList, 'Profile'>>();
  const navigation = useNavigation();
  const name = useENSNameOrAddress(params.walletAddress);
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);
  return <View></View>;
};

export default ProfileScreen;
