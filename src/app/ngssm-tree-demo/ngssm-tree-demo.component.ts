import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmTreeComponent, NgssmTreeConfig, NodeData } from 'ngssm-tree';

@Component({
  selector: 'app-ngssm-tree-demo',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgssmTreeComponent],
  templateUrl: './ngssm-tree-demo.component.html',
  styleUrls: ['./ngssm-tree-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmTreeDemoComponent extends NgSsmComponent {
  public readonly treeConfig: NgssmTreeConfig = {
    treeId: 'demo',
    iconClasses: {
      directory: 'fa-solid fa-folder',
      file: 'fa-regular fa-file'
    }
  };

  public readonly treeConfigForFolders: NgssmTreeConfig = {
    treeId: 'demo',
    iconClasses: {
      directory: 'fa-solid fa-folder',
      file: 'fa-regular fa-file'
    },
    filter: (node: NodeData) => node.type === 'directory'
  };

  constructor(store: Store) {
    super(store);
  }
}
