# Using a data source

## Defining the model and the loader

```typescript linenums="1"
--8<-- "samples/ngssm-data/src/app/model/alert-rule.ts"
```

## Registering the data source

```typescript hl_lines="20" linenums="1"
--8<-- "samples/ngssm-data/src/app/app.config.ts"
```

## Displaying the data

=== "html"

    ```html hl_lines="5 9" linenums="1"
    --8<-- "samples/ngssm-data/src/app/components/alert-rules/alert-rules.component.html"
    ```

=== "ts"

    ```typescript hl_lines="20-22" linenums="1"
    --8<-- "samples/ngssm-data/src/app/components/alert-rules/alert-rules.component.ts"
    ```