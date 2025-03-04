import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType, NodeDependency } from '@schematics/angular/utility/dependencies';

function addEslint(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Dev, version: '^8.57.0', name: 'eslint' }];

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
      { type: NodeDependencyType.Dev, version: '^9.0.0', name: 'eslint-config-prettier' },
      { type: NodeDependencyType.Dev, version: '^5.0.0', name: 'eslint-plugin-prettier' },
      { type: NodeDependencyType.Dev, version: '^2.0.0', name: 'eslint-plugin-deprecation' },
      { type: NodeDependencyType.Dev, version: '^3.0.0', name: 'eslint-plugin-unused-imports' }
    ];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `"${dependency.name}" added into ${dependency.type}`);
    });

    return host;
  };
}

function updateEslintRc(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const path = '.eslintrc.json';
    context.logger.log('info', `Updating ${path}`);
    if (tree.exists(path)) {
      const content = tree.read(path);
      const config = JSON.parse(content?.toString() ?? '{}');
      context.logger.log('info', `Updating ${path}`, config);
      config.plugins = ['deprecation', 'unused-imports'];
      config.overrides[0]['parserOptions'] = {
        project: ['tsconfig.json', 'tsconfig.(app|spec).json']
      };
      config.overrides[0].rules['deprecation/deprecation'] = 'error';
      config.overrides[0].rules['unused-imports/no-unused-imports'] = 'warn';
      config.overrides[0].extends.push('plugin:prettier/recommended');
      tree.overwrite(path, JSON.stringify(config, null, 2));
    }

    return tree;
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
      updateEslintRc(),
      createPrettierRc(),
      updateAngularJson(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (__: Tree, ___: SchematicContext) => context.logger.info('✔️ Eslint and prettier installed and configured')
    ]);
  };
}
