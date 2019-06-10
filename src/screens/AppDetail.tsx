import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Dimensions, Image, ScrollView, View } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import agent from '../agent';
import Button from '../components/Button';
import WidgetComp from '../components/widget';
import log from '../logging';
import * as P from '../primitives';
import { SCREENS } from '../routes/constants';
import { useOSPStore } from '../stores/osp';
import styled, { scale } from '../styled';
import { AppDetail, WidgetSample } from '../types';
import { transform } from './WidgetList';

const { width } = Dimensions.get('window');

interface Props {
  navigation: NavigationScreenProp<any, any>;
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

const AppDetailScreen: React.FC<Props> = ({ navigation }) => {
  const appKey = navigation.getParam('key');
  const { getAppDetail, getSamplesByAppKey, setOSPStore } = useOSPStore();

  const appDetail = getAppDetail(appKey);
  const samples = getSamplesByAppKey(appKey);
  const { app } = appDetail;

  const onConnect = (appDetail: AppDetail) => {
    navigation.navigate(SCREENS[SCREENS.APP_CONNECT], {
      key: appDetail.appKey,
    });
  };
  const onRemoveConnection = async (connectionId: string, appKey: string) => {
    Alert.alert(
      'Remove connection?',
      'Are you sure you want to remove your connection ',
      [
        {
          text: 'OK',
          onPress: () => removeConnection(connectionId, appKey),
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
  const removeConnection = async (connectionId: string, appKey: string) => {
    await agent.company.connection.delete(connectionId);
    await agent.company.widget.deleteByAppKey(appKey);
    reloadConnections();
  };
  const reloadConnections = async () => {
    const connections = await agent.company.connection.list();
    setOSPStore({ connections });
  };
  const getTrial = async (appDetail: AppDetail) => {
    WebBrowser.openBrowserAsync(appDetail.app.trial.tryUrl);
  };
  const renderButtons = () => {
    const appKey = navigation.getParam('key');

    const { connection, app } = appDetail;
    const removeConnectionButton = (
      <Button
        key="remove"
        title="Remove connection"
        danger
        onPress={() => connection && onRemoveConnection(connection.id, appKey)}
      />
    );

    if (!connection) {
      return [
        <Button
          key="connect"
          title="Connect"
          onPress={() => onConnect(appDetail)}
        />,
        <Button
          key="trial"
          title="Get a trial"
          onPress={() => getTrial(appDetail)}
        />,
      ];
    } else if (connection.status === 'ACTIVE') {
      return removeConnectionButton;
    } else {
      return [
        <Button
          key="resume"
          title="Resume"
          onPress={() => onConnect(appDetail)}
        />,
        removeConnectionButton,
      ];
    }
  };
  const renderDesc = (desc: string) => {
    const paras = desc.split('<br>');
    return (
      <DescView>
        {paras.map((p: string, i: number) => (
          <DescText key={i}>{p}</DescText>
        ))}
      </DescView>
    );
  };
  const renderFeatures = (features: string[]) => {
    return (
      <DescView>
        <KeyFeatureTitle>Key features</KeyFeatureTitle>
        {features.map((f: string, i: number) => (
          <DescText key={i}>{f}</DescText>
        ))}
      </DescView>
    );
  };
  const renderWidgets = (samples: WidgetSample[]) => {
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
  };

  if (!app) {
    return null;
  }
  return (
    <ScrollView>
      <NavigationEvents
        onWillFocus={() => {
          reloadConnections();
        }}
      />
      <AppDetailContainer hasPadding>
        <AppImg style={{}} source={{ uri: app.logo }} resizeMode="contain" />
        {renderDesc(app.description)}
        {renderFeatures(app.features)}
        {renderWidgets(samples)}
        {renderButtons()}
      </AppDetailContainer>
    </ScrollView>
  );
};
export default AppDetailScreen;
