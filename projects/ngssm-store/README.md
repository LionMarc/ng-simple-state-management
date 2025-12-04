# ngssm-store

A lightweight, production-ready state management library for Angular applications based on the Redux pattern. Provides centralized state management with full support for reducers, effects, and modern Angular signals.

## Overview

`ngssm-store` is a simple yet powerful custom implementation of the Redux pattern designed specifically for Angular. It leverages Angular's dependency injection, RxJS for reactive updates, and modern Angular signals for optimal reactivity.

### Key Features

- **Centralized State Management**: Single source of truth for application state
- **Redux Pattern**: Actions → Reducers → State → Effects → Actions
- **Dual Reactivity**: Both RxJS observables and Angular Signals support
- **Immutable State**: Uses `immutability-helper` to ensure state immutability
- **Effect System**: Side effects, async operations, and action chaining
- **Feature States**: Modular state management with feature-based organization
- **Action Queue**: Sequential action processing for predictable state updates
- **Logging & Debugging**: Built-in logging system for monitoring state changes
- **TypeScript Support**: Fully typed for better developer experience
- **Dependency Injection**: Leverages Angular's DI system

## Architecture

### Redux Flow

```
Component/Effect
    ↓ (dispatch)
Action → Store → Action Queue
                    ↓
            Process Next Action
                    ↓
        Apply to Reducers
                    ↓
        Update State Immutably
                    ↓
        Publish New State
                    ↓
        Process Effects
                    ↓
            (Can dispatch actions)
```

## Installation

```bash
npm install ngssm-store
```

### Peer Dependencies

- `@angular/core` >= 20.0.0
- `@angular/common` >= 20.0.0
- `immutability-helper` >= 3.1.1

## Setup

### Global Provider

Initialize the store in your application bootstrapping:

```typescript
import { provideNgssmStore } from 'ngssm-store';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgssmStore(),
  ]
});
```

## Core Concepts

### Actions

Actions are plain objects that describe what happened. They must have a `type` property:

```typescript
export interface Action {
  type: string;
}

// Example action class
export class IncrementCounterAction implements Action {
  readonly type = 'INCREMENT_COUNTER';
  
  constructor(public readonly amount: number = 1) {}
}

export class LoadUsersAction implements Action {
  readonly type = 'LOAD_USERS';
}
```

### Reducers

Reducers are pure functions that take the current state and an action, then return a new state. They must be immutable:

```typescript
import { Reducer, State, Action } from 'ngssm-store';
import update from 'immutability-helper';

@Injectable()
export class CounterReducer implements Reducer {
  processedActions = ['INCREMENT_COUNTER', 'DECREMENT_COUNTER'];

  updateState(state: State, action: Action): State {
    switch (action.type) {
      case 'INCREMENT_COUNTER':
        return update(state, {
          counter: {
            value: { $apply: (v: number) => v + (action as IncrementCounterAction).amount }
          }
        });
      case 'DECREMENT_COUNTER':
        return update(state, {
          counter: { value: { $set: state.counter.value - 1 } }
        });
      default:
        return state;
    }
  }
}
```

### Effects

Effects handle side effects like API calls, logging, and dispatching new actions. They don't modify state:

```typescript
import { Effect, ActionDispatcher, State, Action } from 'ngssm-store';

@Injectable()
export class UserEffect implements Effect {
  processedActions = ['LOAD_USERS'];
  
  private readonly userService = inject(UserService);

  constructor(private injector: EnvironmentInjector) {}

  processAction(dispatcher: ActionDispatcher, state: State, action: Action): void {
    if (action.type === 'LOAD_USERS') {
      this.userService.getUsers().subscribe((users) => {
        dispatcher.dispatchAction(new SetUsersAction(users));
      });
    }
  }
}
```

### State

The state is a plain object containing all application data. Structure it hierarchically:

