import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import { Props } from './base/getData';

function formatter(value: number) {
  return value + '%';
}
const id = (t: any) => t;



const ProductGrossProfit: React.FC<Props> = ({ widget, collapsed }) => {
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      title: ['Best', 'Worst'][dIndex],
      header: ['Product', 'Gross Profit'] as React.ReactNodeArray,
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

export default ProductGrossProfit;
