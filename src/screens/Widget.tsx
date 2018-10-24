import React from 'react';
import { View, Text, SectionList, Button } from 'react-native';
import agent from '../agent';
import { Spoke } from '../types';
import { NavigationScreenProp } from 'react-navigation';

interface State {
  spokes: Spoke[];
}
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class Widget extends React.Component<Props, State> {
  state: State = {
    spokes: [],
  };
  async componentDidMount() {
    const spokes = await agent.user.spoke.get('mobile');
    this.setState({ spokes });
  }
  onPress(item: string) {
    this.props.navigation.push('WidgetDetail', { appKey: item });
  }
  render() {
    const sections = this.state.spokes.map((spoke: Spoke) => ({
      title: spoke.displayName,
      data: spoke.services,
    }));
    return (
      <View>
        <SectionList
          renderItem={({ item, index, section }) => (
            <Button key={index} title={item} onPress={() => this.onPress(item)} />
          )}
          renderSectionHeader={({ section: { title } }) => <Text style={{ fontWeight: 'bold' }}>{title}</Text>}
          sections={sections}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
}
