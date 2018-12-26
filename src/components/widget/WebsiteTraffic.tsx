import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { withTheme } from '../../styled';
import LineChart from '../charts/LineChart';
import LineWidget, {
  ChartWrapper,
  Header,
  IndexTitle,
  IndexTitles,
  IndexVal,
  IndexVals,
  timeInWord,
} from './base/LineWidget';

function formatXAxis(data, index) {
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
            <IndexTitle>Total visits</IndexTitle>
            <IndexTitle>Average time</IndexTitle>
          </IndexTitles>
          <IndexVals>
            <IndexVal>{widget.data.extras[curTick].value_1}</IndexVal>
            <IndexVal>{timeInWord(widget.data.extras[curTick].value_2)}</IndexVal>
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
