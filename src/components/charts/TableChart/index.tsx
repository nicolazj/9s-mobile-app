import React from 'react';
import { View } from 'react-native';

import * as P from '../../../primitives';
import { scale } from '../../../scale';
import styled, { th, withTheme } from '../../../styled';
import { DataTab } from '../../../types';
import Switch from '../../Switch';
interface Props {
  tabs: DataTab[];
  collapsed: boolean;
}

interface State {
  cur: number;
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

class TableChart extends React.Component<Props, State> {
  state = {
    cur: 0,
  };
  onChange = (selected: number) => {
    this.setState({ cur: selected });
  };
  render() {
    const { collapsed, tabs } = this.props;
    const { cur } = this.state;
    const data = tabs[cur];
    let { header, rows, formatters } = data;
    rows = collapsed ? rows.filter(d => d.showWhenCollapsed) : rows;
    const rowWidths = [2, 1, 1];
    const rowAligns = ['left', 'right', 'right'];
    return (
      <ChartWrapper>
        {data.header && data.header.length > 0 && (
          <Row key="head">
            {React.Children.map(header, (key, key_index) => {
              return (
                <ColText
                  key={key_index}
                  grow={rowWidths[key_index]}
                  style={{ textAlign: rowAligns[key_index] }}
                >
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
                    style={{ textAlign: rowAligns[key_index] }}
                  >
                    {formatters[key_index](key)}
                  </ColText>
                );
              })}
            </Row>
          );
        })}

        {!collapsed && tabs.length > 1 && (
          <Switch
            cur={cur}
            options={tabs.map((tab, index) => ({
              label: tab.title,
              value: index,
            }))}
            onChange={this.onChange}
          />
        )}
      </ChartWrapper>
    );
  }
}

export default withTheme(TableChart);
