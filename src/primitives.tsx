import { View, TextInput as _TextInput } from 'react-native';
import styled from './styled';

export const Container = styled(View)`
  flex: 1;
  background-color: #fff;
`;

export const Center = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const TextInput = styled(_TextInput)`
  border: 1px solid grey;
  width: 100%;
  padding: 10px;
  margin: 10px;
`;
