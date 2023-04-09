export interface JsonNodeEditor {
  treeId?: string;
  nodeId?: string;
}

export const getDefaultJsonNodeEditor = (): JsonNodeEditor => ({});
