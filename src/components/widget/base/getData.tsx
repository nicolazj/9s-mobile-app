import t from '../../../i18n/en';
import { IThemeInterface } from '../../../styled';
import { ChartData, Widget } from '../../../types';

export interface Props {
  widget: Widget;
  theme: IThemeInterface;
  symbol: string;
  collapsed:boolean
}

export const getData = (props: Props): ChartData => {
  const { widget, theme } = props;
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
};
