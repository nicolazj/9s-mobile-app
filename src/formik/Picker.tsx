import { FieldProps, Formik } from 'formik';
import React from 'react';
import { withNavigation } from 'react-navigation';

import { Text, Touchable } from '../primitives';
import { SCREENS } from '../routes/constants';
import styled, { scale, th } from '../styled';
import { FormError, FormGroup } from './Misc';

const Picker__ = ({
  navigation,
  items,
  item,
  placeholder,
  title,
  subTitle,
  onItemChange,
  ...props
}) => {
  const update = onItemChange;
  return (
    <Touchable
      {...props}
      onPress={() => {
        navigation.push(SCREENS[SCREENS.PICKER], {
          items,
          item,
          title,
          subTitle,
          update,
        });
      }}
    >
      <Text>{item ? item.label : placeholder}</Text>
    </Touchable>
  );
};

export const Picker = styled(withNavigation(Picker__))`
  border: 1px solid ${th('color.grey')};
  width: 100%;
  padding: ${scale(16)}px;
  border-radius: 5px;
`;

interface Options {
  label: string;
  value: string;
}
interface FormikPickerProps {
  options: Options[];
  placeholder: string;
  title: string;
}

const FormikPicker: React.FC<FormikPickerProps & FieldProps> = ({
  field: { name, value },
  form: { touched, errors, handleChange },
  options,
  placeholder,
  title,
  subTitle,
}) => {
  const item = options.find(o => o.value === value);

  return (
    <FormGroup>
      <Picker
        onItemChange={o => handleChange(name)(o.value)}
        items={options}
        item={item ? item : null}
        isNullable={false}
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
