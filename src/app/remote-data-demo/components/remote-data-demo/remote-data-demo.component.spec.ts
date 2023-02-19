import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteDataDemoComponent } from './remote-data-demo.component';

describe('RemoteDataDemoComponent', () => {
  let component: RemoteDataDemoComponent;
  let fixture: ComponentFixture<RemoteDataDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteDataDemoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RemoteDataDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
