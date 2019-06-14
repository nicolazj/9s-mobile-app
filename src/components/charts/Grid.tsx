import * as scale from 'd3-scale';
import React from 'react';
import { G, Line } from 'react-native-svg';

import { ChartData } from '../../types';

interface Props {
  data: ChartData;
  curTick: number;
  ticks: number[];
  onTickClick: (tick: number) => void;
  x: scale.ScaleLinear<number, number>;
  y: scale.ScaleLinear<number, number>;
  padding: number;
  width: number;
  height: number;
}

const Grid: React.FC<Props> = props => {
  const {
    x,
    y,
    data,
    ticks,
    onTickClick,
    curTick,
    padding,
    width,
    height,
  } = props;

  const delta = Math.min(20, x(1) - x(0));
  const { svg } = data[0];
  return (
    <G>
      {ticks.map((tick, index) => (
        <Line
          key={index}
          x1={padding}
          x2={width - padding}
          y1={y(tick)}
          y2={y(tick)}
          stroke={'rgba(0,0,0,0.2)'}
        />
      ))}
      {data[0].data.map((_, index) => [
        <Line
          key={index}
          y1={padding}
          y2={height - padding}
          x1={x(index)}
          x2={x(index)}
          stroke={curTick === index ? svg.color : 'rgba(0,0,0,0.2)'}
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
          onPressIn={() => {
            onTickClick(index);
          }}
        />,
      ])}
    </G>
  );
};
export default Grid;
