# ngssm-data

This library provides states, components and helpers to simplify management of data loaded from remote services or computed from any source.

To use it, simply add **provideNgssmData()** in *app.config.ts*.

```javascript
export const appConfig: ApplicationConfig = {
  providers: [
    ....
    provideNgssmData();
    ....
  ]
};
```

!!! Note

    This library is provided as a replacement of **ngssm-remote-data**.


!!! Warning

    This library is currently under development.

## Data Source

A data source is defined as:

```mermaid
classDiagram
    class NgssmDataLoading~TData, TParameter~{
        <<interface>>
        loadData(state:State, parameter?: TParameter = undefined): Observable<TData>
    }
    class NgssmDataSource~TData, TParameter~{
        <<interface>>
        key: string
        dataLifetimeInSeconds?: number
    }

    NgssmDataSource --> NgssmDataLoading
```

- **key**: unique identifer of the data source;
- **dataLifetimeInSeconds**: lifetime of the stored data in seconds;
- **loadData**: a function used to load the data. The *parameter* is optional.

The data source must be registered with the function *provideNgssmDataSource*.

```javascript
const dataLoader:NgssmDataLoading<string[], number> = (state:State, parameter?:number) : Observable<string[]> => {
    const query = selectMyQuery(state);
    return inject(HttpClient).post<string[]>(`${baseUrl}/${parameter}`, query);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgssmDataSource('doc:example:data', dataLoader, 6000);
  ]
};
```

The value of a data source is stored in state as **NgssmDataSourceValue**

```mermaid
classDiagram
    class NgssmDataSourceValueStatus{
        <<enum>>
        none
        notRegistered
        loading
        loaded
        error
    }

    note for NgssmDataSourceValueStatus "notRegistered is used when we try to get value for a not registered data source"

    class NgssmDataSourceValue~TData, TParameter~{
        <<interface>>
        status: NgssmDataSourceValueStatus
        value?: TData
        parameter?: TParameter
        lastLoadingDate?: Date
    }
```

It can be retrieved by

```javascript
const value:NgssmDataSourceValue = selectNgssmDataSourceValue(state, 'doc:example:data');
```

If we want to get a signal instead of the value:

```javascript
const valueSignal:Signal<NgssmDataSourceValue> = selectNgssmDataSourceValueSignal(store, 'doc:example:data');
```

## Actions

Some actions are provided by the library to manage the data source.

```mermaid
classDiagram
    direction LR
    class NgssmDataSourceActionType{
        <<enum>>
        registerDataSources
        loadDataSourceValue
        setDataSourceParameter
        clearDataSourceValue
        setDataSourceValue
    }

    note for Action "Interface defined in ngssm-store"
    class Action {
        <<interface>>
        type: string
    }

    class NgssmLoadDataSourceValue{
        key
        forceReload: boolean = false
    }

    class NgssmRegisterDataSourcesAction{
        dataSources: NgssmDataSource[]
    }

    class NgssmSetDataSourceParameter~TParameter~{
        key
        parameter?: TParameter
        forceReload: boolean = false
    }

    class NgssmClearDataSourceValue{
        key
    }

    class NgssmSetDataSourceValue~TData~{
        key
        status: NgssmDataSourceValueStatus
        value?: TData
    }

    NgssmRegisterDataSourcesAction --|> Action: NgssmDataSourceActionType.registerDataSources
    NgssmLoadDataSourceValue --|> Action: NgssmDataSourceActionType.loadDataSourceValue
    NgssmSetDataSourceParameter --|> Action: NgssmDataSourceActionType.setDataSourceParameter
    NgssmClearDataSourceValue --|> Action: NgssmDataSourceActionType.clearDataSourceValue
    NgssmSetDataSourceValue --|> Action: NgssmDataSourceActionType.setDataSourceValue
```

```javascript
store.dispatchAction(new NgssmLoadDataSourceValue('doc:example:data', true));
store.dispatchAction(new NgssmSetDataSourceParameter('doc:example:data', 567));
store.dispatchAction(new NgssmClearDataSourceValue('doc:example:data'));
store.dispatchAction(new NgssmSetDataSourceValue('doc:example:data', NgssmDataSourceValueStatus.loaded, ['val1', 'val2']));
```

!!! Note

    *NgssmSetDataSourceValue* should not be called by the application. This action is used by the library after the execution of the data source loading function.


!!! Note

    *NgssmRegisterDataSourcesAction* is used to register a list of data sources.

    At startup, the library registers itself the sources provided with the method *provideNgssmDataSource*.

    The action could be dispatch by the application when source is not known at startup or needs not to be defined at startup.

    If *NgssmRegisterDataSourcesAction* is dispatched for a data source already registered, nothing is done by the library.


## Guard

In case we need to reload the value of a data source when going to a given page, we can use the function *ngssmLoadDataSourceValue*.

```javascript
export const myRoutes:Routes = [
    {
        path: 'example',
        component: ExampleComponent,
        canActivate : [
            ngssmLoadDataSourceValue('doc:example:data', false)
        ]
    }
]
```

The function will simply inject the store and dispatch the action **NgssmLoadDataSourceValue**.

## Pipe

The pipe *isNgssmDataSourceValueStatus* is provided to allow updating the ui according to the status of a given data source value.

```html
@if ( store.state() | isNgssmDataSourceValueStatus:'doc:example:data':'loading') {
    <p>The data is being loaded</p>
} @else if ( store.state() | isNgssmDataSourceValueStatus:'doc:example:data':'loaded':'error'){
    <div>Display the data</div>
}
```