import { NodeData } from './node-data';

export interface NgssmTreeConfig<TData = unknown> {
  treeId: string;

  // icon displayed with mat-icon
  // the key is the value of the node type property
  iconClasses: Record<string, string>;

  // Return true if node must be displayed
  filter?: (node: NodeData<TData>) => boolean;

  // Return true if we can search from this node
  canSearch?: (node: NodeData<TData>) => boolean;
}
