import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { animationFrameScheduler, BehaviorSubject } from 'rxjs';

import { DataStatus } from 'ngssm-remote-data';
import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmTreeConfig, NodeData } from '../../model';
import { NgssmTreeStateSpecification, updateNgssmTreeState } from '../../state';
import { NgssmTreeComponent } from './ngssm-tree.component';

@Component({
  selector: 'ngssm-tree-demo',
  imports: [CommonModule, NgssmTreeComponent],
  template: `<ngssm-tree class="fxFlex" [treeConfig]="treeConfig$ | async"></ngssm-tree>`,
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
  public treeConfig$ = new BehaviorSubject<NgssmTreeConfig | undefined>(undefined);
}

// cf https://github.com/angular/components/blob/main/src/cdk/scrolling/virtual-scroll-viewport.spec.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

describe('NgssmTreeComponent', () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;
  let store: StoreMock;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmTreeStateSpecification.featureStateKey]: NgssmTreeStateSpecification.initialState
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

  describe('Testing nodes filtering', () => {
    const nodes = [
      { level: 0, type: 'directory', name: '.', inode: 0 },
      { level: 1, type: 'file', name: 'run-docker', inode: 85338, parent: 0 },
      { level: 1, type: 'directory', name: 'smusdi-core', inode: 48581, parent: 0 },
      { level: 2, type: 'file', name: 'Directory.Build.props', inode: 48629, parent: 48581 },
      { level: 2, type: 'file', name: 'README.md', inode: 48630, parent: 48581 }
    ];

    beforeEach(async () => {
      const state = updateNgssmTreeState(store.stateValue, {
        trees: {
          testing: {
            $set: {
              type: 'Testing',
              nodes: nodes.map((n) => ({
                status: DataStatus.loaded,
                isExpanded: true,
                level: n.level,

                node: {
                  nodeId: n.inode.toString(),
                  parentNodeId: n.parent?.toString(),
                  label: n.name,
                  type: n.type,
                  isExpandable: n.type === 'directory',

                  data: n
                }
              }))
            }
          }
        }
      });
      store.stateValue = state;
    });

    it('should render all the nodes when no filter is applied', fakeAsync(() => {
      component.treeConfig$.next({
        treeId: 'testing',
        iconClasses: {
          directory: 'fa-solid fa-folder',
          file: 'fa-regular fa-file'
        }
      });

      finishInit(fixture);

      const renderedNodes = fixture.debugElement.queryAll(By.css('.ngssm-tree-node'));
      expect(renderedNodes.length).toEqual(5);
      renderedNodes.forEach((r, i) => expect(r.nativeElement.innerHTML).toContain(nodes[i].name));
    }));

    it('should render only the folders when a filter is applied', fakeAsync(() => {
      component.treeConfig$.next({
        treeId: 'testing',
        iconClasses: {
          directory: 'fa-solid fa-folder',
          file: 'fa-regular fa-file'
        },
        filter: (node: NodeData) => node.type === 'directory'
      });

      finishInit(fixture);

      const renderedNodes = fixture.debugElement.queryAll(By.css('.ngssm-tree-node'));
      expect(renderedNodes.length).toEqual(2);
      expect(renderedNodes[0].nativeElement.innerHTML).toContain(nodes[0].name);
      expect(renderedNodes[1].nativeElement.innerHTML).toContain(nodes[2].name);
    }));
  });
});
