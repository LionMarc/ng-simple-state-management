import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavigationSection } from './navigation-section';

@Component({
  selector: 'ngssm-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  @Input() public navigationSections: NavigationSection[] = [];
  @Input() public logo: string = 'assets/leono-logo.png';
}
