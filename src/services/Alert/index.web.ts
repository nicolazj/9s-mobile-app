import { Alert } from 'react-native';

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

export const alert: typeof Alert.alert = (
  ...args: ArgumentTypes<typeof Alert.alert>
) => {
  window.alert(args)
};
