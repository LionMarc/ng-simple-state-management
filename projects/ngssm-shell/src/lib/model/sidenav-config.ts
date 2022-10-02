import { SidenavSection } from './sidenav-section';

/**
 * Configuration parameters of the {@link SideNavComponent} component.
 */
export interface SidenavConfig {
  /** Main title of the sidenav */
  title?: string;

  /** List of sections to be displayed. Each section is used to group a list of links. */
  sections?: SidenavSection[];
}
