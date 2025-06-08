// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

import { ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

// Register all community features
ModuleRegistry.registerModules([AllEnterpriseModule]);

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: 'legacy' });

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), { teardown: { destroyAfterEach: false } });
