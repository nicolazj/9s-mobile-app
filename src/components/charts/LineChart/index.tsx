import React from 'react';
import { View } from 'react-native';

import { Data } from '../../widget/base/LineWidget';
import Grid from './Grid';
import Indicator from './Indicator';
import Legend from './Legend';
import Lines from './Lines';
import XAxis from './XAxis';
import YAxis from './YAxis';

interface Props {
  data: Data;
  onTickClick: (index: number) => void;
  formatXAxis: (value: number, index: number, data: Data) => string;
  formatYAxis: (value: number, index: number) => string;
  curTick: number;
}
class LineChartWrapper extends React.PureComponent<Props> {
  render() {
    const { data, onTickClick, formatXAxis, formatYAxis, curTick } = this.props;
    const xAxisHeight = 30;
    return (
      <View>
        <Legend data={data} />
        <View style={{ height: 200, padding: 0, flexDirection: 'row' }}>
          <YAxis
            data={data}
            style={{ marginBottom: xAxisHeight }}
            yAccessor={({ item: { value } }) => value}
            formatLabel={formatYAxis}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Lines
              data={data}
              style={{ flex: 1 }}
              yAccessor={({ item: { value } }) => value}
              onTickClick={onTickClick}
              curTick={curTick}>
              <Indicator />
              <Grid />
            </Lines>

            <XAxis
              style={{
                marginHorizontal: -20,
                height: xAxisHeight,
                paddingTop: 10,
              }}
              data={data}
              contentInset={{ left: 20, right: 20 }}
              formatLabel={(value, index) => {
                return formatXAxis(value, index, data);
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default LineChartWrapper;
