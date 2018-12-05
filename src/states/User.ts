import { Container } from 'unstated';
import { Company, User as User_ } from '../types';
interface State {
  me: User_;
  companies: Company[];
}

export class User extends Container<State> {}
export default new User();
