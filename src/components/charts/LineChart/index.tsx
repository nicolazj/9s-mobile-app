import React from 'react';
import { View } from 'react-native';

import t from '../../../i18n/en';
import Grid from './Grid';
import Indicator from './Indicator';
import Legend from './Legend';
import LineChart from './LineChart';
import XAxis from './XAxis';
import YAxis from './YAxis';

function getXLabel(data, index, count) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return count > 7 ? label[0] : label;
}

interface Props {
  data: any;
  onVertialGridClick: (index: number) => void;
}
class LineChartWrapper extends React.PureComponent<Props> {
  render() {
    const { data, onVertialGridClick } = this.props;
    const xAxisHeight = 30;
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 };
    return (
      <View>
        <Legend data={data} />
        <View style={{ height: 200, padding: 0, flexDirection: 'row' }}>
          <YAxis
            data={data}
            style={{ marginBottom: xAxisHeight }}
            contentInset={verticalContentInset}
            svg={axesSvg}
            yAccessor={({ item: { value } }) => value}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart data={data} style={{ flex: 1 }} yAccessor={({ item: { value } }) => value}>
              <Grid onVertialGridClick={onVertialGridClick} />
              <Indicator />
            </LineChart>

            <XAxis
              style={{ marginHorizontal: -10, height: xAxisHeight, paddingTop: 10 }}
              data={data}
              contentInset={{ left: 20, right: 20 }}
              svg={axesSvg}
              formatLabel={(value, index, count) => {
                return getXLabel(data, index, count);
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default LineChartWrapper;
