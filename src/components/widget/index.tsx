import React from 'react';
import { Animated, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import { scale } from '../../scale';
import styled from '../../styled';
import { Widget } from '../../types';
import Link from '../Link';
import { getWidgetByKey } from './utils';

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
const WidgetFooter = styled(View)`
  padding: 10px;
  justify-content: flex-end;
`;
const NoDataPromp = styled(P.Text)`
  text-align: left;
  padding: 0 10px;
  color: #999;
`;
interface Props {
  widget: Widget;
  sample: boolean;
  navigation: NavigationScreenProp<any, any>;
}
interface State {
  collapsed: boolean;
}

const HEIGHT_EXPANDED = 300;
const HEIGHT_COLLAPSED = 60;

class WidgetComp extends React.Component<Props, State> {
  private height: Animated.Value;

  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: props.sample ? false : true,
    };
    this.height = new Value(props.sample ? HEIGHT_EXPANDED : HEIGHT_COLLAPSED);
  }

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
    const { widget, sample } = this.props;
    const { collapsed } = this.state;
    const hasData = !!widget.data.extras;

    const Widget = getWidgetByKey(widget.key);
    if (!Widget) return null;
    return (
      <WidgetContainer>
        <WidgetHeader>
          <View>
            <WidgetTitle>{widget.attributes.displayName}</WidgetTitle>
            <P.Text>{widget.origin}</P.Text>
          </View>
          {hasData && <WidgetOp title={collapsed ? 'Show' : 'Hide'} onPress={this.onShowHidePress} />}
        </WidgetHeader>
        <WidgetWrapper style={{ height: this.height }}>
          {hasData ? (
            <Widget widget={widget} collapsed={collapsed} />
          ) : (
            <NoDataPromp>
              Sorry, we can't find your information. Check if your app contains any data or start making use of it
            </NoDataPromp>
          )}
        </WidgetWrapper>

        {!collapsed && !sample && (
          <WidgetFooter>
            <Link
              title="what does this mean?"
              onPress={() => {
                this.props.navigation.navigate(SCREENS[SCREENS.WIDGET_INFO], { key: widget.key });
              }}
            />
          </WidgetFooter>
        )}
      </WidgetContainer>
    );
  }
}

export default withNavigation(WidgetComp);
