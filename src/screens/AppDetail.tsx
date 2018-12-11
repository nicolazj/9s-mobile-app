import React from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import agent from '../agent';
import Button from '../components/Button';
import { Container } from '../primitives';
import { SCREENS } from '../routes/constants';
import { scale } from '../scale';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled, { th } from '../styled';
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

export class AppDetail extends React.Component<Props> {
  public render() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const { app } = appDetail;
    if (!app) {
      return null;
    }
    return (
      <ScrollView>
        <AppDetailContainer padding>
          <AppImg style={{}} source={{ uri: app.logo }} resizeMode="contain" />
          {this.renderDesc(app.description)}
          {this.renderFeatures(app.features)}
          {this.renderButtons()}
        </AppDetailContainer>
      </ScrollView>
    );
  }
  private onPress = (appDetail: AppDetail) => {
    this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT], appDetail);
  };
  private onRemoveConnection = async (connectionId: string) => {
    Alert.alert(
      'Remove connection?',
      'Are you sure you want to remove your connection ',
      [
        {
          text: 'OK',
          onPress: () => this.removeConnection(connectionId),
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
  private removeConnection = async (connectionId: string) => {
    await agent.company.connection.delete(connectionId);
    this.reloadConnections();
  };
  private reloadConnections = async () => {
    const connections = await agent.company.connection.list();
    const [appState] = this.props.states;
    appState.setState({ connections });
  };
  private renderButtons() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const { connection, app } = appDetail;
    const removeConnectionButton = (
      <Button key="remove" title="Remove connection" danger onPress={() => this.onRemoveConnection(connection.id)} />
    );

    if (!connection) {
      return [
        <Button key="connect" title="Connect" onPress={() => this.onPress(appDetail)} />,
        <Button key="trial" title="Get a trial" />,
      ];
    } else if (connection.status === 'ACTIVE') {
      return removeConnectionButton;
    } else {
      return [<Button key="resume" title="Resume" onPress={() => this.onPress(appDetail)} />, removeConnectionButton];
    }
  }
  private renderDesc(desc: string) {
    const paras = desc.split('<br>');
    return (
      <DescView>
        {paras.map((p: string, i: number) => (
          <DescText key={i}>{p}</DescText>
        ))}
      </DescView>
    );
  }
  private renderFeatures(features: string[]) {
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
export default SubscribeHOC([appState])(AppDetail);
