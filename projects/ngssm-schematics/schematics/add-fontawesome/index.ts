import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType, NodeDependency } from '@schematics/angular/utility/dependencies';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

function addDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Default, version: '^6.4.2', name: '@fortawesome/fontawesome-free' }];

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
      const insertion = `@import "@fortawesome/fontawesome-free/css/fontawesome.css";
@import "@fortawesome/fontawesome-free/css/all.css";`;

      if (content.includes(insertion)) {
        return tree;
      }

      const recorder = tree.beginUpdate(path);
      recorder.insertLeft(content.length, insertion);
      tree.commitUpdate(recorder);
      context.logger.info(`✔️ File ${path} updated`);
    } else {
      context.logger.warn(`❌ File '${path}' not found.`);
    }

    return tree;
  };
}

export default function (): Rule {
  return (_: Tree, context: SchematicContext) => {
    context.logger.info('Starting installation and configuration of @fortawesome/fontawesome-free');

    return chain([
      addDependencies(),
      installDependencies(),
      updateStyles(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (__: Tree, ___: SchematicContext) => context.logger.info('✔️ @fortawesome/fontawesome-free installed and configured')
    ]);
  };
}
