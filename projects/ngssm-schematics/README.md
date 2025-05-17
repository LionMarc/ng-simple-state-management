# ngssm-schematics

This library provides a list of useful schematics to simplify painful tasks.

## ng-add

Executed when installing the package with the `ng add` command, this schematics will excute the following schematics:
- [add-eslint](#add-eslint)
- [add-fontawesome](#add-fontawesome)
- [add-material](#add-material)

At the end, this schematic executes `ng lint --fix` if *@angular-eslint* has been installed.

## add-eslint

Used to install and configure eslint and prettier.

- [eslint](https://github.com/angular-eslint/angular-eslint):
    ```
    ng add @angular-eslint/schematics
    ```
- [eslint-plugin-deprecation](https://github.com/gund/eslint-plugin-deprecation)
    * install packages

        ```
        npm install eslint-plugin-deprecation --save-dev
        ```
    * update *.eslintrc.json* file

        ```
        ...
            "plugins": [
                "deprecation"
            ],
        ...
            "rules": {
                "deprecation/deprecation": "error",
        ...
        ```
- [prettier](https://prettier.io/docs/en/integrating-with-linters.html):
    * install packages

        ```
        npm install prettier --save-dev
        npm install prettier-eslint eslint-config-prettier eslint-plugin-prettier --save-dev
        ```

    * add *.prettierrc* file:

        ```
        {
            "singleQuote": true,
            "trailingComma": "none",
            "endOfLine": "auto",
            "tabWidth": 2,
            "bracketSameLine": true,
            "printWidth": 140 
        }
        ```

    * update *.eslintrc.json* file

        ```
        ...
            "extends": [
                ...
                "plugin:prettier/recommended"
            ],
        ...
        ```

## add-fontawesome

Add *@fortawesome/fontawesome-free* to the project.

- install package
    ```
    npm install @fortawesome/fontawesome-free --save
    ```
- Update *styles.scss* file
    ```
    ...
    @import "@fortawesome/fontawesome-free/css/fontawesome.css";
    @import "@fortawesome/fontawesome-free/css/all.css";
    ...
    ```

## add-material

Add *@angular/material* to the project.

- [material](https://material.angular.io/)
    ```
    ng add @angular/material
    ```

## Schematics associated to the state management

| Schematic | Description |
|---|---|
| feature-state | Allow creating a state associated to a user feature |
| action | Creation of an action which implements **Action** |
| reducer | Creation of a reducer which implements **Reducer** |
| effect | Creation of an effect which implements **Effect** |
| feature | Create a feature folder and all the folders for actions, components, reducers... |
