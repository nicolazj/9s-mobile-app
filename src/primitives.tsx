import { Platform, SafeAreaView, Text as Text_, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { scale } from './scale';
import styled, { th } from './styled';

export const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

export const Text = styled(Text_)`
  font-size: ${scale(14)}px;
`;

interface ContainerProps {
  padding?: boolean;
  vcenter?: boolean;
  hcenter?: boolean;
}
export const Container = styled(View)<ContainerProps>`
  flex: 1;
  width: 100%;
  background-color: ${th('color.view.bg')};
  ${p => (p.padding ? `padding: 0 ${scale(20)}px` : '')};
  ${p => (p.vcenter ? 'justify-content: center' : '')};
  ${p => (p.hcenter ? 'align-items: center' : '')};
`;

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
`;
