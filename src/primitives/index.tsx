import { View, Text as Text_, TextInput as TextInput_, SafeAreaView } from 'react-native';
import { human } from 'react-native-typography';
import { Styles } from 'styled-components';
import styled from '../styled';

import Button_ from './button';

export const Text = styled(Text_)`
  font-size: 12px;
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
export const TextInput = styled(TextInput_).attrs({ selectionColor: 'red', placeholderTextColor: '#ccc' })`
  border: 1px solid #ccc;
  width: 100%;
  padding: 17px;
  border-radius: 5px;
  font-size: 12px;
`;
export const FormGroup = styled(View)`
  height: 80px;
  width: 100%;
`;
export const FormError = styled(Text)`
  color: red;
`;
export const FormTitle = styled(Text)`
  ${human.title1Object as Styles};
`;

export const Button = styled(Button_)`
  background-color: #40d5bb;
  width: 100%;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  height: 48px;
  padding: 15px;
`;
