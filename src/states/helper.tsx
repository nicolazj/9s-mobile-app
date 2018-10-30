import { Container, Subscribe } from 'unstated';
import React from 'react';
export const SubscribeHOC = (containers: Container<any>[]) => (Comp: React.ReactType<any>) => (props: any) => {
  return <Subscribe to={containers}>{(...containers) => <Comp containers={containers} {...props} />}</Subscribe>;
};
