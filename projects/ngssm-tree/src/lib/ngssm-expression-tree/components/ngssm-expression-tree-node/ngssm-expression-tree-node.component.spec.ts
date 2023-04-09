import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmExpressionTreeNodeComponent } from './ngssm-expression-tree-node.component';

describe('NgssmExpressionTreeNodeComponent', () => {
  let component: NgssmExpressionTreeNodeComponent;
  let fixture: ComponentFixture<NgssmExpressionTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgssmExpressionTreeNodeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmExpressionTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
