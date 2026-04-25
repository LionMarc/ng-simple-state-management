# NgssmDataSource Parameter Validity and Loading Behavior

This document explains the parameter validity system in ngssm-data, including global and partial validity concepts, and how they affect data source loading behavior.

## Overview

The ngssm-data library provides sophisticated parameter validation for data sources, allowing applications to control when data should be loaded based on parameter validity. This is particularly useful for:

- Form-based data sources where users enter search criteria
- Multi-field parameters where individual fields can be validated separately
- Preventing unnecessary API calls when parameters are incomplete or invalid

## Parameter Validity Concepts

### Global Parameter Validity

Each data source value maintains a `parameterIsValid` boolean flag that represents the overall validity of the parameter:

```typescript
interface NgssmDataSourceValue<TData, TParameter> {
  // ... other properties
  parameterIsValid?: boolean;
  // ... other properties
}
```

- `undefined` (default): Parameter is considered valid
- `true`: Parameter is explicitly valid
- `false`: Parameter is invalid, blocking data loading

### Partial Parameter Validity

For complex parameters with multiple fields, ngssm-data supports partial validity through a map structure:

```typescript
interface NgssmDataSourceValue<TData, TParameter> {
  // ... other properties
  parameterPartialValidity?: Record<string, boolean>;
  // ... other properties
}
```

This allows tracking validity for individual parameter fields:
```typescript
{
  parameterPartialValidity: {
    'searchTerm': true,
    'dateFrom': false,
    'dateTo': true
  }
}
```

### Validity Resolution Logic

The `isNgssmDataSourceValueParameterValid()` function determines overall parameter validity using this priority:

1. **If partial validity exists**: Returns `true` only if ALL partial fields are `true`
2. **Otherwise**: Returns `false` only if `parameterIsValid` is explicitly `false`
3. **Default**: Returns `true` when no validity information is present

```typescript
export const isNgssmDataSourceValueParameterValid = (dataSourceValue: NgssmDataSourceValue): boolean => {
  if (dataSourceValue.parameterPartialValidity) {
    // All partial validities must be true
    return Object.values(dataSourceValue.parameterPartialValidity).every(isValid => isValid);
  }

  if (dataSourceValue.parameterIsValid === false) {
    return false;
  }

  return true; // Default valid
};
```

## Actions for Managing Parameter Validity

### Setting Global Validity

```typescript
// Mark parameter as valid
store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('my-data-source', true));

// Mark parameter as invalid
store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('my-data-source', false));

// Mark parameter as invalid and clear any partial validity data
store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('my-data-source', false, true));
```

### Setting Partial Validity

```typescript
// Mark specific field as valid
store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('my-data-source', true, 'searchTerm'));

// Mark specific field as invalid
store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('my-data-source', false, 'dateFrom'));
```

### Updating Parameters

When parameters are updated, the system automatically manages validity and loading state:

```typescript
// Update entire parameter (marks value as outdated)
store.dispatchAction(new NgssmSetDataSourceParameterAction('my-data-source', { searchTerm: 'test', dateFrom: null }));

// Update partial parameter (also marks value as outdated by default)
store.dispatchAction(new NgssmUpdateDataSourceParameterAction('my-data-source', { searchTerm: 'updated' }));

// Update partial parameter without marking value as outdated
store.dispatchAction(new NgssmUpdateDataSourceParameterAction('my-data-source', { searchTerm: 'updated' }, true));
```

## Loading Behavior

### When Data Loading Occurs

The data source will attempt to load when:

1. **Force reload requested**: `NgssmLoadDataSourceValueAction` with `forceReload: true`
2. **No cached value exists**: First load attempt
3. **Cache expired**: `dataLifetimeInSeconds` exceeded since `lastLoadingDate`
4. **Value marked as outdated**: `valueOutdated` flag is `true`

### When Data Loading is Blocked

Loading is prevented when:

1. **Global parameter invalid**: `parameterIsValid === false`
2. **Data source not registered**: Key doesn't exist in state
3. **Dependency not loaded**: `dependsOnDataSource` specified but not in loaded state

