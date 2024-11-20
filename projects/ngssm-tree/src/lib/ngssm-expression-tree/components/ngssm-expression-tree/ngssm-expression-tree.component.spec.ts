import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { animationFrameScheduler, BehaviorSubject } from 'rxjs';

import { DateTime } from 'luxon';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { createNgssmExpressionTreeFromNodes, NgssmExpressionTreeConfig, NgssmNode } from '../../model';
import { NgssmExpressionTreeStateSpecification, updateNgssmExpressionTreeState } from '../../state';
import { NgssmExpressionTreeComponent } from './ngssm-expression-tree.component';
import { TreeNodeExpandReducer } from '../../reducers';
import { NgssmCollapseExpressionTreeNodeAction, NgssmExpandExpressionTreeNodeAction, NgssmExpressionTreeActionType } from '../../actions';

@Component({
    selector: 'ngssm-tree-demo',
    imports: [CommonModule, NgssmExpressionTreeComponent],
    template: `<ngssm-expression-tree class="fxFlex" [treeConfig]="treeConfig$ | async"></ngssm-expression-tree>`,
    styles: [
        `
      :host {
        min-height: 600px;
        display: flex;
        flex-direction: column;
      }
    `
    ]
})
export class DemoComponent {
  public treeConfig$ = new BehaviorSubject<NgssmExpressionTreeConfig | undefined>(undefined);
}

// cf https://github.com/angular/components/blob/main/src/cdk/scrolling/virtual-scroll-viewport.spec.ts
function finishInit(fixture: ComponentFixture<any>) {
  // On the first cycle we render and measure the viewport.
  fixture.detectChanges();
  flush();

  // On the second cycle we render the items.
  fixture.detectChanges();
  flush();

  // Flush the initial fake scroll event.
  animationFrameScheduler.flush();
  flush();
  fixture.detectChanges();
}

enum FilterType {
  and = 'And',
  or = 'Or',
  fieldCondition = 'FieldCondition'
}

interface Filter {
  type: FilterType;
  field?: string;
  operator?: string;
  value?: any;
  children?: Filter[];
}

const getFilterLabel = (filter: Filter): string => {
  switch (filter.type) {
    case FilterType.and:
    case FilterType.or:
      return filter.type;

    default:
      return '';
  }
};

const getFilterDescription = (filter: Filter): string => {
  switch (filter.type) {
    case FilterType.fieldCondition:
      return `<div class="flex-row-center">
      ${filter.field} 
      <span class="filter-field-condition-operator">${filter.operator}</span> 
      ${filter.value}
      </div>`;

    default:
      return 'No description';
  }
};

const initialExpression: Filter[] = [
  {
    type: FilterType.and,
    children: [
      {
        type: FilterType.fieldCondition,
        field: 'price',
        operator: 'lt',
        value: 45.67
      },
      {
        type: FilterType.fieldCondition,
        field: 'price',
        operator: 'gt',
        value: 22.4
      },
      {
        type: FilterType.or,
        children: [
          {
            type: FilterType.fieldCondition,
            field: 'status',
            operator: 'eq',
            value: 'valid'
          },
          {
            type: FilterType.and,
            children: [
              {
                type: FilterType.fieldCondition,
                field: 'comment',
                operator: 'contains',
                value: 'forced'
              },
              {
                type: FilterType.fieldCondition,
                field: 'creationDate',
                operator: 'lt',
                value: DateTime.fromSQL('2023-03-01')
              }
            ]
          },
          {
            type: FilterType.fieldCondition,
            field: 'state',
            operator: 'eq',
            value: 'open'
          }
        ]
      }
    ]
  }
];

const demoTreeId = 'demo-expression-tree';

const setNodesFromFilter = (filter: Filter, path: string[], nextId: number, nodes: NgssmNode<Filter>[]): number => {
  let currentId = nextId;
  nodes.push({
    id: nextId.toString(),
    parentId: path[path.length - 1],
    isExpandable: filter.type === FilterType.and || filter.type === FilterType.or,
    data: {
      ...filter,
      children: undefined
    }
  });

  const currentPath: string[] = [...path, nextId.toString()];

  (filter.children ?? []).forEach((child) => {
    currentId = setNodesFromFilter(child, currentPath, currentId + 1, nodes);
  });

  return currentId;
};

const initExpressionTreeDemoData = (): NgssmNode<Filter>[] => {
  const nodes: NgssmNode<Filter>[] = [];

  let nextId = 1;
  initialExpression.forEach((exp) => {
    nextId = setNodesFromFilter(exp, [], nextId, nodes);
  });

  return nodes;
};

