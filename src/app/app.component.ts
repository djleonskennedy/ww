// tslint:disable:no-host-metadata-property
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WorkerService} from './worker.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {share} from 'rxjs/operators';
import {getRandomArbitrary} from './utils';
import {User} from './model/users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'root'
  }
})
export class AppComponent implements OnInit {
  form = this.fb.group({
    rules: this.fb.array([])
  });

  get rules() {
    return this.form.get('rules') as FormArray;
  }

  get rulesControls(): FormGroup[] {
    return this.rules.controls as FormGroup[];
  }

  get errors() {
    return (this.form.get('rules') as FormArray).errors;
  }

  constructor(
    private worker: WorkerService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.rules.setAsyncValidators([
      () => this.worker.prevValidator(this.form.getRawValue().rules)
    ]);
  }

  private buildUser(data?: User) {
    const group = this.fb.group({
      id: [getRandomArbitrary(0, 65000)],
      name: [],
      days: [0],
      age: this.fb.control(0, Validators.max(100))
    });
    group.patchValue(data ?? {});
    return group;
  }

  getError(i: number): boolean {
    if (this.rules.hasError('prev')) {
      return (this.rules.getError('prev') as number[]).some(idx => idx === i);
    }
    return false;
  }

  addUser(i?: number) {
    if (i !== undefined) {
      this.rules.insert(i + 1, this.buildUser());
    } else {
      this.rules.push(this.buildUser(undefined));
    }
  }

  removeUser(i: number) {
    this.rules.removeAt(i);
  }
}

