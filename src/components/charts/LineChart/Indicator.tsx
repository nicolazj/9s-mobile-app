import { ScaleLinear } from 'd3-scale';
import React from 'react';
import { Circle, G } from 'react-native-svg';
import { Data } from '../../widget/base/LineWidget';
import { MappedData } from './LineChart';
interface Props {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
  curTick: number;
  data: Data;
  mappedData: MappedData;
}

class Indicator extends React.PureComponent<Props> {
  render() {
    const { x, y, data, mappedData, curTick } = this.props;
    return (
      <G>
        {mappedData.map((line, i) => {
          const dot = line[curTick];
          return <Circle key={i} cx={x(dot.x)} y={y(dot.y)} r={5} fill={data[i].svg.stroke} />;
        })}
      </G>
    );
  }
}
export default Indicator;
