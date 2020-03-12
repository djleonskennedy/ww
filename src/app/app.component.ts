// tslint:disable:no-host-metadata-property
import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WorkerService} from './worker.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {share} from 'rxjs/operators';

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
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    const rules$ = this.rules.valueChanges.pipe(share());

    Array.from({length: 150})
      .forEach((_, i) => this.rules.push(this.buildUser(i)));

    this.rules.setAsyncValidators([
      () => this.worker.prevValidator(this.form.getRawValue().rules)
    ]);
  }

  private buildUser(i: number) {
    return this.fb.group({
      id: [i],
      name: `Name ${i + 1}`,
      days: this.fb.control(i),
      age: this.fb.control(0, Validators.max(100))
    });
  }

  getError(i: number): boolean {
    if (this.rules.hasError('prev')) {
      return (this.rules.getError('prev') as number[]).some(idx => idx === i);
    }
    return false;
  }
}