```typescript
export interface State {
  counter?: {
    value: number;
  };
  users?: {
    list: User[];
    loading: boolean;
    error?: Error;
  };
  settings?: {
    theme: string;
    language: string;
  };
}
```

## Usage

### Dispatching Actions

```typescript
import { Store } from 'ngssm-store';

@Component({
  selector: 'app-counter',
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
  `
})
export class CounterComponent {
  private store = inject(Store);
  
  count = createSignal((state) => state.counter?.value ?? 0);

  increment() {
    this.store.dispatchAction(new IncrementCounterAction(1));
  }

  decrement() {
    this.store.dispatchAction(new DecrementCounterAction());
  }
}
```

### Accessing State with Signals

Use the signal-based API for reactive components:

```typescript
import { createSignal } from 'ngssm-store';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <p>Total Users: {{ userCount() }}</p>
      <div *ngIf="loading()">Loading...</div>
      <ul>
        <li *ngFor="let user of users()">{{ user.name }}</li>
      </ul>
    </div>`
})
export class DashboardComponent {
  private store = inject(Store);
  
  users = createSignal((state) => state.users?.list ?? []);
  loading = createSignal((state) => state.users?.loading ?? false);
  userCount = createSignal((state) => (state.users?.list ?? []).length);
}
```

### Accessing State with RxJS

For components that need RxJS integration:

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <li *ngFor="let user of users$ | async">{{ user.name }}</li>
    </ul>`
})
export class UserListComponent {
  private store = inject(Store);
  
  users$ = this.store.state$.pipe(
    map((state) => state.users?.list ?? [])
  );
}
```

### Direct State Access

Access the current state directly:

```typescript
@Component(...)
export class MyComponent {
  private store = inject(Store);

  getCurrentState() {
    const currentState = this.store.state(); // Signal access
    // or
    const viaObservable = this.store.state$; // Observable access
  }
}
```

### Tracking Processed Actions

Monitor which action was last processed:

```typescript
@Component(...)
export class MyComponent {
  private store = inject(Store);
  
  lastAction = createSignal((state) => this.store.processedAction().type);
  
  // Or with RxJS
  lastAction$ = this.store.processedAction$.pipe(map(a => a.type));
}
```

## Registering Reducers and Effects

### Single Reducer/Effect

```typescript
import { provideReducer, provideEffect } from 'ngssm-store';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgssmStore(),
    provideReducer(CounterReducer),
    provideEffect(UserEffect)
  ]
});
```

### Multiple Reducers/Effects

```typescript
import { provideReducers, provideEffects } from 'ngssm-store';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgssmStore(),
    provideReducers(
      CounterReducer,
      UserReducer,
      SettingsReducer
    ),
    provideEffects(
      UserEffect,
      NotificationEffect
    )
  ]
});
```

### Effect Functions

Effect functions are the modern replacement for the `Effect` interface. They are executed in an injection context, allowing you to use Angular's `inject` function for dependency injection:

```typescript
import { provideEffectFunc } from 'ngssm-store';
import { inject } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgssmStore(),
    provideEffectFunc('LOAD_USERS', (state, action) => {
      const userService = inject(UserService);
      const dispatcher = inject(ACTION_DISPATCHER);
      
      userService.getUsers().subscribe((users) => {
        dispatcher.dispatchAction(new SetUsersAction(users));
      });
    })
  ]
});
```

Effect functions should be preferred over the legacy `Effect` interface implementation as they are more concise and leverage Angular's dependency injection system.

## Feature States

Organize state by feature for better modularity:

```typescript
import { NgSsmFeatureState } from 'ngssm-store';

@NgSsmFeatureState({
  featureStateKey: 'products',
  initialState: {
    list: [],
    loading: false,
    selectedId: null
  }
})
export class ProductFeatureState {}

// Access in components
products = createSignal((state) => state.products?.list ?? []);
```

## State Initializers

Initialize state with data from external sources:

