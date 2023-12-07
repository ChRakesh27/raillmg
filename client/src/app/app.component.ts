import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';;
import { AppService } from './app.service';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { MachineRollComponent } from "./machine-roll/machine-roll.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { AddMachineRollComponent } from "./add-machine-roll/add-machine-roll.component";
import { ToastComponent } from "./toast/toast.component";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, NavbarComponent, LoginComponent, RegisterComponent, MachineRollComponent, SpinnerComponent, AddMachineRollComponent, ToastComponent]
})
export class AppComponent implements OnInit {
  title = 'client';
  isUserLoggedIn = false
  isLoading = false
  isLoggedIn: any;
  constructor(private service: AppService, private router: Router, @Inject(PLATFORM_ID) private platform: object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platform)) {
      this.isLoggedIn = localStorage.getItem('user')
    }
    this.service.isLoading$.subscribe(res => this.isLoading = res)

    this.service.isUserLoggedIn$.subscribe(res => {
      this.isUserLoggedIn = res
      this.navigateUser();
    })


    if (!!this.isLoggedIn) {
      this.service.userData = JSON.parse(this.isLoggedIn)
      this.service.isUserLoggedIn$.next(true)
    }
    // this.navigateUser()
  }

  private navigateUser() {

    if (this.isUserLoggedIn) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }

  }


}
