import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import Spacer from '../ui/Spacer';
import Button from '../ui/Button';

const FilmExplainerSheet = () => {
  const pagerRef = useRef<PagerView>(null);
  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        style={styles.innerContainer}
        initialPage={0}
        showPageIndicator
        pageMargin={20}
        ref={pagerRef}
      >
        <View key="Intro" style={styles.page}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="film" size={40} color="#ccc" />
            <MaterialCommunityIcons name="arrow-right" size={40} color="#ccc" />
            <MaterialCommunityIcons name="camera" size={40} color="#ccc" />
          </View>
          <View style={{ height: 30 }} />
          <Text style={styles.text}>
            Cam uses Film to post photos.
            {'\n'}
            {'\n'}
            Film is a new, open format for creating social photo albums,
            collections, or feeds.
            {'\n'}
            {'\n'}
            Every roll of film has a limited supply, and each photo posted
            through Cam costs 1 unit of film.
            {'\n'}
            {'\n'}
            Film covers all processing and minting costs, and guarantees long
            term availability on a decentralized file storage network.
          </Text>
          <Spacer />
          <Button
            text="•••"
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            onPress={() => {
              pagerRef.current?.setPage(1);
            }}
          />
          <View style={{ height: 40 }} />
        </View>
        <View key="Why" style={styles.page}>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome5 name="hand-sparkles" size={40} color="#ccc" />
            <MaterialCommunityIcons name="arrow-right" size={40} color="#ccc" />
            <MaterialCommunityIcons name="film" size={40} color="#ccc" />
          </View>
          <View style={{ height: 30 }} />
          <Text style={styles.text}>
            Film is easy for anyone to create.
            {'\n'}
            {'\n'}
            You can make Film for road-trips, weddings, live events, messaging
            groups, or elaborate art projects.
            {'\n'}
            {'\n'}
            You just pick a template, set a size for the roll, and optionally
            add in your own customizations or filters.
            {'\n'}
            {'\n'}
            Film is 100% free to create while Cam is on TestFlight, and will be
            very affordable once fully launched.
          </Text>
          <Spacer />
          <Button
            text="•••"
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            onPress={() => {
              pagerRef.current?.setPage(2);
            }}
          />
          <View style={{ height: 40 }} />
        </View>
        <View key="How" style={styles.page}>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome5 name="money-bill-wave" size={40} color="#ccc" />
            <MaterialCommunityIcons name="arrow-right" size={40} color="#ccc" />
            <FontAwesome5 name="hand-sparkles" size={40} color="#ccc" />
          </View>
          <View style={{ height: 30 }} />
          <Text style={styles.text}>
            Film creators can make money, entirely on their own terms.{'\n'}
            {'\n'}The Film format is an extension of ERC20, the cryptocurrency
            standard used on Ethereum. That means there's a variety of services
            to help you sell film in different ways.{'\n'}
            {'\n'}Sell film for fixed prices or list some on open
            stock-market-like exchanges. Anything is possible, and Cam takes
            zero extra fees.
          </Text>
          <Spacer />
          <Button
            text="•••"
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            onPress={() => {
              pagerRef.current?.setPage(3);
            }}
          />
          <View style={{ height: 40 }} />
        </View>
        <View key="How3" style={styles.page}>
          <MaterialCommunityIcons name="film" size={40} color="#ccc" />
          <View style={{ height: 30 }} />
          <Text style={styles.text}>
            You need film to take photos in CAM.{'\n'}
            {'\n'}Film is a new digital currency format that can be spent to
            post a photo.
          </Text>
          <Spacer />
          <Button
            text="•••"
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            onPress={() => {
              pagerRef.current?.setPage(4);
            }}
          />
          <View style={{ height: 40 }} />
        </View>
        <View key="How4" style={styles.page}>
          <MaterialCommunityIcons name="film" size={40} color="#ccc" />
          <View style={{ height: 30 }} />
          <Text style={styles.text}>
            You need film to take photos in CAM.{'\n'}
            {'\n'}Film is a new digital currency format that can be spent to
            post a photo.
          </Text>
          <Spacer />
        </View>
      </PagerView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#1a1a1a',
    marginTop: 80,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  innerContainer: {
    flex: 1
  },
  page: {
    paddingHorizontal: 20
  },
  text: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 24
  },
  buttonStyle: {
    padding: 15,
    width: '100%'
  },
  buttonTextStyle: {
    fontSize: 18
  }
});

export default FilmExplainerSheet;
