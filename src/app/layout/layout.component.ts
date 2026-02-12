import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserContextService } from '../core/services/user-context';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../services/theme.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { IconComponent } from '../../shared/icon/icon.component';
@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, CommonModule, RouterModule, IconComponent, BreadcrumbComponent, NgbDropdownModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  sidebarOpen = true;
  isMobile = false;
  merchantName: string | null = null;
  merchantLogo: string | null = null;
  merchantSubServices: any[] = [];
  token: string = '';
  searchQuery: string = '';
  constructor(public themeService: ThemeService, private userContextService: UserContextService, private router: Router) {

  }
  ngOnInit() {
    this.checkScreenSize(); // check on load
    this.merchantName = this.userContextService.merchantName;
    this.merchantLogo = this.userContextService.merchantLogo;

    // Example: get serviceInfo from userContextService (adjust as needed)

    const userData = this.userContextService.userData; // implement this method to return the user data object
    if (userData && userData.serviceInfo) {
      this.merchantSubServices = userData.serviceInfo;
      this.token = userData.token ?? '';
      console.log("Merchant Sub Services:", this.merchantSubServices);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize(); // check on resize
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width < 768; // adjust breakpoint as needed
    this.sidebarOpen = !this.isMobile; // CLOSE sidebar on mobile
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


  isMobileView(): boolean {
    return window.innerWidth <= 768;
  }

  // Header action methods
  viewProfile() {
    console.log('View Profile clicked');
    this.router.navigate(['/dashboard']);
  }

  settings() {
    console.log('Settings clicked');
    this.router.navigate(['/dashboard']);
  }

  helpCenter() {
    console.log('Help Center clicked');
    this.router.navigate(['/dashboard']);
  }

  logout() {
    console.log('Logout clicked');
    // Implement logout logic
    localStorage.removeItem('token');
    // Navigate to login page
  }
}
