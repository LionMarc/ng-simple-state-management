import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';

export default function (): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Lint execution...');
    execSync('npm run lint -- --fix', { stdio: 'inherit' });

    return tree;
  };
}
