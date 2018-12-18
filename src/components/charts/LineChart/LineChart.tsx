import * as array from 'd3-array';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { getTicks } from './utils';

class LineChart extends PureComponent {
  public static defaultProps = {
    svg: {},
    width: 100,
    height: 100,
    curve: shape.curveLinear,
    contentInset: {},
    numberOfTicks: 4,
    xScale: scale.scaleLinear,
    yScale: scale.scaleLinear,
    xAccessor: ({ index }) => index,
    yAccessor: ({ item }) => item,
  };
  public state = {
    width: 0,
    height: 0,
  };

  public render() {
    const {
      data,
      xAccessor,
      yAccessor,
      yScale,
      xScale,
      style,
      numberOfTicks,
      contentInset: { top = 0, bottom = 0, left = 0, right = 0 },
      gridMax,
      gridMin,
      clampX,
      clampY,
      svg,
      children,
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

    const yExtent = array.extent([...yValues, gridMin, gridMax]);
    const xExtent = array.extent([...xValues]);

    const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props;
    const y = yScale()
      .domain([yMin, yMax])
      .range([height - bottom, top])
      .clamp(clampY);

    const x = xScale()
      .domain([xMin, xMax])
      .range([left, width - right])
      .clamp(clampX);

    const paths = this.createPaths({
      data: mappedData,
      x,
      y,
    });
    // const ticks = y.ticks(numberOfTicks);
    const ticks = getTicks(yMin, yMax, numberOfTicks);

    const extraProps = {
      x,
      y,
      data,
      ticks,
      width,
      height,
      ...paths,
    };
    return (
      <View style={style}>
        <View style={{ flex: 1 }} onLayout={event => this._onLayout(event)}>
          {height > 0 && width > 0 && (
            <Svg style={{ height, width }}>
              {paths.path.map((path, index) => {
                const { svg: pathSvg } = data[index];
                return <Path key={path} fill={'none'} {...svg} {...pathSvg} d={path} />;
              })}
              {React.Children.map(children, child => {
                return React.cloneElement(child, extraProps);
              })}
            </Svg>
          )}
        </View>
      </View>
    );
  }

  private _onLayout(event) {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = event;
    this.setState({ height, width });
  }

  private createPaths({ data, x, y }) {
    const { curve } = this.props;

    const lines = data.map(line =>
      shape
        .line()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .defined(item => typeof item.y === 'number')
        .curve(curve)(line)
    );
    return {
      path: lines,
      lines,
    };
  }
}

export default LineChart;
