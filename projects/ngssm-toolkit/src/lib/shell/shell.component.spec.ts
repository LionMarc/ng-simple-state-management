import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MaterialImportsModule } from '../material';
import { NavigationSection } from './navigation-section';
import { ShellComponent } from './shell.component';

@Component({
  selector: 'ngssm-testing',
  template: `
    <leono-shell [navigationSections]="navigationSections">
      <div fxLayout="row" fxLayoutAlign=" center" id="header-title">Testing component</div>
    </leono-shell>
  `,
  styles: [
    `
      :host {
        height: 500px;
        display: flex;
        flex-direction: column;
      }
    `
  ]
})
class TestingComponent {
  public readonly navigationSections: NavigationSection[] = [
    {
      iconClass: 'fa-solid fa-house',
      label: 'Home',
      route: '/home',
      items: []
    },
    {
      label: 'Input data',
      route: '/input-data',
      items: [
        {
          label: 'Data providers',
          route: '/input-data/data-providers',
          iconClass: 'fa-solid fa-database'
        },
        {
          label: 'Downloaded files',
          route: '/input-data/downloaded-files',
          iconClass: 'fa-solid fa-file-arrow-down'
        },
        {
          label: 'Data formatters',
          route: '/input-data/downloaded-files',
          iconClass: 'fa-solid fa-f'
        },
        {
          label: 'File processing rules',
          route: '/input-data/downloaded-files',
          iconClass: 'fa-solid fa-gear'
        }
      ]
    },
    {
      label: 'Data transform',
      route: '/data-transform',
      items: [
        {
          label: 'Data transformation models',
          route: '/data-transform/data-transformation-modes'
        },
        {
          label: 'Data transformations',
          route: '/data-transform/data-transformations'
        }
      ]
    }
  ];
}

describe('ShellComponent', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialImportsModule, NoopAnimationsModule, RouterModule],
      declarations: [ShellComponent, TestingComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the header title', () => {
    expect(fixture.debugElement.query(By.css('#header-title')).nativeElement.textContent).toEqual('Testing component');
  });
});
