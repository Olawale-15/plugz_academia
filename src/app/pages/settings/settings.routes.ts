import { Routes } from "@angular/router";
import { DynamicfieldsComponent } from "./dynamicfields/dynamicfields.component";
import { ReportcardtemplateComponent } from "./reportcardtemplate/reportcardtemplate.component";
import { SchoolprofileComponent } from "./schoolprofile/schoolprofile.component";

export const settingsRoutes: Routes = [
    {
        path: 'dynamic-fields',
        component: DynamicfieldsComponent,
        data: {
            title: 'Dynamic Fields',
            breadcrumb: 'Dynamic Fields',
            icon: 'settings'
        }
    },
    {
        path: 'report-card-template',
        component: ReportcardtemplateComponent,
        data: {
            title: 'Report Card Template',
            breadcrumb: 'Report Card Template',
            icon: 'file-text'
        }
    },
    {
        path: 'school-profile',
        component: SchoolprofileComponent,
        data: {
            title: 'School Profile',
            breadcrumb: 'School Profile',
            icon: 'home'
        }
    }
]
