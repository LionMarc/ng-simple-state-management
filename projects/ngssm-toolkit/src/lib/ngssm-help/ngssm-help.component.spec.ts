import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgssmHelpComponent } from './ngssm-help.component';

@Component({
  template: ` <ngssm-help> NGContent Help </ngssm-help> `,
  standalone: true,
  imports: [CommonModule, NgssmHelpComponent]
})
class WithNgContentComponent {}

@Component({
  template: ` <ngssm-help [help]="help"></ngssm-help> `,
  standalone: true,
  imports: [CommonModule, NgssmHelpComponent]
})
class WithInputContentComponent {
  public readonly help = 'INPUT help';
}

describe('NgssmHelpComponent', () => {
  let loader: HarnessLoader;

  describe(`when using ng-content`, () => {
    let fixture: ComponentFixture<WithNgContentComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WithNgContentComponent, NoopAnimationsModule],
        teardown: { destroyAfterEach: false }
      }).compileComponents();

      fixture = TestBed.createComponent(WithNgContentComponent);
      fixture.nativeElement.style['min-height'] = '200px';
      loader = TestbedHarnessEnvironment.loader(fixture);
      fixture.detectChanges();
    });

    it(`should render a button with a 'fa-circle-question' icon`, () => {
      const element = fixture.debugElement.query(By.css('button .fa-circle-question'));

      expect(element).toBeTruthy();
    });

    it(`should render the help when clicking on the button`, async () => {
      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#helpButton' }));

      await element.click();

      const helpPanel = fixture.debugElement.query(By.css('.ngssm-help-panel'));
      expect(helpPanel).toBeTruthy();
      expect(helpPanel.nativeElement.innerHTML).toContain('NGContent Help');
    });
  });

  describe(`when using Input`, () => {
    let fixture: ComponentFixture<WithInputContentComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WithInputContentComponent, NoopAnimationsModule],
        teardown: { destroyAfterEach: false }
      }).compileComponents();

      fixture = TestBed.createComponent(WithInputContentComponent);
      fixture.nativeElement.style['min-height'] = '200px';
      loader = TestbedHarnessEnvironment.loader(fixture);
      fixture.detectChanges();
    });

    it(`should render a button with a 'fa-circle-question' icon`, () => {
      const element = fixture.debugElement.query(By.css('button .fa-circle-question'));

      expect(element).toBeTruthy();
    });

    it(`should render the help when clicking on the button`, async () => {
      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#helpButton' }));

      await element.click();

      const helpPanel = fixture.debugElement.query(By.css('.ngssm-help-panel'));
      expect(helpPanel).toBeTruthy();
      expect(helpPanel.nativeElement.innerHTML).toContain('INPUT help');
    });
  });
});
