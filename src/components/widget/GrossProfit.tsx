import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { withTheme } from '../../styled';
import LineChart from '../charts/LineChart';
import LineWidget, { Data, Header, IndexTitle, IndexTitles, IndexVal, IndexVals } from './base/LineWidget';

function formatXAxis(value: number, index: number, data: Data) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return label;
}
function formatYAxis(value: number, index: number) {
  return value > 1000 ? (value / 1000).toFixed(1) + 'K' : value.toString();
}
function formatter(value: number) {
  return numeral(value).format('$0,0.0');
}
export class WidgetComp extends LineWidget {
  render() {
    const { widget } = this.props;
    const { curTick } = this.state;
    const data = this.getData();

    return (
      <View>
        <Header>
          <IndexTitles>
            <IndexTitle>Day total</IndexTitle>
            <IndexTitle>Day last week</IndexTitle>
          </IndexTitles>
          <IndexVals>
            <IndexVal>{formatter(widget.data.graphData[0].value[curTick])}</IndexVal>
            <IndexVal>{formatter(widget.data.graphData[1].value[curTick])}</IndexVal>
          </IndexVals>
        </Header>
        <LineChart
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

export default withTheme(WidgetComp);
