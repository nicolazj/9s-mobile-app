import React from 'react';
import { Animated, Image, LayoutChangeEvent, View } from 'react-native';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import { getSymbol } from '../../currency';
import * as P from '../../primitives';
import { SCREENS } from '../../routes/constants';
import { alert } from '../../services/Alert';
import { useAppStore } from '../../stores/app';
import { getSample, useApp } from '../../stores/osp';
import styled, { scale } from '../../styled';
import { Widget } from '../../types';
import Link from '../Link';
import { ErrorBoundary } from './ErrorBoundary';
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

const HEIGHT_COLLAPSED = scale(60);

interface Props {
  widget: Widget;
  sample?: boolean;
  navigation: NavigationScreenProp<any, any>;
}
const WidgetComp: React.FC<Props> = ({ widget, sample, navigation }) => {
  const { currency } = useAppStore(({ currency }) => ({
    currency,
  }));

  const symbol = getSymbol(currency);

  const [collapsed, setCollapsed] = React.useState(() => !sample);
  const [maxHeight, setMaxHeight] = React.useState(300);

  const heightValue = React.useRef(
    new Value(sample ? maxHeight : HEIGHT_COLLAPSED)
  );

  const onShowHidePress = () => {
    Animated.timing(heightValue.current, {
      toValue: collapsed ? maxHeight : HEIGHT_COLLAPSED,
      duration: 300,
    }).start();

    setCollapsed(!collapsed);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > maxHeight) {
      !collapsed &&
        Animated.timing(heightValue.current, {
          toValue: height,
          duration: 300,
        }).start();
    }

    setMaxHeight(height);
  };
  const gotoWidgetInfo = (widget: Widget) => {
    const { key } = widget;
    const sample = getSample(key);
    if (sample) {
      navigation.navigate(SCREENS[SCREENS.WIDGET_INFO], {
        key: widget.key,
      });
    } else {
      alert(
        'No information found',
        `Unable to find information for ${
          widget.attributes.displayName
        }, try again later.`
      );
    }
  };

  const hasData = !!widget.data.extras || widget.data.dataSets;
  const Widget = getWidgetByKey(widget.key);
  const app = useApp(widget.attributes.origin);

  if (!Widget || !app)
    return sample ? (
      <P.Text>
        {widget.attributes.displayName + '|' + widget.key} not implemented
      </P.Text>
    ) : null;
  return (
    <WidgetContainer
      onPress={() => {
        sample && gotoWidgetInfo(widget);
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
            onPress={onShowHidePress}
          />
        )}
      </WidgetHeader>
      <WidgetWrapper style={{ height: heightValue.current }}>
        <View onLayout={onLayout}>
          {hasData ? (
            <ErrorBoundary whenError={<NoDataPromp>Oops, please try again later.</NoDataPromp>}>
              <Widget widget={widget} {...{ collapsed, symbol }} />
            </ErrorBoundary>
          ) : (
            <NoDataPromp>
              Sorry, we can't find your information. Check if your app contains
              any data or start making use of it
            </NoDataPromp>
          )}

          {!collapsed && !sample && (
            <WidgetFooter>
              <Link
                title="what does this mean?"
                onPress={() => gotoWidgetInfo(widget)}
              />
            </WidgetFooter>
          )}
        </View>
      </WidgetWrapper>
    </WidgetContainer>
  );
};

export default withNavigation(WidgetComp);
