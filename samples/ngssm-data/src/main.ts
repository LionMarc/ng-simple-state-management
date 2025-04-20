import { bootstrapApplication } from '@angular/platform-browser';

import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions, themeMaterial } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
provideGlobalGridOptions({ theme: themeMaterial });

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
