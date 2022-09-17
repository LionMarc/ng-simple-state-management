import { Rule, apply, url, applyTemplates, move, chain, mergeWith } from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';

import { BaseOptions } from '../utilities';

export function featureState(options: BaseOptions): Rule {
  return () => {
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name
      }),
      move(normalize(options.path as string))
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
