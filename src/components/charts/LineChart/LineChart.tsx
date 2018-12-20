import * as array from 'd3-array';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { getTicks } from './utils';

class LineChart extends PureComponent {
  static defaultProps = {
    svg: {},
    contentInset: {},
    numberOfTicks: 4,
    xAccessor: ({ index }) => index,
    yAccessor: ({ item }) => item,
  };

  state = {
    width: 0,
    height: 0,
  };

  render() {
    const {
      data,
      xAccessor,
      yAccessor,
      style,
      numberOfTicks,
      contentInset: { top = 0, bottom = 0, left = 0, right = 0 },
      svg,
      children,
      onTickClick,
      curTick,
    } = this.props;

    const { width, height } = this.state;
    if (data.length === 0) {
      return <View style={style} />;
    }

    const mappedData = data.map(dataArray =>
      dataArray.data.map((item, index) => ({
        y: yAccessor({ item, index }),
        x: xAccessor({ item, index }),
      }))
    );

    const yValues = array.merge(mappedData).map(item => item.y);
    const xValues = array.merge(mappedData).map(item => item.x);

    const yExtent = array.extent(yValues);
    const xExtent = array.extent(xValues);

    const [yMin, yMax] = yExtent;

    const [xMin, xMax] = xExtent;

    const y = scale
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height - bottom, top])
      .clamp(false);

    const x = scale
      .scaleLinear()
      .domain([xMin, xMax])
      .range([left, width - right])
      .clamp(false);

    const paths = this.createPaths({
      data: mappedData,
      x,
      y,
    });
    const ticks = getTicks(yMin, yMax, numberOfTicks);

    const extraProps = {
      x,
      y,
      data,
      mappedData,
      ticks,
      width,
      height,
      paths,
      curTick,
      onTickClick,
    };
    return (
      <View style={style}>
        <View style={{ flex: 1 }} onLayout={event => this._onLayout(event)}>
          <Svg style={{ height, width }}>
            {paths.map((path, index) => {
              const { svg: pathSvg } = data[index];
              return (
                <Path
                  key={index}
                  fill={'none'}
                  {...svg}
                  {...pathSvg}
                  d={path}
                />
              );
            })}
            {React.Children.map(children, child => {
              return React.cloneElement(child, extraProps);
            })}
          </Svg>
        </View>
      </View>
    );
  }

  _onLayout(event) {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = event;
    this.setState({ height, width });
  }

  createPaths({ data, x, y }) {
    const paths = data.map(line =>
      shape
        .line()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .defined(item => typeof item.y === 'number')
        .curve(shape.curveLinear)(line)
    );
    return paths;
  }
}

export default LineChart;
