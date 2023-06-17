import { SchematicsException, Tree } from '@angular-devkit/schematics';

import * as ts from 'typescript';

export function readIntoSourceFile(host: Tree, modulePath: string) {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }

  return ts.createSourceFile(modulePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}
