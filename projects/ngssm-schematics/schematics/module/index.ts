import { Rule, apply, url, applyTemplates, move, mergeWith, Tree, MergeStrategy, SchematicContext } from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { ModuleOptions } from './module-options';

export default function (options: ModuleOptions): Rule {
  return async (_: Tree, __: SchematicContext) => {
    const modulePath = options.path + '/' + options.name;
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name
      }),
      move(normalize(modulePath))
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}
