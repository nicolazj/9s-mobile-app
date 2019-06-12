import { View } from 'react-native';
import styled, { scale } from '../../../styled';
import * as P from '../../../primitives';

export const Header = styled(View)`
  padding: 10px;
`;
export const IndexTitles = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;
export const IndexVals = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
`;
export const IndexTitle = styled(P.Text)`
  color: #333;
  font-size: ${scale(12)}px;
`;
export const IndexVal = styled(P.Text)`
  color: #333;
  font-weight: bold;
  font-size: ${scale(14)}px;
`;
