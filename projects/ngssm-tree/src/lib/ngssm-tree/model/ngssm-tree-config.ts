import { NodeData } from './node-data';

export interface NgssmTreeConfig<TData = any> {
  treeId: string;

  // icon displayed with mat-icon
  // the key is the value of the node type property
  iconClasses: { [key: string]: string };

  // Return true if node must be displayed
  filter?: (node: NodeData<TData>) => boolean;

  // Return true if we can search from this node
  canSearch?: (node: NodeData<TData>) => boolean;
}
