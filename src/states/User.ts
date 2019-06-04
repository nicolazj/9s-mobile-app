import { Container } from 'unstated';

import { Company, User as User_ } from '../types';

interface State {
  me: User_;
  companies: Company[];
}

export class UserState extends Container<State> {}
export default new UserState();
