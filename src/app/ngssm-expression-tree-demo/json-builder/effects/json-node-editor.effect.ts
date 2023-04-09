import { Injectable, Provider } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Effect, Store, State, Action, NGSSM_EFFECT } from 'ngssm-store';
import { NgssmAddExpressionTreeNodeAction } from 'ngssm-tree';

import { JsonBuilderActionType, SubmitJsonNodeAction } from '../actions';
import { JsonNodeEditorComponent } from '../components';
import { selectJsonBuilderState } from '../state';
import { JsonNodeType } from '../model';

@Injectable()
export class JsonNodeEditorEffect implements Effect {
  private dialog: MatDialogRef<JsonNodeEditorComponent> | undefined;

  public readonly processedActions: string[] = [
    JsonBuilderActionType.newProperty,
    JsonBuilderActionType.closeJsonNodeEditor,
    JsonBuilderActionType.submitJsonNode
  ];

  constructor(private matDialog: MatDialog) {}

  public processAction(store: Store, state: State, action: Action): void {
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
          store.dispatchAction(
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

          store.dispatchActionType(JsonBuilderActionType.incrementNextNodeId);
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

export const jsonNodeEditorEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: JsonNodeEditorEffect,
  multi: true
};
