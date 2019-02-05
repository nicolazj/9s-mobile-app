import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Subscribe } from 'unstated';
import { Text } from '../primitives';
import { scale } from '../scale';
import activityStatus, { ActivityStatusState } from '../states/ActivityStatus';
import styled, { th } from '../styled';

const BG = styled(View)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled(View)`
  background-color: #fff;
  padding: ${scale(8)}px ${scale(16)}px;
  border-radius: ${scale(8)}px;
  min-width: ${scale(160)}px;
`;
const Message = styled(Text)`
  padding: ${scale(10)}px;
  font-size: ${scale(16)}px;
  text-align: center;
`;
const AI = styled(ActivityIndicator).attrs(props => ({
  size: 'large',
  color: th('color.main')(props),
}))``;
export default () => (
  <Subscribe to={[activityStatus]}>
    {(acticityStatus: ActivityStatusState) =>
      acticityStatus.state.show ? (
        <BG>
          <Wrapper>
            <Message>{acticityStatus.state.msg}</Message>
            <AI />
          </Wrapper>
        </BG>
      ) : null
    }
  </Subscribe>
);
