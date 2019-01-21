import React from 'react';
import { Text, View } from 'react-native';
import { Data } from '../../widget/base/LineWidget';

interface Props {
  data: Data;
}

const Legend: React.FC<Props> = ({ data }) => {
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
export default Legend;
