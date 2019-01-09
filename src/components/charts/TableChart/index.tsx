import React from 'react';
import { View } from 'react-native';

import * as P from '../../../primitives';
import { scale } from '../../../scale';
import styled, { th, withTheme } from '../../../styled';
import { DataRow } from '../../../types';

interface Props {
  data: DataRow[];
  col1Formatter: (value: string) => string;
  col2Formatter: (value: string) => string;
  collapsed: boolean;
}

export const ChartWrapper = styled(View)`
  padding: 0px 20px;
`;
const Row = styled(View)<{ stripe: boolean; last?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
  ${p => (p.stripe ? `background-color: ${th('color.view.bg')(p)}` : '')};
`;
const ColText = styled(P.Text)`
  font-size: ${scale(12)}px;
`;

const TableChart: React.StatelessComponent<Props> = ({ data, col1Formatter, col2Formatter, collapsed }) => {
  const rows = collapsed ? [data[data.length - 1]] : data;
  return (
    <View>
      {rows.map((d, index) => {
        return (
          <Row stripe={index % 2 === 1} key={index}>
            <ColText>{col1Formatter(d.column_1)}</ColText>
            <ColText>{col2Formatter(d.column_2)}</ColText>
          </Row>
        );
      })}
    </View>
  );
};

export default withTheme(TableChart);
