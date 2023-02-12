import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmTreeComponent } from './ngssm-tree.component';

describe('NgssmTreeComponent', () => {
  let component: NgssmTreeComponent;
  let fixture: ComponentFixture<NgssmTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgssmTreeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
