import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';

import { NgssmTreeDataService, NodeData } from 'ngssm-tree';
import fileEntries from './tree-data.json';

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
  public load(treeId: string, nodeId: string): Observable<NodeData[]> {
    console.log(fileEntries);

    const entry = this.findEntry(+nodeId, (fileEntries as any)[0]);
    return of(entry).pipe(
      delay(500),
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

    for (let child of entry.contents) {
      const wanted = this.findEntry(id, child);
      if (wanted) {
        return wanted;
      }
    }

    return undefined;
  }
}
