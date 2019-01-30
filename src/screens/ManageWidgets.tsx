import _groupby from 'lodash.groupby';
import React from 'react';
import { Image, ScrollView, StatusBar, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import SortableList from 'react-native-sortable-list';
import agent from '../agent';
import * as P from '../primitives';
import { scale } from '../scale';
import appState, { AppState } from '../states/Apps';
import { SubscribeHOC } from '../states/helper';
import styled from '../styled';
import { Widget } from '../types';

const Title = styled(P.Text)`
  color: #999;
  padding: 0 ${scale(10)}px;
`;
const Group = styled(View)`
  margin-bottom: 20px;
  padding-top: 10px;
`;
const AppIcon = styled(Image)`
  width: 16px;
  height: 16px;
`;

const List = styled(View)``;
const ListItem = styled(View)`
  padding: 10px;
  flex-direction: row;
  border-bottom-color: #aaa;
  border-bottom-width: 1px;
`;
const Left = styled(View)``;
const Body = styled(View)``;
const Right = styled(View)``;
interface State {
  widgets: Widget[];
}

interface Props {
  states: [AppState];
}
export class ManageWidgets extends React.Component<Props, State> {
  state = {
    widgets: [],
  } as State;
  async componentDidMount() {
    const widgets = await agent.company.widget.list();

    this.setState({ widgets });
  }
  toggle = (widget: Widget, show: boolean) => {
    agent.company.widget.updateAttrs(widget.id, {
      order: widget.attributes.order,
      status: widget.attributes.status,
      showOnMobile: show ? '1' : '0',
    });
    this.setState(state => {
      return {
        widgets: state.widgets.map(w =>
          w.id === widget.id
            ? {
                ...w,
                attributes: {
                  ...w.attributes,
                  showOnMobile: show,
                },
              }
            : w
        ),
      };
    });
  };
  render() {
    const { widgets } = this.state;
    const [appState] = this.props.states;

    const activeWidgets = widgets
      .filter(a => a.attributes.active)
      .sort((a, b) => {
        return a.attributes.order - b.attributes.order;
      });
    const activeWidgetsShowed = activeWidgets.filter(w => w.attributes.showOnMobile);
    const activeWidgetsNotShowedGrouped = _groupby(
      activeWidgets.filter(w => !w.attributes.showOnMobile),
      'attributes.origin'
    );

    const getIcon = (appKey: string) => appState.getApp(appKey)!.squareLogo;

    return (
      <P.Container style={{ backgroundColor: '#fff' }}>
        <StatusBar barStyle="light-content" />
        <P.H1>Manage</P.H1>
        <Group>
          <Title>DASHBOARD</Title>
          <List style={{ backgroundColor: '#fff' }}>
            <SortableList
              sortingEnabled={true}
              scrollEnabled={false}
              data={activeWidgetsShowed.reduce((p, cur, i) => {
                p[cur.attributes.order] = cur;
                return p;
              }, {})}
              order={activeWidgetsShowed.map(w => w.attributes.order)}
              onChangeOrder={orders => {
                console.log(orders);
              }}
              onPressRow={key => {
                console.log(key);
              }}
              renderRow={({ data: w }, active) => {
                return (
                  <ListItem key={w.id}>
                    {/* <P.Touchable
                        style={{ flexDirection: 'row' }}
                        onPress={() => {
                          this.toggle(w, false);
                        }}> */}
                    <Left>
                      <Ionicons name="ios-remove-circle" size={24} color="#ff3b30" />
                    </Left>
                    <Body style={{ flex: 2 }}>
                      <P.Text>{w.attributes.displayName}</P.Text>
                    </Body>
                    <Right>
                      <AppIcon source={{ uri: getIcon(w.attributes.origin) }} />
                    </Right>
                    {/* </P.Touchable> */}
                  </ListItem>
                );
              }}
            />

            {/* {activeWidgets
                .filter(w => w.attributes.showOnMobile)
                .map(w => (
                  <ListItem key={w.id}>
                    <P.Touchable
                      style={{ flexDirection: 'row' }}
                      onPress={() => {
                        this.toggle(w, false);
                      }}>
                      <Left>
                        <Ionicons name="ios-remove-circle" size={24} color="#ff3b30" />
                      </Left>
                      <Body style={{ flex: 2 }}>
                        <P.Text>{w.attributes.displayName}</P.Text>
                      </Body>
                      <Right>
                        <AppIcon source={{ uri: getIcon(w.attributes.origin) }} />
                      </Right>
                    </P.Touchable>
                  </ListItem>
                ))} */}
          </List>
        </Group>

        {Object.keys(activeWidgetsNotShowedGrouped).map(key => {
          return (
            <Group key={key}>
              <Title>{key.toUpperCase()}</Title>
              <List style={{ backgroundColor: '#fff' }}>
                {activeWidgetsNotShowedGrouped[key].map(w => (
                  <ListItem key={w.id}>
                    <Left>
                      <Ionicons name="ios-add-circle" size={24} color="#4cd964" />
                    </Left>
                    <Body style={{ flex: 2 }}>
                      <P.Text>{w.attributes.displayName}</P.Text>
                    </Body>
                    <Right>
                      <AppIcon source={{ uri: getIcon(w.attributes.origin) }} />
                    </Right>
                  </ListItem>
                ))}
              </List>
            </Group>
          );
        })}
      </P.Container>
    );
  }
}
export default SubscribeHOC([appState])(ManageWidgets);
