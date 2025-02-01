import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngssmFileSize',
  standalone: true
})
export class NgssmFileSizePipe implements PipeTransform {
  private readonly units = ['bytes', 'KB', 'MB', 'GB'];

  public transform(value: unknown, precision = 2): string {
    let bytes = value as number;
    if (isNaN(bytes) || !isFinite(bytes)) {
      return '?';
    }

    let unit = 0;
    while (bytes >= 1024 && unit < this.units.length) {
      bytes /= 1024;
      unit++;
    }

    if (unit === 0) {
      return `${bytes} ${this.units[unit]}`;
    }

    return `${bytes.toFixed(+precision)} ${this.units[unit]}`;
  }
}
