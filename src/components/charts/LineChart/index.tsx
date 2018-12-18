import React from 'react';
import { Text, View } from 'react-native';

import t from '../../../i18n/en';
import Grid from './grid';
import LineChart from './LineChart';
import XAxis from './x-axis';
import YAxis from './y-axis';

function getXLabel(data, index, count) {
  const item = data[0].data[index];
  const label = item && t(item.label_key);
  return count > 7 ? label[0] : label;
}

const Legend = ({ data }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
      {data.map(d => {
        return (
          <View key={d.legend} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, margin: 4, backgroundColor: d.svg.stroke }} />
            <Text style={{ fontSize: 10 }}>{d.legend}</Text>
          </View>
        );
      })}
    </View>
  );
};

class LineChartWrapper extends React.PureComponent {
  public render() {
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
