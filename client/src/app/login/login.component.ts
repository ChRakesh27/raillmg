import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup;
  constructor(private service: AppService) { }

  ngOnInit(): void {

    this.userForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });

  }
  onLogin() {
    if (this.userForm.valid) {
      this.service.loginUser(this.userForm.value.username, this.userForm.value.password).subscribe(data => {
        this.service.setIsUserLoggedIn(data)
        this.service.isUserLoggedIn$.next(true)
      })
    }
  }
}
