import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import {
    Header, IndexTitle, IndexTitles, IndexVal, IndexVals
} from './base/Comps';
import { Props } from './base/getData';

function formatter(value: string) {
  const t = Date.parse(value);
  const d = new Date(t);
  return d.toLocaleTimeString();
}


const id = (t: any) => t;

const WorkingToday: React.FC<Props> = ({ widget, collapsed }) => {
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      header: ['Name', 'Time'],
      formatters: [id, formatter],
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
          <IndexTitle>Working today</IndexTitle>
          <IndexTitle>-</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>{widget.data.dataSets[0].rows.length.toString()}</IndexVal>
          <IndexVal>{''}</IndexVal>
        </IndexVals>
      </Header>
      <TableChart tabs={data} collapsed={collapsed} />
    </View>
  );
};

export default WorkingToday;
