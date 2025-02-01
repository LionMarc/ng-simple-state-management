import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmExpressionTreeNodeComponent } from './ngssm-expression-tree-node.component';
import { NgssmExpressionTreeStateSpecification, updateNgssmExpressionTreeState } from '../../state';
import { NgssmExpressionTreeConfig } from '../../model';

interface TreeTestingData {
  name: string;
}

describe('NgssmExpressionTreeNodeComponent', () => {
  let component: NgssmExpressionTreeNodeComponent;
  let fixture: ComponentFixture<NgssmExpressionTreeNodeComponent>;
  let store: StoreMock;
  let loader: HarnessLoader;
  let treeConfig: NgssmExpressionTreeConfig<TreeTestingData>;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmExpressionTreeStateSpecification.featureStateKey]: NgssmExpressionTreeStateSpecification.initialState
    });
    treeConfig = {
      treeId: 'testing-tree'
    };

    const state = updateNgssmExpressionTreeState(store.stateValue, {
      trees: {
        [treeConfig.treeId]: {
          $set: {
            nodes: [
              {
                path: [],
                data: {
                  id: '1',
                  parentId: undefined,
                  isExpandable: true,
                  hasRowDetail: false,
                  data: {
                    name: 'testing '
                  }
                },
                isExpanded: true
              }
            ],
            data: {
              [1]: {
                name: 'testing '
              }
            },
            nodeCut: undefined
          }
        }
      }
    });
    store.stateValue = state;

    await TestBed.configureTestingModule({
      imports: [NgssmExpressionTreeNodeComponent, NoopAnimationsModule],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmExpressionTreeNodeComponent);
    fixture.nativeElement.style['min-height'] = '300px';
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`Node icon`, () => {
    it(`should render no icon when property getNodeCssIcon is not set in tree config`, async () => {
      treeConfig.getNodeCssIcon = undefined;
      component.treeConfig = treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const element = fixture.debugElement.query(By.css('#treeNodeIcon'));

      expect(element).toBeFalsy();
    });

    it(`should render no icon when getNodeCssIcon returns null for current node`, async () => {
      treeConfig.getNodeCssIcon = (node) => {
        if (node.data.id === '1') {
          return undefined;
        }

        return 'fa-solid fa-folder-open';
      };
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const element = fixture.debugElement.query(By.css('#treeNodeIcon'));

      expect(element).toBeFalsy();
    });

    it(`should render the icon returned by getNodeCssIcon for current node`, async () => {
      treeConfig.getNodeCssIcon = (node) => {
        if (node.data.id !== '1') {
          return undefined;
        }

        return 'fa-solid fa-folder-open';
      };
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const element = fixture.debugElement.query(By.css('#treeNodeIcon'));

      expect(element).toBeTruthy();

      expect(fixture.debugElement.query(By.css('#treeNodeIcon .fa-folder-open'))).toBeTruthy();
    });
  });

  describe(`Cut and paste`, () => {
    it(`should not render the cut and maste menu items when feature is not enabled`, async () => {
      treeConfig.displayCutAndPasteMenus = false;
      treeConfig.getNodeLabel = (node, data) => data.name;
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const matMenu = await loader.getHarness(MatMenuHarness);
      await matMenu.open();
      const matMenuItems = await matMenu.getItems();

      expect(matMenuItems.length).toEqual(2);
    });

    it(`should render the cut and maste menu items when feature is enabled`, async () => {
      treeConfig.displayCutAndPasteMenus = true;
      treeConfig.getNodeLabel = (node, data) => data.name;
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const matMenu = await loader.getHarness(MatMenuHarness);
      await matMenu.open();
      const matMenuItems = await matMenu.getItems();

      expect(matMenuItems.length).toEqual(5);
    });

    it(`should render a Cut menu item when no cut operation is in progress`, async () => {
      treeConfig.displayCutAndPasteMenus = true;
      treeConfig.getNodeLabel = (node, data) => data.name;
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const matMenu = await loader.getHarness(MatMenuHarness);
      await matMenu.open();
      const matMenuItems = await matMenu.getItems();
      const menuLabel = await matMenuItems[0].getText();

      expect(menuLabel).toEqual('Cut');
    });

    it(`should render a 'Cancel cut' menu item when a cut operation is in progress`, async () => {
      treeConfig.displayCutAndPasteMenus = true;
      treeConfig.getNodeLabel = (node, data) => data.name;
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      const state = updateNgssmExpressionTreeState(store.stateValue, {
        trees: {
          [treeConfig.treeId]: {
            nodeCut: {
              $set: {
                path: [],
                data: {
                  id: '2',
                  parentId: undefined,
                  isExpandable: true,
                  hasRowDetail: false,
                  data: {
                    name: 'another '
                  }
                },
                isExpanded: true
              }
            }
          }
        }
      });
      store.stateValue = state;

      fixture.detectChanges();
      await fixture.whenStable();

      const matMenu = await loader.getHarness(MatMenuHarness);
      await matMenu.open();
      const matMenuItems = await matMenu.getItems();
      const menuLabel = await matMenuItems[0].getText();

      expect(menuLabel).toEqual('Cancel cut');
    });

    it(`Cut menu should be enabled when canCut property is not set in tree config`, async () => {
      treeConfig.displayCutAndPasteMenus = true;
      treeConfig.getNodeLabel = (node, data) => data.name;
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const matMenu = await loader.getHarness(MatMenuHarness);
      await matMenu.open();
      const matMenuItems = await matMenu.getItems();
      const isDisabled = await matMenuItems[0].isDisabled();

      expect(isDisabled).toBeFalse();
    });

    it(`Cut menu should be enabled when canCut property is set in tree config and returns true for current node`, async () => {
      treeConfig.displayCutAndPasteMenus = true;
      treeConfig.getNodeLabel = (node, data) => data.name;
      treeConfig.canCut = (node) => node.data.id === '1';
      component.treeConfig =  treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const matMenu = await loader.getHarness(MatMenuHarness);
      await matMenu.open();
      const matMenuItems = await matMenu.getItems();
      const isDisabled = await matMenuItems[0].isDisabled();

      expect(isDisabled).toBeFalse();
    });

    it(`Cut menu should be not be enabled when canCut property is set in tree config and returns false for current node`, async () => {
      treeConfig.displayCutAndPasteMenus = true;
      treeConfig.getNodeLabel = (node, data) => data.name;
      treeConfig.canCut = (node) => node.data.id !== '1';
      component.treeConfig = treeConfig as NgssmExpressionTreeConfig<unknown>;
      component.nodeId = '1';

      fixture.detectChanges();
      await fixture.whenStable();

      const matMenu = await loader.getHarness(MatMenuHarness);
      await matMenu.open();
      const matMenuItems = await matMenu.getItems();
      const isDisabled = await matMenuItems[0].isDisabled();

      expect(isDisabled).toBeTrue();
    });
  });
});
