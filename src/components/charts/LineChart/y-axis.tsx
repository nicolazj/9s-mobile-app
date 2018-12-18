import * as array from 'd3-array';
import * as d3Scale from 'd3-scale';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { G, Svg, Text as SVGText } from 'react-native-svg';
import { getTicks } from './utils';

class YAxis extends PureComponent {
  public static defaultProps = {
    numberOfTicks: 4,
    spacingInner: 0.05,
    spacingOuter: 0.05,
    contentInset: {},
    svg: {},
    scale: d3Scale.scaleLinear,
    formatLabel: value => value && value.toString(),
    yAccessor: ({ item }) => item,
  };
  public state = {
    height: 0,
    width: 0,
  };

  public render() {
    const { style, data, scale, yAccessor, numberOfTicks, formatLabel, svg, children } = this.props;

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

    const { min = extent[0], max = extent[1] } = this.props;

    const domain = scale === d3Scale.scaleBand ? values : [min, max];

    const y = this.getY(domain);

    const ticks = scale === d3Scale.scaleBand ? values : getTicks(min, max, numberOfTicks);
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
          {/*invisible text to allow for parent resizing*/}
          <Text style={{ opacity: 0, fontSize: svg.fontSize }}>{longestValue}</Text>
          {height > 0 && width > 0 && (
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
                {// don't render labels if width isn't measured yet,
                // causes rendering issues
                height > 0 &&
                  ticks.map((value, index) => {
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

  private getY(domain) {
    const {
      scale,
      spacingInner,
      spacingOuter,
      contentInset: { top = 0, bottom = 0 },
    } = this.props;

    const { height } = this.state;

    const y = scale()
      .domain(domain)
      .range([height - bottom, top]);

    if (scale === d3Scale.scaleBand) {
      y.range([top, height - bottom])
        .paddingInner([spacingInner])
        .paddingOuter([spacingOuter]);

      return value => y(value) + y.bandwidth() / 2;
    }

    return y;
  }
}

export default YAxis;
