import numeral from 'numeral';
import React from 'react';
import { View } from 'react-native';

import t from '../../i18n/en';
import * as P from '../../primitives';
import { scale } from '../../scale';
import styled, { th, withTheme } from '../../styled';
import { Widget } from '../../types';

function formatter(value: number) {
  return numeral(value).format('$0,0.00');
}

interface Props {
  widget: Widget;
}
export const ChartWrapper = styled(View)`
  padding: 0px 20px;
`;
const Row = styled(View)<{ stripe: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
  ${p => (p.stripe ? `background-color: ${th('color.view.bg')(p)}` : '')};
`;
const ColText = styled(P.Text)`
  font-size: ${scale(12)}px;
`;
function TableChart({ data }) {
  console.log(data);
  return data.map((d, index) => {
    return (
      <Row stripe={index % 2 === 1} key={index}>
        <ColText>{t(d.column_1)}</ColText>
        <ColText>{formatter(d.column_2)}</ColText>
      </Row>
    );
  });
}

export class WidgetComp extends React.Component<Props> {
  render() {
    const { widget } = this.props;
    return (
      <ChartWrapper>
        <TableChart data={widget.data.dataSets[0].rows} />
      </ChartWrapper>
    );
  }
}

export default withTheme(WidgetComp);
