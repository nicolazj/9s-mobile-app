import { Container } from 'unstated';
interface State {
  show: boolean;
  msg: string;
}

export class ActivityStatusState extends Container<State> {
  state = {
    show: false,
    msg: '',
  } as State;
  show(msg: string) {
    this.setState({
      show: true,
      msg,
    });
  }
  dismiss() {
    this.setState({
      show: false,
      msg: '',
    });
  }
}
export default new ActivityStatusState();
