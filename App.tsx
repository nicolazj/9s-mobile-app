import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Root from './src/Root';
import auth from './src/states/Auth';
interface Props {
  skipLoadingScreen: boolean;
}
export default class extends React.Component<Props> {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Root />
        </View>
      );
    }
  }

  _loadResourcesAsync = () => {
    return Promise.all([
      auth.rehydrate(),
      Asset.loadAsync([
        require('./assets/google.png'),

        require('./assets/osp/deputy.png'),
        require('./assets/osp/freeagent.png'),
        require('./assets/osp/intuit.png'),
        require('./assets/osp/mailchimp.png'),
        require('./assets/osp/sageone.png'),
        require('./assets/osp/shopify.png'),
        require('./assets/osp/googleanalytics.png'),
        require('./assets/osp/vend.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),

        // fontawesome: require('./assets/fonts/fontawesome.ttf'),
      }),
    ]).then(() => {});
  };

  _handleLoadingError = (error: Error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
