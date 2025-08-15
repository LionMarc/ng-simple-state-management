import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { provideNgssmStoreTesting } from 'ngssm-store/testing';
import { CachedItemStatus, selectNgssmCachedItem, SetCachedItemAction } from 'ngssm-store/caching';

import { provideNgssmCachingTesting } from './provide-ngssm-caching-testing';
import { NgssmCachedItemSetter } from './ngssm-cached-item-setter';

describe('NgssmCachedItemSetter', () => {
  const existingKey = 'my-key';
  const notExistingKey = 'my-new-key';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStoreTesting(), provideNgssmCachingTesting()]
    });

    TestBed.inject(NgssmCachedItemSetter).apply(new SetCachedItemAction(existingKey, { label: 'testing' }, CachedItemStatus.set));
  });

  it(`should update the status`, () => {
    TestBed.inject(NgssmCachedItemSetter).setCachedItemStatus(existingKey, CachedItemStatus.loading);

    const store = TestBed.inject(Store);
    expect(selectNgssmCachedItem(store.state(), existingKey)?.status).toEqual(CachedItemStatus.loading);
  });

  it(`should create the cached item with the status if key does not exist`, () => {
    TestBed.inject(NgssmCachedItemSetter).setCachedItemStatus(notExistingKey, CachedItemStatus.loading);

    const store = TestBed.inject(Store);
    expect(selectNgssmCachedItem(store.state(), notExistingKey)?.status).toEqual(CachedItemStatus.loading);
  });

  it(`should update the value`, () => {
    TestBed.inject(NgssmCachedItemSetter).setCachedItemValue(existingKey, { label: 'testing update' });

    const store = TestBed.inject(Store);
    expect(selectNgssmCachedItem(store.state(), existingKey)?.item).toEqual({ label: 'testing update' });
  });

  it(`should create cached item with the value if key does not exist`, () => {
    TestBed.inject(NgssmCachedItemSetter).setCachedItemValue(notExistingKey, { label: 'testing new' });

    const store = TestBed.inject(Store);
    expect(selectNgssmCachedItem(store.state(), notExistingKey)?.item).toEqual({ label: 'testing new' });
  });
});
