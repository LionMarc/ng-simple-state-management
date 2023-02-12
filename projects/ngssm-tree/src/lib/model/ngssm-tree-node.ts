import { DataStatus } from 'ngssm-remote-data';

export interface NgssmTreeNode {
  id: string;
  label: string;
  status: DataStatus;
  isExpanded?: boolean;
  level: number;

  // Used to display or not chevron icon
  isExpandable: boolean;

  // Used to select the icon to display according to the input configuration
  type: string;
}
