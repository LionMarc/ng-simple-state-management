import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

import { NgssmAgGridThemeDirective } from './ngssm-ag-grid-theme.directive';

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
provideGlobalGridOptions({ theme: 'legacy' });

@Component({
  imports: [CommonModule, AgGridAngular, NgssmAgGridThemeDirective],
  template: ` <ag-grid-angular ngssmAgGridTheme> </ag-grid-angular> `,
  styles: [
    `
      :host {
        min-height: 400px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
      }

      ag-grid-angular {
        height: 100%;
      }
    `
  ]
})
class TestingComponent {}

describe('NgssmAgGridThemeDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent],
      declarations: [],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.queryAll(By.directive(NgssmAgGridThemeDirective))[0].injector.get(NgssmAgGridThemeDirective);
    expect(directive).toBeTruthy();
  });
});
