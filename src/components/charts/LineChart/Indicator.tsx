import React from 'react';
import { Circle, G } from 'react-native-svg';

class Indicator extends React.PureComponent {
  render() {
    const { x, y, data, mappedData, curTick } = this.props;
    return (
      <G>
        {mappedData.map((line, i) => {
          const dot = line[curTick];
          return (
            <Circle
              key={i}
              cx={x(dot.x)}
              y={y(dot.y)}
              r={5}
              fill={data[i].svg.stroke}
            />
          );
        })}
      </G>
    );
  }
}
export default Indicator;
