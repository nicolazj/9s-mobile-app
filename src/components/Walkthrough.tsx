import React from 'react';
import {
    Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, View
} from 'react-native';

import log from '../logging';
import PaginationIndicator from './PaginationIndicator';

const { width } = Dimensions.get('window');
interface Props {
  children: React.ReactNodeArray;
}
interface State {
  index: number;
}
const interval = 5000;
export default class Walkthrough extends React.Component<Props, State> {
  private list: any;
  private timer?: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      index: 0,
    };
  }
  extractItemKey = (item: React.ReactNode, index: number) => index.toString();

  onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    this.setState({ index: pageNum });
  };

  renderItem = ({
    item,
    index,
  }: {
    item: React.ReactElement<any>;
    index: number;
  }) => (
    <View style={[{ flex: 1, width }]}>
      {React.cloneElement(item, { current: index === this.state.index })}
    </View>
  );

  componentDidMount() {
    this.timer = (setInterval(() => {
      let next = this.state.index + 1;

      if (this.list) {
        this.list.scrollToOffset({ offset: width * next });
        this.setState({ index: next });
      }

      if (next === this.props.children.length - 1) {
        clearInterval(this.timer!);
      }
    }, interval) as unknown) as number;
  }
  cancelTimer = () => {
    clearTimeout(this.timer!);
  };

  render = () => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <FlatList
        ref={ref => {
          this.list = ref;
        }}
        onScrollBeginDrag={this.cancelTimer}
        style={{ flex: 1, backgroundColor: '#fff' }}
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
