import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  Inject,
  Optional,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, take } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { defaultRegexEditorValidator } from 'ngssm-toolkit';

import { selectNgssmTreeState } from '../../state';
import { NgssmTreeActionType, SearchTreeNodesAction } from '../../actions';
import { NgssmTreeDataService, NGSSM_TREE_DATA_SERVICE, SearchStatus } from '../../model';

@Component({
  selector: 'ngssm-ngssm-tree-search-dialog',
  imports: [
    CommonModule,
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
export class NgssmTreeSearchDialogComponent extends NgSsmComponent implements AfterViewInit {
  private readonly _currentSearchedPath$ = new BehaviorSubject<string>('');

  public readonly searchStatus = SearchStatus;

  public readonly searchRootPathControl = new FormControl<string | undefined>(undefined);
  public readonly searchPatternControl = new FormControl<string | undefined>(undefined, [
    Validators.required,
    (c) => this.validatedRegex(c)
  ]);

  @ViewChild('resultsViewerContainer', { read: ViewContainerRef }) public resultsViewerContainer: ViewContainerRef | undefined;

  constructor(
    store: Store,
    @Inject(NGSSM_TREE_DATA_SERVICE) @Optional() private dataServices: NgssmTreeDataService[],
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(store);

    this.watch((s) => selectNgssmTreeState(s).treeNodesSearch.rootSearchPath)
      .pipe(take(1))
      .subscribe((v) => this.searchRootPathControl.setValue(v));

    this.watch((s) => selectNgssmTreeState(s).treeNodesSearch.toProcess[0]).subscribe((node) => {
      if (node) {
        this._currentSearchedPath$.next(node.fullPath);
      } else {
        this._currentSearchedPath$.next('');
      }
    });
  }

  public get searchStatus$(): Observable<SearchStatus> {
    return this.watch((s) => selectNgssmTreeState(s).treeNodesSearch.searchStatus);
  }

  public get currentSearchedPath$(): Observable<string> {
    return this._currentSearchedPath$.asObservable();
  }

  public ngAfterViewInit(): void {
    this.watch((s) => selectNgssmTreeState(s))
      .pipe(take(1))
      .subscribe((state) => {
        const treeId = state.treeNodesSearch.treeId;
        if (!treeId) {
          return;
        }

        const treeType = state.trees[treeId]?.type;
        if (!treeType) {
          return;
        }

        const dataService = this.dataServices.find((d) => d.treeType === treeType);
        if (!dataService?.searchResultViewer) {
          return;
        }

        this.resultsViewerContainer?.createComponent(dataService.searchResultViewer);
        this.changeDetectorRef.markForCheck();
      });
  }

  public close(): void {
    this.dispatchActionType(NgssmTreeActionType.closeSearchDialog);
  }

  public search(): void {
    const searchPattern = this.searchPatternControl.value;
    if (searchPattern) {
      this.dispatchAction(new SearchTreeNodesAction(searchPattern));
    }
  }

  public abort(): void {
    this.dispatchActionType(NgssmTreeActionType.abortTreeNodesSearch);
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
