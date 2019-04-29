import React from 'react';
import { View } from 'react-native';
import t from '../../../i18n/en';
import * as P from '../../../primitives';
import styled, { IThemeInterface, scale } from '../../../styled';
import { Widget } from '../../../types';

interface Props {
  widget: Widget;
  theme: IThemeInterface;
}
export const Header = styled(View)`
  padding: 10px;
`;
export const IndexTitles = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;
export const IndexVals = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
`;
export const IndexTitle = styled(P.Text)`
  color: #333;
  font-size: ${scale(12)}px;
`;
export const IndexVal = styled(P.Text)`
  color: #333;
  font-weight: bold;
  font-size: ${scale(14)}px;
`;

export function timeInWord(milisec: number) {
  let sec = Math.floor(milisec / 1000);
  let word = '';
  if (sec > 3600) {
    word = Math.floor(sec / 3600) + 'h ';
    sec = sec % 3600;
  }
  word += Math.floor(sec / 60) + 'm ';
  sec = sec % 60;
  word += sec + 's';

  return word;
}
export type Data = {
  legend: string;
  svg: {
    stroke: string;
    strokeWidth: number;
  };
  data: {
    value: number;
    label_key: string;
  }[];
}[];

export class LineWidget extends React.Component<Props> {
  state = {
    curTick: this.props.widget.data.graphData[0].value.length - 1,
  };

  getData(): Data {
    const { widget, theme } = this.props;
    const { graphData = [], extras } = widget.data;
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
