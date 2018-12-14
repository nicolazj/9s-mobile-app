import React from 'react';
import { View } from 'react-native';
import * as P from '../../primitives';

import { scale } from '../../scale';
import styled, { th } from '../../styled';
import { Widget } from '../../types';
import WidgetLine from './WidgetLine';
interface Props {
  widget: Widget;
}

const WidgetContainer = styled(View)`
  background-color: #fff;
  border-radius: 10px;
  margin: 20px 0;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
`;
const WidgetHeader = styled(View)`
  border-bottom-color: #ccc;
  border-bottom-width: 1px;
`;
const Padding = styled(View)`
  padding: 10px;
`;

const WidgetTitle = styled(P.Text)`
  font-weight: bold;
  font-size: ${scale(12)}px;
`;
export default class WidgetComp extends React.Component<Props> {
  public render() {
    const { widget } = this.props;
    return (
      <WidgetContainer>
        <WidgetHeader>
          <Padding>
            <WidgetTitle>{widget.attributes.displayName}</WidgetTitle>
          </Padding>
        </WidgetHeader>
        <WidgetLine widget={widget} />
      </WidgetContainer>
    );
  }
}
