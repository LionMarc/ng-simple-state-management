import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

import { WrapperComponent } from './wrapper.component';

@Component({
  template: `<div><ngssm-wrapper [item]="item"></ngssm-wrapper></div>`,
  imports: [CommonModule, WrapperComponent]
})
class UndefinedComponent {
  public item = undefined;
}

@Component({
  template: `<div><ngssm-wrapper [item]="item"></ngssm-wrapper></div>`,
  imports: [CommonModule, WrapperComponent]
})
class StringComponent {
  public item = 'MESSAGE';
}

@Component({
  selector: 'ngssm-wrapped',
  template: `TESTING`,
  imports: [CommonModule]
})
class WrappedComponent {}

@Component({
  template: `<div><ngssm-wrapper [item]="item"></ngssm-wrapper></div>`,
  imports: [CommonModule, WrapperComponent]
})
class WithComponent {
  public item = WrappedComponent;
}

describe('WrapperComponent', () => {
  describe('Given an undefined wrapped component', () => {
    let fixture: ComponentFixture<UndefinedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UndefinedComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(UndefinedComponent);
      fixture.detectChanges();
    });

    describe('When I display the component in the wrapper', () => {
      it('Then nothing is displayed', () => {
        const content = fixture.debugElement.query(By.css('ngssm-wrapper')).nativeElement;
        expect(content?.innerHTML).toEqual('<!--bindings={}-->');
      });
    });
  });

  describe('Given a string wrapped component', () => {
    let fixture: ComponentFixture<StringComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StringComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(StringComponent);
      fixture.detectChanges();
    });

    describe('When I display the component in the wrapper', () => {
      it(`Then the text 'Message' is displayed`, () => {
        const content = fixture.debugElement.query(By.css('ngssm-wrapper span')).nativeElement;
        expect(content?.innerHTML).toEqual('MESSAGE');
      });
    });
  });

  describe('Given an angular wrapped component', () => {
    let fixture: ComponentFixture<WithComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WithComponent, WrappedComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(WithComponent);
      fixture.detectChanges();
    });

    describe('When I display the component in the wrapper', () => {
      it(`Then the wrapped component is displayed`, () => {
        const content = fixture.debugElement.query(By.css('ngssm-wrapped')).nativeElement;
        expect(content?.innerHTML).toEqual('TESTING');
      });
    });
  });
});