```typescript
import { StateInitializer } from 'ngssm-store';

@Injectable()
export class AppInitializer implements StateInitializer {
  private configService = inject(ConfigService);

  initializeState(state: State): State {
    const config = this.configService.getConfig();
    return update(state, {
      settings: { $set: config }
    });
  }
}

// Provide it
bootstrapApplication(AppComponent, {
  providers: [
    provideNgssmStore(),
    { provide: NGSSM_STATE_INITIALIZER, useClass: AppInitializer }
  ]
});
```

## Action Processing

### Sequential Processing

Actions are processed sequentially using an action queue:

1. Action dispatched
2. Added to queue
3. Store schedules processing (via setTimeout by default)
4. Reducers update state
5. State published to all subscribers
6. Effects process action (can dispatch new actions)
7. Next action processed

### Macro Tasks vs Micro Tasks

By default, the store uses `setTimeout` (macro-tasks) for action processing. You can switch to micro-tasks (Promises) if needed:

```typescript
@Injectable()
export class Store {
  // Set to false for micro-tasks (Promise.resolve())
  public useMacroTasks = true;
}
```

## Best Practices

1. **Keep Actions Simple**: Actions should be serializable plain objects
2. **Pure Reducers**: Never mutate state directly; always use `immutability-helper`
3. **Avoid Side Effects in Reducers**: Use Effects for side effects
4. **Type Your State**: Define clear State interfaces
5. **Use Signals for Performance**: Prefer `createSignal` over RxJS when possible in new code
6. **Single Responsibility**: One reducer per feature/domain
7. **Logging**: Use the Logger service for debugging
8. **Action Names**: Use clear, descriptive action type names (FEATURE_ACTION_NAME pattern)
9. **Immutability**: Never modify state objects in reducers
10. **Error Handling**: Handle errors in effects and dispatch error actions

## API Reference

### Store Class

- `state(): Signal<State>` - Get current state as a Signal
- `state$: Observable<State>` - Get state as an Observable
- `processedAction(): Signal<Action>` - Get last processed action as a Signal
- `processedAction$: Observable<Action>` - Get last processed action as Observable
- `dispatchAction(action: Action): void` - Dispatch an action
- `dispatchActionType(actionType: string): void` - Dispatch by action type string

### Helper Functions

- `createSignal<T>(selector: (state: State) => T): Signal<T>` - Create a derived signal from state
- `provideNgssmStore()` - Initialize the store
- `provideReducer(reducer)` - Register a single reducer
- `provideReducers(...reducers)` - Register multiple reducers
- `provideEffect(effect)` - Register a single effect
- `provideEffects(...effects)` - Register multiple effects
- `provideEffectFunc(actionType, func)` - Register an effect function

### Interfaces

- `Action` - Action interface with `type` property
- `Reducer` - Reducer interface with `processedActions` and `updateState()`
- `Effect` - Effect interface with `processedActions` and `processAction()`
- `State` - Base state type (empty object by default)
- `StateInitializer` - Interface for initializing state
- `ActionDispatcher` - Interface for dispatching actions

## Debugging

### Logging

Enable logging to monitor state changes and action processing:

```typescript
import { Logger } from 'ngssm-store';

constructor(private logger: Logger) {
  this.logger.information('Component initialized');
}
```

### DevTools Integration

The store can be integrated with Redux DevTools for advanced debugging (requires additional setup).

## Performance Considerations

- **Signals**: Prefer signals over observables for better performance in modern Angular
- **Selectors**: Use `createSignal` with specific selectors to minimize re-renders
- **Memoization**: Consider memoizing expensive selector functions
- **Action Batching**: Dispatch related actions together to reduce re-renders

## Dependencies

- **Angular Core**: Dependency injection, signals, lifecycle management
- **RxJS**: Reactive state and action streams
- **immutability-helper**: Safe state immutability patterns
- **TypeScript**: Full type safety

## License

MIT
