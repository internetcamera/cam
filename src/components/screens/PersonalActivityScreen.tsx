import React, { useEffect, useRef } from 'react';
import { StyleSheet, FlatList, Pressable, Text } from 'react-native';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import useActivityForAddress from '../../features/useActivityForAddress';
import EmptyActivityList from '../empty/EmptyActivityList';
import useRefreshing from '../../features/useRefreshing';
import ActivityPreview from '../previews/ActivityPreview';
import useWallet from '../../features/useWallet';
import * as WebBrowser from 'expo-web-browser';

const PersonalActivityScreen = () => {
  const account = useWallet(state => state.account);
  const { data: activity, refresh } = useActivityForAddress(
    account || undefined
  );
  const { refreshControl, handleRefresh } = useRefreshing(refresh);
  const ref = useRef<FlatList>(null);
  useScrollToTop(ref);

  const isFocused = useIsFocused();
  useEffect(() => {
    refresh();
  }, [isFocused]);

  const pendingTx = useWallet(state => state.pendingTransactions);
  useEffect(() => {
    handleRefresh();
  }, [pendingTx.length]);

  const data = [
    ...pendingTx.map(txHash => ({
      type: 'pending',
      key: txHash,
      data: { txHash }
    })),
    ...activity.map(activity => ({
      type: 'activity',
      key: activity.id,
      data: activity
    }))
  ];
  return (
    <FlatList
      ref={ref}
      data={account ? data : []}
      refreshControl={refreshControl}
      contentContainerStyle={{
        height: account && data.length > 0 ? 'auto' : '100%'
      }}
      ListEmptyComponent={<EmptyActivityList />}
      showsVerticalScrollIndicator={data.length > 0}
      showsHorizontalScrollIndicator={false}
      renderItem={data =>
        data.item.type === 'activity' ? (
          <ActivityPreview transferEvent={data.item.data} />
        ) : data.item.type == 'pending' ? (
          <Pressable
            style={styles.pendingContainer}
            onPress={() => {
              WebBrowser.openBrowserAsync(
                `https://mumbai.polygonscan.com/tx/${data.item.data.txHash}`,
                { controlsColor: '#FFFFFF', toolbarColor: '#000000' }
              );
            }}
          >
            <Text style={styles.pendingText}>A transaction is pending...</Text>
          </Pressable>
        ) : null
      }
      keyExtractor={item => item.key}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'hsl(250,100%,30%)',
    height: 50
  },
  pendingText: {
    fontFamily: 'HelveticaNowBold',
    color: 'white'
  }
});

export default PersonalActivityScreen;
