import numeral from 'numeral';
import React from 'react';

import t from '../../i18n/en';
import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';

interface Props {
  widget: Widget;
  collapsed: boolean;
  symbol: string;
}

const CashCommitments: React.FC<Props> = ({ widget, collapsed, symbol }) => {
  function formatter(value: number) {
    return symbol + numeral(value).format(`0,0.00`);
  }
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      formatters: [t, formatter],
      rows: dataSet.rows.map((row, index) => {
        return {
          data: Object.keys(row)
            .sort()
            .map(k => row[k]),
          showWhenCollapsed: index === dataSet.rows.length - 1,
        };
      }),
    };
  });
  return <TableChart tabs={data} collapsed={collapsed} />;
};

export default CashCommitments;
