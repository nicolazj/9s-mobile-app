import React from 'react';
import { Animated, View } from 'react-native';

import * as P from '../../primitives';
import { scale } from '../../scale';
import styled, { th } from '../../styled';
import { Widget } from '../../types';
import Link from '../Link';
import BussinessGrowth from './BussinessGrowth';
import SalesByMonth from './SalesByMonth';
import widgetWebsiteGoalConversions from './WebsiteGoalConversions';
import widgetWebsiteTraffic from './WebsiteTraffic';

const { Value } = Animated;

const WidgetContainer = styled(View)`
  background-color: #fff;
  border-radius: 10px;
  margin: 20px 0;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
`;
const WidgetHeader = styled(View)`
  border-bottom-color: #ccc;
  border-bottom-width: 1px;
  padding: 10px;
  justify-content: space-between;
  flex-direction: row;
`;

const WidgetTitle = styled(P.Text)`
  font-weight: bold;
  font-size: ${scale(12)}px;
`;
const WidgetOp = styled(Link)``;
const WidgetWrapper = styled(Animated.View)`
  overflow: hidden;
`;

const NoDataPromp = styled(P.Text)`
  text-align: center;
`;
interface Props {
  widget: Widget;
}
interface State {
  show: boolean;
}

const HEIGHT_EXPANDED = 300;
const HEIGHT_COLLAPSED = 60;

const widgetsMap = {
  'website-conversions': widgetWebsiteGoalConversions,
  'website-traffic': widgetWebsiteTraffic,
  'sales-by-month': SalesByMonth,
  'business-growth': BussinessGrowth,
};
export default class WidgetComp extends React.Component<Props, State> {
  state = {
    show: true,
  } as State;

  height = new Value(HEIGHT_EXPANDED);

  onShowHidePress = () => {
    Animated.timing(this.height, {
      toValue: this.state.show ? HEIGHT_COLLAPSED : HEIGHT_EXPANDED,
      duration: 300,
    }).start();
    this.setState({
      show: !this.state.show,
    });
  };
  render() {
    const { widget } = this.props;
    const { show } = this.state;
    const Widget = widgetsMap[widget.key];
    if (!Widget) return null;

    return (
      <WidgetContainer>
        <WidgetHeader>
          <WidgetTitle>{widget.attributes.displayName}</WidgetTitle>
          <WidgetOp title={show ? 'Hide' : 'Show'} onPress={this.onShowHidePress} />
        </WidgetHeader>
        <WidgetWrapper style={{ height: this.height }}>
          {widget.data.extras ? <Widget widget={widget} /> : <NoDataPromp>no data</NoDataPromp>}
        </WidgetWrapper>
      </WidgetContainer>
    );
  }
}
