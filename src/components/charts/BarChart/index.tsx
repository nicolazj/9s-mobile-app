import React from 'react';
import { View } from 'react-native';

import styled from '../../../styled';
import { Data } from '../../widget/base/LineWidget';
import Grid from '../Grid';
import Legend from '../Legend';
import XAxis from '../XAxis';
import YAxis from '../YAxis';
import Bar from './Bar';

interface Props {
  data: Data;
  onTickClick: (index: number) => void;
  formatXAxis: (value: number, index: number, data: Data) => string;
  formatYAxis: (value: number, index: number) => string;
  curTick: number;
}

export const ChartWrapper = styled(View)`
  padding: 0px 20px;
`;
class BarChartWrapper extends React.PureComponent<Props> {
  render() {
    const { data, onTickClick, formatXAxis, formatYAxis, curTick } = this.props;
    const xAxisHeight = 30;
    return (
      <ChartWrapper>
        <Legend data={data} />
        <View style={{ height: 200, padding: 0, flexDirection: 'row' }}>
          <YAxis
            data={data}
            style={{ marginBottom: xAxisHeight }}
            yAccessor={({ item: { value } }) => value}
            formatLabel={formatYAxis}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Bar
              data={data}
              style={{ flex: 1 }}
              yAccessor={({ item: { value } }) => value}
              onTickClick={onTickClick}
              curTick={curTick}
            >
              <Grid />
            </Bar>

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
      </ChartWrapper>
    );
  }
}

export default BarChartWrapper;
