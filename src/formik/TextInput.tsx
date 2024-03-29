import { FieldProps } from 'formik';
import React from 'react';
import { TextInput as TextInput_, TextInputProps } from 'react-native';

import styled, { scale, th } from '../styled';
import { FormError, FormGroup } from './Misc';

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

const FormikTextInput: React.FC<
  FormikTextInputProps &
    TextInputProps &
    FieldProps & { innerRef: React.Ref<any> }
> = ({
  field: { name, value },
  form: { touched, errors, handleChange },
  innerRef,
  ...props
}) => (
  <FormGroup>
    <TextInput
      value={value}
      onChangeText={handleChange(name)}
      ref={innerRef}
      {...props}
    />
    {errors[name] && touched[name] && (
      <FormError>{errors[name] as string}</FormError>
    )}
  </FormGroup>
);

export default FormikTextInput;
