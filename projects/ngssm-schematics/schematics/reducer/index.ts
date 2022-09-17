import { Rule, apply, url, applyTemplates, move, chain, mergeWith, SchematicsException, Tree } from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';

import { addDeclarationToNgModule } from '../utilities/helpers';
import { WithProviderOptions } from '../utilities';

export function reducer(options: WithProviderOptions): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);
    if (!project) {
      throw new SchematicsException(`Project "${options.project}" does not exist.`);
    }

    options.module = findModuleFromOptions(host, options);
    options.providerName = `${strings.camelize(options.name)}ReducerProvider`;
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name,
        providerName: options.providerName
      }),
      move(normalize(options.path as string))
    ]);

    return chain([addDeclarationToNgModule(options, 'reducer'), mergeWith(templateSource)]);
  };
}
