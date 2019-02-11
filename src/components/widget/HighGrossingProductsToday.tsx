import numeral from 'numeral';
import React from 'react';

import t from '../../i18n/en';
import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';

function formatter(value: number) {
  return numeral(value).format('$0,0.00');
}

interface Props {
  widget: Widget;
  collapsed: boolean;
}

const id = (t: any) => t;

const HighGrossingProductsToday: React.FC<Props> = ({ widget, collapsed }) => {
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      formatters: [t, id, formatter],
      rows: dataSet.rows.map((row, index) => {
        return {
          data: Object.keys(row)
            .sort()
            .map(k => row[k]),
          showWhenCollapsed: index === 0 || index === 1,
        };
      }),
    };
  });
  return <TableChart tabs={data} collapsed={collapsed} />;
};

export default HighGrossingProductsToday;
