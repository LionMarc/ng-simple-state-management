import { NavigationItem } from './navigation-item';

export interface NavigationSection extends NavigationItem {
  items: NavigationItem[];
}
