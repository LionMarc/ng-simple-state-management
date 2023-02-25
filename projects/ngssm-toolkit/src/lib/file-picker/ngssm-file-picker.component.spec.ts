import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmFilePickerComponent } from './ngssm-file-picker.component';

describe('NgssmFilePickerComponent', () => {
  let component: NgssmFilePickerComponent;
  let fixture: ComponentFixture<NgssmFilePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgssmFilePickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmFilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
