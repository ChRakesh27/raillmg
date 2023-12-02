import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppService } from '../app.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private service: AppService) {

  }

  onLogout() {
    this.service.isUserLoggedIn$.next(false)
  }
}
