import React from 'react';
import { Container, Subscribe } from 'unstated';
export const SubscribeHOC = (containers: Array<Container<any>>) => (Comp: React.ReactType<any>) => (props: any) => {
  return <Subscribe to={containers}>{(...containers) => <Comp containers={containers} {...props} />}</Subscribe>;
};
