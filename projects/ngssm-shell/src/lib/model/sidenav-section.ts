import { SidenavItem } from './sidenav-item';

export interface SidenavSection extends SidenavItem {
  /** List of links to be displayed for the current section */
  items?: SidenavItem[];
}
