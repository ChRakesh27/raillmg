import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ToastComponent } from './shared/toast/toast.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    SpinnerComponent,
    ToastComponent,
    NavbarComponent,
  ],
})
export class AppComponent implements OnInit {
  isLoading = false;
  constructor(private service: AppService) {}

  ngOnInit() {
    this.service.isLoading$.subscribe((res) => (this.isLoading = res));
  }
}
