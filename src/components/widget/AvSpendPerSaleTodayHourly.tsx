import { copyFile } from 'fs';
import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import { withTheme } from '../../styled';
import BarChart from '../charts/BarChart';
import BarWidget from './base/BarWidget';
import {
    Data, Header, IndexTitle, IndexTitles, IndexVal, IndexVals
} from './base/LineWidget';

function formatXAxis(value: number, index: number, data: Data) {
  const item = data[0].data[index];
  return item.label_key.substring(2);
}
function formatYAxis(value: number, index: number) {
  return value > 1000 ? (value / 1000).toFixed(1) + 'K' : value.toString();
}

export class AvSpendPerSaleTodayHourly extends BarWidget {
  render() {
    const { widget, symbol } = this.props;
    const { curTick } = this.state;

    const data = this.getData();
    function formatter(value: number) {
      return symbol + numeral(value).format(`0,0.0`);
    }
    return (
      <View>
        <Header>
          <IndexTitles>
            <IndexTitle>Hour avg</IndexTitle>
            <IndexTitle>Hour last week</IndexTitle>
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
        <BarChart
          data={data}
          curTick={curTick}
          onTickClick={this.onTickClick}
          formatXAxis={formatXAxis}
          formatYAxis={formatYAxis}
        />
      </View>
    );
  }
}

export default withTheme(AvSpendPerSaleTodayHourly);
