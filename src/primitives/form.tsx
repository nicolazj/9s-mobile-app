import { FieldProps } from 'formik';
import React from 'react';
import { TextInputProps } from 'react-native';
import { FormError, FormGroup, TextInput as TextInput_ } from './basic';

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
    <TextInput_
      value={value}
      onChangeText={handleChange(name)}
      placeholder={placeholder}
      label={label}
      secureTextEntry={secureTextEntry}
    />
    {errors[name] && touched[name] && <FormError>{errors[name]}</FormError>}
  </FormGroup>
);
