import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  adminForm!: FormGroup;
  ngOnInit(): void {
    this.adminForm = new FormGroup({
      adminName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  onLogin() {

  }
}
