import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import styled from '../../styled';
import { Widget } from '../../types';
import TableChart from '../charts/TableChart';

function formatter(value: number) {
  return numeral(value).format('$0,0.00');
}

interface Props {
  widget: Widget;
  collapsed: boolean;
}
export const ChartWrapper = styled(View)`
  padding: 0px 20px;
`;

const WidgetComp: React.StatelessComponent<Props> = ({ widget, collapsed }) => {
  return (
    <ChartWrapper>
      <TableChart
        data={widget.data.dataSets[0].rows}
        col1Formatter={t}
        col2Formatter={formatter}
        collapsed={collapsed}
      />
    </ChartWrapper>
  );
};

export default WidgetComp;
