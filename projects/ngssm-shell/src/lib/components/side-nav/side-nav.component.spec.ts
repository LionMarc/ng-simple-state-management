import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SideNavComponent } from './side-nav.component';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Given a title is set in the sidenav config', () => {
    beforeEach(() => {
      component.config = {
        title: 'Menu Title'
      };
    });

    describe('When I display the sidenav', () => {
      beforeEach(async () => {
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it('Then the title is displayed in the sidenav', () => {
        const title = fixture.debugElement.query(By.css('.ngssm-sidenav-title'));
        expect(title).toBeTruthy();
        expect(title.nativeElement.innerHTML).toEqual('Menu Title');
      });
    });
  });

  describe('Given sections with no children and no route are set in the sidenav config', () => {
    beforeEach(() => {
      component.config = {
        sections: [
          {
            label: 'Section 1'
          },
          {
            label: 'Section 2'
          }
        ]
      };
    });

    describe('When I display the sidenav', () => {
      beforeEach(async () => {
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it('Then the sections are displayed in the sidenav', () => {
        const sections = fixture.debugElement.queryAll(By.css('.ngssm-sidenav-section-item-container div.ngssm-sidenav-section-item'));
        expect(sections.length).toEqual(2);
        expect(sections[0].nativeElement.innerHTML).toContain('Section 1');
        expect(sections[1].nativeElement.innerHTML).toContain('Section 2');
      });
    });
  });

  describe('Given a section with an icon set in the sidenav config', () => {
    beforeEach(() => {
      component.config = {
        sections: [
          {
            label: 'Section 1',
            icon: '<i class="fa-solid fa-house"></i>'
          }
        ]
      };
    });

    describe('When I display the sidenav', () => {
      beforeEach(async () => {
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it('Then the icon is displayed before the section in the sidenav', () => {
        const sections = fixture.debugElement.queryAll(By.css('.ngssm-sidenav-section-item-container div.ngssm-sidenav-section-item'));
        expect(sections.length).toEqual(1);
        const pattern = new RegExp(`<i class="fa-solid fa-house"></i>.*Section 1`);
        expect(sections[0].nativeElement.innerHTML.replace(/(\r\n|\n|\r)/gm, '')).toMatch(pattern);
      });
    });
  });
});
