import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { RolesComponent } from "./roles/roles.component";

export const staffRoutes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        data: {
            title: 'Staff Profile',
            breadcrumb: 'Staff Profile',
            icon: 'user'
        }
    },
    {
        path: 'roles',
        component: RolesComponent,
        data: {
            title: 'Staff Roles',
            breadcrumb: 'Staff Roles',
            icon: 'shield'
        }
    }
]
