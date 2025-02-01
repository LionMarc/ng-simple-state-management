import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NGSSM_REGEX_EDITOR_VALIDATOR, RegexEditorValidator } from '../regex-editor-validator';
import { NgssmRegexEditorComponent } from './ngssm-regex-editor.component';

describe('NgssmRegexEditorComponent', () => {
  let component: NgssmRegexEditorComponent;
  let fixture: ComponentFixture<NgssmRegexEditorComponent>;
  let loader: HarnessLoader;

  describe('when using default regex validator', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NgssmRegexEditorComponent, NoopAnimationsModule],
        teardown: { destroyAfterEach: false }
      }).compileComponents();

      fixture = TestBed.createComponent(NgssmRegexEditorComponent);
      component = fixture.componentInstance;
      fixture.nativeElement.style['min-height'] = '200px';
      loader = TestbedHarnessEnvironment.loader(fixture);

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('Cancel button', () => {
      it(`should render a Cancel button`, async () => {
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#cancelButton' }));

        expect(await element.getText()).toContain('Cancel');
      });

      it(`should be able to click on the Cancel button`, async () => {
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#cancelButton' }));

        expect(await element.isDisabled()).toBeFalse();
      });

      it(`should emit the closeEditor event with no data when clicking on the Cancel button`, async () => {
        spyOn(component.closeEditor, 'emit');
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#cancelButton' }));

        await element.click();

        expect(component.closeEditor.emit).toHaveBeenCalledWith();
      });
    });

    describe('Submit button with no testing string', () => {
      it(`should render a Submit button`, async () => {
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

        expect(await element.getText()).toContain('Submit');
      });

      describe('when regex is not set', () => {
        beforeEach(async () => {
          component.regex = null;
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should not be able to submit regex`, async () => {
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          expect(await element.isDisabled()).toBeTrue();
        });

        it(`should not render a check icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-check'));

          expect(element).toBeNull();
        });

        it(`should not render a x-mark icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-xmark'));

          expect(element).toBeNull();
        });
      });

      describe(' when regex is not valid', () => {
        beforeEach(async () => {
          component.regex = '*/gh';
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should not be able to submit regex`, async () => {
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          expect(await element.isDisabled()).toBeTrue();
        });

        it(`should not render a check icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-check'));

          expect(element).toBeNull();
        });

        it(`should not render a x-mark icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-xmark'));

          expect(element).toBeNull();
        });
      });

      describe('when regex is valid', () => {
        beforeEach(async () => {
          component.regex = '^[a-z]';
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should be able to submit regex`, async () => {
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          expect(await element.isDisabled()).toBeFalse();
        });

        it(`should emit the closeEditor event with the entered regex when clicking on the Submit button`, async () => {
          spyOn(component.closeEditor, 'emit');
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          await element.click();

          expect(component.closeEditor.emit).toHaveBeenCalledWith('^[a-z]');
        });

        it(`should not render a check icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-check'));

          expect(element).toBeNull();
        });

        it(`should not render a x-mark icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-xmark'));

          expect(element).toBeNull();
        });
      });
    });

    describe('Using a test string', () => {
      beforeEach(async () => {
        component.testStringControl.setValue('2023-01-04 - SX5E');
        fixture.detectChanges();
        await fixture.whenStable();
      });

      describe('when regex is not set', () => {
        beforeEach(async () => {
          component.regex = null;
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should not be able to submit regex`, async () => {
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          expect(await element.isDisabled()).toBeTrue();
        });

        it(`should not render a check icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-check'));

          expect(element).toBeNull();
        });

        it(`should not render a x-mark icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-xmark'));

          expect(element).toBeNull();
        });
      });

      describe(' when regex is not valid', () => {
        beforeEach(async () => {
          component.regex = '*/gh';
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should not be able to submit regex`, async () => {
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          expect(await element.isDisabled()).toBeTrue();
        });

        it(`should not render a check icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-check'));

          expect(element).toBeNull();
        });

        it(`should not render a x-mark icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-xmark'));

          expect(element).toBeNull();
        });
      });

      describe('when regex is valid and does not match the test string', () => {
        beforeEach(async () => {
          component.regex = '^[a-z]';
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should not be able to submit regex`, async () => {
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          expect(await element.isDisabled()).toBeTrue();
        });

        it(`should not render a check icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-check'));

          expect(element).toBeNull();
        });

        it(`should render a x-mark icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-xmark'));

          expect(element).not.toBeNull();
        });
      });

      describe('when regex is valid and matches the test string', () => {
        beforeEach(async () => {
          component.regex = `^\\d{4}-\\d{2}`;
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should be able to submit regex`, async () => {
          const element = await loader.getHarness(MatButtonHarness.with({ selector: '#submitButton' }));

          expect(await element.isDisabled()).toBeFalse();
        });

        it(`should render a check icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-check'));

          expect(element).not.toBeNull();
        });

        it(`should not render a x-mark icon`, () => {
          const element = fixture.debugElement.query(By.css('.fa-xmark'));

          expect(element).toBeNull();
        });
      });
    });
  });

  describe('when using custom regex validator', () => {
    const customValidator: RegexEditorValidator = {
      validatePattern: () => ({ isValid: true }),
      isMatch: () => true
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NgssmRegexEditorComponent, NoopAnimationsModule],
        providers: [{ provide: NGSSM_REGEX_EDITOR_VALIDATOR, useValue: customValidator }],
        teardown: { destroyAfterEach: false }
      }).compileComponents();

      fixture = TestBed.createComponent(NgssmRegexEditorComponent);
      component = fixture.componentInstance;
      fixture.nativeElement.style['min-height'] = '200px';
      loader = TestbedHarnessEnvironment.loader(fixture);

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it(`should call the custom validator to check the regex`, async () => {
      spyOn(customValidator, 'validatePattern').and.returnValue({ isValid: true });
      component.regex = '^[a-z]';
      fixture.detectChanges();
      await fixture.whenStable();

      expect(customValidator.validatePattern).toHaveBeenCalledWith('^[a-z]');
    });

    it(`should call the custom validator to validate the test string`, async () => {
      component.regex = '^[a-z]';
      fixture.detectChanges();
      await fixture.whenStable();

      spyOn(customValidator, 'isMatch').and.returnValue(true);
      component.testStringControl.setValue('2023-01-04 - SX5E');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(customValidator.isMatch).toHaveBeenCalledWith('^[a-z]', '2023-01-04 - SX5E');
    });
  });
});
