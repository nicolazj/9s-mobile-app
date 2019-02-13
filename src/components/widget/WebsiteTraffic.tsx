import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { withTheme } from '../../styled';
import { Widget } from '../../types';
import LineChart from '../charts/LineChart';
import LineWidget, { Data, Header, IndexTitle, IndexTitles, IndexVal, IndexVals, timeInWord } from './base/LineWidget';

function formatXAxis(value: number, index: number, data: Data) {
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
            <IndexVal>{timeInWord(widget.data.extras[curTick].value_2)}</IndexVal>
          </IndexVals>
        </Header>

        <LineChart data={data} curTick={curTick} onTickClick={this.onTickClick} formatXAxis={formatXAxis} />
      </View>
    );
  }
}

export default withTheme(WebsiteTraffic);

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
    createdAt: 1549921971000,
    displayName: 'Website Traffic',
    order: 24,
    origin: 'googleanalytics',
    showOnDashboard: true,
    showOnMobile: true,
    status: 'ACTIVE',
  },
  data: {
    dataSets: [],
    extras: [
      {
        label_key: 'd.3',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.4',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.5',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.6',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.7',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.1',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.2',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.3',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.4',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.5',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.6',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.7',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.1',
        value_1: 0,
        value_2: 0,
      },
      {
        label_key: 'd.2',
        value_1: 0,
        value_2: 0,
      },
    ],
    graphData: [
      {
        data_set_name: 'unique.visits',
        value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        data_set_name: 'repeat.visits',
        value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  },
  id: '6feb90a7-ccac-4be9-a8f0-e6cce979a032',
  key: 'website-traffic',
};
