import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import { withTheme } from '../../styled';
import { ChartData } from '../../types';
import LineChart from '../charts/LineChart';
import {
    Header, IndexTitle, IndexTitles, IndexVal, IndexVals
} from './base/Comps';
import { getData, Props } from './base/getData';

function formatXAxis(value: number, index: number, data: ChartData) {
  const item = data[0].data[index];
  return item.label_key.substring(2);
}
function formatYAxis(value: number, index: number) {
  return value > 1000 ? (value / 1000).toFixed(1) + 'K' : value.toString();
}

const SalesTodayHourly: React.FC<Props> = props => {
  const { widget, symbol } = props;
  const [curTick, setCurTick] = React.useState(
    () => widget.data.graphData[0].value.length - 1
  );

  const data = getData(props);
  function formatter(value: number) {
    return symbol + numeral(value).format(`0,0.00`);
  }

  return (
    <View>
      <Header>
        <IndexTitles>
          <IndexTitle>Day today</IndexTitle>
          <IndexTitle>Day last week</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>
            {formatter(widget.data.graphData[0].value[curTick])}
          </IndexVal>
          <IndexVal>
            {formatter(widget.data.graphData[1].value[curTick])}
          </IndexVal>
        </IndexVals>
      </Header>
      <LineChart
        data={data}
        curTick={curTick}
        onTickClick={setCurTick}
        formatXAxis={formatXAxis}
        formatYAxis={formatYAxis}
      />
    </View>
  );
};

export default withTheme(SalesTodayHourly);
