import React, { useState } from 'react';
import { RefreshControl } from 'react-native';

const useRefreshing = (refresh: () => void) => {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };
  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor="#fff"
      titleColor="#fff"
    />
  );
  return { refreshing, handleRefresh, refreshControl };
};

export default useRefreshing;
