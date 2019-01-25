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

const WidgetComp: React.FC<Props> = ({ widget, collapsed }) => {
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      title: ['Best', 'Worst'][dIndex],
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
      <TableChart tabs={data} collapsed={collapsed} />
    </View>
  );
};

export default WidgetComp;
