import React from 'react';
import { TextInput as TextInput_, FormGroup, FormError } from './basic';
import { FieldProps } from 'formik';

interface TextInputProps {
  placeholder?: string;
}

export const FormikTextInput: React.SFC<TextInputProps & FieldProps> = ({ field: { name, value }, form: { touched, errors, handleChange }, placeholder }) => (
  <FormGroup>
    <TextInput_ value={value} onChangeText={handleChange(name)} placeholder={placeholder} />
    {errors[name] && touched[name] && <FormError>{errors[name]}</FormError>}
  </FormGroup>
);
