/// <reference lib="webworker" />
// tslint:disable:no-bitwise
import {Actions, Tags} from '../model/worker/actions';

addEventListener('message', ({data}: { data: Actions }) => {
  function proceed(s: Actions) {
    switch (s.tag) {
      case Tags.Users: {
        const rules = s.payload.reduce((acc, x) => acc + (x.days >>> 0), 0);
        return {
          [Tags.Users]: rules > 1600
            ? {maxDays: true}
            : null
        };
      }
    }
  }

  postMessage(proceed(data));
});
