import _values from 'lodash.values';
import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import { DataRow, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import LineWidget, { Data, Header, IndexTitle, IndexTitles, IndexVal, IndexVals } from './base/LineWidget';

function formatter(value: number) {
  return numeral(value).format('0%');
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
    <View>
      <Header>
        <IndexTitles>
          <IndexTitle>Open rate</IndexTitle>
          <IndexTitle>Click rate</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>{widget.data.dataSets[0].rows[0].column_2}%</IndexVal>
          <IndexVal>{widget.data.dataSets[0].rows[0].column_3}%</IndexVal>
        </IndexVals>
      </Header>
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
