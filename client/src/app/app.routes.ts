import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MachineRollComponent } from './machine-roll/machine-roll.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'machineRoll', component: MachineRollComponent },
];
