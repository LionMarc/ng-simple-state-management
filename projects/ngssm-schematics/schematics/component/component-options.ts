import { BaseOptions } from '../utilities';

export interface ComponentOptions extends BaseOptions {
  project?: string;
  displayBlock?: boolean;
  inlineStyle?: boolean;
  inlineTemplate?: boolean;
  viewEncapsulation?: string;
  changeDetection?: string;
  prefix?: string;
  style?: string;
  type?: string;
  skipTests?: boolean;
  flat?: boolean;
  skipImport?: boolean;
  selector?: string;
  skipSelector?: string;
  module?: string;
  export?: boolean;
}
