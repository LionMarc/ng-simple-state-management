import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Effect, State, Action, ActionDispatcher } from 'ngssm-store';
import { NgssmAddExpressionTreeNodeAction } from 'ngssm-tree';

import { JsonBuilderActionType, SubmitJsonNodeAction } from '../actions';
import { JsonNodeEditorComponent } from '../components';
import { selectJsonBuilderState } from '../state';
import { JsonNodeType } from '../model';

@Injectable()
export class JsonNodeEditorEffect implements Effect {
  public readonly processedActions: string[] = [
    JsonBuilderActionType.newProperty,
    JsonBuilderActionType.closeJsonNodeEditor,
    JsonBuilderActionType.submitJsonNode
  ];

  private readonly matDialog = inject(MatDialog);

  private dialog: MatDialogRef<JsonNodeEditorComponent> | undefined;

  public processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void {
    switch (action.type) {
      case JsonBuilderActionType.newProperty: {
        this.dialog = this.matDialog.open(JsonNodeEditorComponent, {
          disableClose: true
        });

        break;
      }

      case JsonBuilderActionType.closeJsonNodeEditor: {
        this.closeDialog();

        break;
      }

      case JsonBuilderActionType.submitJsonNode: {
        const editor = selectJsonBuilderState(state).jsonNodeEditor;

        if (editor.treeId) {
          const submitJsonNodeAction = action as SubmitJsonNodeAction;
          const nextNodeId = selectJsonBuilderState(state).nextNodeId;
          actiondispatcher.dispatchAction(
            new NgssmAddExpressionTreeNodeAction(editor.treeId, {
              id: nextNodeId.toString(),
              parentId: editor.nodeId,
              isExpandable: submitJsonNodeAction.jsonNodeType === JsonNodeType.object,
              data: {
                type: submitJsonNodeAction.jsonNodeType,
                name: submitJsonNodeAction.name
              }
            })
          );

          actiondispatcher.dispatchActionType(JsonBuilderActionType.incrementNextNodeId);
          this.closeDialog();
        }

        break;
      }
    }
  }

  private closeDialog(): void {
    this.dialog?.close();
    this.dialog = undefined;
  }
}
