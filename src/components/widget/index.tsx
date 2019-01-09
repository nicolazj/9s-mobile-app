import React from 'react';
import { Animated, View } from 'react-native';

import * as P from '../../primitives';
import { scale } from '../../scale';
import styled from '../../styled';
import { Widget } from '../../types';
import Link from '../Link';
import BussinessGrowth from './BussinessGrowth';
import CashCommitments from './CashCommitments';
import CashPositionAndCoverage from './CashPositionAndCoverage';
import GrossProfit from './GrossProfit';
import MoneyOwed from './MoneyOwed';
import MoneyOwedMoneyOwing from './MoneyOwedMoneyOwing';
import SalesByDay from './SalesByDay';
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
  text-align: left;
  padding: 0 10px;
`;
interface Props {
  widget: Widget;
}
interface State {
  collapsed: boolean;
}

const HEIGHT_EXPANDED = 300;
const HEIGHT_COLLAPSED = 60;

const widgetsMap = {
  'website-conversions': widgetWebsiteGoalConversions,
  'website-traffic': widgetWebsiteTraffic,
  'sales-by-month': SalesByMonth,
  'sales-by-day': SalesByDay,
  'business-growth': BussinessGrowth,
  'cash-position-and-coverage': CashPositionAndCoverage,
  'gross-profit': GrossProfit,
  'money-owed': MoneyOwed,
  'money-owed-and-money-owing': MoneyOwedMoneyOwing,
  'cash-commitments': CashCommitments,
};
export default class WidgetComp extends React.Component<Props, State> {
  state = {
    collapsed: true,
  } as State;

  height = new Value(HEIGHT_COLLAPSED);

  onShowHidePress = () => {
    Animated.timing(this.height, {
      toValue: this.state.collapsed ? HEIGHT_EXPANDED : HEIGHT_COLLAPSED,
      duration: 300,
    }).start();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render() {
    const { widget } = this.props;
    const { collapsed } = this.state;
    const Widget = widgetsMap[widget.key];
    if (!Widget) return null;
    const hasData = !!widget.data.extras;
    return (
      <WidgetContainer>
        <WidgetHeader>
          <WidgetTitle>{widget.attributes.displayName}</WidgetTitle>
          {hasData && <WidgetOp title={collapsed ? 'Show' : 'Hide'} onPress={this.onShowHidePress} />}
        </WidgetHeader>
        <WidgetWrapper style={{ height: this.height }}>
          {hasData ? (
            <Widget widget={widget} collapsed={collapsed} />
          ) : (
            <NoDataPromp>
              Sorry, we can't find your information. Check if your app contains and data or start making use of it
            </NoDataPromp>
          )}
        </WidgetWrapper>
      </WidgetContainer>
    );
  }
}
