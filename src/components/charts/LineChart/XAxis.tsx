import * as array from 'd3-array';
import * as d3Scale from 'd3-scale';
import React, { PureComponent } from 'react';
import { LayoutChangeEvent, Text, View, ViewStyle } from 'react-native';
import Svg, { G, Text as SVGText } from 'react-native-svg';

import { Data } from '../../widget/base/LineWidget';

interface Props {
  data: Data;
  numberOfTicks: number;
  contentInset: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  svg: object;
  scale: any;
  formatLabel: (value: number, index: number) => string;
  xAccessor: (d: any) => number;
  style?: ViewStyle;
}
class XAxis extends PureComponent<Props> {
  static defaultProps = {
    contentInset: { left: 0, right: 0 },
    svg: { fontSize: 10, fill: 'grey' },
    xAccessor: ({ index }: { index: number }) => index,
    scale: d3Scale.scaleLinear,
    formatLabel: (value: number, index: number) => value && value.toString(),
  } as Partial<Props>;
  state = {
    width: 0,
    height: 0,
  };

  render() {
    const { style, data, xAccessor, formatLabel, numberOfTicks, svg, children } = this.props;

    const { height, width } = this.state;
    if (data.length === 0) {
      return <View style={style} />;
    }
    const mappedData = data.map(dataArray =>
      dataArray.data.map((item, index) => ({
        x: xAccessor({ item, index }),
      }))
    );
    let values = array.merge<{ x: number }>(mappedData).map(item => item.x);
    values = values.filter((item, pos) => {
      return values.indexOf(item) === pos;
    });
    console.log(values);
    const extent = array.extent(values);
    const [min, max] = extent;
    if (min === undefined || max === undefined) return null;

    const domain = [min, max];
    const x = this._getX(domain);
    const ticks = values;
    const extraProps = {
      x,
      ticks,
      height,
      formatLabel,
    };
    const longestValue = ticks
      .map((value, index) => formatLabel(value, index))
      .reduce((prev, curr) => (prev.toString().length > curr.toString().length ? prev : curr), '');
    return (
      <View style={style}>
        <View style={{ flexGrow: 1 }} onLayout={event => this._onLayout(event)}>
          <Text style={{ opacity: 0, fontSize: svg.fontSize }}>{longestValue}</Text>
          <Svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height,
              width,
            }}>
            <G>
              {React.Children.map(children as React.ReactElement<any>[], child => {
                return React.cloneElement(child, extraProps);
              })}
              {ticks.map((value, index) => {
                return (
                  <SVGText
                    textAnchor={'middle'}
                    originX={x(value)}
                    alignmentBaseline={'hanging'}
                    {...svg}
                    key={index}
                    x={x(value)}>
                    {formatLabel(value, index)}
                  </SVGText>
                );
              })}
            </G>
          </Svg>
        </View>
      </View>
    );
  }
  _onLayout(event: LayoutChangeEvent) {
    const {
      nativeEvent: {
        layout: { width, height },
      },
    } = event;

    if (width !== this.state.width) {
      this.setState({ width, height });
    }
  }

  _getX(domain: number[]) {
    const {
      scale,
      contentInset: { left = 0, right = 0 },
    } = this.props;

    const { width } = this.state;

    const x = scale()
      .domain(domain)
      .range([left, width - right]);

    return x;
  }
}

export default XAxis;
