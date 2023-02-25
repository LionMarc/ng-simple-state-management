import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgssmTreeSearchDialogComponent } from './ngssm-tree-search-dialog.component';

describe('NgssmTreeSearchDialogComponent', () => {
  let component: NgssmTreeSearchDialogComponent;
  let fixture: ComponentFixture<NgssmTreeSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NgssmTreeSearchDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmTreeSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
