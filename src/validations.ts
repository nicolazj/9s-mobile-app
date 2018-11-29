import { string } from 'yup';

export { object } from 'yup';

export const name = string()
  .matches(/^[@\'\-!.A-Za-z0-9]+$/, "Only accepts letters, numbers and @'-!.")
  .required('Required');

export const username = string()
  .email()
  .required('Required');

export const password = string()
  .min(8, 'Must be at least 8 characters long')
  .matches(/[A-Z]/, "Must have at least one 'Upper case' letter")
  .required('Required');
