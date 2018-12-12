import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import agent from '../agent';
export default class Dashboard extends React.Component {
  public async componentDidMount() {
    const data = await agent.company.widget.list();
    const data2 = await agent.user.service.get('googleanalytics');
    console.log(data2);
  }
  public render() {
    return (
      <View>
        <StatusBar barStyle="light-content" />
        <Text>Home</Text>
      </View>
    );
  }
}
