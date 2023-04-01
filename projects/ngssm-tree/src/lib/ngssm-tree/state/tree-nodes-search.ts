import { SearchStatus } from '../model';

export interface TreeNodesSearch {
  treeId?: string;
  rootSearchNodeId?: string;
  rootSearchPath?: string;
  searchPattern?: string;
  searchStatus: SearchStatus;
  toProcess: { nodeId: string; fullPath: string }[];
  matchingNodes: string[];
}

export const getDefaultTreeNodesSearch = (): TreeNodesSearch => ({
  searchStatus: SearchStatus.none,
  toProcess: [],
  matchingNodes: []
});
