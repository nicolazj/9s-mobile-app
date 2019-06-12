import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import { Props } from './base/getData';

function formatter(value: number) {
  return value.toString().substring(0, 10);
}
const id = (t: any) => t;



const BookedLeave: React.FC<Props> = ({ widget, collapsed }) => {
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      title: '',
      header: ['Name', 'Starts', 'Days'] as React.ReactNodeArray,
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

export default BookedLeave;
