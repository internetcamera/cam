import React, { useEffect, useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import PhotoPreview from '../previews/PhotoPreview';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import useRefreshing from '../../features/useRefreshing';
import EmptyPhotoList from '../empty/EmptyPhotoList';
import useHomeFeed from '../../features/useHomeFeed';
import useWallet from '../../features/useWallet';
import { HomeTabsParamList } from '../navigation/HomeStack';
import useScrollToTop from '../../features/useScrollToTop';

const FeedScreen = () => {
  const { params } = useRoute<RouteProp<HomeTabsParamList, 'Home'>>();
  const { title, feed } = params;
  const account = useWallet(state => state.account);
  const { data, refresh, loading } = useHomeFeed(
    feed == 'home' ? account || undefined : undefined
  );
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) navigation.dangerouslyGetParent()?.setOptions({ title });
  }, [title, isFocused]);
  const { refreshControl } = useRefreshing(refresh);
  const ref = useRef<FlatList>(null);
  useScrollToTop(ref);

  if (loading) return null;
  return (
    <FlatList
      ref={ref}
      style={styles.container}
      data={data || []}
      keyExtractor={item => item.id}
      renderItem={photo => <PhotoPreview photo={photo.item} />}
      initialNumToRender={3}
      refreshControl={refreshControl}
      ListEmptyComponent={<EmptyPhotoList />}
      showsVerticalScrollIndicator={data && data.length > 0}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        height: data && data.length > 0 ? 'auto' : '100%',
        paddingBottom: 40
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5
  }
});

export default FeedScreen;
