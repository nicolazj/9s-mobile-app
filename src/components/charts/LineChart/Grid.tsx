import React from 'react';
import { G, Line } from 'react-native-svg';

class Grid extends React.PureComponent {
  render() {
    const { x, y, data, ticks, onTickClick, curTick } = this.props;

    const delta = Math.min(20, x(1) - x(0));
    const { svg } = data[0];
    return (
      <G>
        {ticks.map(tick => (
          <Line key={tick} x1={'0%'} x2={'100%'} y1={y(tick)} y2={y(tick)} stroke={'rgba(0,0,0,0.2)'} />
        ))}
        {data[0].data.map((_, index) => [
          <Line
            key={index}
            y1={'0%'}
            y2={'100%'}
            x1={x(index)}
            x2={x(index)}
            stroke={curTick === index ? svg.stroke : 'rgba(0,0,0,0.2)'}
            strokeDasharray={[4, 4]}
            strokeWidth="1"
          />,
          <Line
            key={index + '-clickable'}
            y1={'0%'}
            y2={'100%'}
            x1={x(index)}
            x2={x(index)}
            stroke={'rgba(0,0,0,0)'}
            strokeWidth={delta}
            onPressIn={() => onTickClick(index)}
          />,
        ])}
      </G>
    );
  }
}
export default Grid;
