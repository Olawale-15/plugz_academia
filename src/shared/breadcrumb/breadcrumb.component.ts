import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET, RouterModule } from '@angular/router';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { filter, map } from 'rxjs';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: any = {};
  public title: string | undefined;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe((route: any) => {
        const snapshot = route.snapshot;
        this.title = snapshot.data['title'] ?? '';
        const parent = route.parent?.snapshot.data['breadcrumb'] ?? '';
        const child = snapshot.data['breadcrumb'] ?? '';
        const icon = snapshot.data['icon'] ?? '';
        this.breadcrumbs = {
          parentBreadcrumb: parent,
          childBreadcrumb: child,
          icon: icon,
        };
      });
  }
  get showChildBreadcrumb(): boolean {
    const p = this.breadcrumbs.parentBreadcrumb?.toLowerCase()?.trim();
    const c = this.breadcrumbs.childBreadcrumb?.toLowerCase()?.trim();
    return c && c !== p;
  }



  ngOnInit(): void { }
}
