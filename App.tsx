import { AppLoading, Asset, Font, Icon } from 'expo';
import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import Root from './src/Root';
import auth from './src/states/Auth';
interface Props {
  skipLoadingScreen: boolean;
}


export default class App extends React.Component<Props> {
  public state = {
    isLoadingComplete: false,
  };

  public render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
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

  private loadResourcesAsync = () => {
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
      }),
    ]).then(() => {
      return;
    });
  };

  private handleLoadingError = (error: Error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  private handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
