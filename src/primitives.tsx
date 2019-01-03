import { ReactElement } from 'react';
import {
  Platform,
  SafeAreaView,
  Text as Text_,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

import { scale } from './scale';
import styled, { th } from './styled';

export const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

export const Text = styled(Text_)<{ children?: string }>`
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
interface ContainerProps {
  padding?: boolean;
  margin?: boolean;
  vcenter?: boolean;
  hcenter?: boolean;
  children?: ReactElement<any>[] | ReactElement<any> | Element[] | Element;
}
export const Container = styled(View)<ContainerProps>`
  flex: 1;
  width: 100%;
  background-color: ${th('color.view.bg')};
  ${p => (p.padding ? `padding: 0 ${scale(20)}px` : '')};
  ${p => (p.margin ? `padding:  ${scale(20)}px` : '')};
  ${p => (p.vcenter ? 'justify-content: center' : '')};
  ${p => (p.hcenter ? 'align-items: center' : '')};
`;

export const SafeArea = styled(SafeAreaView)<{
  children?: ReactElement<any>[] | ReactElement<any>;
}>`
  flex: 1;
`;
