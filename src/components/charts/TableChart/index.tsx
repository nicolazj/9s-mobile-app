import React from 'react';
import { View } from 'react-native';

import * as P from '../../../primitives';
import { scale } from '../../../scale';
import styled, { th, withTheme } from '../../../styled';
import { DataRow } from '../../../types';

interface Formatter {
  (value: string): string;
}

interface Props {
  data: DataRow[];
  colFormatters: Formatter[];
  collapsed: boolean;
  header: React.ReactNodeArray;
}

export const ChartWrapper = styled(View)`
  padding: 0px 10px;
`;
const Row = styled(View)<{ stripe?: boolean; last?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
  ${p => (p.stripe ? `background-color: ${th('color.view.bg')(p)}` : '')};
`;
const ColText = styled(P.Text)<{ strong?: boolean; grow: number }>`
  font-size: ${scale(12)}px;
  ${p => (p.strong ? `font-weight:bold` : '')};
  flex: ${p => p.grow};
`;

const TableChart: React.FC<Props> = ({ data, colFormatters, collapsed, header = [] }) => {
  const rows = collapsed ? data.filter(d => d.showWhenCollapsed) : data;
  const rowWidths = [2, 1, 1];
  const rowAligns = ['left', 'right', 'right'];
  return (
    <ChartWrapper>
      {header.length > 0 && (
        <Row key="head">
          {React.Children.map(header, (key, key_index) => {
            return (
              <ColText key={key_index} grow={rowWidths[key_index]} style={{ textAlign: rowAligns[key_index] }}>
                {key}
              </ColText>
            );
          })}
        </Row>
      )}
      {rows.map((d, index) => {
        return (
          <Row stripe={index % 2 === 1} key={index}>
            {d.data.map((key, key_index) => {
              return (
                <ColText
                  key={key}
                  grow={rowWidths[key_index]}
                  strong={d.strong === true}
                  style={{ textAlign: rowAligns[key_index] }}>
                  {colFormatters[key_index](key)}
                </ColText>
              );
            })}
          </Row>
        );
      })}
    </ChartWrapper>
  );
};

export default withTheme(TableChart);
