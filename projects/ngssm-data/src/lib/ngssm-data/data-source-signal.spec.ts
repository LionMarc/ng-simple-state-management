import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmDataStateSpecification, updateNgssmDataState } from './state';
import { dataSourceSignals, dataSourceToSignal } from './data-source-signal';
import { NgssmDataSourceValueStatus } from './model';

@Component({
  template: `
    <span id="status">{{ status.value() }}</span>
    @for (label of labels.value(); track label) {
      <div>{{ label }}</div>
    }
    <span id="parameter">{{ parameter.value() }}</span>
  `
})
class TestingComponent {
  public readonly status = dataSourceToSignal<NgssmDataSourceValueStatus>('data-labels', { type: 'status' });
  public readonly labels = dataSourceToSignal<string[]>('data-labels', { defaultValue: ['one', 'two'] });
  public readonly parameter = dataSourceToSignal<string | undefined>('data-labels', { type: 'parameter' });
  public readonly dataSourceKey = signal('data-labels');
  public readonly dataSource = dataSourceSignals<string[], string>(this.dataSourceKey, {
    defaultValue: [],
    defaultParameter: 'default-parameter',
    defaultStatus: NgssmDataSourceValueStatus.loading
  });
}

const otherLabelsHttpError = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });

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
              value: ['info', 'warn'],
              parameter: 'my-parameter'
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

    it(`should render the parameter`, () => {
      const span = fixture.debugElement.query(By.css('#parameter')).nativeElement.innerHTML;
      expect(span).toEqual('my-parameter');
    });
  });

  describe('dataSourceSignals', () => {
    let fixture: ComponentFixture<TestingComponent>;
    let store: StoreMock;

    beforeEach(() => {
      store = new StoreMock({
        [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
      });

      store.stateValue = updateNgssmDataState(store.stateValue, {
        dataSourceValues: {
          'data-labels': {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {},
              value: ['info', 'warn'],
              parameter: 'labels-parameter'
            }
          },
          'other-labels': {
            $set: {
              status: NgssmDataSourceValueStatus.error,
              additionalProperties: {},
              value: ['other'],
              parameter: 'other-parameter',
              httpErrorResponse: otherLabelsHttpError
            }
          }
        }
      });

      TestBed.configureTestingModule({
        imports: [TestingComponent],
        providers: [{ provide: Store, useValue: store }],
        teardown: { destroyAfterEach: true }
      });

      fixture = TestBed.createComponent(TestingComponent);
      fixture.detectChanges();
    });

    it('should expose signals for the key, value, parameter, and status', () => {
      const { dataSource } = fixture.componentInstance;

      expect(dataSource.key()).toBe('data-labels');
      expect(dataSource.value()).toEqual(['info', 'warn']);
      expect(dataSource.parameter()).toBe('labels-parameter');
      expect(dataSource.status()).toBe(NgssmDataSourceValueStatus.loaded);
      expect(dataSource.httpErrorResponse()).toBeUndefined();
    });

    it('should update all signals when the key signal changes', () => {
      const { dataSource, dataSourceKey } = fixture.componentInstance;
      dataSourceKey.set('other-labels');
      fixture.detectChanges();

      expect(dataSource.key()).toBe('other-labels');
      expect(dataSource.value()).toEqual(['other']);
      expect(dataSource.parameter()).toBe('other-parameter');
      expect(dataSource.status()).toBe(NgssmDataSourceValueStatus.error);
      expect(dataSource.httpErrorResponse()).toBe(otherLabelsHttpError);
    });

    it('should use configured defaults when the key is not registered', () => {
      const { dataSource, dataSourceKey } = fixture.componentInstance;
      dataSourceKey.set('unregistered-labels');
      fixture.detectChanges();

      expect(dataSource.value()).toEqual([]);
      expect(dataSource.parameter()).toBe('default-parameter');
      expect(dataSource.status()).toBe(NgssmDataSourceValueStatus.loading);
      expect(dataSource.httpErrorResponse()).toBeUndefined();
    });
  });
});
