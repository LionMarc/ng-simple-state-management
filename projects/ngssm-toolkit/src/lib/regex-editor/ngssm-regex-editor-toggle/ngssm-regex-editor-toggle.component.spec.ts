import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgssmRegexEditorComponent } from '../ngssm-regex-editor/ngssm-regex-editor.component';
import { NgssmRegexEditorToggleComponent } from './ngssm-regex-editor-toggle.component';

@Component({
  selector: 'ngssm-testing',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgssmRegexEditorToggleComponent],
  template: `
    <mat-form-field>
      <mat-label>Regex</mat-label>
      <input matInput [formControl]="regexControl" #regexInput readonly (click)="editorToggle.openEditor($event)" />
      <ngssm-regex-editor-toggle matSuffix [inputElement]="regexInput" #editorToggle [disabled]="regexControl.disabled">
      </ngssm-regex-editor-toggle>
    </mat-form-field>
  `,
  styles: []
})
export class TestingComponent {
  public readonly regexControl = new FormControl<string | null>(null);
}

const getEditor = (fixture: ComponentFixture<TestingComponent>): NgssmRegexEditorComponent =>
  fixture.debugElement.query(By.css('ngssm-regex-editor')).injector.get<NgssmRegexEditorComponent>(NgssmRegexEditorComponent);

describe('NgssmRegexEditorToggleComponent', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent, NoopAnimationsModule],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initial regex is empty', () => {
    beforeEach(async () => {
      component.regexControl.setValue(null);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it(`should be able to click on the toggle component`, async () => {
      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#toggleButton' }));

      expect(await element.isDisabled()).toBeFalse();
    });

    it(`should not be able to click on the toggle component when it is disabled`, async () => {
      component.regexControl.disable();
      fixture.detectChanges();
      await fixture.whenStable();

      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#toggleButton' }));

      expect(await element.isDisabled()).toBeTrue();
    });

    describe('when clicking on the toggle button', () => {
      beforeEach(async () => {
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#toggleButton' }));

        await element.click();
      });

      it(`should render a NgssmRegexEditorComponent when clicking on the toggle button`, () => {
        const editor = getEditor(fixture);

        expect(editor).not.toBeNull();
      });

      it(`should set NgssmRegexEditorComponent regex value to empty`, () => {
        const editor = getEditor(fixture);

        expect(editor.regexControl.value).toEqual('');
      });
    });
  });

  describe('when initial regex is not empty', () => {
    beforeEach(async () => {
      component.regexControl.setValue(`^\\d{4}-\\d{2}`);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it(`should be able to click on the toggle component`, async () => {
      const element = await loader.getHarness(MatButtonHarness.with({ selector: '#toggleButton' }));

      expect(await element.isDisabled()).toBeFalse();
    });

    describe('when clicking on the toggle button', () => {
      beforeEach(async () => {
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#toggleButton' }));

        await element.click();
      });

      it(`should render a NgssmRegexEditorComponent when clicking on the toggle button`, () => {
        const editor = getEditor(fixture);

        expect(editor).not.toBeNull();
      });

      it(`should set NgssmRegexEditorComponent regex value to empty`, () => {
        const editor = getEditor(fixture);

        expect(editor.regexControl.value).toEqual(`^\\d{4}-\\d{2}`);
      });
    });
  });

  it(`should dispatch a input event when updating the regex value in order to update the associated form control`, async () => {
    component.regexControl.setValue(`^\\d{4}-\\d{2}`);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = await loader.getHarness(MatButtonHarness.with({ selector: '#toggleButton' }));
    await element.click();
    const editor = getEditor(fixture);
    editor.closeEditor.emit('^\\d{4}');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.regexControl.value).toEqual('^\\d{4}');
  });
});