**Note**: Partial validity does not directly block loading in the core reducer. However, UI components like `NgssmDataReloadButtonComponent` use `isNgssmDataSourceParameterValid()` which considers partial validity.

## Practical Examples

### Example 1: Search Form with Validation

```typescript
// Data source registration
export const searchDataSource = provideNgssmDataSource(
  'search-results',
  (state, key, params: { query: string; filters: any[] }) => {
    return http.get('/api/search', { params });
  }
);

// In component: Update search parameters with validation
updateSearch(query: string, filters: any[]) {
  // Update the parameter
  this.store.dispatchAction(new NgssmSetDataSourceParameterAction('search-results', { query, filters }));

  // Validate individual fields
  this.store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('search-results', query.length > 2, 'query'));
  this.store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('search-results', filters.length > 0, 'filters'));

  // Only load if all validations pass
  if (query.length > 2 && filters.length > 0) {
    this.store.dispatchAction(new NgssmLoadDataSourceValueAction('search-results'));
  }
}
```

### Example 2: Initial Invalid Parameter

```typescript
// Register data source with initially invalid parameter
export const userProfileDataSource = provideNgssmDataSource(
  'user-profile',
  (state, key, userId: string) => http.get(`/api/users/${userId}`),
  {
    initialParameter: '', // Empty string initially
    initialParameterInvalid: true // Mark as invalid until user selects
  }
);

// In component: Set valid user ID
selectUser(userId: string) {
  this.store.dispatchAction(new NgssmSetDataSourceParameterAction('user-profile', userId, true)); // true = parameter is valid
  this.store.dispatchAction(new NgssmLoadDataSourceValueAction('user-profile'));
}
```

### Example 3: Complex Form with Partial Validation

```typescript
interface SearchParams {
  keyword: string;
  category: string;
  dateRange: { from: Date; to: Date };
}

// Update individual fields with validation
updateKeyword(keyword: string) {
  this.store.dispatchAction(new NgssmUpdateDataSourceParameterAction('advanced-search', { keyword }));
  this.store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('advanced-search', keyword.length >= 3, 'keyword'));
}

updateCategory(category: string) {
  this.store.dispatchAction(new NgssmUpdateDataSourceParameterAction('advanced-search', { category }));
  this.store.dispatchAction(new NgssmSetDataSourceParameterValidityAction('advanced-search', category !== '', 'category'));
}

// The data source will only load when ALL partial validities are true
// (keyword >= 3 chars AND category selected AND dateRange valid)
```

## UI Integration

### Reload Button with Validity Check

The `NgssmDataReloadButtonComponent` automatically checks parameter validity:

```html
<ngssm-data-reload-button
  [dataSourceKeys]="['my-data-source']"
  [keepAdditionalProperties]="false">
</ngssm-data-reload-button>
```

The button will be disabled when `isNgssmDataSourceParameterValid()` returns `false`.

### Status Checking in Templates

```html
@if (store.state() | isNgssmDataSourceValueStatus:'my-data-source':'loaded') {
  <!-- Data is loaded and parameter was valid -->
  <div>Results: {{ dataSourceValue.value | json }}</div>
} @else if (store.state() | isNgssmDataSourceParameterValid:'my-data-source' === false) {
  <!-- Parameter is invalid -->
  <div class="error">Please complete the required fields</div>
}
```

## Best Practices

1. **Use partial validity for complex forms**: Individual field validation provides better UX
2. **Set initial parameters as invalid**: Prevent loading with incomplete initial state
3. **Validate before dispatching load actions**: Avoid unnecessary API calls
4. **Combine with value outdated flag**: Track when parameters change but data hasn't reloaded
5. **Use selectors for UI state**: Leverage `isNgssmDataSourceParameterValid` in components

## State Structure

```typescript
interface NgssmDataSourceValue {
  status: NgssmDataSourceValueStatus;
  parameter?: TParameter;
  parameterIsValid?: boolean;           // Global validity
  parameterPartialValidity?: Record<string, boolean>; // Field-level validity
  valueOutdated?: boolean;              // Parameter changed, value may be stale
  // ... other properties
}
```
