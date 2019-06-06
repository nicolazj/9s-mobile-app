import { FieldProps } from 'formik';
import React from 'react';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

import { Text as Text_, Touchable } from '../primitives';
import { SCREENS } from '../routes/constants';
import styled, { scale, th } from '../styled';
import { Options } from '../types';
import { FormError, FormGroup } from './Misc';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  options: Options[];
  selected?: Options;
  placeholder: string;
  title: string;
  subTitle: string;
  onUpdate: (item: Options) => void;
}

const Text = styled<{ selected: boolean }>(Text_)`
  color: ${props => (props.selected ? '#000' : th('color.grey'))};
`;
const Picker__: React.FC<Props> = ({
  navigation,
  options,
  selected,
  placeholder,
  title,
  subTitle,
  onUpdate,
  ...props
}) => {
  return (
    <Touchable
      {...props}
      onPress={() => {
        navigation.push(SCREENS[SCREENS.PICKER], {
          options,
          title,
          subTitle,
          onUpdate,
        });
      }}
    >
      <Text selected={!!selected}>
        {selected ? selected.label : placeholder}
      </Text>
    </Touchable>
  );
};

export const Picker = styled(withNavigation(Picker__))`
  border: 1px solid ${th('color.grey')};
  width: 100%;
  padding: ${scale(16)}px;
  border-radius: 5px;
`;

interface FormikPickerProps {
  options: Options[];
  placeholder: string;
  title: string;
  subTitle: string;
}

const FormikPicker: React.FC<FormikPickerProps & FieldProps> = ({
  field: { name, value },
  form: { touched, errors, handleChange },
  options,
  placeholder,
  title,
  subTitle,
}) => {
  const selected = options.find(o => o.value === value);

  return (
    <FormGroup>
      <Picker
        onUpdate={o => handleChange(name)(o.value)}
        options={options}
        selected={selected}
        placeholder={placeholder}
        title={title}
        subTitle={subTitle}
      />
      {errors[name] && touched[name] && (
        <FormError>{errors[name] as string}</FormError>
      )}
    </FormGroup>
  );
};
export default FormikPicker;
