import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppService } from '../../app.service';
import { localStorageService } from '../service/local-storage.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    private ls: localStorageService,
    private router: Router
  ) { }

  onLogout() {
    this.ls.removeUser()
    this.router.navigate(['/login'])
  }
}
