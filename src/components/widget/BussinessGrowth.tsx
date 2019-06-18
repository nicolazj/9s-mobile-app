import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { withTheme } from '../../styled';
import { ChartData } from '../../types';
import LineChart from '../charts/LineChart';
import {
    Header, IndexTitle, IndexTitles, IndexVal, IndexVals
} from './base/Comps';
import { getData, Props } from './base/getData';

function formatXAxis(value: number, index: number, data: ChartData) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return label[0];
}

const BussinessGrowth: React.FC<Props> = props => {
  const { widget } = props;
  const [curTick, setCurTick] = React.useState(
    () => widget.data.graphData[0].value.length - 1
  );

  const data = getData(props);
  return (
    <View>
      <Header>
        <IndexTitles>
          <IndexTitle>Revenue growth</IndexTitle>
          <IndexTitle>Expense growth</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>{widget.data.graphData[0].value[curTick]}%</IndexVal>
          <IndexVal>{widget.data.graphData[1].value[curTick]}%</IndexVal>
        </IndexVals>
      </Header>
      <LineChart
        data={data}
        curTick={curTick}
        onTickClick={setCurTick}
        formatXAxis={formatXAxis}
      />
    </View>
  );
};

export default withTheme(BussinessGrowth);
