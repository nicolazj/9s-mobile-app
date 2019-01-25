import React from 'react';
import { View } from 'react-native';
import * as P from '../primitives';
import { scale } from '../scale';
import styled, { th } from '../styled';

interface Props {
  options: { label: string; value: any }[];
  onChange: (selected: number) => any;
  cur: number;
}

const SwitchView = styled(View)`
  flex-direction: row;
  border: 1px solid ${th('color.main')};
  border-radius: 4px;
  width: ${scale(120)}px;
`;
const SwitchButton = styled(P.Touchable)<{ selected: boolean }>`
  padding: 3px 10px;
  background-color: ${p => (!p.selected ? '#fff' : th('color.main')(p))};
  flex: 1;
`;
const SwitchText = styled(P.Text)<{ selected: boolean }>`
  color: ${p => (p.selected ? '#fff' : th('color.main')(p))};
  text-align: center;
`;
const Switch: React.SFC<Props> = ({ options, cur, onChange }) => (
  <SwitchView>
    {options.map((option, index) => (
      <SwitchButton
        key={option.label}
        selected={index === cur}
        onPress={() => onChange(index)}
      >
        <SwitchText selected={index === cur}>{option.label}</SwitchText>
      </SwitchButton>
    ))}
  </SwitchView>
);
export default Switch;
