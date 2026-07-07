import { Component, signal } from '@angular/core';

@Component({
  selector: 'ngssm-demo1',
  imports: [],
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss']
})
export class Demo1Component {
  public readonly comment = signal<string>('');
}
