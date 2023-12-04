import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';;
import { AppService } from './app.service';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { MachineRollComponent } from "./machine-roll/machine-roll.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { AddMachineRollComponent } from "./add-machine-roll/add-machine-roll.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, NavbarComponent, LoginComponent, RegisterComponent, MachineRollComponent, SpinnerComponent, AddMachineRollComponent]
})
export class AppComponent implements OnInit {
  title = 'client';
  isUserLoggedIn = false
  isLoading = false

  constructor(private service: AppService, private router: Router) { }

  ngOnInit() {
    this.navigateUser()
    this.service.isUserLoggedIn$.subscribe(res => {
      this.isUserLoggedIn = res
      this.navigateUser();
    })
    // this.service.isLoading$.subscribe(res => this.isLoading = res)
  }

  private navigateUser() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }


}
