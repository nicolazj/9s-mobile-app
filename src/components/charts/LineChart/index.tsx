import React from 'react';
import { View } from 'react-native';

import styled from '../../../styled';
import { ChartData } from '../../../types';
import Grid from '../Grid';
import Legend from '../Legend';
import XAxis from '../XAxis';
import YAxis from '../YAxis';
import Indicator from './Indicator';
import Lines from './Lines';

interface Props {
  data: ChartData;
  onTickClick: (index: number) => void;
  formatXAxis?: (value: number, index: number, data: ChartData) => string;
  formatYAxis?: (value: number, index: number) => string;
  curTick: number;
}

export const ChartWrapper = styled(View)`
  padding: 0px 20px;
`;
class LineChartWrapper extends React.PureComponent<Props> {
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
            <Lines
              data={data}
              style={{ flex: 1, marginLeft: -10 }}
              yAccessor={({ item: { value } }) => value}
              onTickClick={onTickClick}
              curTick={curTick}
            >
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
              contentInset={{ left: 20, right: 30 }}
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

export default LineChartWrapper;
