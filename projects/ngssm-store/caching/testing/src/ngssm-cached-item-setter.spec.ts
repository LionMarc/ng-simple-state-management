import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { provideNgssmStoreTesting } from 'ngssm-store/testing';
import { CachedItemStatus, selectNgssmCachedItem, SetCachedItemAction } from 'ngssm-store/caching';

import { provideNgssmCachingTesting } from './provide-ngssm-caching-testing';
import { NgssmCachedItemSetter } from './ngssm-cached-item-setter';

describe('NgssmCachedItemSetter', () => {
  const key = 'my-key';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStoreTesting(), provideNgssmCachingTesting()]
    });

    TestBed.inject(NgssmCachedItemSetter).apply(new SetCachedItemAction(key, { label: 'testing' }, CachedItemStatus.set));
  });

  it(`should update the status of a data source`, () => {
    TestBed.inject(NgssmCachedItemSetter).setCachedItemStatus(key, CachedItemStatus.loading);

    const store = TestBed.inject(Store);
    expect(selectNgssmCachedItem(store.state(), key)?.status).toEqual(CachedItemStatus.loading);
  });

  it(`should update the value of a data source`, () => {
    TestBed.inject(NgssmCachedItemSetter).setCachedItemValue(key, { label: 'testing update' });

    const store = TestBed.inject(Store);
    expect(selectNgssmCachedItem(store.state(), key)?.item).toEqual({ label: 'testing update' });
  });
});
