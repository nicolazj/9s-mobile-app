import React from 'react';
import { View } from 'react-native';
import styled from '../styled';
interface Props {
  current: number;
  length: number;
}

const PView = styled(View)`
  flex-direction: row;
`;

const Dot = styled(View)<{ selected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin: 0 4px;
  background-color: ${p => (p.selected ? '#333' : '#999')};
`;
const PaginationIndicator: React.FC<Props> = ({ current = 0, length }) => {
  const renderIndicatorItem = (index: number, selected: boolean) => (
    <Dot selected={selected} key={index} />
  );

  const renderIndicators = () => {
    const indicators = [];
    for (let i = 0; i < length; i += 1) {
      indicators.push(renderIndicatorItem(i, i === current));
    }
    return indicators;
  };

  return <PView>{renderIndicators()}</PView>;
};
export default PaginationIndicator;
