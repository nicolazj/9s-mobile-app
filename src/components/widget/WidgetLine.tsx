import React from 'react';
import { View } from 'react-native';
import t from '../../i18n/en';
import * as P from '../../primitives';
import { scale } from '../../scale';
import styled, { IThemeInterface, withTheme } from '../../styled';
import { Widget } from '../../types';
import LineChart from '../charts/LineChart';

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
  padding: 20px;
`;

export class WidgetComp extends React.Component<Props> {
  public render() {
    const { widget, theme } = this.props;
    const { graphData, extras } = widget.data;
    const data = graphData.map((gd, i) => {
      return {
        legend: t(gd.data_set_name),
        svg: {
          stroke: theme.color.chart[i],
          strokeWidth: 3,
        },
        data: gd.value.map((v, i) => {
          return {
            value: v,
            label_key: extras[i].label_key,
          };
        }),
      };
    });

    return (
      <View>
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
          <LineChart data={data} onVertialGridClick={this.onVertialGridClick} />
        </ChartWrapper>
      </View>
    );
  }

  private onVertialGridClick(index: number) {
    console.log('onVertialGridClick', index);
  }
}

export default withTheme(WidgetComp);
