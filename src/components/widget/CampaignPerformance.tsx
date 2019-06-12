import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import { Header, IndexTitle, IndexTitles, IndexVal, IndexVals } from "./base/Comps";

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
