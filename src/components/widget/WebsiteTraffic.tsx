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
import { timeInWord } from './base/timeInWord';

function formatXAxis(value: number, index: number, data: ChartData) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return label[0];
}

const WebsiteTraffic: React.FC<Props> = props => {
  const { widget } = props;
  const [curTick, setCurTick] = React.useState(
    () => widget.data.graphData[0].value.length - 1
  );

  const data = getData(props);
  return (
    <View>
      <Header>
        <IndexTitles>
          <IndexTitle>Total visits</IndexTitle>
          <IndexTitle>Average time</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>{widget.data.extras[curTick].value_1}</IndexVal>
          <IndexVal>{timeInWord(widget.data.extras[curTick].value_2)}</IndexVal>
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

export default withTheme(WebsiteTraffic);
