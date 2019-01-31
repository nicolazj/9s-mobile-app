import React from 'react';
import {
  Platform,
  SafeAreaView,
  Text as Text_,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import { scale } from './scale';
import styled, { th } from './styled';

type Intersection<A, B> = Pick<A, keyof A & keyof B>;
export const Touchable: React.ComponentType<Intersection<TouchableNativeFeedbackProps, TouchableOpacityProps>> =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

interface TextProps {
  children?: string | string[];
}
export const Text = styled(Text_)<TextProps>`
  font-size: ${scale(14)}px;
  font-family: 'System';
  font-weight: 400;
`;
export const H1 = styled(Text)<TextProps>`
  font-size: ${scale(28)}px;
  line-height: ${scale(28 * 1.7)}px;
`;
export const H2 = styled(Text)<TextProps>`
  font-size: ${scale(22)}px;
  line-height: ${scale(22 * 1.7)}px;
`;
export const H3 = styled(Text)<TextProps>`
  font-size: ${scale(16)}px;
  line-height: ${scale(16 * 1.7)}px;
`;
interface ContainerProps {
  padding?: boolean;
  margin?: boolean;
  vcenter?: boolean;
  hcenter?: boolean;
  children?: React.ReactNode;
}
export const Container = styled(View)<ContainerProps>`
  flex: 1;
  width: 100%;
  background-color: ${th('color.view.bg')};
  ${p => (p.padding ? `padding: 0 ${scale(10)}px` : '')};
  ${p => (p.margin ? `padding:  ${scale(20)}px` : '')};
  ${p => (p.vcenter ? 'justify-content: center' : '')};
  ${p => (p.hcenter ? 'align-items: center' : '')};
`;

export const SafeArea = styled(SafeAreaView)<{
  children?: React.ReactNode;
}>`
  flex: 1;
`;
