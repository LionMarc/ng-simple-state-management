import { Component, ChangeDetectionStrategy, ElementRef, Type, input, output, inject, effect, signal } from '@angular/core';

import { NgssmComponentAction, NgssmComponentDisplayDirective } from 'ngssm-toolkit';

import { NgssmExpressionTreeConfig, NgssmExpressionTreeCustomComponent } from '../../model';

@Component({
  selector: 'ngssm-expression-tree-node-details',
  imports: [NgssmComponentDisplayDirective],
  templateUrl: './ngssm-expression-tree-node-details.component.html',
  styleUrls: ['./ngssm-expression-tree-node-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeNodeDetailsComponent {
  private readonly elementRef = inject(ElementRef);

  public readonly nodeId = input<string | null | undefined>();
  public readonly treeConfig = input<NgssmExpressionTreeConfig | null | undefined>();
  public readonly heightChanged = output<number>();

  public readonly componentAction = signal<NgssmComponentAction | undefined>(undefined);
  public readonly componentToDisplay = signal<Type<unknown> | undefined>(undefined);

  constructor() {
    effect(() => {
      const currentNodeId = this.nodeId();
      const currentConfig = this.treeConfig();

      if (!currentNodeId || !currentConfig) {
        return;
      }

      this.componentAction.set((c: unknown) => (c as NgssmExpressionTreeCustomComponent).setup(currentConfig.treeId, currentNodeId));
      this.componentToDisplay.set(currentConfig.nodeDetailComponent);
      setTimeout(() => {
        this.heightChanged.emit(this.elementRef?.nativeElement.getBoundingClientRect().height ?? 0);
      });
    });
  }
}
