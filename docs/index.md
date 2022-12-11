# Overview

This project provides a simple implementation of the state management pattern for [angular](https://angular.io/) applications.


!!! note "Definition from [AOE](https://www.aoe.com/techradar/methods-and-patterns/state-management-pattern.html)"

    State Management is a design pattern with the goal of properly sharing state data across components and separating domain representation from state management. This pattern is applied by many popular web frameworks such as Vuex, Redux or Flux.

    Especially in reactive systems, this pattern helps to solve the task of maintaining decoupled, stateless components with immutable data. The ways of implementing state management differs and depends on the specific requirements of the application at hand.

There are already plenty solutions to do that ([NgRx](https://ngrx.io/), [NGXS](https://www.ngxs.io/), [akita](https://opensource.salesforce.com/akita/)...). So why another implementation?

Maybe the answer is to provide a really simple implementation based on existing libraries and made for Angular application only, an implementation that does what we expect and not more.

The implementation is inspired from [Redux](https://redux.js.org/).

![Overview](./assets/diagrams/overview.drawio.png#only-light)
![Overview](./assets/diagrams/overview-dark.drawio.png#only-dark)

- The registration of all the active objects is made by using the dependency injection of [angular](https://angular.io/guide/dependency-injection);
- The update of the state uses [immutability-helper](https://github.com/kolodny/immutability-helper);
- The state notifications are based on [RxJS](https://rxjs.dev/).
