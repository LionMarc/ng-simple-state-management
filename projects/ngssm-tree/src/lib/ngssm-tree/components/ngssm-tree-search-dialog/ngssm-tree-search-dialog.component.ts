import { Component, ChangeDetectionStrategy, ViewContainerRef, ChangeDetectorRef, inject, viewChild, effect } from '@angular/core';

import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createSignal, Store } from 'ngssm-store';
import { defaultRegexEditorValidator } from 'ngssm-toolkit';

import { selectNgssmTreeState } from '../../state';
import { NgssmTreeActionType, SearchTreeNodesAction } from '../../actions';
import { NgssmTreeDataService, NGSSM_TREE_DATA_SERVICE, SearchStatus } from '../../model';

@Component({
  selector: 'ngssm-ngssm-tree-search-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ngssm-tree-search-dialog.component.html',
  styleUrls: ['./ngssm-tree-search-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmTreeSearchDialogComponent {
  private readonly store = inject(Store);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly dataServices: NgssmTreeDataService[] = inject(NGSSM_TREE_DATA_SERVICE, {
    optional: true
  }) as unknown as NgssmTreeDataService[];

  public readonly resultsViewerContainer = viewChild('resultsViewerContainer', { read: ViewContainerRef });

  public readonly searchStatus = SearchStatus;
  public readonly searchRootPath = createSignal((state) => selectNgssmTreeState(state).treeNodesSearch.rootSearchPath ?? '');
  public readonly currentSearchedPath = createSignal((state) => selectNgssmTreeState(state).treeNodesSearch.toProcess[0]?.fullPath ?? '');
  public readonly currentSearchStatus = createSignal((state) => selectNgssmTreeState(state).treeNodesSearch.searchStatus);

  public readonly searchPatternControl = new FormControl<string | undefined>(undefined, [
    Validators.required,
    (c) => this.validatedRegex(c)
  ]);

  constructor() {
    const effectRef = effect(() => {
      const container = this.resultsViewerContainer();
      if (!container) {
        return;
      }

      const treeState = selectNgssmTreeState(this.store.state());
      const treeId = treeState.treeNodesSearch.treeId;
      if (!treeId) {
        return;
      }

      const treeType = treeState.trees[treeId]?.type;
      if (!treeType) {
        return;
      }

      const dataService = this.dataServices.find((d) => d.treeType === treeType);
      if (!dataService?.searchResultViewer) {
        return;
      }

      this.resultsViewerContainer()?.createComponent(dataService.searchResultViewer);
      this.changeDetectorRef.markForCheck();

      effectRef.destroy();
    });
  }

  public close(): void {
    this.store.dispatchActionType(NgssmTreeActionType.closeSearchDialog);
  }

  public search(): void {
    const searchPattern = this.searchPatternControl.value;
    if (searchPattern) {
      this.store.dispatchAction(new SearchTreeNodesAction(searchPattern));
    }
  }

  public abort(): void {
    this.store.dispatchActionType(NgssmTreeActionType.abortTreeNodesSearch);
  }

  private validatedRegex(control: AbstractControl): ValidationErrors | null {
    const result = defaultRegexEditorValidator.validatePattern(control.value);
    if (result.isValid) {
      return null;
    }

    return {
      regex: result.error
    };
  }
}
