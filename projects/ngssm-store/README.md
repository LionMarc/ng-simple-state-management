# State management

This is a simple custom adaptation and implementation of the **redux** pattern.

```mermaid
  graph TB;
    B["Store (State manager)"]
    C[/Actions queue/]
    A["State Observers: <br/> <ul> <li>Components</li> <li>Directives</li> <li>Guards</li></ul>"]  
    
    subgraph G[Action processors]
        D[<b>Reducers</b> <br/> Updates state synchronously taking state immutability into account]
        E[<b>Effects</b> <br/> No update of the state. <br/> Call to remote services <br/> Actions dispatch...]
    end

    C --- B
    A -- Dispatch actions --> B
    B -- Publish state --> A
    B -- Apply action on state --> D
    B -- Process action --> E
    D -- Updated state --> B
    E -- Dispatch actions --> B

    style A text-align:left
    style C fill:lightgray
```

## Store Overview

### Action dispatching

```mermaid
  sequenceDiagram
    actor O as Component/Effect
    participant S as Store
    participant Q as Actions Queue
    participant E as Event loop
    O->>S: dispatch action
    S->>Q: add action
    S->>E: add message to process next action
```

> An action dispatched by a component or an effect is not processed immediately. The store uses the `setTimeout` function to process "later" the action.

### Action processing

```mermaid
  sequenceDiagram
    participant L as Event loop
    participant S as Store
    participant Q as Actions Queue
    actor O as State Observer
    participant R as Reducer
    participant E as Effect
    L->>S: doProcessNextAction
    S->>Q: get next available action
    alt There is an action to process
      loop For all registered reducers for the current sction
        S->>R: update state
      end

      S->>O: publish new state

      loop For all registered effects for the current action
        S->>E: process action
      end

      S->>L: add message to process next action
    end
```

## Dependencies

- [angular](https://github.com/angular/angular): the library uses the dependency injection system provided by **angular**,
- [rxjs](https://rxjs.dev/): the publish/subscribe pattern is implemented with **rxjs**,
- [immutability-helper](https://github.com/kolodny/immutability-helper): used by the reducers to update safely the state

> The state must be immutable. But, to simplify the implementation, it is the responsibility of the user to be sure that the state instance is never updated.

- [schematics](https://www.npmjs.com/package/@angular-devkit/schematics): schematics are provided to create feature state, components, reducers, effects, actions...
- [mermaid.js](https://mermaid-js.github.io/mermaid/#/) for the documentation.

## Schematics

See [ngssm-schematics](/projects/ngssm-schematics/README.md) for schematics used to create feature state, action, reducer, effect...
