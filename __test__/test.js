import React from 'react';
import ResetPwd from '../src/screens/ResetPwd';
import renderer from 'react-test-renderer';
import tenant from '../src/tenant';
import { ThemeProvider } from '../src/styled';
const createTestProps = props => ({
  navigation: {
    navigate: jest.fn(),
  },
  ...props,
});
test('renders correctly', () => {
  const props = createTestProps({});
  const tree = renderer
    .create(
      <ThemeProvider theme={tenant.theme}>
        <ResetPwd {...props} />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
