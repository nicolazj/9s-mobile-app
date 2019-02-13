import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';

function formatter(value: number) {
  return value + '%';
}
const id = (t: any) => t;

interface Props {
  widget: Widget;
  collapsed: boolean;
}

const TopPerformingCampaigns: React.FC<Props> = ({ widget, collapsed }) => {
  console.log(widget);

  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      title: ['Best', 'Worst'][dIndex],
      header: ['Name', 'Opened', 'Clicked'] as React.ReactNodeArray,
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
      <TableChart tabs={data} collapsed={collapsed} />
    </View>
  );
};

export default TopPerformingCampaigns;

export const sample: Widget = {
  attributes: {
    active: true,
    categories: [
      {
        id: 'dcfeb747-16a9-415f-b921-466ed3c774e3',
        name: 'ALL',
      },
      {
        id: '51cfef2b-0e6e-4550-b71b-e1c21b5f0d1d',
        name: 'MARKETING',
      },
    ],
    createdAt: 1550006919000,
    displayName: 'Top Performing Campaigns',
    order: 8,
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
    extras: [],
    graphData: [],
  },
  id: '0e390376-19f8-4e52-9449-240e91a62b22',
  key: 'top-performing-campaigns',
};
