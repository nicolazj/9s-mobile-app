import { FieldProps } from 'formik';
import React from 'react';
import { FormError, FormGroup, TextInput as TextInput_ } from './basic';

interface TextInputProps {
  placeholder?: string;
}

export const FormikTextInput: React.SFC<TextInputProps & FieldProps> = ({ field: { name, value }, form: { touched, errors, handleChange }, placeholder }) => (
  <FormGroup>
    <TextInput_ value={value} onChangeText={handleChange(name)} placeholder={placeholder} />
    {errors[name] && touched[name] && <FormError>{errors[name]}</FormError>}
  </FormGroup>
);
