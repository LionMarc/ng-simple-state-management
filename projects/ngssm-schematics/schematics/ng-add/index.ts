import { Rule, SchematicContext, Tree, TaskId } from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';

export default function (options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Starting configuration of the workspace...');
    const taksIds: TaskId[] = [];
    if (options.addEslint) {
      context.logger.info('ESLint must be installed and configured');
      const installTaskId = context.addTask(new RunSchematicTask('add-eslint', {}), [...taksIds]);
      taksIds.push(installTaskId);
    } else {
      context.logger.warn('ESLint will not be installed.');
    }

    if (options.addMaterial) {
      context.logger.info('@angular/material must be installed and configured');
      const installTaskId = context.addTask(new RunSchematicTask('add-material', {}), [...taksIds]);
      taksIds.push(installTaskId);
    } else {
      context.logger.warn('@angular/material will not be installed.');
    }

    if (options.addFontawesome) {
      context.logger.info('@fortawesome/fontawesome-free must be installed and configured');
      const installTaskId = context.addTask(new RunSchematicTask('add-fontawesome', {}), [...taksIds]);
      taksIds.push(installTaskId);
    } else {
      context.logger.warn('@fortawesome/fontawesome-free will not be installed.');
    }

    context.logger.info('Add task to install ngssm-store');
    const ngssmInstallTaskId = context.addTask(new RunSchematicTask('add-ngssm', {}), [...taksIds]);
    taksIds.push(ngssmInstallTaskId);

    // Last task
    if (options.addEslint) {
      context.addTask(new RunSchematicTask('exec-lint', {}), [...taksIds]);
    }

    return tree;
  };
}
