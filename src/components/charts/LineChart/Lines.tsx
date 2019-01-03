import * as array from 'd3-array';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import React, { PureComponent } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Data } from '../../widget/base/LineWidget';
import { getTicks } from './utils';

export type MappedData = {
  x: number;
  y: number;
}[][];

interface Props {
  data: Data;
  contentInset: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  svg: any;
  curTick: number;
  numberOfTicks: number;
  onTickClick: (tick: number) => void;
  xAccessor: (obj: any) => number;
  yAccessor: (obj: any) => number;
  style: ViewStyle;
}
class Lines extends PureComponent<Props> {
  static defaultProps = {
    svg: {},
    contentInset: {},
    numberOfTicks: 4,
    xAccessor: ({ index }: { index: number }) => index,
    yAccessor: ({ item }: { item: number }) => item,
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

    const mappedData: MappedData = data.map(dataArray =>
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
          <Svg height={height} width={width}>
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
            {React.Children.map(
              children as React.ReactElement<any>[],
              child => {
                return React.cloneElement(child, extraProps);
              }
            )}
          </Svg>
        </View>
      </View>
    );
  }

  _onLayout(event: LayoutChangeEvent) {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = event;
    this.setState({ height, width });
  }

  createPaths({
    data,
    x,
    y,
  }: {
    data: MappedData;
    x: scale.ScaleLinear<number, number>;
    y: scale.ScaleLinear<number, number>;
  }) {
    const paths = data.map(line =>
      shape
        .line<{ x: number; y: number }>()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .defined(item => typeof item.y === 'number')
        .curve(shape.curveLinear)(line)
    );
    return paths;
  }
}

export default Lines;
