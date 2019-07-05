import { ScaleLinear } from 'd3-scale';
import React from 'react';
import { Circle, G } from 'react-native-svg';

import { ChartData } from '../../../types';
import { MappedData } from './Lines';

interface Props {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  curTick: number;
  data: ChartData;
  mappedData: MappedData;
}

class Indicator extends React.PureComponent<Props> {
  render() {
    const { x, y, data, mappedData, curTick } = this.props;
    return (
      <G>
        {mappedData
          .map((line, i) => {
            const dot = line[curTick];
            return (
              <Circle
                key={i}
                cx={x(dot.x)}
                cy={y(dot.y)}
                r={5}
                fill={data[i].svg.color}
              />
            );
          })
          .reverse()}
      </G>
    );
  }
}
export default Indicator;
