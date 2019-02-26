import _groupby from 'lodash.groupby';
import React from 'react';
import { Image, ScrollView, StatusBar, View } from 'react-native';
import SortableList from 'react-native-sortable-list';

import { Ionicons } from '@expo/vector-icons';

import agent from '../agent';
import SortableRow from '../components/SortableRow';
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

const List = styled(View)`
  background-color: #fff;
  padding: 10px 0;
`;
const ListItem = styled(View)`
  padding: 10px;
  flex-direction: row;
  border-bottom-color: #ddd;
  border-bottom-width: 1px;
  align-items: center;
`;
const Cell = styled(View)`
  padding: 0 10px;
`;

interface State {
  widgets: Widget[];
  scrollEnabled: boolean;
}

interface Props {
  states: [AppState];
}
export class ManageWidgets extends React.Component<Props, State> {
  state = {
    widgets: [],
    scrollEnabled: true,
  } as State;
  private orders: string[] = [];
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
    const { widgets, scrollEnabled } = this.state;
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
      <ScrollView scrollEnabled={scrollEnabled}>
        <P.Container style={{ backgroundColor: '#fff' }}>
          <StatusBar barStyle="light-content" />
          <P.H1 style={{ textAlign: 'center' }}>Manage</P.H1>
          <Group>
            <Title>DASHBOARD</Title>
            <List>
              <SortableList
                sortingEnabled={true}
                scrollEnabled={false}
                data={activeWidgetsShowed.reduce((p: { [key: string]: Widget }, cur, i) => {
                  p[cur.id] = cur;
                  return p;
                }, {})}
                order={activeWidgetsShowed.map(w => w.id)}
                onChangeOrder={(orders: string[]) => {
                  this.orders = orders;
                }}
                onActivateRow={() => {
                  this.setState({ scrollEnabled: false });
                }}
                onReleaseRow={async () => {
                  this.setState({ scrollEnabled: true });
                  const { orders } = this;
                  const toUpdate = [];
                  for (let widget of widgets) {
                    const { id } = widget;
                    const index = orders.indexOf(id);
                    if (index > -1) {
                      widget.attributes.order = index;
                      toUpdate.push([
                        widget.id,
                        {
                          order: index,
                          status: widget.attributes.status,
                          showOnMobile: '1',
                        },
                      ]);
                    }
                  }

                  this.setState({ widgets });
                  // need to execute this one by one, otherwise database can not handle it.
                  for (let payload of toUpdate) {
                    await agent.company.widget.updateAttrs(...(payload as [string, any]));
                  }
                }}
                renderRow={({ data: widget, active }: { data: Widget; active: boolean }) => {
                  return (
                    <SortableRow key={widget.id} active={active}>
                      <ListItem key={widget.id}>
                        <Cell>
                          <P.Touchable
                            onPress={() => {
                              this.toggle(widget, false);
                            }}>
                            <Ionicons name="ios-remove-circle" size={24} color="#ff3b30" />
                          </P.Touchable>
                        </Cell>
                        <Cell style={{ flex: 2 }}>
                          <P.Text>{widget.attributes.displayName}</P.Text>
                        </Cell>
                        <Cell>
                          <AppIcon source={{ uri: getIcon(widget.attributes.origin) }} />
                        </Cell>
                        <Cell>
                          <Ionicons name="ios-reorder" size={30} color="#999" />
                        </Cell>
                      </ListItem>
                    </SortableRow>
                  );
                }}
              />
            </List>
          </Group>

          {Object.keys(activeWidgetsNotShowedGrouped).map(key => {
            return (
              <Group key={key}>
                <Title>{key.toUpperCase()}</Title>
                <List>
                  {activeWidgetsNotShowedGrouped[key].map(widget => (
                    <ListItem key={widget.id}>
                      <Cell>
                        <P.Touchable
                          onPress={() => {
                            this.toggle(widget, true);
                          }}>
                          <Ionicons name="ios-add-circle" size={24} color="#4cd964" />
                        </P.Touchable>
                      </Cell>
                      <Cell style={{ flex: 2 }}>
                        <P.Text>{widget.attributes.displayName}</P.Text>
                      </Cell>
                      <Cell>
                        <AppIcon source={{ uri: getIcon(widget.attributes.origin) }} />
                      </Cell>
                      <Cell>
                        <Ionicons name="ios-reorder" size={30} color="#fff" />
                      </Cell>
                    </ListItem>
                  ))}
                </List>
              </Group>
            );
          })}
        </P.Container>
      </ScrollView>
    );
  }
}
export default SubscribeHOC([appState])(ManageWidgets);
