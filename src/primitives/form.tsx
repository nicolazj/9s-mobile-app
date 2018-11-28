import { FieldProps } from 'formik';
import React from 'react';
import { TextInputProps } from 'react-native';
import { FormError, FormGroup, Picker, TextInput } from './basic';
interface FormikTextInputProps {
  placeholder?: string;
}

export const FormikTextInput: React.SFC<FormikTextInputProps & TextInputProps & FieldProps> = ({
  field: { name, value },
  form: { touched, errors, handleChange },
  placeholder,
  secureTextEntry,
}) => (
  <FormGroup>
    <TextInput
      value={value}
      onChangeText={handleChange(name)}
      placeholder={placeholder}
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
  placeholder: string;
}

export const FormikPicker: React.SFC<FormikPickerProps & FieldProps> = ({
  field: { name, value },
  form: { touched, errors, handleChange },
  options,
  placeholder,
}) => {
  const item = options.find(o => o.value === value);

  return (
    <FormGroup>
      <Picker
        onItemChange={o => handleChange(name)(o.value)}
        items={options}
        item={item ? item : null}
        isNullable
        placeholder={placeholder}
      />
      {errors[name] && touched[name] && <FormError>{errors[name]}</FormError>}
    </FormGroup>
  );
};
