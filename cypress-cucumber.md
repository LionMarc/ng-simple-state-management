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
