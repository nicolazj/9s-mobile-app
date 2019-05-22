import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';

const id = (t: any) => t;

interface Props {
  widget: Widget;
  collapsed: boolean;
}

const SalesStaffPerformance: React.FC<Props> = ({
  widget,
  collapsed,
  symbol,
}) => {
  function formatter(value: number) {
    return symbol + numeral(value).format(`0,0.00`);
  }
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      title: ['Best', 'Worst'][dIndex],
      header: ['Staff', 'Revenue', 'Sales'] as React.ReactNodeArray,
      formatters: [id, formatter, id],
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

export default SalesStaffPerformance;
