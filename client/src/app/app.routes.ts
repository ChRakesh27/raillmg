import { Routes } from '@angular/router';
import { HomePageComponent } from './lmg/home-page/home-page.component';
import { MachineRollComponent } from './lmg/output/machine-roll/machine-roll.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AddMachineRollComponent } from './lmg/demand/add-machine-roll/add-machine-roll.component';
import { authGuard } from './shared/service/auth-guard.service';
import { LmgComponent } from './lmg/lmg.component';

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
                    }
                ]
            },
            {
                path: "output",
                children: [
                    {
                        path: "rolling",
                        component: MachineRollComponent
                    }
                ]
            }
        ]
    },

    {
        path: 'login',
        component: LoginComponent,
        // canActivate: [authGuardFn],
    },
    {
        path: 'register',
        component: RegisterComponent,
        // canActivate: [authGuardFn],
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
];
