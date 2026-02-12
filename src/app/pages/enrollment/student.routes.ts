import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { PromotionComponent } from "./promotion/promotion.component";
import { TransferComponent } from "./transfer/transfer.component";
import { ExitsComponent } from "./exits/exits.component";

export const studentRoutes: Routes = [
  {
    path: 'enrollment',
    component: ProfileComponent,
    data: {
      title: 'Student Profile',
      breadcrumb: 'Profile',
      icon: 'user-plus'
    }
  },
  {
    path: 'registration',
    component: PromotionComponent,
    data: {
      title: 'Enrollment',
      breadcrumb: 'Enrollment',
      icon: 'trending-up'
    }
  },
  {
    path: 'transfer',
    component: TransferComponent,
    data: {
      title: 'Transfer',
      breadcrumb: 'Transfer',
      icon: 'move'
    }
  },
  {
    path: 'exits',
    component: ExitsComponent,
    data: {
      title: 'Exits',
      breadcrumb: 'Exits',
      icon: 'log-out'
    }
  }
]
