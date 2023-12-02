import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MachineRollComponent } from './machine-roll/machine-roll.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: "login", pathMatch: "full" },

    { path: 'machineRoll', component: MachineRollComponent },
];
