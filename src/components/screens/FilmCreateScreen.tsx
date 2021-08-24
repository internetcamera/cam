import {
  getDeployClaimableFilmTypedData,
  getDeployPersonalFilmTypedData
} from '@internetcamera/sdk/dist/utils/forwarder';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  KeyboardAvoidingView
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import useFilmFactoryTokenBalance from '../../features/useFilmFactoryTokenBalance';
import useWallet from '../../features/useWallet';
import { FilmStoreParamsList } from '../navigation/FilmStoreStack';
import Button from '../ui/Button';

const FilmCreateScreen = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [supply, setSupply] = useState('');
  const [amountClaimablePerUser, setAmountClaimablePerUser] = useState('');
  const [maxClaimsPerUser, setMaxClaimsPerUser] = useState('');
  const { account } = useWallet();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<FilmStoreParamsList, 'FilmCreate'>>();
  const { filmFactoryTokenBalance } = useFilmFactoryTokenBalance();

  useEffect(() => {
    navigation.setOptions({
      title: `Create ${
        params.model == 'personal'
          ? 'Personal'
          : params.model == 'claimable'
          ? 'Claimable'
          : ''
      } Film`
    });
  }, [params.model]);
  const createFilm = async () => {
    if (!account) return;
    const metadata = {
      name,
      symbol,
      totalSupply: parseFloat(formatEther(supply)),
      starts: dayjs().unix(),
      expires: dayjs().add(1000, 'years').unix(),
      factoryModel: 'personal',
      description,
      terms: '',
      unlisted: false
    };
    const { hash }: { hash: string } = await fetch(
      `https://ipfs.internet.camera/uploadJSON`,
      {
        method: 'POST',
        body: JSON.stringify(metadata),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(res => res.json());
    const jsonRpcProvider = getJsonRpcProvider();
    let typedData;
    if (params.model == 'personal')
      typedData = await getDeployPersonalFilmTypedData(
        name,
        symbol,
        hash,
        parseEther(supply),
        metadata.starts,
        metadata.expires,
        account,
        80001,
        jsonRpcProvider
      );
    else if (params.model == 'claimable')
      typedData = await getDeployClaimableFilmTypedData(
        name,
        symbol,
        hash,
        parseEther(supply),
        metadata.starts,
        metadata.expires,
        parseUnits(amountClaimablePerUser, 18),
        maxClaimsPerUser,
        account,
        80001,
        jsonRpcProvider
      );
    const signTypedData = useWallet.getState().signTypedData;
    if (!signTypedData) throw new Error('Wallet not ready to sign!');
    const signature = await signTypedData(JSON.stringify(typedData));
    let response: { hash: string };
    do {
      response = await fetch('https://tx.internet.camera/api/forward', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          data: typedData,
          signature
        })
      })
        .then(res => res.json())
        .catch(err => console.log(err));
      if (!response) await new Promise(r => setTimeout(r, 500));
    } while (response == undefined);

    useWallet.getState().addPendingTransaction(response.hash);

    setName('');
    setDescription('');
    setSupply('');
    setSymbol('');
    setMaxClaimsPerUser('');
    setAmountClaimablePerUser('');
    navigation.navigate('Activity');
  };
  const disabled =
    filmFactoryTokenBalance < parseInt(supply) ||
    supply == '' ||
    name == '' ||
    symbol == '';
  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      keyboardVerticalOffset={120}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formItem}>
          <Text style={styles.formTitle}>Name</Text>
          <Text style={styles.formLabel}>
            1 - 32 characters including spaces.
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.textInput}
            placeholder="Name"
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.formTitle}>Symbol</Text>
          <Text style={styles.formLabel}>
            1 - 10 uppercase alphanumeric characters. This will be prefixed with
            a $ in Cam. (e.g. $MYFILM)
          </Text>
          <TextInput
            value={symbol}
            onChange={e =>
              setSymbol(e.nativeEvent.text.toUpperCase().replace('$', ''))
            }
            style={styles.textInput}
            autoCapitalize="characters"
            placeholder="SYMBOL"
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.formTitle}>Size of Roll</Text>
          <Text style={styles.formLabel}>
            1 or more. This determines the number of photos that can be posted
            in this roll. You'll use $FILMFACTORY tokens for each film token you
            create. You have {filmFactoryTokenBalance.toLocaleString()} tokens
            to spend currently. You can get more in the{' '}
            <Pressable
              onPress={() => Linking.openURL('https://discord.gg/M3J59ywNf8')}
            >
              <Text style={styles.inlineLink}>Internet Camera Discord. ↗</Text>
            </Pressable>
          </Text>
          <TextInput
            value={supply}
            onChangeText={setSupply}
            style={styles.textInput}
            placeholder="Size of Roll"
            keyboardType="number-pad"
          />
        </View>
        {params.model == 'claimable' && (
          <>
            <View style={styles.formItem}>
              <Text style={styles.formTitle}>
                # of film claimable at a time
              </Text>
              <Text style={styles.formLabel}>
                Any wallet holding less than 1 of your film will be able to
                claim this amount.
              </Text>
              <TextInput
                value={amountClaimablePerUser}
                onChangeText={setAmountClaimablePerUser}
                style={styles.textInput}
                placeholder="Amount claimable per user"
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.formItem}>
              <Text style={styles.formTitle}>Max # of claims per wallet</Text>
              <Text style={styles.formLabel}>
                Wallets will only be able to claim film this number of times.
              </Text>
              <TextInput
                value={maxClaimsPerUser}
                onChangeText={setMaxClaimsPerUser}
                style={styles.textInput}
                placeholder="Max # of claims per user"
                keyboardType="number-pad"
              />
            </View>
          </>
        )}
        <View style={styles.formItem}>
          <Text style={styles.formTitle}>Description</Text>
          <Text style={styles.formLabel}>
            Optional. This will be displayed on the film's page.
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.textInput, { height: 100 }]}
            placeholder={'Description'}
            keyboardType="default"
            multiline
          />
        </View>

        <Button
          style={styles.button}
          disabled={disabled}
          text={symbol.length ? `Create $${symbol}` : 'Create'}
          onPress={() => {
            createFilm();
          }}
        />
        {filmFactoryTokenBalance < parseInt(supply) && (
          <Text style={styles.error}>
            You don't have enough tokens to create {parseInt(supply)} film
            tokens. Get more in the{' '}
            <Pressable
              onPress={() => Linking.openURL('https://discord.gg/M3J59ywNf8')}
            >
              <Text
                style={[
                  styles.text,
                  {
                    transform: [{ translateY: 3 }],
                    fontSize: 14,
                    textDecorationLine: 'underline'
                  }
                ]}
              >
                Internet Camera Discord. ↗
              </Text>
            </Pressable>
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {},
  formItem: { paddingHorizontal: 15, paddingVertical: 10 },
  formTitle: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 22,
    marginBottom: 5
  },
  formLabel: {
    color: '#aaa',
    fontFamily: 'HelveticaNowRegular',
    fontSize: 16,
    marginBottom: 10
  },
  text: { color: 'white' },
  error: {
    color: 'white',
    marginHorizontal: 15,
    marginTop: -20,
    marginBottom: 40
  },
  inlineLink: {
    color: '#aaa',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 5
  },

  textInput: {
    backgroundColor: '#111',
    padding: 15,
    color: 'white',
    fontFamily: 'HelveticaNowRegular',
    fontSize: 18,
    borderRadius: 5
  },
  button: {
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 40,
    backgroundColor: 'hsl(260, 100%, 50%)'
  }
});

export default FilmCreateScreen;