describe('NgssmExpressionTreeComponent', () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;
  let store: StoreMock;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmExpressionTreeStateSpecification.featureStateKey]: NgssmExpressionTreeStateSpecification.initialState
    });
    await TestBed.configureTestingModule({
      imports: [DemoComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing displayed nodes', () => {
    const nodes = initExpressionTreeDemoData();
    beforeEach(async () => {
      const state = updateNgssmExpressionTreeState(store.stateValue, {
        trees: {
          [demoTreeId]: {
            $set: createNgssmExpressionTreeFromNodes(nodes)
          }
        }
      });
      store.stateValue = state;
    });

    it('should render all the nodes', fakeAsync(() => {
      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      const renderedNodes = fixture.debugElement.queryAll(By.css('.ngssm-expression-tree-node'));
      expect(renderedNodes.length).toEqual(nodes.length);
    }));

    it('should render all the nodes when virtualization is disabled', async () => {
      component.treeConfig$.next({
        treeId: demoTreeId,
        disableVirtualization: true,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      fixture.detectChanges();
      await fixture.whenStable();

      const renderedNodes = fixture.debugElement.queryAll(By.css('.ngssm-expression-tree-node'));
      expect(renderedNodes.length).toEqual(nodes.length);
    });

    it('should render the label of the nodes', fakeAsync(() => {
      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      const renderedNodes = fixture.debugElement.queryAll(By.css('.ngssm-expression-tree-node-label'));
      expect(renderedNodes.length).toEqual(nodes.length);
      renderedNodes.forEach((r, i) => expect(r.nativeElement.innerHTML).toContain(getFilterLabel(nodes[i].data)));
    }));

    it('should render the description of the nodes', fakeAsync(() => {
      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      const renderedNodes = fixture.debugElement.queryAll(By.css('.ngssm-expression-tree-node-description'));
      expect(renderedNodes.length).toEqual(nodes.length);
      renderedNodes.forEach((r, i) => expect(r.nativeElement.innerHTML).toContain(getFilterDescription(nodes[i].data)));
    }));
  });

  describe('Testing expand/collapse', () => {
    const nodes = initExpressionTreeDemoData();
    beforeEach(async () => {
      const state = updateNgssmExpressionTreeState(store.stateValue, {
        trees: {
          [demoTreeId]: {
            $set: createNgssmExpressionTreeFromNodes(nodes)
          }
        }
      });
      store.stateValue = state;
    });

    it(`should render an expand icon when node is expandable and is collapsed`, fakeAsync(() => {
      const reducer = new TreeNodeExpandReducer();
      const state = reducer.updateState(store.stateValue, new NgssmCollapseExpressionTreeNodeAction(demoTreeId, '4'));
      store.stateValue = state;

      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      const icon = fixture.debugElement.query(By.css('#node_4 #expandIcon'));

      expect(icon).toBeTruthy();
    }));

    it(`should not render children of a collapsed node`, fakeAsync(() => {
      const reducer = new TreeNodeExpandReducer();
      const state = reducer.updateState(store.stateValue, new NgssmCollapseExpressionTreeNodeAction(demoTreeId, '4'));
      store.stateValue = state;

      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      const renderedNodes = fixture.debugElement.queryAll(By.css('.ngssm-expression-tree-node'));
      expect(renderedNodes.length).toEqual(4);
    }));

    it(`should dispatch a '${NgssmExpressionTreeActionType.ngssmExpandExpressionTreeNode}' when clicking on a collapsed node`, fakeAsync(() => {
      const reducer = new TreeNodeExpandReducer();
      const state = reducer.updateState(store.stateValue, new NgssmCollapseExpressionTreeNodeAction(demoTreeId, '4'));
      store.stateValue = state;

      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      spyOn(store, 'dispatchAction');
      const icon = fixture.debugElement.query(By.css('#node_4 #expandIcon')).nativeElement;
      icon.click();

      expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmExpandExpressionTreeNodeAction(demoTreeId, '4'));
    }));

    it(`should render a collapsed icon when node is expandable and is expanded`, fakeAsync(() => {
      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      const icon = fixture.debugElement.query(By.css('#node_4 #collapseIcon'));

      expect(icon).toBeTruthy();
    }));

    it(`should dispatch a '${NgssmExpressionTreeActionType.ngssmCollapseExpressionTreeNode}' when clicking on an expanded node`, fakeAsync(() => {
      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      spyOn(store, 'dispatchAction');
      const icon = fixture.debugElement.query(By.css('#node_4 #collapseIcon')).nativeElement;
      icon.click();

      expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmCollapseExpressionTreeNodeAction(demoTreeId, '4'));
    }));

    it(`should render no icon when node is not expandable`, fakeAsync(() => {
      component.treeConfig$.next({
        treeId: demoTreeId,
        getNodeLabel: (node) => getFilterLabel(node.data.data),
        getNodeDescription: (node) => getFilterDescription(node.data.data)
      });

      finishInit(fixture);

      let icon = fixture.debugElement.query(By.css('#node_5 #collapseIcon'));
      expect(icon).toBeFalsy();
      icon = fixture.debugElement.query(By.css('#node_5 #expandIcon'));
      expect(icon).toBeFalsy();
    }));
  });
});
