import { InjectionToken, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeData } from './node-data';

export interface NgssmTreeDataService {
  readonly treeType: string;
  // Component used to display the result of a search
  readonly searchResultViewer?: Type<unknown>;
  load(treeId: string, nodeId: string): Observable<NodeData[]>;
}

export const NGSSM_TREE_DATA_SERVICE = new InjectionToken<NgssmTreeDataService>('NGSSM_TREE_DATA_SERVICE');
