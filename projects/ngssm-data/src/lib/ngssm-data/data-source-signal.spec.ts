import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmDataStateSpecification, updateNgssmDataState } from './state';
import { dataSourceToSignal } from './data-source-signal';
import { NgssmDataSourceValueStatus } from './model';

@Component({
  template: `
    <span id="status">{{ status.value() }}</span>
    @for (label of labels.value(); track label) {
      <div>{{ label }}</div>
    }
  `
})
class TestingComponent {
  public readonly status = dataSourceToSignal<NgssmDataSourceValueStatus>('data-labels', { type: 'status' });
  public readonly labels = dataSourceToSignal<string[]>('data-labels', { defaultValue: ['one', 'two'] });
}

describe('DataSourceSignal', () => {
  describe('dataSourceToSignal', () => {
    let fixture: ComponentFixture<TestingComponent>;
    let store: StoreMock;

    beforeEach(() => {
      store = new StoreMock({
        [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
      });

      const state = updateNgssmDataState(store.stateValue, {
        dataSourceValues: {
          'data-labels': {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {},
              value: ['info', 'warn']
            }
          }
        }
      });
      store.stateValue = state;

      TestBed.configureTestingModule({
        imports: [TestingComponent],
        providers: [{ provide: Store, useValue: store }],
        teardown: { destroyAfterEach: true }
      });

      fixture = TestBed.createComponent(TestingComponent);
      fixture.nativeElement.style['min-height'] = '200px';
      fixture.detectChanges();
    });

    it(`should render the default list when stored value is undefined`, () => {
      const state = updateNgssmDataState(store.stateValue, {
        dataSourceValues: {
          'data-labels': {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {},
              value: undefined
            }
          }
        }
      });
      store.stateValue = state;
      fixture.detectChanges();

      const divs = fixture.debugElement.queryAll(By.css('div')).map((d) => d.nativeElement.innerHTML);
      expect(divs).toEqual(['one', 'two']);
    });

    it(`should render the list of labels`, () => {
      const divs = fixture.debugElement.queryAll(By.css('div')).map((d) => d.nativeElement.innerHTML);
      expect(divs).toEqual(['info', 'warn']);
    });

    [NgssmDataSourceValueStatus.error, NgssmDataSourceValueStatus.loading, NgssmDataSourceValueStatus.loaded].forEach((status) => {
      it(`should render the '${status}' value`, () => {
        const state = updateNgssmDataState(store.stateValue, {
          dataSourceValues: {
            'data-labels': {
              status: { $set: status }
            }
          }
        });
        store.stateValue = state;
        fixture.detectChanges();

        const span = fixture.debugElement.query(By.css('#status')).nativeElement.innerHTML;
        expect(span).toEqual(status);
      });
    });
  });
});
