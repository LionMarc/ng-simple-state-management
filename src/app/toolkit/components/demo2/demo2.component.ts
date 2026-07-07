import { Component, input } from '@angular/core';

@Component({
  selector: 'ngssm-demo2',
  imports: [],
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.scss']
})
export class Demo2Component {
  public readonly comment = input<string>('');
}
