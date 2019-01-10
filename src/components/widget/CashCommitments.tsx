import numeral from 'numeral';
import React from 'react';

import t from '../../i18n/en';
import { Widget } from '../../types';
import TableChart from '../charts/TableChart';

function formatter(value: number) {
  return numeral(value).format('$0,0.00');
}

interface Props {
  widget: Widget;
  collapsed: boolean;
}

const WidgetComp: React.StatelessComponent<Props> = ({ widget, collapsed }) => {
  return (
    <TableChart data={widget.data.dataSets[0].rows} col1Formatter={t} col2Formatter={formatter} collapsed={collapsed} />
  );
};

export default WidgetComp;
