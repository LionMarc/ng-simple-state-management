import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';

export default function (): Rule {
  return (_: Tree, context: SchematicContext) => {
    context.logger.info('Starting installation and configuration of @angular/material');

    return chain([
      externalSchematic('@angular/material', 'ng-add', {
        animations: 'enabled',
        theme: 'custom',
        typography: false
      }),
      (__: Tree, ___: SchematicContext) => context.logger.info('✔️ @angular/material installed and configured')
    ]);
  };
}
