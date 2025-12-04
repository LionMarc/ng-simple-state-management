Some things to remember during migration from Jasmine/Karam to Vitest

## fakeasync

```typescript
  beforeEach(() => {
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  ...
  await vitest.runAllTimersAsync();
  await vitest.advanceTimersByTimeAsync(100);
  ...
```