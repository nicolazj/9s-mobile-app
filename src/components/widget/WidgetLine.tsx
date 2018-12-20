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
  padding: 10px;
`;
const IndexTitles = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;
const IndexVals = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
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
  padding: 0px 20px;
`;

function formatXAxis(data, index, count) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return count > 7 ? label[0] : label;
}

export class WidgetComp extends React.Component<Props> {
  state = {
    curTick: this.props.widget.data.graphData[0].value.length - 1,
  };
  render() {
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
    const { curTick } = this.state;
    return (
      <View>
        <Header>
          <IndexTitles>
            <IndexTitle>{t(widget.data.graphData[0].data_set_name)}</IndexTitle>
            <IndexTitle>{t(widget.data.graphData[1].data_set_name)}</IndexTitle>
          </IndexTitles>
          <IndexVals>
            <IndexVal>{widget.data.graphData[0].value[curTick]}</IndexVal>
            <IndexVal>{widget.data.graphData[1].value[curTick]}</IndexVal>
          </IndexVals>
        </Header>

        <ChartWrapper>
          <LineChart
            data={data}
            curTick={curTick}
            onTickClick={this.onTickClick}
            formatXAxis={formatXAxis}
          />
        </ChartWrapper>
      </View>
    );
  }

  onTickClick = (index: number) => {
    this.setState({
      curTick: index,
    });
  };
}

export default withTheme(WidgetComp);
