import React, { useEffect, useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
  RouteProp,
  useIsFocused,
  useRoute,
  useScrollToTop
} from '@react-navigation/native';
import EmptyActivityList from '../empty/EmptyActivityList';
import useRefreshing from '../../features/useRefreshing';
import ActivityPreview from '../previews/ActivityPreview';
import { FilmRollStackParamsList } from '../navigation/FilmRollStack';
import useActivityForFilm from '../../features/useActivityForFilm';

const FilmRollActivityScreen = () => {
  const { params } =
    useRoute<RouteProp<FilmRollStackParamsList, 'FilmRollActivity'>>();
  const { data, refresh } = useActivityForFilm(params.filmAddress);
  const { refreshControl } = useRefreshing(refresh);
  const ref = useRef<FlatList>(null);
  useScrollToTop(ref);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) refresh();
  }, [isFocused]);
  if (!data) return null;

  return (
    <FlatList
      ref={ref}
      data={data.transferEvents}
      refreshControl={refreshControl}
      contentContainerStyle={{
        height: data.transferEvents.length > 0 ? 'auto' : '100%',
        paddingBottom: 40
      }}
      ListEmptyComponent={<EmptyActivityList />}
      showsVerticalScrollIndicator={data.transferEvents.length > 0}
      showsHorizontalScrollIndicator={false}
      renderItem={data => <ActivityPreview transferEvent={data.item} />}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default FilmRollActivityScreen;
