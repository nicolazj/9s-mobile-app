import React from 'react';
import { Alert, Animated, Image, LayoutChangeEvent, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import { getSymbol } from '../../currency';
import log from '../../logging';
import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import appState, { AppState } from '../../states/Apps';
import cookieState, { CookieState } from '../../states/Cookie';
import { SubscribeHOC } from '../../states/helper';
import styled, { scale } from '../../styled';
import { Widget } from '../../types';
import Link from '../Link';
import { getWidgetByKey } from './utils';

const { Value } = Animated;

const WidgetContainer = styled(P.Touchable).attrs(() => ({
  activeOpacity: 1,
}))`
  background-color: #fff;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);
`;
const WidgetHeader = styled(View)`
  border-bottom-color: #ccc;
  border-bottom-width: 1px;
  padding: 10px;
  justify-content: space-between;
  flex-direction: row;
`;
const WidgetTitleWrapper = styled(View)`
  flex-direction: row;
`;

const WidgetTitle = styled(P.Text)`
  font-weight: bold;
  font-size: ${scale(12)}px;
`;
const WidgetAppIcon = styled(Image)`
  margin-left: 4px;
  width: 16px;
  height: 16px;
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
  sample?: boolean;
  navigation: NavigationScreenProp<any, any>;
  states: [AppState, CookieState];
}
interface State {
  collapsed: boolean;
  error: boolean;
  maxHeight: number;
}

const HEIGHT_COLLAPSED = scale(60);

class ErrorBoundary extends React.Component<any, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    log(error, errorInfo);

    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.error) {
      return <NoDataPromp>Oops, please try again later.</NoDataPromp>;
    }

    return this.props.children;
  }
}

class WidgetComp extends React.Component<Props, State> {
  private height: Animated.Value;

  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: props.sample ? false : true,
      error: false,
      maxHeight: 300,
    };
    this.height = new Value(
      props.sample ? this.state.maxHeight : HEIGHT_COLLAPSED
    );
  }

  onShowHidePress = () => {
    Animated.timing(this.height, {
      toValue: this.state.collapsed ? this.state.maxHeight : HEIGHT_COLLAPSED,
      duration: 300,
    }).start();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  setMaxHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > this.state.maxHeight) {
      !this.state.collapsed &&
        Animated.timing(this.height, {
          toValue: height,
          duration: 300,
        }).start();
    }
    this.setState({
      maxHeight: height,
    });
  };
  gotoWidgetInfo = (widget: Widget) => {
    const { key } = widget;
    const [appState] = this.props.states;
    const sample = appState.getSample(key);
    if (sample) {
      this.props.navigation.navigate(SCREENS[SCREENS.WIDGET_INFO], {
        key: widget.key,
      });
    } else {
      Alert.alert(
        'No information found',
        `Unable to find information for ${
          widget.attributes.displayName
        }, try again later.`
      );
    }
  };
  render() {
    const { widget, sample } = this.props;
    const [appState, cookieState] = this.props.states;
    const { collapsed } = this.state;
    const symbol = getSymbol(cookieState.state.currency);
    const hasData = !!widget.data.extras || widget.data.dataSets;

    const Widget = getWidgetByKey(widget.key);
    const app = appState.getApp(widget.attributes.origin);
    if (!Widget || !app)
      return sample ? (
        <P.Text>
          {widget.attributes.displayName + '|' + widget.key} not implemented
        </P.Text>
      ) : null;
    return (
      <WidgetContainer
        onPress={() => {
          sample && this.gotoWidgetInfo(widget);
        }}
      >
        <WidgetHeader>
          <WidgetTitleWrapper style={{ flexDirection: 'row' }}>
            <WidgetTitle>{widget.attributes.displayName}</WidgetTitle>
            {!sample && <WidgetAppIcon source={{ uri: app.squareLogo }} />}
          </WidgetTitleWrapper>
          {hasData && !sample && (
            <WidgetOp
              title={collapsed ? 'Show' : 'Hide'}
              onPress={this.onShowHidePress}
            />
          )}
        </WidgetHeader>
        <WidgetWrapper style={{ height: this.height }}>
          <View onLayout={this.setMaxHeight}>
            {hasData ? (
              <ErrorBoundary>
                <Widget widget={widget} {...{ collapsed, symbol }} />
              </ErrorBoundary>
            ) : (
              <NoDataPromp>
                Sorry, we can't find your information. Check if your app
                contains any data or start making use of it
              </NoDataPromp>
            )}

            {!collapsed && !sample && (
              <WidgetFooter>
                <Link
                  title="what does this mean?"
                  onPress={() => this.gotoWidgetInfo(widget)}
                />
              </WidgetFooter>
            )}
          </View>
        </WidgetWrapper>
      </WidgetContainer>
    );
  }
}

export default SubscribeHOC([appState, cookieState])(
  withNavigation(WidgetComp)
);
