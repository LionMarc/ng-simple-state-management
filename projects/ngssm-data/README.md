# ngssm-data

A comprehensive Angular library for managing remote and computed data with built-in caching, state management, and dependency handling. Part of the **ng-simple-state-management** framework.

## Overview

`ngssm-data` provides a robust abstraction layer for handling asynchronous data operations in Angular applications. It integrates seamlessly with the **ngssm-store** for centralized state management and offers powerful features like:

- **Data Source Registration**: Define and register data sources with automatic state management
- **Caching with TTL**: Automatic cache invalidation based on configurable lifetime
- **Dependency Management**: Automatically load dependent data sources in the correct order
- **Data Linking**: Establish relationships between data sources with automatic reloading
- **Additional Properties**: Load supplementary data independently (e.g., row details in tables)
- **Parameter Management**: Handle dynamic parameters for data loading with validation
- **Signal Integration**: Convert data sources to Angular Signals for reactive UI updates
- **Auto-Reload Functionality**: Built-in components and directives for automatic data refresh
- **Post-Loading Actions**: Execute custom logic after data loads
- **Scoped Data Sources**: Register data sources with component lifecycle management

## Installation

```bash
npm install ngssm-data
```

### Peer Dependencies

- `@angular/core` >= 20.0.0
- `@angular/common` >= 20.0.0
- `ngssm-store` >= 18.0.0
- `luxon` >= 3.4.4

## Core Concepts

### Data Source

A `NgssmDataSource<TData, TParameter, TAdditionalProperty>` defines how to fetch and manage a piece of data:

```typescript
interface NgssmDataSource<TData = unknown, TParameter = unknown, TAdditionalProperty = unknown> {
  key: string;                                    // Unique identifier
  dataLifetimeInSeconds?: number;                // Cache TTL
  dataLoadingFunc: NgssmDataLoading<TData, TParameter>;  // Main data loader
  additionalPropertyLoadingFunc?: NgssmAdditionalPropertyLoading<TAdditionalProperty>;
  initialParameter?: TParameter;                 // Parameter passed on first load
  initialParameterInvalid?: boolean;             // Flag to mark initial parameter as invalid
  linkedToDataSource?: string;                   // Reload when this source updates
  linkedDataSources?: string[];                  // Sources to reload when this updates
  dependsOnDataSource?: string;                  // Load this first before loading current source
}
```

### Data Loading Function

A function that retrieves data from a remote service or computes it locally:

```typescript
type NgssmDataLoading<TData = unknown, TParameter = unknown> = (
  state: State,
  dataSourceKey: string,
  parameter?: TParameter
) => Observable<TData>;
```

### Data Source Value

The state representation of loaded data:

```typescript
interface NgssmDataSourceValue<TData = unknown, TParameter = unknown> {
  value?: TData;                          // The actual data
  status: NgssmDataSourceValueStatus;     // 'NOT_LOADED' | 'LOADING' | 'LOADED' | 'LOAD_ERROR'
  parameter?: TParameter;                 // Current parameter
  parameterInvalid?: boolean;             // Whether parameter is valid
  lastLoad?: DateTime;                    // When data was last loaded
  loadError?: Error;                      // Load error if status is LOAD_ERROR
  additionalProperties?: Record<string, unknown>;  // Additional loaded properties
}
```

## Setup

### Global Provider

Initialize `ngssm-data` with automatic effect management and data source registration:

```typescript
import { provideNgssmData } from 'ngssm-data';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgssmStore(),
    provideNgssmData(),
  ]
});
```

### Register Data Sources

Register data sources using the `provideNgssmDataSource` helper function:

```typescript
import { provideNgssmDataSource } from 'ngssm-data';

const usersLoader: NgssmDataLoading<User[]> = (state, key, parameter) =>
  inject(UserService).getUsers(parameter);

const userDetailsLoader: NgssmDataLoading<UserDetail> = (state, key, userId) =>
  inject(UserService).getUserDetails(userId);

bootstrapApplication(AppComponent, {
  providers: [
    provideNgssmStore(),
    provideNgssmData(),
    provideNgssmDataSource('users', usersLoader, { dataLifetimeInSeconds: 300 }),
    provideNgssmDataSource('user-details', userDetailsLoader, { initialParameter: 'default-user-id' })
  ]
});
```

The `provideNgssmDataSource` function accepts:
- `key`: Unique identifier for the data source
- `loadingFunc`: Function that retrieves the data
- `options`: Optional configuration including:
  - `dataLifetimeInSeconds`: Cache TTL
  - `initialParameter`: Parameter used on first load
  - `initialParameterInvalid`: Mark initial parameter as invalid
  - `linkedToDataSource`: Reload when another source updates
  - `linkedDataSources`: Sources to reload when this updates
  - `dependsOnDataSource`: Load this source first before loading current
  - `additionalPropertyLoadingFunc`: Function to load additional properties

## Usage

### Loading Data

Dispatch actions to load data sources:

```typescript
import { Store } from 'ngssm-store';
import { NgssmLoadDataSourceValueAction } from 'ngssm-data';

export class MyComponent implements OnInit {
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatchAction(
      new NgssmLoadDataSourceValueAction('users')
    );
  }
}
```

### Accessing Data via Signals

Convert data source state to reactive signals:

```typescript
import { dataSourceToSignal } from 'ngssm-data';

export class MyComponent {
  private usersSignal = dataSourceToSignal<User[]>('users');
  protected users = this.usersSignal.value;
  
  // Access specific properties
  protected usersStatus = dataSourceToSignal('users', { type: 'status' }).value;
  protected usersParameter = dataSourceToSignal('users', { type: 'parameter' }).value;
}
```

