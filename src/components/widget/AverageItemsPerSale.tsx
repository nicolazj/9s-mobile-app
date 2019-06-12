import numeral from 'numeral';
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
  return label;
}
function formatYAxis(value: number, index: number) {
  return value > 1000 ? (value / 1000).toFixed(1) + 'K' : value.toString();
}

const AverageItemsPerSale: React.FC<Props> = props => {
  const { widget, symbol } = props;
  const [curTick, setCurTick] = React.useState(
    () => widget.data.graphData[0].value.length - 1
  );

  const data = getData(props);

  return (
    <View>
      <Header>
        <IndexTitles>
          <IndexTitle>Day avg</IndexTitle>
          <IndexTitle>Day last week</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>{widget.data.graphData[0].value[curTick]}</IndexVal>
          <IndexVal>{widget.data.graphData[1].value[curTick]}</IndexVal>
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

export default withTheme(AverageItemsPerSale);
