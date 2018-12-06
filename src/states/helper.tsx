import React from 'react';
import { Container, Subscribe } from 'unstated';

export const SubscribeHOC = (states: Array<Container<object>>) => (Comp: React.ReactType<any>) => (props: any) => {
  return <Subscribe to={states}>{(...states) => <Comp states={states} {...props} />}</Subscribe>;
};
