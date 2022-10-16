export class NgssmAceEditorApi {
  private readonly markerIds: number[] = [];

  constructor(public aceEditor: any) {}

  public addRowsMarker(firstRow: number, lastRow: number, cssClass: string): void {
    const result = (window as any).ace.require('ace/range');
    const markerId = this.aceEditor.getSession().addMarker(new result.Range(firstRow, 0, lastRow, Infinity), cssClass, 'fullLine');
    this.markerIds.push(markerId);
  }

  public clearAllRowsMarkers(): void {
    this.markerIds.forEach((markerId) => this.aceEditor.getSession().removeMarker(markerId));
    this.markerIds.splice(0);
  }
}
