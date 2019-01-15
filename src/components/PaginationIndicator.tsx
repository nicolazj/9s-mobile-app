import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class PaginationIndicator extends React.Component {
  static propTypes = {
    current: PropTypes.number,
    length: PropTypes.number.isRequired,
  };
  static defaultProps = {
    current: 0,
  };

  renderIndicatorItem = (index, selected) => (
    <View
      style={selected ? [styles.base, styles.selected] : styles.base}
      key={index}
    />
  );

  renderIndicators = () => {
    const indicators = [];
    for (let i = 0; i < this.props.length; i += 1) {
      indicators.push(this.renderIndicatorItem(i, i === this.props.current));
    }
    return indicators;
  };

  render = () => (
    <View style={styles.container}>{this.renderIndicators()}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  base: {
    width: 8,
    height: 8,
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: 'red',
  },
});
