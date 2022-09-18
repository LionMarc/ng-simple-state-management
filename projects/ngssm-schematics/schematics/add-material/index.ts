import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType, NodeDependency } from '@schematics/angular/utility/dependencies';

function addFlexLayoutDependency(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Default, version: '>=14.0.0-beta', name: '@angular/flex-layout' }];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `"${dependency.name}" added into ${dependency.type}`);
    });

    return host;
  };
}

export default function (): Rule {
  return (_: Tree, context: SchematicContext) => {
    context.logger.info('Starting installation and configuration of @angular/material and @angular/flex-layout');

    return chain([
      externalSchematic('@angular/material', 'ng-add', {
        animations: 'enabled',
        theme: 'custom',
        typography: false
      }),
      addFlexLayoutDependency(),
      (__: Tree, ___: SchematicContext) => context.logger.info('✔️ @angular/material and @angular/flex-layout installed and configured')
    ]);
  };
}
