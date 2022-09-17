export interface Schema {
  /** Wheter eslint and prettier must be installed and configured */
  addEslint: boolean;

  /** Whether @angular/material and @angular/flex-layout must be installed and configured */
  addMaterial: boolean;

  /** Whether @fortawesome/fontawesome-free must be installed and configured */
  addFontawesome: boolean;
}
