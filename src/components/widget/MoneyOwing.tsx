import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import { DataTab, Widget } from '../../types';
import TableChart from '../charts/TableChart';
import {
    Header, IndexTitle, IndexTitles, IndexVal, IndexVals
} from './base/Comps';
import { Props } from './base/getData';

const id = (t: any) => t;

const MoneyOwing: React.FC<Props> = ({ widget, collapsed, symbol }) => {
  function formatter(value: number) {
    return symbol + numeral(value).format(`0,0.00`);
  }
  const data: DataTab[] = widget.data.dataSets.map((dataSet, dIndex) => {
    return {
      title: '',
      header: ['', ''] as React.ReactNodeArray,
      formatters: [id, formatter],
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
      <Header>
        <IndexTitles>
          <IndexTitle>Total</IndexTitle>
          <IndexTitle />
        </IndexTitles>
        <IndexVals>
          <IndexVal>{formatter(widget.data.extras[0].value_2)}</IndexVal>
          <IndexVal />
        </IndexVals>
      </Header>
      <TableChart tabs={data} collapsed={collapsed} />
    </View>
  );
};

export default MoneyOwing;
