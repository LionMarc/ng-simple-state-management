import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';

import { ActionConfirmationPopupComponent } from './action-confirmation-popup.component';
import { ActionConfirmationPopupParameter } from './action-confirmation-popup-parameter';

describe('ActionConfirmationPopupComponent', () => {
  let component: ActionConfirmationPopupComponent;
  let fixture: ComponentFixture<ActionConfirmationPopupComponent>;
  let popupRendered: WritableSignal<boolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionConfirmationPopupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionConfirmationPopupComponent);
    component = fixture.componentInstance;
    popupRendered = signal(true); // Mock signal for popupRendered
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const defaultMockPopupParameter: ActionConfirmationPopupParameter = {
    messageBuilder: (params?: ICellRendererParams) => `Are you sure you want to delete ${params?.data?.name}?`,
    cancelButtonLabel: 'No',
    confirmButtonLabel: 'Yes'
  };

  describe('init', () => {
    it('should initialize the popup with the provided parameters', () => {
      const mockParams = { data: { name: 'Test Item' } };
      const mockPopupParameter: ActionConfirmationPopupParameter = {
        ...defaultMockPopupParameter,
        color: 'warn',
        confirmAction: vi.fn()
      };

      component.init(popupRendered, mockParams as ICellRendererParams, mockPopupParameter);

      expect(component.message()).toBe('Are you sure you want to delete Test Item?');
      expect(component.color()).toBe('warn');
      expect(component.cancelButtonLabel()).toBe('No');
      expect(component.confirmButtonLabel()).toBe('Yes');
      expect(component.isOpen()).toBe(true);
    });

    it('should handle missing popup parameters gracefully', () => {
      const mockParams = { data: { name: 'Test Item' } };

      component.init(popupRendered, mockParams as ICellRendererParams, undefined);

      expect(component.message()).toBe('No message');
      expect(component.color()).toBe('primary');
      expect(component.cancelButtonLabel()).toBe('Cancel');
      expect(component.confirmButtonLabel()).toBe('Confirm');
      expect(component.isOpen()).toBe(true);
    });
  });

  describe('closePopup', () => {
    it('should close the popup by setting isOpen to false', () => {
      component.isOpen.set(true);

      component.closePopup();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('executeAction', () => {
    it('should execute the confirm action and close the popup', () => {
      const mockParams = { data: { name: 'Test Item' } };
      const mockPopupParameter: ActionConfirmationPopupParameter = {
        ...defaultMockPopupParameter,
        confirmAction: vi.fn()
      };

      component.init(popupRendered, mockParams as ICellRendererParams, mockPopupParameter);

      component.executeAction();

      expect(mockPopupParameter.confirmAction).toHaveBeenCalledWith(mockParams);
      expect(component.isOpen()).toBe(false);
    });

    it('should handle missing confirmAction gracefully', () => {
      const mockParams = { data: { name: 'Test Item' } };

      component.init(popupRendered, mockParams as ICellRendererParams, defaultMockPopupParameter);

      expect(() => component.executeAction()).not.toThrow();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('signal updates', () => {
    it('should update the popupRendered signal when the popup is opened or closed', () => {
      component.init(popupRendered, {} as ICellRendererParams, defaultMockPopupParameter);

      expect(popupRendered()).toBe(true);

      component.closePopup();

      expect(popupRendered()).toBe(false);
    });
  });
});
