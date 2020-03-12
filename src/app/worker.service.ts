import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WorkerValidator} from './model/worker-validator';
import {Actions} from './model/worker/actions';
import {User} from './model/users';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  workers = new Map<string, Worker>([
    ['sum', new Worker('./workers/app.worker', {type: 'module'})],
    ['prev', new Worker('./workers/find-prev.worker', {type: 'module'})]
  ]);

  sumValidator(validator: WorkerValidator<Actions>) {
    return this._constructWorkerStream('sum', validator.data);
  }

  prevValidator(items: User) {
    return this._constructWorkerStream('prev', items);
  }

  private _constructWorkerStream<T>(key: string, dataSource: T) {
    const worker = this.workers.get(key);
    worker.postMessage(dataSource);
    return new Observable(sub => {
      worker.onmessage = ({data}) => sub.next(data);
      worker.onerror = (e: ErrorEvent) => sub.error(e);
    }).pipe(take(1));
  }

  clear() {
    this.workers.forEach(w => w.terminate());
  }
}
