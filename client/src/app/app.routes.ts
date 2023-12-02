import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
    { path: 'home', component: UserComponent },
    { path: '', component: HomePageComponent }
];
