import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Pressable
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import {
  GestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import { InternetCamera } from '@internetcamera/sdk';
import { getPostPhotoTypedData } from '@internetcamera/sdk/dist/utils/forwarder';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import CameraFilmPicker from './CameraFilmPicker';
import * as ImageManipulator from 'expo-image-manipulator';
import useWallet from '../../features/useWallet';
import getJsonRpcProvider from '../../features/getJsonRpcProvider';
import * as Haptics from 'expo-haptics';
import QRBottomSheet from '../sheets/QRBottomSheet';
import useFilmRoll from '../../features/useFilmRoll';
import { formatEther } from 'ethers/lib/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ASPECT_RATIO = 0.8;

const CameraView = ({}) => {
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();
  const account = useWallet(state => state.account);
  const [previewURI, setPreviewURI] = useState<string>();
  const [imageSize, setImageSize] =
    useState<{ width: number; height: number }>();
  const [isNewPhoto, setIsNewPhoto] = useState(false);
  const [saved, setSaved] = useState(false);
  const [posting, setPosting] = useState(false);
  const [qrCode, setQrCode] = useState<string>();
  const [selectedFilmAddress, setSelectedFilmAddress] = useState<string>();

  const [ipfsHash, setIPFSHash] = useState<string>();
  const [openedWallet, setOpenedWallet] = useState(false);
  const [signature, setSignature] = useState<string>();
  const { data: filmRoll } = useFilmRoll(selectedFilmAddress);
  // Camera settings
  const [selectedCameraType, setSelectedCameraType] = useState<
    keyof typeof Camera.Constants.Type
  >(Camera.Constants.Type.back);
  const [zoom, setZoom] = useState(0);
  const onPinchGestureEvent = (
    event: GestureEvent<PinchGestureHandlerEventPayload>
  ) => {
    setZoom(Math.max(0, Math.min(event.nativeEvent.scale, 1)));
  };

  // Pause and blur when unfocused
  const isFocused = useIsFocused();
  useEffect(() => {
    try {
      if (!isFocused) cameraRef.current?.pausePreview();
      else cameraRef.current?.resumePreview();
    } catch (err) {
      console.log(err);
    }
  }, [isFocused]);
  useEffect(() => {
    Camera.requestCameraPermissionsAsync();
  }, []);

  // Camera functions
  const flipCamera = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedCameraType == 'front') setSelectedCameraType('back');
    else setSelectedCameraType('front');
  };

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true
    });
    if (image.cancelled) return;
    const crop = {
      originX: 0,
      originY: 0,
      width: image.width,
      height: image.height
    };
    const inputWidth = image.width;
    const inputHeight = image.height;
    const inputImageAspectRatio = inputWidth / inputHeight;
    let outputWidth = inputWidth;
    let outputHeight = inputHeight;
    if (inputImageAspectRatio > ASPECT_RATIO)
      outputWidth = inputHeight * ASPECT_RATIO;
    else if (inputImageAspectRatio < ASPECT_RATIO)
      outputHeight = inputWidth / ASPECT_RATIO;
    crop.originX = (outputWidth - inputWidth) * 0.5;
    crop.originY = (outputHeight - inputHeight) * 0.5;
    crop.width = outputWidth;
    crop.height = outputHeight;
    const edited = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ crop }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    setPreviewURI(edited.uri);
    setImageSize({ width: edited.width, height: edited.height });
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    Haptics.impactAsync();
    let image = await cameraRef.current.takePictureAsync({
      base64: true
    });
    if (selectedCameraType == 'front') {
      image = await ImageManipulator.manipulateAsync(
        image.uri,
        [
          {
            flip: ImageManipulator.FlipType.Horizontal
          }
        ],
        { format: ImageManipulator.SaveFormat.JPEG }
      );
    }

    setPreviewURI(image.uri);
    setIsNewPhoto(true);
    setImageSize({ width: image.width, height: image.height });
  };

  const savePhoto = async () => {
    if (!previewURI) throw new Error('Missing preview URI');
    if (saved) return;
    Haptics.impactAsync();
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.granted) {
      await MediaLibrary.saveToLibraryAsync(previewURI);
      setSaved(true);
    } else {
      alert('Permission to save to media library is required!');
    }
  };

  const clear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewURI(undefined);
    setSaved(false);
    setIsNewPhoto(false);
    setPosting(false);

    setIPFSHash(undefined);
    setSignature(undefined);
    setOpenedWallet(false);
  };

  const postPhoto = async () => {
    if (!previewURI) throw new Error('Missing preview URI');
    if (!imageSize) throw new Error('Missing image size');
    if (!account) throw new Error('Logged out!');
    if (!selectedFilmAddress) throw new Error('No film selected!');

    Haptics.impactAsync();

    let hash = ipfsHash;
    if (!hash) {
      setPosting(true);
      const { width, height } = imageSize;
      const camera = new InternetCamera();
      hash = await camera.postPhotoToIPFS(
        { uri: previewURI, type: 'image/jpeg', name: 'image.jpg' },
        selectedFilmAddress,
        { width, height }
      );
      setIPFSHash(hash);
    }

    const jsonRpcProvider = getJsonRpcProvider();
    const typedData = await getPostPhotoTypedData(
      selectedFilmAddress,
      hash,
      account,
      80001,
      jsonRpcProvider
    );
    const signTypedData = useWallet.getState().signTypedData;
    if (!signTypedData) throw new Error('Wallet not ready to sign!');
    setTimeout(() => {
      setOpenedWallet(true);
    }, 500);
    const signature = await signTypedData(JSON.stringify(typedData));
    setSignature(signature);
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
    // console.log(response);
    useWallet.getState().addPendingTransaction(response.hash);
    clear();
  };

  // Handle QR code events
  const onBarCodeScanned = (scanningResult: BarCodeScanningResult) => {
    if (qrCode == scanningResult.data) return;
    console.log(scanningResult.data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setQrCode(scanningResult.data);
  };

  useEffect(() => {
    if (previewURI) {
      navigation.setOptions({ tabBarVisible: false });
    } else {
      navigation.setOptions({ tabBarVisible: true });
    }
  }, [previewURI]);

  const app = useWallet(state => state.app);

  return (
    <View style={styles.container}>
      <View style={styles.topPart} />
      <View style={styles.cameraContainer}>
        {!previewURI && isFocused ? (
          <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={selectedCameraType}
              onBarCodeScanned={onBarCodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
              }}
              zoom={zoom}
            />
          </PinchGestureHandler>
        ) : filmRoll && account && previewURI ? (
          <>
            <View style={styles.previewHeader}>
              <Text style={styles.filmName}>{filmRoll.symbol}</Text>
              <Text style={styles.filmNumber}>
                № {parseInt(`${filmRoll.used}`) + 1} of{' '}
                {parseFloat(formatEther(filmRoll.totalSupply)).toLocaleString()}
              </Text>
            </View>
            <Image
              source={{ uri: previewURI }}
              style={styles.camera}
              resizeMode="cover"
            />
          </>
        ) : null}
      </View>
      <View style={{ flex: 1 }} />
      <View style={styles.footer}>
        {!previewURI ? (
          <>
            <View
              style={[
                styles.controls,
                { opacity: selectedFilmAddress != undefined ? 1 : 0.15 }
              ]}
            >
              <TouchableOpacity
                onPress={openImagePickerAsync}
                disabled={selectedFilmAddress == undefined}
              >
                <Text style={styles.controlButton}>
                  <Entypo name="folder-images" size={24} color="white" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outerRing}
                activeOpacity={0.5}
                onPress={takePhoto}
                disabled={selectedFilmAddress == undefined}
              >
                <View style={styles.innerRing}></View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={flipCamera}
                disabled={selectedFilmAddress == undefined}
              >
                <Text style={styles.controlButton}>
                  <MaterialIcons
                    name="flip-camera-android"
                    size={24}
                    color="white"
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <CameraFilmPicker
              selectedFilmAddress={selectedFilmAddress}
              setSelectedFilmAddress={setSelectedFilmAddress}
            />
          </>
        ) : (
          <View style={styles.previewControls}>
            <Pressable
              onPress={postPhoto}
              style={[
                styles.previewButton,
                { backgroundColor: 'hsl(250, 100%, 50%)' }
              ]}
            >
              <Text style={styles.previewButtonText}>
                {openedWallet && app && !signature ? (
                  <>
                    <MaterialCommunityIcons
                      name="face-recognition"
                      size={22}
                      color="white"
                      style={{ marginLeft: -30 }}
                    />
                    <View style={{ width: 10 }} />
                    Confirm in {capitalizeFirstLetter(app)}
                  </>
                ) : signature ? (
                  `Submitted!`
                ) : posting ? (
                  `Uploading...`
                ) : (
                  `Post photo as ${filmRoll?.symbol} – № ${
                    parseInt(`${filmRoll?.used}`) + 1
                  }`
                )}
              </Text>
            </Pressable>

            {isNewPhoto && (
              <Pressable
                onPress={() => savePhoto()}
                style={[styles.previewButton, saved ? { opacity: 0.7 } : {}]}
              >
                <Text
                  style={[
                    styles.previewButtonText,
                    saved ? { color: '#aaa' } : {}
                  ]}
                >
                  {saved ? 'Saved to iOS Photos!' : 'Save to iOS Photos'}
                </Text>
              </Pressable>
            )}

            <Pressable onPress={clear} style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </View>
      {qrCode && <QRBottomSheet data={qrCode} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  topPart: {
    maxHeight: 60,
    flex: 1
  },
  cameraContainer: {
    position: 'relative'
  },
  camera: {
    aspectRatio: ASPECT_RATIO,
    maxHeight: 700
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 110
  },
  outerRing: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 65,
    backgroundColor: '#fff',
    borderRadius: 100,
    marginBottom: 0,
    overflow: 'hidden'
  },

  innerRing: {
    borderWidth: 5,
    borderColor: 'black',
    width: 60,
    height: 60,
    borderRadius: 95,
    backgroundColor: 'white',
    overflow: 'hidden'
  },

  controlButton: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 28,
    overflow: 'hidden'
  },
  previewControls: {
    paddingBottom: 40
  },
  previewButton: {
    flex: 1,
    marginHorizontal: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'rgb(20,20,20)',
    borderRadius: 5
  },
  previewButtonText: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 18
  },
  photoName: {
    color: 'white',
    fontFamily: 'HelveticaNowBold',
    fontSize: 18
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  filmName: {
    fontFamily: 'HelveticaNowMicroBold',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 14
  },
  filmNumber: {
    fontFamily: 'HelveticaNowMicroBold',
    fontSize: 12,
    color: '#ccc'
  }
});

export default CameraView;

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
