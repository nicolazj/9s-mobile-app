import _values from 'lodash.values';
import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import { DataRow, Widget } from '../../types';
import TableChart from '../charts/TableChart';

function formatter(value: number) {
  return numeral(value).format('0%');
}

interface Props {
  widget: Widget;
  collapsed: boolean;
}
const id = (t: any) => t;

const WidgetComp: React.FC<Props> = ({ widget, collapsed }) => {
  console.log(widget);
  const data: DataRow[] = widget.data.dataSets[0].rows.map((row, index) => {
    return {
      data: _values(row),
      showWhenCollapsed: index === 0,
    };
  });
  return (
    <View>
      <TableChart
        data={data}
        header={['Name', 'Opened', 'Clicked']}
        colFormatters={[id, formatter, formatter]}
        collapsed={collapsed}
      />
    </View>
  );
};

export default WidgetComp;
