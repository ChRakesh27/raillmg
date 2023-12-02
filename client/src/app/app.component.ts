import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from "./user/user.component";
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, NavbarComponent, UserComponent]
})
export class AppComponent implements OnInit {
  title = 'client';
  isUserLoggedIn = false


  constructor(private service: AppService) { }
  ngOnInit() {
    this.service.isUserLoggedIn$.subscribe(res => {
      this.isUserLoggedIn = res
    })
  }
}
