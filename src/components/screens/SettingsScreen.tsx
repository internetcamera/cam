import React from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Text,
  Pressable,
  Linking,
  Alert
} from 'react-native';
import { version } from '../../../package.json';
import * as Haptics from 'expo-haptics';
import { Switch } from 'react-native-gesture-handler';
import { useENSStore } from '../../features/useENSNameOrAddress';
import { Entypo } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';
import GIMMIXFooter from '../graphics/GIMMIXFooter';

const SettingsScreen = () => {
  return (
    <>
      <SectionList
        sections={[
          {
            title: 'General',
            data: [
              {
                type: 'action',
                title: '•••',
                onPress: () => {}
              }
            ]
          },
          {
            title: 'Community & Contact',
            data: [
              {
                type: 'link',
                title: 'Follow @InternetCamera on Twitter',
                onPress: () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL('https://twitter.com/internetcamera');
                }
              },
              {
                type: 'link',
                title: 'Join the Internet Camera Discord',
                onPress: () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL('https://discord.gg/m5BWxCbBQV');
                }
              },
              {
                type: 'link',
                title: 'Email Internet Camera',
                onPress: () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  MailComposer.composeAsync({
                    recipients: ['hello@internet.camera']
                  });
                }
              }
            ]
          },
          {
            title: 'Advanced Settings',
            data: [
              {
                type: 'switch',
                title: 'Gasless transactions',
                onPress: () => {}
              },
              {
                type: 'action',
                title: 'Clear cache',
                onPress: () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(
                    'Clear Cache',
                    'Are you sure you want to clear the cache?',
                    [
                      {
                        text: 'Yes',
                        onPress: () => {
                          useENSStore.setState({ addressBook: {} }, true);
                          Alert.alert('Success', 'The cache has been cleared.');
                        },
                        style: 'destructive'
                      },
                      {
                        text: 'No',
                        style: 'cancel',
                        onPress: () => {}
                      }
                    ]
                  );
                }
              }
            ]
          }
        ]}
        keyExtractor={(_data, index) => `${index}`}
        renderItem={data =>
          data.item.type == 'switch' ? (
            <View style={styles.sectionItem}>
              <Text style={styles.sectionTitle}>{data.item.title}</Text>
              <Switch
                value={true}
                onChange={() => alert('Pending Rainbow L2 release.')}
              />
            </View>
          ) : data.item.type == 'action' || data.item.type == 'link' ? (
            <Pressable style={styles.sectionItem} onPress={data.item.onPress}>
              <Text style={styles.sectionTitle}>{data.item.title}</Text>
              {data.item.type == 'link' && (
                <Entypo name="chevron-right" size={18} color="#fff" />
              )}
            </Pressable>
          ) : null
        }
        renderSectionHeader={data => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{data.section.title}</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Text style={styles.version}>TESTFLIGHT RELEASE</Text>
            <Text style={styles.version}>PROTOCOL v{version}</Text>
            <Text style={styles.version}>CAM v{version}</Text>
            <Pressable
              style={state => [
                styles.gimmix,
                state.pressed && styles.gimmixPressed
              ]}
              onPress={() => {
                Haptics.impactAsync();
                Linking.openURL('https://twitter.com/gimmixorg');
              }}
            >
              <GIMMIXFooter />
            </Pressable>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10
  },
  text: {
    color: 'white',
    fontFamily: 'HelveticaNowRegular'
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
    paddingTop: 20,
    backgroundColor: '#000'
  },
  sectionHeaderText: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 18
  },
  sectionItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#222',
    borderBottomWidth: 1,
    backgroundColor: '#111'
  },
  sectionTitle: {
    color: 'white',
    fontFamily: 'HelveticaNowRegular',
    fontSize: 16
  },
  footer: {
    alignItems: 'center',
    marginTop: 30
  },
  version: {
    color: '#ccc',
    fontFamily: 'HelveticaNowMicroRegular',
    fontSize: 12,
    lineHeight: 28
  },
  gimmix: {
    marginTop: 30
  },
  gimmixPressed: {
    transform: [{ scale: 0.9 }]
  }
});

export default SettingsScreen;
