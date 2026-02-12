export interface MenuItem {
  label: string;
  icon?: string;
  link?: string;
  open?: boolean;
  isActive?: boolean;
  subItems?: MenuItem[];
}
