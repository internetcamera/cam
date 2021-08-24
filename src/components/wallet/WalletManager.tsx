import React, { useEffect, useRef, useState } from 'react';
import { View, Linking } from 'react-native';
import WebView from 'react-native-webview';
import { OnShouldStartLoadWithRequest } from 'react-native-webview/lib/WebViewTypes';
import useWallet from '../../features/useWallet';

const WalletManager = () => {
  const webviewRef = useRef<WebView>(null);
  const signatureCallbackRef = useRef<(signature: string) => void>();

  const [selectedApp, setSelectedApp] = useState<string>();

  const onWebViewEvent = async (type: string, data: any) => {
    switch (type) {
      case 'account':
        useWallet.setState({ account: data });
        if (selectedApp) useWallet.setState({ app: selectedApp });
        break;
      case 'log':
        console.log(data);
        break;
      case 'signature':
        if (signatureCallbackRef.current) {
          signatureCallbackRef.current(data);
          signatureCallbackRef.current = undefined;
        }
        break;
      case 'uri':
        useWallet.setState({ wcUri: data });
        break;
    }
  };

  const openExternalLink: OnShouldStartLoadWithRequest = () => true;

  useEffect(() => {
    useWallet.setState({
      disconnect: () => {
        webviewRef.current?.injectJavaScript('window.disconnect();true;');
      },
      refreshManager: () => {
        console.log(useWallet.getState().wcUri);
        webviewRef.current?.reload();
      },
      signTypedData: data => {
        return new Promise(async resolve => {
          webviewRef.current?.reload();
          await new Promise(resolve => setTimeout(resolve, 500));
          webviewRef.current?.injectJavaScript(
            `window.signTypedData('${data}');true;`
          );
          setTimeout(() => {
            const app = useWallet.getState().app;
            if (!app) return;
            openApp(app);
          }, 500);

          signatureCallbackRef.current = resolve;
        });
      },
      openApp
    });
  }, []);

  const openApp = (app: string, urlSuffix?: string) => {
    setSelectedApp(app);
    switch (app) {
      case 'rainbow':
        Linking.openURL('https://rnbwapp.com/' + (urlSuffix || 'wc'));
        break;
      case 'metamask':
        Linking.openURL('https://metamask.app.link/' + (urlSuffix || 'focus'));
        break;
    }
  };
  return (
    <View
      style={{
        display: 'none'
      }}
    >
      <WebView
        ref={webviewRef}
        source={{
          uri: 'https://internet.camera/utils/rn-wallet'
        }}
        onMessage={event => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            onWebViewEvent(data.type, data.message);
          } catch (err) {}
        }}
        onShouldStartLoadWithRequest={openExternalLink}
        scrollEnabled={false}
      />
    </View>
  );
};

export default React.memo(WalletManager);
