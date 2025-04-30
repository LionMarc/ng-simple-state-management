import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType, NodeDependency } from '@schematics/angular/utility/dependencies';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

function addDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '^19.0.0', name: 'ngssm-toolkit' },
      { type: NodeDependencyType.Default, version: '^19.0.0', name: 'ngssm-store' },
      { type: NodeDependencyType.Default, version: '^3.1.1', name: 'immutability-helper' },
      { type: NodeDependencyType.Default, version: '^3.6.1', name: 'luxon' },
      { type: NodeDependencyType.Dev, version: '^3.6.2', name: '@types/luxon' }
    ];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `"${dependency.name}" added into ${dependency.type}`);
    });

    return host;
  };
}

export function installDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    return tree;
  };
}

function updateStyles(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const path = 'src/styles.scss';
    context.logger.info(`Updating ${path}`);
    if (tree.exists(path)) {
      const content = tree.read(path)?.toString() ?? '';
      const insertion = `
@use "ngssm-toolkit/styles/ngssm.scss" as ngssm-styles;
@use "ngssm-toolkit/styles/material.scss" as ngssm-material-styles;
`;

      if (content.includes(insertion)) {
        return tree;
      }

      const recorder = tree.beginUpdate(path);
      recorder.insertLeft(0, insertion);
      tree.commitUpdate(recorder);
      context.logger.info(`✔️ File ${path} updated`);
    } else {
      context.logger.warn(`❌ File '${path}' not found.`);
    }

    return tree;
  };
}

function updateStylePreprocessorOptions(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const path = 'angular.json';
    context.logger.log('info', `Updating ${path} with stylePreprocessorOptions`);
    if (tree.exists(path)) {
      const currentAngularJson = tree.read(path)!.toString('utf-8');
      const json = JSON.parse(currentAngularJson);
      Object.keys(json['projects']).forEach((key) => {
        const buildOptions = json['projects'][key]['architect']['build']['options'];
        if (buildOptions['stylePreprocessorOptions']) {
          if (buildOptions['stylePreprocessorOptions']['includePaths']) {
            if (!buildOptions['stylePreprocessorOptions']['includePaths'].includes('./node_modules')) {
              buildOptions['stylePreprocessorOptions']['includePaths'].push('./node_modules');
            }
          } else {
            buildOptions['stylePreprocessorOptions']['includePaths'] = ['./node_modules'];
          }
        } else {
          buildOptions['stylePreprocessorOptions'] = {
            includePaths: ['./node_modules']
          };
        }
      });

      tree.overwrite(path, JSON.stringify(json, null, 2));
    }

    return tree;
  };
}

export default function (): Rule {
  return (_: Tree, context: SchematicContext) => {
    context.logger.info('Starting installation and configuration of ngssm');

    return chain([
      addDependencies(),
      installDependencies(),
      updateStyles(),
      updateStylePreprocessorOptions(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (__: Tree, ___: SchematicContext) => context.logger.info('✔️ ngssm installed and configured')
    ]);
  };
}
