import numeral from 'numeral';
import React from 'react';

import t from '../../i18n/en';
import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import { Props } from './base/getData';

function formatter(value: number) {
  return value + '%';
}

const id = (t: any) => t;

const TopSellingProductsToday: React.FC<Props> = ({ widget, collapsed }) => {
  widget.data.dataSets.length = 1;
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      header: ['Product', 'Sales', 'Revenue'],
      formatters: [t, id, formatter],
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
  return <TableChart tabs={data} collapsed={collapsed} />;
};

export default TopSellingProductsToday;
