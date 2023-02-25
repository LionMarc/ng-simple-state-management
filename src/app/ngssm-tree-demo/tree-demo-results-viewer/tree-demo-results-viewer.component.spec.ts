import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDemoResultsViewerComponent } from './tree-demo-results-viewer.component';

describe('TreeDemoResultsViewerComponent', () => {
  let component: TreeDemoResultsViewerComponent;
  let fixture: ComponentFixture<TreeDemoResultsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDemoResultsViewerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TreeDemoResultsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
