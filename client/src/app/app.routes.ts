import { Routes } from '@angular/router';
import { HomePageComponent } from './lmg/home-page/home-page.component';
import { MachineRollComponent } from './lmg/report/machine-roll/machine-roll.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AddMachineRollComponent } from './lmg/demand/add-machine-roll/add-machine-roll.component';
import { authGuard } from './shared/service/auth-guard.service';
import { LmgComponent } from './lmg/lmg.component';
import { AdminComponent } from './admin/admin-login/admin.component';
import { MachineNonRollComponent } from './lmg/demand/machine-non-roll/machine-non-roll.component';
import { MaintenanceRollComponent } from './lmg/demand/maintenance-roll/maintenance-roll.component';
import { MaintenanceNonRollComponent } from './lmg/demand/maintenance-non-roll/maintenance-non-roll.component';
import { MachineUploadFileComponent } from './lmg/demand/machine-upload-file/machine-upload-file.component';
import { EditMachineRollComponent } from './lmg/edit/machine-roll/edit-machine-roll.component';
import { RollingBlockComponent } from './lmg/verify-demand/rolling-block/rolling-block.component';
import { NonRollingBlockComponent } from './lmg/verify-demand/non-rolling-block/non-rolling-block.component';

export const routes: Routes = [
    {
        path: 'lmg',
        component: LmgComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: HomePageComponent
            },
            {
                path: "demand",
                children: [
                    {
                        path: "machine-roll",
                        component: AddMachineRollComponent
                    },
                    {
                        path: "machine-non-roll",
                        component: MachineNonRollComponent
                    },
                    {
                        path: "maintenance-roll",
                        component: MaintenanceRollComponent
                    },
                    {
                        path: "maintenance-non-roll",
                        component: MaintenanceNonRollComponent
                    },
                    {
                        path: "machine-upload-file",
                        component: MachineUploadFileComponent
                    },

                ]
            },
            {
                path: "verify-demand",
                children: [
                    {
                        path: "rolling-block",
                        component: RollingBlockComponent
                    },
                    {
                        path: "non-rolling-block",
                        component: NonRollingBlockComponent
                    }
                ]
            },
            {
                path: "report",
                children: [
                    {
                        path: "rolling",
                        component: MachineRollComponent
                    }
                ]
            },
            {
                path: "edit",
                children: [
                    {
                        path: "machine-roll",
                        component: EditMachineRollComponent
                    }
                ]
            }
        ]
    },

    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'admin',
        component: AdminComponent,
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
];
