import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { NgSsmComponent, Store } from 'ngssm-store';

import { JsonBuilderActionType, SubmitJsonNodeAction } from '../../actions';
import { JsonNodeType, getJsonNodeTypes } from '../../model';

@Component({
  selector: 'app-json-node-editor',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule, MatButtonModule],
  templateUrl: './json-node-editor.component.html',
  styleUrls: ['./json-node-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonNodeEditorComponent extends NgSsmComponent {
  public readonly jsonNodeTypes = getJsonNodeTypes();

  public readonly jsonNodeTypeControl = new FormControl<JsonNodeType | undefined>(undefined, Validators.required);
  public readonly jsonNodeNameControl = new FormControl<string | undefined>(undefined, [
    Validators.required,
    Validators.pattern(/^[a-z][a-z_0-9]*$/)
  ]);

  public readonly formGroup = new FormGroup({
    type: this.jsonNodeTypeControl,
    name: this.jsonNodeNameControl
  });

  constructor(store: Store) {
    super(store);
  }

  public close(): void {
    this.dispatchActionType(JsonBuilderActionType.closeJsonNodeEditor);
  }

  public submit(): void {
    const type = this.jsonNodeTypeControl.value;
    const name = this.jsonNodeNameControl.value;
    if (type && name) {
      this.dispatchAction(new SubmitJsonNodeAction(type, name));
    }
  }
}
