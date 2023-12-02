import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';;
import { AppService } from './app.service';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, NavbarComponent, LoginComponent, RegisterComponent]
})
export class AppComponent implements OnInit {
  title = 'client';
  isUserLoggedIn = false


  constructor(private service: AppService, private router: Router) { }

  ngOnInit() {
    this.navigateUser()
    this.service.isUserLoggedIn$.subscribe(res => {
      this.isUserLoggedIn = res
      this.navigateUser();
    })
  }

  private navigateUser() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
