import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppService } from '../app.service';
import $ from 'jquery';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isCollapsed: boolean;

  constructor(private service: AppService) {
    this.isCollapsed = true;

  }
  ngOnInit(): void {


  }

  onLogout() {
    this.service.isUserLoggedIn$.next(false)
    localStorage.removeItem("user");
  }

  collapseNavMenu() {
    if (!this.isCollapsed) {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
