import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { withTheme } from '../../styled';
import { Widget } from '../../types';
import LineChart from '../charts/LineChart';
import LineWidget, { Data, Header, IndexTitle, IndexTitles, IndexVal, IndexVals } from './base/LineWidget';

function formatXAxis(value: number, index: number, data: Data) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return label;
}

export class WebsiteGoalConversions extends LineWidget {
  render() {
    const { widget } = this.props;
    const { curTick } = this.state;
    const data = this.getData();
    return (
      <View>
        <Header>
          <IndexTitles>
            <IndexTitle>Total</IndexTitle>
            <IndexTitle>Rate</IndexTitle>
          </IndexTitles>
          <IndexVals>
            <IndexVal>{widget.data.graphData[0].value[curTick]}</IndexVal>
            <IndexVal>{widget.data.graphData[1].value[curTick]}</IndexVal>
          </IndexVals>
        </Header>
        <LineChart data={data} curTick={curTick} onTickClick={this.onTickClick} formatXAxis={formatXAxis} />
      </View>
    );
  }
}

export default withTheme(WebsiteGoalConversions);

export const sample: Widget = {
  attributes: {
    active: true,
    categories: [
      {
        id: '6d24ba0a-501b-457d-bddf-e44ea97754aa',
        name: 'INFORMATION',
      },
      {
        id: '51cfef2b-0e6e-4550-b71b-e1c21b5f0d1d',
        name: 'MARKETING',
      },
      {
        id: 'dcfeb747-16a9-415f-b921-466ed3c774e3',
        name: 'ALL',
      },
    ],
    createdAt: 1546899869000,
    displayName: 'Website Goal Conversions',
    order: 10039,
    origin: 'googleanalytics',
    showOnDashboard: true,
    showOnMobile: true,
    status: 'ACTIVE',
  },
  data: {
    dataSets: [],
    extras: [
      {
        label_key: 'd.7',
        value_1: 14,
        value_2: 5,
      },
      {
        label_key: 'd.1',
        value_1: 23,
        value_2: 6,
      },
      {
        label_key: 'd.2',
        value_1: 36,
        value_2: 11,
      },
      {
        label_key: 'd.3',
        value_1: 37,
        value_2: 4,
      },
      {
        label_key: 'd.4',
        value_1: 56,
        value_2: 11,
      },
      {
        label_key: 'd.5',
        value_1: 32,
        value_2: 11,
      },
      {
        label_key: 'd.6',
        value_1: 16,
        value_2: 7,
      },
    ],
    graphData: [
      {
        data_set_name: 'total.conversions',
        value: [14, 23, 36, 37, 56, 32, 16],
      },
      {
        data_set_name: 'conversion.rate',
        value: [5, 6, 11, 4, 11, 11, 7],
      },
    ],
  },
  id: 'bb2e8f8c-8dc9-434c-83a7-e3ca6ad1efca',
  key: 'website-conversions',
};
