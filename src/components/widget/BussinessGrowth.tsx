import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { withTheme } from '../../styled';
import LineChart from '../charts/LineChart';
import LineWidget, {
  ChartWrapper,
  Data,
  Header,
  IndexTitle,
  IndexTitles,
  IndexVal,
  IndexVals,
} from './base/LineWidget';

function formatXAxis(value: number, index: number, data: Data) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return label[0];
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
            <IndexTitle>Revenue growth</IndexTitle>
            <IndexTitle>Expense growth</IndexTitle>
          </IndexTitles>
          <IndexVals>
            <IndexVal>{widget.data.graphData[0].value[curTick]}%</IndexVal>
            <IndexVal>{widget.data.graphData[1].value[curTick]}%</IndexVal>
          </IndexVals>
        </Header>
        <ChartWrapper>
          <LineChart data={data} curTick={curTick} onTickClick={this.onTickClick} formatXAxis={formatXAxis} />
        </ChartWrapper>
      </View>
    );
  }
}

export default withTheme(WidgetComp);
