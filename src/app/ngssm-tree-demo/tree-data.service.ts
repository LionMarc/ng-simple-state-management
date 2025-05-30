import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';

import { NgssmTreeDataService, NodeData } from 'ngssm-tree';
import fileEntries from './tree-data.json';
import { TreeDemoResultsViewerComponent } from './tree-demo-results-viewer/tree-demo-results-viewer.component';

interface FileEntry {
  type: string;
  name: string;
  inode: number;
  contents: FileEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class TreeDataService implements NgssmTreeDataService {
  public readonly treeType = 'DemoType';

  public readonly searchResultViewer = TreeDemoResultsViewerComponent;

  public load(treeId: string, nodeId: string): Observable<NodeData[]> {
    console.log('Tree Demo Data Service - load', treeId, nodeId);
    const entry = this.findEntry(+nodeId, (fileEntries as FileEntry[])[0]);
    return of(entry).pipe(
      delay(100),
      map((e) => {
        return (e?.contents ?? []).map((c) => ({
          nodeId: c.inode.toString(),
          label: c.name,
          parentNodeId: nodeId,
          isExpandable: c.type === 'directory',
          type: c.type
        }));
      })
    );
  }

  private findEntry(id: number, entry: FileEntry): FileEntry | undefined {
    if (entry.inode === id) {
      return entry;
    }

    if (!entry.contents) {
      return undefined;
    }

    for (const child of entry.contents) {
      const wanted = this.findEntry(id, child);
      if (wanted) {
        return wanted;
      }
    }

    return undefined;
  }
}
