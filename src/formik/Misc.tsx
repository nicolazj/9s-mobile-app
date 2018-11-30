import { View } from 'react-native';
import { human } from 'react-native-typography';
import { Styles } from 'styled-components';
import * as P from '../primitives';
import { scale } from '../scale';
import styled, { th } from '../styled';
export const FormGroup = styled(View)`
  height: ${scale(60)}px;
  width: 100%;
  margin: 10px 0;
`;
export const FormError = styled(P.Text)`
  color: red;
  font-size: ${scale(12)}px;
`;
export const FormTitle = styled(P.Text)`
  ${human.title1Object as Styles};
  text-align: center;
  margin: ${scale(20)}px;
`;

export const FormDesc = styled(P.Text)`
  font-size: ${scale(14)}px;
  color: ${th('color.grey')};
`;
