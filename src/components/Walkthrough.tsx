import React from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';

import PaginationIndicator from './PaginationIndicator';

const { width } = Dimensions.get('window');
interface Props {
  children: React.ReactNodeArray;
}
interface State {
  index: number;
}

export default class Walkthrough extends React.Component<Props, State> {
  state: State = {
    index: 0,
  };

  extractItemKey = (item: React.ReactNode, index: number) => index.toString();

  onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    this.setState({ index: pageNum });
  };

  renderItem = ({ item }: { item: React.ReactNode }) => (
    <View style={[{ flex: 1, width }]}>{item}</View>
  );

  render = () => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <FlatList
        style={{ flex: 1 }}
        data={this.props.children}
        onMomentumScrollEnd={this.onScrollEnd}
        keyExtractor={this.extractItemKey}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        renderItem={this.renderItem}
      />
      <PaginationIndicator
        length={this.props.children.length}
        current={this.state.index}
      />
    </View>
  );
}
