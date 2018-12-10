import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
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
const getAppIcon = (appKey: string) =>
  `https://cdn.9spokes.io/catalogue-data/2.44-210/9spokesuk/images/${appKey}/logos/big`;

export class AppDetail extends React.Component<Props> {
  public onPress = (connectionStatus: AppDetail) => {
    this.props.navigation.navigate(SCREENS[SCREENS.APP_CONNECT], connectionStatus);
  };
  public async componentDidMount() {
    const appKey = this.props.navigation.getParam('key');

    const r = await agent.user.service.get(appKey);
    console.log(r);
  }
  public render() {
    const appKey = this.props.navigation.getParam('key');
    const [appState] = this.props.states;
    const appDetail = appState.appDetail(appKey);
    const { connection, app } = appDetail;
    if (!app) {
      return null;
    }
    return (
      <ScrollView>
        <AppDetailContainer padding>
          <AppImg style={{}} source={{ uri: getAppIcon(appKey) }} resizeMode="contain" />
          {this.renderDesc(app.description)}

          {this.renderFeatures(app.features)}
          {connection && connection.status === 'ACTIVE' ? (
            <Button title="Remove connection" onPress={() => console.log('remove ')} />
          ) : (
            [
              <Button key="trial" title="Get a trial" />,
              connection ? (
                <Button key="resume" title="Resume" onPress={() => this.onPress(appDetail)} />
              ) : (
                <Button key="connect" title="Connect" onPress={() => this.onPress(appDetail)} />
              ),
            ]
          )}
        </AppDetailContainer>
      </ScrollView>
    );
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
