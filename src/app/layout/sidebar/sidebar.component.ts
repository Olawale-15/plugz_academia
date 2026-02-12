import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { TokenService } from '../../../services/token.service';
import { MenuItem } from './menu.model';
import { UserContextService } from '../../core/services/user-context';
import { IconComponent } from '../../../shared/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    public themeService: ThemeService,
    private tokenService: TokenService,
    private userContext: UserContextService,
  ) {}
  @Input() sidebarOpen = true;
  @Output() toggle = new EventEmitter<void>();
  ngOnInit() {
    this.setResponsiveSidebar();
    window.addEventListener('resize', () => this.setResponsiveSidebar());
  }

  setResponsiveSidebar() {
    this.sidebarOpen = window.innerWidth >= 768;
  }
  isMobileView(): boolean {
    return window.innerWidth < 768;
  }

  onItemHover(item: any, isHover: boolean) {
    item._hover = isHover;
  }

  // sidebar.component.ts
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'home',
      link: '/dashboard',
    },
    {
      label: 'Administration',
      icon: 'users',
      open: false,
      subItems: [
        { label: 'Classes', link: '/administration/classes' },
        { label: 'Subjects', link: '/administration/subjects' },
        { label: 'Grading System', link: '/administration/grading-system' },
      ],
    },

    {
      label: 'Student',
      icon: 'user-plus',
      open: false,
      subItems: [
        { label: 'Profile', link: '/student/enrollment' },
        { label: 'Enrollment', link: '/student/registration' },
        { label: 'Transfer', link: '/student/transfer' },
        { label: 'Exits', link: '/student/exits' },
      ],
    },
    {
      label: 'Academics',
      icon: 'edit-3',
      open: false,
      subItems: [
        { label: 'Assessment Type', link: '/academics/assessment' },
        { label: 'Result Computation', link: '/academics/resultcomputation' },
        { label: 'Mark Entry', link: '/academics/markentry' },
        { label: 'Report Card', link: '/academics/reportcard' },
      ],
    },
    {
      label: 'Staff',
      icon: 'user-check',
      open: false,
      subItems: [
        { label: 'Profile', link: '/staff/profile' },
        { label: 'Roles', link: '/staff/roles' },
      ],
    },

    {
      label: 'Settings',
      icon: 'settings',
      open: false,

      subItems: [
        { label: 'Dynamic Fields', link: '/settings/dynamic-fields' },
        {
          label: 'Report Card Template',
          link: '/settings/report-card-template',
        },
        { label: 'School Profile', link: '/settings/school-profile' },
      ],
    },
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    if (!this.sidebarOpen) {
      this.menuItems.forEach((item) => (item.open = false));
    }
  }
  logout(): void {
    // Clear tokens
    this.tokenService.clear();

    // Clear user context
    this.userContext.clearUser();

    // Optionally clear sessionStorage completely if you want:
    // sessionStorage.clear();

    // Redirect to login
    this.router.navigate(['/login']);
  }
  toggleSubmenu(item: MenuItem) {
    if (!this.sidebarOpen) return; // Flyout on hover when collapsed

    // Close all other open submenus first
    this.menuItems.forEach((menuItem) => {
      if (menuItem !== item && menuItem.subItems?.length) {
        menuItem.open = false;
      }
    });

    // Toggle the clicked one
    item.open = !item.open;
  }

  isActive(item: MenuItem): boolean {
    // If it's a menu with a link, check route match
    if (item.link) {
      return window.location.pathname === item.link;
    }

    // If menu has submenu, check if any subItem matches current route
    if (item.subItems?.length) {
      return item.subItems.some((sub) => window.location.pathname === sub.link);
    }

    return false;
  }
}
