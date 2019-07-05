import {
    Platform, SafeAreaView, Text as Text_, TouchableOpacity, View
} from 'react-native';

import styled, { scale, th } from './styled';

export const Touchable = TouchableOpacity;

export const Text = styled(Text_)`
  font-size: ${scale(14)}px;
  font-family: 'System';
  font-weight: 400;
`;
export const H1 = styled(Text)`
  font-size: ${scale(28)}px;
  line-height: ${scale(28 * 1.7)}px;
`;
export const H2 = styled(Text)`
  font-size: ${scale(22)}px;
  line-height: ${scale(22 * 1.7)}px;
`;
export const H3 = styled(Text)`
  font-size: ${scale(16)}px;
  line-height: ${scale(16 * 1.7)}px;
`;
export const Title = styled(H1)`
  font-size: ${scale(24)}px;
  margin: ${scale(16)}px;
`;
export const SubTitle = styled(Text)`
  color: #aaa;
`;
interface ContainerProps {
  hasPadding?: boolean;
  hasMargin?: boolean;
  vcenter?: boolean;
  hcenter?: boolean;
  noFlex?:boolean;
}
export const Container = styled(View)<ContainerProps>`
  width: 100%;
  background-color: ${th('color.view.bg')};
  ${p => (p.noFlex !==true ? `flex:1;` : '')};
  ${p => (p.hasPadding ? `padding: 0 ${scale(10)}px` : '')};
  ${p => (p.hasMargin ? `padding:  ${scale(20)}px` : '')};
  ${p => (p.vcenter ? 'justify-content: center' : '')};
  ${p => (p.hcenter ? 'align-items: center' : '')};
`;

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
`;


export const List = styled(View)`
  background-color: #fff;
  border-top-color: #eee;
  border-bottom-color: #eee;
  border-top-width: 1px;
  border-bottom-width: 1px;
`;
export const ListItem = styled(Touchable)`
  flex-direction: row;
  border-bottom-color: #eee;
  border-bottom-width: 1px;
  padding: 10px;
  align-items: center;
  display:flex
`;

export const Body = styled(View)`
  flex: 1;
  align-items: center;
  align-self: center;
`;
export const Left = styled(View)`
  align-items: flex-end;
  align-self: center;
`;
export const Right = styled(View)`
  align-items: flex-start;
  align-self: center;
`;
