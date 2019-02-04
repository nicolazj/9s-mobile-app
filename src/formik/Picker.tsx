import { FieldProps, Formik } from 'formik';
import React from 'react';
import Picker_ from '../components/Picker';
import { scale } from '../scale';
import styled, { th } from '../styled';
import { FormError, FormGroup } from './Misc';

export const Picker = styled(Picker_)`
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
}

const FormikPicker: React.FC<FormikPickerProps & FieldProps> = ({
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
      {errors[name] && touched[name] && <FormError>{errors[name] as string}</FormError>}
    </FormGroup>
  );
};
export default FormikPicker;
