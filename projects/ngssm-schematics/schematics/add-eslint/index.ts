import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType, NodeDependency } from '@schematics/angular/utility/dependencies';

function addEslint(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Dev, version: '^19.3.0', name: 'angular-eslint' }];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `"${dependency.name}" added into ${dependency.type}`);
    });

    return host;
  };
}

function addPrettierDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Dev, version: '^3.0.0', name: 'prettier' },
      { type: NodeDependencyType.Dev, version: '^16.0.0', name: 'prettier-eslint' },
      { type: NodeDependencyType.Dev, version: '^10.0.0', name: 'eslint-config-prettier' },
      { type: NodeDependencyType.Dev, version: '^5.0.0', name: 'eslint-plugin-prettier' },
      { type: NodeDependencyType.Dev, version: '^4.0.0', name: 'eslint-plugin-unused-imports' }
    ];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `"${dependency.name}" added into ${dependency.type}`);
    });

    return host;
  };
}

function createPrettierRc(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const path = '.prettierrc';
    context.logger.log('info', `Creating ${path}`);
    if (!tree.exists(path)) {
      const config = {
        singleQuote: true,
        trailingComma: 'none',
        endOfLine: 'auto',
        tabWidth: 2,
        bracketSameLine: true,
        printWidth: 120
      };
      tree.create(path, JSON.stringify(config, null, 2));
    }

    return tree;
  };
}

function updateAngularJson(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const path = 'angular.json';
    context.logger.log('info', `Updating ${path} with schematics settings`);
    if (tree.exists(path)) {
      const currentAngularJson = tree.read(path)!.toString('utf-8');
      const json = JSON.parse(currentAngularJson);
      json['schematics'] = {
        '@angular-eslint/schematics:application': {
          setParserOptionsProject: true
        },
        '@angular-eslint/schematics:library': {
          setParserOptionsProject: true
        },
        '@schematics/angular': {
          component: {
            changeDetection: 'OnPush'
          }
        }
      };

      tree.overwrite(path, JSON.stringify(json, null, 2));
    }

    return tree;
  };
}

export default function (): Rule {
  return (_: Tree, context: SchematicContext) => {
    context.logger.info('Starting installation and configuration of eslint and prettier');

    return chain([
      addEslint(),
      externalSchematic('@angular-eslint/schematics', 'ng-add', {}),
      addPrettierDependencies(),
      createPrettierRc(),
      updateAngularJson(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (__: Tree, ___: SchematicContext) => context.logger.info('✔️ Eslint and prettier installed and configured')
    ]);
  };
}
