import { FieldProps } from 'formik';
import React from 'react';
import { TextInputProps } from 'react-native';
import { FormError, FormGroup, Picker, TextInput } from './basic';
interface FormikTextInputProps {
  placeholder?: string;
  label?: string;
}

export const FormikTextInput: React.SFC<FormikTextInputProps & TextInputProps & FieldProps> = ({
  field: { name, value },
  form: { touched, errors, handleChange },
  placeholder,
  label,
  secureTextEntry,
}) => (
  <FormGroup>
    <TextInput
      value={value}
      onChangeText={handleChange(name)}
      placeholder={placeholder}
      label={label}
      secureTextEntry={secureTextEntry}
    />
    {errors[name] && touched[name] && <FormError>{errors[name]}</FormError>}
  </FormGroup>
);

interface Options {
  label: string;
  value: string;
}
interface FormikPickerProps {
  options: Options[];
}

export const FormikPicker: React.SFC<FormikPickerProps & FieldProps> = ({
  field: { name, value },
  form: { touched, errors, handleChange },
  options,
}) => {
  const item = options.find(o => o.value === value);
  return (
    <FormGroup>
      <Picker
        onItemChange={o => handleChange(name)(o.value)}
        items={options}
        item={item ? item : options[0]}
        isNullable
      />
      {errors[name] && touched[name] && <FormError>{errors[name]}</FormError>}
    </FormGroup>
  );
};
