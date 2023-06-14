import { NgssmExpressionTreeCustomComponent } from './ngssm-expression-tree-custom-component';
import { NgssmExpressionTreeNode } from './ngssm-expression-tree-node';

export type CutAndPasteTarget = 'After' | 'Inside';

/**
 * Configuration parameers of an expression tree instance.
 */
export interface NgssmExpressionTreeConfig<TData = any> {
  /**
   * Identifier of the tree used to associate data stored in the state with the component instance.
   */
  treeId: string;

  /**
   * If true, no virtualization is applied.
   */
  disableVirtualization?: boolean;

  /**
   * Base left padding for a  row in pixels.
   * The real padding is the depth of the node multiplied by this value.
   * By default 20px.
   */
  nodePadding?: number;

  /**
   * Height of a row in pixels.
   * By default 30px.
   */
  rowSize?: number;

  /**
   * The css class used to render the expand icon.
   * By default 'fa-solid fa-chevron-right'
   */
  expandIconClass?: string;

  /**
   * The css class used to render the collpase icon.
   * By default 'fa-solid fa-chevron-down'
   */
  collapseIconClass?: string;

  /**
   * Get the label of the node.
   * @param node
   * @param data The current data to be rendered by the node
   * @returns The string value of the label
   */
  getNodeLabel?: (node: NgssmExpressionTreeNode<TData>, data: TData) => string;

  /**
   * Get a css icon to display at the left of the label
   * @param node
   * @param data The current data to be rendered by the node
   * @returns The string value of the label
   */
  getNodeCssIcon?: (node: NgssmExpressionTreeNode<TData>, data: TData) => string | undefined;

  /**
   * Html rendered at the right of the label to display a description of the node
   * @param node
   * @param data The current data to be rendered by the node
   * @returns The html used to render the node description
   */
  getNodeDescription?: (node: NgssmExpressionTreeNode<TData>, data: TData) => string;

  /**
   * To render description of a node by using a custom angular component instead of simple html.
   * It must implement {@link NgssmExpressionTreeCustomComponent}.
   */
  nodeDescriptionComponent?: any;

  /**
   * To render node detail with a custom angular component.
   * It must implement {@link NgssmExpressionTreeCustomComponent}
   */
  nodeDetailComponent?: any;

  /**
   * To render in the popup menus the items to cut and paste nodes.
   */
  displayCutAndPasteMenus?: boolean;

  canPaste?: (node: NgssmExpressionTreeNode<TData>, targetNode: NgssmExpressionTreeNode<TData>, target: CutAndPasteTarget) => boolean;
}
