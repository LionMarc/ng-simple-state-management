import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';

console.log('AG-GRID INITIALIZATION');

// Register all community features
ModuleRegistry.registerModules([AllEnterpriseModule]);

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: 'legacy' });
