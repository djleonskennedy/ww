// tslint:disable:no-host-metadata-property
import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WorkerService} from './worker.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WorkerValidator} from './model/worker-validator';
import {Tags} from './model/worker/actions';
import {map, mergeMap, share, tap} from 'rxjs/operators';
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
  form = this.fb.group({});

  get rules(): FormGroup[] {
    return (this.form.get('rules') as FormArray).controls as FormGroup[];
  }

  get errors() {
    return (this.form.get('rules') as FormArray).errors;
  }

  constructor(
    private worker: WorkerService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.form.setControl('rules', this.fb.array(
      Array.from({length: 150}).map((_, i) => this.buildUser(i, this.form)))
    );

    const rules = this.form.get('rules') as FormArray;
    const rules$ = rules.valueChanges.pipe(share());

    rules$
      .pipe(mergeMap(rs => this.worker.sumValidator(new WorkerValidator({
          tag: Tags.Users,
          payload: rs
        }))),
        map(r => r[Tags.Users])
      )
      .subscribe(errors => rules.setErrors(errors));
  }

  private buildUser(i: number, form: FormGroup) {
    return this.fb.group({
      id: [i],
      name: `Name ${i + 1}`,
      days: this.fb.control(i, null, () => this.worker.prevValidator(form.getRawValue().rules)),
      age: this.fb.control(0, Validators.max(100))
    });
  }
}

