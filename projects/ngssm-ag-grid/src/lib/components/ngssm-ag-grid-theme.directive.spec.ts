import { NgssmAgGridOptions } from '../ngssm-ag-grid-options';
import { NgssmAgGridThemeDirective } from './ngssm-ag-grid-theme.directive';

describe('NgssmAgGridThemeDirective', () => {
  it('should create an instance', () => {
    const directive = new NgssmAgGridThemeDirective(new NgssmAgGridOptions());
    expect(directive).toBeTruthy();
  });
});
