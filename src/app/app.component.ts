import {Component, OnInit} from '@angular/core';
import {WorkerService} from './worker.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form = this.fb.group({
    rules: this.fb.array([
      this.fb.group({
        name: 'Loh',
        days: [1],
      }),
      this.fb.group({
        name: 'john',
        days: [2],
      }),
      this.fb.group({
        name: 'Dan',
        days: [3],
      }),
      this.fb.group({
        name: 'Vita',
        days: [4],
      }),
      this.fb.group({
        name: 'Anton',
        days: [5],
      })
    ], {
      asyncValidators: control => {
        this.worker.post(control.value);
        return this.worker.errors$;
      }
    })
  });

  get rules(): FormGroup[] {
    return (this.form.get('rules') as FormArray).controls as FormGroup[];
  }

  get errors() {
    return (this.form.get('rules') as FormArray).errors;
  }

  constructor(private worker: WorkerService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }
}

