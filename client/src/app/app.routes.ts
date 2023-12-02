import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MachineRollComponent } from './machine-roll/machine-roll.component';

export const routes: Routes = [
    { path: 'home', component: UserComponent },
    { path: '', component: HomePageComponent },
    { path: 'machineRoll', component: MachineRollComponent },
];
