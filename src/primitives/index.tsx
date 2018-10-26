import { View, Text as Text_, TextInput as TextInput_, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { human } from 'react-native-typography';
import { Styles } from 'styled-components';
import styled, { th } from '../styled';
import { r } from '../ratio';
import Button_ from './button';

export const Text = styled(Text_)`
  font-size: ${r(12)}px;
`;

export const Container = styled(View)`
  flex: 1;
  width: 100%;
`;
export const Content = styled(Container)`
  padding: 0 18px;
`;
export const VCenter = styled(Container)`
  justify-content: center;
`;
export const Center = styled(VCenter)`
  align-items: center;
`;
export const SafeArea = styled(SafeAreaView)`
  flex: 1;
`;

export const KeyboardAvoiding = styled(KeyboardAvoidingView).attrs({ behavior: 'padding', enabled: true })`
  flex: 1;
`;
export const TextInput = styled(TextInput_).attrs({ selectionColor: 'red', placeholderTextColor: '#ccc' })`
  border: 1px solid ${th('color.border')};
  width: 100%;
  padding: ${r(17)}px;
  border-radius: 5px;
  font-size: ${r(12)}px;
`;
export const FormGroup = styled(View)`
  height: 60px;
  width: 100%;
  margin: 10px 0;
`;
export const FormError = styled(Text)`
  color: red;
`;
export const FormTitle = styled(Text)`
  ${human.title1Object as Styles};
  text-align: center;
`;

export const Link = styled(Button_)`
  color: ${th('color.main')};
`;
export const Button = styled(Button_)`
  background-color: ${th('color.main')};
  width: 100%;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  height: ${r(48)}px;
  padding: 15px;
`;
