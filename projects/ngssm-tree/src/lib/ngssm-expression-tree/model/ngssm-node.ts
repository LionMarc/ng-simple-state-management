/**
 * Represents the configuration information of a node.
 */
export interface NgssmNode<TData = any> {
  id: string;
  parentId?: string;
  isExpandable?: boolean;
  hasRowDetail?: boolean;

  /**
   * This is the intial value of the data associated to this node.
   * When updating a node data, this value is not updated unless it is updated
   * in user code, which must not be done.
   * Everything put in the state must be considered as immutable, even it is not.
   */
  data: TData;
}
