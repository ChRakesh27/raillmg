import { Component } from '@angular/core';
import { AppService } from '../app.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  login = true
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  constructor(private service: AppService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      designation: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      mobile: new FormControl(null, Validators.required)
    });
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });

  }
  onLogin(data: boolean) {
    this.login = data
    this.service.isUserLoggedIn = true
  }

}
