import PropTypes from 'prop-types';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';

import PaginationIndicator from './PaginationIndicator';

export default class Walkthrough extends React.Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onChanged: PropTypes.func,
  };
  static defaultProps = {
    onChanged: () => null,
  };
  state = {
    index: 0,
  };
  constructor(props) {
    super(props);
    this.itemWidth = Dimensions.get('window').width;
  }

  extractItemKey = item => `${this.props.children.indexOf(item)}`;

  onScrollEnd = e => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    this.setState({ index: pageNum });
  };

  renderItem = ({ item }) => (
    <View style={[styles.item, { width: this.itemWidth }]}>{item}</View>
  );

  render = () => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <FlatList
        style={styles.list}
        data={this.props.children}
        onMomentumScrollEnd={this.onScrollEnd}
        keyExtractor={this.extractItemKey}
        pagingEnabled
        horizontal
        renderSeparator={() => null}
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

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    flex: 1,
  },
});
