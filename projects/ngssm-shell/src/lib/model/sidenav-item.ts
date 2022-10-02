export interface SidenavItem {
  /** Label displayed in the {@link SideNavComponent} for the section or the link */
  label: string;

  /** Html code for the icon to display before the label */
  icon?: string;

  /** Router link associated to the item */
  route?: string;

  /** Angular component to display at the right of the label */
  component?: any;
}
