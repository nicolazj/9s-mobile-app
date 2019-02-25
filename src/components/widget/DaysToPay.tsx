import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import { Header, IndexTitle, IndexTitles, IndexVal, IndexVals } from './base/LineWidget';

function formatter(value: string) {
  const t = Date.parse(value);
  const d = new Date(t);
  return d.toLocaleTimeString();
}

interface Props {
  widget: Widget;
  collapsed: boolean;
}
const id = (t: any) => t;

const DaysToPay: React.FC<Props> = ({ widget, collapsed }) => {
  return (
    <View>
      <Header>
        <IndexTitles>
          <IndexTitle>Days to pay </IndexTitle>
          <IndexTitle>Days to receive</IndexTitle>
        </IndexTitles>
        <IndexVals>
          <IndexVal>{widget.data.dataSets[0].rows[0].column_2}</IndexVal>
          <IndexVal>{widget.data.dataSets[0].rows[1].column_2}</IndexVal>
        </IndexVals>
      </Header>
    </View>
  );
};

export default DaysToPay;
