# ngssm-navigation

Provides helpers to control angular navigation.

## Locking/unlocking navigation for given actions

- initialize navigation module by importing **NgssmNavigationModule** in **AppModule**
- configure actions which lock and unlock the navigation in your feature module:
    ```
    providers: [
        ...
        {
            provide: NGSSM_NAVIGATION_LOCKING_CONFIG,
            multi: true,
            useValue: {
                actionsLockingNavigation: [TodoActionType.addTodoItem, TodoActionType.editTodoItem],
                actionsUnLockingNavigation: [TodoActionType.closeTodoItemEditor]
            }
        }
    ]
    ```