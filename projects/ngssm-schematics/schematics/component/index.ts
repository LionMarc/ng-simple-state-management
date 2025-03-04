import {
  Rule,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
  externalSchematic,
  Tree,
  MergeStrategy
} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { parseName } from '@schematics/angular/utility/parse-name';
import { AngularComponentOptionsSchema } from '@angular/cli/lib/config/workspace-schema';

function buildSelector(options: AngularComponentOptionsSchema, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    // use prefix from options if provided
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAngularComponentExtensions(extensions: any) {
  if (extensions?.schematics && extensions.schematics['@schematics/angular:component']) {
    return extensions.schematics['@schematics/angular:component'];
  }

  return {};
}

export function component(options: AngularComponentOptionsSchema): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);
    const angularComponentOptions = {
      ...options,
      // find default workspace setting
      ...getAngularComponentExtensions(workspace.extensions),
      // find default project setting
      ...getAngularComponentExtensions(project?.extensions)
    };

    const parsedPath = parseName(angularComponentOptions.path as string, angularComponentOptions.name);
    angularComponentOptions.name = parsedPath.name; // component name
    angularComponentOptions.path = parsedPath.path; // component path
    // component selector
    angularComponentOptions.selector =
      angularComponentOptions.selector || buildSelector(angularComponentOptions, (project && project.prefix) || '');
    angularComponentOptions.standalone = true;

    const componentPath =
      `/${angularComponentOptions.path}/` + (angularComponentOptions.flat ? '' : strings.dasherize(angularComponentOptions.name) + '/');

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        ...angularComponentOptions
      }),
      move(normalize(componentPath))
    ]);

    return chain([
      externalSchematic('@schematics/angular', 'component', angularComponentOptions),
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ]);
  };
}
