import {Injectable} from '@angular/core';
import {User} from './model/users';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  workers = new Map<string, Worker>([
    ['prev', new Worker('./workers/find-prev.worker', {type: 'module'})]
  ]);

  prevValidator(payload: User[]) {
    return this._constructWorkerStream('prev', payload);
  }

  private _constructWorkerStream<T>(key: string, dataSource: T) {
    const worker = this.workers.get(key);
    worker.postMessage(dataSource);
    return new Promise((resolve, reject) => {
      worker.onmessage = ({data}) => resolve(data);
      worker.onerror = (e: ErrorEvent) => reject(e);
    });
  }

  clear() {
    this.workers.forEach(w => w.terminate());
  }
}
