# ng-simple-state-management

![build workflow](https://github.com/LionMarc/ng-simple-state-management/actions/workflows/build.yml/badge.svg)
[![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/LionMarc/0e6ea813e47d66e72b3c7b1be39bd10e/raw)](https://github.com/LionMarc/ng-simple-state-management/actions/workflows/build.yml)
![publish workflow](https://github.com/LionMarc/ng-simple-state-management/actions/workflows/publish.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/ngssm-store.svg)](https://www.npmjs.com/package/ngssm-store)
[![license](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![HitCount](https://hits.dwyl.com/LionMarc/ng-simple-state-management.svg?style=flat-square)](http://hits.dwyl.com/LionMarc/ng-simple-state-management)
[![Npm package monthly downloads](https://badgen.net/npm/dm/ngssm-store)](https://npmjs.ccom/package/ngssm-store)

Simple state management implementation for angular applications.

This project provides several libraries:

- [ngssm-toolkit](/projects/ngssm-toolkit/README.md): provides some utilities;
- [ngssm-store](/projects/ngssm-store/README.md) : simple state management implementation;
- [ngssm-schematics](/projects/ngssm-schematics/README.md) : provides schematics to initialize workspace, create custom components, services...
- [ngssm-remote-data](/projects/ngssm-remote-data/README.md) : helpers to manage data provided by remote services;
- [ngssm-navigation](/projects/ngssm-navigation/README.md) : helpers to control angular navigation;
- [ngssm-ag-grid](/projects/ngssm-ag-grid/README.md) : used to manage [ag-grid](https://www.ag-grid.com/) state with the store;
- [ngssm-shell](/projects/ngssm-shell/README.md) : a complete customizable shell component;
- [ngssm-ace-editor](/projects/ngssm-ace-editor/README.md) : simple wrapper of [ace-editor](https://ace.c9.io/).

## Cypress and cucumber

### Links

- [cypress](https://github.com/cypress-io);
- [cypress schematics](https://github.com/cypress-io/cypress/tree/master/npm/cypress-schematic#readme);
- [cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor);
- [cucumber json formatter](https://github.com/cucumber/json-formatter);
- [html report](https://github.com/wswebcreation/multiple-cucumber-html-reporter);
- [vs code cucumber](https://github.com/cucumber/vscode).


### Installation and configuration

- Packages installation
    ```sh
    ng add @cypress/schematic
    npm install --save-dev @badeball/cypress-cucumber-preprocessor
    npm install --save-dev @bahmutov/cypress-esbuild-preprocessor
    npm install --save-dev multiple-cucumber-html-reporter
    ```

- Setting *cypress-cucumber-preprocessor* in **cypress.config.ts**:
    ```ts
    import { defineConfig } from 'cypress';
    import * as createBundler from '@bahmutov/cypress-esbuild-preprocessor';
    import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
    import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';

    export default defineConfig({
        e2e: {
            ...,
            specPattern: '**/*.feature',
            async setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Promise<Cypress.PluginConfigOptions> {
            // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
            await addCucumberPreprocessorPlugin(on, config);

            on(
                'file:preprocessor',
                createBundler({
                plugins: [createEsbuildPlugin(config)]
                })
            );

            // Make sure to return the config object as it might have been modified by the plugin.
            return config;
            }
        },
        ...
    });

    ```

- Loading and installing in the **PATH** the [json formatter](https://github.com/cucumber/json-formatter)

- Setting *.cypress-cucumber-preprocessorrc.json*:
    ```json
    {
        "json": {
            "enabled": true,
            "output": "cypress/json-results/log.json",
            "formatter": "cucumber-json-formatter.exe"
        },
        "stepDefinitions": [
            "[filepath]/**/*.{js,ts}",
            "[filepath].{js,ts}",
            "cypress/e2e/step_definitions/*.{js,ts}",
            "[filepath]\\***.{js,ts}",
            "[filepath].{js,ts}",
            "cypress\\e2e\\step_definitions\\*.{js,ts}"
        ]
    }
    ```

- Setup html reporting script:
    ```js
    var report = require("multiple-cucumber-html-reporter");
    report.generate({
        jsonDir: "cypress/json-results", // ** Path of .json file **//
        reportPath: "./reports/cucumber-htmlreport.html",
        metadata: {
            browser: {
            name: "chrome",
            version: "XX",
            },
            device: "Local test machine",
            platform: {
            name: "Windows",
            version: "11",
            },
        },
    });
    ```

- Setup *vs code cucumber* extension:
    ```json
    "cucumber.glue": [
        "cypress/e2e/**/*.ts"
    ]
    ```

### Execution and tests report generation

- Start angular application
    ```
    ng serve
    ```
- Run cypress
    ```
    cypress run
    ```
- Generate report
    ```
    node cucumber-html-report.js
    ```