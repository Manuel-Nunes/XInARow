import {
  ssGetWebToken
} from './sessionUtils';

import * as jwt from 'jsonwebtoken';

export function checkIfTokenIsTimeValid(){
  const token  = ssGetWebToken();
  jwt.decode(token);
}

