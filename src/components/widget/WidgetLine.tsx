import React from 'react';
import { View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryLegend, VictoryLine } from 'victory-native';
import * as P from '../../primitives';

import { scale } from '../../scale';
import styled, { IThemeInterface, withTheme } from '../../styled';
import { Widget } from '../../types';
interface Props {
  widget: Widget;
  theme: IThemeInterface;
}
const Header = styled(View)`
  justify-content: space-between;
  flex-direction: row;
  padding: 10px;
`;

const IndexTitle = styled(P.Text)`
  color: #333;
  font-size: ${scale(12)}px;
`;
const IndexVal = styled(P.Text)`
  color: #333;
  font-weight: bold;
  font-size: ${scale(14)}px;
`;
const ChartWrapper = styled(View)`
  padding: 0px;
`;

export class WidgetComp extends React.Component<Props> {
  public render() {
    const { widget, theme } = this.props;
    const { graphData, extras } = widget.data;
    const data = graphData.map((gd, i) => {
      return gd.value.map((v, i) => {
        return {
          value: v,
          label_key: extras[i].label_key + '@' + i,
        };
      });
    });
    return (
      <View>
        <VictoryBar
          data={[
            { x: 1, y: 2, label: 'A' },
            { x: 2, y: 4, label: 'B' },
            { x: 3, y: 7, label: 'C' },
            { x: 4, y: 3, label: 'D' },
            { x: 5, y: 5, label: 'E' },
          ]}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      target: 'labels',
                      mutation: props => {
                        console.log(props);
                        return props.text === 'clicked' ? null : { text: 'clicked' };
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
        <Header>
          <View>
            <IndexTitle>{widget.data.graphData[0].data_set_name}</IndexTitle>
            <IndexVal>0</IndexVal>
          </View>
          <View>
            <IndexTitle>{widget.data.graphData[1].data_set_name}</IndexTitle>
            <IndexVal>0</IndexVal>
          </View>
        </Header>

        <ChartWrapper>
          <VictoryChart>
            <VictoryLegend
              x={125}
              y={0}
              orientation="horizontal"
              gutter={20}
              data={graphData.map((gd, i) => ({
                name: gd.data_set_name,
                symbol: { fill: theme.color.chart[i], type: 'square' },
              }))}
            />
            {data.map((l, i) => {
              return (
                <VictoryLine
                  key={i}
                  style={{
                    data: { stroke: theme.color.chart[i] },
                    parent: { border: '1px solid #ccc' },
                  }}
                  data={l}
                  x={'label_key'}
                  y={'value'}
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onPressIn: () => {
                          return [
                            {
                              target: 'labels',
                              mutation: props => {
                                console.log(props);
                                return props.text === 'clicked' ? null : { text: 'clicked' };
                              },
                            },
                          ];
                        },
                      },
                    },
                  ]}
                />
              );
            })}
          </VictoryChart>
        </ChartWrapper>
      </View>
    );
  }
}

export default withTheme(WidgetComp);
