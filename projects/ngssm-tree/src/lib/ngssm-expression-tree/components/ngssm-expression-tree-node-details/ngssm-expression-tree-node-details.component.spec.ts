import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmExpressionTreeNodeDetailsComponent } from './ngssm-expression-tree-node-details.component';

describe('NgssmExpressionTreeNodeDetailsComponent', () => {
  let component: NgssmExpressionTreeNodeDetailsComponent;
  let fixture: ComponentFixture<NgssmExpressionTreeNodeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgssmExpressionTreeNodeDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmExpressionTreeNodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
