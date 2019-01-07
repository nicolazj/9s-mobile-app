import React from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';
import agent from '../agent';
import Button from '../components/Button';
import { Container } from '../primitives';
import { SCREENS } from '../routes/constants';
import { scale } from '../scale';
import appState, { AppDetail, AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
interface Props {
  navigation: NavigationScreenProp<any, any>;
  states: [AppState];
}
const AppDetailContainer = styled(Container)`
  background: #fff;
`;
const AppImg = styled(Image)`
  height: ${scale(100)}px;
  width: ${scale(200)}px;
  align-self: center;
`;
const KeyFeatureTitle = styled(Text)`
  font-weight: bold;
  margin-bottom: 5px;
`;
const DescView = styled(View)`
  margin-bottom: 20px;
`;
const DescText = styled(Text)`
  color: #666;
`;

export class AppDetailScreen extends React.Component<Props> {
  render() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const { app } = appDetail;
    if (!app) {
      return null;
    }
    return (
      <ScrollView>
        <NavigationEvents
          onWillFocus={payload => {
            this.reloadConnections();
          }}
        />
        <AppDetailContainer padding>
          <AppImg style={{}} source={{ uri: app.logo }} resizeMode="contain" />
          {this.renderDesc(app.description)}
          {this.renderFeatures(app.features)}
          {this.renderButtons()}
        </AppDetailContainer>
      </ScrollView>
    );
  }
  onConnect = (appDetail: AppDetail) => {
    console.log(appDetail);
    this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT], { key: appDetail.appKey });
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
            console.log('cancel');
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
        onPress={() => this.onRemoveConnection(connection.id, appKey)}
      />
    );

    if (!connection) {
      return [
        <Button key="connect" title="Connect" onPress={() => this.onConnect(appDetail)} />,
        <Button key="trial" title="Get a trial" />,
      ];
    } else if (connection.status === 'ACTIVE') {
      return removeConnectionButton;
    } else {
      return [<Button key="resume" title="Resume" onPress={() => this.onConnect(appDetail)} />, removeConnectionButton];
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
}
export default SubscribeHOC([appState])(AppDetailScreen);
