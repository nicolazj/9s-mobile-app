import companyAgent from './company';
import miscAgent from './misc';
import publicAgent from './public';
import tokenAgent from './token';
import userAgent from './user';

export default {
  token: tokenAgent,
  public:publicAgent,
  user:userAgent,
  company:companyAgent,
  misc:miscAgent
}
