import React from 'react';

import log from '../../logging';

interface State {
  error: boolean;
}
interface Props {
  error: any;
  whenError: React.ReactNode;
}
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { error: false };
  }
  componentDidCatch(error: any, errorInfo: any) {
    log(error, errorInfo);
    this.setState({
      error: true,
    });
  }
  render() {
    if (this.state.error) {
      return this.props.whenError;
    }
    return this.props.children;
  }
}