### Scoped Data Sources

Register data sources with component lifecycle:

```typescript
import { NgssmScopedDataSourceDirective } from 'ngssm-data';

@Component({
  selector: 'app-user-list',
  template: `<div [ngssmScopedDataSource]="dataSource">...</div>`,
  imports: [NgssmScopedDataSourceDirective]
})
export class UserListComponent {
  protected dataSource: NgssmDataSource = {
    key: 'users',
    dataLoadingFunc: () => inject(UserService).getUsers()
  };
}
```

### Auto-Reload

Use the auto-reload component for automatic periodic refresh:

```typescript
import { NgssmAutoReloadComponent } from 'ngssm-data';

@Component({
  template: `
    <ngssm-auto-reload 
      [key]="'users'"
      [intervalSeconds]="60">
    </ngssm-auto-reload>
  `,
  imports: [NgssmAutoReloadComponent]
})
export class MyComponent {}
```

### Setting Parameters

Update data source parameters for dynamic loading:

```typescript
import { NgssmSetDataSourceParameterAction } from 'ngssm-data';

this.store.dispatchAction(
  new NgssmSetDataSourceParameterAction('users', { page: 2, limit: 20 })
);
```

### Loading Additional Properties

Load supplementary data independently:

```typescript
import { NgssmLoadDataSourceAdditionalPropertyValueAction } from 'ngssm-data';

this.store.dispatchAction(
  new NgssmLoadDataSourceAdditionalPropertyValueAction('users', 'user-roles')
);
```

### Checking Load Status

Use the status pipe to check loading state:

```typescript
import { isNgssmDataSourceValueStatusPipe } from 'ngssm-data';

@Component({
  template: `
    <div *ngIf="(usersSignal.value | isNgssmDataSourceValueStatus: 'LOADED')">
      Users loaded
    </div>
  `
})
export class MyComponent {}
```

## Advanced Features

### Data Dependencies

Automatically load dependent data sources:

```typescript
const dataSources: NgssmDataSource[] = [
  {
    key: 'users',
    dataLoadingFunc: () => inject(UserService).getUsers()
  },
  {
    key: 'user-roles',
    dependsOnDataSource: 'users', // Load 'users' first
    dataLoadingFunc: () => inject(RoleService).getRoles()
  }
];
```

### Data Linking

Automatically reload related data sources:

```typescript
const dataSources: NgssmDataSource[] = [
  {
    key: 'users',
    dataLoadingFunc: () => inject(UserService).getUsers(),
    linkedDataSources: ['user-stats'] // Reload stats when users change
  },
  {
    key: 'user-stats',
    dataLoadingFunc: () => inject(StatsService).getUserStats()
  }
];
```

### Post-Loading Actions

Execute custom logic after data loads:

```typescript
import { POST_LOADING_ACTIONS } from 'ngssm-data';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: POST_LOADING_ACTIONS,
      useValue: {
        'users': [
          (state: State, dataSourceKey: string) => {
            // Custom logic after 'users' loads
            console.log('Users data loaded');
          }
        ]
      },
      multi: true
    }
  ]
});
```

## Actions

Common actions for data management:

- `NgssmLoadDataSourceValueAction(key, parameter?)` - Load data
- `NgssmSetDataSourceParameterAction(key, parameter)` - Update parameter
- `NgssmSetDataSourceParameterValidityAction(key, valid)` - Mark parameter validity
- `NgssmLoadDataSourceAdditionalPropertyValueAction(key, property)` - Load additional property
- `NgssmClearDataSourceValueAction(key)` - Clear cached data
- `NgssmRegisterDataSourceAction(dataSource)` - Register single source
- `NgssmRegisterDataSourcesAction(dataSources)` - Register multiple sources
- `NgssmUnregisterDataSourceAction(key)` - Unregister source

## API Reference

### Selectors

```typescript
// Select entire data state
selectNgssmDataState(state: State): NgssmDataState

// Select specific data source value
selectNgssmDataSourceValue<T>(state: State, key: string): NgssmDataSourceValue<T> | undefined

// Select value only
selectNgssmDataSourceValue(state).value

// Select status only
selectNgssmDataSourceValue(state).status

// Select parameter
selectNgssmDataSourceValue(state).parameter
```

### Components & Directives

- `NgssmAutoReloadComponent` - Automatic periodic data reload
- `NgssmDataReloadButtonComponent` - Manual reload button with loading state
- `NgssmScopedDataSourceDirective` - Register data sources with component lifecycle

### Utilities

- `dataSourceToSignal(key, options?)` - Convert to Signal for reactive updates
- `postLoadingActionExecutor` - Execute post-load hooks
- `dataSourcesLinker` - Manage data source relationships

## Best Practices

1. **Use TTL for Caching**: Set `dataLifetimeInSeconds` for frequently accessed data to reduce API calls
2. **Type Your Data**: Always provide generic types for `NgssmDataSource<TData, TParameter>`
3. **Leverage Signals**: Use `dataSourceToSignal` for reactive components instead of subscriptions
4. **Dependency Resolution**: Use `dependsOnDataSource` to ensure proper load order
5. **Scoped Registration**: Use `NgssmScopedDataSourceDirective` for component-specific data sources
6. **Error Handling**: Monitor the `LOAD_ERROR` status and implement retry logic
7. **Parameter Validation**: Use `NgssmSetDataSourceParameterValidityAction` before loading with new parameters

## Dependencies

- Built on **ngssm-store** for state management
- Uses **Luxon** for datetime handling
- Integrates with Angular's dependency injection and Signal system

## License

MIT