import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';

import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
provideGlobalGridOptions({ theme: 'legacy' });

bootstrapApplication(AppComponent, {...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers]}).catch((error) => console.error(error));
