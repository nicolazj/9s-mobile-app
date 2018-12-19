import * as array from 'd3-array';
import * as d3Scale from 'd3-scale';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import Svg, { G, Text as SVGText } from 'react-native-svg';

class XAxis extends PureComponent {
  static defaultProps = {
    spacingInner: 0.05,
    spacingOuter: 0.05,
    contentInset: {},
    svg: {},
    xAccessor: ({ index }) => index,
    scale: d3Scale.scaleLinear,
    formatLabel: value => value,
  };
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
    let values = array.merge(mappedData).map(item => item.x);
    values = values.filter((item, pos) => {
      return values.indexOf(item) === pos;
    });
    const extent = array.extent(values);
    const [min, max] = extent;
    const domain = [min, max];

    const x = this._getX(domain);
    const ticks = numberOfTicks ? x.ticks(numberOfTicks) : values;
    const extraProps = {
      x,
      ticks,
      height,
      formatLabel,
    };

    return (
      <View style={style}>
        <View style={{ flexGrow: 1 }} onLayout={event => this._onLayout(event)}>
          <Text style={{ opacity: 0, fontSize: svg.fontSize }}>{formatLabel(ticks[0], 0)}</Text>
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
                    textAnchor={'middle'}
                    originX={x(value)}
                    alignmentBaseline={'hanging'}
                    {...svg}
                    key={index}
                    x={x(value)}>
                    {formatLabel(value, index, ticks.length)}
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
        layout: { width, height },
      },
    } = event;

    if (width !== this.state.width) {
      this.setState({ width, height });
    }
  }

  _getX(domain) {
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
