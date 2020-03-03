import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  readonly worker: Worker;

  readonly errors$: Observable<any>;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('./app.worker', {type: 'module'});
      this.errors$ = new Observable<any>(subscriber => {
        this.worker.onmessage = ({data}) => {
          subscriber.next(data);
        };

        this.worker.onerror = (e) => {
          subscriber.error(e);
        };
      });
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  post(message: string) {
    this.worker.postMessage(message);
  }
}
