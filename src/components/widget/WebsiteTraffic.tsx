import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { withTheme } from '../../styled';
import LineChart from '../charts/LineChart';
import LineWidget  from './base/LineWidget';
import { timeInWord } from "./base/timeInWord";
import { Header, IndexTitle, IndexTitles, IndexVal, IndexVals } from "./base/Comps";
import { ChartData } from "../../types";

function formatXAxis(value: number, index: number, data: ChartData) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return label[0];
}

export class WebsiteTraffic extends LineWidget {
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
            <IndexVal>
              {timeInWord(widget.data.extras[curTick].value_2)}
            </IndexVal>
          </IndexVals>
        </Header>

        <LineChart
          data={data}
          curTick={curTick}
          onTickClick={this.onTickClick}
          formatXAxis={formatXAxis}
        />
      </View>
    );
  }
}

export default withTheme(WebsiteTraffic);
