import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import { Header, IndexTitle, IndexTitles, IndexVal, IndexVals } from './base/LineWidget';

function formatter(value: number) {
  return value + '0%';
}

interface Props {
  widget: Widget;
  collapsed: boolean;
}
const id = (t: any) => t;

const CampaignPerformance: React.FC<Props> = ({ widget, collapsed }) => {
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      header: ['Name', 'Opened', 'Clicked'],
      formatters: [id, formatter, formatter],
      rows: dataSet.rows.map((row, index) => {
        return {
          data: Object.keys(row)
            .sort()
            .map(k => row[k]),
          showWhenCollapsed: index === 0,
        };
      }),
    };
  });
  return (
    <View>
      <Header>
        <IndexTitles>
          <IndexTitle>Open rate</IndexTitle>
          <IndexTitle>Click rate</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>{widget.data.dataSets[0].rows[0].column_2}%</IndexVal>
          <IndexVal>{widget.data.dataSets[0].rows[0].column_3}%</IndexVal>
        </IndexVals>
      </Header>
      <TableChart tabs={data} collapsed={collapsed} />
    </View>
  );
};

export default CampaignPerformance;

export const sample: Widget = {
  attributes: {
    active: true,
    categories: [
      {
        id: '51cfef2b-0e6e-4550-b71b-e1c21b5f0d1d',
        name: 'MARKETING',
      },
      {
        id: 'dcfeb747-16a9-415f-b921-466ed3c774e3',
        name: 'ALL',
      },
    ],
    createdAt: 1550006919000,
    displayName: 'Campaign Performance',
    order: 7,
    origin: 'mailchimp',
    showOnDashboard: true,
    showOnMobile: true,
    status: 'ACTIVE',
  },
  data: {
    dataSets: [
      {
        rows: [
          {
            column_1: 'test',
            column_2: '50',
            column_3: '0',
          },
        ],
      },
    ],
    extras: [
      {
        value_1: 50,
        value_2: 0,
      },
    ],
    graphData: [],
  },
  id: 'f3e86cca-486a-44c7-86b7-ec0351d0dc9e',
  key: 'campaign-performance',
};
