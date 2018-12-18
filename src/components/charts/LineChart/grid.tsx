import React from 'react';
import { G, Line } from 'react-native-svg';

class Grid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      highlight: props.data[0].data.length - 1,
    };
  }

  public render() {
    const { x, y, data, ticks } = this.props;
    const delta = Math.min(20, x(1) - x(0));
    const { svg } = data[0];
    const { highlight } = this.state;
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
            stroke={highlight === index ? svg.stroke : 'rgba(0,0,0,0.2)'}
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
            onPressIn={() => this.onVertialGridClick(index)}
          />,
        ])}
      </G>
    );
  }
  private onVertialGridClick = index => {
    this.setState({
      highlight: index,
    });
    this.props.onVertialGridClick(index);
  };
}
export default Grid;
