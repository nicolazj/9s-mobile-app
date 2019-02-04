import { FieldProps } from 'formik';
import React from 'react';
import { TextInputProps } from 'react-native';
import { TextInput as TextInput_ } from 'react-native';
import { FormError, FormGroup } from './Misc';

import { scale } from '../scale';
import styled, { th } from '../styled';

const TextInput = styled(TextInput_).attrs(props => ({
  selectionColor: th('color.main')(props),
  placeholderTextColor: th('color.grey')(props),
}))`
  border: 1px solid ${th('color.grey')};
  width: 100%;
  padding: ${scale(16)}px;
  border-radius: 5px;
  font-size: ${scale(14)}px;
`;

interface FormikTextInputProps {
  placeholder?: string;
}

const FormikTextInput: React.FC<FormikTextInputProps & TextInputProps & FieldProps> = ({
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
    {errors[name] && touched[name] && <FormError>{errors[name] as string}</FormError>}
  </FormGroup>
);

export default FormikTextInput;
