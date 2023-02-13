import { NodeData } from './node-data';

export interface NgssmTreeConfig<TData = any> {
  treeId: string;
  iconClasses: { [key: string]: string };

  // Return true if node must be displayed
  filter?: (node: NodeData<TData>) => boolean;
}
