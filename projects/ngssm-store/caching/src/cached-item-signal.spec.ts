import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNgssmStoreTesting, StoreMock } from 'ngssm-store/testing';
import { CachedItemStatus, selectNgssmCachedItem, SetCachedItemAction } from 'ngssm-store/caching';
import { ngssmCachedItemSetter, provideNgssmCachingTesting } from 'ngssm-store/caching/testing';

import { cachedItemToSignal } from './cached-item-signal';

@Component({
  template: `
    <span id="status">{{ status.value() }}</span>
    <span id="item">{{ item.value() }}</span>
    <span id="defaulted">{{ defaulted.value() }}</span>
    <span id="error">{{ error.value() }}</span>
    <span id="unknownStatus">{{ unknownStatus.value() }}</span>
  `
})
class TestingComponent {
  public readonly status = cachedItemToSignal<CachedItemStatus>('cache-key', { type: 'status' });
  public readonly item = cachedItemToSignal<string>('cache-key');
  public readonly defaulted = cachedItemToSignal<string>('cache-key', { defaultValue: 'fallback' });
  public readonly error = cachedItemToSignal<string>('cache-key', { type: 'error' });
  public readonly unknownStatus = cachedItemToSignal<CachedItemStatus>('missing-key', { type: 'status' });
}

describe('CachedItemSignal', () => {
  describe('cachedItemToSignal', () => {
    let fixture: ComponentFixture<TestingComponent>;
    let store: StoreMock;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestingComponent],
        providers: [provideNgssmStoreTesting(), provideNgssmCachingTesting()]
      });

      store = TestBed.inject(StoreMock);
      ngssmCachedItemSetter().apply(new SetCachedItemAction('cache-key', 'cached-value', CachedItemStatus.set));

      fixture = TestBed.createComponent(TestingComponent);
      fixture.detectChanges();
    });

    it(`should render the cached item`, () => {
      const span = fixture.debugElement.query(By.css('#item')).nativeElement.innerHTML;
      expect(span).toEqual('cached-value');
    });

    [CachedItemStatus.notSet, CachedItemStatus.loading, CachedItemStatus.set, CachedItemStatus.error].forEach((status) => {
      it(`should render the '${status}' status`, () => {
        ngssmCachedItemSetter().setCachedItemStatus('cache-key', status);
        fixture.detectChanges();

        const span = fixture.debugElement.query(By.css('#status')).nativeElement.innerHTML;
        expect(span).toEqual(status);
      });
    });

    it(`should render the error`, () => {
      ngssmCachedItemSetter().apply(new SetCachedItemAction('cache-key', undefined, CachedItemStatus.error, 'something went wrong'));
      fixture.detectChanges();

      const span = fixture.debugElement.query(By.css('#error')).nativeElement.innerHTML;
      expect(span).toEqual('something went wrong');
    });

    it(`should render the default value when item is undefined`, () => {
      ngssmCachedItemSetter().setCachedItemValue('cache-key', undefined);
      fixture.detectChanges();

      const span = fixture.debugElement.query(By.css('#defaulted')).nativeElement.innerHTML;
      expect(span).toEqual('fallback');
    });

    it(`should default the status to 'Not Set' when the key is unknown`, () => {
      expect(selectNgssmCachedItem(store.state(), 'missing-key')).toBeUndefined();

      const span = fixture.debugElement.query(By.css('#unknownStatus')).nativeElement.innerHTML;
      expect(span).toEqual(CachedItemStatus.notSet);
    });
  });
});
