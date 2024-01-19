import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AppService } from '../app.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../shared/toast/toast.service';
import { localStorageService } from '../shared/service/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup;
  constructor(
    private service: AppService,
    private ls: localStorageService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
  onLogin() {
    if (this.userForm.valid) {
      this.service.isLoading$.next(true);
      this.service
        .loginUser(this.userForm.value.username, this.userForm.value.password)
        .subscribe({
          next: (data) => {
            this.ls.setUser(data);
            this.router.navigate(['/lmg']);
          },
          error: (err) => {
            this.service.isLoading$.next(false);
            this.toastService.showDanger('failed to login');
          },
        });
    }
  }
}
