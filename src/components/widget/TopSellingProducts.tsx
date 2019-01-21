import _values from 'lodash.values';
import numeral from 'numeral';
import React from 'react';

import t from '../../i18n/en';
import { DataRow, Widget } from '../../types';
import TableChart from '../charts/TableChart';

function formatter(value: number) {
  return numeral(value).format('$0,0.00');
}

interface Props {
  widget: Widget;
  collapsed: boolean;
}

const id = (t: any) => t;

const WidgetComp: React.FC<Props> = ({ widget, collapsed }) => {
  const data: DataRow[] = widget.data.dataSets[0].rows.map((row, index) => {
    return {
      data: _values(row),
      showWhenCollapsed: index === 0,
    };
  });
  return (
    <TableChart
      data={data}
      header={['Product', 'Sales', 'Revenue']}
      colFormatters={[t, id, formatter]}
      collapsed={collapsed}
    />
  );
};

export default WidgetComp;
