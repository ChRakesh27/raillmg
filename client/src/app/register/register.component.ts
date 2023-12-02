import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;


  // this.registerForm = new FormGroup({
  //   username: new FormControl(null, Validators.required),
  //   password: new FormControl(null, Validators.required),
  //   email: new FormControl(null, Validators.required),
  //   designation: new FormControl(null, Validators.required),
  //   department: new FormControl(null, Validators.required),
  //   mobile: new FormControl(null, Validators.required)
  // });
}
