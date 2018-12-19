import * as array from 'd3-array';
import * as d3Scale from 'd3-scale';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { G, Svg, Text as SVGText } from 'react-native-svg';
import { getTicks } from './utils';

interface Props {
  numberOfTicks: number;
  contentInset: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  svg: object;
  scale: any;
  formatLabel: (value: string, index: number) => string;
  yAccessor: (d: any) => number;
  style?: React.CSSProperties;
}
interface State {
  height: number;
  width: number;
}
class YAxis extends PureComponent<Props, State> {
  static defaultProps = {
    numberOfTicks: 4,
    contentInset: {},
    svg: {},
    scale: d3Scale.scaleLinear,
    formatLabel: value => value && value.toString(),
    yAccessor: ({ item }) => item,
  } as Props;
  state = {
    height: 0,
    width: 0,
  } as State;

  render() {
    const { style, data, yAccessor, numberOfTicks, formatLabel, svg, children } = this.props;

    const { height, width } = this.state;

    if (data.length === 0) {
      return <View style={style} />;
    }

    const mappedData = data.map(dataArray =>
      dataArray.data.map((item, index) => ({
        y: yAccessor({ item, index }),
      }))
    );

    const values = array.merge(mappedData).map(item => item.y);

    const extent = array.extent([...values]);

    const [min, max] = extent;

    const domain = [min, max];

    const y = this.getY(domain);

    const ticks = getTicks(min, max, numberOfTicks);
    const longestValue = ticks
      .map((value, index) => formatLabel(value, index))
      .reduce((prev, curr) => (prev.toString().length > curr.toString().length ? prev : curr), 0);

    const extraProps = {
      y,
      ticks,
      width,
      formatLabel,
    };
    return (
      <View style={[style]}>
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
              {React.Children.map(children, child => {
                return React.cloneElement(child, extraProps);
              })}
              {ticks.map((value, index) => {
                return (
                  <SVGText
                    originY={y(value)}
                    textAnchor={'middle'}
                    x={'50%'}
                    alignmentBaseline={'middle'}
                    {...svg}
                    key={index}
                    y={y(value)}>
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

  _onLayout(event) {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = event;
    this.setState({ height, width });
  }

  getY(domain) {
    const {
      scale,
      contentInset: { top = 0, bottom = 0 },
    } = this.props;

    const { height } = this.state;

    const y = scale()
      .domain(domain)
      .range([height - bottom, top]);

    return y;
  }
}

export default YAxis;
