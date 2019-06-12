import React from 'react';

import t from '../../../i18n/en';
import * as P from '../../../primitives';
import { IThemeInterface } from '../../../styled';
import { Widget, ChartData } from '../../../types';

interface Props {
  widget: Widget;
  theme: IThemeInterface;
  symbol: string;
}
export class LineWidget extends React.Component<Props> {
  state = {
    curTick: this.props.widget.data.graphData[0].value.length - 1,
  };

  getData(): ChartData {
    const { widget, theme } = this.props;
    const { graphData = [], extras } = widget.data;
    const data = graphData.map((gd, i) => {
      return {
        legend: t(gd.data_set_name),
        svg: {
          color: theme.color.chart[i],
        },
        data: gd.value.map((v, i) => {
          return {
            value: v,
            label_key: extras[i].label_key || '',
          };
        }),
      };
    });
    return data;
  }

  onTickClick = (index: number) => {
    this.setState({
      curTick: index,
    });
  };
}

export default LineWidget;
