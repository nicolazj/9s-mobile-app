import { Container } from 'unstated';
interface State {
  show: boolean;
  msg: string;
}

export default class ActicityStatus extends Container<State> {
  public state = {
    show: false,
    msg: '',
  } as State;
  public show(msg: string) {
    this.setState({
      show: true,
      msg,
    });
  }
  public dismiss() {
    this.setState({
      show: false,
      msg: '',
    });
  }
}
