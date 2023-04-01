import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmBreadcrumbComponent } from './ngssm-breadcrumb.component';

describe('NgssmBreadcrumbComponent', () => {
  let component: NgssmBreadcrumbComponent;
  let fixture: ComponentFixture<NgssmBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgssmBreadcrumbComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
