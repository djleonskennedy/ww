// tslint:disable:variable-name

import {Actions} from './worker/actions';

export class WorkerValidator<A extends Actions> {
  constructor(public data: A) {
  }
}

