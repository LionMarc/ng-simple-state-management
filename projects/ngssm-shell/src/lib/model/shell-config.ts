import { Type } from '@angular/core';
import { SidenavConfig } from './sidenav-config';

/**
 * Configuration parameters of {@link ShellComponent} component.
 */
export interface ShellConfig {
  /** Path of the logo image to display in the header bar if any */
  logo?: string;

  /** The title to be displayed in the header bar. */
  applicationTitle?: string;

  /** Configuration parameters of sidenav associated to the shell. */
  sidenavConfig?: SidenavConfig;

  /** If true, display the footer MatToolbar */
  displayFooter?: boolean;

  /**
   * If true, the button used to display the list of notifications is displayed.
   * For now, this is useless as nothing is done about the notifications
   */
  displayFooterNotificationsButton?: boolean;

  /** List of components or html to display in the footer */
  footerComponents?: (string | Type<unknown>)[];
}
