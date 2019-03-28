import { WebBrowser } from 'expo';
import React from 'react';
import { Alert, Dimensions, Image, ScrollView, View } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Button from '../components/Button';
import WidgetComp from '../components/widget';
import log from '../logging';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { scale } from '../scale';
import appState, { AppDetail, AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
import { WidgetSample } from '../types';
import { transform } from './WidgetList';

const { width } = Dimensions.get('window');

interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}
const AppDetailContainer = styled(P.Container)`
  background: #fff;
`;
const AppImg = styled(Image)`
  height: ${scale(100)}px;
  width: ${scale(200)}px;
  align-self: center;
`;
const KeyFeatureTitle = styled(P.Text)`
  font-weight: bold;
  margin-bottom: 5px;
`;
const DescView = styled(View)`
  margin-bottom: 20px;
`;
const DescText = styled(P.Text)`
  color: #666;
`;

export class AppDetailScreen extends React.Component<Props> {
  render() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const samples = appState.getSamplesByAppKey(appKey) as WidgetSample[];
    const { app } = appDetail;
    if (!app) {
      return null;
    }
    return (
      <ScrollView>
        <NavigationEvents
          onWillFocus={() => {
            this.reloadConnections();
          }}
        />
        <AppDetailContainer hasPadding>
          <AppImg style={{}} source={{ uri: app.logo }} resizeMode="contain" />
          {this.renderDesc(app.description)}
          {this.renderFeatures(app.features)}
          {this.renderWidgets(samples)}
          {this.renderButtons()}
        </AppDetailContainer>
      </ScrollView>
    );
  }
  onConnect = (appDetail: AppDetail) => {
    this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT], {
      key: appDetail.appKey,
    });
  };
  onRemoveConnection = async (connectionId: string, appKey: string) => {
    Alert.alert(
      'Remove connection?',
      'Are you sure you want to remove your connection ',
      [
        {
          text: 'OK',
          onPress: () => this.removeConnection(connectionId, appKey),
        },
        {
          text: 'Cancel',
          onPress: () => {
            log('cancel');
          },
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };
  removeConnection = async (connectionId: string, appKey: string) => {
    await agent.company.connection.delete(connectionId);
    await agent.company.widget.deleteByAppKey(appKey);
    this.reloadConnections();
  };
  reloadConnections = async () => {
    const connections = await agent.company.connection.list();
    const [appState] = this.props.states;
    appState.setState({ connections });
  };
  getTrial = async (appDetail: AppDetail) => {
    WebBrowser.openBrowserAsync(appDetail.app.trial.tryUrl);
  };
  renderButtons() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);

    const { connection, app } = appDetail;
    const removeConnectionButton = (
      <Button
        key="remove"
        title="Remove connection"
        danger
        onPress={() =>
          connection && this.onRemoveConnection(connection.id, appKey)
        }
      />
    );

    if (!connection) {
      return [
        <Button
          key="connect"
          title="Connect"
          onPress={() => this.onConnect(appDetail)}
        />,
        <Button
          key="trial"
          title="Get a trial"
          onPress={() => this.getTrial(appDetail)}
        />,
      ];
    } else if (connection.status === 'ACTIVE') {
      return removeConnectionButton;
    } else {
      return [
        <Button
          key="resume"
          title="Resume"
          onPress={() => this.onConnect(appDetail)}
        />,
        removeConnectionButton,
      ];
    }
  }
  renderDesc(desc: string) {
    const paras = desc.split('<br>');
    return (
      <DescView>
        {paras.map((p: string, i: number) => (
          <DescText key={i}>{p}</DescText>
        ))}
      </DescView>
    );
  }
  renderFeatures(features: string[]) {
    return (
      <DescView>
        <KeyFeatureTitle>Key features</KeyFeatureTitle>
        {features.map((f: string, i: number) => (
          <DescText key={i}>{f}</DescText>
        ))}
      </DescView>
    );
  }
  renderWidgets(samples: WidgetSample[]) {
    return (
      <DescView>
        <KeyFeatureTitle>Supported widgets</KeyFeatureTitle>
        <ScrollView horizontal={true}>
          <View style={{ flexDirection: 'row' }}>
            {samples.map(sample => {
              return (
                <View key={sample.displayName} style={{ width, padding: 20 }}>
                  <WidgetComp sample={true} widget={transform(sample)} />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </DescView>
    );
  }
}
export default SubscribeHOC([appState])(AppDetailScreen);
