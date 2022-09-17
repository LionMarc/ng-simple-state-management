import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

import * as ts from 'typescript';

import { WithProviderOptions } from './with-provider-options';

export function readIntoSourceFile(host: Tree, modulePath: string) {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }

  return ts.createSourceFile(modulePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}

export function addDeclarationToNgModule(options: WithProviderOptions, objectType: string): Rule {
  return (host: Tree) => {
    const modulePath = options.module;
    if (modulePath === undefined) {
      return host;
    }

    const source = readIntoSourceFile(host, modulePath);

    const providerPath = `/${options.path}/${strings.dasherize(options.name)}.${objectType}`;
    const relativePath = buildRelativePath(modulePath, providerPath);

    const providerChanges = addProviderToModule(
      source,
      modulePath as string,
      options.providerName as string,
      relativePath
    ) as InsertChange[];

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of providerChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    return host;
  };
}
